import generateWorld from '../3d'
import React, {Component} from 'react'
import {withRouter} from 'react-router'
import HUD from './HUD'
import GameOver from '../components/GameOver'
import {connect} from 'react-redux'

class World extends Component {
  componentDidMount() {
    generateWorld()
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      window.removeEventListener('keydown', onEsc, false)
      this.unsubscribe()
    }
  }

  render() {
    return (
      <div id="world" className="no-cursor">
        {/* <GameOver /> */}

        <HUD />
        <div id="pause-screen">
          <div id="progress-container">
            <div>
              <div className="preloader-1">
                <div>Loading</div>
                <span className="line line-1" />
                <span className="line line-2" />
                <span className="line line-3" />
                <span className="line line-4" />
                <span className="line line-5" />
                <span className="line line-6" />
                <span className="line line-7" />
                <span className="line line-8" />
                <span className="line line-9" />
                <span className="line line-10" />
                <span className="line line-11" />
                <span className="line line-12" />
                <span className="line line-13" />
                <span className="line line-14" />
                <span className="line line-15" />
                <span className="line line-16" />
              </div>
              <img src="./loading.gif" />
            </div>
          </div>
        </div>
        {/* {this.props.isGameOngoing? null : <GameOver />} */}
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

export default withRouter(connect(mapState)(World))
