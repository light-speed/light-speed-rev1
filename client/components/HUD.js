import React from 'react'

const HUD = props => {
  return (
    <div className="hudContainer">
      <div className="hudUserName">
        <h1>User Name</h1>
      </div>
      <div className="hudScore">
        <h1>Score: {props.score}</h1>
      </div>
      <div className="hudTime">
        <h1>00:30s</h1>
      </div>
    </div>
  )
}

export default HUD
