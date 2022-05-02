import React from 'react'
import { CheckboxInt } from '../App'
import Current from '../../tempMulti/current'
import { InputNumber, Select, Space } from 'antd';
import {format, set} from 'date-fns'

const { Option } = Select;

const DataCurrent = () => {

    const context = React.useContext(CheckboxInt)

    const { startStop, timeInterval, setTimeInterval, globalData } = context
    const [tempCurrentData, setTempCurrentData] = React.useState([])

    const selectAfter = (
        <Select defaultValue="Sec" style={{ width: 60 }}>
          <Option value="Sec">Sec</Option>
          <Option value="Min">Min</Option>
          <Option value="Hour">Hour</Option>

        </Select>
      )
  
    function changeInterval(secsSub) {
        var tempSecsSub = parseInt(secsSub.target.defaultValue)
        var time = new Date()
        var fromTime
        globalData.map((data, i) =>{
            var objKey = Object.keys(data)
            fromTime = data[objKey].timestamp.at(-tempSecsSub)
        console.log(fromTime, 55)
          })
        var newTime = new Date(time.getTime() - tempSecsSub * 1000)
        var tempObj = {from: format(newTime, 'yyyy-MM-dd kk:mm:ss'), to: format(time, 'yyyy-MM-dd kk:mm:ss')

      }
          setTimeInterval(tempObj)

        }






    console.log(globalData)
// if je v global data


//if neni tak pak spustit tu funkci znova





  return (
    <div>
   <Space direction="vertical">
    <InputNumber min={0} max={3600} addonAfter={selectAfter} defaultValue={60} onPressEnter={(e)=>changeInterval(e, selectAfter.props.defaultValue)}/>
   </Space>

        <Current tempData={tempCurrentData}/>
    </div>
  )
}

export default DataCurrent