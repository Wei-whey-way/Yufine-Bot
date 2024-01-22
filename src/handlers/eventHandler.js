const path = require('path');
const { AttachmentBuilder, } = require('discord.js');
const getAllFiles = require('../utils/getAllFiles');

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);
    // console.log(eventFolders);

    for (const eventFolder of eventFolders){
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a,b) => a > b);
        // console.log(eventFiles);

        const eventName = eventFolder.replace(/\\/g,'/').split('/').pop(); //This replaces all the \\ into /
        // console.log(eventName);

        //Event listeners
        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, arg);
            }
        });
    }
    // client.user.setActivity({
    //     name: "My adventure!",
    //     type: ActivityType.Streaming,
    //     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
    // });

    //Read messages from chat and respond when someone says Hi Yufine
    client.on('messageCreate', (message) => {
        // console.log(message);
        if (message.author.bot){
            return; //Stops bot from sending its own message
        }
        
        //Getting user info
        const member = message.guild.members.fetch(message.author.id);
        const displayName = message.member.nickname || message.author.globalName;
        const channel = message.channel;

        if (message.content.toLocaleLowerCase() === 'hi yufine' || message.content.toLocaleLowerCase() === 'hello yufine'){
            message.reply('Hello!');
        }

        if (message.content.toLocaleLowerCase() === 'bad yufine' || message.content.toLocaleLowerCase() === 'bad bot' || message.content.toLocaleLowerCase() === 'fuck you' || message.content.toLocaleLowerCase() === 'you suck'){
            const img = new AttachmentBuilder('img/HyufineFinger.png', 'HyufineFinger.png');
            message.reply({ files: [img] });
        }

        if (message.content.toLocaleLowerCase() === 'good yufine' || message.content.toLocaleLowerCase() === 'good bot'){
            message.channel.send(`Thank you ${displayName}!`);
        }

        if (message.content.toLowerCase().includes('draw')){
            const img = new AttachmentBuilder('img/NegaDraw.png', 'NegaDraw.png');
            channel.send({ files: [img] });
        };
    });
};