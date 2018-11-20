import React from 'react'

class HUD extends React.Component {
  render() {
    return (
      <div id="hudContainer">
        <div className="hudUserName">
          <h1>User Name</h1>
        </div>
        <div className="hudScore">
          <h1>00000000000000000</h1>
        </div>
        <div className="hudTime">
          <h1>00:30s</h1>
        </div>
      </div>
  )
}
