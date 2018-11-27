import React from 'react'

class Menu extends React.Component {
  render() {
    return (
      <div className="Menu">
        <div>
          <img src="./images/lightGif.gif" />
        </div>
        <div>
          <button
            type="button"
            onClick={() => this.props.history.push('/play')}
          >
            PLAY GAME
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => this.props.history.push('/howtoplay')}
          >
            HOW TO PLAY
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => this.props.history.push('/topscore')}
          >
            TOP SCORES
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => this.props.history.push('/credits')}
          >
            CREDITS
          </button>
        </div>
      </div>
    )
  }
}

export default Menu
