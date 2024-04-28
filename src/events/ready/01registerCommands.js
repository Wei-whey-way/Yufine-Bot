const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);
        // console.log('Local commands:', localCommands);
        
        for (const localCommand of localCommands){
            const {name, description, options} = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            // console.log('Hello');
            if (existingCommand){
                //To delete a command
                if (localCommand.deleted){
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command ${name}.`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)){
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });

                    console.log(`Edited command ${name}.`);
                }
            } else {
                // console.log('Hello else statement');
                if (localCommand.deleted) {
                    console.log(`Skipped registering command ${name} as it is set to delete`);
                    continue;
                }
                
                // console.log('Hello else statement1', name, description, options);
                //Run when command doesnt exist and is not set to be deleted
                await applicationCommands.create({ name, description, options });

                console.log(`Registered command ${name}`);
            }
            // console.log('Hello end');
        }
    } catch (error){
        console.log(`01registerCommands, There was an error: ${error}`);
    }
};