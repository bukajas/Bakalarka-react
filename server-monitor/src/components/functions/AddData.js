import {format, set, sub, isBefore} from 'date-fns'

export const AddData= (type, globalData, tempOBJ) => {


    //props - tempfetched data

//postvalues je typ a casovy usek
//type je rozliseni
//globalData jsou globalData

    let tempServer
    var tempGlobal = [...globalData]
    var globalIps  = []
    var fetchedIps = []
    tempGlobal.map((data) => { var globalKey = Object.keys(data)[0]; globalIps.push(globalKey) })
    tempOBJ.map((data) => { var fetchedKey = Object.keys(data)[0]; fetchedIps.push(fetchedKey) })
  
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
                    tempGlobal[globalIndex] = tempServer
                    console.log(tempGlobal[globalIndex][OBJIp])
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
                if(globalLength > 10000) {
                  var diference = globalLength - 10000
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
                  if(tempGlobal.length >= 1 && !(tempGlobal[0][Object.keys(tempGlobal[0])].timestamp.at(0) === datas[OBJIp].timestamp.at(0))){ //pokud uz tam neco je, ale pridam na zacatek null, aby vse bylo stejne dlouhe.
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
                    tempGlobal[tempGlobal.length] = {...datas}
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

   return tempGlobal
    }

export default AddData
