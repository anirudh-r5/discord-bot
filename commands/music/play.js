const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['p'],
			group: 'music',
			memberName: 'play',
			description: 'Searches and plays the given song from YouTube',
			args: [
				{
					key: 'query',
					prompt: 'Enter song to play',
					type: 'string',
					default: '',
				},
			],
			guildOnly: true,
		});
	}

	async run(message, { query }) {
		if (!query && message.guild.musicData.isPaused) {
			message.guild.musicData.musicDispatcher.resume();
			message.guild.musicData.isPaused = false;
			return message.say('Playback resumed!');
		}
		else if (!query && !message.guild.musicData.isPaused) {
			return message.say('Enter a song to be played');
		}
		else if (query) {
			const channel = message.member.voice.channel;
			if(message.guild.musicData.isPaused) {
				message.guild.musicData.musicDispatcher.resume();
				message.guild.musicData.isPaused = false;
				message.say('Queuing up your song & resuming playback!');
			}
			else if (!channel) {
				return message.say('Join a voice channel first!');
			}
			try {
				const music = await ytsr(query, { limit: 1 });
				PlayCommand.playMusic(music, message);
			}
			catch (error) {
				console.error(error);
			}
			return;
		}
	}

	static async playMusic(music, message) {
		let stream = null;
		let now = null;
		if (!message.guild.musicData.isPlaying) {
			if (message.guild.musicData.queue.length == 0) {
				stream = ytdl(music.items[0].link, {
					filter: 'audioonly',
				});
				now = music.items[0];
			}
			else if (message.guild.musicData.queue.length > 0) {
				stream = ytdl(message.guild.musicData.queue[0].link, {
					filter: 'audioonly',
				});
				message.guild.musicData.queue.shift();
				now = message.guild.musicData.queue[0];
			}
		}
		else if (music.items) {
			message.guild.musicData.queue.push(music.items[0]);
			return message.say('Music queued');
		}
		else {
			stream = ytdl(music.link, {
				filter: 'audioonly',
			});
			now = music;
		}
		try {
			const conn = await message.member.voice.channel.join();
			const player = conn.play(stream);
			player.on('start', () => {
				message.say('Started playing');
				message.guild.musicData.isPlaying = true;
				message.guild.musicData.isPaused = false;
				message.guild.musicData.channel = message.member.voice.channel;
				message.guild.musicData.musicDispatcher = player;
				message.guild.musicData.nowPlaying = now;
			});
			player.on('finish', () => {
				if (message.guild.musicData.queue.length > 0) {
					const next = message.guild.musicData.queue[0];
					message.guild.musicData.queue.shift();
					PlayCommand.playMusic(next, message);
				}
				else {
					message.guild.musicData.isPlaying = false;
					message.guild.musicData.nowPlaying = null;
					message.guild.musicData.musicDispatcher = null;
					message.guild.musicData.channel = null;
					return message.say('Queue empty. Stopped playing');
				}
			});
		}
		catch (error) {
			console.error(error);
		}
	}
};