const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const { check } = require('../../util/check.js');

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			aliases: ['pause'],
			group: 'music',
			memberName: 'pause',
			description: 'Pauses the currently playing music',
			guildOnly: true,
		});
	}

	run(message) {
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		if (!message.guild.musicData.isPlaying) {
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.musicNotPlayingTitle)
				.setDescription(EmbedData.musicNotPlayingDesc)
				.setColor(EmbedData.failureColor);
			return message.say(embed);
		}
		const time = message.guild.musicData.musicDispatcher.streamTime - message.guild.musicData.musicDispatcher.pausedTime;
		const minsPlayed = Math.floor(time / 60000);
		const secsPlayed = ((time % 60000) / 1000).toFixed(0);
		const timePlayed = `${minsPlayed}:${secsPlayed < 10 ? '0' : ''}${secsPlayed}`;
		if (message.guild.musicData.isPaused) {
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
		else {
			message.guild.musicData.isPaused = true;
			message.guild.musicData.musicDispatcher.pause(true);
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.pausePauseTitle)
				.setDescription(message.guild.musicData.nowPlaying.title)
				.setFooter(`Duration ${timePlayed}/${message.guild.musicData.nowPlaying.duration}`)
				.setColor(EmbedData.successColor);
			return message.say(embed);
		}
	}
};