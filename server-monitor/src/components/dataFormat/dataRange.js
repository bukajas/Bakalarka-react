import React from 'react'
import { CheckboxInt } from '../App'
import Range from '../../tempMulti/range'
import { InputNumber, Select, Space } from 'antd';
import {format, set} from 'date-fns'
import AngryJOe from '../AngryJOe'
import moment from 'moment';
import { Spin, DatePicker, TimePicker, Tabs } from 'antd';
import {dataFetcher} from '../dataFetcher'

const { RangePicker } = DatePicker;

const { Option } = Select;




const DataRange = () => {
  const context = React.useContext(CheckboxInt)
  const { startStop, timeInterval, setTimeInterval, globalData, rangeValue, setRangeValue, tempRangeData, setTempRangeData } = context
  const mutationRef = React.useRef(tempRangeData)
  const isFirstRender = React.useRef(true);
  const [secsToSub, setSecsToSub] = React.useState(60)
  const [seconds, setSeconds] = React.useState(0)
  const [firstIndex, setFirstIndex] = React.useState(0)
  
  
var hovno = dataFetcher({type: 'range', from: "2021-02-01 01:00:00",to: "2021-02-01 01:01:00"}, 'before', globalData, timeInterval)
console.log(hovno)

  var newTime, toTime
  var time, tempObj
  var getIndexFirst, getIndexLast, getGlobalFirst




    function setTempData(getIndexFirst){
      var tempData = globalData.map((datas, i)=> {
      var ipaddr = Object.keys(datas)[0] 
    {return {[ipaddr]: {
         name: datas[ipaddr].name,
         description: datas[ipaddr].description,
         cpu: datas[ipaddr].cpu.slice(getIndexFirst),
         ram: datas[ipaddr].ram.slice(getIndexFirst),
         timestamp: datas[ipaddr].timestamp.slice(getIndexFirst),
         bit_rate_in: datas[ipaddr].bit_rate_in.slice(getIndexFirst),
         bit_rate_out: datas[ipaddr].bit_rate_out.slice(getIndexFirst),
         packet_rate_in: datas[ipaddr].packet_rate_in.slice(getIndexFirst),
         packet_rate_out: datas[ipaddr].packet_rate_out.slice(getIndexFirst),
         tcp_established: datas[ipaddr].tcp_established.slice(getIndexFirst),
     }}}
     })
     return tempData
    }

    function onChange(dates, dateStrings) {
      const fromObj = {
        year: Number(dateStrings[0].split('-')[0]),
        month: Number(dateStrings[0].split('-')[1]) -1,
        day: Number(dateStrings[0].split('-')[2].split(' ')[0]),
        hour: Number(dateStrings[0].split(':')[0].split(' ')[1]),
        minute: Number(dateStrings[0].split(' ')[1].split(':')[1]),
        second: Number(dateStrings[0].split(' ')[1].split(':')[2])}
      const toObj = {
        year: Number(dateStrings[1].split('-')[0]),
        month: Number(dateStrings[1].split('-')[1]) -1,
        day: Number(dateStrings[1].split('-')[2].split(' ')[0]),
        hour: Number(dateStrings[1].split(':')[0].split(' ')[1]),
        minute: Number(dateStrings[1].split(' ')[1].split(':')[1]),
        second: Number(dateStrings[1].split(' ')[1].split(':')[2])}

      var fromInt, toInt, fromFormat
      fromInt = new Date(fromObj.year, fromObj.month, fromObj.day, fromObj.hour, fromObj.minute, fromObj.second)
      toInt = new Date(toObj.year, toObj.month, toObj.day, toObj.hour, toObj.minute, toObj.second)

       globalData.map((data, i)=> {
        var objKey = Object.keys(data)[0]
        fromFormat = format(fromInt, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
        var getIndexFirst = data[objKey].timestamp.indexOf(fromFormat)
        var getGlobalFirst = data[objKey].timestamp.at(0).split(".")[0].replace("T", " ")


        var minusSec
        if(getIndexFirst == -1){
        if(getGlobalFirst.at(-1) == 0){
          minusSec = getGlobalFirst.slice(-2) - 1
          getGlobalFirst = getGlobalFirst.slice(0, -1) + minusSec
        } else{
          minusSec = getGlobalFirst.at(-1) - 1
          getGlobalFirst = getGlobalFirst.slice(0, -1) + minusSec
        } 
          tempObj = {from:  format(fromInt, "yyyy-MM-dd kk:mm:ss"), to: getGlobalFirst}
          setTimeInterval(tempObj)
          getIndexFirst = 0
        }
        var tempik = setTempData(getIndexFirst)
        setTempRangeData(tempik)
        setFirstIndex(getIndexFirst)

        console.log(firstIndex, 78)
       })
      }

React.useEffect(() =>{
  var tempik = setTempData(getIndexFirst)
  setTempRangeData(tempik)

}, [timeInterval])

React.useEffect(() =>{
  var tempik = 
  mutationRef.current = tempik
  console.log(globalData[0], 99, setTempData(getIndexFirst), firstIndex)
}, [tempRangeData, timeInterval])






//console.log(tempRangeData)
  return (
    <div>
   <Space direction="vertical">
    <RangePicker ranges={{ 'This minute': [moment().startOf('minute'), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')],  }} showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange} />
   </Space>
      <Range rangeData={tempRangeData}/>
    </div>
  )
}

export default DataRange