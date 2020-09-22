const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');

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
		const minsPlayed = Math.floor(message.guild.musicData.musicDispatcher.streamTime / 60000);
		const secsPlayed = ((message.guild.musicData.musicDispatcher.streamTime % 60000) / 1000).toFixed(0);
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