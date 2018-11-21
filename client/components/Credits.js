import React from 'react'
import MenuButton from './MenuButton'

class Credits extends React.Component {
  render() {
    return (
      <div>
        {/* <div className="ReturnButton">
          <div onClick={() => this.props.history.push('/')} class="backArrow">
            &#10140;
          </div>
        </div> */}
        <MenuButton />

        <div className="fade" />

        <section className="star-wars">
          <div className="crawl">
            <div className="title">
              <p>Episode I</p>
              <h1>LIGHT SPEED</h1>
            </div>

            <p>Ben</p>

            <p>Dalton</p>

            <p>Jason</p>
            <p>Haiau</p>
          </div>
        </section>
      </div>
    )
  }
}

export default Credits
