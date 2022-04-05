import React from 'react'

const Add = () => {
    //const isGoingOut = true
    //let answer = isGoingOut === true ? "Yes" : "No"// Use ternary here

    const [goOut, setGoOut] = React.useState(true)
    
    function handleClick() {
      setGoOut(prevState => !prevState)
      console.log(goOut)
    }
  
  
  
    const [thingsArray, setThingsArray] = React.useState(["Thing 1", "Thing 2"])
    const thingsElements = thingsArray.map(thing => 
      <p key={thing}>{thing}</p>
    )

    function thingAdd() {
      //const newThingText = `Thing ${thingsArray.length + 1}`
      setThingsArray(prevThingsArray => [...thingsArray, `Thing ${prevThingsArray.length + 1}`] )
      //thingsArray.push(newThingText)
      console.log(thingsArray)
    }


  return (
    <div>

    <div className="state">
      <h1 className="state--title">Do I feel like going out tonight?</h1>
        <div className="state--value" onClick={handleClick}>
          <h1>{goOut ? "Yes" : "No"}</h1>
        </div>
      </div>

      
    <div className="main-add">
        <button className="btn-add" onClick={thingAdd}>Hello</button>
        {thingsElements}
    </div>
    </div>
  )
}

export default Add