const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  class ThreadModel extends Model {}
  ThreadModel.init(
    {
      threadID: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      threadName: DataTypes.STRING,
      adminIDs: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      imageSrc: DataTypes.STRING,
      members: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      banned: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      settings: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      data: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      isGroup: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Thread",
    },
  );

  return ThreadModel;
};
