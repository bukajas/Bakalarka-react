import React from 'react'
import { Config } from '../../config.js'
import Axios from 'axios'
import { CheckboxInt } from '../App'
import Current from '../tempMulti/current'
import { Select, Input, Form, Radio} from 'antd';
import { format, sub, isBefore } from 'date-fns'
import Button from '@mui/material/Button';
import AddData from '../functions/AddData'
import { GlobalFirstLast, SetTempData, SetPostValues, every_nth, Filterer } from '../functions/Functions';



const { Option } = Select

var secsToSub = 60

const DataCurrent = () => {


  const context = React.useContext(CheckboxInt)
  const { dates, startStop, setStartStop,  globalData, setGlobalData, tempCurrentData, setTempCurrentData } = context
  const [seconds, setSeconds] = React.useState(0)
  const [spacing, setSpacing] = React.useState(1)

  const optionsSpacing = [
    {label: '1 Secs', value: 1},
    {label: '5 Secs', value: 5},
    {label: '2 Mins', value: 120},
  ]


React.useEffect(() => {
    if(startStop){
       const waitInterval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
    return () => clearInterval(waitInterval)
    }
  })
     
  const onFinish = (values) => {
    if(values.number.timeValue === 's'){ secsToSub = values.number.number }
    if(values.number.timeValue === 'm'){  secsToSub = values.number.number * 60 }
    if(values.number.timeValue === 'h'){  secsToSub = values.number.number * 3600 }
    var tempInterval
    var globalDates = GlobalFirstLast(globalData, secsToSub) 
    let interval = sub(globalDates[1], {seconds: secsToSub}) 
    if(isBefore(interval, globalDates[0])){         
      tempInterval = SetPostValues('before', globalDates)
      FetchData('before', tempInterval, globalDates)
    } else {
      var tempik = SetTempData(globalData, globalDates)
      if(spacing !== 1){
        var ever_NTH = tempCurrentData ? every_nth(tempik, spacing) : tempik
        setTempCurrentData(ever_NTH)
      } 
      else{setTempCurrentData(tempik)}}}
  
React.useEffect(() =>{
  if(startStop){
    var dattes = GlobalFirstLast(globalData, secsToSub)
    FetchData('update', {type: "update", last: format(dattes[1], "yyyy-MM-dd kk:mm:ss")}, dattes)
  }}, [seconds])


function FetchData(type, postValues, globalDates){
  var tempOBJ = []
  Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
        .then((response) => {
          if (!response.data.error) 
          {
            var newData = Filterer(dates, response.data.data)

            newData.forEach((datas, i) => {
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
              })} 
            else {console.log(response.data.message)}

            var tempGlob = AddData(type, globalData, tempOBJ)
            var tempik = SetTempData(tempGlob, globalDates)
            if(spacing !== 1){
              var ever_NTH = tempCurrentData ? every_nth(tempik, spacing) : tempik
              setTempCurrentData(ever_NTH)
            } else{ setTempCurrentData(tempik) }
            setGlobalData(tempGlob)
          })
          .catch((error) => {
            console.log("Server is unavailable")
            console.log(error)
          })       
}




const checkNumber = (_, value) => {
  if (value.number > 0) { return Promise.resolve()}
  return Promise.reject(new Error('Number must be greater than zero!'))}

  function onChangeSpacing(e){
   setSpace(e.target.value) }

  function setSpace(spacing){
    setSpacing(spacing)
    var tempik = SetTempData(globalData, GlobalFirstLast(globalData, secsToSub), secsToSub)
    if(spacing !== 1){ 
      setTempCurrentData(every_nth(tempik, spacing))
    } else{ setTempCurrentData(tempik)}}




  return (
    <div>
      <div>
      <div className="dashboard-topInfo-btn">
        {startStop ? 
        <Button onClick={() => setStartStop(prevState => !prevState)} color="error" variant="contained" >STOP</Button>
        : 
        <Button onClick={() => setStartStop(prevState => !prevState)} variant="contained" >START</Button>
        }
      </div>
    <div>
        <div className="current-pick">
      <Form
        name="customized_form_controls"
        layout="inline"
        onFinish={onFinish}
        initialValues={{
          number: { number: 1, timeValue: 's' }}}
      >
      <Form.Item
        name="number"
        label="Interval"
        rules={[{ validator: checkNumber }]}
      >
        <ValueInput />

      </Form.Item>
      <Form.Item>
        <Button type="default" htmlType="submit"> Update </Button>
      </Form.Item>
    </Form>
        </div> 
        <div className="current-pick">Current setting:  {secsToSub} seconds</div>
        <div className="current-spacing">          
        <div className="current-spacing-name">Spacing:  </div>
          <Radio.Group
          options={optionsSpacing}
          onChange={onChangeSpacing}
          value={spacing}
          optionType="button"
          buttonStyle="solid"
          size="large"
        />  
        </div>
    
    </div>
      </div>
      <div className="informative">(for zoom and drag press "CTRL" key)</div>
      <Current tempData={tempCurrentData.length > 0 ? tempCurrentData : globalData}/>
    </div>
  )
}


const ValueInput = ({ value = {}, onChange }) => {
  const [number, setNumber] = React.useState(1)
  const [timeValue, setTimeValue] = React.useState('s')
  const triggerChange = (changedValue) => {
    onChange?.({
      number,
      timeValue,
      ...value,
      ...changedValue,
    })
  }
  const onNumberChange = (e) => {
    const newNumber = parseInt(e.target.value || '0', 10)
    if (Number.isNaN(number)) {  return   }
    if (!('number' in value)) {      setNumber(newNumber)    }

    triggerChange({ number: newNumber,  })}

  const onTimeValueChange = (newTimeValue) => {
    if (!('timeValue' in value)) {
      setTimeValue(newTimeValue)
    }
    triggerChange({
      timeValue: newTimeValue,
    })}
    
  return (
    <span>
      <Input
        type="text"
        value={value.number || number}
        onChange={onNumberChange}
        style={{
          width: 100,
        }}/>
      <Select
        value={value.timeValue || timeValue}
        style={{
          width: 80,
          margin: '0 8px',
        }}
        onChange={onTimeValueChange}
      >
        <Option value="s">Sec</Option>
        <Option value="m">Min</Option>
        <Option value="h">Hour</Option>
      </Select>
    </span>
  )
}



export default DataCurrent










