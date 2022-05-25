import React from 'react';
import GraphRange from "../graphs/GraphRange"
import { Chart, registerables } from 'chart.js'
import AngryJOe from '../AngryJOe'
import { CheckboxInt } from '../App'


Chart.register(...registerables)


const Range = (props) => {

    const context = React.useContext(CheckboxInt)
    const { clickedServers } = context

  return (
        <div>
        { clickedServers.length > 0 ? clickedServers.map((temp) => 

        props.rangeData ? props.rangeData.map((temp2) => {
          var ipaddr = Object.keys(temp2)

         
          if(ipaddr[0] === temp.split(" ")[0] && temp.split(" ")[1] === 'cpu_ram'){ 
            
            return <GraphRange  key={ipaddr+ temp.split(" ")[1]}
            cpuram={true} data1={temp} data2={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name} 
             />
          }
        if(ipaddr[0] === temp.split(" ")[0] && Object.keys(temp2[ipaddr]).slice(1).includes(temp.split(" ")[1]))
        {
          return <GraphRange key={ipaddr+ temp.split(" ")[1]}
          cpuram={false} dataInfo={temp} dataValue={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name}
          />
        }
      else{ return null }
    }  
  ) : <AngryJOe />
)   : <AngryJOe />
}
        </div>
  )
}
  
export default Range;