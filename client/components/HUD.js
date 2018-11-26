import React from 'react'
import { connect } from 'react-redux'
import Timer from './Timer'

const formatScore = score => `${'0'.repeat(10-((''+score).length))}${score}`

export default connect( ({game})=>({game}) ) (
  ({game: {score}}) => <div id="hudContainer">
    <div className="hudUserName">
      <h1>User Name</h1>
    </div>
    <div className="hudScore">
      <h1>{formatScore(score)}</h1>
    </div>
    <div className="hudTime">
      <h1><Timer/></h1>
    </div>
  </div>
)
