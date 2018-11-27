import React from 'react'
import {connect} from 'react-redux'
import Timer from './Timer'

const formatScore = score => `${'0'.repeat(10 - ('' + score).length)}${score}`

const HUD = ({game: {score}}) => {
  return (
    <div>
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
      <div>
        <div className='flame1' />
        <div className='flame2' />
      </div>
      </div>
  )
}

const mapState = ({game}) => ({game})

export default connect(mapState)(HUD)
