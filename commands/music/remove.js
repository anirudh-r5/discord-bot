const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const { check } = require('../../util/check.js');

module.exports = class RemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove',
			aliases: ['delete'],
			group: 'music',
			memberName: 'remove',
			description: 'Command Description',
			args: [
				{
					key: 'track',
					prompt: 'Enter track no. to be deleted',
					type: 'integer',
				},
			],
			guildOnly: true,
		});
	}

	run(message, { track }) {
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		if (track > message.guild.musicData.queue.length || track <= 0) {
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.nextInvalidTitle)
				.setDescription(EmbedData.nextInvalidDesc)
				.setColor(EmbedData.failureColor);
			return message.say(embed);
		}
		else {
			const del = message.guild.musicData.queue.splice(track - 1, 1);
			message.guild.musicData.queue2.splice(track, 1);
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.removeTrackTitle)
				.setDescription(del.title)
				.setColor(EmbedData.successColor);
			return message.say(embed);
		}
	}
};