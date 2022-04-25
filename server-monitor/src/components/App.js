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
import TempGraf from './TempGraf'
export { CheckboxInt }


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 2 }} spin />;
const CheckboxInt =  createContext()





const Hlavni = ({ children }) => {



  const [dates, setDates] = React.useState([ 
    { name: 'Device 1',
      ip: '192.168.0.101',
      os: 'debian',
      status: false
  }, { 
      name: 'Device 2',
      ip: '192.168.0.102',
      os: 'ubuntu',
      status: false
}])  // seznam vybranych serveru

  const [graphOptions, setGraphOptions] = React.useState([])
  const [graphData, setGraphData] = React.useState([])
  const [tempData, setTempData] = React.useState('') //curent data
  const [rangeData, setRangeData] = React.useState('') //range data
  const [timeLine, setTimeLine] = React.useState('')
  const [oData, setoData] = React.useState('')
  const valuesList = ['bit_rate_in','bit_rate_out','cpu','packet_rate_in','packet_rate_out','ram','tcp_established']
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
    tempData, setTempData, timeLine, setTimeLine,
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
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
UPDATE_TEMP JE DOCASNA FUNKCE DO TE DOBY NEZ DOSTANU OD VEDOUCIHO SPRAVNOU FUNKCI UPDATE, ZATIM MI TA FUNKCE POSILA SICE ARRAY ALE S ZADNOU HODNOTOU
*/
  //console.log(format(new Date(), "yyyy-MM-dd hh:mm:ss "))
  // funkce pro získání naměřených dat ze serveru

  function getoDataStart () {
    let postValues = {type: "all"}
      Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
      .then((response) => 
        { if (!response.data.error) {

         setTempData(response.data.data.map((datas)=> {
         {return {[datas.info.ip]: {
              name: datas.info.name,
              os: datas.info.os,
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
         // setoData(() => response.data.data)
          //setoData(response.data.data)
        } else  {
         // setoData(() => response.data.data)
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
  let postValues = {type: "update_temp"}
    Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
    .then((response) => 
      { 
        if (!response.data.error) 
        {
          serem(response.data.data)
        tempData.map((datas) => {
           response.data.data.map((datas2) => {
             var ipaddr = Object.keys(datas)
             if(ipaddr == datas2.info.ip){
               datas[ipaddr].cpu.shift()
               datas[ipaddr].cpu.push(datas2.values[1].cpu)
               datas[ipaddr].ram.shift()
               datas[ipaddr].ram.push(datas2.values[1].ram)
               datas[ipaddr].timestamp.shift()
               datas[ipaddr].timestamp.push(datas2.values[1].timestamp)
               datas[ipaddr].bit_rate_in.shift()
               datas[ipaddr].bit_rate_in.push(datas2.values[1].bit_rate_in)
               datas[ipaddr].bit_rate_out.shift()
               datas[ipaddr].bit_rate_out.push(datas2.values[1].bit_rate_out)
               datas[ipaddr].packet_rate_in.shift()
               datas[ipaddr].packet_rate_in.push(datas2.values[1].packet_rate_in)
               datas[ipaddr].packet_rate_out.shift()
               datas[ipaddr].packet_rate_out.push(datas2.values[1].packet_rate_out)
               datas[ipaddr].tcp_established.shift()
               datas[ipaddr].tcp_established.push(datas2.values[1].tcp_established)

             }})})} 
      else  
      {
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
    // else if(valuesPost == 'update') {
    //   console.log(format(new Date(), "yyyy-MM-dd HH:mm:ss"))
    //   let time = format(new Date(), "yyyy-MM-dd HH:mm:ss")
    //   postValues = {type: "update", last: time}
    // }
      Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
      .then((response) => 
        { if (!response.data.error && valuesPost == 'range') {

          setRangeData(response.data.data.map((datas)=> {
            {       return {[datas.info.ip]: {
                     name: datas.info.name,
                     os: datas.info.os,
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
        }  else  {
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
