const { models } = require("../connectDB");

async function getThreadData(req, res) {
  const { threadID } = req.params;

  try {
    const thread = await models.Thread.findOne({
      where: { threadID },
    });

    if (thread) {
      res.json(thread);
    } else {
      res.status(404).json({ error: "Thread not found" });
    }
  } catch (error) {
    console.error("Error fetching thread data:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateThreadData(req, res) {
  const { threadID } = req.params;
  const newData = req.body;

  try {
    const [updatedRows] = await models.Thread.update(newData, {
      where: { threadID },
    });

    if (updatedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Thread not found" });
    }
  } catch (error) {
    console.error("Error updating thread data:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function listThreads(req, res) {
  try {
    const threads = await models.Thread.findAll();
    res.json(threads);
  } catch (error) {
    console.error("Error listing threads:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function addThreadToDB(req, res) {
  const threadData = req.body;

  try {
    const newThread = await models.Thread.create(threadData);
    res.json(newThread);
  } catch (error) {
    console.error("Error adding thread to the database:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function findThread(threadID) {
  const thread = await models.Thread.findOne({
    where: { threadID },
  });

  return thread;
}

async function addThread(threadData) {
  const newThread = await models.Thread.create(threadData);
  return newThread;
}

module.exports = {
  getThreadData,
  updateThreadData,
  listThreads,
  addThreadToDB,
  findThread,
  addThread,
};
