/* eslint-disable no-unused-vars */
const TinyURL = require('tinyurl');
module.exports = {
    command: 'shorten',
    expectedArgs: '<url>',
    numArgs: 1,
    callback: (message, args) => {
        const longURL = args[0];
        TinyURL.shorten(longURL, function(result, error) {
            if(error || result === 'Error') {
                message.reply('Invalid URL');
            } else {
                message.channel.send(`<${result}>`);
                message.delete();
            }
        });
    },
 };