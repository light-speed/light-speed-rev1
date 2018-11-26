import React from 'react'

class Menu extends React.Component {
  render() {
    return (
      <div className="Menu">
        <div>
          <img src="./images/lightGif.gif" />
        </div>
        <div>
          <button onClick={() => this.props.history.push('/play')}>
            Play Game
          </button>
        </div>
        <div>
          <button onClick={() => this.props.history.push('/Login')}>
            Login
          </button>
        </div>
        <div>
          <button onClick={() => this.props.history.push('/Signup')}>
            Sign Up
          </button>
        </div>
        <div>
          <button onClick={() => this.props.history.push('/howtoplay')}>
            How To Play
          </button>
        </div>
        <div>
          <button onClick={() => this.props.history.push('/topscore')}>
            Top Scores
          </button>
        </div>
        <div>
          <button onClick={() => this.props.history.push('/credits')}>
            Credits
          </button>
        </div>
      </div>
    )
  }
}

export default Menu
