import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import MenuButton from './MenuButton'
/**
 * COMPONENT
 */
export const UserHome = props => {
  const {username} = props

  return (
    <div className="Menu">
      <MenuButton />
      <h1>Welcome, {username}</h1>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.user.username
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  username: PropTypes.string
}
