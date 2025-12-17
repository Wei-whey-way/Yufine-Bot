const path = require('path');
const { AttachmentBuilder, } = require('discord.js');
const getAllFiles = require('../utils/getAllFiles');
const { Venom, Alusha, TackyZombay } = require('../../memberList.json');
const { snowballServer, testServer, testServerChannel, activityCh_intpurity } = require('../../config.json');

const { gptResponse, randomTimeout } = require('./handlerFunctions.js');

const OpenAI = require("openai");
const cron = require('node-cron');

require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY
});

let venomChat = new Array(5).fill("");
let venomChatIndex = 0;

// GPT Response
// async function gptResponse(input, member){
//     input = input.replace(/^yufine[, ]*/i, '').trim(); // Remove "Yufine" from the start of the input
//     hello();
//     console.log('Response called with input:', input, 'from member:', member);

//     // Call n8n webhook if available
//     const n8n_response = await fetch("http://localhost:5678/webhook/n8n-call", {
//     // const n8n_response = await fetch("http://localhost:5678/webhook-test/n8n-call", { // Testing request
//         method: "POST",
//         body: JSON.stringify({ input: input, userId: member }),
//         headers: { "Content-Type": "application/json; charset=UTF-8" },
//     });
    
//     // console.log('Debugging n8n response:', n8n_response.status, n8n_response.json());

//     // Call OpenAI API if n8n not available
//     if (n8n_response.status !== 200) {
//         console.log('n8n response not 200, calling OpenAI API');
//         return "ChatGPT functionality is currently under maintenance. Please try again later.";

//         const gpt_response = await openai.responses.create({
//             model: "gpt-5-nano",
//             input: `${input}\nIMPORTANT: Keep your entire response under 2000 characters.`,
//             store: true,
//         });

//         // const gpt_response = null;
//         // console.log('Debugging GPT response:', gpt_response.output_text, 'input was:', input);

//         if (gpt_response == null || gpt_response.output_text == null || gpt_response.output_text == ''){
//             return "Sorry, I couldn't generate a response at this time.";
//         }

//         let output = gpt_response.output_text;
        
//         // Hard limit safeguard edge case
//         if (output.length > 2000) {
//             // output = output.substring(0, 2000 - 3) + "...";
//             shorten_response = await openai.responses.create({
//                 model: "gpt-5-nano",
//                 input: `The previous response exceeded the character limit. Please provide a concise summary of the following text within 2000 characters:\n\n${output}`,
//             });
        
//             return shorten_response.output_text;
//         } 

//         return output;
//     }
    
//     else {
//         // console.log('Success, Debugging n8n response:', n8n_response.output);

//         const n8n_data = await n8n_response.json();
//         const output = n8n_data["output"];
//         // console.log('Debugging n8n data:', output);

//         if (output === null || output === undefined || output == ''){
//             return "Sorry, I couldn't generate a response at this time.";
//         }
//         return output;
//     }
// }

// Timeoutvenom
async function timeoutVenom(client, message) {
    // console.log(client)
    let guild = await client.guilds.cache.get(snowballServer);
    let test_guild = await client.guilds.cache.get(testServer);   
    
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

    // Cron job for periodic tasks
    // cron.schedule('0 * * * *', async () => {
    //     try {
    //         const channel = await client.channels.fetch(testServerChannel);
            
    //         if (channel){
    //             await channel.send("Hour check for Yufine status");
                
    //             //Ping user
    //             // const alusha = await client.users.fetch(Alusha);
    //             // await channel.send(`Hello ${alusha}, this is your minute reminder!`);
    //             console.log('Hour check for Yufine status');
    //         }
    //     } catch (error) {
    //         console.error('Error in periodic task:', error);
    //     }
    // }, {
    //     timezone: "Asia/Singapore"
    // });

    // Tacky ping every Monday, Wednesday, Friday at 9pm
    // cron.schedule('* 21 * * 1,3,5', async () => {
    //     try {
    //         const channel = await client.channels.fetch(activityCh_intpurity);
    //         if (channel){
    //             //Ping user
    //             const tacky = await client.users.fetch(TackyZombay);
    //             await channel.send(`${tacky}, it is time to do guild war!`);
    //             console.log('Tacky Reminder ping in intpurity');
    //         }
    //     } catch (error) {
    //         console.error('Error in schedule tacky ping:', error);
    //     }
    // }, {
    //     timezone: "Asia/Singapore"
    // });

    // Message Create listener
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
            const gpt_response = await gptResponse(message.content, message.author.id);
            message.reply(gpt_response);
        }
        
    });
};