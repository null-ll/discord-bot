const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Discord.Client();

const mongo = require('./mongo.js');
const { token } = require('./config.json');

client.on('ready', async () => {
    console.log('Connected to Discord');

    await mongo().then(mongoose => {
        try {
            console.log('Connected to MongoDB');
        } finally {
            mongoose.connection.close();
        }
    });

    const base = require('./commands/command.js');
    const config = require('./commands/config.js');
    base.loadPrefixes(client);
    config.loadSettings(client);

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if(stat.isDirectory()) {
                readCommands(path.join(dir, file));
            } else if(file != base) {
                const options = require(path.join(__dirname, dir, file));
                base(client, options);
            }
        }
    };

    readCommands('commands');

    client.user.setActivity(
        'you',
        {
            type: 'WATCHING',
        })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

client.login(token);