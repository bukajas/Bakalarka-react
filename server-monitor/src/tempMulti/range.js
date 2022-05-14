import React from 'react';
import GraphRange from "../components/graphs/GraphRange"
import { Chart, registerables } from 'chart.js'
import AngryJOe from '../components/AngryJOe'
import { CheckboxInt } from '../components/App'


Chart.register(...registerables)


const Range = (props) => {

    const context = React.useContext(CheckboxInt)
    const { clickedServers} = context


  return (
        <div>
        { clickedServers.length > 0 ? clickedServers.map((temp) => 
        props.rangeData ? props.rangeData.map((temp2) => {
          var ipaddr = Object.keys(temp2)
          if(ipaddr == temp.split(" ")[0] && temp.split(" ")[1] == 'cpu_ram'){
            return <GraphRange  
            cpuram={true} data1={temp} data2={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name} 
             />
          }
        if(ipaddr == temp.split(" ")[0] && Object.keys(temp2[ipaddr]).slice(1).includes(temp.split(" ")[1]))
        {
          return <GraphRange 
          cpuram={false} data1={temp} data2={temp2} ipAddr={ipaddr} name={temp2[ipaddr].name}
          />
        }}  
  ) : <AngryJOe />
)   : <AngryJOe />
}
        </div>
  )
};
  
export default Range;