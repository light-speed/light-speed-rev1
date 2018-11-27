import io from 'socket.io-client'
import store, {endGame} from './store'

const socket = io(window.location.origin)

socket.on('connect', () => {

  socket.on('game-over', socketId => {
    if (socket.id === socketId) {
      store.dispatch(endGame())
    }
  })
})

export default socket
