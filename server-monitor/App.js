import React from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import Graph from './Graph'
import { Chart, Doughnut } from 'react-chartjs-2'
import Array from './Array'
import ChartImage from './ChartImage'


var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
console.log(time)
// komponenta
function App() {
  // alternativa state
  const [data, setData] = React.useState(null)
  const [seconds, setSeconds] = React.useState(0)
  const [startStop, setStartStop] = React.useState(false)
  
  React.useEffect(() => {
    getData()
  }, [])

  React.useEffect(() => {
    console.log(Date())
    if(startStop) { getData() }
  }, [seconds])

  React.useEffect(() => {
    console.log("seconds")
    const interval2 = setInterval(() => {
      setSeconds(seconds => seconds + 1)
      //console.log(startStop)
    }, 1000)
    return () => clearInterval(interval2)
  }, [])

    
    // funkce pro získání naměřených dat ze serveru
    
    function getData () {
      let postValues =
      // možnosti:
      // 1. získej všechny uložená data
      {type: "all"}
      // 2. stáhni data z určitého období
      // {type: "range", from: "2021-02-01 01:00:00", to: "2021-02-01 01:20:00"}
      // 3. získej data z konkrétních časů (využitelné např. v případě nějaké chyby v předchozích přenosech)
      // {type: "times", times: ["2021-02-01 01:00:00", "2021-02-01 01:00:02", "2021-02-01 03:03:00", "2021-02-01 01:55:55"]}
      
      
      Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
      .then((response) => {
        if (!response.data.error){
          setData(response.data.data)
        } else {
          console.log(response.data.message)
          setData(0)
        }
      })
      .catch((error) => {
        console.log("Server is unavailable")
        console.log(error)
        setData(0)
      })
    }
    
    
    //console.log("rendering...")
    if(data) {
      if(startStop) {
        //console.log(data)
        var datta = data[0].values[0]
        //console.log(datta)

      }
    }
    
    function handleClick() {
      setStartStop(prevState => !prevState)
    }
    


    return (
      <div className="App">
        <header className="App-header">
          Hlavička
        </header>
         {seconds}
        <div className="main">
          {data === null ? <h4>Empty data</h4> : (
           data === 0 ? <h4>Server error</h4> : (
            <h5>Some data was received from the server, see the console.</h5>
            )
          )}

            
        </div>
        <div className="toggler">
          <button onClick={handleClick} >{startStop ? "Stop" : "Start"}</button>
          {startStop && <p>{}</p>}
          <Graph data={data} startStop={startStop} seconds={seconds}/>
          <Array />
          <ChartImage />
        </div>

      </div>
  );
}

export default App
