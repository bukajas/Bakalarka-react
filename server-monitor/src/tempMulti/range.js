
import React from 'react';
import GraphRange from "../components/graphs/GraphRange"

import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import GrafHodnot from '../components/GrafHodnot'
import AngryJOe from '../components/AngryJOe'
import { Spin, DatePicker, TimePicker, Tabs } from 'antd';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import { CheckboxInt } from '../components/App'
import moment from 'moment';

const { RangePicker } = DatePicker;
const antIcon = <LoadingOutlined style={{ fontSize: 240 }} spin />;
Chart.register(...registerables)


const Range = () => {

    const context = React.useContext(CheckboxInt)

    const { oData, setoData,
      seconds, setSeconds,
      startStop, setStartStop,
      clickedServers, setClickedServers,
      clickedValues, setClickedValues,
      valuesPost, setValuesPost,
      rangeValue, setRangeValue,
      rangeData, setRangeData } = context


  //  const filteredHodnoty = rangeData ? rangeData.filter((temp2) =>     
  //     {const clickedArray = clickedServers
  //       if(clickedArray.includes(temp2.info.ip)) {          return temp2.info.ip         }
  //     }) : <Spin indicator={antIcon} />



  function onChange(dates, dateStrings) {
    setRangeValue({...rangeValue, from: dateStrings[0], to: dateStrings[1]})
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }

  return (
        <div>
        <RangePicker ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')],  }} showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange} />
       
        {clickedServers.map((temp) => 
        rangeData ? rangeData.map((temp2) => {
          var ipaddr = Object.keys(temp2)
        if(ipaddr == temp.split(" ")[0] && Object.keys(temp2[ipaddr]).slice(1).includes(temp.split(" ")[1]))
        {
          return <GraphRange 
          data1={temp} data2={temp2} ipAddr={ipaddr}
          />
        }}  
  ) : <AngryJOe />
)   
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