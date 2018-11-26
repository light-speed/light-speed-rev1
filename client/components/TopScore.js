import React from 'react'
import MenuButton from './MenuButton'

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
  render() {
    return (
      <div>
        <MenuButton />

        <div className="topScores">
          <table>
            <tbody>
              <tr>
                <th> Player </th>
                <th> Top Scores </th>
              </tr>
              {dummyScores.map(p => {
                return (
                  <tr>
                    <td>{p.user}</td>
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

export default TopScore
