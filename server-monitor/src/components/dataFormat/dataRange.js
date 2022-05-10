import React from 'react'
import { CheckboxInt } from '../App'
import Range from '../../tempMulti/range'
import { InputNumber, Select, Space } from 'antd';
import {format, set, isBefore, isAfter, sub, add, isEqual} from 'date-fns'
import AngryJOe from '../AngryJOe'
import moment from 'moment';
import { Spin, DatePicker, TimePicker, Tabs, Button } from 'antd';
import {DataFetcher} from '../dataFetcher'
import {every_nth} from '../functions/every_nth'
import {Config} from '../../config.js'
import Axios from 'axios'
import SetTempData from '../functions/SetTempData'
import DateFormater from '../functions/dateFormater'
import GlobalFirstLast from '../functions/GlobalFirstLast'
import AddData from '../functions/AddData';



const { RangePicker } = DatePicker;

const { Option } = Select;



const DataRange = () => {

  const context = React.useContext(CheckboxInt)
  const { globalData, tempRangeData, setTempRangeData } = context
  const mutationRef = React.useRef(tempRangeData)
  const [localRange, setLocalRange] = React.useState([])
  const [returned, setReturned] = React.useState(false)
  const [spacing, setSpacing] = React.useState(1)
  const [pickedDate, setPickedDate] = React.useState(null)


function onChange(dates, dateStrings) {
  setReturned(false)
  setPickedDate(dates)
  //type jeslti chci stahnout data pred nebo po,
  //globalData, budou data rangeData,
  //tempOBJ jsou stahnute data.

  var postValues
  console.log(dateStrings, dates[0]._d)
  
  if(tempRangeData.length == 0){
    postValues = {type: 'range', from: dateStrings[0], to: dateStrings[1]}
    FetchData('first', postValues, tempRangeData, dates)
    console.log(1) 
  }
  else {
    var rangeDates = GlobalFirstLast(tempRangeData, 60)
    if(isBefore(dates[1]._d, rangeDates[0])) 
    {
      postValues = {type: 'range', from: dateStrings[0], to: dateStrings[1]}
      FetchData('first', postValues, tempRangeData, dates)
      console.log(2) 
    }
    else 
    {
      if(isBefore(dates[0]._d, rangeDates[0])){
        postValues = {type: 'range', from: dateStrings[0], to: rangeDates[3]}
        FetchData('before', postValues, tempRangeData, dates)
        console.log(3) 
      }      
    }

    if(isAfter(dates[0]._d, rangeDates[1]))
    {
      postValues = {type: 'range', from: dateStrings[0], to: dateStrings[1]}
      FetchData('first', postValues, tempRangeData, dates)
      console.log(4) 
    }
    else 
    {
      if(isAfter(dates[1]._d, rangeDates[1])){

        postValues = {type: 'range', from: format(add(rangeDates[1],{seconds: 1}), "yyyy-MM-dd kk:mm:ss") , to:dateStrings[1]}
        FetchData('after', postValues, tempRangeData, dates)
        console.log(5, dates[1]._d, rangeDates[1]) 
      }
    }
  }
  if(postValues == undefined){
    setReturned(false)
    var tempik = setTempData(tempRangeData, dates)
    setLocalRange(tempik)
  }

console.log(postValues, dateStrings, tempRangeData) 
  

}
  
function FetchData(type, postValues, tempRangeData, dateStrings) {
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
     
                 var tempGlob = AddData(type, tempRangeData, tempOBJ)
                 var tempik = setTempData(tempGlob, dateStrings)
                 if(spacing !== 1){
                  var ever_NTH = localRange ? every_nth(tempik, spacing) : tempik
                  setLocalRange(ever_NTH)
                }
                else {
                  setLocalRange(tempik)
                }

                 setTempRangeData(tempGlob)
               })
               .catch((error) => {
                console.log("Server is unavailable")
                console.log(error)
              })   
     
     }
      


function setTempData(tempGlob, dateStrings){
  console.log(dateStrings)
  var getIndexFirst, getIndexLast
  var tempData =tempGlob.map((server, i) =>{
  var ipaddr = Object.keys(server)[0] 
  var fromTime = format(dateStrings[0]._d, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
  var toTime = format(dateStrings[1]._d, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
  getIndexFirst = server[ipaddr].timestamp.indexOf(fromTime)
  getIndexLast = server[ipaddr].timestamp.indexOf(toTime) + 1
  
  console.log(getIndexFirst, getIndexLast)

  return {[ipaddr]: {
    name: server[ipaddr].name,
    description: server[ipaddr].description,
    cpu: server[ipaddr].cpu.slice(getIndexFirst, getIndexLast),
    ram: server[ipaddr].ram.slice(getIndexFirst, getIndexLast),
    timestamp: server[ipaddr].timestamp.slice(getIndexFirst, getIndexLast),
    bit_rate_in: server[ipaddr].bit_rate_in.slice(getIndexFirst, getIndexLast),
    bit_rate_out: server[ipaddr].bit_rate_out.slice(getIndexFirst, getIndexLast),
    packet_rate_in: server[ipaddr].packet_rate_in.slice(getIndexFirst, getIndexLast),
    packet_rate_out: server[ipaddr].packet_rate_out.slice(getIndexFirst, getIndexLast),
    tcp_established: server[ipaddr].tcp_established.slice(getIndexFirst, getIndexLast),
  }}
  })
    return tempData
}

function setSpace(spacing){
  setSpacing(spacing)
  setReturned(false)
  var tempik = setTempData(tempRangeData, pickedDate)
  if(spacing !== 1){
    
    setLocalRange(every_nth(tempik, spacing))
  }
  else{
    setLocalRange(tempik)
  }
}


React.useEffect(() =>{
  setReturned(true)
}, [spacing])


React.useEffect(() =>{
  setReturned(true)
},[localRange])

      return (
        <div>
          <Button onClick={()=> setSpace(1)}>Seconds</Button>
          <Button onClick={()=> setSpace(5)}>Minutes</Button>
          <Button onClick={()=> setSpace(120)}>HOures</Button>
   <Space direction="vertical">
    <RangePicker ranges={{ 'This minute': [moment().startOf('minute'), moment()],
     'This Month': [moment().startOf('month'), moment().endOf('month')],  }}
     showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange} />
   </Space>
      {returned ? <Range rangeData={localRange}/> : <p>wel wel wel</p>}
      
      
    </div>
  )
}

export default DataRange