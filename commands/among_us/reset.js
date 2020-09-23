const { Command } = require('discord.js-commando');

module.exports = class ResetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reset',
			aliases: [],
			group: 'among_us',
			memberName: 'reset',
			description: 'Adds all the players back to the main channel.\nUse when starting a new game/after a game is over',
			guildOnly: true,
		});
	}

	run(message) {
		const channel = message.guild.channels.cache.find(chnl => chnl.name == 'Voice 1');
		channel.members.each(async player => {
			try {
				await player.voice.setMute(false);
				console.log(`${player} unmuted`);
			}
			catch(error) {
				console.error;
			}
		});
		return message.say('Game Reset!');
	}
};