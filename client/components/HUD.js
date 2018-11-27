import React from 'react'
import {connect} from 'react-redux'
import Timer from './Timer'

export const formatScore = score =>
  `${'0'.repeat(10 - ('' + score).length)}${score}`

const HUD = ({game: {score}}) => {
  return (
    <div id="hudContainer">
      <div className="hudUserName">
        <h1>User Name</h1>
      </div>
      <div className="hudScore">
        <h1>{formatScore(score)}</h1>
      </div>
      <div className="hudTime">
        <h1>
          <Timer />
        </h1>
      </div>
    </div>
  )
}

const mapState = ({game}) => ({game})

export default connect(mapState)(HUD)
