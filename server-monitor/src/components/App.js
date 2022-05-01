import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import "antd/dist/antd.css";
import "../index.css";
import DataFetcher from "./DataFetcher.js";
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
export { CheckboxInt }


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 2 }} spin />;
const CheckboxInt =  createContext()





const Hlavni = ({ children }) => {

  const [globalData, setGlobalData] = React.useState('')
  const [fetchedData, setFetchedData] = React.useState('')
  const mutationRef = React.useRef(fetchedData)

    var time = new Date()
    var newTime = new Date(time.getTime() - 60 * 1000)
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
        console.log(tempDates) 
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
    getoDataStart()
   // getDataFromServer({type: "range", from: timeInterval.from, to: timeInterval.to})
  }, [])

  React.useEffect(() => {
    timeStamps()
    getoDataStart()
  }, [timeInterval])

React.useEffect(() => {
 if(tempData){serverStatus(tempData, 1)} 
}, [tempData])

// pri prubehu pokud je zapnuty startstop tlacitko
  React.useEffect(() => 
  {
    if(startStop){
      timeStamps()
      getDataUpdate()
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
     
  
  function getDataFromServer(postValues){
    var tempOBJ = []
    Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
    .then((response) => {
      if (!response.data.error) 
      {
        var tempServer 
        var newServer
        response.data.data.map((datas, i) => {
            tempServer = {...datas}
            newServer = {[datas.info.ip]: {
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
            tempOBJ[i] = newServer
          })
          setFetchedData([...tempOBJ])
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

function getDataByUpdate(tempData,tempOBJ1){
  
   //ziskana data z serveru, napr jedna vterina
  // var numberOfServers = tempOBJ1.length  // pocet servery od kterych chodi data
  // var numberOfLoaded = tempData.length  //pocet serveru ktere byly ulozene
  // var numberOfWanted  //pocet kolik serveru bych mel mit ulozenych.
  // if(numberOfServers > numberOfLoaded){numberOfWanted = numberOfServers}
  // if(numberOfServers < numberOfLoaded){numberOfWanted = numberOfLoaded }
  console.log(tempOBJ1)
  var listOfServers = tempData.map((datas3) => {return Object.keys(datas3)})
  tempData.map((datas, i) => {
    tempOBJ1.map((datas2, i) => {
      var ipaddr = Object.keys(datas)
      var tempDataLen = datas[ipaddr].timestamp.length //delka dat
      var arrayLength = tempOBJ1[i][ipaddr].timestamp.length  //delka ziskanych dat

      console.log(Object.keys(datas2))
      if(ipaddr == Object.keys(datas2) && tempOBJ1[i])
      {
        datas[ipaddr].cpu = [...datas[ipaddr].cpu, ...tempOBJ1[i][ipaddr].cpu]
        datas[ipaddr].cpu = datas[ipaddr].cpu.slice(arrayLength)
        datas[ipaddr].ram = [...datas[ipaddr].ram, ...tempOBJ1[i][ipaddr].ram]
        datas[ipaddr].ram = datas[ipaddr].ram.slice(arrayLength)
        datas[ipaddr].timestamp = [...datas[ipaddr].timestamp, ...tempOBJ1[i][ipaddr].timestamp]
        datas[ipaddr].timestamp = datas[ipaddr].timestamp.slice(arrayLength)
        datas[ipaddr].bit_rate_in = [...datas[ipaddr].bit_rate_in, ...tempOBJ1[i][ipaddr].bit_rate_in]
        datas[ipaddr].bit_rate_in = datas[ipaddr].bit_rate_in.slice(arrayLength)
        datas[ipaddr].bit_rate_out = [...datas[ipaddr].bit_rate_out, ...tempOBJ1[i][ipaddr].bit_rate_out]
        datas[ipaddr].bit_rate_out = datas[ipaddr].bit_rate_out.slice(arrayLength)
        datas[ipaddr].packet_rate_in = [...datas[ipaddr].packet_rate_in, ...tempOBJ1[i][ipaddr].packet_rate_in]
        datas[ipaddr].packet_rate_in = datas[ipaddr].packet_rate_in.slice(arrayLength)
        datas[ipaddr].packet_rate_out = [...datas[ipaddr].packet_rate_out, ...tempOBJ1[i][ipaddr].packet_rate_out]
        datas[ipaddr].packet_rate_out = datas[ipaddr].packet_rate_out.slice(arrayLength)
        datas[ipaddr].tcp_established = [...datas[ipaddr].tcp_established, ...tempOBJ1[i][ipaddr].tcp_established]
        datas[ipaddr].tcp_established = datas[ipaddr].tcp_established.slice(arrayLength)
      }
      if(ipaddr !== Object.keys(datas2) && !arrayLength.includes(Object.keys(datas2))){
        console.log('heeee')
      }
    })


  })
}
    
React.useEffect(() =>{
  mutationRef.current = fetchedData
}, [fetchedData])



  //console.log(format(new Date(), "yyyy-MM-dd hh:mm:ss "))
  // funkce pro získání naměřených dat ze serveru
  function getoDataStart () {
    let postValues = {type: "range", from: timeInterval.from, to: timeInterval.to}
      setGlobalData([...fetchedData])
      setTempData([...fetchedData])
      }



/////////////////////////////////////////////////////////////////
// when startstop button is pushed
function getDataUpdate () {
  var tempOBJ1
      var ipadr = Object.keys(tempData[0])
      var tempTime = tempData[0][ipadr].timestamp[tempData[0][ipadr].timestamp.length - 1].split(".")[0].replace("T", " ")


      let postValues  = {type: "update", last: tempTime}
      tempOBJ1 = getDataFromServer(postValues)
      console.log(getDataFromServer(postValues))
      console.log(tempOBJ1)
      getDataByUpdate(tempData,tempOBJ1)


}

/////////////////////////////////////////////////////////////////
// pro range values

  function getoData () {

    let postValues
    // if(valuesPost == 'all'){
    //   postValues = {type: "all"}
    // }
    // if(valuesPost == 'update_temp'){
    //   postValues = {type: "update_temp"}
    // }
    if(valuesPost == 'range'){
      postValues = {type: "range", from: rangeValue.from, to: rangeValue.to}
      
    }
    else if(valuesPost == 'times') {
      postValues = {type: "times", times: ["2021-02-01 01:00:00", "2021-02-01 01:00:02", "2021-02-01 03:03:00", "2021-02-01 01:55:55"]}
    }
    else if(valuesPost == 'update') {
    
      var tim = new Date()
      var newTime = new Date(tim.getTime() - 1 * 1000)
      console.log(format(newTime, 'yyyy-MM-dd kk:mm:ss'))
      let time = format(newTime, 'yyyy-MM-dd kk:mm:ss')
      postValues = {type: "update", last: time}
    }
    console.log(valuesPost)
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
