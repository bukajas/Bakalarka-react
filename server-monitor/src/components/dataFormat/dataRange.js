import React from 'react'
import { CheckboxInt } from '../App'
import Range from '../../tempMulti/range'
import { InputNumber, Select, Space } from 'antd';
import {format, set} from 'date-fns'
import AngryJOe from '../AngryJOe'
import moment from 'moment';
import { Spin, DatePicker, TimePicker, Tabs } from 'antd';


const { RangePicker } = DatePicker;

const { Option } = Select;

const DataRange = () => {

    const context = React.useContext(CheckboxInt)
    const { startStop, timeInterval, setTimeInterval, globalData, rangeValue, setRangeValue, tempRangeData, setTempRangeData } = context
    const mutationRef = React.useRef(tempRangeData)
    const [secsToSub, setSecsToSub] = React.useState(60)
    const [seconds, setSeconds] = React.useState(0)

    function onChange(dates, dateStrings) {
        setRangeValue({...rangeValue, from: dateStrings[0], to: dateStrings[1]})
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

      }



//console.log(secsToSub)
var newTime, toTime
var time, tempObj
var getIndexFirst, getIndexLast, getGlobalFirst

    function changeInterval(secsSub, dateStrings) {
        


        time = new Date()
        toTime = new Date(time.getTime() - 1 * 1000)
        var fromTime
        globalData.map((data, i) =>{
            var objKey = Object.keys(data)
            fromTime = data[objKey].timestamp.at(-secsSub)
          })
        newTime = new Date(time.getTime() - secsSub * 1000)
        tempObj = {from: format(newTime, "yyyy-MM-dd kk:mm:ss"), to: format(time, "yyyy-MM-dd kk:mm:ss")
      }
          return [tempObj, newTime, toTime]
        }
        //beru jen rozsah nepotrebuju soucasne update

React.useEffect(() =>{
    console.log("rangeeee")


     let interval = changeInterval(secsToSub)

  //  console.log(timeInterval)
    globalData.map((data, i) =>{
      var fromFormat = format(interval[1], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var toFormat = format(interval[2], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var ipadr = Object.keys(data)[0]
      
      getIndexFirst = data[ipadr].timestamp.indexOf(fromFormat)
      getIndexLast = data[ipadr].timestamp.indexOf(toFormat)

      getGlobalFirst = data[ipadr].timestamp.at(0).split(".")[0].replace("T", " ")
      var minusSec
      if(getIndexFirst == -1){
      if(getGlobalFirst.at(-1) == 0){
        minusSec = getGlobalFirst.slice(-2) - 1
        getGlobalFirst = getGlobalFirst.slice(0, -1) + minusSec
      } else{
        minusSec = getGlobalFirst.at(-1) - 1
        getGlobalFirst = getGlobalFirst.slice(0, -1) + minusSec
      } 
        tempObj = {from:  format(interval[1], "yyyy-MM-dd kk:mm:ss"), to: getGlobalFirst}
        setTimeInterval(tempObj)
      }
    })
  getIndexFirst ? setTempRangeData(globalData.map((datas, i)=> {
    var ipaddr =Object.keys(datas)[0] 
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
   })) : <AngryJOe />


}, [rangeValue])

React.useEffect(() =>{
  mutationRef.current = tempRangeData
}, [tempRangeData, rangeValue])

  return (
    <div>
   <Space direction="vertical">
    <RangePicker ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')],  }} showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange} />
   </Space>
      <Range rangeData={tempRangeData}/>
    </div>
  )
}

export default DataRange