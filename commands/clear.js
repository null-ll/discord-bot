/* eslint-disable no-unused-vars */
module.exports = {
    command: 'clear',
    numArgs: 1,
    expectedArgs: '<number>',
    perms: ['MANAGE_MESSAGES'],
    permsError: 'You don\'t have the permissions to manage messages',
    callback: (message, args) => {
        const channel = message.channel;
        const num = args[0];

        if(num < 1) {
            message.reply('You have to delete at least 1 message');
        }

        channel.bulkDelete(parseInt(num) + 1)
            .then(() => {
                channel.send(`Deleted ${num} messages`)
                .then(newMessage => {
                    newMessage.delete({ timeout:3000 });
                })
                .catch(error => {
                    console.log(error);
                });
            })
            .catch(error => {
                console.log(error);
                message.reply('An error occured');
            });
    },
 };