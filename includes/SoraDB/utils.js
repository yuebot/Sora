const {
  getThreadData,
  updateThreadData,
  listThreads,
  addThreadToDB,
  findThread,
  addThread,
} = require("./controllers/threadController");
const {
  getUserData,
  updateUserData,
  listUsers,
  getUserInfo,
  addUserToDB,
  findUser,
  addUser,
} = require("./controllers/userController");

module.exports = {
  userController: {
    getUserData,
    updateUserData,
    listUsers,
    getUserInfo,
    addUserToDB,
    findUser,
    addUser,
  },
  threadController: {
    getThreadData,
    updateThreadData,
    listThreads,
    addThreadToDB,
    findThread,
    addThread,
  },
};
