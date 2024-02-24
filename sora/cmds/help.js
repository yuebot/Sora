module.exports = {
  config: {
    name: "help",
    aliases: "h",
    description: "Shows the available commands",
    author: "Rui",
    usage: "help [cmd]",
    role: 0,
  },
  onRun: async ({ message, fonts, args }) => {
    const botPrefix = global.Sora.botPrefix;
    const commands = Object.values(global.Sora.cmds);
    const arg = args.join(" ");

    if (!arg) {
      const formattedCommands = commands.map((cmd) => {
        const roleIndicator =
          cmd.config.role === 1 || cmd.config.role === 2 ? "👑 | " : "";
        return `│ ${roleIndicator}${fonts.applyFont(
          cmd.config.name,
          "bold",
        )} - ${cmd.config.description || "No description available"}`;
      });

      const helpMessage = `
╭─────────────⭓
⭔ Available Commands ⭔
├──────────────────
${formattedCommands.join("\n")}
╰─────────────⭓`;

      message.reply(helpMessage);
    } else {
      const targetCommand = commands.find(
        (cmd) => cmd.config.name === arg.toLowerCase(),
      );

      if (targetCommand) {
        const roleIndicator =
          targetCommand.config.role === 1 || targetCommand.config.role === 2
            ? "👑 | "
            : "";
        const helpMessage = `
╭────────────────⭓
⭔ Command Details ⭔
├─────────────────
│ ${roleIndicator}Name: ${fonts.applyFont(targetCommand.config.name, "bold")}
│ Description: ${targetCommand.config.description || "No description available"}
│ Author: ${targetCommand.config.author || "Unknown"}
│ Usage: ${botPrefix}${targetCommand.config.usage || "Not specified"}
╰────────────────⭓`;

        message.reply(helpMessage);
      } else {
        message.reply(`❌ | Command "${arg}" not found.`);
      }
    }
  },
};
