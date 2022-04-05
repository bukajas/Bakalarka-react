import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import AngryJOe from './AngryJOe'
import Temp2 from './Temp2'
import Download from './Download'
import {CheckboxInt} from './App'

Chart.register(...registerables)

const GrafHodnot = (props) => {
  const context = React.useContext(CheckboxInt)
  const { seconds, setSeconds, } = context

  const [ singleValue, setSingleValue ] = React.useState([])
  const [ hodnoty, setHodnoty ] = React.useState({
    bit_rate_in: [],
    bit_rate_out: [],
    cpu: [],
    packet_rate_in: [],
    packet_rate_out: [],
    ram: [],
    tcp_established: [],
    timestamp: [],
  })

//["cpu", "ram"]

  React.useEffect(() => {
      setHodnoty(
          {
              ...hodnoty,
              cpu: props.values.map((datas) => datas.cpu),
              bit_rate_in: props.values.map((datas) => datas.bit_rate_in),
              bit_rate_out: props.values.map((datas) => datas.bit_rate_out),
              packet_rate_in: props.values.map((datas) => datas.packet_rate_in),
              packet_rate_out: props.values.map((datas) => datas.packet_rate_out),
              ram: props.values.map((datas) => datas.ram),
              tcp_established: props.values.map((datas) => datas.tcp_established),
              timestamp: props.values.map((datas) => datas.timestamp.split(".")[0].split("T")[1])
          })
          if(props.zmackni === 'cpu'){
            setSingleValue(hodnoty.cpu)
          }
          if(props.zmackni === 'ram'){
            setSingleValue(hodnoty.ram)
          }
          if(props.zmackni === 'bit_rate_in'){
            setSingleValue(hodnoty.bit_rate_in)
          }
          if(props.zmackni === 'bit_rate_out'){
            setSingleValue(hodnoty.bit_rate_out)
          }
          if(props.zmackni === 'packet_rate_in'){
            setSingleValue(hodnoty.packet_rate_in)
          }
          if(props.zmackni === 'packet_rate_out'){
            setSingleValue(hodnoty.packet_rate_out)
          }
          if(props.zmackni === 'tcp_established'){
            setSingleValue(hodnoty.tcp_established)
          }
    }, [seconds])

    
  const data = {
    labels: hodnoty.timestamp,
    datasets: [
      {
        title: "hello",
        label: props.zmackni,
        data: singleValue,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  }
  
  const options= {
    plugins: {
      title: {
        display: true,
        text: props.info.name,
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
    }
  }

  const downloadImg = React.useRef(null);
  const downloadImage = React.useCallback(() => {
    var a = document.createElement('a');
    a.download = 'chart';
    a.href = downloadImg.current.toBase64Image();
    a.click();
  }, []);
  

  
  return (
    <div>
      <div className="template">
    <button onClick={downloadImage} className="btn-download">Download</button>
      {
      <Line  
      data={data}
      height={500}
      width={2000} 
      options= {options}
      ref={downloadImg}
      className="templateGraf"
      />
    }
    </div>
    </div>
  )
}

export default GrafHodnot
