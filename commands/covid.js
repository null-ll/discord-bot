/* eslint-disable no-unused-vars */
const { connections } = require('mongoose');
const fetch = require('node-fetch');

module.exports = {
    command: 'covid',
    callback: (message, args) => {
        let url = 'https://api.covidtracking.com/v1/us/current.json';
        let region = 'us';

        if(!args.length == 0) {
            region = args[0].toLowerCase();
            if(region != 'us') {
                url = `https://api.covidtracking.com/v1/states/${region}/current.json`;
            }
        }

        fetch(url)
            .then(res => res.json())
            .then((data) => {
                // console.log(data);
                if(region == 'us') {
                    data = data[0];
                } else if(data.state == undefined) {
                    message.reply('Invalid state code');
                    return;
                }

                const date = data.date;
                const positive = format(data.positive);
                const hospitalized = format(data.hospitalized);
                const deaths = format(data.death);
                const positiveIncrease = format(data.positiveIncrease);
                const hospitalizedIncrease = format(data.hospitalizedIncrease);
                const deathIncrease = format(data.deathIncrease);

                // format date
                const year = ('' + date).substring(0, 4);
                const month = ('' + date).substring(4, 6);
                const day = ('' + date).substring(6, 8);

                // random color hex
                const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                const messageEmbed = {
                    color: randomColor,
                    title: `COVID-19 Statistics - ${region.toUpperCase()}`,
                    description: `Updated ${month}/${day}/${year}`,
                    fields: [
                      {
                          name: 'Total Cases',
                          value: positive,
                          inline: true,
                      },
                      {
                          name: 'Total Hospitalized',
                          value: hospitalized,
                          inline: true,
                      },
                      {
                          name: 'Total Deaths',
                          value: deaths,
                          inline: true,
                      },
                      {
                          name: 'Cases Daily Increase',
                          value: positiveIncrease,
                          inline: true,
                      },
                      {
                          name: 'Hospitalized Daily Increase',
                          value: hospitalizedIncrease,
                          inline: true,
                      },
                      {
                          name: 'Deaths Daily Increase',
                          value: deathIncrease,
                          inline: true,
                      },
                    ],
                    footer: {
                        text: `Requested by ${message.author.tag}`,
                        image: message.author.avatar,
                    },
                    timestamp: new Date(),
                };
                message.channel.send({ embed: messageEmbed });
            })
            .catch(err => {
                console.log(err);
            });
    },
 };

 function format(value) {
    if(value == null) {
        return 'Not counted';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
 }