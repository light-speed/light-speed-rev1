import React from 'react'
import {connect} from 'react-redux'
import {addTime} from '../store'

class Timer extends React.Component {

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 100)
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  tick() {
    let clock = this.props.game.gameTime
    if (clock > 0 && this.props.game.ongoing) {
      this.props.addTime(-100, false)
    }
  }

  render() {
    let displayTime = (this.props.game.gameTime / 1000).toFixed(1)
    if (displayTime < 0.1) displayTime = 0
    return <div>{displayTime}s</div>
  }
}

const mapState = ({game}) => ({game})

export default connect(mapState, {addTime} )(Timer)