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
export { CheckboxInt }


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 2 }} spin />;
const CheckboxInt =  createContext()





const Hlavni = ({ children }) => {

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
  const [tempData, setTempData] = React.useState('') //curent data
  const [rangeData, setRangeData] = React.useState('') //range data
  const [timeLine, setTimeLine] = React.useState('')
  const [oData, setoData] = React.useState('')
  const valuesList = ['cpu_ram','bit_rate_in','bit_rate_out','packet_rate_in','packet_rate_out','tcp_established']
  const [valuesPost, setValuesPost] = React.useState('all')
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
        timeInterval, setTimeInterval
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
    tempData, setTempData, timeLine, setTimeLine,timeInterval
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

  function serverStatusF() {
  //  pokud v dates mam ip, a od ni bude chodit data, tak bude true jinak false
    var tempDates = []
    dates.map((date, index) => {
      var liver = false 
      var tempDate = [...dates]
      let tempServer = {...date}
      tempData.map((data, i) => {
        var ipaddr  = Object.keys(data)
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
          })
        })
        setDates(tempDates)
        
      }

      function serem(responseData) {
        //  pokud v dates mam ip, a od ni bude chodit data, tak bude true jinak false
          var tempDates = []
          dates.map((date, index) => {
            var liver = false 
            var tempDate = [...dates]
            let tempServer = {...date}
            responseData ? responseData.map((data, i) => {
              var ipaddr  = data.info.ip
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
    getoDataStart()
  }, [])


  React.useEffect(() => {
    timeStamps()
    getoDataStart()
  }, [timeInterval])

React.useEffect(() => {
 if(tempData){serverStatusF()} 
}, [tempData])


// pri prubehu pokud je zapnuty startstop tlacitko
  React.useEffect(() => 
  {
    if(startStop){
      timeStamps()
      getoDataUpdate()
    }
  }, [seconds])

  React.useEffect(() => 
  {
    if(tempData){serverStatusF()} 
  }, [dates.length])




//pokud se zmeni typ zobrazeni
  React.useEffect(() => 
  {
    timeStamps()
    getoData()
    if(tempData){serverStatusF()  }
  }, [rangeValue]) 
  
  React.useEffect(() => 
  {
    timeStamps()
    getoData()
    if(tempData){serverStatusF()  }
  }, [valuesPost]) 


//////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
UPDATE_TEMP JE DOCASNA FUNKCE DO TE DOBY NEZ DOSTANU OD VEDOUCIHO SPRAVNOU FUNKCI UPDATE, ZATIM MI TA FUNKCE POSILA SICE ARRAY ALE S ZADNOU HODNOTOU
*/
  //console.log(format(new Date(), "yyyy-MM-dd hh:mm:ss "))
  // funkce pro získání naměřených dat ze serveru

  function getoDataStart () {
    let postValues = {type: "range", from: timeInterval.from, to: timeInterval.to}

      Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
      .then((response) => 
        { if (!response.data.error) {

        //  setTempData(response.data.data.map((datas)=> {
        //  {return {[datas.info.ip]: {
        //       name: datas.info.name,
        //       description: datas.info.os,
        //       cpu: datas.values.map((datas2) => {return datas2.cpu}),
        //       ram: datas.values.map((datas2) => {return datas2.ram}),
        //       timestamp: datas.values.map((datas2) => {return datas2.timestamp}),
        //       bit_rate_in: datas.values.map((datas2) => {return datas2.bit_rate_in}),
        //       bit_rate_out: datas.values.map((datas2) => {return datas2.bit_rate_out}),
        //       packet_rate_in: datas.values.map((datas2) => {return datas2.packet_rate_in}),
        //       packet_rate_out: datas.values.map((datas2) => {return datas2.packet_rate_out}),
        //       tcp_established: datas.values.map((datas2) => {return datas2.tcp_established}),
        //   }}}
        //   }))
          setTempData(response.data.data.map((datas)=> {
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
        } else  {

          setTempData(0)
        }})
      .catch((error) =>{
        console.log("Server is unavailable")
        console.log(error)
        setoData(0)
        setTempData(0)
      })}


/////////////////////////////////////////////////////////////////
function getoDataUpdate () {
      var time = new Date()
      var newTime = new Date(time.getTime() - 1 * 1000)

  //    console.log(format(newTime, 'yyyy-MM-dd kk:mm:ss'),tempData[0]['192.168.0.101'].timestamp[tempData[0]['192.168.0.101'].timestamp.length - 1].split(".")[0].replace("T", " "))
    var ipadr = Object.keys(tempData[0])
    console.log(ipadr)
      var tempTime = tempData[0][ipadr].timestamp[tempData[0][ipadr].timestamp.length - 1].split(".")[0].replace("T", " ")

     // let postValues  = {type: "update", last: format(newTime, 'yyyy-MM-dd kk:mm:ss')}
      let postValues  = {type: "update", last: tempTime}

    Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
    .then((response) => 
      { 
        if (!response.data.error) 
        {
           
          const tempOBJ = response.data.data.map((datas)=> {
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
             })



          
          serem(response.data.data)
         tempData.map((datas, i) => {
           response.data.data.map((datas2) => {
             var ipaddr = Object.keys(datas)
             var tempDataLen = datas[ipaddr].timestamp.length
             var arrayLength = tempOBJ[i][ipaddr].timestamp.length
             if(ipaddr == datas2.info.ip){
               var da = [...datas[ipaddr].timestamp, ...tempOBJ[i][ipaddr].timestamp]
               console.log(da.slice(arrayLength))
               
              //  datas[ipaddr].cpu.shift()
              //  datas[ipaddr].cpu.push(datas2.values[0].cpu)
               datas[ipaddr].cpu = [...datas[ipaddr].cpu, ...tempOBJ[i][ipaddr].cpu]
               datas[ipaddr].cpu = datas[ipaddr].cpu.slice(arrayLength)
               datas[ipaddr].ram.shift()
               datas[ipaddr].ram.push(datas2.values[0].ram)
               datas[ipaddr].timestamp.shift()
               datas[ipaddr].timestamp.push(datas2.values[0].timestamp)
               datas[ipaddr].bit_rate_in.shift()
               datas[ipaddr].bit_rate_in.push(datas2.values[0].bit_rate_in)
               datas[ipaddr].bit_rate_out.shift()
               datas[ipaddr].bit_rate_out.push(datas2.values[0].bit_rate_out)
               datas[ipaddr].packet_rate_in.shift()
               datas[ipaddr].packet_rate_in.push(datas2.values[0].packet_rate_in)
               datas[ipaddr].packet_rate_out.shift()
               datas[ipaddr].packet_rate_out.push(datas2.values[0].packet_rate_out)
               datas[ipaddr].tcp_established.shift()
               datas[ipaddr].tcp_established.push(datas2.values[0].tcp_established)

            

             }})})} 
      else  
      {
        console.log('error') 
        setoData(0) 
        setTempData(0)  
      }})
    .catch((error) =>{
      console.log("Server is unavailable")
      console.log(error)
      setTempData(0)
      setoData(0)
    })}


/////////////////////////////////////////////////////////////////
// pro range values

  function getoData () {
    let postValues = 'all'
    // if(valuesPost == 'all'){
    //   postValues = {type: "all"}
    // }
    // if(valuesPost == 'update_temp'){
    //   postValues = {type: "update_temp"}
    // }
    if(valuesPost == 'range'){
      postValues = {type: "range", from: rangeValue.from, to: rangeValue.to}
      console.log(postValues)
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
      Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
      .then((response) => 
        { if (!response.data.error && valuesPost == 'range') {

          setRangeData(response.data.data.map((datas)=> {
            {       return {[datas.info.ip]: {
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

          {
          tempData.map((datas) => {
             response.data.data.map((datas2) => {
               var ipaddr = Object.keys(datas)
               if(ipaddr == datas2.info.ip){
                 datas[ipaddr].cpu.shift()
                 datas[ipaddr].cpu.push(datas2.values[0].cpu)
                 datas[ipaddr].ram.shift()
                 datas[ipaddr].ram.push(datas2.values[0].ram)
                 datas[ipaddr].timestamp.shift()
                 datas[ipaddr].timestamp.push(datas2.values[0].timestamp)
                 datas[ipaddr].bit_rate_in.shift()
                 datas[ipaddr].bit_rate_in.push(datas2.values[0].bit_rate_in)
                 datas[ipaddr].bit_rate_out.shift()
                 datas[ipaddr].bit_rate_out.push(datas2.values[0].bit_rate_out)
                 datas[ipaddr].packet_rate_in.shift()
                 datas[ipaddr].packet_rate_in.push(datas2.values[0].packet_rate_in)
                 datas[ipaddr].packet_rate_out.shift()
                 datas[ipaddr].packet_rate_out.push(datas2.values[0].packet_rate_out)
                 datas[ipaddr].tcp_established.shift()
                 datas[ipaddr].tcp_established.push(datas2.values[0].tcp_established)
  
               }})})} 




        }
        else  {
       //   setoData((prevState) => response.data.data)
          setRangeData(0)
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
