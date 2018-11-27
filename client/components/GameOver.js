import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class GameOver extends React.Component {
  render() {
    return (
      <div id="game-over">
        <div className="gameover-details">
          <h1>SCORE {this.props.score}</h1>
          <br /> <br />
          <h1>GAME OVER</h1>
          <div>
            <Link to="/">
              <button type="button">MAIN MENU</button>
            </Link>
          </div>
          <div>
            <Link to="/howtoplay">
              <button type="button">HOW TO PLAY</button>
            </Link>
          </div>
          <div>
            <Link to="/topscores">
              <button type="button">TOP SCORES</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    score: state.game.score,
    isGameOngoing: state.game.ongoing
  }
}

export default connect(mapState)(GameOver)
