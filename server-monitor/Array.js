import React from 'react'

const Array = () => {
    const [arrayLen, setArrayLen] = React.useState([0])


    function handleClicky() {
        setArrayLen(prevArrayLen => [...arrayLen, Math.random() * 10] )
        console.log(arrayLen)
        
    }

    if(arrayLen.length > 5) {
        console.log('bigger')
        const temp = arrayLen.shift()
    }
  return (
    <div>Array
        <button onClick={handleClicky}>click me</button>

    </div>
  )
}

export default Array