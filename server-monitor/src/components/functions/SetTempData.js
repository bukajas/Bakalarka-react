import {format} from 'date-fns'

const SetTempData = (data, dates, secsToSub) => {
    var tempData = data.map((server, i)=> {
        var ipaddr = Object.keys(server)[0] 
        var fromTime = format(dates[2], "yyyy-MM-dd'T'kk:mm:ss.'000000+0200'")
        var ind
        if(server[ipaddr].timestamp.includes(fromTime)){
          ind = server[ipaddr].timestamp.indexOf(fromTime)
        }
        else{ ind = 0 - secsToSub }
        {return {[ipaddr]: {
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
        }}}
      })
      return tempData
}

export default SetTempData
