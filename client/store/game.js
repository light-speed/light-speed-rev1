import axios from 'axios'

/**
 * ACTION TYPES
 */
const ADD_POINTS = 'ADD_POINTS'
const GET_SCORES = 'GET_SCORES'

/**
 * INITIAL STATE
 */
const initState = {
  score: 0,
  topScores: []
}

/**
 * ACTION CREATORS
 */
export const addPoints = amount => ({type: ADD_POINTS, amount})
const topScores = scores => ({type: GET_SCORES, scores})

// THUNKS

export const getScores = () => async dispatch => {
  try {
    const res = await axios.get('/api/games')
    console.log('RES', res)
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
    case ADD_POINTS:
      return {...state, score: state.score + action.amount}
    case GET_SCORES:
      return {...state, topScores: [...action.scores]}
    default:
      return state
  }
}
