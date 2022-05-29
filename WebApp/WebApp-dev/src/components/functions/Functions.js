import React from 'react'
import {sub, format, isBefore} from 'date-fns'



const GlobalFirstLast = (data, secsToSub) => {
    
        var getGlobalFirst, getGlobalLast
        data.forEach((data, i) =>{
          var ipadr = Object.keys(data)[0]
          getGlobalFirst = data[ipadr].timestamp.at(0).split(".")[0].replace("T", " ") // prvni global cas
          getGlobalLast = data[ipadr].timestamp.at(-1).split(".")[0].replace("T", " ")
        })
          var first = DateFormater(getGlobalFirst)
          var last = DateFormater(getGlobalLast)
          var globalFirst = new Date(first.year, first.month, first.day, first.hour, first.minute, first.second)
          var globalLast = new Date(last.year, last.month, last.day, last.hour, last.minute, last.second)
          var globalminusSec = sub(globalFirst, {seconds: 1})
          let interval = sub(globalLast, {seconds: secsToSub}) 
      
    return [globalFirst, globalLast, interval, globalminusSec]
    
}


const DateFormater = function(date){ // format yyyy-mm-dd HH:MM:SS
    const datum = {
        year: Number(date.split('-')[0]),
        month: Number(date.split('-')[1]) -1,
        day: Number(date.split('-')[2].split(' ')[0]),
        hour: Number(date.split(':')[0].split(' ')[1]),
        minute: Number(date.split(' ')[1].split(':')[1]),
        second: Number(date.split(' ')[1].split(':')[2])}
  return datum
}

const SetPostValues = (type, globalDates) => {
    var postValues

          if(type === 'before'){ // = range, curent
            var tempInterval = {type: 'range', from:  format(globalDates[2], "yyyy-MM-dd kk:mm:ss"), to: format(globalDates[3], "yyyy-MM-dd kk:mm:ss")}
            if(isBefore(globalDates[2], globalDates[0])){
              postValues = tempInterval
            }
            else{ return null }
          }
          if(type === 'update'){
            postValues = {type: "update", last: format(globalDates[1], "yyyy-MM-dd kk:mm:ss")}
      }
  return postValues
}



const StatusSign = (props) => {

  if(props.stat === 'OK')
  return <p className="statusDotOk"></p>
  if (props.stat === 'WARNING') {
    return <div className="statusDotWarning"></div>
  } if (props.stat === 'CRITICAL') {
    return <div className="statusDotCritical"></div>
  }
}



const SetTempData = (data, dates, secsToSub) => {
    var tempData = data.map((server, i)=> {
        var ipaddr = Object.keys(server)[0] 
        var fromTime = format(dates[2], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
        var ind
        if(server[ipaddr].timestamp.includes(fromTime)){
          ind = server[ipaddr].timestamp.indexOf(fromTime)
        }
        else{ ind = 0 - secsToSub }
        return {[ipaddr]: {
          name: server[ipaddr].name,
          description: server[ipaddr].description,
          cpu: server[ipaddr].cpu.slice(ind),
          ram: server[ipaddr].ram.slice(ind),
          timestamp: server[ipaddr].timestamp.slice(ind),
          bit_rate_in: server[ipaddr].bit_rate_in.slice(ind),
          bit_rate_out: server[ipaddr].bit_rate_out.slice(ind),
          packet_rate_in: server[ipaddr].packet_rate_in.slice(ind),
          packet_rate_out: server[ipaddr].packet_rate_out.slice(ind),
          tcp_established: server[ipaddr].tcp_established.slice(ind),
        }}
      })
      return tempData
}





const every_nth = (data, nth) => {
    var tempFilter = [...data]
    var tempFilterServer
    tempFilter.forEach((date, i) => {
      var ipadddr = Object.keys(date)[0] 
      tempFilterServer = {...date}
      tempFilterServer[ipadddr].cpu = tempFilterServer[ipadddr].cpu.filter((e,i) => i % nth === nth -1)
      tempFilterServer[ipadddr].ram = tempFilterServer[ipadddr].ram.filter((e,i) => i % nth === nth -1)
      tempFilterServer[ipadddr].timestamp = tempFilterServer[ipadddr].timestamp.filter((e,i) => i % nth === nth -1)
      tempFilterServer[ipadddr].bit_rate_in = tempFilterServer[ipadddr].bit_rate_in.filter((e,i) => i % nth === nth -1)
      tempFilterServer[ipadddr].bit_rate_out = tempFilterServer[ipadddr].bit_rate_out.filter((e,i) => i % nth === nth -1)
      tempFilterServer[ipadddr].packet_rate_out = tempFilterServer[ipadddr].packet_rate_out.filter((e,i) => i % nth === nth -1)
      tempFilterServer[ipadddr].packet_rate_in = tempFilterServer[ipadddr].packet_rate_in.filter((e,i) => i % nth === nth -1)
      tempFilterServer[ipadddr].tcp_established = tempFilterServer[ipadddr].tcp_established.filter((e,i) => i % nth === nth -1)
      tempFilter[i] = tempFilterServer
      
    })
    return tempFilter // cely data, at se neseru a state
  }
const SetTempDataRange = (tempGlob, dateStrings) =>{
    var getIndexFirst, getIndexLast
    var tempData =tempGlob.map((server, i) =>{
    var ipaddr = Object.keys(server)[0] 
    var fromTime = format(dateStrings[0]._d, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
    var toTime = format(dateStrings[1]._d, "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
    getIndexFirst = server[ipaddr].timestamp.indexOf(fromTime)
    getIndexLast = server[ipaddr].timestamp.indexOf(toTime) + 1
    
    return {[ipaddr]: {
      name: server[ipaddr].name,
      description: server[ipaddr].description,
      cpu: server[ipaddr].cpu.slice(getIndexFirst, getIndexLast),
      ram: server[ipaddr].ram.slice(getIndexFirst, getIndexLast),
      timestamp: server[ipaddr].timestamp.slice(getIndexFirst, getIndexLast),
      bit_rate_in: server[ipaddr].bit_rate_in.slice(getIndexFirst, getIndexLast),
      bit_rate_out: server[ipaddr].bit_rate_out.slice(getIndexFirst, getIndexLast),
      packet_rate_in: server[ipaddr].packet_rate_in.slice(getIndexFirst, getIndexLast),
      packet_rate_out: server[ipaddr].packet_rate_out.slice(getIndexFirst, getIndexLast),
      tcp_established: server[ipaddr].tcp_established.slice(getIndexFirst, getIndexLast),
    }}
    })
      return tempData
  }

  const Filterer = (Servers, data) => {
    var Ips  = []
    Servers.forEach((data) => { var globalKey = data.ip; Ips.push(globalKey) })
    var result = data.filter(servers => Ips.includes(servers.info.ip))
      return result
    }


export {DateFormater, GlobalFirstLast, SetPostValues, StatusSign, SetTempData, every_nth, SetTempDataRange, Filterer}



