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
      await interaction.reply("Silly dookie, you can't unshame people");
      return;
    }

    const roleName = ['Shame', 'Glorious Snow', 'Repented Shame'];
    await interaction.deferReply();

    //Array to store members with shame and glorious snow roles
    const membersWithRoles = {};
    roleName.forEach((roleName) => {membersWithRoles[roleName] = [];});

    //Remove roles
    const rolesToRemove = roleName.map((roleName) => interaction.guild.roles.cache.find((role) => role.name === roleName));
    for (const role of rolesToRemove) {
      if (!role) {
          await interaction.editReply(`Role "${roleName}" not found.`);
          return;
      }
    }

    // console.log(`Roles to remove: ${rolesToRemove.map((role) => `${role.name} (${role.id})`).join(', ')}`);
    try {
      await interaction.guild.members.fetch();

      for (const roleToRemove of rolesToRemove){
        // const membersWithRole = roleToRemove.members.map((member) => member.user.tag);
        const membersWithRole = roleToRemove.members.map((member) => member.nickname || member.user.username) || [];
        // console.log(`Members with role ${roleToRemove.name}: ${membersWithRole.join(', ')}`);
        membersWithRoles[roleToRemove.name] = membersWithRole;
        // console.log(`${roleToRemove.name} gang: ${membersWithRoles[roleToRemove.name]}`);

        if (roleToRemove.name === 'Shame'){
          for (const member of roleToRemove.members.values()) {
            await member.roles.remove(roleToRemove);
            console.log(`Removed role "${roleToRemove.name}" from user ${member.user.tag}`);
          }
        }
      }

      //Display users with roles
      const gloriousSnowList = membersWithRoles['Glorious Snow'].join('\n');
      const repentedList = membersWithRoles['Repented Shame'].join('\n');
      const shameList = membersWithRoles['Shame'].join('\n');

      const gloriousSnowMessage = gloriousSnowList.length > 0 ? `\n**Glorious snow (Congrats to these peeps!):**\n${gloriousSnowList}` : '\nHuh? No one is in Glorious Snow?!? Judges must not be doing their jobs';
      const repentedMessage = repentedList.length > 0 ? `\n**Repented Shame (Graduated from Shame gang!):**\n${repentedList}` : '\nNo one graduated from Shame gang :(';
      const shameMessage = shameList.length > 0 ? `\n**Shame gang (See you next time Shame Dungeon!):**\n${shameList}` : '\nNo one is in Shame gang! Congrats Everyone!!! (Or maybe judges not doing their job)';
      await interaction.editReply(`Time to unshame everyone!\n${gloriousSnowMessage}\n${repentedMessage}\n${shameMessage}`);


    } catch (error) {
      console.error('Error removing role:', error);
      await interaction.editReply("Oopsies looks like Yufine can't unshame everyone :(");
    }
    
  },

  name: 'unshame',
  description: 'Removes Shame roles, and lists all users with shame glorious, ',
  // deleted: true,
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};