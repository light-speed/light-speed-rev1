import socket from '../socket'

/**
 * ACTION TYPES
 */
const ADD_POINTS = 'ADD_POINTS'
const ADD_TIME = 'ADD_TIME'
const START_GAME = 'START_GAME'
const END_GAME = 'END_GAME'

/**
 * INITIAL STATE
 */
const initState = {
  score: 0,
  ongoing: false,
  gameTime: 0,
  startedAt: undefined,
  socketId: undefined
}

/**
 * ACTION CREATORS
 */
export const addPoints = amount => ({type: ADD_POINTS, amount})

export const addTime = (timeMs, emit=true) => {
  if (emit) socket.emit('add-time', timeMs)
  return {type: ADD_TIME, timeMs}
}

export const startGame = () => {
  socket.emit('new-game')
  return {type: START_GAME}
}

export const endGame = () => {
  socket.emit('game-over')
  return {type: END_GAME}
}


/**
 * REDUCER
 */
export default function(state = initState, action) {
  switch (action.type) {
    case ADD_TIME:
      return {
        ...state,
        gameTime: state.gameTime + action.timeMs
      }
    case START_GAME:
      return {
        ...state,
        ongoing: true,
        gameTime: 30000,
        startedAt: new Date(),
        score: 0
      }
    case END_GAME:
      return {
        ...state,
        ongoing: false,
        gameTime: 0
      }
    case ADD_POINTS: 
      return { ...state, score: state.score + action.amount }
    default:
      return state
  }
}
