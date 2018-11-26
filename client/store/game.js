import socket from '../socket'

/**
 * ACTION TYPES
 */
const ADD_POINTS = 'ADD_POINTS'
const END_GAME = 'END_GAME'

/**
 * INITIAL STATE
 */
const initState = {
  score: 0,
  ongoing: true,
  gameTime: 0,
  startedAt: undefined,
  socketId: undefined
}

/**
 * ACTION CREATORS
 */
export const addPoints = amount => ({type: ADD_POINTS, amount})

export const addTime = timeMs => {
  socket.emit
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
