import React from 'react'

export const every_nth = (data, nth) => {
    var tempFilter = [...data]
    var tempFilterServer
    tempFilter.map((date, i) => {
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

export default every_nth