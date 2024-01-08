const { Client, InteractionCollector, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');
  
module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) =>{
    const roleName = ['Shame', 'Glorious Snow'];
    await interaction.deferReply();
    // const roleToRemove = interaction.guild.roles.cache.find((role) => role.name === roleName);
    const rolesToRemove = roleName.map((roleName) =>
      interaction.guild.roles.cache.find((role) => role.name === roleName)
    );

    for (const role of rolesToRemove) {
      if (!role) {
          await interaction.editReply(`Role "${roleName}" not found.`);
          return;
      }
    }

    console.log(`Roles to remove: ${rolesToRemove.map((role) => `${role.name} (${role.id})`).join(', ')}`);

    try {
      await interaction.guild.members.fetch();

      for (const roleToRemove of rolesToRemove){
        const membersWithRole = roleToRemove.members.map((member) => member.user.tag);
        console.log(`Members with role: ${membersWithRole.join(', ')}`);

        for (const member of roleToRemove.members.values()) {
          await member.roles.remove(roleToRemove);
          console.log(`Removed role "${roleName}" from user ${member.user.tag}`);
        }
      }

      await interaction.editReply(`Removed role "${roleName}" from all users.`);
    } catch (error) {
      console.error('Error removing role:', error);
      await interaction.editReply('An error occurred while removing the role.');
    }
  },

  // deleted: true,
  name: 'unshame',
  description: 'Removes the Glorious Snow and Shame roles',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  
  // callback: (client, interaction) => {
  //   interaction.reply('Time to unshame!');
  // },
};
