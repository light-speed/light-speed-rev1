import React from 'react'
import MenuButton from './MenuButton'
import {connect} from 'react-redux'
import {getScores} from '../store/game'

class TopScore extends React.Component {
  componentDidMount() {
    this.props.getScores()
  }
  render() {
    const topScores = this.props.state.game.topScores
    return (
      <div>
        <MenuButton />
        <div className="topScores">
          <table>
            <tbody>
              <tr key="init">
                <th> Rank </th>
                <th> Player </th>
                <th> Top Scores </th>
                <th> Date Played </th>
              </tr>
              {topScores.map((p, idx) => {
                return (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>{p.user.username}</td>
                    <td>{p.score}</td>
                    <td>{p.createdAt.slice(0, 10)}</td>
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
