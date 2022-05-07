import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import GrafHodnot from '../GrafHodnot'
import AngryJOe from '../AngryJOe'
import { Spin, DatePicker, TimePicker, Tabs, Button } from 'antd';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import { CheckboxInt } from '../App'
import { DownloadOutlined } from '@ant-design/icons';
import GraphOptions from './graphOptions.json'





const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const antIcon = <LoadingOutlined style={{ fontSize: 240 }} spin />;
Chart.register(...registerables)
var errors = [] 
const GraphCurrent = (props) => {

    const context = React.useContext(CheckboxInt)
    const { valuesList } = context


 
 

React.useEffect(() =>{
  var lenghtOfData = props.data2[props.ipAddr].timestamp.length
  errors = []
  for(var i=0; i<lenghtOfData; i++){
    if(props.data2[props.ipAddr].cpu[i] == null){   
      errors = [...errors, 100]
    }
    else{
      errors = [...errors, 0]
    }
  }

  

}, [props.data2[props.ipAddr].timestamp.at(0)])



 var indexOfValues = valuesList.indexOf(props.data1.split(" ")[1]) +1
 
 var dataJson = {
    labels: props.data2[props.ipAddr].timestamp.map((datas) => datas.split(".")[0].split("T")[1]),
  datasets: [
    {
      title: props.ipAddr,
      label: props.data1.split(" ")[1],
      data: props.data2[props.ipAddr][props.data1.split(" ")[1]],
      fill: false,
      backgroundColor:  GraphOptions[indexOfValues].data.backgroundColor,
      borderColor: GraphOptions[indexOfValues].data.borderColor,
      yAxisID: 'y'
    },
    {
      title: 'error',
      label: 'error',
      data: errors,
      fill: true,
      backgroundColor: 'red',
      borderColor: 'red',
      yAxisID: 'y1'
    }
  ]
}
if(props.cpuram==true){
  dataJson = {
    labels: props.data2[props.ipAddr].timestamp.map((datas) => datas.split(".")[0].split("T")[1]),
  datasets: [
    {
      title: props.ipAddr,
      label: props.data1.split(" ")[1].split("_")[0],
      data: props.data2[props.ipAddr][props.data1.split(" ")[1].split("_")[0]],
      fill: false,
      backgroundColor:  GraphOptions[0].data.backgroundColor,
      borderColor: GraphOptions[0].data.borderColor,
      yAxisID: 'y'
    },
    {
      title: props.ipAddr,
      label: props.data1.split(" ")[1].split("_")[1],
      data: props.data2[props.ipAddr][props.data1.split(" ")[1].split("_")[1]],
      fill: false,
      backgroundColor:  GraphOptions[1].data.backgroundColor,
      borderColor:  GraphOptions[1].data.backgroundColor,
    },
    {
      title: 'error',
      label: 'error',
      data: errors,
      fill: true,
      backgroundColor: 'red',
      borderColor: 'red',
      yAxisID: 'y1'
    }
  ]
}
}

const optionsJson = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
            duration: 100
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
          title: {
            display: true,
            text: props.ipAddr + " " + props.name,
            font: {
              size: 20
                  }
                }
        },
        scales: GraphOptions[indexOfValues].options.scales
          }





  const downloadImg = React.useRef(null);
  const downloadImage = React.useCallback(() => {
      var a = document.createElement('a');
      a.download = 'chart';
      a.href = downloadImg.current.toBase64Image();
      a.click();
    }, []);

  return (
        <div >
          <div className='whole-graph'>
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
export default GraphCurrent
