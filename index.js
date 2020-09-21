const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const { token } = require('./key.json');
const { prefix, ownerID } = require('./config.json');

Structures.extend('Guild', Guild => {
	class MusicGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.musicData = {
				queue: [],
				nowPlaying: null,
				isPlaying: false,
				volume: 1,
				musicDispatcher: null,
				channel: null,
			};
		}
	}
	return MusicGuild;
});

const client = new CommandoClient({
	commandPrefix: prefix,
	owner: ownerID,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['basic', 'The 1st command group'],
		['second', 'The 2nd command group'],
		['among_us', 'Commands to manage voice chat during Among Us games'],
		['music', 'Music player'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`${client.user.tag} is ready to go!`);
});

client.on('error', console.error);


client.login(token);