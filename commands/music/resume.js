const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const { check } = require('../../util/check.js');

module.exports = class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			aliases: ['r'],
			group: 'music',
			memberName: 'resume',
			description: 'Resumes music playback',
			guildOnly: true,
		});
	}

	run(message) {
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		else if (!message.guild.musicData.isPaused) {
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.resumeNotPausedTitle)
				.setDescription(EmbedData.resumeNotPausedDesc)
				.setColor(EmbedData.failureColor);
			return message.say(embed);
		}
		const time = message.guild.musicData.musicDispatcher.streamTime - message.guild.musicData.musicDispatcher.pausedTime;
		const minsPlayed = Math.floor(time / 60000);
		const secsPlayed = ((time % 60000) / 1000).toFixed(0);
		const timePlayed = `${minsPlayed}:${secsPlayed < 10 ? '0' : ''}${secsPlayed}`;
		message.guild.musicData.isPaused = false;
		message.guild.musicData.musicDispatcher.resume();
		const embed = new MessageEmbed()
			.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
			.setTitle(EmbedData.pauseResumeTitle)
			.setDescription(message.guild.musicData.nowPlaying.title)
			.setFooter(`Duration ${timePlayed}/${message.guild.musicData.nowPlaying.duration}`)
			.setColor(EmbedData.successColor);
		return message.say(embed);

	}
};