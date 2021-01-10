/* eslint-disable no-unused-vars */
module.exports = {
    command: 'say',
    numArgs: 1,
    expectedArgs: '<text>',
    callback: (message, args) => {
        message.channel.send(args.join(' '), { allowedMentions: { parse: [] } });
        message.delete();
    },
 };