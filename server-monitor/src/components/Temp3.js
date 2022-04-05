import React from 'react'
import {CheckboxInt} from './App'

//console.log(CheckboxInt)

      
const Temp3 = () => {
    const context = React.useContext(CheckboxInt)
    const { data, setData,
        seconds, setSeconds,
        startStop, setStartStop,
        collapsed, setCollapsed,
        ipAdd, setIpAdd,
        objectKeys, setObjectKeys,
        clickedServers, setClickedServers,
        clickedValues, setClickedValues,
        testik, setTestik } = context
  return (
    <div>
        Temp3
        <button onClick={() => setTestik(state => !state)}>Hello</button>
    </div>
  )
}

export default Temp3