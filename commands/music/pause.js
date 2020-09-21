const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			aliases: ['pause'],
			group: 'music',
			memberName: 'pause',
			description: 'Pauses the currently playing music',
			guildOnly: true,
		});
	}

	run(message) {
		if (message.guild.musicData.isPaused) {
			message.guild.musicData.isPaused = false;
			message.guild.musicData.musicDispatcher.resume();
			return message.say('Playback resumed!');
		}
		else {
			message.guild.musicData.isPaused = true;
			message.guild.musicData.musicDispatcher.pause(true);
			return message.say('Playback paused!');
		}

	}
};