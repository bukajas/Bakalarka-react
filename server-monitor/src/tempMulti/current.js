
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

  const { startStop, setStartStop,
    clickedServers, setClickedServers,
    tempData } = context



return (
      <div> 
        {console.log('current')}
      <button onClick={() => setStartStop(prevState => !prevState)} className='btn-start-stop' >{startStop ? "Stop" : "Start"}</button>
{
      clickedServers.map((temp) => 
      tempData.map((temp2) => {
        var ipaddr = Object.keys(temp2)
        if(ipaddr == temp.split(" ")[0] && Object.keys(temp2[ipaddr]).slice(1).includes(temp.split(" ")[1]))
        {
           return <GraphCurrent  
           data1={temp} data2={temp2} ipAddr={ipaddr}
           />
        //<Line 
        //   data={{
        //     labels: temp2[ipaddr].timestamp.map((datas) => datas.split(".")[0].split("T")[1]),
        //     datasets: [
        //       {
        //         title: ipaddr,
        //         label: temp.split(" ")[1],
        //         data: temp2[ipaddr][temp.split(" ")[1]],
        //         fill: false,
        //         backgroundColor: "rgba(75,192,192,0.2)",
        //         borderColor: "rgba(75,192,192,1)"
        //       }
        //     ]
        //   }
        // }
        //   height={500}
        //   width={2000}
        //   options= {{animation: {
        //     duration: 0
        // },
        // plugins: {
        //   zoom: {
        //     zoom: {
        //       wheel: {
        //         enabled: true
        //       },
        //       mode: "xy",
        //       speed: 100
        //     },
        //     pan: {
        //       enabled: true,
        //       mode: "xy",
        //       speed: 100
        //     }
        //   }
        // }
        // }}
        //   className="templateGraf"
        //   />
        }} ))   

      }
      </div>
)
};
  
export default Current;