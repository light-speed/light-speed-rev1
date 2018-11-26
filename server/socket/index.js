module.exports = (io, gameEngine) => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })


    // game logic
    socket.on('new-game', () => {
      console.log('client says new game')
      gameEngine.newGame(socket.id)
    })

    socket.on('game-over', () => {
      console.log('client says game over')
      gameEngine.endGame(socket.id, false)
    })


  })
}
