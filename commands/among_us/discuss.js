const { Command } = require('discord.js-commando');

module.exports = class DiscussCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'discuss',
			aliases: ['d'],
			group: 'among_us',
			memberName: 'discuss',
			description: 'Mutes everyone except alive players. Use during discussion time',
			guildOnly: true,
		});
	}

	run(message) {
		const channel = message.guild.channels.cache.find(chnl => chnl.name == 'Voice 1');
		channel.members.each(async player => {
			if (player.voice.serverMute) {
				try {
					await player.voice.setMute(false);
				}
				catch (error) {
					console.error;
				}
			}
			else {
				try {
					await player.voice.setMute(true);
				}
				catch (error) {
					console.error;
				}
			}
		});
		return;
	}
};