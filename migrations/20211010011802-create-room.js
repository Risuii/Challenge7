'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      player1: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'user_games',
            schema: 'public'
          },
          key: 'id'
        }
      },
      player2: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'user_games',
            schema: 'public'
          },
          key: 'id'
        }
      },
      choice1: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      choice2: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rooms');
  }
};