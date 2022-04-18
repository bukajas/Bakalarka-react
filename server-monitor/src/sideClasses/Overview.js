import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import Graph from './Graph'

Chart.register(...registerables)


const Overview = (props) => {

  const [hodnoty, setHodnoty] = React.useState(null)
 

  

  var today = new Date(),
  time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    React.useEffect(() => {
      if(props.startStop) {
        setHodnoty(props.data)
      }
    }, [props.seconds])
    
  





  // <button onClick={butClick0}>change to 1</button>
  // <button onClick={butClick1}>change to 0</button>
  return (
    <div className="graph">
        <Graph 
        data={props.data} 
        startStop={props.startStop} 
        seconds={props.seconds} 
        butClick={props.butClick}
        />
    </div>
  )
}

export default Overview