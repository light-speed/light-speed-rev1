
module.exports = class Game {
  constructor(socketId) {
    this.socketId = socketId
    this.startedAt = undefined
    this.gameTimeMs = 30000
    this.ongoing = false
    this.score = 0
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
    console.log(`instance ${this.socketId} game over`)
    this.gameTimeMs = 0
    this.ongoing = false
  }
}