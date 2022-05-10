import React from 'react'
import {sub} from 'date-fns'
import DateFormater from './dateFormater'

const GlobalFirstLast = (data, secsToSub) => {
    
        var getGlobalFirst, getGlobalLast
        data.map((data, i) =>{
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

export default GlobalFirstLast