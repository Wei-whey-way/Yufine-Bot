const path = require('path');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'celebration',
    description: 'Celebration time!',


    callback: (client, interaction) => {
        const images = [
            '../../../img/bambi2-happy.gif',
            '../../../img/honkai-impact-honkai.gif',
            '../../../img/kakashi-fortnite.gif',
            '../../../img/kanna-kamui-omurice.gif',
            '../../../img/klee-genshin.gif',
            '../../../img/sousou-no-frieren-hieter-frieren.gif',
            '../../../img/terraria-terrarium.gif'
        ];
        
        // Randomly select an image file
        const selectedImage = images[Math.floor(Math.random() * images.length)];
        const filePath = path.join(__dirname, selectedImage);
        const file = new AttachmentBuilder(filePath);
        interaction.reply({ files: [file] });
    },
};