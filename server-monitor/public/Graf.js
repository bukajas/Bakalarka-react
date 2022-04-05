import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const Graf = (props) => {
  
  const datta = {
    labels: props.values.map(character => {return character.timestamp.split(".")[0].split("T")[1]}),
    datasets: [
      {
        title: "hello",
        label: "CPU",
        data: props.values.map(character => {return character.cpu}),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
      {
        label: "RAM",
        data: props.values.map(character => {return character.ram}),
        fill: false,
        borderColor: "#742774",
        backgroundColor: "rgba(57,200,30,0.4)"
      },
      {
        label: "packet rate",
        data: props.values.map(character => {return character.packet_rate_in}),
        fill: false,
        borderColor: "#742774",
        backgroundColor: "rgba(57,200,30,0.4)",
        yAxisID: 'y1'
      },
      {
        label: "Bit rate",
        data: props.values.map(character => {return character.bit_rate_in}),
        fill: false,
        borderColor: "#742774",
        backgroundColor: "rgba(57,200,30,0.4)",
        yAxisID: 'y1'
      }
    ]
  }

const options= {
          plugins: {
            title: {
              display: true,
              text: props.info.name,
                font: {
                  size: 18
                }
              }
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left',
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
          
                // grid line settings
                grid: {
                  drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
              },
            }
          }
    const ref = React.useRef(null);
    const downloadImage = React.useCallback(() => {
      var a = document.createElement('a');
      a.download = 'chart';
      a.href = ref.current.toBase64Image();
      a.click();
    }, []);


  return (
    <div className="graf">
        <p className="status">STATUS ON/OFF</p>
        <button onClick={downloadImage} className="btn-download">Download</button>
        <Line  
          data={datta}
          height={500}
          width={2000}
          options= {options}
          ref={ref}
        />
    </div>
  )
}

export default Graf
