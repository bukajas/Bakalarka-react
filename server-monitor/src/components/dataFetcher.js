import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'




export const DataFetcher = (postValuess, type, globalData, timeInterval) => {

//postvalues je typ a casovy usek
//type je rozliseni
//globalData jsou globalData

// 1. prvni stazeni dat ? to muze byt asi jen v current, 
// 2. update novych dat ? to muze v current/dashboard
// 3. stazeni starsich dat, jak v current (tam se zvetsi rozsah)
// 4. v range stazeni starsich dat
//5 v range stazeni novych dataFetcher
// 6. stazeni stejnych dat, udelat se replace


    var postValues
    var timeLast
    var timeFirst


      if(type == 'first')  //prvni stazeni
        {
          postValues = postValuess
        }
      else
        {
          if(globalData.length > 0)
          {
            var ipadr = Object.keys(globalData[0])[0]
            timeLast = globalData[0][ipadr].timestamp.at(-1).split(".")[0].replace("T", " ")
            timeFirst = globalData[0][ipadr].timestamp.at(1).split(".")[0].replace("T", " ")
          }
          if(type == 'before'){ // = range, curent
            if(timeFirst > timeInterval.from){
              postValues = {type: "range",  from: timeInterval.from, to: timeInterval.to}
            }
            else{
              console.log('stale v rozmezi')
              return
            }
          }
          if(type == 'update'){
            var tempTime = timeLast.split(".")[0].replace("T", " ")
        postValues = {type: "update", last: tempTime}
      }
    }
    
    
    
    
    
    //saved data
    var tempOBJ = []
    let tempServer
    var tempGlobal = [...globalData]
    var globalIps  = []
    var fetchedIps = []
    var aga = []
    tempGlobal.map((data) => { var globalKey = Object.keys(data)[0]; globalIps.push(globalKey) })









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
              if(globalLength > 4000) {
                var diference = globalLength - 4000
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
                  aga = [...aga, tempGlobal] 
                }
                else{
                  tempGlobal[tempGlobal.length] = {...datas}
                  aga = [...aga, tempGlobal]
                }
              }
              tempGlobal[i] = tempServer

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

          aga = tempGlobal
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

export default DataFetcher