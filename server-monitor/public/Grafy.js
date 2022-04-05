import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import Graf from './Graf'
import AngryJOe from './AngryJOe'

Chart.register(...registerables)
const hodnoty = null

const Grafy = (props) => {
    const [hodnoty, setHodnoty] = React.useState(null)

    React.useEffect(() => {
      if(props.startStop) {
        setHodnoty(props.data)
      }
    }, [props.seconds])

        //setHodnoty(props.data)
        // if(props.data) {
        // const temp2 = props.data.map((datas) =>  
        //     {
        //       return (datas) => <Line info={datas.info} values={datas.values} height={500} width={2000} />
        //     }
        //     )
        // }

        
    function getValues() {
      hodnoty.map((temp) => {temp.values.map((temp2) => console.log(temp2.cpu))})
    }



  return (
        <div>
          {
          hodnoty ? hodnoty.map((datas) => 
          <Graf 
          info={datas.info} 
          values={datas.values} 
          height={500} 
          width={2000} 
          />) : <AngryJOe />

          }
        <button onClick={getValues}>values</button>


          </div>
  )
}

export default Grafy


//co server to pocet grafu co pocet hodnot