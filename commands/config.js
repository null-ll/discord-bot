const mongo = require('../mongo.js');

const base = require('./command.js');
const kick = require('./kick.js');
const ban = require('./ban.js');

const prefixSchema = require('../schemas/prefix-schema.js');
const banSchema = require('../schemas/ban-schema.js');
const kickSchema = require('../schemas/kick-schema.js');

module.exports = {
    command: 'config',
    numArgs: 1,
    expectedArgs: '<setting> <new_value>',
    perms: ['ADMINISTRATOR'],
    permsError: 'You don\'t have the perms to change this server\'s configuration',
    callback: async (message, args) => {
        const setting = args[0];
        args.shift();

        switch(setting) {
            case 'prefix':
                await mongo().then(async mongoose => {
                    try {
                        const guildId = message.guild.id;
                        const prefix = args.join(' ');

                        await prefixSchema.findOneAndUpdate({
                            _id: guildId,
                        }, {
                            _id: guildId,
                            prefix: prefix,
                        }, {
                            upsert: true,
                        })
                        .then(() => {
                            message.reply(`Changed bot prefix on this server to \`${prefix}\``);
                            console.log(prefix);
                            base.updateCache(guildId, prefix);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    } finally {
                        mongoose.connection.close();
                    }
                });
                break;
            case 'kick':
                await mongo().then(async mongoose => {
                    try {
                        const guildId = message.guild.id;
                        const kickMessage = args.join(' ');

                        await kickSchema.findOneAndUpdate({
                            _id: guildId,
                        }, {
                            _id: guildId,
                            message: kickMessage,
                        }, {
                            upsert: true,
                        })
                        .then(() => {
                            kick.updateCache(guildId, kickMessage);
                            message.reply(`Changed kick message on this server to \`${kickMessage}\``);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    } finally {
                        mongoose.connection.close();
                    }
                });
                break;
            case 'ban':
                await mongo().then(async mongoose => {
                    try {
                        const guildId = message.guild.id;
                        const banMessage = args.join(' ');

                        await banSchema.findOneAndUpdate({
                            _id: guildId,
                        }, {
                            _id: guildId,
                            message: banMessage,
                        }, {
                            upsert: true,
                        })
                        .then(() => {
                            ban.updateCache(guildId, banMessage);
                            message.reply(`Changed ban message on this server to \`${banMessage}\``);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    } finally {
                        mongoose.connection.close();
                    }
                });
                break;
        }
    },
 };

 module.exports.loadSettings = async (client) => {
    kick.loadKickMessages(client);
    ban.loadBanMessages(client);
};