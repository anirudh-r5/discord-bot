const { Command } = require('discord.js-commando');

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meow',
			aliases: ['kitty-cat'],
			group: 'basic',
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
			throttling: {
				usages: 2,
				duration: 5,
			},
			guildOnly: false,
		});
	}

	run(message) {
		return message.say('Meow UwU');
	}
};