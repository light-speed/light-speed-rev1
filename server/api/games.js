const router = require('express').Router()
const Sequelize = require('sequelize')
const {User} = require('../db/models')
const {Game} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await Game.findAll({
      include: [User],
      order: [['score', 'DESC']]
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
