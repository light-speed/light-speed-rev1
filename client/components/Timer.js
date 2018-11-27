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
    if (clock > 0) {
      this.props.addTime(-100, false)
    }
  }

  render() {
    return <div>{(this.props.game.gameTime / 1000).toFixed(1)}s</div>
  }
}

const mapState = ({game}) => ({game})

export default connect(mapState, {addTime} )(Timer)