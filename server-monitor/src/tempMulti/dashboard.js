import React from 'react';
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { CheckboxInt } from '../components/App'
import AngryJOe from '../components/AngryJOe'

Chart.register(...registerables)



const Home = () => {

  const context = React.useContext(CheckboxInt)


  const { tempData, startStop, setStartStop } = context


  function currentValue() {
    tempData ? tempData.map((datas) => {
      var ipaddr  = Object.keys(datas)
      return (
      <div>
        <p>{datas[ipaddr].cpu[ datas[ipaddr].cpu.length - 1]}</p>
        <p>{datas[ipaddr].cpu[ datas[ipaddr].cpu.length - 1]}</p>
        <p>{datas[ipaddr].cpu[ datas[ipaddr].cpu.length - 1]}</p>
        <p>{datas[ipaddr].cpu[ datas[ipaddr].cpu.length - 1]}</p>
      </div>
      
      // console.log(datas[ipaddr].cpu);
    )}): <AngryJOe/>
  }




    // function timeStamps() {
    //   console.log(tempData[0]['192.168.0.101'].timestamp[0])
    //   var secsToSub = 10000;
    //   var time = new Date()
    //   var newTime = new Date(time.getTime() - secsToSub * 1000);
    //   console.log(format(newTime, 'yyyy-MM-dd kk:mm:ss'))
    //   console.log(newTime)

//   //  if(newTime)
// //  console.log(newTime)
//   }
    // }
 function averageValue(valueArray) {
   const sum = valueArray.reduce((a,b) => a + b, 0)
   const avg = Math.floor(sum / valueArray.length) || 0
   return avg
 }
 

  return (
    <div>
      <p>Time: {Date()}</p>
      <button onClick={() => setStartStop(prevState => !prevState)} className='btn-start-stop' >{startStop ? "Stop" : "Start"}</button>
      {/* <button onClick={timeStamps}>time</button> */}
      <h1>Dashboard</h1><hr/>

    

      <div>
        {tempData ? tempData.map((datas) => {
      var ipaddr  = Object.keys(datas)
      var arLen = datas[ipaddr].cpu.length - 1


      return (
      <div className='dashboard-container'>
        <h2>{ipaddr} {datas[ipaddr].name} {datas[ipaddr].os}</h2>
       

<p>cpu : {datas[ipaddr].cpu[arLen]} %  ( avg: {averageValue(datas[ipaddr].cpu)} %) </p>
<p>ram: {datas[ipaddr].ram[arLen]} %    (avg: {averageValue(datas[ipaddr].ram)} %)        </p>
<p>bit_rate_in: {datas[ipaddr].bit_rate_in[arLen]} bits/sec  ({averageValue(datas[ipaddr].bit_rate_in)} bits/sec)      </p>
<p>bit_rate_out: {datas[ipaddr].bit_rate_out[arLen]} bits/sec   ({averageValue(datas[ipaddr].bit_rate_out)} bits/sec)        </p>
<p>packet_rate_out: {datas[ipaddr].packet_rate_out[arLen]} packets/sec (avg: {averageValue(datas[ipaddr].packet_rate_out)} packets/sec)        </p>
<p>tcp_established: {datas[ipaddr].tcp_established[arLen]} packets/sec    (avg: {averageValue(datas[ipaddr].tcp_established)} packets/sec)           </p>

      </div>
      
      // console.log(datas[ipaddr].cpu);
    )}): <AngryJOe/>}

      </div>
    </div>
  );
};
  
export default Home;