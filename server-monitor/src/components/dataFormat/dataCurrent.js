import React from 'react'
import { CheckboxInt } from '../App'
import Current from '../../tempMulti/current'
import { InputNumber, Select, Space} from 'antd';
import {format, set, sub, isBefore} from 'date-fns'
import AngryJOe from '../AngryJOe'
import te from 'date-fns/esm/locale/te/index.js';
import {DataFetcher} from '../dataFetcher'
import {every_nth} from '../every_nth'
import Button from '@mui/material/Button';

var spacing = 1
const { Option } = Select;

var secsToSub = 60
const DataCurrent = () => {


  const context = React.useContext(CheckboxInt)
  const { startStop, setStartStop, timeInterval, setTimeInterval, globalData, setGlobalData, tempCurrentData, setTempCurrentData, rangeValue, setRangeValue } = context
  const mutationReff = React.useRef(tempCurrentData)
  const mutationRefff = React.useRef(globalData)

  const [seconds, setSeconds] = React.useState(0)
  const [tempGlobalData, setTempGlobalData] = React.useState([...globalData])
  
  

  
  React.useEffect(() =>
  {
    if(startStop){
       const waitInterval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
    return () => clearInterval(waitInterval)
    }
   
  })
  
  var lastTime, firstTime
  var time, tempObj
  var getIndexFirst, getIndexLast, getGlobalFirst
  
  
  function setTempData(){
    let intervall = changeInterval(secsToSub)
    var tempData = tempGlobalData.map((datas, i)=> {
      var ipaddr = Object.keys(datas)[0] 
      var fromTime = format(intervall[0], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var ind
      if(datas[ipaddr].timestamp.includes(fromTime)){
        ind = datas[ipaddr].timestamp.indexOf(fromTime)
      }
      else{
        console.log("hovno")
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
    console.log(tempData, 789, tempGlobalData)
    return tempData
  }
  
  function changeInterval(secsSub)  // vrati dva casy prvni a posledni ktery se ma ukazat
  {
    time = new Date()
    lastTime = new Date(time.getTime() - 1 * 1000)
    firstTime = new Date(time.getTime() - secsSub * 1000)
        return [firstTime, lastTime]
  }
      
      
      
      
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
        
        secsToSub = e
        let interval = changeInterval(secsToSub)
        
        globalData.map((data, i) =>{
          var fromFormat = format(interval[0], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
          var toFormat = format(interval[1], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
          var ipadr = Object.keys(data)[0]
          
          getIndexFirst = data[ipadr].timestamp.indexOf(fromFormat)
          getIndexLast = data[ipadr].timestamp.indexOf(toFormat)
          
          getGlobalFirst = data[ipadr].timestamp.at(0).split(".")[0].replace("T", " ")
        })

        const fromObj = {
          year: Number(getGlobalFirst.split('-')[0]),
          month: Number(getGlobalFirst.split('-')[1]) -1,
          day: Number(getGlobalFirst.split('-')[2].split(' ')[0]),
          hour: Number(getGlobalFirst.split(':')[0].split(' ')[1]),
          minute: Number(getGlobalFirst.split(' ')[1].split(':')[1]),
          second: Number(getGlobalFirst.split(' ')[1].split(':')[2])}
          
          var globalFirst = new Date(fromObj.year, fromObj.month, fromObj.day, fromObj.hour, fromObj.minute, fromObj.second)
          var GlobalminusSec = sub(globalFirst, {seconds: 1})
                  
          var tempInterval

          if(isBefore(interval[0], globalFirst)){
            console.log('yesss')
            console.log(interval[0], GlobalminusSec)
            tempInterval = {type: 'range', from:  format(interval[0], "yyyy-MM-dd kk:mm:ss"), to: GlobalminusSec}
            var tempGlobi = DataFetcher(tempInterval, 'before', globalData, tempInterval)
            setTempGlobalData([...tempGlobi])
            console.log(tempGlobalData)
            var tempikk = setTempData(secsToSub)
            var ever_NTH = tempCurrentData ? every_nth(tempikk, spacing) : tempikk
            setTempCurrentData(ever_NTH)
            console.log(tempCurrentData, tempGlobi, 123)
            setGlobalData(tempGlobi)
          }
          else{
            console.log(globalData)
            setTempGlobalData([...globalData])
            var tempikkk = setTempData(secsToSub)
            var ever_NTH = tempCurrentData ? every_nth(tempikkk, spacing) : tempikkk
            console.log(tempCurrentData)
            console.log(tempCurrentData, tempGlobi, 456)
            setTempCurrentData(ever_NTH)

          }          
        }

React.useEffect(() =>{
  
  if(startStop){
    var tempGlob = DataFetcher({type: 'update'}, 'update', globalData, timeInterval)
    
    setTempGlobalData([...tempGlob])
    var tempik = setTempData(secsToSub) // ???? jeslt hodit globalData nebo tyto upraveny g
    console.log(tempCurrentData, tempGlob)
    var ever_NTH = every_nth(tempik, spacing)
    setTempCurrentData(ever_NTH)
    setGlobalData(tempGlob)
  }
}, [seconds])


React.useEffect(() => {
  mutationReff.current = tempGlobalData
}, [tempGlobalData])
React.useEffect(() => {
  mutationRefff.current = globalData
}, [globalData])






  return (
    <div >
      <div>
        {startStop ? 
        <Button onClick={() => setStartStop(prevState => !prevState)} color="error" variant="contained" >STOP</Button>
        : 
        <Button onClick={() => setStartStop(prevState => !prevState)} variant="contained" >START</Button>
        }
      </div>
    <div>
   <Space>
      <InputNumber min={1} max={3600}  defaultValue={60} onPressEnter={(e) => onChange(parseInt(e.target.defaultValue), 1)} addonAfter={'Sec'}/>
      <InputNumber min={1} max={240}  defaultValue={1} onPressEnter={(e) => onChange(parseInt(e.target.defaultValue) * 60, 2)} addonAfter={'Min'}/>
      <InputNumber min={1} max={24}  defaultValue={0} onPressEnter={(e) => onChange(parseInt(e.target.defaultValue) * 3600, 3)} addonAfter={'Hour'}/>
   </Space>

    </div>

      <p>(for zoom and drag press "CTRL" key)</p>
   <Current tempData={tempCurrentData.length > 0 ? tempCurrentData : globalData}/>
    </div>
  )
}



export default DataCurrent










