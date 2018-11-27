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
          <button onClick={() => this.props.history.push('/play')}>
            Play Game
          </button>
        </div>
        { (!this.props.user.username) ? <div>
            <div>
              <button onClick={() => this.props.history.push('/login')}>
                Login
              </button>
            </div>
            <div>
              <button onClick={() => this.props.history.push('/signup')}>
                Sign Up
              </button>
            </div> 
          </div>
          : <div>
              <button onClick={() => {
                axios.post('/auth/logout')
                location.reload()
              }}>
                Logout
              </button>
            </div>
        }
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

export default connect( ({user})=>({user}) )(Menu)
