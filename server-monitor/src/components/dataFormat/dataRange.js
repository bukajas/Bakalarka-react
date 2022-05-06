import React from 'react'
import { CheckboxInt } from '../App'
import Range from '../../tempMulti/range'
import { InputNumber, Select, Space } from 'antd';
import {format, set, isBefore, sub} from 'date-fns'
import AngryJOe from '../AngryJOe'
import moment from 'moment';
import { Spin, DatePicker, TimePicker, Tabs } from 'antd';
import {DataFetcher} from '../dataFetcher'
import {every_nth} from '../every_nth'
import {Config} from '../../config.js'
import Axios from 'axios'


const { RangePicker } = DatePicker;

const { Option } = Select;



var spacing = 1
const DataRange = () => {


function fetcher(postValuess, type, timeeInterval){
  
  var postValues
  var timeLast
  var timeFirst


    if(type == 'first')  //prvni stazeni
      {
        postValues = postValuess
      }
    else
      {
        if(globalData.length > 0)
        {
          var ipadr = Object.keys(globalData[0])[0]
          timeLast = globalData[0][ipadr].timestamp.at(-1).split(".")[0].replace("T", " ")
          timeFirst = globalData[0][ipadr].timestamp.at(1).split(".")[0].replace("T", " ")
        }
        if(type == 'before'){ // = range, curent
          if(timeFirst > timeeInterval.from){
            postValues = {type: "range",  from: timeeInterval.from, to: timeeInterval.to}
          }
          else{
            console.log('stale v rozmezi')
            return
          }
        }
        if(type == 'update'){
          var tempTime = timeLast.split(".")[0].replace("T", " ")
      postValues = {type: "update", last: tempTime}
    }
  }
  

  var tempOBJ = []
  let tempServer
  var tempGlobal = [...globalData]
  var globalIps  = []
  var fetchedIps = []
  var aga = []
  tempGlobal.map((data) => { var globalKey = Object.keys(data)[0]; globalIps.push(globalKey) })



  Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
  .then((response) => {
    if (!response.data.error) 
    {
        response.data.data.map((datas, i) => {
        var fetchedKey = datas.info.ip; 
        fetchedIps.push(fetchedKey)
         var newServer = {[datas.info.ip]: {
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

          tempOBJ.map((datas, i) => {  //fetched data
            var OBJIp = Object.keys(datas)[0] // ipadresa objektu
            if(globalIps.includes(OBJIp))
            {
              var globalLength = tempGlobal[i][OBJIp].timestamp.length
              var globalIndex = globalIps.indexOf(OBJIp)
              tempServer = {...tempGlobal[globalIndex]}

              //replace data from server to avoid duplacates, and to replace the nulls
              if(type == 'before'){
                var arrayLength = datas[OBJIp].timestamp.length  //delka ziskanych dat
                tempServer[OBJIp].cpu = [...datas[OBJIp].cpu, ...tempServer[OBJIp].cpu]
                tempServer[OBJIp].ram = [...datas[OBJIp].ram, ...tempServer[OBJIp].ram]
                tempServer[OBJIp].timestamp = [...datas[OBJIp].timestamp, ...tempServer[OBJIp].timestamp]
                tempServer[OBJIp].bit_rate_in = [...datas[OBJIp].bit_rate_in, ...tempServer[OBJIp].bit_rate_in]
                tempServer[OBJIp].bit_rate_out = [...datas[OBJIp].bit_rate_out, ...tempServer[OBJIp].bit_rate_out]
                tempServer[OBJIp].packet_rate_in = [...datas[OBJIp].packet_rate_in, ...tempServer[OBJIp].packet_rate_in]
                tempServer[OBJIp].packet_rate_out = [...datas[OBJIp].packet_rate_out, ...tempServer[OBJIp].packet_rate_out]
                tempServer[OBJIp].tcp_established = [...datas[OBJIp].tcp_established, ...tempServer[OBJIp].tcp_established]
              }
              else{
                var arrayLength = datas[OBJIp].timestamp.length  //delka ziskanych dat
                tempServer[OBJIp].cpu = [...tempServer[OBJIp].cpu, ...datas[OBJIp].cpu]
                tempServer[OBJIp].ram = [...tempServer[OBJIp].ram, ...datas[OBJIp].ram]
                tempServer[OBJIp].timestamp = [...tempServer[OBJIp].timestamp, ...datas[OBJIp].timestamp]
                tempServer[OBJIp].bit_rate_in = [...tempServer[OBJIp].bit_rate_in, ...datas[OBJIp].bit_rate_in]
                tempServer[OBJIp].bit_rate_out = [...tempServer[OBJIp].bit_rate_out, ...datas[OBJIp].bit_rate_out]
                tempServer[OBJIp].packet_rate_in = [...tempServer[OBJIp].packet_rate_in, ...datas[OBJIp].packet_rate_in]
                tempServer[OBJIp].packet_rate_out = [...tempServer[OBJIp].packet_rate_out, ...datas[OBJIp].packet_rate_out]
                tempServer[OBJIp].tcp_established = [...tempServer[OBJIp].tcp_established, ...datas[OBJIp].tcp_established]
            }
            }
            if(globalLength > 4000) {
              var diference = globalLength - 4000
              tempServer[OBJIp].cpu = tempServer[OBJIp].cpu.slice(diference)
              tempServer[OBJIp].ram = tempServer[OBJIp].ram.slice(diference)
              tempServer[OBJIp].timestamp = tempServer[OBJIp].timestamp.slice(diference)
              tempServer[OBJIp].bit_rate_in = tempServer[OBJIp].bit_rate_in.slice(diference)
              tempServer[OBJIp].bit_rate_out = tempServer[OBJIp].bit_rate_out.slice(diference)
              tempServer[OBJIp].packet_rate_in = tempServer[OBJIp].packet_rate_in.slice(diference)
              tempServer[OBJIp].packet_rate_out = tempServer[OBJIp].packet_rate_out.slice(diference)
              tempServer[OBJIp].tcp_established = tempServer[OBJIp].tcp_established.slice(diference)
            }

            if(!globalIps.includes(OBJIp)){  //pokud v global neni tento server
              if(tempGlobal.length >= 1 && !(tempGlobal[0][Object.keys(tempGlobal[0])].timestamp.at(0) == datas[Object.keys(datas)].timestamp.at(0))){ //pokud uz tam neco je, ale pridam na zacatek null, aby vse bylo stejne dlouhe.
                tempServer = {...datas}
                globalLength = tempGlobal[0][Object.keys(tempGlobal[0])].timestamp.length
                const tempArrPre = Array(globalLength - 1).fill(null)
                tempServer[OBJIp].cpu = [...tempArrPre, ...tempServer[OBJIp].cpu]
                tempServer[OBJIp].ram = [...tempArrPre,...tempServer[OBJIp].ram]
                tempServer[OBJIp].bit_rate_in = [...tempArrPre,...tempServer[OBJIp].bit_rate_in]
                tempServer[OBJIp].bit_rate_out = [ ...tempArrPre,...tempServer[OBJIp].bit_rate_out]
                tempServer[OBJIp].packet_rate_in = [ ...tempArrPre,...tempServer[OBJIp].packet_rate_in]
                tempServer[OBJIp].packet_rate_out = [ ...tempArrPre,...tempServer[OBJIp].packet_rate_out]
                tempServer[OBJIp].tcp_established = [ ...tempArrPre,...tempServer[OBJIp].tcp_established]
                tempServer[OBJIp].timestamp = [...tempGlobal[0][Object.keys(tempGlobal[0])].timestamp, ...tempServer[OBJIp].timestamp, ]
                tempGlobal[tempGlobal.length] = tempServer
                aga = [...aga, tempGlobal] 
              }
              else{
                tempGlobal[tempGlobal.length] = {...datas}
                aga = [...aga, tempGlobal]
              }
            }
            tempGlobal[i] = tempServer

            tempGlobal.map((datas2, i2) => {
              var tempIPglob = Object.keys(datas2)[0]
              if(!fetchedIps.includes(tempIPglob)){
                tempServer = {...datas2}
                const tempArrAft = Array(arrayLength).fill(null)
                tempServer[tempIPglob].cpu = [...tempServer[tempIPglob].cpu, ...tempArrAft]
                tempServer[tempIPglob].ram = [...tempServer[tempIPglob].ram, ...tempArrAft]
                tempServer[tempIPglob].bit_rate_in = [...tempServer[tempIPglob].bit_rate_in, ...tempArrAft]
                tempServer[tempIPglob].bit_rate_out = [...tempServer[tempIPglob].bit_rate_out, ...tempArrAft]
                tempServer[tempIPglob].packet_rate_in = [...tempServer[tempIPglob].packet_rate_in, ...tempArrAft]
                tempServer[tempIPglob].packet_rate_out = [...tempServer[tempIPglob].packet_rate_out, ...tempArrAft]
                tempServer[tempIPglob].tcp_established = [...tempServer[tempIPglob].tcp_established, ...tempArrAft]
                tempServer[tempIPglob].timestamp = [...tempServer[tempIPglob].timestamp, ...datas[OBJIp].timestamp]
              }
          })
        })

        aga = tempGlobal
      } 
      else {
        console.log(response.data.message)
      }
    })
    .catch((error) => {
      console.log("Server is unavailable")
      console.log(error)
    })
    return tempGlobal
}








  const context = React.useContext(CheckboxInt)
  const { startStop, timeInterval, setTimeInterval, globalData, rangeValue, setRangeValue, tempRangeData, setTempRangeData } = context
  const mutationRef = React.useRef(tempRangeData)
  const isFirstRender = React.useRef(true);
  const [secsToSub, setSecsToSub] = React.useState(60)

  const [tempGlobalData, setTempGlobalData] = React.useState([])
  
  

  var newTime, toTime
  var time, tempObj
  var getIndexFirst, getIndexLast, getGlobalFirst


    function setTempData(tempGlobi, from, to){

      var tempData = tempGlobi.map((datas, i)=> {
      var ipaddr = Object.keys(datas)[0] 
       var indexFrom = datas[ipaddr].timestamp.indexOf(from)
       var indexTo = datas[ipaddr].timestamp.indexOf(to)

    {return {[ipaddr]: {
         name: datas[ipaddr].name,
         description: datas[ipaddr].description,
         cpu: datas[ipaddr].cpu.slice(indexFrom, indexTo),
         ram: datas[ipaddr].ram.slice(indexFrom, indexTo),
         timestamp: datas[ipaddr].timestamp.slice(indexFrom, indexTo),
         bit_rate_in: datas[ipaddr].bit_rate_in.slice(indexFrom, indexTo),
         bit_rate_out: datas[ipaddr].bit_rate_out.slice(indexFrom, indexTo),
         packet_rate_in: datas[ipaddr].packet_rate_in.slice(indexFrom, indexTo),
         packet_rate_out: datas[ipaddr].packet_rate_out.slice(indexFrom, indexTo),
         tcp_established: datas[ipaddr].tcp_established.slice(indexFrom, indexTo),
     }}}
     })
     return tempData
    }

function formatDate(obj) {
  const tempObj = {
    year: Number(obj.split('-')[0]),
    month: Number(obj.split('-')[1]) -1,
    day: Number(obj.split('-')[2].split(' ')[0]),
    hour: Number(obj.split(':')[0].split(' ')[1]),
    minute: Number(obj.split(' ')[1].split(':')[1]),
    second: Number(obj.split(' ')[1].split(':')[2])}
    return tempObj
}


var fromInt, toInt, fromFormat

    function onChange(dates, dateStrings) {
      //spacing
      const fromObj = formatDate(dateStrings[0])
      const toObj = formatDate(dateStrings[1])

      fromInt = new Date(fromObj.year, fromObj.month, fromObj.day, fromObj.hour, fromObj.minute, fromObj.second)
      toInt = new Date(toObj.year, toObj.month, toObj.day, toObj.hour, toObj.minute, toObj.second)


       var tempInterval, getGlobalFirst, globalFirstIndex, getGlobalLast, globalLastIndex
       globalData.map((data, i)=> {
        var objKey = Object.keys(data)[0]
         getGlobalFirst = formatDate(data[objKey].timestamp.at(0).split(".")[0].replace("T", " "))
         globalFirstIndex = new Date(getGlobalFirst.year, getGlobalFirst.month, getGlobalFirst.day, getGlobalFirst.hour, getGlobalFirst.minute, getGlobalFirst.second)

         getGlobalLast = formatDate(data[objKey].timestamp.at(-1).split(".")[0].replace("T", " "))
         globalLastIndex = new Date(getGlobalLast.year, getGlobalLast.month, getGlobalLast.day, getGlobalLast.hour, getGlobalLast.minute, getGlobalLast.second)

          })
        if(isBefore(fromInt, globalFirstIndex)){
          if(isBefore(toInt,globalLastIndex)){
            //uloz to vlastni promene
            console.log('nope')
          }
          else{
            tempInterval = {type: 'range', from:  format(fromInt, "yyyy-MM-dd kk:mm:ss"), to: format(sub(globalFirstIndex, {seconds: 1}),"yyyy-MM-dd kk:mm:ss")}

            const tempGlobi = fetcher(tempInterval, 'before', tempInterval)
            console.log(tempGlobi)
            setTempGlobalData([...tempGlobi])
            var index1 = format(fromInt, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
            var index2 = format(toInt, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
            var tempikk = setTempData(tempGlobi, index1, index2)
            var ever_NTH = every_nth(tempikk, spacing)
            console.log(tempGlobi[0]['192.168.0.101'], index1, index2)
            setTempRangeData(tempikk)
          }
        }
        //bude chcit minulost, ktera neni nactena, nebo bude chcit budoucnost, co se jeste nenacetlo
      }

React.useEffect(() =>{
 // var tempik = setTempData(getIndexFirst)
 // setTempRangeData(tempik)

}, [tempGlobalData])








  return (
    <div>
   <Space direction="vertical">
    <RangePicker ranges={{ 'This minute': [moment().startOf('minute'), moment()],
     'This Month': [moment().startOf('month'), moment().endOf('month')],  }}
      showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange} />
   </Space>
      <Range rangeData={tempRangeData ? tempRangeData : globalData}/>
    </div>
  )
}

export default DataRange