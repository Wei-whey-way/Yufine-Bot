module.exports = {
    name: 'hello',
    description: 'Says hello back',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //options: Object[],

    callback: (client, interaction) => {
        interaction.reply(`Good bye!`);
    },
};