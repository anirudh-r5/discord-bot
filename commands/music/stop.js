const { Command } = require('discord.js-commando');

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['s'],
			group: 'music',
			memberName: 'stop',
			description: 'Stops music playback, clears queue and exits voice channel',
			guildOnly: true,
		});
	}

	run(message) {
		message.guild.musicData.channel.leave();
		message.guild.musicData.isPlaying = false;
		message.guild.musicData.isPaused = false;
		message.guild.musicData.channel = null;
		message.guild.musicData.musicDispatcher = null;
		message.guild.musicData.nowPlaying = null;
		message.guild.musicData.queue = [];
		return message.say('Music playback fully stopped!');
	}
};