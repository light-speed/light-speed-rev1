
module.exports = class Game {
  constructor(socketId) {
    this.socketId = socketId
    this.startedAt = undefined
    this.gameTimeMs = 30000
    this.ongoing = false
  }

  addTime(timeMs) {
    this.gameTimeMs += timeMs
  }

  start() {
    this.ongoing = true 
    this.startedAt = new Date()
  }

  end() {
    console.log('instance ended game')
    this.gameTimeMs = 0
    this.ongoing = false
  }
}