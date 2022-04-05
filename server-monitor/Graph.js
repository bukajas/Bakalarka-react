import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)




const Graph = (props) => {
  const [list, setList] = React.useState([])
  const [timeLabel, setTimeLabel] = React.useState([])
  const [butClick, setButClick] = React.useState(true)


  var today = new Date(),
  time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

  
    var hodnoty = props.data
    if(hodnoty === undefined) {
      hodnoty = Object.assign({}, hodnoty2)
    } else {
      var hodnoty2 = Object.assign({}, hodnoty)
      
    }
    //console.log(hodnoty2)
    React.useEffect(() => {
      if(props.startStop) {
        setList(prevListArray => [...list, props.data ? hodnoty[0].values[0].cpu : Math.random()*100] )
        setTimeLabel(prevTimeArray => [...timeLabel, time] )
      }
    }, [props.seconds, butClick])
    
  
//   var data= {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//         label: '# of Votes',
//         data: [30, 19, 30, 5, 2, 3],
//         //data: list,
//         // backgroundColor: [
//         //     'rgba(255, 99, 132, 0.2)',
//         //     'rgba(54, 162, 235, 0.2)',
//         //     'rgba(255, 206, 86, 0.2)',
//         //     'rgba(75, 192, 192, 0.2)',
//         //     'rgba(153, 102, 255, 0.2)',
//         //     'rgba(255, 159, 64, 0.2)'
//         // ],
//         // borderColor: [
//         //     'rgba(255, 99, 132, 1)',
//         //     'rgba(54, 162, 235, 1)',
//         //     'rgba(255, 206, 86, 1)',
//         //     'rgba(75, 192, 192, 1)',
//         //     'rgba(153, 102, 255, 1)',
//         //     'rgba(255, 159, 64, 1)'
//         // ],
//         borderWidth: 1
//     }]
// }

// var options = {
//   maintainAspectRatio: false,
//   scales: {
//       y: {
//           beginAtZero: true
//       }
//   }
// }


const data = {
  labels: timeLabel,
  datasets: [
    {
      label: "CPU",
      data: list,
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },
    {
      label: "Second dataset",
      data: [33, 25, 35, 51, 54, 76],
      fill: true,
      borderColor: "#742774",
      backgroundColor: "rgba(57,200,30,0.4)"
    }
  ]
};

  function buttonCLick() {
    setButClick(prevButClick => ! prevButClick)
    console.log(butClick)

  }


  const ref = React.useRef(null);
  const downloadImage = React.useCallback(() => {
    const link = document.createElement("a");
    link.download = "charty.jpg";
    link.href = ref.current.toBase64Image();
    link.click();


  }, []);



  return (
    <div>
        <button onClick={downloadImage}>Download</button>
        <Line  
          data={data}
          height={500}
          width={2000}
          ref={ref}
        />
        
    </div>
  )
}

export default Graph