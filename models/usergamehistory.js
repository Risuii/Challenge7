'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGameHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserGameHistory.init({
    user_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    result: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserGameHistory',
    tableName: 'user_game_histories',
  });
  return UserGameHistory;
};