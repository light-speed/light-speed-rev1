import React from 'react'
import MenuButton from './MenuButton'
import {connect} from 'react-redux'
import {getScores} from '../store/game'

const dummyScores = [
  {
    user: 'J-Easy',
    score: '0000004100'
  },
  {
    user: 'Erica',
    score: '0000020600'
  },
  {
    user: 'Kenny G',
    score: '0000040800'
  },
  {
    user: 'Sandra',
    score: '0000080800'
  },
  {
    user: 'Jermaine',
    score: '0000040800'
  },
  {
    user: 'Strong',
    score: '0000240800'
  },
  {
    user: 'Tatsuo',
    score: '0000020800'
  },
  {
    user: 'Nam G',
    score: '0000020800'
  },
  {
    user: 'ET Visor',
    score: '0002020800'
  },
  {
    user: 'Gene Bloom',
    score: '0002020800'
  }
]

class TopScore extends React.Component {
  componentDidMount() {
    this.props.getScores()
  }
  render() {
    const topScores = this.props.state.game.topScores
    console.log('SCORES:', topScores)
    return (
      <div>
        <MenuButton />
        <div className="topScores">
          <table>
            <tbody>
              <tr key="init">
                <th> Player </th>
                <th> Top Scores </th>
              </tr>
              {topScores.map(p => {
                return (
                  <tr key={p.id}>
                    <td>{p.user.username}</td>
                    <td>{p.score}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const mapState = state => ({state})
const mapDispatch = {getScores}

export default connect(mapState, mapDispatch)(TopScore)
