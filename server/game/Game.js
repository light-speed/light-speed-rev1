
module.exports = class Game {
  constructor(socketId) {
    this.socketId = socketId
    this.startedAt = undefined
    this.gameTimeMs = 5000
    this.ongoing = false
  }

  addTime(timeMs) {
    this.gameTimeMs += timeMs
  }

  start(gameEngine) {
    this.ongoing = true 
    this.startedAt = new Date()
    let outOfTime 

    this.addTime(10000)

    while (true) {
      outOfTime = new Date() - new Date(this.startedAt) >= this.gameTimeMs
      // console.log(outOfTime)
      if (outOfTime) {
        gameEngine.endGame(this.socketId)
        return
      }
    }
  }

  end() {
    console.log('instance ended game')
    this.gameTimeMs = 0
    this.ongoing = false
  }
}