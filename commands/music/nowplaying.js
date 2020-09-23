const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { music: EmbedData } = require('../../config.json');
const { check } = require('../../util/check.js');

module.exports = class NowplayingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nowplaying',
			aliases: ['np'],
			group: 'music',
			memberName: 'nowplaying',
			description: 'Displays the currently playing song',
			guildOnly: true,
		});
	}

	run(message) {
		const pass = check(message, this.client);
		if (pass != true) {
			return message.say(pass);
		}
		else {
			const now = message.guild.musicData.nowPlaying;
			const embed = new MessageEmbed()
				.setAuthor(EmbedData.botName, this.client.user.avatarURL('png'))
				.setTitle(EmbedData.playNowPlayingTitle)
				.setDescription(now.title)
				.setURL(now.link)
				.setThumbnail(now.thumbnail)
				.addField('By:', now.author.name, true)
				.setFooter(`Duration: ${now.duration}\tViews: ${now.views}`)
				.setColor(EmbedData.successColor);
			return message.say(embed);
		}
	}
};