import React from 'react'
import { CheckboxInt } from '../App'
import Current from '../../tempMulti/current'
import { InputNumber, Select, Space } from 'antd';
import {format, set} from 'date-fns'
import AngryJOe from '../AngryJOe'

const { Option } = Select;

const DataCurrent = () => {

    const context = React.useContext(CheckboxInt)
    const { startStop, timeInterval, setTimeInterval, globalData } = context
    const [tempCurrentData, setTempCurrentData] = React.useState([])
    const mutationRef = React.useRef(tempCurrentData)
    const [secsToSub, setSecsToSub] = React.useState(60)
    const [seconds, setSeconds] = React.useState(0)


    React.useEffect(() =>
    {
      const interval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
      return () => clearInterval(interval)
    }, [])


    const selectAfter = (
      <Select defaultValue="Sec" style={{ width: 60 }}>
          <Option value="Sec">Sec</Option>
          <Option value="Min">Min</Option>
          <Option value="Hour">Hour</Option>

        </Select>
      )




//console.log(secsToSub)  
var newTime, toTime
var time
var getIndexFirst
    function changeInterval(secsSub) {

        var tempSecsSub = secsSub
        time = new Date()
        toTime = new Date(time.getTime() - 1 * 1000)
        var fromTime
        globalData.map((data, i) =>{
            var objKey = Object.keys(data)
            fromTime = data[objKey].timestamp.at(-secsSub)
          })
        newTime = new Date(time.getTime() - secsSub * 1000)
        var tempObj = {from: format(newTime, "yyyy-MM-dd kk:mm:ss"), to: format(time, "yyyy-MM-dd kk:mm:ss")
      }
          setTimeInterval(tempObj)
        }


React.useEffect(() =>{
  if(startStop){
    changeInterval(secsToSub)
    console.log(timeInterval)
    globalData.map((data, i) =>{
      var fromFormat = format(newTime, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var toFormat = format(toTime, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var ipadr = Object.keys(data)[0]
      console.log(fromFormat, toFormat)

      getIndexFirst = data[ipadr].timestamp.indexOf(fromFormat)
      var getIndexLast = data[ipadr].timestamp.indexOf(toFormat)

      console.log(toFormat, getIndexLast, data[ipadr].timestamp )
    })
  getIndexFirst ? setTempCurrentData(globalData.map((datas, i)=> {
    var ipaddr =Object.keys(datas)[0] 
    console.log(datas[ipaddr].timestamp.slice(43), getIndexFirst)
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
  }
}, [seconds])


React.useEffect(() =>{
  mutationRef.current = tempCurrentData
}, [tempCurrentData])


//if neni tak pak spustit tu funkci znova





  return (
    <div>
   <Space direction="vertical">
    <InputNumber min={0} max={3600} addonAfter={selectAfter} defaultValue={60} onPressEnter={(e) => setSecsToSub(parseInt(e.target.defaultValue))}/>
   </Space>

        <Current tempData={tempCurrentData}/>
    </div>
  )
}

export default DataCurrent