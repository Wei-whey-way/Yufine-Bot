require('dotenv').config();
const {Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

const client = new Client({
    intents: [
        //A set of permissions that your bot can use in order to gain access to a set of events
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,   
    ],
});

const roles = [
    {
        id: '1174349810476793908',
        label: 'Daddy',
    },
    {
        id: '1174349886670516224',
        label: 'Checker',
    },
    {
        id: '1174349962855862382',
        label: 'Sentry',
    },
];

client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1173981222775554128');
        if (!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary));
        });
        await channel.send({
            content: 'Its time for your Viper 2 sticks, what is your role?',
            components: [row],
        });
        process.exit();

    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN);