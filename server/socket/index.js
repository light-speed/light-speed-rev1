module.exports = (io, gameEngine) => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
      gameEngine.endGame(socket.id)
    })


    // game logic
    socket.on('add-points', amount => {
      gameEngine.addPoints(socket.id, amount)
    })

    socket.on('new-game', userId => {
      console.log('client says new game')
      console.log('userid:', userId)
      gameEngine.newGame(socket.id, userId)
    })

    socket.on('game-over', () => {
      console.log('client says game over')
      gameEngine.endGame(socket.id, false)
    })

    socket.on('add-time', timeMs => {
      gameEngine.addTime(socket.id, timeMs)
    })


  })
}
