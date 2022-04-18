import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import 'chartjs-plugin-zoom';
import zoomPlugin from "chartjs-plugin-zoom";




Chart.register(zoomPlugin); // REGISTER PLUGIN

const TempGraf = () => {
  return (
    <div><Line  
    data={{
      labels: [1,2,3,4,5,6,7,8,8],
      datasets: [
        {
          title:' 192.168.0.101',
          label: '123',
          data: [10,20,30,40,50,60,70,80 ,10],
          fill: false,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)"
        }
      ]
    }
  }
    height= {500}
    width={2000}
    options= {{
        maintainAspectRatio: true,
        responsive: true,
        
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true // SET SCROOL ZOOM TO TRUE
              },
              mode: "xy",
              speed: 100
            },
            pan: {
              enabled: true,
              mode: "xy",
              speed: 100
            }
          }
        }
      }}
    className="templateGraf"
    /></div>
  )
}

export default TempGraf