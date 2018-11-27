import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

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
        {!this.props.user.username ? (
          <div>
            <div>
              <button
                type="button"
                onClick={() => this.props.history.push('/login')}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => this.props.history.push('/signup')}
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => {
                axios.post('/auth/logout')
                location.reload()
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default connect(({user}) => ({user}))(Menu)
