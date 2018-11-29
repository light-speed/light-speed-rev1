import React from 'react'
import MenuButton from './MenuButton'

class Credits extends React.Component {
  render() {
    return (
      <div>
        <MenuButton />
        <div className="fade" />
        <section className="star-wars">
          <div className="crawl">
            <div className="title">
              <p>Episode 0</p>
              <h1>LIGHT SPEED</h1>
            </div>
              <h1>A JavaScript story in zero gravity</h1>
              <p>Benjamin Wagner</p>
              <p>Dalton Saffe</p>
              <p>Jason Hang</p>
              <p>Haiau Duong</p>
          </div>
        </section>
      </div>
    )
  }
}

export default Credits
