module.exports = (io, gameEngine) => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      gameEngine.endGame(socket.id)
    })


    // game logic
    socket.on('add-points', amount => {
      gameEngine.addPoints(socket.id, amount)
    })

    socket.on('new-game', userId => {
      gameEngine.newGame(socket.id, userId)
    })

    socket.on('game-over', () => {
      gameEngine.endGame(socket.id, false)
    })

    socket.on('add-time', timeMs => {
      gameEngine.addTime(socket.id, timeMs)
    })

    socket.on('pause-game', () => {
      gameEngine.pauseGame(socket.id)
    })

    socket.on('unpause-game', () => {
      gameEngine.unpauseGame(socket.id)
    })

  })
}
