const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const { arrayShuffle } = require('../../util/arrayShuffle.js');

module.exports = class ShuffleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shuffle',
			aliases: ['random'],
			group: 'music',
			memberName: 'shuffle',
			description: 'Shuffle the queue',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	run(message) {
		message.guild.musicData.queue2 = arrayShuffle(message.guild.musicData.queue2);
		message.guild.musicData.queue = arrayShuffle(message.guild.musicData.queue);
		const embed = new MessageEmbed()
			.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
			.setTitle(EmbedData.removeTrackTitle);
		return message.say(embed);
	}
};