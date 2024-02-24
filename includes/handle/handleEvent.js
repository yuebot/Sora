function handleEvent({ api, event }) {
  const { senderID, threadID } = event;

  for (const [key, value] of global.client.events.entries()) {
    if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
      const eventRun = global.client.events.get(key);
      try {
        const eventContext = {
          api,
          event,
        };
        eventRun.run(eventContext);
      } catch (error) {
        console.error(`Error in handling event ${eventRun.config.name}: ${error}`);
      }
    }
  }
}

module.exports = { handleEvent };