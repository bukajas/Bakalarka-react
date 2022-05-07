import React from 'react';
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { CheckboxInt } from '../components/App'
import AngryJOe from '../components/AngryJOe'
import { format } from 'date-fns'
import 'antd/dist/antd.css';
import { Row, Col, Menu, Button, Dropdown, Space, Card} from 'antd';
import {DataFetcher} from '../components/dataFetcher'
import {every_nth} from '../components/every_nth'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import StatusSign from '../components/StatusSign'



Chart.register(...registerables)

  // const StatusColor = (props) => {
  //   if(props.stat == true)
  //   return <p className="statusDotOk">h</p>
  //   if (props.stat == false) {
  //     return <p className="statusDotCritical">h</p>
  //   }
    
  //     return <p>no</p>
    
  
  // }



var secsToSub = 60


const DashboardTab = (props) => {



  const context = React.useContext(CheckboxInt)
  const { startStop, tempCurrentData, setGlobalData, globalData, setTempCurrentData} = context
  const [seconds, setSeconds] = React.useState(0)
  const [run, setRun]= React.useState([1])

 
  React.useEffect(() =>
  {
    const waitInterval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
    return () => clearInterval(waitInterval)
  }, [])


  function averageValue(valueArray) {
    const sum = valueArray.reduce((a,b) => a + b, 0)
    const avg = Math.floor(sum / valueArray.length) || 0
    return avg
  }


  var lever = false

  function setTempData(){
    var time = new Date()
    var firstTime = new Date(time.getTime() - 60 * 1000)
    var tempData = globalData.map((datas, i)=> {
      var ipaddr = Object.keys(datas)[0] 
      var fromTime = format(firstTime, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
      var ind
      if(datas[ipaddr].timestamp.includes(fromTime)){
        ind = datas[ipaddr].timestamp.indexOf(fromTime)
      }
      else{
        console.log("hovno")
        ind = 0 - secsToSub
      }
      {return {[ipaddr]: {
        name: datas[ipaddr].name,
        description: datas[ipaddr].description,
        cpu: datas[ipaddr].cpu.slice(ind),
        ram: datas[ipaddr].ram.slice(ind),
        timestamp: datas[ipaddr].timestamp.slice(ind),
        bit_rate_in: datas[ipaddr].bit_rate_in.slice(ind),
        bit_rate_out: datas[ipaddr].bit_rate_out.slice(ind),
        packet_rate_in: datas[ipaddr].packet_rate_in.slice(ind),
        packet_rate_out: datas[ipaddr].packet_rate_out.slice(ind),
        tcp_established: datas[ipaddr].tcp_established.slice(ind),
      }}}
    })
    return tempData
  }

  React.useEffect(() =>{
    if(startStop){
      var tempGlob = DataFetcher({type: 'update'}, 'update', globalData)
      var tempik = setTempData() 
      setTempCurrentData(tempik)
      setGlobalData(tempGlob)
    }
  }, [seconds])


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
              <p>{props.datas.description}</p>
            </Card>}>
              <p className='dashboard-description'>
                  <Space>
                    Description
                  </Space>
                    </p>
       </Dropdown>
    </div>
        
  )

  
}
function IsNotAvailable(){
  console.log('hovno')
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
                  <p>{props.datas.description}</p>
              </Card>}>
                <p className='dashboard-description'>
                  <Space>
                    Description
                  </Space>
                </p>
            </Dropdown>
    </div>

  )
}



     return (
    <div className='dashboard-container'>
      {
        run.map((run) => {
          var tempIp = []
          globalData.map((data) => { var globalKey = Object.keys(data)[0]; tempIp.push(globalKey) })

            if(tempIp.includes(props.datas.ip))
            {
                var index = tempIp.indexOf(props.datas.ip)
                var ipaddr = Object.keys(globalData[index])[0]
                var arLen = globalData[index][ipaddr].cpu.length - 1
                 return (
                    <div className='dashboard-container-child'>
                      <div>
                         <p className='dashboard-status'>Available: <StatusSign stat={props.datas.status}/></p>
                      <h2>{props.datas.ip} {props.datas.name}</h2>
                      </div>
                     <IsAvailable tempIp={tempIp} datas={props.datas}/>

                    </div>
                  )
              
            }
            else {
              return (
                    <div className='dashboard-container-child'>
                      <div>
                      <h2 className='dashboard-title'>{props.datas.ip} {props.datas.name}</h2>
                       <p className='dashboard-status'>Available: <StatusSign stat={props.datas.status}/></p>
                      </div>
                     <IsNotAvailable datas={props.datas}/>
                      
                    </div>
                 )
            }
          })
      }
      
    </div>
  ) 
    }


const Dashboard = () => {

  const context = React.useContext(CheckboxInt)
  const { startStop, setStartStop, dates } = context 



  var globalIp = []

  return (
    <div>
      <Button onClick={() => setStartStop(prevState => !prevState)} type='primary'>{startStop ? "Stop" : "Start"}</Button>
      <h1>Dashboard</h1><hr/>
      <div>
        <Box xs={{flexGrow: 1}}><Grid container spacing={2}>
          {
            dates.map((datas, i) => 
            {
              return (<Grid xs={0} md={1} lg={2} xl={3}><DashboardTab datas={datas} i={i} globalIp={globalIp}/></Grid>)
              
            })
          
          }
        </Grid></Box>
      </div>

</div>
  );
};
  
export default Dashboard;