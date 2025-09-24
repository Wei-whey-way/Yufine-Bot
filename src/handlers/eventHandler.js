const path = require('path');
const { AttachmentBuilder, } = require('discord.js');
const getAllFiles = require('../utils/getAllFiles');
const { Venom, Alusha } = require('../../memberList.json');
const { snowballServer, testServer } = require('../../config.json');
const OpenAI = require("openai");

require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY
});

let venomChat = new Array(5).fill("");
let venomChatIndex = 0;

function randomTimeout() {
    // Math.random() generates a random decimal between 0 and 1 (exclusive of 1)
    // We multiply it by 2 to get a number between 0 and 3.999...
    // Then we add 1 to make sure the result is between 1 and 4
    let durationMin = Math.floor((Math.random() * 60) + 5);
    let durationMs = durationMin * 60 * 1000; // Convert minutes to milliseconds
    
    return durationMs;
}

// GPT Response
async function gptResponse(input){
    input = input.replace(/^yufine[, ]*/i, '').trim(); // Remove "Yufine" from the start of the input

    // const response = `Test response from GPT with input: ${input}`;

    const response = await openai.responses.create({
        model: "gpt-5-nano",
        input: input,
        store: true,
    });

    console.log('Debugging GPT response:', response, 'input was:', input);

    if (response == null || response.output_text == null || response.output_text == ''){
        return "Sorry, I couldn't generate a response at this time.";
    }

    return response.output_text;
}

// Timeoutvenom
async function timeoutVenom(client, message) {
    // console.log(client)
    let guild = await client.guilds.cache.get(snowballServer);   
    
    // console.log('Guild', guild)

    const venom = await guild.members.cache.get(Venom);

    if (venom) {
        // console.log('Is venom')

        try {
            // console.log('Debug', venom)

            await venom.timeout(randomTimeout(), 'Very sussy behaviour');
            // await venom.timeout(50000, 'Very sussy behaviour');
            
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

    client.on('messageCreate', async (message) => {
        // console.log(message);
        if (message.author.bot){
            return; //Stops bot from sending its own message
        }
        
        //Getting user info
        const member = message.guild.members.fetch(message.author.id);
        const displayName = message.member.nickname || message.author.globalName;
        const channel = message.channel;

        //Default variables
        let img = null;

        // Handlers for simple text responses
        switch(message.content.toLocaleLowerCase()){
            case 'hi yufine':
            case 'hello yufine':
                message.reply('Hello!');
                break;
            
            case 'good yufine':
                message.channel.send(`Thank you ${displayName}!`);
                break;

            case 'i do not understand': 
                img = new AttachmentBuilder('img/ars.jpg');
                message.channel.send({ files: [img] });
                break;
            
            case 'bad yufine':
            case 'fuck you':
            case 'you suck':
                img = new AttachmentBuilder('img/HyufineFinger.png', 'HyufineFinger.png');
                message.reply({ files: [img] });
                break;
            
            case 'lord zhxu':
            case 'lord zxhu':
                img = new AttachmentBuilder('img/holysac.png', 'holysac.png');
                message.channel.send({ files: [img] });
                break;
            
            case 'draw':
                const num = Math.floor(Math.random() * 2) + 1;
                if (num == 1){
                    img = new AttachmentBuilder('img/NegaDraw.png', 'NegaDraw.png');
                    channel.send({ files: [img] });
                } else if (num == 2){
                    img = new AttachmentBuilder('img/NegaDraw2.png', 'NegaDraw2.png');
                    channel.send({ files: [img] });
                } else {
                    message.reply('Oops look like Alusha coding skills are poopoo...');
                }
                break;
            
            case 'pumpkin weakness':
            case 'arbiter vildred':
                img = new AttachmentBuilder('img/pumpkinweakness.png', 'pumpkinweakness.png');
                channel.send({ files: [img] });
                break;

        }
        
        // Handlers for text responses with unique patterns
        if (/meta.*(sucks|hate)|((sucks|hate).*)meta/i.test(message.content)) {
            message.reply('Meta this, meta that, have you ever met-a woman before?');
        }

        // Moona preorder handler
        let hasMoona = message.content.toLowerCase().match(/\bmoona\b/)
        let hasPreorder = message.content.toLowerCase().match(/\bpreorder\w*\b/)
        let hasFig = message.content.toLowerCase().match(/\bfig*\b/)
        let hasSus = message.content.toLowerCase().match(/\b\w*sus\ w*\b/)

        if ((hasMoona && hasPreorder) || (hasMoona && hasFig)) {
            console.log('Moona fig talk by', message.author)
            if (message.author.id === Venom){
                console.log('Venom talking about Moona fig again')
                timeoutVenom(client, message);
                
            } else {
                console.log('Venom talking about Moona fig again')
                message.reply("Big sis got a figurine?!");
            }
        }

        if (message.author.id === Venom){
            // console.log('Venom message')
            // console.log(message.content);

            if (hasSus){ timeoutVenom(client, message); }

            //Check if venom repeated the same text 3 times
            let count = 0
            for (let i = 0; i < venomChat.length; i++){
                if (venomChat[i] === message.content){
                    count++;
                }
            }

            if ((count >= 2) || (venomChat.includes("moona") && (venomChat.includes("fig") || venomChat.includes("preorder")))){
                console.log('Venom repeated the same text 3 times')
                timeoutVenom(client, message);
            }
            venomChat[venomChatIndex%5] = message.content.toLowerCase();
            venomChatIndex++;

            // console.log('Venom messages:', venomChat);
        }

        // ChatGPT handler
        if (message.content.toLowerCase().startsWith('yufine,')){
            const gpt_response = await gptResponse(message.content);
            message.reply(gpt_response);
        }
        
    });
};