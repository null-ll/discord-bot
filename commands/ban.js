/* eslint-disable no-unused-vars */
const mongo = require('../mongo.js');
const banMessageSchema = require('../schemas/ban-schema');

const banMessages = {};

module.exports = {
    command: 'ban',
    expectedArgs: '<@member>',
    numArgs: 1,
    perms: ['BAN_MEMBERS'],
    permsError: 'You don\'t have the permissions to ban members',
    callback: (message, args) => {
        const user = message.mentions.users.first();

        let banMessage = banMessages[message.guild.id] || 'Banned';
        if (banMessage.includes('<user>')) {
            banMessage = banMessage.replace(/<user>/g, `${user.tag}`);
        } else {
            banMessage = `${banMessage} ${user.tag}`;
        }

        if(user) {
            const member = message.guild.member(user);
            if(member) {
                member.ban(`Banned by ${message.author.tag}`)
                .then(() => {
                    message.reply(banMessage);
                })
                .catch(error => {
                    console.log(error);
                    message.reply(`An error occurred while attempting to ban ${user.tag}`);
                });
            }
        }
    },
 };

 module.exports.updateCache = (guildId, newMessage) => {
    banMessages[guildId] = newMessage;
};

 module.exports.loadBanMessages = async (client) => {
    await mongo().then(async (mongoose) => {
        try {
            for(const guild of client.guilds.cache) {
                const guildId = guild[1].id;
                const result = await banMessageSchema.findOne({ _id: guildId });
                banMessages[guildId] = result.message;
            }
        } finally {
            mongoose.connection.close();
        }
    });
};