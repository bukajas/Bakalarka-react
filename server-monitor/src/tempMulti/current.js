
import React from 'react';
import { Bar, Line } from 'react-chartjs-2'
import GraphCurrent from "../components/graphs/GraphCurrent"
import { Chart, registerables } from 'chart.js'
import GrafHodnot from '../components/GrafHodnot'
import AngryJOe from '../components/AngryJOe'
import { Spin, DatePicker, TimePicker, Tabs, Button } from 'antd';
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
        <p>(for zoom and drag press "CTRL" key)</p>
      <Button onClick={() => setStartStop(prevState => !prevState)} type='primary'>{startStop ? "Stop" : "Start"}</Button>
      {}
{
      clickedServers.length > 0 ? clickedServers.map((temp) => 
      tempData.map((temp2) => {
        var ipaddr = Object.keys(temp2)
        if(ipaddr == temp.split(" ")[0] && Object.keys(temp2[ipaddr]).slice(1).includes(temp.split(" ")[1]))
        {
           return <GraphCurrent  
           data1={temp} data2={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name}
           />
        }} ))  : <AngryJOe />

      }
      </div>
)
};
  
export default Current;