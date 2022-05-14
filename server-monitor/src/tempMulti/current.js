
import React from 'react';
import GraphCurrent from "../components/graphs/GraphCurrent"
import { Chart, registerables } from 'chart.js'
import AngryJOe from '../components/AngryJOe'
import {
  LoadingOutlined,
} from '@ant-design/icons';
import { CheckboxInt } from '../components/App'
import { Select } from 'antd';

const { Option } = Select;
Chart.register(...registerables)


const Current = (props) =>  {

  const context = React.useContext(CheckboxInt)
  const { clickedServers } = context

return (
      <div> 
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
}
  
export default Current;