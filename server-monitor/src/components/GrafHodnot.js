import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import AngryJOe from './AngryJOe'
import {CheckboxInt} from './App'

Chart.register(...registerables)





const GrafHodnot = (props) => {
  const context = React.useContext(CheckboxInt)
  const { seconds, setSeconds, startStop, oData } = context

  const [ singleValue, setSingleValue ] = React.useState([])
  const datasetss = {labels: props.values.map((datas) => datas.timestamp.split(".")[0].split("T")[1]),
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


  React.useEffect(() => {
          if(props.zmackni === 'cpu'){
            setSingleValue(props.values.map((datas) => datas.cpu))
          }
          else if(props.zmackni === 'ram'){
            setSingleValue( props.values.map((datas) => datas.ram))
          }
          else if(props.zmackni === 'bit_rate_in'){
            setSingleValue( props.values.map((datas) => datas.bit_rate_in))
          }
          else if(props.zmackni === 'bit_rate_out'){
            setSingleValue( props.values.map((datas) => datas.bit_rate_out))
          }
          else if(props.zmackni === 'packet_rate_in'){
            setSingleValue(props.values.map((datas) => datas.packet_rate_in))
          }
          else if(props.zmackni === 'packet_rate_out'){
            setSingleValue(props.values.map((datas) => datas.packet_rate_out))
          }
          else if(props.zmackni === 'tcp_established'){
            setSingleValue(props.values.map((datas) => datas.tcp_established))
          }
          // console.log(data.datasets[0].data = props.values.map((datas) => datas.tcp_established))
        }, [oData])
        
        
        
        
        const data = {
          labels: props.values.map((datas) => datas.timestamp.split(".")[0].split("T")[1]),
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
          animation: {
            duration: 0
  },
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
        {/* <button onClick={updategraf}>Clicke</button> */}
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
