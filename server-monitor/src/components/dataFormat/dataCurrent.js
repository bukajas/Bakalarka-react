import React from 'react'
import { CheckboxInt } from '../App'
import Current from '../../tempMulti/current'
import { InputNumber, Select, Space} from 'antd';
import {format, set, sub, isBefore} from 'date-fns'
import AngryJOe from '../AngryJOe'
import {DataFetcher} from '../dataFetcher'
import {every_nth} from '../functions/every_nth'
import Button from '@mui/material/Button';
import {DateFormater} from '../functions/dateFormater'
import {Config} from '../../config.js'
import Axios from 'axios'
import SetPostValues from '../functions/SetPostValues'
import AddData from '../functions/AddData'

const { Option } = Select;

var spacing = 1
var secsToSub = 60

const DataCurrent = () => {


  const context = React.useContext(CheckboxInt)
  const { startStop, setStartStop,  globalData, setGlobalData, tempCurrentData, setTempCurrentData } = context
  const [seconds, setSeconds] = React.useState(0)
  const [returned, setReturned] = React.useState(false)


  React.useEffect(() =>
  {
    if(startStop){
       const waitInterval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
    return () => clearInterval(waitInterval)
    }
  })

  
  function setTempData(tempGlobi, globalDates){ // nastavi docasnou promenou
     var tempData = tempGlobi.map((datas, i)=> {
      var ipaddr = Object.keys(datas)[0] 
      var fromTime = format(globalDates[2], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var ind
      if(datas[ipaddr].timestamp.includes(fromTime)){
        ind = datas[ipaddr].timestamp.indexOf(fromTime)
      }
      else{ ind = 0 - secsToSub }
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
    return tempData
  }
      
function globalFirstLast(){
  var getGlobalFirst, getGlobalLast
  globalData.map((data, i) =>{
    var ipadr = Object.keys(data)[0]
    getGlobalFirst = data[ipadr].timestamp.at(0).split(".")[0].replace("T", " ") // prvni global cas
    getGlobalLast = data[ipadr].timestamp.at(-1).split(".")[0].replace("T", " ")
  })
    var first = DateFormater(getGlobalFirst)
    var last = DateFormater(getGlobalLast)
    var globalFirst = new Date(first.year, first.month, first.day, first.hour, first.minute, first.second)
    var globalLast = new Date(last.year, last.month, last.day, last.hour, last.minute, last.second)
    var globalminusSec = sub(globalFirst, {seconds: 1})
    let interval = sub(globalLast, {seconds: secsToSub}) 

  return [globalFirst, globalLast, interval, globalminusSec]
}

      function onChange(e, f) {
        if(f == 1){  spacing = 1   }
        if(f == 2){  spacing = 5   }
        if(f == 3){  spacing = 120 }
        secsToSub = e
        var globalDates = globalFirstLast() //prvni a posledni global dat
          // odectene jedne vteriny aby to navazovalo
        let interval = sub(globalDates[1], {seconds: secsToSub}) 
        var tempInterval
        
        if(isBefore(interval, globalDates[0])){         
          tempInterval = SetPostValues('before', globalDates)
            FetchData('before', tempInterval, globalDates)
          }
          else {
            var tempikkk = setTempData(globalData, globalDates)
            if(spacing !== 1){
              var ever_NTH = tempCurrentData ? every_nth(tempikkk, spacing) : tempikkk
              setTempCurrentData(ever_NTH)
            }
            else{
              setTempCurrentData(tempikkk)
            }
          } 
          
          
        }




React.useEffect(() =>{
  
  if(startStop){
    var dattes = globalFirstLast()
    FetchData('update', {type: "update", last: format(dattes[1], "yyyy-MM-dd kk:mm:ss")}, dattes)
  }
}, [seconds])


function FetchData(type, postValues, globalDates){
  setReturned(false)
  var tempOBJ = []
  Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
        .then((response) => {
          if (!response.data.error) 
          {
              response.data.data.map((datas, i) => {
              var fetchedKey = datas.info.ip; 
               var newServer = {[fetchedKey]: {
                name: datas.info.name,
                description: datas.info.os,
                cpu: datas.values.map((datas2) => {return datas2.cpu}),
                ram: datas.values.map((datas2) => {return datas2.ram}),
                timestamp: datas.values.map((datas2) => {return datas2.timestamp}),
                bit_rate_in: datas.values.map((datas2) => {return datas2.bit_rate_in}),
                bit_rate_out: datas.values.map((datas2) => {return datas2.bit_rate_out}),
                packet_rate_in: datas.values.map((datas2) => {return datas2.packet_rate_in}),
                packet_rate_out: datas.values.map((datas2) => {return datas2.packet_rate_out}),
                tcp_established: datas.values.map((datas2) => {return datas2.tcp_established}),
               }}
               tempOBJ[i] = newServer // formatovane data ze serveru
              })
            } 
            else {console.log(response.data.message)}
              var tempGlob = AddData(type, globalData, tempOBJ)
              var tempik = setTempData(tempGlob, globalDates)
              if(spacing !== 1){
                var ever_NTH = tempCurrentData ? every_nth(tempik, spacing) : tempik
                setTempCurrentData(ever_NTH)
              }
              else{
                setTempCurrentData(tempik)
              }
              setGlobalData(tempGlob)
          })
          .catch((error) => {
            console.log("Server is unavailable")
            console.log(error)
          })       
}

React.useEffect(() =>{
  setReturned(true)
},[tempCurrentData])




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










