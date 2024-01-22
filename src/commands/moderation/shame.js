const { Client, InteractionCollector, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');
  
module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) =>{
    //Check if user has required roles
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const allowedRole = interaction.guild.roles.cache.find((role) => role.name === 'Mini-Balls');
    
    if (!member || !member.roles.cache.has(allowedRole.id)) {
      await interaction.reply("Silly dookie, you can't shame people~");
      return;
    }

    await interaction.deferReply();

    //Get specified user
    const user = interaction.options.get('target-user')?.value;
    const roleName = 'Shame';
    const shameRole = interaction.guild.roles.cache.find((role) => role.name === 'roleName');
    
    if (!shameRole) {
        await interaction.reply(`Role "${roleName}" not found.`);
        return;
    }

    //Give the shame role to user
    const memberToShame = interaction.guild.members.cache.get(user);
    console.log(memberToShame.nickname);
    
    //Check if the member exists and the bot can manage roles
    if (memberToShame && interaction.guild.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await memberToShame.roles.add(shameRole);
      await interaction.editReply(`${memberToShame.nickname} has been shamed!`);
    }
    
  },

  name: 'shame',
  description: 'Shame gang unite!',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
        name: 'target-user',
        description: 'The user to ban.',
        required: true,
        type: ApplicationCommandOptionType.User,
      },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};