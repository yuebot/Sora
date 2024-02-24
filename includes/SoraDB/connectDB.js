const { Sequelize } = require("sequelize");
const fs = require("fs-extra");
const UserModel = require("./models/UserModel");
const ThreadModel = require("./models/ThreadModel");

const sqliteFilePath = "./includes/SoraDB/data/sora.sqlite";

fs.ensureDirSync("./includes/SoraDB/data");

if (!fs.existsSync(sqliteFilePath)) {
  fs.ensureFileSync(sqliteFilePath);
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: sqliteFilePath,
  logging: false,
  synchronize: true,
});

const models = {
  User: UserModel(sequelize),
  Thread: ThreadModel(sequelize),
};

// Synchronize models with the database
sequelize.sync();

module.exports = { sequelize, models };