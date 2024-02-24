function findCommandWithOnReply(repliedMessage) {
  const commands = Object.values(global.Sora.cmds);

  for (const cmd of commands) {
    if (cmd.onReply && cmd.onReply(repliedMessage)) {
      return cmd;
    }
  }

  return null;
}

function handleReply({ event }) {
  const repliedMessage = event.messageReply;
  const command = findCommandWithOnReply(repliedMessage);

  if (command && command.onReply) {
    const { api, event, message, fonts } =

    command.onReply({ api, event, message, fonts });
  }
}

module.exports = { handleReply };