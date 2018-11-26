const Game = require('./Game')

module.exports = class GameEngine {
  constructor(sockets) {
    this.sockets = sockets
    this.games = {}
  }

  newGame(socketId) {
    const game = new Game(socketId)
    this.games[socketId] = game

    // start the game giving it an end game callback
    game.start(this)
  }

  endGame(socketId, serverSays=true) {
    this.games[socketId].end()
    if (serverSays) this.sockets.emit('game-over')
  }

}