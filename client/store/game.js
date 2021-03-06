import socket from '../socket'
import axios from 'axios'
import {controls} from '../3d/player'


/**
 * ACTION TYPES
 */
const ADD_POINTS = 'ADD_POINTS'
const ADD_TIME = 'ADD_TIME'
const START_GAME = 'START_GAME'
const END_GAME = 'END_GAME'
const GET_SCORES = 'GET_SCORES'
const SET_TIME = 'SET_TIME'
const TOGGLE_ONGOING = 'TOGGLE_ONGOING'

/**
 * INITIAL STATE
 */
const initState = {
  score: 0,
  ongoing: false,
  gameOver: null,
  gameTime: 0,
  startedAt: undefined,
  socketId: undefined,
  topScores: [],
  color: 'blue'
}

export const setTime = time => ({type: SET_TIME, time})

export const addPoints = (amount, self=false) => async dispatch => {

  let color = amount > 0
    ? 'green' : 'red'
  if (amount === 0) color = 'blue'
  if(!self) setTimeout( () => dispatch(addPoints(0, true)), 300 )
  socket.emit('add-points', amount)
  dispatch( {type: ADD_POINTS, amount, color})
}

export const toggleOngoing = () => ({type: TOGGLE_ONGOING})

export const addTime = (timeMs, emit = true) => {
  if (emit) socket.emit('add-time', timeMs)
  return {type: ADD_TIME, timeMs}
}

export const startGame = () => async dispatch => {
  try {
    const {data: me} = await axios.get('/auth/me')
    const userId = me ? me.id : 1
    socket.emit('new-game', userId)
    dispatch({type: START_GAME})
  } catch (e) {
    console.log(e)
  }
}

export const endGame = () => {
  // history.push('/gameover')
  controls.unlock()
  socket.emit('game-over')
  return {type: END_GAME}
}

const topScores = scores => ({type: GET_SCORES, scores})

export const getScores = () => async dispatch => {
  try {
    const res = await axios.get('/api/games')
    dispatch(topScores(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initState, action) {
  switch (action.type) {
    case TOGGLE_ONGOING:
      return {
        ...state,
        ongoing: !state.ongoing
      }
    case SET_TIME:
      return {
        ...state,
        gameTime: action.time
      }
    case ADD_TIME:
      return {
        ...state,
        gameTime: state.gameTime + action.timeMs
      }
    case START_GAME:
      return {
        ...state,
        ongoing: true,
        gameTime: 35000,
        gameOver: null,
        startedAt: new Date(),
        score: 0
      }
    case END_GAME:
      return {
        ...state,
        ongoing: false,
        gameOver: true,
        gameTime: 0
      }
    case ADD_POINTS:
      return {...state, score: state.score + action.amount, color: action.color}
    case GET_SCORES:
      return {...state, topScores: [...action.scores]}
    default:
      return state
  }
}
