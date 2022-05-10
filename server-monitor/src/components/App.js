import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import "antd/dist/antd.css";
import "../index.css";
import Template from "./Template.js"
import {format} from 'date-fns'
export { CheckboxInt }

const CheckboxInt =  createContext()





const Hlavni = ({ children }) => {


  const [globalData, setGlobalData] = React.useState([])
  const [fetchedData, setFetchedData] = React.useState('')
  const mutationRef = React.useRef(globalData)

    var time = new Date()
    var newTime = new Date(time.getTime() - 60 * 1000)
    var tempObj =
    {
      from: format(newTime, 'yyyy-MM-dd kk:mm:ss'),
     to: format(time, 'yyyy-MM-dd kk:mm:ss')
    }

    const [timeInterval, setTimeInterval] = React.useState(tempObj) // casovy usek ktery se posle pro stazeni

    const [dates, setDates] = React.useState([
    { name: 'Device 1',
      ip: '192.168.0.101',
      description: 'well Hello there',
      status: 'CRITICAL'

  }, { name: 'Device 2',
      ip: '192.168.0.102',
      description: 'How are you',
      status: 'CRITICAL'
  }, { name: 'Device 4',
    ip: '192.168.0.104',
    description: 'What the hell',
    status: 'CRITICAL'
  }, {
      name: 'Device 3',
      ip: '192.168.0.103',
      description: 'ubuntu',
      status: 'CRITICAL'
    }])  // seznam vybranych serveru
  const [graphOptions, setGraphOptions] = React.useState([])
  const [graphData, setGraphData] = React.useState([])
  const [tempData, setTempData] = React.useState(null) //curent data
  const [rangeData, setRangeData] = React.useState('') //range data
  const [timeLine, setTimeLine] = React.useState('')
  const [oData, setoData] = React.useState('')
  const valuesList = ['cpu_ram','bit_rate_in','bit_rate_out','packet_rate_in','packet_rate_out','tcp_established']
  const [valuesPost, setValuesPost] = React.useState('range')
  const [rangeValue, setRangeValue] = React.useState({
    from: "2021-02-01 01:00:00",
    to: "2021-02-01 01:01:00"
  })
  const [startStop, setStartStop] = React.useState(false)
  const [ipAdd, setIpAdd] = React.useState([])
  const [clickedServers, setClickedServers] = React.useState([])
  const [tempCurrentData, setTempCurrentData] = React.useState([])
  const mutationRefCurrent = React.useRef(tempCurrentData)
  const [tempRangeData, setTempRangeData] = React.useState([])
  const mutationRefRange = React.useRef(tempRangeData)




  return ( <CheckboxInt.Provider value={{
        oData, setoData,
        startStop, setStartStop,
        ipAdd, setIpAdd,
        clickedServers, setClickedServers,
        valuesPost, setValuesPost,
        rangeValue, setRangeValue,
        rangeData, setRangeData,
        dates, setDates,
        valuesList,
        tempData, setTempData,
        timeLine, setTimeLine,
        graphOptions, setGraphOptions,
        graphData, setGraphData,
        timeInterval, setTimeInterval,
        globalData, setGlobalData,
        mutationRef, mutationRefRange, mutationRefCurrent,
        fetchedData, setFetchedData,
        tempCurrentData, setTempCurrentData,
        tempRangeData, setTempRangeData
         }}>
      {children}
      </CheckboxInt.Provider>)
}



function Druhy({ children }) {
  const context = React.useContext(CheckboxInt)
  const { dates,startStop, timeInterval,
    globalData, setGlobalData, mutationRefRange,
    mutationRefCurrent, tempRangeData, tempCurrentData, mutationRef
  } = context
  const [seconds, setSeconds] = React.useState(0)
  


  React.useEffect(() => {
      getDataFromServer( //stazeni prvnich dat
      {
       type: "range",
       from: timeInterval.from,
       to: timeInterval.to
      }
       , 'first')
    }, [])
  
  React.useEffect(() =>
    {
      const interval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
      return () => clearInterval(interval)
    }, [])
  
  React.useEffect(() =>
    {
      if(startStop){serverStatus()}
    }, [seconds])



    
  function serverStatus() {
    var tempIp = dates.map((data) => {return data.ip })
    var golb
  //  pokud v dates mam ip, a od ni bude chodit data, tak bude true jinak false
      dates.map((data, i) => {
        var tempIPs = data.ip
        golb = globalData.map((globData, i) => {
          var stat = 0
          var ipaddr = Object.keys(globData)[0]
          if(tempIp.includes(ipaddr)){
            for(var i = 1; i < 6; i++){
              if(globData[ipaddr].cpu.at(0 - i) == null){
                stat = stat + 1
                console.log('hovno123')
            } else{
              if(stat >= 2 && stat <5){ return {[ipaddr]: 2} }
              stat = 0
              return {[ipaddr]: stat}
            }
            } 
            if(stat >= 5){ return {[ipaddr]: stat} } 
            if(stat >= 2){  return {[ipaddr]: stat} }
          }
        })
      })
      var status = Array(tempIp.length).fill(0)
      golb.map((datas,i) => {
        var ip = Object.keys(datas)[0]
        if(tempIp.includes(ip)){
          status[tempIp.indexOf(ip)] = datas[ip]
          if(status[tempIp.indexOf(ip)] == 0){ dates[tempIp.indexOf(ip)].status = 'OK' }
          if(status[tempIp.indexOf(ip)] == 2){ dates[tempIp.indexOf(ip)].status = 'WARNING' }
          if(status[tempIp.indexOf(ip)] == 5){ dates[tempIp.indexOf(ip)].status = 'CRITICAL' }
        }
      })
      }





// na zacatku a pak priapdne pri zmacknuti upate tlacitka.







  function getDataFromServer(postValuess, type){
    var postValues
        if(type == 'first'){
          postValues = postValuess
        }
    var tempOBJ = []
    var fetchedIps = []

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
            setGlobalData(tempOBJ)
        }
        else {
          console.log(response.data.message)
        }
      })
      .catch((error) => {
        console.log("Server is unavailable")
        console.log(error)
      })
    }




React.useEffect(() =>{
  mutationRef.current = globalData
}, [globalData])

React.useEffect(() =>{
  mutationRefCurrent.current = tempCurrentData
}, [tempCurrentData])

React.useEffect(() =>{
  mutationRefRange.current = tempRangeData
}, [tempRangeData])



    // else if(valuesPost == 'times') {
    //   postValues = {type: "times", times: ["2021-02-01 01:00:00", "2021-02-01 01:00:02", "2021-02-01 03:03:00", "2021-02-01 01:55:55"]}
    // }


  return (

    <div>
      {children}
    </div>
  )
}





const App = () => {


  return(
    <div>
    <Hlavni>
      <Druhy>
        <Template/>
      </Druhy>
    </Hlavni>
    </div>
  )
}


export default App
