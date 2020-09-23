const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const { check } = require('../../util/check.js');

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['s'],
			group: 'music',
			memberName: 'stop',
			description: 'Stops music playback, clears queue and exits voice channel',
			guildOnly: true,
		});
	}

	run(message) {
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		else {
			message.guild.musicData.channel.leave();
			message.guild.musicData.isPlaying = false;
			message.guild.musicData.isPaused = false;
			message.guild.musicData.loopTrack = false;
			message.guild.musicData.loopQueue = false;
			message.guild.musicData.channel = null;
			message.guild.musicData.musicDispatcher = null;
			message.guild.musicData.nowPlaying = null;
			message.guild.musicData.queue = [];
			message.guild.musicData.queue2 = [];
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.stopPlayingTitle)
				.setDescription(EmbedData.stopPlayingDesc)
				.setColor(EmbedData.successColor);
			return message.say(embed);
		}
	}
};