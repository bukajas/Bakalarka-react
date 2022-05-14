import React from 'react';
import {Config} from '../config.js'
import 'antd/dist/antd.css';
import { Chart, registerables } from 'chart.js'
import { CheckboxInt } from '../components/App'
import AngryJOe from '../components/AngryJOe'
import { format } from 'date-fns'
import { Dropdown, Space, Card} from 'antd';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Axios from 'axios'
import AddData from '../components/functions/AddData'
import {GlobalFirstLast, SetTempData, StatusSign} from '../components/functions/Functions'

Chart.register(...registerables)
var secsToSub = 60


//pocet dostupnych serveru
function NumberOfAvailableServers(props){
  var numberOf = props.dates.filter((datas, i) =>{return datas.status === 'OK' })
 return (
   <div className="clock">
     Available servers: <p>{numberOf.length}/{props.dates.length}</p>
   </div>
 )}


//posledni stazena hodnota
function LastValue(props){
 var lastValue=props.globalData.map((datas) =>{
   var ip = Object.keys(datas)[0]
   return datas[ip].timestamp.at(-1).split(".")[0].replace("T", " ")
 })
return (  <div className='clock'>Last Downloaded Time <p>{lastValue[0]}</p></div> )
}


//hodiny
function Clock(props){
 const [date, setDate] = React.useState(new Date())

 React.useEffect(() => {
   var timerID = setInterval( () => tick(), 1000 )
   return function cleanup() { clearInterval(timerID) }
  })

   function tick() { setDate(new Date())}
  return (
   <div>
     <h2 className="clock">It is {date.toLocaleTimeString()}.</h2>
   </div>
 )}





const DashboardTab = (props) => {
  const context = React.useContext(CheckboxInt)
  const {globalData} = context
  const run = [1]


  function averageValue(valueArray) {
    const sum = valueArray.reduce((a,b) => a + b, 0)
    const avg = Math.floor(sum / valueArray.length) || 0
    return avg
  }


function IsAvailable(props){
  var index = props.tempIp.indexOf(props.datas.ip)
  var ipaddr = Object.keys(globalData[index])[0]
  var arLen = globalData[index][ipaddr].cpu.length - 1
  return (
    <div>
      <div className='dashboard-values'>
            <p>cpu : {globalData[index][ipaddr].cpu[arLen]} %   (avg: {averageValue(globalData[index][ipaddr].cpu)} %) </p>
            <p>ram: {globalData[index][ipaddr].ram[arLen]} %    (avg: {averageValue(globalData[index][ipaddr].ram)} %)</p>
            <p>bit rate in: {globalData[index][ipaddr].bit_rate_in[arLen]} bits/sec  (avg: {averageValue(globalData[index][ipaddr].bit_rate_in)} bits/sec)</p>
            <p>bit rate out: {globalData[index][ipaddr].bit_rate_out[arLen]} bits/sec   (avg: {averageValue(globalData[index][ipaddr].bit_rate_out)} bits/sec</p>
            <p>packet rate out: {globalData[index][ipaddr].packet_rate_out[arLen]} packets/sec (avg: {averageValue(globalData[index][ipaddr].packet_rate_out)} packets/sec)</p>
            <p>tcp established: {globalData[index][ipaddr].tcp_established[arLen]} packets/sec    (avg: {averageValue(globalData[index][ipaddr].tcp_established)} packets/sec)</p>
        </div>
        <Dropdown overlay={
          <Card size="small">
            <div>{props.datas.description}</div>
          </Card>}>
          <div className='dashboard-description'>
            <Space>
              Description
            </Space>
          </div>
        </Dropdown>
    </div>
        
  )

  
}
function IsNotAvailable(){
  return (
    <div>
       <div className='dashboard-values'>
          <p>cpu : NULL %   (avg: NULL %) </p>
          <p>ram: NULL %    (avg: NULL %) </p>
          <p>bit rate_in: NULL bits/sec  (avg: NULL bits/sec) </p>
          <p>bit rate out: NULL bits/sec   (avg: NULL bits/sec) </p>
          <p>packet rate_out: NULL packets/sec (avg: NULL packets/sec) </p>
          <p>tcp established: NULL packets/sec    (avg: NULL packets/sec) </p>
        </div>
            <Dropdown overlay={
              <Card size="small">
                  <div>{props.datas.description}</div>
              </Card>}>
                <div className='dashboard-description'>
                  <Space>
                    Description
                  </Space>
                </div>
            </Dropdown>
    </div>
  )}

     return (
    <div className='dashboard-container'>
      { run.map((run) => {
          var tempIp = []
          globalData.map((data) => { var globalKey = Object.keys(data)[0]; tempIp.push(globalKey)})

        if(tempIp.includes(props.datas.ip)){
                 return (
                    <div key={props.datas.ip} className='dashboard-container-child'>
                      <div>
                         <div className='dashboard-status'>Available: <StatusSign stat={props.datas.status}/></div>
                      <h2>{props.datas.ip} {props.datas.name}</h2>
                      </div>
                     <IsAvailable key={props.datas.ip} tempIp={tempIp} datas={props.datas}/>
                    </div>
                  )}
        else {
              return (
                    <div key={props.datas.ip} className='dashboard-container-child'>
                      <div>
                      <h2 className='dashboard-title'>{props.datas.ip} {props.datas.name}</h2>
                       <div className='dashboard-status'>Available: <StatusSign stat={props.datas.status}/></div>
                      </div>
                     <IsNotAvailable datas={props.datas}/>
                    </div>
                 )}
          })
      }  
    </div>
  )}

const Dashboard = () => {

  const [seconds, setSeconds] = React.useState(0)
  const context = React.useContext(CheckboxInt)
  const { startStop, setStartStop, dates, globalData, tempCurrentData, setTempCurrentData, setGlobalData } = context 

  React.useEffect(() => {
    if(startStop) {
      const waitInterval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
      return () => clearInterval(waitInterval)
    }})

  React.useEffect(() => {
    if(startStop ){
      var globalDates = GlobalFirstLast(globalData, secsToSub)
      FetchData('update', {type: "update", last: format(globalDates[1], "yyyy-MM-dd kk:mm:ss")}, globalDates)
    }
  }, [seconds])



  function FetchData(type, postValues, globalDates){
    console.log(postValues)
    var tempOBJ = []
    
    Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
          .then((response) => {
            if (!response.data.error) {
                response.data.data.map((datas, i) => {
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
                 return response.data.data
                })
              } 
              else {console.log(response.data.message)}

              var tempGlob = AddData(type, globalData, tempOBJ)
              var tempik = SetTempData(tempGlob, globalDates, secsToSub)
              setTempCurrentData(tempik)
              setGlobalData(tempGlob)

            })
            .catch((error) => {
              console.log("Server is unavailable")
              console.log(error)
            })       
  }

  return (
    <div><div className='dashboard-topInfo-item'>{startStop ? 
        <Button onClick={() => setStartStop(prevState => !prevState)} color="error" variant="contained" >STOP</Button>
        : 
        <Button onClick={() => setStartStop(prevState => !prevState)} variant="contained" >START</Button>
        }</div>
      <div className='dashboard-topInfo'>
        <div className='dashboard-topInfo-item'><NumberOfAvailableServers dates={dates}/></div>
        <div className='dashboard-topInfo-item'><LastValue globalData={globalData} startStop={startStop}/></div>
        <div className='dashboard-topInfo-item'><Clock/></div>
      </div>
      
      <hr/>
      <div>
        <Box xs={{flexGrow: 1}}><Grid container spacing={2}>
          {tempCurrentData ?
            dates.map((datas, i) => 
            {
              return (<Grid key={'grid-'+datas.ip} xs={7} md={7} lg={5} xl={4} item={true}><Card key={'dashboarb-grid-card'}><DashboardTab key={datas.ip} datas={datas} i={i}  /></Card></Grid>)
            }) : <AngryJOe />
          }
        </Grid></Box>
      </div>
</div>
  );
};
  




export default Dashboard;