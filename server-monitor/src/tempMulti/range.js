
import React from 'react';
import GraphRange from "../components/graphs/GraphRange"
import { Chart, registerables } from 'chart.js'
import AngryJOe from '../components/AngryJOe'
import { Spin, DatePicker, TimePicker, Tabs } from 'antd';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import { CheckboxInt } from '../components/App'

const { RangePicker } = DatePicker;
const antIcon = <LoadingOutlined style={{ fontSize: 240 }} spin />;
Chart.register(...registerables)


const Range = (props) => {

    const context = React.useContext(CheckboxInt)
    const { clickedServers, rangeValue, setRangeValue, } = context



  function onChange(dates, dateStrings) {
    setRangeValue({...rangeValue, from: dateStrings[0], to: dateStrings[1]})
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }

  return (
        <div>
        <p>(for zoom and drag press "CTRL" key)</p>
       
        { clickedServers.length > 0 ? clickedServers.map((temp) => 
        props.rangeData ? props.rangeData.map((temp2) => {
          var ipaddr = Object.keys(temp2)
          if(ipaddr == temp.split(" ")[0] && temp.split(" ")[1] == 'cpu_ram'){
            return <GraphRange  
            cpuram={true} data1={temp} data2={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name} 
             />
          }
        if(ipaddr == temp.split(" ")[0] && Object.keys(temp2[ipaddr]).slice(1).includes(temp.split(" ")[1]))
        {
          return <GraphRange 
          cpuram={false} data1={temp} data2={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name}
          />
        }}  
  ) : <AngryJOe />
)   : <AngryJOe />
}
            {/* { rangeData ? filteredHodnoty.map((da) => clickedValues.map((dat) =>
            <GrafHodnot
            info={da.info} 
            values={da.values} 
            zmackni={dat}
            height={500} 
            width={2000} 
          />)) : <AngryJOe />   
          } */}
        </div>
  )
};
  
export default Range;