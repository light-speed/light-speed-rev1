import generateWorld from '../3d'
import React, {Component} from 'react'
import {withRouter} from 'react-router'
import HUD from './HUD'
import {connect} from 'react-redux'
import Loading from './Loading'

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
        <HUD />
        <div id="pause-screen">
          <div id="progress-container">
            <Loading />
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

export default withRouter(connect(mapState)(World))
