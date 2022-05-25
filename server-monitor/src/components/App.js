import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import "antd/dist/antd.css";
import "../index.css";
import Template from "./Template.js"
import {format} from 'date-fns'
import ListOfServers from "./ListOfServers.json"
import {Filterer} from "./functions/Functions"





const CheckboxInt =  createContext()




const Main = ({ children }) => {

  const [globalData, setGlobalData] = React.useState([])
  const [fetchedData, setFetchedData] = React.useState('')
  const mutationRef = React.useRef(globalData)

  var time = new Date()
  var newTime = new Date(time.getTime() - 60 * 1000)
  var tempObj = {
    from: format(newTime, 'yyyy-MM-dd kk:mm:ss'),
    to: format(time, 'yyyy-MM-dd kk:mm:ss')
    }
  const [timeInterval, setTimeInterval] = React.useState(tempObj) // casovy usek ktery se posle pro stazeni
  const [dates, setDates] = React.useState(ListOfServers)  // seznam vybranych serveru
  const valuesList = ['cpu_ram','bit_rate_in','bit_rate_out','packet_rate_in','packet_rate_out','tcp_established']

  const [rangeValue, setRangeValue] = React.useState({
    from: "2021-02-01 01:00:00",
    to: "2021-02-01 01:01:00"
  })
  const [valuesPost, setValuesPost] = React.useState('range')
  const [startStop, setStartStop] = React.useState(false)
  const [clickedServers, setClickedServers] = React.useState([])
  const [tempCurrentData, setTempCurrentData] = React.useState([])
  const [tempRangeData, setTempRangeData] = React.useState([])





  return ( <CheckboxInt.Provider value={{
        startStop, setStartStop,
        valuesPost, setValuesPost,
        clickedServers, setClickedServers,
        rangeValue, setRangeValue,
        dates, setDates,
        valuesList,
        timeInterval, setTimeInterval,
        globalData, setGlobalData,
        mutationRef,
        fetchedData, setFetchedData,
        tempCurrentData, setTempCurrentData,
        tempRangeData, setTempRangeData
         }}>
      {children}
      </CheckboxInt.Provider>)
}



function Druhy({ children }) {
  const context = React.useContext(CheckboxInt)
  const { dates, startStop, timeInterval,
    globalData, setGlobalData
  } = context
  const [seconds, setSeconds] = React.useState(0)
  

React.useEffect(() => {
      getDataFromServer( //stazeni prvnich dat
      {
       type: "range",
       from: timeInterval.from,
       to: timeInterval.to
      }, 'first')
    }, [])
  

React.useEffect(() => {
      const interval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
      return () => clearInterval(interval)
    }, [])
  

React.useEffect(() => {
      if(startStop){serverStatus()}
    }, [seconds])



    
  function serverStatus() {
    var tempIp = dates.map((data) => {return data.ip })
    var golb
  //  pokud v dates mam ip, a od ni bude chodit data, tak bude true jinak false
      dates.forEach((data) => {
        golb = globalData.map((globData, i) => {
          var stat = 0
          var ipaddr = Object.keys(globData)[0]
          if(tempIp.includes(ipaddr)){
            for(var k = 1; k < 6; k++){
              if(globData[ipaddr].cpu.at(0 - k) == null){
                stat = stat + 1
            } else{
              if(stat >= 2 && stat <5){ return {[ipaddr]: 2} }
              stat = 0
              return {[ipaddr]: stat}
            }
            } 
            if(stat >= 5){ return {[ipaddr]: stat} } 
            if(stat >= 2){ return {[ipaddr]: stat} }
          }
        })
      })
      var status = Array(tempIp.length).fill(0)
      golb.forEach((datas,i) => {
        var ip = Object.keys(datas)[0]
        if(tempIp.includes(ip)){
          status[tempIp.indexOf(ip)] = datas[ip]
          if(status[tempIp.indexOf(ip)] === 0){ dates[tempIp.indexOf(ip)].status = 'OK' }
          if(status[tempIp.indexOf(ip)] === 2){ dates[tempIp.indexOf(ip)].status = 'WARNING' }
          if(status[tempIp.indexOf(ip)] === 5){ dates[tempIp.indexOf(ip)].status = 'CRITICAL' }
        }
      })
      }



  function getDataFromServer(postValuess, type){
    var postValues
    var tempOBJ = []
    var fetchedIps = []
    if(type === 'first'){ postValues = postValuess }
    
    Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
    .then((response) => {
      if (!response.data.error) {

        var newData = Filterer(dates, response.data.data)
        newData.forEach((datas, i) => {
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
           tempOBJ[i] = newServer 
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

  return (
    <div>
      {children}
    </div>
  )
}





const App = () => {
  return(
    <div>
    <Main>
      <Druhy>
        <Template/>
      </Druhy>
    </Main>
    </div>
  )
}

export { CheckboxInt }
export default App
