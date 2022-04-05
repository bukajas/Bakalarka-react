import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import GrafHodnot from './GrafHodnot'
import AngryJOe from './AngryJOe'
import { Spin, DatePicker, TimePicker, Tabs } from 'antd';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import { CheckboxInt } from './App'
import moment from 'moment';


const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const antIcon = <LoadingOutlined style={{ fontSize: 240 }} spin />;
Chart.register(...registerables)

function callback(key) {
  console.log(key);
}



const Grafy = () => {

    const context = React.useContext(CheckboxInt)

    const { data, setData,
      seconds, setSeconds,
      startStop, setStartStop,
      clickedServers, setClickedServers,
      clickedValues, setClickedValues,
      valuesPost, setValuesPost,
      rangeValue, setRangeValue } = context


   const filteredHodnoty = data ? data.filter((temp2) =>     
      {const clickedArray = clickedServers
        if(clickedArray.includes(temp2.info.ip)) {          return temp2.info.ip         }
      }) : <Spin indicator={antIcon} />



  function onChange(dates, dateStrings) {
    setRangeValue({...rangeValue, from: dateStrings[0], to: dateStrings[1]})
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }



  return (
        <div>

              <RangePicker ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')],  }} showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange} />
            { data ? filteredHodnoty.map((da) => clickedValues.map((dat) =>
            <GrafHodnot
            info={da.info} 
            values={da.values} 
            zmackni={dat}
            height={500} 
            width={2000} 
          />)) : <AngryJOe />   
          }
          <button onClick={() => setStartStop(prevState => !prevState)} className='btn-start-stop' >{startStop ? "Stop" : "Start"}</button>



          <div>
          
          </div>


          
          
        </div>
  )
}

export default Grafy
