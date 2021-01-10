/* eslint-disable no-unused-vars */
const fetch = require('node-fetch');
module.exports = {
    command: 'trivia',
    callback: (message, args) => {
        const url = 'https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986';
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                // console.log(data);
                let answers = data.results[0].incorrect_answers;
                const correctAnswer = decodeURIComponent(data.results[0].correct_answer);
                answers.push(correctAnswer);

                answers = answers.map(ans => { return decodeURIComponent(ans); });

                // shuffle answer choices
                let i, j, temp;
                for(i = 0; i < answers.size; i++) {
                    j = Math.floor(Math.random() * (i + 1));
                    temp = answers[i];
                    answers[i] = answers[j];
                    answers[j] = temp;
                }

                const choices = answers.map(ans => `${answers.indexOf(ans) + 1}) *${ans}*`).join('\n');

                const question = decodeURIComponent(data.results[0].question);

                // random color hex
                const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                const messageEmbed = {
                    color: randomColor,
                    title: question,
                    description: `You have 15 seconds to answer.\n\n${choices}`,
                    footer: {
                        text: `Requested by ${message.author.tag}`,
                        image: message.author.avatar,
                    },
                    timestamp: new Date(),
                };
                message.channel.send({ embed: messageEmbed });

                const filter = m => m.author.id === message.author.id;
                const correct = answers.indexOf(correctAnswer) + 1;
                message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        if(collected.first().content == correct || collected.first().content.toLowerCase() == correctAnswer.toLowerCase()) {
                            message.channel.send(`Correct! The answer was **${correctAnswer}**.`);
                        }
                        else {
                            message.channel.send(`Incorrect, **${correctAnswer}** was the correct answer.`);
                        }
                    })
                    .catch(() => message.channel.send('You did not answer in time.'));
            })
            .catch(err => { console.log(err); });
    },
 };