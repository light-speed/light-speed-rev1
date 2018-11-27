const Sequelize = require('sequelize')
const db = require('../db')

const Game = db.define('game', {
  score: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  }
})

module.exports = Game
