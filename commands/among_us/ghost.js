const { Command } = require('discord.js-commando');

module.exports = class GhostCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ghost',
			aliases: ['kill', 'k', 'g'],
			group: 'among_us',
			memberName: 'ghost',
			description: 'Removes a player from the alive players\' voice chat and adds him to a seperate channel',
			args: [{
				key: 'player',
				prompt: 'Enter the dead/kicked out player\'s name',
				type: 'member',
			}],
			guildOnly: true,
		});
	}

	async run(message, { player }) {
		if (!player.voice.channel) {
			return message.say(`Player: ${player} was not in voice`);
		}
		else {
			try {
				await player.voice.setMute(true);
				console.log(`${player} muted`);
				const ghosts = message.guild.roles.cache.find(role => role.name == 'ghosts');
				await player.roles.add(ghosts);
				await message.say(`Player: ${player} was muted`);
			}
			catch (error) {
				console.error;
			}
		}
		return;
	}

};