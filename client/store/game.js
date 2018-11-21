
/**
 * ACTION TYPES
 */
const ADD_POINTS = 'ADD_POINTS'

/**
 * INITIAL STATE
 */
const initState = {
  score: 0
}

/**
 * ACTION CREATORS
 */
export const addPoints = amount => ({type: ADD_POINTS, amount})



/**
 * REDUCER
 */
export default function(state = initState, action) {
  switch (action.type) {
    case ADD_POINTS: 
      return { ...state, score: state.score + action.amount }
    default:
      return state
  }
}
