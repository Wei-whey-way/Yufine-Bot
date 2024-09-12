const { snowballServer } = require('../../../config.json');
const { Client, InteractionCollector, ApplicationCommandOptionType, PermissionFlagsBits, roleMention } = require('discord.js');
const ExcelJS = require('exceljs'); // npm install exceljs

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const guild = client.guilds.cache.get(snowballServer);

    await interaction.deferReply();
    await interaction.editReply('Now assigning roles...')
    
    // Check if user is Alusha
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (member.id !== '595304306224136238' && member.id !== '1182142617157378099' && member.id !== '160847899373207552') {
      await interaction.editReply("Only judges can access this command");
      return;
    }
    
    const member_list = {
      Aikeyy: "605893176942919711", 
      Alusha: "595304306224136238",
      Apteron: "190837168548216832",
      AuroraSG: "200948535930126337",
      Bishamone: "846608070778814474",
      BumpkinX: "504661227830771714",
      Chroma: "295162650869104642",
      Dreamcloudz: "193705720292704257",
      Ellude: "1099687227132489769",
      Grossmeister: "573440262878134275",
      Ka3deB: "710297761400225863",
      Lucipherss: "505993334217637889",
      MikeMoe: "357128708164681730",
      KhowGlong: "743857554144100373",
      SavaKilla: "421911301095292930",
      PumpkinX: "162969225676193792",
      Raxfeil: "211742218325590017",
      Saber63: "227008902338838528",
      SifDoge: "226019988203503617",
      Slaytina: "645058790307397652",
      SoGood: "135063919587885056",
      Steinway: "120363962708525056",
      throwgame: "406709602734964748",
      Venom: "411994925111050250",
      wahtan: "622973408560545792",
      WutangInaMo: "152470043547009024",
      Zephiel: "665389899444256778",
      zhxu: "241946143318212610",
      Bondrewed: "993284270653177946",
      Byeolz: "570301927582203905"
    }

    const old_members = {
      Piku: "174864769398996992"
    }

    role_id_list = {
      'Noble Penguin': '1269406366909599755',
      'Glorious Penguin': '1161522138344325120',
      "Legend's Attic": '725310473620160522',
      'Fallen Shame': '1268365962231546007',
    }

    role_messsage = []

    // Initialize ExcelJS workbook
    const workbook = new ExcelJS.Workbook();
    try {
      // Read the Excel file
      await workbook.xlsx.readFile('gw_records/rolerecords.xlsx');

      // Access all sheets
      const sheets = workbook.worksheets;
      const allSheetData = [];

      sheets.forEach(sheet => {
        const sheetName = sheet.name;
        const sheetData = [];

        // Process each row in the sheet
        sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          if (rowNumber > 1){
            const filteredRow = row.values.slice(1); // Remove the first element which is null
            sheetData.push(filteredRow);
          }
        });

        allSheetData.push({ sheetName, data: sheetData });
      });

      // Example: Log all sheet data to console
      // console.log('All sheets data:', allSheetData);
      userRole = {}

      // Iterate through allSheetData to view content
      allSheetData.forEach(sheet => {
        // console.log(`Sheet: ${sheet.sheetName}`);
        // Loop through each row in the sheet
        sheet.data.forEach((row, index) => {
          // console.log(`Row ${index + 1}: ${JSON.stringify(row)}`);
          const name = row[0];

          //Skip if name is undefined
          // console.log('Debugging name: ', name)
          if (name === undefined){ return; }

          //Skip if name not in list
          if (!(name in member_list)){ return; }

          let recentRecords = row.slice(-3).reverse(); //Reverse order so latest record is first
          
          while (recentRecords.length < 3) {
            recentRecords.push("NA"); // Ensure there are exactly 3 values by adding "NA" if needed
          }
          
          let role = "None";

          //Check for role
          // console.log(`${name}: ${recentRecords}`)
          breakme: if (recentRecords[0] == "Win"){ //1 win (Win, ?, ?)
            if(recentRecords[1] == "Win"){ //2 wins (Win, Win, ?)
              if(recentRecords[2] == "Win"){ //3 wins (Win, Win, Win)
                role = "Legend's Attic";
              }
              else if (recentRecords[2] == "Int" || recentRecords[2] == "NA"){ //2 wins 1 loss (Win, Win, Loss)
                role = "Glorious Penguin"
              }
              else{
                // console.log('(2 wins) Error in checking for role. Not win, not int, or not NA')
                break breakme
              }
            }
            else if(recentRecords[1]=="Int" || recentRecords[1]=="NA"){ //1 win (Win, Loss, ?)
              role = "Noble Penguin"
            }
            else{
              // console.log('(1 win 1 loss) Error in checking for role. Not win, not int, or not NA')
              break breakme
            }
          }
          else if(recentRecords[0]=='Int'){ //1 loss (Lose, ?, ?)
            if(recentRecords[1]=='Win' && recentRecords[2]=='Win'){
              role = "Fallen Shame"
            }
          }

          if(member_list[name] == undefined){
            console.log(`ERROR: ${name} not in member_list`)
          }

          // Append user id and role to the userRole dictionary
          userRole[member_list[name]] = role;
          // console.log(`Appending ${role} to ${member_list[name]}`) //Debugging message

          //Insert role message (final product)
          // role_messsage.push(`${name}: ${role}`);
        });
      });

      console.log('Debugging userRole: ', userRole)

      //Get each user from their id
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
          // console.log('bbbb')
          const hasRole = targetUser.roles.cache.has(role_id)
          if (hasRole) {
            console.log('\tHasrole: ', hasRole, old_role)
            currentRole = old_role;
          }
          // console.log('cccc')
        }
        
        //Checks if current role matches with new role
        const name = targetUser.nickname || targetUser.user.globalName || targetUser.user.username
        // console.log('User current role:', currentRole, '. Check with new role:', role)
        if(currentRole === role){
          console.log(`${name} retains ${currentRole}`)
          role_messsage.push(`${name}: ${role}`);
        } else{
          console.log(`Need to change ${name}'s role`)
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
        // console.log()

        // userCurrentRole = targetUser.roles
        // console.log(targetUser.user.globalName, '\n with roles: ', userRoles)
      }

      // Send a reply to the user (you can modify this as needed)
      // await interaction.deferReply();
      await interaction.editReply(`Changelog for Igloo Roles:\n${role_messsage.join('\n')}`);
      // await interaction.editReply(`Still debugging`);
      

    } catch (error) {
      console.error('Error reading file:', error);
      await interaction.editReply('Uhoh Alusha has potato coding.');
    }
  },

  name: 'autorole',
  description: "Judge powers... activate!!!!!!!!!! (zhxu is judge)",
  // deleted: true,
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [],
  // permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
