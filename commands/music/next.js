const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const PlayCommand = require('./play.js');
const { check } = require('../../util/check.js');

module.exports = class NextCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'next',
			aliases: ['n', 'skip'],
			group: 'music',
			memberName: 'next',
			description: 'Skips to the next track or to whichever track number is specified',
			args: [
				{
					key: 'number',
					prompt: 'Enter track number to skip to',
					type: 'integer',
					default: '',
				},
			],
			guildOnly: true,
		});
	}

	run(message, { number }) {
		let embed = null;
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		else if (!number) {
			if (message.guild.musicData.queue.length == 0 && message.guild.musicData.loopQueue) {
				message.guild.musicData.queue = message.guild.musicData.queue2.slice();
			}
			if (message.guild.musicData.queue[0]) {
				message.guild.musicData.loopTrack = false;
				const next = message.guild.musicData.queue[0];
				message.guild.musicData.queue.shift();
				embed = new MessageEmbed()
					.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
					.setTitle(EmbedData.nextTitle)
					.setColor(EmbedData.successColor);
				message.say(embed);
				PlayCommand.playMusic(next, message);
			}
		}
		else if (number <= 0 || number > message.guild.musicData.queue.length) {
			embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.nextInvalidTitle)
				.setDescription(EmbedData.nextInvalidDesc)
				.setColor(EmbedData.failureColor);
			return message.say(embed);
		}
		else if (message.guild.musicData.queue[number - 1]) {
			const next = message.guild.musicData.queue[number - 1];
			message.guild.musicData.queue.splice(0, number);
			embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(`${EmbedData.nextNumTitle}${number}...`)
				.setColor(EmbedData.successColor);
			message.say(embed);
			PlayCommand.playMusic(next, message);
			return;
		}
		if (!embed) {
			embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.nextInvalidTitle)
				.setDescription(EmbedData.nextInvalidDesc)
				.setColor(EmbedData.failureColor);
			return message.say(embed);
		}
		return;
	}
};