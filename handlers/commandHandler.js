const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const commandsPath = path.join(__dirname, '..', 'commands');

  const loadCommands = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      if (fs.statSync(filePath).isDirectory()) {
        loadCommands(filePath);
      } else if (file.endsWith('.js')) {
        const command = require(filePath);

        if (!command.data || !command.execute) {
          console.warn(`⚠️ Invalid command file: ${file}`);
          continue;
        }

        client.commands.set(command.data.name, command);
      }
    }
  };

  loadCommands(commandsPath);

  console.log(`✅ Loaded ${client.commands.size} commands`);
};
