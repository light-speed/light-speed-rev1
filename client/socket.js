import io from 'socket.io-client'
import store, {endGame, setTime} from './store'

const socket = io(window.location.origin)

socket.on('connect', () => {

  socket.on('game-over', socketId => {
    if (socket.id === socketId) {
      store.dispatch(endGame())
    }
  })

  socket.on('update-time', (socketId, time) => {
    if (socket.id === socketId) {
      store.dispatch(setTime(time))
    }
  })
})

export default socket
