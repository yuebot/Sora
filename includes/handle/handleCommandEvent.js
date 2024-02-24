const { models } = require('../SoraDB/models');
const { findCommand } = require('./utils');

const lang = {
  en: {
    insufficientPermissions: "❌ | You don't have sufficient permissions to execute this command.",
    commandNotFound: "❌ | Command not found. Use global.Sora.botPrefix + 'help' to see available commands.",
  },
  // Add more languages as needed
};

async function handleCommandEvent({ event, fonts, language }) {
  const { api, senderID, threadID, body } = event;
  const texts = lang[language] || lang.en;

  try {
    const normalizedBody = body.toLowerCase();
    const [command, ...args] = normalizedBody
      .slice(global.Sora.botPrefix.length)
      .trim()
      .split(' ');

    const foundCommand = findCommand(command);

    if (foundCommand) {
      if (foundCommand.config.role === 1) {
        const threadInfo = await api.getThreadInfo(threadID);
        if (!threadInfo.adminIDs.includes(senderID)) {
          return api.sendMessage(texts.insufficientPermissions, threadID);
        }
      }

      foundCommand.onRun({ api, event, args, fonts });
    } else {
      api.sendMessage(texts.commandNotFound, threadID);
    }
  } catch (error) {
    console.error(`❌ | Error in handleCommandEvent: ${error}`);
  }
}

module.exports = { handleCommandEvent };