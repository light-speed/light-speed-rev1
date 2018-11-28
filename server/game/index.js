const Game = require('./Game')

module.exports = class GameEngine {
  constructor(sockets) {
    this.sockets = sockets
    this.games = {}
  }

  pauseGame(socketId) {
    if (this.games[socketId]) {
      this.games[socketId].pause()
    }

  }

  unpauseGame(socketId) {
    if (this.games[socketId])
      this.games[socketId].unpause()
  }

  async gameLoop() {
    const pauseMs = timeMs => 
      new Promise(resolve => setTimeout(resolve, timeMs))

    const gamesArr = () => Object.keys(this.games)
      .map(key => this.games[key])

    while (true) {
      gamesArr().forEach(game => {
        if (game.ongoing) {
          // (new Date() - new Date(game.startedAt), game.gameTimeMs)
          const timeSoFar = new Date() - new Date(game.startedAt)
          const timeRemaining = game.gameTimeMs - timeSoFar
          const outOfTime = timeSoFar >= game.gameTimeMs
          this.sockets.emit('update-time', game.socketId, timeRemaining)
          if (outOfTime) this.endGame(game.socketId)
        }
      })
      await pauseMs(990)
    }
  }

  addPoints(socketId, amount) {
    if (this.games[socketId]) 
      this.games[socketId].addPoints(amount)
  }

  addTime(socketId, timeMs) {
    if (this.games[socketId]) 
      this.games[socketId].addTime(timeMs)
  }

  newGame(socketId, userId) {
    this.games[socketId] = new Game(socketId, userId)
    this.games[socketId].start()
  }

  endGame(socketId, serverSays=true) {
    if (this.games[socketId]) {
      this.games[socketId].end()
      if (serverSays) this.sockets.emit('game-over', socketId)
      
      // remove the game from the list
      const {[socketId]: _, ...otherGames} = this.games
      this.games = otherGames
    }
  }

}