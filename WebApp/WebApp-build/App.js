import React from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import Overview from "./Overview.js"
import Grafy from "./Grafy.js"
import SideMenu from "./SideMenu.js"
import "antd/dist/antd.css";
import "../index.css";



// komponenta
function App() {
  // alternativa state
  const [data, setData] = React.useState(null)
  const [seconds, setSeconds] = React.useState(0)
  const [startStop, setStartStop] = React.useState(false)
  const [butClick, setButClick] = React.useState(0)
  
  React.useEffect(() => {
    getData()
  }, [])

  React.useEffect(() => {
    //console.log(Date())
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
        console.log(data)
        //var datta = data[0]
        //console.log(datta)

      }
    }
    
    function handleClick() {
      setStartStop(prevState => !prevState)
    }
    
    function butClick0() {
      setButClick(1)
      console.log(butClick)
      
    }
    function butClick1() {
      console.log(butClick)
      setButClick(0)
      
    }

    return (
      <div className="App">
        <header className="App-header">
          Hlavička
        </header>

        <div className="sidenav">
          <SideMenu />
        </div>
        <div className="main">

          <button onClick={handleClick} className='btn-start-stop' >{startStop ? "Stop" : "Start"}</button>
         <p>{seconds}</p>
          <div>
            {data === null ? <h4>Empty data</h4> : (
              data === 0 ? <h4>Server error</h4> : (
              <h5>Some data was received from the server, see the console.</h5>
              )
            )}
          </div>

          <div className="toggler">
              <div>
              <button onClick={butClick0}>change to 1</button>
              <button onClick={butClick1}>change to 0</button>
              </div>
             <div>
            <Overview data={data} startStop={startStop} seconds={seconds} butClick={butClick}/>
            <Grafy data={data} startStop={startStop} seconds={seconds} />
             </div>
          </div>
        </div>
      </div>
  );
}

export default App
