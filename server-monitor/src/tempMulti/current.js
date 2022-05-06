
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
import { InputNumber, Select, Space } from 'antd';
import {format, set} from 'date-fns'

const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 240 }} spin />;
Chart.register(...registerables)


const Current = (props) =>  {

  const context = React.useContext(CheckboxInt)

  const { startStop, setStartStop,
    clickedServers, setClickedServers,
    timeInterval, setTimeInterval, globalData } = context

    const selectAfter = (
      <Select defaultValue="Sec" style={{ width: 60 }}>
        <Option value="Sec">Sec</Option>
        <Option value="Min">Min</Option>
        <Option value="Hour">Hour</Option>
        
      </Select>
    )


return (
      <div> 
        <p>(for zoom and drag press "CTRL" key)</p>

<hr></hr>
  {/* {props.tempData ? console.log(props.tempData):console.log('props.tempData')} */}
      <Button onClick={() => setStartStop(prevState => !prevState)} type='primary'>{startStop ? "Stop" : "Start"}</Button>
{
      clickedServers.length > 0 ? clickedServers.map((temp) => 
      props.tempData ? props.tempData.map((temp2) => {
        var ipaddr = Object.keys(temp2)
        
        if(ipaddr == temp.split(" ")[0] && temp.split(" ")[1] == 'cpu_ram'){
          return <GraphCurrent  
          cpuram={true} data1={temp} data2={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name} 
           />
        }
        if(ipaddr == temp.split(" ")[0] && Object.keys(temp2[ipaddr]).slice(1).includes(temp.split(" ")[1]))
        {
           return <GraphCurrent  
           cpuram={false} data1={temp} data2={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name} 
           />
        }} ): <AngryJOe/>)  : <AngryJOe />

      }
      </div>
)
};
  
export default Current;