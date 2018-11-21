import React from 'react'

class BackToMenu extends React.Component {

    render () {
        return (
        <div>
            <button onClick={() => this.props.history.push('/')}>
                Return to Main Menu
            </button>
        </div>
        )
    }
}

export default (BackToMenu)