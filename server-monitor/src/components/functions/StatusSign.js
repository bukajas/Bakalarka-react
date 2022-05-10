import React from 'react'

const StatusSign = (props) => {



  if(props.stat == 'OK')
  return <p className="statusDotOk"></p>
  if (props.stat == 'WARNING') {
    return <p className="statusDotWarning"></p>
  } if (props.stat == 'CRITICAL') {
    return <p className="statusDotCritical"></p>
  }
}

export default StatusSign