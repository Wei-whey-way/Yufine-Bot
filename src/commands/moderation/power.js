const { Client, InteractionCollector, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');
  
module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) =>{
    //Check if user is Alusha
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (member.id !== '595304306224136238'){
      await interaction.reply("You lack motivation");
      return;
    }

    const roleName = ["Legend's Attic", 'Mini-Balls'];
    await interaction.deferReply();

    //Find roles
    const rolesToAdd = roleName.map((roleName) => interaction.guild.roles.cache.find((role) => role.name === roleName));
    for (const role of rolesToAdd) {
      if (!role) {
          await interaction.editReply(`Role "${roleName}" not found.`);
          return;
      }
    }

    try {
      for (const role of rolesToAdd){
        const hasRole = interaction.member.roles.cache.has(role.id);
        if (hasRole) {
          await interaction.editReply(`You already this role!`);
          return;
        }
    
        await interaction.member.roles.add(role);
      }
      await interaction.editReply(`Alusha time to do your best again!`);
      return;

    } catch (error) {
      console.error('Error adding role:', error);
      await interaction.editReply("Oopsies looks like Yufine can't give you power Alusha :(");
    }
    
  },

  name: 'power',
  description: "Gives Alusha power",
  // deleted: true,
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [],
  // permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};