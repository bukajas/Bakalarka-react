import React from 'react'
import {format, isBefore} from 'date-fns'

const SetPostValues = (type, globalDates) => {
    var postValues

          if(type == 'before'){ // = range, curent
            var tempInterval = {type: 'range', from:  format(globalDates[2], "yyyy-MM-dd kk:mm:ss"), to: format(globalDates[3], "yyyy-MM-dd kk:mm:ss")}
            if(isBefore(globalDates[2], globalDates[0])){
              postValues = tempInterval
            }
            else{ return null }
          }
          if(type == 'update'){
            postValues = {type: "update", last: format(globalDates[1], "yyyy-MM-dd kk:mm:ss")}
      }
  return postValues
}

export default SetPostValues