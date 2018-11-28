const {Game} = require('../db/models')

module.exports = class GameInstance {
  constructor(socketId, userId) {
    this.socketId = socketId
    this.startedAt = undefined
    this.gameTimeMs = 35000
    this.ongoing = false
    this.score = 0
    this.userId = userId
    this.lastPointGain = new Date()
    this.cheating = false
    this.suspiscion = 0
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
    if (new Date - new Date(this.lastPointGain) < 212) {
      this.suspiscion++
    }

    if (amount > 100) this.cheating = true
    
    this.score += amount
    this.lastPointGain = new Date()
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
    // if (this.suspiscion > 10) this.cheating = true
    // if (this.cheating) this.score = 0
    this.gameTimeMs = 0
    this.ongoing = false
    Game.create({
      score: this.score,
      userId: this.userId,
      date: this.startedAt
    })
  }
}
