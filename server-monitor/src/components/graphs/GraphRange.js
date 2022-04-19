import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import GrafHodnot from '../GrafHodnot'
import AngryJOe from '../AngryJOe'
import { Spin, DatePicker, TimePicker, Tabs } from 'antd';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import { CheckboxInt } from '../App'
import moment from 'moment';


const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const antIcon = <LoadingOutlined style={{ fontSize: 240 }} spin />;
Chart.register(...registerables)

function callback(key) {
  console.log(key);
}



const GraphRange = (props) => {

    const context = React.useContext(CheckboxInt)

    const { oData, setoData,
      seconds, setSeconds,
      startStop, setStartStop,
      clickedServers, setClickedServers,
      clickedValues, setClickedValues,
      valuesPost, setValuesPost,
      rangeValue, setRangeValue } = context


   const filteredHodnoty = oData ? oData.filter((temp2) =>     
      {const clickedArray = clickedServers
        if(clickedArray.includes(temp2.info.ip)) {          return temp2.info.ip         }
      }) : <Spin indicator={antIcon} />



  function onChange(dates, dateStrings) {
    setRangeValue({...rangeValue, from: dateStrings[0], to: dateStrings[1]})
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }

  const data = {
    labels: props.data2[props.ipAddr].timestamp.map((datas) => datas.split(".")[0].split("T")[1]),
    datasets: [
      {
        title: props.ipAddr,
        label: props.data1.split(" ")[1],
        data: props.data2[props.ipAddr][props.data1.split(" ")[1]],
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
          zoom: {
            zoom: {
              wheel: {
                enabled: true
              },
              mode: "xy",
              speed: 100
            },
            pan: {
              enabled: true,
              mode: "xy",
              speed: 100
            }
          },
          title: {
            display: true,
            text: props.ipAddr,
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
        }
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
                    <button onClick={downloadImage} className="btn-download">Download</button>
            <Line  
            data={data}
            height={500}
            width={2000} 
            options= {options}
            ref={downloadImg}
            className="templateGraf"
            />  
        </div>
  )
}

export default GraphRange
