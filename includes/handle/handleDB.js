const { models } = require('../SoraDB/models');

async function handleDB({ event }) {
  const { senderID, threadID } = event;

  try {
    let user = await models.User.findOne({ where: { userID: senderID } });

    if (!user) {
      const userInfo = await api.getUserInfo(senderID);
      user = await models.User.create({
        userID: senderID,
        name: userInfo.name,
        gender: userInfo.gender,
        vanity: userInfo.vanity,
      });
    }

    let thread = await models.Thread.findOne({ where: { threadID } });

    if (!thread) {
      const threadInfo = await api.getThreadInfo(threadID);
      thread = await models.Thread.create({
        threadID,
        threadName: threadInfo.threadName,
        adminIDs: threadInfo.adminIDs,
        imageSrc: threadInfo.imageSrc,
        members: threadInfo.members,
        isGroup: threadInfo.isGroup,
      });
    }
  } catch (error) {
    console.error(`Error in handleDB: ${error}`);
  }
}

module.exports = { handleDB };