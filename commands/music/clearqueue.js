const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const { check } = require('../../util/check.js');

module.exports = class ClearqueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clearqueue',
			aliases: ['cq', 'clear'],
			group: 'music',
			memberName: 'clearqueue',
			description: 'Clears the playing queue',
			guildOnly: true,
		});
	}

	run(message) {
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		message.guild.musicData.queue = [];
		message.guild.musicData.queue2 = [];
		message.guild.musicData.loopQueue = false;
		const embed = new MessageEmbed()
			.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
			.setTitle(EmbedData.clearQueue);
		return message.say(embed);
	}
};