import React from 'react'
import { CheckboxInt } from '../App'
import Range from '../tempMulti/range'
import { Space } from 'antd';
import {format, isBefore, isAfter, add} from 'date-fns'
import AngryJOe from '../AngryJOe'
import moment from 'moment';
import { DatePicker, Radio } from 'antd';
import {Config} from '../../config.js'
import Axios from 'axios'
import AddData from '../functions/AddData';
import {GlobalFirstLast, every_nth, SetTempDataRange, Filterer} from '../functions/Functions'
import { LoadingOutlined } from '@ant-design/icons'


const { RangePicker } = DatePicker;


const DataRange = () => {

  const context = React.useContext(CheckboxInt)
  const { dates, tempRangeData, setTempRangeData } = context
  const [localRange, setLocalRange] = React.useState([])
  const [returned, setReturned] = React.useState(false)
  const [spacing, setSpacing] = React.useState(1)
  const [pickedDate, setPickedDate] = React.useState(null)


function onChange(dates, dateStrings) {
  setReturned(false)
  setPickedDate(dates)
  var postValues
  

  if(tempRangeData.length === 0){
    postValues = {type: 'range', from: dateStrings[0], to: dateStrings[1]}
    FetchData('first', postValues, tempRangeData, dates) 
  }
  else {
    var rangeDates = GlobalFirstLast(tempRangeData, 60)
    if(isBefore(dates[1]._d, rangeDates[0])) 
    {
      postValues = {type: 'range', from: dateStrings[0], to: dateStrings[1]}
      FetchData('first', postValues, tempRangeData, dates)
    }
    else 
    {
      if(isBefore(dates[0]._d, rangeDates[0])){
        postValues = {type: 'range', from: dateStrings[0], to: rangeDates[3]}
        FetchData('before', postValues, tempRangeData, dates)
      }      
    }
    if(isAfter(dates[0]._d, rangeDates[1]))
    {
      postValues = {type: 'range', from: dateStrings[0], to: dateStrings[1]}
      FetchData('first', postValues, tempRangeData, dates)
    }
    else 
    {
      if(isAfter(dates[1]._d, rangeDates[1])){

        postValues = {type: 'range', from: format(add(rangeDates[1],{seconds: 1}), "yyyy-MM-dd kk:mm:ss") , to:dateStrings[1]}
        FetchData('after', postValues, tempRangeData, dates)
      }
    }
  }
  if(postValues === undefined){
    setReturned(false)
    var tempik = SetTempDataRange(tempRangeData, dates)
    setLocalRange(tempik)
  }
 

}
  
function FetchData(type, postValues, tempRangeData, dateStrings) {
       setReturned(false)
       var tempOBJ = []
       Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
             .then((response) => {
               if (!response.data.error) 
               {

                var newData = Filterer(dates, response.data.data)
                newData.map((datas, i) => {
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
                 var tempik = SetTempDataRange(tempGlob, dateStrings)
                 if(spacing !== 1){
                  var ever_NTH = localRange ? every_nth(tempik, spacing) : tempik
                  setLocalRange(ever_NTH)
                  }
                  else { setLocalRange(tempik) }

                  setTempRangeData(tempGlob)
               })
               .catch((error) => {
                console.log("Server is unavailable")
                console.log(error)
              })}
      

function setSpace(spacing){
  setSpacing(spacing)
  setReturned(false)
  var tempik = SetTempDataRange(tempRangeData, pickedDate)
  if(spacing !== 1){
    setLocalRange(every_nth(tempik, spacing))
  } else{
    setLocalRange(tempik)
  }}

React.useEffect(() =>{
  setReturned(true)
}, [spacing])

React.useEffect(() =>{
  setReturned(true)
},[localRange])


function onChangeSpacing(e){
  setSpace(e.target.value)
}
const optionsSpacing = [
  {label: '1 Secs', value: 1},
  {label: '5 Secs', value: 5},
  {label: '2 Mins', value: 120},
]

      return (
        <div>
          <Radio.Group
           options={optionsSpacing}
          onChange={onChangeSpacing}
          value={spacing}
          optionType="button"
          buttonStyle="solid"
        />
          <Space direction="vertical">
            <RangePicker ranges={{ 'This minute': [moment().startOf('minute'), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],  }}
              showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange} />
          </Space>
          <p>(for zoom and drag press "CTRL" key)</p>
          {returned ? <Range rangeData={localRange}/> : <LoadingOutlined />}
        </div>
  )
}

export default DataRange