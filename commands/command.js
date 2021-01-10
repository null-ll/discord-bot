/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
const mongo = require('../mongo.js');

const prefixSchema = require('../schemas/prefix-schema');

const { prefix: defaultPrefix } = require('../config.json');
const guildPrefixes = {};

module.exports = (client, commandOptions) => {
    let {
        command,
        numArgs = 0,
        maxArgs = null,
        expectedArgs = '',
        perms = ['SEND_MESSAGES'],
        permsError = 'You don\'t have the permissions to use this command',
        callback,
    } = commandOptions;

    client.on('message', message => {
        const { member, content: rawContent } = message;

        const prefix = guildPrefixes[message.guild.id] || defaultPrefix;

        if(rawContent.toLowerCase().startsWith(`${prefix}${command}`)) {
            // check perms
            for(const perm of perms) {
                if(!member.hasPermission(perm)) {
                    message.reply(permsError);
                    return;
                }
            }

            if(member.user.bot) {
                return;
            }

            // split args and remove prefix
            let content = rawContent.replace(`${prefix}${command}`).replace(/`/g, '');
            const args = content.split(/\s+/);
            args.shift();

            // check args
            if(args.length < numArgs || (maxArgs !== null && args.length > maxArgs)) {
                message.reply(`Missing arguments ${expectedArgs}`);
                return;
            }

            callback(message, args);

            return;
        }
    });
};

module.exports.updateCache = (guildId, newPrefix) => {
    guildPrefixes[guildId] = newPrefix;
};

module.exports.loadPrefixes = async (client) => {
    await mongo().then(async (mongoose) => {
        try {
            for(const guild of client.guilds.cache) {
                const guildId = guild[1].id;
                const result = await prefixSchema.findOne({ _id: guildId });
                guildPrefixes[guildId] = result.prefix;
            }
        } finally {
            mongoose.connection.close();
        }
    });
};