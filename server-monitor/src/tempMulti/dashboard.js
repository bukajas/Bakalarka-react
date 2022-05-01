import React from 'react';
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { CheckboxInt } from '../components/App'
import AngryJOe from '../components/AngryJOe'
import { format } from 'date-fns'
import { Row, Col, Button } from 'antd';

Chart.register(...registerables)


  const StatusColor = (props) => {
    if(props.stat == true)
    return <p className="statusDotGreen"></p>
    if (props.stat == false) {
      return <p className="statusDotRed"></p>
    }
  
  }


const DashboardTab = (props) => {


  function averageValue(valueArray) {
    const sum = valueArray.reduce((a,b) => a + b, 0)
    const avg = Math.floor(sum / valueArray.length) || 0
    return avg
  }

  const context = React.useContext(CheckboxInt)
  const { tempData } = context
  //console.log(props.datas.ip)
  var lever = false
    

     return (


    <div className='dashboard-container'>
      {
        tempData ? tempData.map((d , index) => {
          var ipaddr  = Object.keys(d)
          var arLen = d[ipaddr].cpu.length - 1
          if(props.datas.ip == ipaddr){
            lever = true
            return (
            <div className='dashboard-container-child'>
              <h2>{ipaddr} {d[ipaddr].name} {d[ipaddr].description} <StatusColor stat={props.datas.status}/></h2>
              <p>cpu : {d[ipaddr].cpu[arLen]} %   (avg: {averageValue(d[ipaddr].cpu)} %) </p>
              <p>ram: {d[ipaddr].ram[arLen]} %    (avg: {averageValue(d[ipaddr].ram)} %)</p>
              <p>bit_rate_in: {d[ipaddr].bit_rate_in[arLen]} bits/sec  (avg: {averageValue(d[ipaddr].bit_rate_in)} bits/sec)</p>
              <p>bit_rate_out: {d[ipaddr].bit_rate_out[arLen]} bits/sec   (avg: {averageValue(d[ipaddr].bit_rate_out)} bits/sec</p>
              <p>packet_rate_out: {d[ipaddr].packet_rate_out[arLen]} packets/sec (avg: {averageValue(d[ipaddr].packet_rate_out)} packets/sec)</p>
              <p>tcp_established: {d[ipaddr].tcp_established[arLen]} packets/sec    (avg: {averageValue(d[ipaddr].tcp_established)} packets/sec)</p>
            </div>
          )
            
          } else if(index == tempData.length -1 && props.datas.ip !== ipaddr && lever == false){ 
            return (
            <div className='dashboard-container-child'>
              <h3>No data from server</h3>
                <h2>{props.datas.ip} {props.datas.name} {props.datas.description} <StatusColor stat={props.datas.status}/></h2>
                <p>cpu : NULL %   (avg: NULL %) </p>
                <p>ram: NULL %    (avg: NULL %) </p>
                <p>bit_rate_in: NULL bits/sec  (avg: NULL bits/sec) </p>
                <p>bit_rate_out: NULL bits/sec   (avg: NULL bits/sec) </p>
                <p>packet_rate_out: NULL packets/sec (avg: NULL packets/sec) </p>
                <p>tcp_established: NULL packets/sec    (avg: NULL packets/sec) </p>
            </div>
          )
          }
   
        }) : <AngryJOe />
      }
    </div>
    
  ) 

    }



const Dashboard = () => {

//   const [count, setCount] = React.useState(0);
//   const mutationRef = React.useRef(count);

//   React.useEffect(() =>{
//     setCount(count + 1);
//  }, [])


  
  
//   console.log('count after', count)
  
//   const handleClick = () => {
//     setCount(count + 1);
//     console.log("Count before update", count);
//   };

//   React.useEffect(() =>{
//      mutationRef.current = count
//   }, [count])




  const context = React.useContext(CheckboxInt)
  const { startStop, setStartStop, dates } = context 
  return (
    <div>
       {/* <button onClick={handleClick}>Increment</button> */}
      <Button onClick={() => setStartStop(prevState => !prevState)} type='primary'>{startStop ? "Stop" : "Start"}</Button>
      <h1>Dashboard</h1><hr/>
      <div>
          {
            dates.map((datas, i) => 
            { 
              return <DashboardTab  datas={datas} i={i}/>
            })
          }

      </div>

</div>
  );
};
  
export default Dashboard;