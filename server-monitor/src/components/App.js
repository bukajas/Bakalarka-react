import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import Grafy from "./Grafy.js"
import "antd/dist/antd.css";
import "../index.css";
import { Layout, Menu, Breadcrumb, Spin, Button, Space  } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Template from "./Template.js"



export { CheckboxInt }


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 2 }} spin />;
const CheckboxInt = createContext()


const Hlavni = ({ children }) => {
  const [data, setData] = React.useState(null)
  const [valuesPost, setValuesPost] = React.useState('all')
  const [rangeValue, setRangeValue] = React.useState({
    from: "2021-02-01 01:00:00",
    to: "2021-02-01 01:00:00"
  })
  const [seconds, setSeconds] = React.useState(0)
  const [startStop, setStartStop] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)
  const [ipAdd, setIpAdd] = React.useState([])
  const [objectKeys, setObjectKeys] = React.useState([])
  const [clickedServers, setClickedServers] = React.useState([])
  const [clickedValues, setClickedValues] = React.useState([])
  


  return (<CheckboxInt.Provider value={{
        data, setData,
        seconds, setSeconds,
        startStop, setStartStop,
        collapsed, setCollapsed,
        ipAdd, setIpAdd,
        objectKeys, setObjectKeys,
        clickedServers, setClickedServers,
        clickedValues, setClickedValues,
        valuesPost, setValuesPost,
        rangeValue, setRangeValue }}>
      {children}</CheckboxInt.Provider>)
}

function Druhy({ children }) {
  const context = React.useContext(CheckboxInt)
  const { data, setData,
    seconds, setSeconds,
    startStop, setStartStop,
    collapsed, setCollapsed,
    ipAdd, setIpAdd,
    objectKeys, setObjectKeys,
    clickedServers, setClickedServers,
    clickedValues, setClickedValues,
    valuesPost, setValuesPost,
    rangeValue, setRangeValue } = context


  React.useEffect(() => {
    getData()    
  }, [])
  
  React.useEffect(() => 
  {
    if(startStop){
      getData()
    }
  }, [seconds])

  React.useEffect(() => 
  {
      getData()
  }, [valuesPost, rangeValue]) 
  
  React.useEffect(() => 
  {
    const interval = setInterval(() => {setSeconds(seconds => seconds + 1)}, 1000)
    return () => clearInterval(interval)
  }, [])
  
  function onCollapse() {
    setCollapsed(prevCollapsed => !prevCollapsed)
  };
  
  
  function handleClickedServers(e) {
    console.log('click ', e);
    setClickedServers(e.selectedKeys)
  };
  function handleClickedValues(e) {
    console.log('click ', e);
    setClickedValues(e.selectedKeys)
  };

  function checkAllItems() { 
    setClickedServers(ipAdd)
  }
  function unCheckAllItems() { 
    setClickedServers([])
  }
  // funkce pro získání naměřených dat ze serveru
  function getData () {
    let postValues = 'all'
    if(valuesPost == 'all'){
      postValues = {type: "all"}
    }
    else if(valuesPost == 'range'){
      postValues = {type: "range", from: rangeValue.from, to: rangeValue.to}
      console.log(postValues)
    }
    else if(valuesPost == 'times') {
      postValues = {type: "times", times: ["2021-02-01 01:00:00", "2021-02-01 01:00:02", "2021-02-01 03:03:00", "2021-02-01 01:55:55"]}
    }
    // možnosti:    // 1. získej všechny uložená data
    // 2. stáhni data z určitého období
    //{type: "range", from: "2022-04-05 17:43:00", to: "2021-04-05 17:44:00"}
    // 3. získej data z konkrétních časů (využitelné např. v případě nějaké chyby v předchozích přenosech)
    // {type: "times", times: ["2021-02-01 01:00:00", "2021-02-01 01:00:02", "2021-02-01 03:03:00", "2021-02-01 01:55:55"]}
    
      Axios.post( Config.server.getData, postValues, {headers: { 'Content-Type': 'application/json' }})
      .then((response) => 
      {
        if (!response.data.error)
        {
          setData(response.data.data)
         // setValuesPost(postValues.type)

        } else 
        {
          console.log(response.data.message)
          setData(0)
        }
      })
      .catch((error) => 
      {
        console.log("Server is unavailable")
        console.log(error)
        setData(0)
      })
    }

    if(data && ipAdd.length == 0){
      setIpAdd(data.map((device) => {return device.info.ip}))
      setObjectKeys(Object.keys(data[0].values[0]).slice(1))
     }

  return (
    <div>
      {children}
    </div>
  )
}
// function Utton({children}) {
//   const context = React.useContext(CheckboxInt)
//   const { setTestik } = context
//   return <button onClick={() => setTestik(state => !state)}>{children}</button>

// }




const App = () => {

  return(
    <div>
    <Hlavni>
      <Druhy>
        <Template>
        <Grafy/>
        </Template>
      </Druhy>
    </Hlavni>
    </div>
  )
}


export default App
