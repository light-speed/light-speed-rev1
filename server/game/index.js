const Game = require('./Game')

module.exports = class GameEngine {
  constructor(sockets) {
    this.sockets = sockets
    this.games = {}
  }

  async gameLoop() {
    const pauseMs = timeMs => 
      new Promise(resolve => setTimeout(resolve, timeMs))

    let current, last = ''
    const gamesArr = () => {
      current = JSON.stringify(this.games)
      if (last !== current) console.log(current)
      last = current

      return Object.keys(this.games)
        .map(key => this.games[key])
    }

    while (true) {
      gamesArr().forEach(game => {
        console.log(game)
        if (game.ongoing) {
          const outOfTime = new Date() - new Date(game.startedAt) >= game.gameTimeMs
          if (outOfTime) this.endGame(game.socketId)
        }
      })
      await pauseMs(990)
    }
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