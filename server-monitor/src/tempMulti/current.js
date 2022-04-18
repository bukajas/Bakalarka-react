
import React from 'react';
import { Bar, Line } from 'react-chartjs-2'
import GraphCurrent from "../components/graphs/GraphCurrent"
import { Chart, registerables } from 'chart.js'
import GrafHodnot from '../components/GrafHodnot'
import AngryJOe from '../components/AngryJOe'
import { Spin, DatePicker, TimePicker, Tabs } from 'antd';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import { CheckboxInt } from '../components/App'

const antIcon = <LoadingOutlined style={{ fontSize: 240 }} spin />;
Chart.register(...registerables)


const Current = () =>  {


  const context = React.useContext(CheckboxInt)

  const { oData, setoData,
    seconds, setSeconds,
    startStop, setStartStop,
    clickedServers, setClickedServers,
    clickedValues, setClickedValues,
    valuesPost, setValuesPost,
    rangeValue, setRangeValue,
  dates,tempData } = context


//  const filteredHodnoty = oData ? oData.filter((temp2) =>     
//     {
//       if(clickedServers.includes(temp2.info.ip)) { return temp2.info.ip }
//     }) : <Spin indicator={antIcon} />



function onChange(dates, dateStrings) {
  setRangeValue({...rangeValue, from: dateStrings[0], to: dateStrings[1]})
  console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
}

return (
      <div> 
      <button onClick={() => setStartStop(prevState => !prevState)} className='btn-start-stop' >{startStop ? "Stop" : "Start"}</button>
      {/* {clickedServers.map((temp) => 
      oData.map((temp2) => {
        if(temp2.info.ip == temp.split(" ")[0] && Object.keys(oData[0].values[0]).slice(1).includes(temp.split(" ")[1])){
          return <GrafHodnot
        info={temp2.info} 
        values={temp2.values} 
        zmackni={temp.split(" ")[1]}
        height={500} 
        width={2000} 
    />
        }} ))
} */}



{
      clickedServers.map((temp) => 
      tempData.map((temp2) => {
        var ipaddr = Object.keys(temp2)
        //console.log(temp2[ipaddr].timestamp.map((datas) => datas.split(".")[0].split("T")[1]))
        if(ipaddr == temp.split(" ")[0] && Object.keys(temp2[ipaddr]).slice(1).includes(temp.split(" ")[1])){
          return <Line  
          data={{
            labels: temp2[ipaddr].timestamp.map((datas) => datas.split(".")[0].split("T")[1]),
            datasets: [
              {
                title: ipaddr,
                label: temp.split(" ")[1],
                data: temp2[ipaddr][temp.split(" ")[1]],
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
              }
            ]
          }
        }
          height={500}
          width={2000}
          plugins={{
            title: {
              display: true,
              text: ipaddr,
              font: {
                size: 18
              }
            }
          }}
          options= {{animation: {
            duration: 0
        },
          plugins: {
            title: {
              display: true,
              text: ipaddr,
              font: {
                size: 18
              }
            },
            
            
          }}}
          className="templateGraf"
          />
        }} ))   

      }
      </div>
)
};
  
export default Current;