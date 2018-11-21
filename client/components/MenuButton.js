import React from 'react'
import {withRouter} from 'react-router-dom'

export default withRouter(props => (
  <div className="ReturnButton">
    <div onClick={() => props.history.push('/')} className="backArrow">
      &#10140;
    </div>
  </div>
))
