const { Client, InteractionCollector, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');
const { google } = require('googleapis');


async function get_custom_roles(interaction){
  //Read in google sheets
  const sheets = google.sheets({version:'v4', auth});
  const spreadsheetId = '1GZvD0G-7_uWH-YtKzayMr5kstodDDgatO645l_Df0Y4';
  // const range = 'Current Season!A1:AN35';
  const range = 'Custom Roles';
  customRoles = []

  try{
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId, range 
    });
    const rows = response.data.values;
    // console.log(rows)

    //Get each user's records
    var rowsLength = rows.length;
    for (var i=2; i < rowsLength; i++){
        // console.log(rows[i])

        //Extract name and records
        const name = rows[i][0]
        let role = rows[i].slice(1);

        // console.log('Pushing', name, records)
        customRoles.push({name, role})
    }
    return customRoles;

  } catch (error) {
    console.error('Error reading custom roles:', error);
    await interaction.editReply('Uhoh Alusha has potato coding.');
    return;
  }
}

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

    const roleName = ['Glorious Penguin', 'Fallen Shame'];
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
        console.log(`Members with role ${roleToRemove.name}: ${membersWithRole.join(', ')}`);
        membersWithRoles[roleToRemove.name] = membersWithRole;
        // console.log(`${roleToRemove.name} gang: ${membersWithRoles[roleToRemove.name]}`);

        for (const member of roleToRemove.members.values()) {
          await member.roles.remove(roleToRemove);
          console.log(`Removed role "${roleToRemove.name}" from user ${member.user.tag}`);
        }
      }

      //Print final message
      // const gloriousSnowMessage = gloriousSnowList.length > 0 ? `\nGlorious snow (Congrats to these peeps!):\n${gloriousSnowList}` : '\nHuh? No one is in Glorious Snow?!? Judges must not be doing their jobs';
      // const repentedMessage = repentedList.length > 0 ? `\nRepented Shame (Graduated from Shame gang!):\n${repentedList}` : '\nNo one graduated from Shame gang :(';
      // const shameMessage = shameList.length > 0 ? `\nShame gang (See you next time Shame Dungeon!):\n${shameList}` : '\nNo one is in Shame gang! Congrats Everyone!!!';
      await interaction.editReply(`Time to unshame everyone!`);

    } catch (error) {
      console.error('Error removing role:', error);
      await interaction.editReply("Oopsies looks like Yufine can't unshame everyone :(");
    }
  },

  name: 'removerolls',
  description: 'Removes rolls',
  // deleted: true,
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};