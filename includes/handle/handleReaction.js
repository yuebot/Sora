function handleReaction({ event, messageID, senderID }) {
  const reactionOccurred = event.reaction;

  return reactionOccurred;
}

module.exports = { handleReaction };