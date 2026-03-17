const path = require('path');
const getAllFiles = require('../utils/getAllFiles');

module.exports = (client, eventsPath) => {
    const eventFolders = getAllFiles(eventsPath, true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => (a > b ? 1 : -1));

        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

        client.on(eventName, async (...args) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, ...args);
            }
        });
    }
};
