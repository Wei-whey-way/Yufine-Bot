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

    const roleName = ["Legend's Attic"];
    await interaction.deferReply();

    //Find roles
    const rolesToRemove = roleName.map((roleName) => interaction.guild.roles.cache.find((role) => role.name === roleName));
    for (const role of rolesToRemove) {
      if (!role) {
          await interaction.editReply(`Role "${roleName}" not found.`);
          return;
      }
    }

    try {
      for (const role of rolesToRemove){
        const hasRole = interaction.member.roles.cache.has(role.id);
        if (!hasRole) {
          await interaction.editReply(`You don't have this role silly dookie!`);
          return;
        }
    
        await interaction.member.roles.remove(role);
      }
      await interaction.editReply(`**Bonk** No more power to Alusha `);
      return;

    } catch (error) {
      console.error('Error adding role:', error);
      await interaction.editReply("Oopsies looks like Yufine can't depower Alusha :(");
    }
    
  },

  name: 'unpower',
  description: "Gives Alusha no power",
  // deleted: true,
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [],
  // permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};