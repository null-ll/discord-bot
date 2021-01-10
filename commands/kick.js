/* eslint-disable no-unused-vars */
const mongo = require('../mongo.js');
const kickMessageSchema = require('../schemas/kick-schema');

const kickMessages = {};

module.exports = {
    command: 'kick',
    expectedArgs: '<@member>',
    numArgs: 1,
    perms: ['KICK_MEMBERS'],
    permsError: 'You don\'t have the permissions to kick members',
    callback: (message, args) => {
        const user = message.mentions.users.first();

        let kickMessage = kickMessages[message.guild.id] || 'Kicked';
        if (kickMessage.includes('<user>')) {
            kickMessage = kickMessage.replace(/<user>/g, `${user.tag}`);
        } else {
            kickMessage = `${kickMessage} ${user.tag}`;
        }

        if(user) {
            const member = message.guild.member(user);
            if(member) {
                member.kick(`Kicked by ${message.author.tag}`)
                .then(() => {
                    message.reply(kickMessage);
                })
                .catch(error => {
                    console.log(error);
                    message.reply(`An error occurred while attempting to kick ${user.tag}`);
                });
            }
        }
    },
 };

 module.exports.updateCache = (guildId, newMessage) => {
    kickMessages[guildId] = newMessage;
};

 module.exports.loadKickMessages = async (client) => {
    await mongo().then(async (mongoose) => {
        try {
            for(const guild of client.guilds.cache) {
                const guildId = guild[1].id;
                const result = await kickMessageSchema.findOne({ _id: guildId });
                kickMessages[guildId] = result.message;
            }
        } finally {
            mongoose.connection.close();
        }
    });
};