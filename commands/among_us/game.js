const { Command } = require('discord.js-commando');

module.exports = class GameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'game',
			aliases: ['game'],
			group: 'among_us',
			memberName: 'game',
			description: 'Mutes everyone except ghosts. Use during a game',
			guildOnly: true,
		});
	}

	run(message) {
		const channel = message.guild.channels.cache.find(chnl => chnl.name == 'Voice 1');
		channel.members.each(async player => {
			if(!player.voice.serverMute) {
				try {
					await player.voice.setMute(true);
					console.log(`${player} muted`);
				}
				catch (error) {
					console.error;
				}
			}
			else {
				try {
					await player.voice.setMute(false);
					console.log(`${player} unmuted`);
				}
				catch (error) {
					console.error;
				}
			}
		});
		return message.say('Game resumed!');
	}
};