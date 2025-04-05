const path = require('path');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'firefly',
    description: 'Firefly',

    callback: (client, interaction) => {
        const images = [
            '../../../img/fireflykiss.gif',
            '../../../img/firefly-sam.gif'
        ];
        
        // Randomly select an image file
        const selectedImage = images[Math.floor(Math.random() * images.length)];
        const filePath = path.join(__dirname, selectedImage);
        const file = new AttachmentBuilder(filePath);
        interaction.reply({ files: [file] });
    },
};