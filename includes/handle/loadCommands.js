const fs = require("fs");
const path = require("path");

function loadCommands() {
  const commands = {};

  const commandsDirectory = path.join(process.cwd(), "sora", "cmds");

  const commandFiles = fs
    .readdirSync(commandsDirectory)
    .filter((file) => file.endsWith(".js") && file !== "loadCommands.js");

  for (const file of commandFiles) {
    const commandConfig = require(path.join(commandsDirectory, file));

    if (isValidCommandConfig(commandConfig)) {
      commands[commandConfig.config.name] = {
        config: commandConfig.config,
        onRun: commandConfig.onRun,
      };
    } else {
      console.error(`Invalid command configuration in file: ${file}`);
    }
  }

  return commands;
}

function isValidCommandConfig(config) {
  return (
    config &&
    config.config &&
    config.config.name &&
    config.config.aliases &&
    config.config.description &&
    config.config.author &&
    (config.config.role === 0 || config.config.role === 1) &&
    config.onRun
  );
}

module.exports = { loadCommands };
