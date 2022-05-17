import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import AngryJOe from '../AngryJOe'
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CheckboxInt } from '../App'
import GraphOptions from './graphOptions.json'

Chart.register(...registerables)

const GraphRange = (props) => {

    const context = React.useContext(CheckboxInt)
    const {  valuesList } = context
    var indexOfValues = valuesList.indexOf(props.data1.split(" ")[1]) +1

      var dataJson = {
        labels: props.data2[props.ipAddr].timestamp.map((datas) => datas.split(".")[0].split("T")[1]),
      datasets: [{
          title: props.ipAddr,
          label: props.data1.split(" ")[1],
          data: props.data2[props.ipAddr][props.data1.split(" ")[1]],
          fill: false,
          backgroundColor:  GraphOptions[indexOfValues].data.backgroundColor,
          borderColor: GraphOptions[indexOfValues].data.borderColor,
          yAxisID: 'y'
        },]}
    
if(props.cpuram === true){
      dataJson = {
        labels: props.data2[props.ipAddr].timestamp.map((datas) => datas.split(".")[0].split("T")[1]),
      datasets: [
        {
          title: props.ipAddr,
          label: props.data1.split(" ")[1].split("_")[0],
          data: props.data2[props.ipAddr][props.data1.split(" ")[1].split("_")[0]],
          fill: true,
          backgroundColor:  GraphOptions[0].data.backgroundColor,
          borderColor: GraphOptions[0].data.borderColor,
          yAxisID: 'y'
        },
        {
          title: props.ipAddr,
          label: props.data1.split(" ")[1].split("_")[1],
          data: props.data2[props.ipAddr][props.data1.split(" ")[1].split("_")[1]],
          fill: true,
          backgroundColor:  GraphOptions[1].data.backgroundColor,
          borderColor:  GraphOptions[1].data.backgroundColor,
        },
      ]
    }
    }   
 
    const optionsJson = {
      elements: {
        point: {
          radius: 1
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
      duration: 0
    },
    plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
          modifierKey: 'ctrl'
        },
        mode: "x",
        speed: 100,
        drag: {
          enabled: true,
          backgroundColor: 'lightblue',
          borderColor: 'blue',
          borderWidth: 1,
        }
      },
      pan: {
        enabled: true,
        mode: "x",
        speed: 100,
        modifierKey: 'ctrl'
      }
    },
  },
  scales: GraphOptions[indexOfValues].options.scales
    }

  const downloadImg = React.useRef(null);
  const downloadImage = React.useCallback(() => {
      var a = document.createElement('a')
      a.download = 'chart'
      a.href = downloadImg.current.toBase64Image()
      a.click()
    }, [])



  return (
        <div> 
          <div className='whole-graph'>
            <div className='graph-title'>{props.ipAddr}</div>
            <div className='graph-title-name'>{props.name}</div>
          <Button icon={<DownloadOutlined/>} onClick={downloadImage} className="btn-download">Download</Button>
            <Line  
            data={dataJson}
            height={500}
            width={2000} 
            options= {optionsJson}
            ref={downloadImg}
            className="templateGraf"
            />  
            </div>
        </div>
  )
}

export default GraphRange
