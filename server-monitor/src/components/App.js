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


  const [globalData, setGlobalData] = React.useState([
  ])
  const [fetchedData, setFetchedData] = React.useState('')
  const mutationRef = React.useRef(fetchedData)

    var time = new Date()
    var newTime = new Date(time.getTime() - 10 * 1000)
    var tempObj = {from: format(newTime, 'yyyy-MM-dd kk:mm:ss'), to: format(time, 'yyyy-MM-dd kk:mm:ss')}

    const [timeInterval, setTimeInterval] = React.useState(tempObj)
  const [dates, setDates] = React.useState([ 
    { name: 'Device 1',
      ip: '192.168.0.101',
      description: 'debian',
      status: false
  },  { name: 'Device 2',
      ip: '192.168.0.102',
      description: 'debian',
      status: false
  }, { 
      name: 'Device 3',
      ip: '192.168.0.103',
      description: 'ubuntu',
      status: false}])  // seznam vybranych serveru
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
        mutationRef,
        fetchedData, setFetchedData
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
    tempData, setTempData, timeLine, setTimeLine,timeInterval, globalData, setGlobalData, fetchedData, setFetchedData,
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
  //  pokud v dates mam ip, a od ni bude chodit data, tak bude true jinak false
    var tempDates = []
    dates.map((date, index) => {
      var liver = false 
      var tempDate = [...dates]
      let tempServer = {...date}

      responseData ? responseData.map((data, i) => {
      if(ver == 1){var ipaddr  = Object.keys(data)}
      if(ver == 2) {var ipaddr  = data.info.ip}
         if(ipaddr == date.ip)
        {
           liver = true
           tempServer.status = true
           tempDate[index] = tempServer
           if(!tempDates[index]) {  tempDates[index] = tempDate[index]  }
        }
           else if (!liver && ipaddr !== date.ip && i == tempData.length -1 ){
            tempServer.status = false
            tempDate[index] = tempServer
              if(!tempDates[index]) {  tempDates[index] = tempDate[index]  }
             }
          }) : console.log('oj')
        }) 
    setDates(tempDates)
        
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
    getDataFromServer({type: "range", from: timeInterval.from, to: timeInterval.to}, 'first')
  }, [])

  React.useEffect(() => {
    timeStamps()
    if(globalData.length >=1){
      getDataFromServer({type: 'range', from: timeInterval.from, to: timeInterval.to}, 'before')
    }
  }, [timeInterval])

React.useEffect(() => {
 if(tempData){serverStatus(tempData, 1)} 
}, [tempData])

// pri prubehu pokud je zapnuty startstop tlacitko
  React.useEffect(() => 
  {
    if(startStop){
      timeStamps()
      getDataFromServer({type: "update"}, 'update')
    }
  }, [seconds])

  React.useEffect(() => 
  {
    if(tempData){serverStatus(tempData, 1)} 
  }, [dates.length])

//pokud se zmeni typ zobrazeni  
  React.useEffect(() => 
  {
    timeStamps()
    getoData()
    if(tempData){serverStatus(tempData, 1)  }
  }, [valuesPost, rangeValue]) 
     

//REPLACE NULL DATA





  function getDataFromServer(postValuess, type){
    var postValues
    var timeLast
    var timeFirst
    // if(globalData.length > 1){
    //   globalData.map((data, key) =>{
    //     var ipadr1 = Object.keys(data)[0]
    //     var timeLast1 = globalData[key][ipadr1].timestamp.at(-1)
        
    //     var timeFirst1 = globalData[key][ipadr1].timestamp.at(1)
    //     if((key + 1) <= globalData.length - 1){
    //       var ipadr2 = Object.keys(globalData[key+1])[0]
    //       var timeLast2 = globalData[key+1][ipadr2].timestamp.at(-1)
    //       var timeFirst2 = globalData[key+1][ipadr2].timestamp.at(1)
    //     }
    //     console.log(timeFirst1, timeLast1)

    //     // if(timeLast1 == timeLast2 || !timeLast2){
    //     //   timeLast = timeLast1
    //     //   } if(timeLast1 > timeLast2){
    //     //     timeLast = timeLast1
    //     //   } if(timeLast2 > timeLast1){
    //     //     timeLast = timeLast2
    //     //   }
    //     //   if(timeFirst1 == timeFirst2 || !timeFirst2){
    //     //     timeFirst = timeFirst1
    //     //   } if(timeFirst1 > timeFirst2){
    //     //     timeFirst = timeFirst1
    //     //   } if(timeFirst1 < timeFirst2){
    //     //     timeFirst = timeFirst2
    //     //   }
    //     })
    //   }

        if(globalData.length > 0){
          var ipadr = Object.keys(globalData[0])[0]
          timeLast = globalData[0][ipadr].timestamp.at(-1).split(".")[0].replace("T", " ")
          timeFirst = globalData[0][ipadr].timestamp.at(1).split(".")[0].replace("T", " ")
     //     console.log(timeLast, timeFirst)
        }
// start = range from now to last minute (default)
// update = from now to last value1
// range =
//times



        if(type == 'first'){
          postValues = postValuess
        }
        if(type == 'update'){
        var tempTime = timeLast.split(".")[0].replace("T", " ")
        postValues = {type: "update", last: tempTime}
         }
        if(type == 'before'){ // = range
        var tempTimeBefore = timeFirst.split(".")[0].replace("T", " ")
        if(timeFirst > timeInterval.from){
          postValues = {type: "range",  from: timeInterval.from, to: tempTimeBefore}
        }
        }



      // if(type == 'before' && timeFirst == true){
      
      // console.log(timeInterval, type, timeFirst)
      // if(timeFirst < timeInterval.from){
      // postValues = {type: "update", last: tempTime}
      // }
      // }
      


    var tempGlobal = [...globalData]  //saved data
    var tempOBJ = []
    let tempServer
    var globalIps  = []
    var fetchedIps = []
    tempGlobal.map((data) => { var globalKey = Object.keys(data)[0]; globalIps.push(globalKey) })

 //   console.log(postValues)
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

 //  console.log(newServer)

          })
            tempOBJ.map((datas, i) => {  //fetched data
              var OBJIp = Object.keys(datas)[0] // ipadresa objektu
              if(globalIps.includes(OBJIp))
              {
                var globalLength = tempGlobal[i][OBJIp].timestamp.length
                var globalIndex = globalIps.indexOf(OBJIp)
                tempServer = {...tempGlobal[globalIndex]}



                //replace data from server to avoid duplacates, and to replace the nulls
                var firstTimeStamp = datas[OBJIp].timestamp.at(0)
                if(tempServer[OBJIp].timestamp.includes(firstTimeStamp)){
                  console.log('blablalblkajsdlfkjsakldjlk')
                  var indexOfFirstTimeStamp = tempServer[OBJIp].timestamp.indexOf(firstTimeStamp)
                 // console.log(firstTimeStamp, indexOfFirstTimeStamp, tempServer[OBJIp].timestamp)
                 // tempServer[OBJIp].cpu.slice(indexOfFirstTimeStamp, datas[OBJIp].timestamp.length -1, ...datas[OBJIp].cpu)
                }
                



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
            setGlobalData(tempGlobal)
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
  mutationRef.current = fetchedData
}, [fetchedData])



  //console.log(format(new Date(), "yyyy-MM-dd hh:mm:ss "))
  // funkce pro získání naměřených dat ze serveru
/////////////////////////////////////////////////////////////////
// pro range values

  function getoData () {

    let postValues
    if(valuesPost == 'range'){
      postValues = {type: "range", from: rangeValue.from, to: rangeValue.to}
    }
    else if(valuesPost == 'times') {
      postValues = {type: "times", times: ["2021-02-01 01:00:00", "2021-02-01 01:00:02", "2021-02-01 03:03:00", "2021-02-01 01:55:55"]}
    }
    else if(valuesPost == 'update') {
    
      var tim = new Date()
      var newTime = new Date(tim.getTime() - 1 * 1000)
  //    console.log(format(newTime, 'yyyy-MM-dd kk:mm:ss'))
      let time = format(newTime, 'yyyy-MM-dd kk:mm:ss')
      postValues = {type: "update", last: time}
    }
 //   console.log(valuesPost)
      Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
      .then((response) => 
        {
          if (!response.data.error && valuesPost == 'range') {
          setRangeData(response.data.data.map((datas)=> {
            {return {[datas.info.ip]: {
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
             }}}
             }))
        }
        if (!response.data.error && valuesPost == 'update') {
        }
        else  {
        console.log("else error")
        }}
        )
      .catch((error) =>{
        console.log("Server is unavailable")
        console.log(error)
        setoData(0)
      })}

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
