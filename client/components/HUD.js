import React from 'react'
import {connect} from 'react-redux'
import Timer from './Timer'
import store from '../store';

export const formatScore = score =>
  `${'0'.repeat(7 - ('' + score).length)}${score}`


const HUD = ({game: {score}, game: {color}, user: {username}}) => {

  function renderNormalHud() {
    return (
      <div id="hudContainer">
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

  function renderAddHud() {
    return (
      <div id="hudContainerAdd">
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

  function renderSubAdd() {
    return (
      <div id="hudContainerSub">
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


  if (color === 'green') {
    return renderAddHud()
  } else if (color === 'red') {
    return renderSubAdd()
  } else if (color === 'blue') {
    return renderNormalHud()
  }
}

const mapState = ({game, user}) => ({game, user})

export default connect(mapState)(HUD)
