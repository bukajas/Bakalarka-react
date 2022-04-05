import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)




const Graph = (props) => {
  const [hodnoty, setHodnoty] = React.useState(null)
  //console.log(hodnoty)
  const [list, setList] = React.useState([0])
  const [timeLabel, setTimeLabel] = React.useState([0])
  const [butClick, setButClick] = React.useState(0)
  const [ram, setRam] = React.useState([0])
  const [test, setTest] = React.useState([0])

  

  var today = new Date(),
  time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    React.useEffect(() => {
      if(props.startStop) {
        const names = hodnoty ? hodnoty[0].values.map(character => {return character.cpu}) : console.log("hodnoty not yet")
        setTest(names)
        setHodnoty(props.data)
        //setList(prevListArray => [...list, props.data ? (hodnoty ? hodnoty[0].values[0].cpu : 0) : 1000] )
        //setTimeLabel(prevTimeArray => [...timeLabel, props.data ? (hodnoty ? hodnoty[0].values[0].timestamp : 0) : 1000] )
        //setRam(prevSetRam => [...ram, props.data ? (hodnoty ? hodnoty[0].values[0].ram : 0) : 1000])
        
        //console.log(list)
        //console.log(ram)
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


const datta = {
  labels: hodnoty ? hodnoty[props.butClick].values.map(character => {return character.timestamp.split(".")[0].split("T")[1]}) : test,
  datasets: [
    {
      label: "device 1",
      data: hodnoty ? hodnoty[props.butClick].values.map(character => {return character.cpu}) : test,
      fill: false,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },{
      label: "jedna device",
      data: hodnoty ? hodnoty[props.butClick].values.map(character => {return character.ram}) : test,
      fill: false,
      borderColor: "#742774",
      backgroundColor: "rgba(57,200,30,0.4)"
    }],
  };

  function butClick0() {
    setButClick(1)
    console.log(butClick)
    
  }
  function butClick1() {
    setButClick(0)
    console.log(butClick)
    
  }

  const ref = React.useRef(null);
  const downloadImage = React.useCallback(() => {
    var a = document.createElement('a');
    a.download = 'chart';
    a.href = ref.current.toBase64Image();
    a.click();
  }, []);


  // <button onClick={butClick0}>change to 1</button>
  // <button onClick={butClick1}>change to 0</button>
  return (
    <div className="graph">
        <button onClick={downloadImage}>Download</button>
        <Line  
          data={datta}
          height={500}
          width={2000}
          ref={ref}
          options= {{
            plugins: {
              title: {
                display: true,
                text: "Hey look at me!",
                font: {
                  size: 18
                }
              }
            }}}
        />
        
    </div>
  )
}

export default Graph