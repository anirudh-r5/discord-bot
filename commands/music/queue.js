const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['q'],
			group: 'music',
			memberName: 'queue',
			description: 'Displays the current music queue',
			guildOnly: true,
			args: [{
				key: 'number',
				prompt: 'Enter number of songs to view in the queue. (upto 25)',
				type: 'integer',
				default: 5,
				validate: number => number < 26,
			}],
		});
	}

	run(message, { number }) {
		const embed = new MessageEmbed()
			.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
			.setTitle(EmbedData.queueTitle)
			.setColor(EmbedData.successColor);
		const queue = message.guild.musicData.queue;
		if (number > message.guild.musicData.queue.length) {
			number = message.guild.musicData.queue.length;
		}
		for(let i = 0; i < number; i++) {
			embed.addField(`${i + 1}. ${queue[i].title}`, `Duration: ${queue[i].duration}`, false);
		}
		return message.say(embed);
	}
};