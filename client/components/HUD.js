import React from 'react'
import {connect} from 'react-redux'
import Timer from './Timer'
import HUDalert from '../3d/HUDalert'

export const formatScore = score =>
  `${'0'.repeat(10 - ('' + score).length)}${score}`

const HUD = ({game: {score}, user: {username}}) => {
  return (
    <div id="hudContainer">
      <img id="hudColor" src={HUDalert('red')} />
      <div className="hudUserName">
        <h1>{username || 'Anonymous'}</h1>
      </div>
      <div className="hudScore">
        <h1>{formatScore(score)}</h1>
        <div>
          <h1 id="alert" />
        </div>
      </div>
      <div className="hudTime">
        <h1>
          <Timer />
        </h1>
      </div>
    </div>
  )
}

const mapState = ({game, user}) => ({game, user})

export default connect(mapState)(HUD)
