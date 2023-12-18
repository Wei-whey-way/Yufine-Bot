const { ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');
  
module.exports = {
  // deleted: true,
  name: 'Unshame',
  description: 'Removes the Glorious Snow and Shame roles',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'target-user',
      description: 'Remove all shame and glorious roles',
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
  
  callback: (client, interaction) => {
    interaction.reply('Time to unshame!');
  },
};