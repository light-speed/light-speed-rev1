const Game = require('./Game')

module.exports = class GameEngine {
  constructor(sockets) {
    this.sockets = sockets
    this.games = {}
  }

  async gameLoop() {
    const pauseMs = timeMs => 
      new Promise(resolve => setTimeout(resolve, timeMs))

    const gamesArr = () => Object.keys(this.games)
      .map(key => this.games[key])

    while (true) {
      gamesArr().forEach(game => {
        if (game.ongoing) {
          // console.log(new Date() - new Date(game.startedAt), game.gameTimeMs)
          const outOfTime = new Date() - new Date(game.startedAt) >= game.gameTimeMs
          if (outOfTime) this.endGame(game.socketId)
        }
      })
      await pauseMs(990)
    }
  }

  addTime(socketId, timeMs) {
    if (this.games[socketId]) 
      this.games[socketId].addTime(timeMs)
  }

  newGame(socketId) {
    this.games[socketId] = new Game(socketId)
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