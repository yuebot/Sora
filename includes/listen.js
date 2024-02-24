const chalk = require('chalk');
const applyFont = require('font-style');
const { userController, threadController } = require('./SoraDB/utils');
const { handleCommandEvent } = require('./includes/handle/handleCommandEvent');
const { handleReply } = require('./includes/handle/handleReply');
const { handleReaction } = require('./includes/handle/handleReaction');

async function findUser(userID) {
  const user = await userController.findUser(userID);
  return user;
}

async function findThread(threadID) {
  const thread = await threadController.findThread(threadID);
  return thread;
}

async function listen(api, event) {
  const message = {
    react: (emoji) => {
      api.setMessageReaction(emoji, event.messageID, () => {}, true);
    },
    reply: (msg) => {
      api.sendMessage(msg, event.threadID, event.messageID);
    },
    add: (uid) => {
      api.addUserToGroup(uid, event.threadID);
    },
    kick: (uid) => {
      api.removeUserFromGroup(uid, event.threadID);
    },
    send: (msg) => {
      api.sendMessage(msg, event.threadID);
    },
  };

  const stylesPath = path.join(__dirname, "fonts.json");
  const fontStyles = JSON.parse(fs.readFileSync(stylesPath, "utf8"));

  const fonts = {
    applyFont: (text, font) => {
      if (!fontStyles.hasOwnProperty(font)) {
        throw new Error(`Invalid font type: ${font}`);
      }
      const fontMapping = Object.fromEntries(
        [...fontStyles[font]].map((char, index) => [
          String.fromCharCode(65 + index),
          char,
        ]),
      );
      return [
        ...text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase(),
      ]
        .map((char) => fontMapping[char] || char)
        .join("");
    },
  };

  try {
    if (event.body) {
      const normalizedBody = event.body.toLowerCase();

      if (normalizedBody === "prefix") {
        message.reply(`Sora's prefix is: [ ${global.Sora.botPrefix} ]`);
      } else if (normalizedBody.startsWith(global.Sora.botPrefix)) {
        const [command, ...args] = normalizedBody
          .slice(global.Sora.botPrefix.length)
          .trim()
          .split(" ");
        const foundCommand = findCommand(command);

        if (foundCommand) {
          foundCommand.onRun({ api, event, args, message, fonts });
        } else {
          message.reply(
            `❌ | Invalid command, use ${global.Sora.botPrefix}help to see available commands.`,
          );
        }
      }

      const userExists = await findUser(event.senderID);
      if (!userExists) {
        const userInfo = await api.getUserInfo(event.senderID);
        userController.addUser({
          userID: event.senderID,
          name: userInfo.name,
          gender: userInfo.gender,
          vanity: userInfo.vanity,
        });
      }

      const threadExists = await findThread(event.threadID);
      if (!threadExists) {
        const threadInfo = await api.getThreadInfo(event.threadID);
        threadController.addThread({
          threadID: event.threadID,
          threadName: threadInfo.threadName,
          adminIDs: threadInfo.adminIDs,
          imageSrc: threadInfo.imageSrc,
          members: threadInfo.members,
          isGroup: threadInfo.isGroup,
        });
      }

      switch (event.type) {
        case "message":
        case "message_reply":
        case "message_unsend":
          handleCommandEvent({ event });
          handleReply({ event });
          handleReaction({ event, messageID: event.messageID, senderID: event.senderID });
          break;

        case "event":
          handleEvent({ event });
          break;

        case "message_reaction":
          handleReaction({ event, messageID: event.messageID, senderID: event.senderID });
          break;

        default:
          break;
      }
    }
  } catch (error) {
    console.error(
      chalk.red("❌ | Error occurred while handling event:", error),
    );
  }
}

function findCommand(command) {
  return Object.values(global.Sora.cmds).find((cmd) => {
    if (
      cmd.config.name === command ||
      (cmd.config.aliases && cmd.config.aliases.includes(command))
    ) {
      return true;
    }
    return false;
  });
}

module.exports = { listen };