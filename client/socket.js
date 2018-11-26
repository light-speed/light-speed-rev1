import io from 'socket.io-client'
import store, {endGame} from './store'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('game-over', () => {
    console.log('server says game over')
    store.dispatch(endGame())
  })
})

export default socket
