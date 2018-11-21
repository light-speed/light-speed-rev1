import React from 'react'

class Menu extends React.Component {

    render () {
        return (
            <div className='Menu'>
            <h1>LIGHT SPEED</h1>
                <div>
                    <button>PLAY GAME</button>
                </div>
                <div>
                    <button>HOW TO PLAY</button>
                </div>
                <div>
                    <button>CREDITS</button>
                </div>
            </div>
        )
    }
}

export default (Menu)