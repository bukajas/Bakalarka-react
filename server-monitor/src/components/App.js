import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import "antd/dist/antd.css";
import "../index.css";
import { Layout, Menu, Breadcrumb, Spin, Button, Space  } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Template from "./Template.js"
import {format, set} from 'date-fns'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import DataCurrent from './dataFormat/dataCurrent.js'
export { CheckboxInt }


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 2 }} spin />;
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
  const { oData, setoData, dates, setDates,
    startStop,
    valuesPost, setValuesPost,
    rangeValue, setRangeValue,
    rangeData, setRangeData,
    tempData, setTempData, timeLine, setTimeLine,timeInterval,
     globalData, setGlobalData, fetchedData, setFetchedData,
       mutationRefRange, mutationRefCurrent, tempRangeData, tempCurrentData,
       setTempRangeData,
    mutationRef
   } = context


   function timeStamps() {
     var timeArray = [];
     for (var i = 60; i  > -1; i--) {
       var secsToSub = i;
       var time = new Date()
      var newTime = new Date(time.getTime() - secsToSub * 1000)
      format(newTime, 'yyyy-MM-dd kk:mm:ss')
      timeArray.push(format(newTime, 'yyyy-MM-dd kk:mm:ss'));
      }
      setTimeLine(timeArray)
  }

  function serverStatus(responseData, ver) {
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


  const [seconds, setSeconds] = React.useState(0)
  React.useEffect(() =>
  {
    const interval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
    return () => clearInterval(interval)
  }, [])



// na zacatku a pak priapdne pri zmacknuti upate tlacitka.
  React.useEffect(() => {
    timeStamps()
    getDataFromServer( //stazeni prvnich dat
    {
     type: "range",
     from: timeInterval.from,
     to: timeInterval.to
    }
     , 'first')
  }, [])


//consolepri prubehu pokud je zapnuty startstop tlacitko
  React.useEffect(() =>
  {
    if(startStop){serverStatus()}
  }, [seconds])


//REPLACE NULL DATA





  function getDataFromServer(postValuess, type){
    var postValues
    var timeLast
    var timeFirst


        if(globalData.length > 0){
          var ipadr = Object.keys(globalData[0])[0]
          timeLast = globalData[0][ipadr].timestamp.at(-1).split(".")[0].replace("T", " ")
          timeFirst = globalData[0][ipadr].timestamp.at(1).split(".")[0].replace("T", " ")
     //     console.log(timeLast, timeFirst)
        }




        if(type == 'first'){
          postValues = postValuess
        }
        if(type == 'before'){ // = range
        var tempTimeBefore = timeFirst.split(".")[0].replace("T", " ")
    //le.log(timeFirst > timeInterval.from)
        if(timeFirst > timeInterval.from){
          postValues = {type: "range",  from: timeInterval.from, to: timeInterval.to}
    //      console.log('timeFirst, timeInterval.from')
        }
        else{
          return
        }
        }
        if(type == 'update'){
        var tempTime = timeLast.split(".")[0].replace("T", " ")
        postValues = {type: "update", last: tempTime}
         }



    var tempGlobal = [...globalData]  //saved data
    var tempOBJ = []
    let tempServer
    var globalIps  = []
    var fetchedIps = []
    tempGlobal.map((data) => { var globalKey = Object.keys(data)[0]; globalIps.push(globalKey) })

//console.log(postValuess, postValues, type)

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
     //             console.log('blablalblkajsdlfkjsakldjlk')
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
              if(globalLength > 1000) {
                var diference = globalLength - 1000
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
                }
                else{
                  tempServer = {...datas}
                  tempGlobal[tempGlobal.length] = tempServer
                }
              }

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
    //        console.log(tempGlobal)
            setGlobalData(tempGlobal)
  //          console.log(globalData,1222)
        }
        else {
          console.log(response.data.message)
        }
      })
      .catch((error) => {
        console.log("Server is unavailable")
        console.log(error)
      })
      return tempOBJ
    }

React.useEffect(() =>{
  mutationRef.current = globalData
  //console.log(mutationRef.current,1231)
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
