import React from 'react'
import { CheckboxInt } from '../App'
import Current from '../../tempMulti/current'
import { InputNumber, Select, Space } from 'antd';
import {format, set} from 'date-fns'
import AngryJOe from '../AngryJOe'
import te from 'date-fns/esm/locale/te/index.js';
import {dataFetcher} from '../dataFetcher'



var spacing = 1
const { Option } = Select;

var secsToSub = 60
const DataCurrent = () => {




    const context = React.useContext(CheckboxInt)
    const { startStop, timeInterval, setTimeInterval, globalData, tempCurrentData, setTempCurrentData, rangeValue, setRangeValue } = context
    const mutationReff = React.useRef(tempCurrentData)
    const mutationRefff = React.useRef(globalData)
    const [seconds, setSeconds] = React.useState(0)


    React.useEffect(() =>
    {
  //    console.log(startStop)
      const waitInterval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
      return () => clearInterval(waitInterval)
    }, [])
    var newTime, toTime
    var time, tempObj
    var getIndexFirst, getIndexLast, getGlobalFirst
    

    function setTempData(){
      let intervall = changeInterval(secsToSub)
      var tempData = globalData.map((datas, i)=> {
      var ipaddr = Object.keys(datas)[0] 
      var fromTime = format(intervall[1], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var ind

      if(datas[ipaddr].timestamp.includes(fromTime)){
        ind = datas[ipaddr].timestamp.indexOf(fromTime)
      }
      else{
        ind = 0 - secsToSub
      }
      
    {return {[ipaddr]: {
         name: datas[ipaddr].name,
         description: datas[ipaddr].description,
         cpu: datas[ipaddr].cpu.slice(ind),
         ram: datas[ipaddr].ram.slice(ind),
         timestamp: datas[ipaddr].timestamp.slice(ind),
         bit_rate_in: datas[ipaddr].bit_rate_in.slice(ind),
         bit_rate_out: datas[ipaddr].bit_rate_out.slice(ind),
         packet_rate_in: datas[ipaddr].packet_rate_in.slice(ind),
         packet_rate_out: datas[ipaddr].packet_rate_out.slice(ind),
         tcp_established: datas[ipaddr].tcp_established.slice(ind),
     }}}
     })
   //  console.log(tempData, globalData)
     return tempData
    }


function every_nth(data, nth){
  var tempFilter = [...data]
  var tempFilterServer
  tempFilter.map((date, i) => {
    var ipadddr = Object.keys(date)[0] 
    tempFilterServer = {...date[ipadddr]}
    tempFilterServer.cpu = tempFilterServer.cpu.filter((e,i) => i % nth === nth -1)
    tempFilterServer.ram = tempFilterServer.ram.filter((e,i) => i % nth === nth -1)
    tempFilterServer.timestamp = tempFilterServer.timestamp.filter((e,i) => i % nth === nth -1)
    tempFilterServer.bit_rate_in = tempFilterServer.bit_rate_in.filter((e,i) => i % nth === nth -1)
    tempFilterServer.bit_rate_out = tempFilterServer.bit_rate_out.filter((e,i) => i % nth === nth -1)
    tempFilterServer.packet_rate_out = tempFilterServer.packet_rate_out.filter((e,i) => i % nth === nth -1)
    tempFilterServer.packet_rate_in = tempFilterServer.packet_rate_in.filter((e,i) => i % nth === nth -1)
    tempFilterServer.tcp_established = tempFilterServer.tcp_established.filter((e,i) => i % nth === nth -1)
    tempFilter[i] = tempFilterServer

  })
  return tempFilter // cely data, at se neseru a state
}

//console.log(every_nth(tempCurrentData, 5), tempCurrentData)


    function changeInterval(secsSub) {
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

    const selectAfter = (
      <Select defaultValue="Sec" style={{ width: 60 }}>
          <Option value="Sec">Sec</Option>
          <Option value="Min">Min</Option>
          <Option value="Hour">Hour</Option>
        </Select>
      )




function onChange(e, f) {
  if(f == 1){
    spacing = 1
  }
  if(f == 2){
    spacing = 5
  }
  if(f == 3){
    spacing = 120
  }
  console.log(spacing, 'space')

  secsToSub = e
  let interval = changeInterval(secsToSub)

  globalData.map((data, i) =>{
    var fromFormat = format(interval[1], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
    var toFormat = format(interval[2], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
    var ipadr = Object.keys(data)[0]
    
    getIndexFirst = data[ipadr].timestamp.indexOf(fromFormat)
    getIndexLast = data[ipadr].timestamp.indexOf(toFormat)

    getGlobalFirst = data[ipadr].timestamp.at(0).split(".")[0].replace("T", " ")
    var minusSec
    if(getGlobalFirst.at(-1) == 0){
      minusSec = getGlobalFirst.slice(-2) - 1
      getGlobalFirst = getGlobalFirst.slice(0, -1) + minusSec
    } else{
      minusSec = getGlobalFirst.at(-1) - 1
      getGlobalFirst = getGlobalFirst.slice(0, -1) + minusSec
    } if(getIndexFirst == -1){
      tempObj = {from:  format(interval[1], "yyyy-MM-dd kk:mm:ss"), to: getGlobalFirst}
      getIndexFirst = 0
    }
  })
    setTimeInterval(state => ({...state, from: tempObj.from, to: tempObj.to}))
}

React.useEffect(() => {

  
  var tempik = setTempData()

  setTempCurrentData(tempik)

}, [timeInterval])

React.useEffect(() =>{
    if(startStop){
     let interval = changeInterval(secsToSub)
    globalData.map((data, i) =>{
      var fromFormat = format(interval[1], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var toFormat = format(interval[2], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var ipadr = Object.keys(data)[0]
      
      getIndexFirst = data[ipadr].timestamp.indexOf(fromFormat)
      getIndexLast = data[ipadr].timestamp.indexOf(toFormat)

      getGlobalFirst = data[ipadr].timestamp.at(0).split(".")[0].replace("T", " ")
      var minusSec
      if(getGlobalFirst.at(-1) == 0){
        minusSec = getGlobalFirst.slice(-2) - 1
        getGlobalFirst = getGlobalFirst.slice(0, -1) + minusSec
      } else{
        minusSec = getGlobalFirst.at(-1) - 1
        getGlobalFirst = getGlobalFirst.slice(0, -1) + minusSec
      } if(getIndexFirst == -1){
        tempObj = {from:  format(interval[1], "yyyy-MM-dd kk:mm:ss"), to: getGlobalFirst}
        
        getIndexFirst = 0
      }
    })
  //  console.log(globalData)
    var tempik = setTempData()
    setTempCurrentData(tempik)

  }
}, [seconds])

React.useEffect(() => {
  mutationReff.current = tempCurrentData
}, [tempCurrentData])

React.useEffect(() => {
  mutationRefff.current = globalData
 // console.log(globalData, mutationRefff.current)


}, [globalData])


 
var ever_NTH = every_nth(tempCurrentData, spacing)
//console.log(ever_NTH[0], tempCurrentData[0], spacing)
//nevim musim se doptat

var hovno = dataFetcher({type: 'range', from: "2021-02-01 01:00:00",to: "2021-02-01 01:01:00"}, 'before', globalData, timeInterval)
console.log(hovno, 'hovno')

  return (
    <div>
   <Space direction="vertical">
      <InputNumber min={0} max={3600}  defaultValue={60} onPressEnter={(e) => onChange(parseInt(e.target.defaultValue), 1)} addonAfter={'S'}/>
      <InputNumber min={0} max={240}  defaultValue={1} onPressEnter={(e) => onChange(parseInt(e.target.defaultValue) * 60, 2)} addonAfter={'M'}/>
      <InputNumber min={0} max={24}  defaultValue={0} onPressEnter={(e) => onChange(parseInt(e.target.defaultValue) * 3600, 3)} addonAfter={'H'}/>
   </Space>
      <Current tempData={tempCurrentData}/>
    </div>
  )
}

export default DataCurrent










