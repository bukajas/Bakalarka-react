import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import "antd/dist/antd.css";
import "../index.css";
import { Layout, Menu, Breadcrumb, Spin, Button, Space  } from 'antd';

import Template from "./Template.js"
import {format, set} from 'date-fns'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';



export const dataFetcher = function(postValuess, type, globalData, timeInterval){
    console.log(postValuess, type, globalData, timeInterval)
    var postValues
    var timeLast
    var timeFirst
    var tempGlobal = [...globalData]
    console.log(tempGlobal, 457)

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
   //     console.log(timeFirst > timeInterval.from)
        if(timeFirst > timeInterval.from){
          postValues = {type: "range",  from: timeInterval.from, to: timeInterval.to}
     //     console.log('timeFirst, timeInterval.from')
        }
        else{
          return
        }
        }
        if(type == 'update'){
        var tempTime = timeLast.split(".")[0].replace("T", " ")
        postValues = {type: "update", last: tempTime}
         }


         
      //saved data
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
                  console.log('blablalblkajsdlfkjsakldjlk')
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
        //    console.log(tempGlobal)
          //  setGlobalData(tempGlobal)
       //     console.log(globalData,1222)
        } 
        else {
          console.log(response.data.message)
        }
      })
      .catch((error) => {
        console.log("Server is unavailable")
        console.log(error)
      })
      
      return tempGlobal
    }

export default dataFetcher