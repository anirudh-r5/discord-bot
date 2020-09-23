const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const ytsr = require('ytsr');
const { check } = require('../../util/check.js');

module.exports = class PlaynextCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'playnext',
			aliases: ['pn'],
			group: 'music',
			memberName: 'playnext',
			description: 'Adds song to the front of the queue to be played next',
			args: [
				{
					key: 'query',
					prompt: 'Enter name of the track to be played',
					type: 'string',
				},
			],
			guildOnly: true,
		});
	}

	async run(message, { query }) {
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		try {
			const music = await ytsr(query, { limit: 1 });
			const index = message.guild.musicData.queue2.indexOf(message.guild.musicData.nowPlaying) + 1;
			message.guild.musicData.queue.unshift(music.items[0]);
			message.guild.musicData.queue2.splice(index, 0, music.items[0]);
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.playNextTitle)
				.setDescription(music.items[0].title)
				.setURL(music.items[0].link)
				.setThumbnail(music.items[0].thumbnail)
				.setColor(EmbedData.successColor);
			return message.say(embed);
		}
		catch (error) {
			console.error(error);
		}
	}
};