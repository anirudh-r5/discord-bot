const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const { check } = require('../../util/check.js');

module.exports = class RepeatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'repeat',
			aliases: ['l', 'repeat', 'loop'],
			group: 'music',
			memberName: 'repeat',
			description: 'Repeats the track or queue',
			args: [
				{
					key: 'text',
					prompt: 'Enter `t` to repeat the track or `q` to repeat the queue',
					type: 'string',
					default: '',
				},
			],
			guildOnly: true,
		});
	}

	run(message, { text }) {
		const embed = new MessageEmbed().setAuthor(EmbedData.botName, this.client.user.avatarURL('png'));
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		else if (!text) {
			if (message.guild.musicData.loopTrack || message.guild.musicData.loopQueue) {
				message.guild.musicData.loopTrack = false;
				message.guild.musicData.loopQueue = false;
				embed.setTitle(EmbedData.repeatDisabled)
					.setColor(EmbedData.failureColor);
			}
			else {
				embed.setTitle(EmbedData.repeatErrorTitle)
					.setColor(EmbedData.failureColor)
					.setDescription(EmbedData.repeatErrorDesc);
			}
		}
		else if (text == 't') {
			embed.setDescription(EmbedData.playRepeatQueueDesc);
			if (message.guild.musicData.loopTrack) {
				message.guild.musicData.loopTrack = false;
				embed.setTitle(EmbedData.repeatTrackDisabledTitle)
					.setColor(EmbedData.failureColor);
			}
			else {
				message.guild.musicData.loopTrack = true;
				embed.setTitle(EmbedData.repeatTrackEnabledTitle)
					.setColor(EmbedData.successColor);
			}
		}
		else if (text == 'q') {
			embed.setDescription(EmbedData.playRepeatQueueDesc);
			if (message.guild.musicData.loopQueue) {
				message.guild.musicData.loopQueue = false;
				embed.setTitle(EmbedData.repeatQueueDisabledTitle)
					.setColor(EmbedData.failureColor);
			}
			else {
				message.guild.musicData.loopQueue = true;
				embed.setTitle(EmbedData.repeatQueueEnabledTitle)
					.setColor(EmbedData.successColor);
			}
		}
		else {
			embed.setTitle(EmbedData.repeatErrorTitle)
				.setDescription(EmbedData.repeatErrorDesc)
				.setColor(EmbedData.failureColor);
		}
		return message.say(embed);
	}
};