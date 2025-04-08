const path = require('path');
const { AttachmentBuilder, } = require('discord.js');
const getAllFiles = require('../utils/getAllFiles');
const { Venom, Alusha } = require('../../memberList.json');
const { snowballServer, testServer } = require('../../config.json');

// Function to generate a random number between 1 and 4
function getRandomNumber() {
    // Math.random() generates a random decimal between 0 and 1 (exclusive of 1)
    // We multiply it by 2 to get a number between 0 and 3.999...
    // Then we add 1 to make sure the result is between 1 and 4
    return Math.floor(Math.random() * 2) + 1;
}

// Timeoutvenom
async function timeoutVenom(client, message) {
    // console.log(client)
    let guild = await client.guilds.cache.get(snowballServer);   
    
    console.log('Guild', guild)

    const venom = await guild.members.cache.get(Venom);

    if (venom) {
        // console.log('Is venom')

        try {
            // console.log('Debug', venom)

            await venom.timeout(900000, 'Very sussy behaviour');
            await message.reply('Venom timed out for being too sussy');
              
        } catch (error) {
            console.log(`Error when timing out: ${error}`)
        }

    } else {
        console.error('User not found');
    }
}

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

        if (message.content.toLowerCase().includes('lord zhxu') || message.content.toLowerCase().includes('lord zxhu')){
            const img = new AttachmentBuilder('img/holysac.png', 'holysac.png');
            message.reply({ files: [img] });
        }

        if (/meta.*(sucks|hate)|((sucks|hate).*)meta/i.test(message.content)) {
            message.reply('Meta this, meta that, have you ever met-a woman before?');
        }
        
        if (
            (/Moona.*preorder|preorder.*Moona/i.test(message.content) || /preorder\w*/i.test(message.content) && /Moona/i.test(message.content)) && /sus\w*/i.test(message.content)
        ) {
            if (message.author.id === Venom){
                timeoutVenom(client, message);
                console.log('Venom talking about Moona fig again')
            } 
        }

        if (message.content.toLowerCase().includes('draw')){
            const num = getRandomNumber()
            let img;
            if (num == 1){
                img = new AttachmentBuilder('img/NegaDraw.png', 'NegaDraw.png');
                channel.send({ files: [img] });
            } else if (num == 2){
                img = new AttachmentBuilder('img/NegaDraw2.png', 'NegaDraw2.png');
                channel.send({ files: [img] });
            } else {
                message.reply('Oops look like Alusha coding skills are poopoo...');
            }
        };

        if (message.content.toLowerCase().includes('arbiter vildred') || message.content.toLowerCase().includes('arbi') || message.content.toLowerCase().includes('arby') || message.content.toLocaleLowerCase() === 'pumpkin weakness' ){
            const img = new AttachmentBuilder('img/pumpkinweakness.png', 'pumpkinweakness.png');
            channel.send({ files: [img] });
        };
    });
};