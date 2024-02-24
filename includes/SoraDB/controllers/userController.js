const { models } = require("../connectDB");

async function getUserData(req, res) {
  const { userID } = req.params;

  try {
    const user = await models.User.findOne({
      where: { userID },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateUserData(req, res) {
  const { userID } = req.params;
  const newData = req.body;

  try {
    const [updatedRows] = await models.User.update(newData, {
      where: { userID },
    });

    if (updatedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function listUsers(req, res) {
  try {
    const users = await models.User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getUserInfo(req, res) {
  const { userID } = req.params;

  try {
    const userInfo = await models.User.findOne({
      attributes: ["userID", "name", "exp", "money"],
      where: { userID },
    });

    if (userInfo) {
      res.json(userInfo);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function addUserToDB(req, res) {
  const userData = req.body;

  try {
    const newUser = await models.User.create(userData);
    res.json(newUser);
  } catch (error) {
    console.error("Error adding user to the database:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function findUser(userID) {
  const user = await models.User.findOne({
    where: { userID },
  });

  return user;
}

async function addUser(userData) {
  const newUser = await models.User.create(userData);
  return newUser;
}

module.exports = {
  getUserData,
  updateUserData,
  listUsers,
  getUserInfo,
  addUserToDB,
  findUser,
  addUser,
};
