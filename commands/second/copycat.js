const { Command } = require('discord.js-commando');

module.exports = class CopycatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'copycat',
			aliases: ['parrot', 'copy'],
			group: 'second',
			memberName: 'say',
			description: 'Replies with the text you provide.',
			args: [
				{
					key: 'text',
					prompt: 'Type anything you want CopyCat to say\nUsage: !copycat <stuff to say>',
					type: 'string',
				},
			],
		});
	}

	run(message, { text }) {
		return message.reply(text);
	}
};