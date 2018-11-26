import React from 'react'

class Menu extends React.Component {
  render() {
    return (
      <div className="Menu">
        <h1>LIGHT SPEED</h1>
        <div>
          <button onClick={() => this.props.history.push('/play')}>
            PLAY GAME
          </button>
        </div>
        <div>
          <button onClick={() => this.props.history.push('/howtoplay')}>
            HOW TO PLAY
          </button>
        </div>
        <div>
          <button onClick={() => this.props.history.push('/topscore')}>
            TOP SCORES
          </button>
        </div>
        <div>
          <button onClick={() => this.props.history.push('/credits')}>
            CREDITS
          </button>
        </div>
      </div>
    )
  }
}

export default Menu
