require('dotenv').config();
const { Client, GatewayIntentBits, IntentsBitField, AttachmentBuilder, ActivityType} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        //A set of permissions that your bot can use in order to gain access to a set of events
        GatewayIntentBits.Guilds,
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,   
    ],
});

eventHandler(client);

// //Listens when bot is ready
//     client.user.setActivity({
//         name: "My adventure!",
//         type: ActivityType.Streaming,
//         url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
//     });
// });

// //Read messages from chat and respond when someone says Hi Yufine
// client.on('messageCreate', (message) => {
//     // console.log(message);
//     if (message.author.bot){
//         return; //Stops bot from sending its own message
//     }
    
//     //Getting user info
//     const member = message.guild.members.fetch(message.author.id);
//     // console.log('member:', member);
//     // console.log('Member Author:', message.member.nickname);
//     // console.log('Member User:', message.member.user);
//     const displayName = message.member.nickname || message.author.globalName;

//     const channel = message.channel;

//     if (message.content.toLocaleLowerCase() === 'hi yufine' || message.content.toLocaleLowerCase() === 'hello yufine'){
//         message.reply('Hello! ');
//     }

//     if (message.content.toLocaleLowerCase() === 'bad yufine' || message.content.toLocaleLowerCase() === 'bad bot' || message.content.toLocaleLowerCase() === 'fuck you' || message.content.toLocaleLowerCase() === 'you suck'){
//         const img = new AttachmentBuilder('img/HyufineFinger.png', 'HyufineFinger.png');
//         message.reply({ files: [img] });
//     }

//     if (message.content.toLocaleLowerCase() === 'good yufine' || message.content.toLocaleLowerCase() === 'good bot'){
//         message.channel.send(`Thank you ${displayName}!`);
//     }

//     if (message.content.toLowerCase().includes('draw')){
//         const img = new AttachmentBuilder('img/NegaDraw.png', 'NegaDraw.png');
//         // const EmbedImg = new EmbedBuilder()
//         //     .setImage('attachment://NegaDraw.png');
//         channel.send({ files: [img] });
//     };
// });

// client.on('interactionCreate', async (interaction) => {
//     console.log(`Interaction: ${interaction}`);
//     //Check for slash commands
//     if (interaction.isChatInputCommand()){
//         console.log(`Input commmand: ${interaction.commandName}`);
//         if (interaction.commandName === 'hey'){ interaction.reply('Hey!'); }

//         return;
//     }
    
//     try {
//         if (!interaction.isButton()) return;
//         await interaction.deferReply({ ephemeral: true }); //This says bot is thinking
//         //Check for button commands
//         if (interaction.isButton()){
//             console.log(`interaction from clicking button: ${interaction.customId}`)
//             const role = interaction.guild.roles.cache.get(interaction.customId);
//             console.log(`role from clicking button is: ${role}`);
//             if(!role){
//                 interaction.editReply({ content: "I couldn't find that role :(",});
//                 return;
//             }

//             const hasRole = interaction.member.roles.cache.has(role.id);
//             if (hasRole){
//                 await interaction.member.roles.remove(role);
//                 await interaction.editReply(`The role ${role} has been removed`);
//                 return;
//             }

//             await interaction.member.roles.add(role);
//             await interaction.editReply(`The role ${role} has been added`);
//         }
//     } catch (error){
//         console.log(error)
//     }

//     return;
// })

client.login(process.env.TOKEN);