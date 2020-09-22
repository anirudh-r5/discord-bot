const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
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
			const minsPlayed = Math.floor(message.guild.musicData.musicDispatcher.streamTime / 60000);
			const secsPlayed = ((message.guild.musicData.musicDispatcher.streamTime % 60000) / 1000).toFixed(0);
			const timePlayed = `${minsPlayed}:${secsPlayed < 10 ? '0' : ''}${secsPlayed}`;
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.playResumeTitle)
				.setDescription(message.guild.musicData.nowPlaying.title)
				.setFooter(`Duration ${timePlayed}/${message.guild.musicData.nowPlaying.duration}`)
				.setColor(EmbedData.successColor);
			message.guild.musicData.musicDispatcher.resume();
			message.guild.musicData.isPaused = false;
			return message.say(embed);
		}
		else if (!query && !message.guild.musicData.isPaused) {
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.playNoQueryTitle)
				.setDescription(EmbedData.playNoQueryDesc)
				.setColor(EmbedData.failureColor);
			return message.say(embed);
		}
		else if (query) {
			const channel = message.member.voice.channel;
			if (message.guild.musicData.isPaused) {
				message.guild.musicData.musicDispatcher.resume();
				message.guild.musicData.isPaused = false;
				const embed = new MessageEmbed()
					.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
					.setTitle(EmbedData.playResumeQueueTitle)
					.setFooter(EmbedData.playResumeQueueFooter)
					.setColor(EmbedData.successColor);
				message.say(embed);
			}
			else if (!channel) {
				const embed = new MessageEmbed()
					.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
					.setTitle(EmbedData.playNoVoiceChannelTitle)
					.setDescription(EmbedData.playNoVoiceChannelDesc)
					.setColor(EmbedData.failureColor);
				return message.say(embed);
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
		const client = message.client;
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
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, client.user.avatarURL('png'))
				.setTitle(EmbedData.playMusicQueued)
				.setDescription(music.items[0].title)
				.setURL(music.items[0].link)
				.setThumbnail(music.items[0].thumbnail)
				.setFooter(`Track No.: ${message.guild.musicData.queue.length + 1}`)
				.setColor(EmbedData.successColor);
			return message.say(embed);
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
				const embed = new MessageEmbed()
					.setAuthor(EmbedData.botName, client.user.avatarURL('png'))
					.setTitle(EmbedData.playNowPlayingTitle)
					.setDescription(now.title)
					.setURL(now.link)
					.setThumbnail(now.thumbnail)
					.addField('By:', now.author.name, true)
					.setFooter(`Duration: ${now.duration}\tViews: ${now.views}`)
					.setColor(EmbedData.successColor);
				message.say(embed);
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
					message.guild.musicData.channel.leave();
					message.guild.musicData.isPlaying = false;
					message.guild.musicData.nowPlaying = null;
					message.guild.musicData.musicDispatcher = null;
					message.guild.musicData.channel = null;
					const embed = new MessageEmbed()
						.setAuthor(EmbedData.botName, client.user.avatarURL('png'))
						.setTitle(EmbedData.playQueueFinishedTitle)
						.setDescription(EmbedData.playQueueFinishedDesc)
						.setColor(EmbedData.failureColor);
					return message.say(embed);
				}
			});
		}
		catch (error) {
			console.error(error);
		}
	}
};