const { snowballServer } = require('../../../config.json');
const { Client, InteractionCollector, ApplicationCommandOptionType, PermissionFlagsBits, roleMention } = require('discord.js');
const ExcelJS = require('exceljs'); // npm install exceljs
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
    keyFile:'./google.json',
    scopes:['https://www.googleapis.com/auth/spreadsheets']
})

async function read_gsheets(client, interaction, member_list, custom_roles, role_id_list){
  //Read in google sheets
  const sheets = google.sheets({version:'v4', auth});
  const spreadsheetId = '1GZvD0G-7_uWH-YtKzayMr5kstodDDgatO645l_Df0Y4';
  const range = 'Current Season!A1:AN35';
  // const range = 'Debug';
  history = []

  try{
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId, range 
    });
    const rows = response.data.values;
    // console.log(rows)

    //Get each user's records
    var rowsLength = rows.length;
    for (var i=1; i < rowsLength; i++){
        // console.log(rows[i])

        //Make sure list has at least 4 elements
        while (rows[i].length < 4){
          rows[i].push('NA');
        }

        //Extract name and last 3 records
        const name = rows[i][0]
        const records = rows[i].slice(-3).reverse();

        // console.log('Pushing', name, records)
        history.push({name, records})
    }

    console.log(history)

  } catch(error){
      console.error('error', error)
      return;
  }

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

      recentRecords = item.records
      if (recentRecords[0] == "Win"){ //Give win roles
        //Check for custom roles
        if (custom_roles[member_list[item.name]] == undefined){
          role = "Glorious Penguin";
        } else {
          role = custom_roles[member_list[item.name]]
        }
        console.log(`Role for ${item.name} is ${role}`)
        
      } else if (recentRecords[0] == "Int"){
        role = "Fallen Shame"
      }

      // Append user id and role to the userRole dictionary
      // console.log(`Name: ${item.name} has role ${role}`);
      userRole[member_list[item.name]] = role;
      // console.log(`Appending ${role} to ${member_list[item.name]}`) //Debugging message
      
      
    });

    console.log('Debugging userRole: ', userRole)
      
    for (const [userID, role] of Object.entries(userRole)) { //Key is user
      console.log(userID, role)
      if (userID === undefined) {
        console.log('ERROR: for loop to communicate with discord has an undefined user')
        continue;
      }
          
      const targetUser = await interaction.guild.members.fetch(userID); //This gives member information

      // console.log(targetUser)
          
      //Find out what role the user has
      var currentRole = 'None';
      // console.log('aaaa')
      for (const [old_role, role_id] of Object.entries(role_id_list)){ //For loop to iterate through penguin roles dictionary to get current role
        if (currentRole !== 'None'){continue;}
        const hasRole = targetUser.roles.cache.has(role_id)
        if (hasRole) {
          // console.log('\tHasrole: ', hasRole, old_role)
          currentRole = old_role;
        }
      }
          
      //Checks if current role matches with new role
      const name = targetUser.nickname || targetUser.user.globalName || targetUser.user.username
      // console.log('User current role:', currentRole, '. Check with new role:', role)
      if(currentRole === role){
        // console.log(`${name} retains ${currentRole}`)
        role_messsage.push(`${name}: ${role}`);
      } else{
        // console.log(`Need to change ${name}'s role`)
        role_messsage.push(`${name}: ${role}. Previously ${currentRole}`);

        //Remove previous role from user
        if(currentRole !== "None"){
          await targetUser.roles.remove(role_id_list[currentRole]);
        }
              
        //Add new role to user
        if(role !== "None"){
          await targetUser.roles.add(role_id_list[role]);
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
    await interaction.editReply('Now assigning roles...')
    
    // Check if user is in Mini-Balls
    const allowedRole = interaction.guild.roles.cache.find((role) => role.name === 'Mini-Balls');

    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member || !member.roles.cache.has(allowedRole.id)) {
      await interaction.editReply("Only judges can access this command");
      return;
    }

    const member_list = {
      Adela: "300915950658519041",
      Aikeyy: "605893176942919711", 
      Apteron: "190837168548216832",
      Alusha: "595304306224136238",
      BumpkinX: "504661227830771714",
      Bondrewed: "993284270653177946",
      Byeolz: "570301927582203905",
      Celicious: "728512315141390397 ",
      Drakonia: "277643665349017601",
      Dreamcloudz: "193705720292704257",
      Ellude: "1099687227132489769",
      Fuji: "413274871821369344",
      Grossmeister: "573440262878134275",
      Hottie: "703175121493295144",
      Ka3deB: "710297761400225863",
      KhowGlong: "743857554144100373",
      Lucipherss: "505993334217637889",
      Miyaah: "846670147686498336",
      Raxfeil: "211742218325590017",
      Slaytina: "645058790307397652",
      SoGood: "135063919587885056",
      Shippoo351: "533688632779735060",
      SifDoge: "226019988203503617",
      throwgame: "406709602734964748",
      Venom: "411994925111050250",
      VKNN: "707823255121297450",
      wahtan: "622973408560545792",
      WutangInaMo: "152470043547009024",
      Zephiel: "665389899444256778",
    }

    const old_members = {
      Piku: "174864769398996992",
      zhxu: "241946143318212610",
      Bishamone: "846608070778814474",
      MikeMoe: "357128708164681730",
      Chroma: "295162650869104642",
      Steinway: "120363962708525056",
      Saber63: "227008902338838528",
      SavaKilla: "421911301095292930",
      PumpkinX: "162969225676193792",
      AuroraSG: "200948535930126337",
    }
    
    const custom_roles = {
      "595304306224136238": "Monkey King", //Alusha, Monkey King
      "413274871821369344": "Kizuna-ai Less", //Fuji	Kizuna-ai Less
      "573440262878134275": "Lua Enjoyer", // Grossmeister	Lua Enjoyer
      "846670147686498336": "Bonkas", // Miyaah	Bonkas
      "226019988203503617": "Best Boi", // SifDoge	Best Boi
      "645058790307397652": "Garnet", // Slaytina	Garnet
      "411994925111050250": "Mellona Lover", // V3nom	Mellona Lover
      "193705720292704257": "Snowbol's Supreme", // Dreamcloudz	Snowbol's Supreme
      "211742218325590017": "Pumpkin", // Raxfeil	Pumpkin
      "622973408560545792": "Zen", // Wahtan	Zen
    }

    role_id_list = {
      // "Legend's Attic": '725310473620160522',
      'Glorious Penguin': '1161522138344325120',
      'Fallen Shame': '1268365962231546007',
      'Monkey King': '1263175766691020883',
      "Kizuna-ai Less": '1308438582805004298',
      "Lua Enjoyer": '1309599756414222378',
      'Bonkas': '1311635084637638697',
      "Best Boi": '1275879340936269896',
      "Garnet": '1278530312753774653',
      "Mellona Lover": '1310906368466747392',
      "Snowbol's Supreme": '1278622292691259495',
      "Pumpkin": '1273017049769316503',
      "Zen": '1278182217549480022'
    }

    role_messsage = []

    read_gsheets(client, interaction, member_list, custom_roles, role_id_list);

    await interaction.editReply("Nothing crashed!");
    
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
