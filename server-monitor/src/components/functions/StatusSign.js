import React from 'react'

const StatusSign = (props) => {



  if(props.stat === 'OK')
  return <div className="statusDotOk"></div>
  if (props.stat === 'WARNING') {
    return <div className="statusDotWarning"></div>
  } if (props.stat === 'CRITICAL') {
    return <div className="statusDotCritical"></div>
  }
}

export default StatusSign