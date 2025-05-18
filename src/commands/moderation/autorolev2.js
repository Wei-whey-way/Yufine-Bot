const { snowballServer, testServer } = require('../../../config.json');
const { Client, InteractionCollector, ApplicationCommandOptionType, PermissionFlagsBits, roleMention } = require('discord.js');
const ExcelJS = require('exceljs'); // npm install exceljs
const { google } = require('googleapis');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
    keyFile:'./google.json',
    scopes:['https://www.googleapis.com/auth/spreadsheets']
})

async function get_id(interaction){
  //Read in google sheets
  const sheets = google.sheets({version:'v4', auth});
  const spreadsheetId = '1GZvD0G-7_uWH-YtKzayMr5kstodDDgatO645l_Df0Y4';
  const range = 'Users';

  let userIds = {}
  let customRoles = []

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

        //Extract name and discord id
        const name = rows[i][0]
        let id = rows[i][1];
        userIds[name] = id;

        //Check for custom roles
        if (rows[i].length > 2){
          const role = rows[i].slice(2,4);
          customRoles.push({name, role});
        }
    }

    // console.log('CHECKING FUNCTION\nUser IDs', userIds, '\nCustom Roles', customRoles)
    return [ userIds, customRoles ];

  } catch (error) {
    console.error('Error reading custom roles:', error);
    await interaction.editReply('Uhoh Alusha has potato coding.');
    return;
  }
}

// async function get_custom_roles(interaction){
//   //Read in google sheets
//   const sheets = google.sheets({version:'v4', auth});
//   const spreadsheetId = '1GZvD0G-7_uWH-YtKzayMr5kstodDDgatO645l_Df0Y4';
//   // const range = 'Current Season!A1:AN35';
//   const range = 'Custom Roles';
//   customRoles = []

//   try{
//     const response = await sheets.spreadsheets.values.get({
//         spreadsheetId, range 
//     });
//     const rows = response.data.values;
//     // console.log(rows)

//     //Get each user's records
//     var rowsLength = rows.length;
//     for (var i=2; i < rowsLength; i++){
//         // console.log(rows[i])

//         //Extract name and records
//         const name = rows[i][0]
//         let role = rows[i].slice(1);

//         // console.log('(get_custom_roles) Pushing', name, role)
//         customRoles.push({name, role})
//     }

//     // //Save a copy of customroles for removerolls Doesnt work because creating file resets server
//     // fs.writeFile('./customRoles.json', JSON.stringify(customRoles), err => {
//     //   if(err){
//     //     console.error('Failure to save customrole file', err);
//     //   } else {
//     //     console.log('File written success!');
//     //   }
//     // });

//     return customRoles;

//   } catch (error) {
//     console.error('Error reading custom roles:', error);
//     await interaction.editReply('Uhoh Alusha has potato coding.');
//     return;
//   }
// }


async function read_gsheets(interaction, member_list, custom_roles, role_id_list){
  //Read in google sheets
  const sheets = google.sheets({version:'v4', auth});
  const spreadsheetId = '1GZvD0G-7_uWH-YtKzayMr5kstodDDgatO645l_Df0Y4';
  const range = 'Current Season!A1:AN35';
  history = []

  try{
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId, range 
    });
    const rows = response.data.values;
    // console.log('Readgsheets rows', rows)

    //Get each user's records
    var rowsLength = rows.length;
    for (var i=1; i < rowsLength; i++){
        // console.log(rows[i])

        //Extract name and records
        const name = rows[i][0]
        let records = rows[i].slice(1);

        //Make sure list has at least 3 records
        if (records.length < 3){
          records = records.reverse();
          while (records.length < 4){
            records.push('NA');
          }  
        }

        // console.log('Pushing', name, records)
        history.push({name, records})
    }

    // console.log('Readgsheets: history', history)

  } catch(error){
      console.error('error', error)
      return;
  }
  console.log('Readgsheets: Custom roles', custom_roles)

  //Role checker
  userRole = {}
  try{
    history.forEach(item =>{
      if (item.name === undefined){ return; } //Skip if undefined
      if (!(item.name in member_list)){ //Check if user is a current member
        console.log(item.name, "not in member list")
        return; 
      } 
      
      let role = "None";

      recentRecords = item.records.reverse();
      if (recentRecords[0] == "Win"){ //Give win roles
        //Check for custom roles
        const uniqueRole = custom_roles.find(role => role.name === item.name)

        // console.log('Readgsheets: Checking for unique role', uniqueRole, 'for', item.name)
        if (uniqueRole){
          role = uniqueRole.role[0];
          // role = uniqueRole['uniqueRole'][0];
        } else {
          role = "Glorious Penguin";
        }
        // console.log(`\tReadgsheets: Role for ${item.name} is ${role}`)
        
      } else if (recentRecords[0] == "Int"){
        role = "Fallen Shame"
      }

      // Append user id and role to the userRole dictionary
      // console.log(`Name: ${item.name} has role ${role}`);
      userRole[member_list[item.name]] = role;
      // console.log(`Appending ${role} to ${member_list[item.name]}`) //Debugging message
      
      
    });

    // console.log('Debugging userRole: ', userRole)
      
    for (const [userID, role] of Object.entries(userRole)) { //Key is user
      console.log(userID, role)
      if (userID === undefined) {
        console.log('ERROR: for loop to communicate with discord has an undefined user')
        continue;
      }
          
      //Find out what role the user has
      const targetUser = await interaction.guild.members.fetch(userID); //This gives member information
      var currentRole = 'None';
      // console.log('aaaa')
      for (const [old_role, role_id] of Object.entries(role_id_list)){ //For loop to iterate through penguin roles dictionary to get current role
        if (currentRole !== 'None'){continue;}
        const hasRole = targetUser.roles.cache.has(role_id)
        if (hasRole) {
          console.log(targetUser, '\tHasrole: ', hasRole, old_role)
          currentRole = old_role;
        }
      }
          
      //Checks if current role matches with new role
      const name = targetUser.nickname || targetUser.user.globalName || targetUser.user.username
      // console.log('User current role:', currentRole, '. Check with new role:', role)
      
      let isUniqueRole = false;
      let uniqueRoleId = null;
      if ((role == "None") || (role == "Glorious Penguin") || (role == "Fallen Shame")) {
        // console.log("Non unique role")
        isUniqueRole = false;
      } else{
        let uniqueRole = role
        uniqueRole = custom_roles.find(role => role.role[0] === uniqueRole)
        uniqueRoleId = uniqueRole.role[1];
        // console.log("Unique role has id", uniqueRoleId)
        isUniqueRole = true;
        
      }

      if(currentRole === role){
        // console.log(`${name} retains ${currentRole}`)
        role_messsage.push(`${name}: ${role}`);
      } else{
        // console.log(`Need to change ${name}'s role`)
        role_messsage.push(`${name}: ${role}. Previously ${currentRole}`);

        //Remove previous role from user
        if(currentRole !== "None"){
          // if (isUniqueRole === false) {
          //   await targetUser.roles.remove(role_id_list[currentRole]);
          // } else {
          //   await targetUser.roles.remove(uniqueRoleId);
          // } 
          await targetUser.roles.remove(role_id_list[currentRole]);
          if (isUniqueRole === true) {
            await targetUser.roles.remove(uniqueRoleId);
          } 
        }
              
        //Add new role to user
        if(role !== "None"){
          if (isUniqueRole === false) {
            await targetUser.roles.add(role_id_list[role]);
          } else {
            await targetUser.roles.add(uniqueRoleId);
            await targetUser.roles.add(role_id_list["Glorious Penguin"]);
          }
          
          // console.log(`Replaced ${currentRole} with ${role} for ${name}`)
        }
      }
      console.log()

    }

    // Send a reply to the user (you can modify this as needed)
    // await interaction.deferReply();
    await interaction.editReply(`Changelog for Igloo Roles:\n${role_messsage.join('\n')}`);
    // await interaction.editReply(`Still debugging`);
        
  } catch (error) {
    console.error('Error reading file:', error);
    await interaction.editReply('Uhoh Alusha has potato coding.');
  }
}

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  
  
  callback: async (client, interaction) => {
    const guild = client.guilds.cache.get(snowballServer);

    await interaction.deferReply();
    await interaction.editReply('Starting command...')
    
    // Check if user is in Mini-Balls
    const allowedRole = interaction.guild.roles.cache.find((role) => role.name === 'Mini-Balls');

    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member || !member.roles.cache.has(allowedRole.id)) {
      await interaction.editReply("Only judges can access this command");
      return;
    }

    //Get custom roles from google sheets
    // var custom_roles = await get_custom_roles(interaction); //Await to ensure it finishes
    const [ member_list, custom_roles ] = await get_id(interaction);
    // console.log('User ids', member_list, '\nCustom roles', custom_roles)

    //Get member list
    // const memberList = JSON.parse(fs.readFileSync('./member_list.json', 'utf-8'));
    // const jsonString = fs.readFileSync('./memberList.json', 'utf-8');
    // const member_list = JSON.parse(jsonString);
    // console.log('Member list', member_list)

    role_id_list = {
      // "Legend's Attic": '725310473620160522',
      'Glorious Penguin': '1161522138344325120',
      'Fallen Shame': '1268365962231546007'
      // 'Monkey King': '1263175766691020883',
      // "Kizuna-ai Less": '1308438582805004298',
      // "Lua Enjoyer": '1309599756414222378',
      // 'Bonkas': '1311635084637638697',
      // "Best Boi": '1275879340936269896',
      // "Garnet": '1278530312753774653',
      // "Mellona Lover": '1310906368466747392',
      // "Snowbol's Supreme": '1278622292691259495',
      // "Pumpkin": '1273017049769316503',
      // "Zen": '1278182217549480022'
    }

    role_messsage = []

    await read_gsheets(interaction, member_list, custom_roles, role_id_list);
  },

  name: 'autorolev2',
  description: "Judge powers... activate!!!!!!!!!! (Now with google api)",
  // deleted: true,
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [],
  // permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};