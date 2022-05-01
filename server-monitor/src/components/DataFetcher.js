function getoDataUpdate () {
  var ipadr = Object.keys(tempData[0])
  var tempTime = tempData[0][ipadr].timestamp[tempData[0][ipadr].timestamp.length - 1].split(".")[0].replace("T", " ")

 // let postValues  = {type: "update", last: format(newTime, 'yyyy-MM-dd kk:mm:ss')}
  let postValues  = {type: "update", last: tempTime}

Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
.then((response) => 
  { 
    if (!response.data.error) 
    {
      if(response.data.data.length !== tempData.length) {
        console.log('nejede to')
        getoDataStart()
      }

       
      const tempOBJ = response.data.data.map((datas)=> {
        {return {[datas.info.ip]: {
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
         }}}
         })
         console.log(tempOBJ)

      serverStatus(response.data.data, 2)
       tempData.map((datas, i) => {
       response.data.data.map((datas2) => {
         var ipaddr = Object.keys(datas)
         var tempDataLen = datas[ipaddr].timestamp.length
         var arrayLength = tempOBJ[i][ipaddr].timestamp.length
         if(ipaddr == datas2.info.ip && tempOBJ[i]){
           var da = [...datas[ipaddr].timestamp, ...tempOBJ[i][ipaddr].timestamp]
           
        datas[ipaddr].cpu = [...datas[ipaddr].cpu, ...tempOBJ[i][ipaddr].cpu]
        datas[ipaddr].cpu = datas[ipaddr].cpu.slice(arrayLength)
        datas[ipaddr].ram = [...datas[ipaddr].ram, ...tempOBJ[i][ipaddr].ram]
        datas[ipaddr].ram = datas[ipaddr].ram.slice(arrayLength)
        datas[ipaddr].timestamp = [...datas[ipaddr].timestamp, ...tempOBJ[i][ipaddr].timestamp]
        datas[ipaddr].timestamp = datas[ipaddr].timestamp.slice(arrayLength)
        datas[ipaddr].bit_rate_in = [...datas[ipaddr].bit_rate_in, ...tempOBJ[i][ipaddr].bit_rate_in]
        datas[ipaddr].bit_rate_in = datas[ipaddr].bit_rate_in.slice(arrayLength)
        datas[ipaddr].bit_rate_out = [...datas[ipaddr].bit_rate_out, ...tempOBJ[i][ipaddr].bit_rate_out]
        datas[ipaddr].bit_rate_out = datas[ipaddr].bit_rate_out.slice(arrayLength)
        datas[ipaddr].packet_rate_in = [...datas[ipaddr].packet_rate_in, ...tempOBJ[i][ipaddr].packet_rate_in]
        datas[ipaddr].packet_rate_in = datas[ipaddr].packet_rate_in.slice(arrayLength)
        datas[ipaddr].packet_rate_out = [...datas[ipaddr].packet_rate_out, ...tempOBJ[i][ipaddr].packet_rate_out]
        datas[ipaddr].packet_rate_out = datas[ipaddr].packet_rate_out.slice(arrayLength)
        datas[ipaddr].tcp_established = [...datas[ipaddr].tcp_established, ...tempOBJ[i][ipaddr].tcp_established]
        datas[ipaddr].tcp_established = datas[ipaddr].tcp_established.slice(arrayLength)

          //  datas[ipaddr].cpu.shift()
          //  datas[ipaddr].cpu.push(datas2.values[0].cpu)
          // datas[ipaddr].ram.shift()
          // datas[ipaddr].ram.push(datas2.values[0].ram)
          // datas[ipaddr].timestamp.shift()
          // datas[ipaddr].timestamp.push(datas2.values[0].timestamp)
          // datas[ipaddr].bit_rate_in.shift()
          // datas[ipaddr].bit_rate_in.push(datas2.values[0].bit_rate_in)
          // datas[ipaddr].bit_rate_out.shift()
          // datas[ipaddr].bit_rate_out.push(datas2.values[0].bit_rate_out)
          // datas[ipaddr].packet_rate_in.shift()
          // datas[ipaddr].packet_rate_in.push(datas2.values[0].packet_rate_in)
          // datas[ipaddr].packet_rate_out.shift()
          // datas[ipaddr].packet_rate_out.push(datas2.values[0].packet_rate_out)
          // datas[ipaddr].tcp_established.shift()
          // datas[ipaddr].tcp_established.push(datas2.values[0].tcp_established)

         }})})} 
  else  
  {
    console.log('error') 
    setoData(0) 
    setTempData(0)  
  }})
.catch((error) =>{
  console.log("Server is unavailable")
  console.log(error)
  setTempData(0)
  setoData(0)
})}
