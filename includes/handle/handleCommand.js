const { findCommand } = require("../SoraDB/utils");

function hasPermission(senderID, adminIDs, role) {
  if (role === 1) {
    return adminIDs.includes(senderID);
  } else if (role === 2) {
    return global.Sora.botAdmins.includes(senderID);
  }
  return true;
}

function handleCommand({ event }) {
  if (!event.body || !event.threadID) {
    return;
  }

  const normalizedBody = event.body.toLowerCase();
  const [command, ...args] = normalizedBody
    .slice(global.Sora.botPrefix.length)
    .trim()
    .split(" ");
  const foundCommand = findCommand(command) || Object.values(global.Sora.cmds).find(cmd => cmd.config.aliases && cmd.config.aliases.includes(command));

  if (foundCommand) {
    const { adminIDs, role } = event.threadID
      ? api.getThreadInfo(event.threadID)
      : { adminIDs: [], role: 0 };

    if (hasPermission(event.senderID, adminIDs, foundCommand.config.role)) {
      foundCommand.onRun({ event, args });
    } else {
      const errorMessage = `❌ | You don't have permission to use the command "${command}".`;
      event.reply(errorMessage);
    }
  } else {
    const errorMessage = `❌ | Command "${command}" not found. Try using ${global.Sora.botPrefix}help to see available commands.`;
    event.reply(errorMessage);
  }
}

module.exports = { handleCommand };