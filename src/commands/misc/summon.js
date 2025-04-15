const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile:'./google.json',
  scopes:['https://www.googleapis.com/auth/spreadsheets']
})

async function get_heroes(){
  //Read in google sheets
  const sheets = google.sheets({version:'v4', auth});
  const spreadsheetId = '1YuoDQO8hzz44Bo7Dva2wTUKPlvZhfeATU0m2RA6hY_M';
  const range = 'Hero Library';
  let fire = []
  let ice = []
  let earth = []
  let light = []
  let dark = []

  try{
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId, range 
    });
    const rows = response.data.values;
    // console.log(rows)

    //Get each user's records
    var rowsLength = rows.length;
    for (var i=1; i < rowsLength; i++){
        // console.log(rows[i], rows[i].length)

        //Extract name, rarity and element
        const name = rows[i][0];
        const rarity = rows[i][1];
        const element = rows[i][2];
        let limited = false;
        let availability = true;

        if (rows[i].length == 4){
          switch(rows[i][3]){
            case 'Unavailable':
              availability = false;
              break;
            case 'Yes':
              limited = true;
              break;
          }
        }
        
        if (availability === true){
          switch(element){
            case 'Fire':
              fire.push([name, rarity, limited]);
              break;
            case 'Earth':
              earth.push([name, rarity, limited]);
              break;
            case 'Ice':
              ice.push([name, rarity, limited]);
              break;
            case 'Light':
              light.push([name, rarity, limited]);
              break;
            case 'Dark':
              dark.push([name, rarity, limited]);
              break;
          }
        }
    }

    return { fire, ice, earth, light, dark };

  } catch (error) {
    console.error('Error reading hero library', error);
    await interaction.editReply('Uhoh Alusha has potato coding.');
    return;
  }
}

async function heroRarity(unit_pool){
  const hero = unit_pool[Math.floor(Math.random() * unit_pool.length)];

  return hero;
}

async function summonConvenant(fire, ice, earth, light, dark) {
  //Create rgb and ml pull and remove limited heroes
  let combined_rgb = fire.concat(ice, earth);
  let combined_ml = light.concat(dark);
  combined_rgb = combined_rgb.filter(item => item[2] === false);
  combined_ml = combined_ml.filter(item => item[2] === false);

  const heroes_rgb = combined_rgb.reduce((acc, [name, rarity, _]) => {
    if (!acc[rarity]) {
      acc[rarity] = [];
    }
    acc[rarity].push(name);
    return acc;
  }, {});

  const heroes_ml = combined_ml.reduce((acc, [name, rarity, _]) => {
    if (!acc[rarity]) {
      acc[rarity] = [];
    }
    acc[rarity].push(name);
    return acc;
  }, {});

  // console.log(heroes_ml)

  // console.log(fire_nonlimited)
  let rng = Math.random() * 100;
  
  if (rng < 51.75) {
    // Summon Hero
    let heroRng = Math.random() * 100;

    if (heroRng < 0.15) { //ML5
      // console.log(heroes_ml['5'])
      return heroRarity(heroes_ml['5']);
    } else if (heroRng < 0.15 + 0.5) { //ML4
      // console.log(heroes_ml['4'])
      return heroRarity(heroes_ml['4']);
    } else if (heroRng < 0.15 + 0.5 + 4.35) { //ML3
      // console.log(heroes_ml['3'])
      return heroRarity(heroes_ml['3']);
    } else if (heroRng < 0.15 + 0.5 + 4.35 + 1.25) { //5 star
      // console.log(heroes_rgb['5'])
      return heroRarity(heroes_rgb['5']);
    } else if (heroRng < 0.15 + 0.5 + 4.35 + 1.25 + 4.5) { //4 star
      // console.log(heroes_rgb['4'])
      return heroRarity(heroes_rgb['4']);
    } else { //3 star
      // console.log(heroes_rgb['3'])
      return heroRarity(heroes_rgb['3']);
    }

  } else {
    // Summon Artifact
    let artifactRng = Math.random() * 100;

    if (artifactRng < 1.75) {
      return "Artifact ★★★★★ (not implemented yet)";
    } else if (artifactRng < 1.75 + 6.5) {
      return "Artifact ★★★★ (not implemented yet)";
    } else {
      return "Artifact ★★★ (not implemented yet)";
    }
  }
}

async function summonML(light, dark) {
  //Create ml pull and remove limited heroes
  let combined_ml = light.concat(dark);
  combined_ml = combined_ml.filter(item => item[2] === false);
  const heroes_ml = combined_ml.reduce((acc, [name, rarity, _]) => {
    if (!acc[rarity]) {
      acc[rarity] = [];
    }
    acc[rarity].push(name);
    return acc;
  }, {});

  // console.log(heroes_ml)

  // Summon Hero
  let heroRng = Math.random() * 100;
  if (heroRng < 2.5) { //ML5
    return heroRarity(heroes_ml['5']);
  } else if (heroRng < 2.5 + 27.5) { //ML4
    return heroRarity(heroes_ml['4']);
  } else { //ML3
    return heroRarity(heroes_ml['3']);
  }
}

module.exports = {
    name: 'summon',
    description: "It's time for gacha!",
    //devOnly: Boolean,
    // testOnly: true,
    options: [
        {
          name: 'summon-type',
          description: 'Type of summon',
          required: true,
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: 'Covenant Summons',
              value: 'Covenant',
            },
            // {
            //   name: 'Elemental Summons',
            //   value: 'Fire',
            // },
            // {
            //   name: 'Elemental Summons',
            //   value: 'Ice',
            // },
            // {
            //   name: 'Elemental Summons',
            //   value: 'Earth',
            // },
            // {
            //   name: 'Elemental Summons',
            //   value: 'Light',
            // },
            // {
            //   name: 'Elemental Summons',
            //   value: 'Dark',
            // },
            {
              name: 'Moonlight Summons',
              value: 'ML',
            },
          ]
        },
        {
          name: 'number-pulls',
          description: 'Number of pulls',
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: 'Single pull',
              value: 'Single',
            },
            {
              name: 'Multi pull',
              value: 'Multi',
            }
          ],
          required: true,
        },
      ],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        await interaction.editReply('Now summoning...')
        
        const summon_type = interaction.options.get('summon-type').value;
        const num_pulls = interaction.options.get('number-pulls').value;
        let result = ""

        const { fire, ice, earth, light, dark } = await get_heroes();
        
        // console.log(summon_type, num_pulls)

        switch(summon_type){
          case 'Covenant':
            switch(num_pulls){
              case 'Single':
                result = await summonConvenant(fire, ice, earth, light, dark);
                await interaction.editReply(result);
                break;
                
              case 'Multi':
                result = await summonConvenant(fire, ice, earth, light, dark);
                
                for (let i=0; i<9; i++){
                  result = result + "\n" + await summonConvenant(fire, ice, earth, light, dark);
                }
    
                await interaction.editReply(result);
                break;
            }
            return;  
          
          case 'ML':
            switch(num_pulls){
              case 'Single':
                result = await summonML(light, dark);
                await interaction.editReply(result);
                break;
                
              case 'Multi':
                result = await summonML(light, dark);
                
                for (let i=0; i<9; i++){
                  result = result + "\n" + await summonML(light, dark);
                }
    
                await interaction.editReply(result);
                break;
            }  
            return;
        }

        
        
        
        
    },
};