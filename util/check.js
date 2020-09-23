const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../config.json');

module.exports = class Check {
	static check(message, client) {
		if (!message.member.voice.channel) {
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, client.user.avatarURL('png'))
				.setTitle(EmbedData.musicNoVoiceChannelTitle)
				.setDescription(EmbedData.musicNoVoiceChannelDesc)
				.setColor(EmbedData.failureColor);
			return embed;
		}
		else if (!message.guild.musicData.isPlaying) {
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, client.user.avatarURL('png'))
				.setTitle(EmbedData.musicNotPlayingTitle)
				.setDescription(EmbedData.musicNotPlayingDesc)
				.setColor(EmbedData.failureColor);
			return embed;
		}
		else if (message.member.voice.channel != message.guild.musicData.channel) {
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, client.user.avatarURL('png'))
				.setTitle(EmbedData.musicWrongVoiceChannelTitle)
				.setDescription(EmbedData.musicWrongVoiceChannelDesc)
				.setColor(EmbedData.failureColor);
			return embed;
		}
		else {
			return true;
		}
	}
};