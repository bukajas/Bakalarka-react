
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


const Current = () =>  {

  const context = React.useContext(CheckboxInt)

  const { startStop, setStartStop,
    clickedServers, setClickedServers,
    tempData, timeInterval, setTimeInterval, globalData } = context

    const selectAfter = (
      <Select defaultValue="Sec" style={{ width: 60 }}>
        <Option value="Sec">Sec</Option>
        <Option value="Min">Min</Option>
        <Option value="Hour">Hour</Option>
        
      </Select>
    )

  //  console.log(selectAfter.props.defaultValue)

  //   function timeStamps(secsSub) {
  //     

  //  }

   function changeInterval(secsSub, inter) {
    var tempSecsSub = parseInt(secsSub.target.defaultValue)
     //var secsToSub
    //  if(inter == 'Sec'){
    //    secsToSub = tempSecsSub
    //  }
    //  if(inter == 'Mins'){
    //    secsToSub = tempSecsSub * 60
    //  }
    //  if(inter == 'Hour'){
    //    secsToSub = tempSecsSub * 3600
    //  }
    var time = new Date()
    var newTime = new Date(time.getTime() - tempSecsSub * 1000)
    var tempObj = {from: format(newTime, 'yyyy-MM-dd kk:mm:ss'), to: format(time, 'yyyy-MM-dd kk:mm:ss')
  }
      setTimeInterval(tempObj)
    }
    
return (
      <div> 
        <p>(for zoom and drag press "CTRL" key)</p>

<hr></hr>
      <Button onClick={() => setStartStop(prevState => !prevState)} type='primary'>{startStop ? "Stop" : "Start"}</Button>
{
      clickedServers.length > 0 ? clickedServers.map((temp) => 
      tempData?tempData.map((temp2) => {
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