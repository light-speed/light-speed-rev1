const {Game} = require('../db/models')

module.exports = class GameInstance {
  constructor(socketId, userId) {
    this.socketId = socketId
    this.startedAt = undefined
    this.gameTimeMs = 45000
    this.ongoing = false
    this.score = 0
    this.userId = userId
  }

  pause() {
    this.ongoing = false
    
    const timeSoFar = new Date - new Date(this.startedAt)
    const timeRemaining = this.gameTimeMs - timeSoFar

    this.gameTimeMs = timeRemaining
  }

  unpause() {
    this.ongoing = true
    this.startedAt = new Date()
  }

  addPoints(amount) {
    if (amount > 100) amount = 0
    this.score += amount
  }

  addTime(timeMs) {
    this.gameTimeMs += timeMs
  }

  start() {
    this.ongoing = true
    this.score = 0
    this.startedAt = new Date()
  }

  end() {
    this.gameTimeMs = 0
    this.ongoing = false
    Game.create({
      score: this.score,
      userId: this.userId,
      date: this.startedAt
    })
  }
}
