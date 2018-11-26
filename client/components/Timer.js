import React from 'react'

export default class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 3000
    }
    this.addTime = this.addTime.bind(this)
  }
  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 10)
  }
  componentWillUnmount() {
    clearInterval(this.intervalID)
  }
  tick() {
    let clock = this.state.time
    if (clock > 0) {
      this.setState({
        time: clock - 1
      })
    }
  }
  addTime(extraTime) {
    let clock = this.state.time
    this.setState({
        time: clock + extraTime
    })
  }
  render() {
    return (
      <div>
        {((this.state.time)/100).toFixed(2)}s
      </div>
    )
  }
}
