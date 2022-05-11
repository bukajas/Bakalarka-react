import React from "react"
import "antd/dist/antd.css";
import "../index.css";
import { Layout, Menu, Button, Row, Col} from 'antd';
import {
  DatabaseOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import {CheckboxInt} from './App'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from '../tempMulti/dashboard';
import Settings from '../tempMulti/settings';
import Navbar from '../tempMulti/navbar';
import 'chartjs-plugin-zoom';
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart } from 'chart.js'
import DataCurrent from './dataFormat/dataCurrent'
import DataRange from './dataFormat/dataRange'
import StatusSign from './functions/StatusSign'


Chart.register(zoomPlugin);



const { Header, Sider } = Layout;
const { SubMenu } = Menu;


const Template = () => {

  const valuesList2 = ['Cpu/Ram','Bit rate in','Bit rate out','Packet rate in','Packet rate out','Tcp established']

    const context = React.useContext(CheckboxInt)
    const { clickedServers, setClickedServers, dates, valuesList} = context

        function handleClickedServers(e) {
          setClickedServers(e.selectedKeys)
        };
      
        function selectAllValues(ip) {
            var filterClicked = clickedServers.filter((value) => {
                var tempString = value.split(" ")[0]
                return tempString !== ip
            })
            var tempClicked = [...filterClicked]
            valuesList.map((value) => {
                tempClicked.push(ip + " " + value)
            })
            setClickedServers(tempClicked)
        }

        function unSelectAllValues(ip) {
            var filterClicked = clickedServers.filter((value) => {
                var tempString = value.split(" ")[0]
                return tempString !== ip
            })
            setClickedServers(filterClicked)
        }


  return (
    <div>
      
<Layout>
  <Sider 
      style={{
        width: '1000px',
        height: '100vh',
        overflow: 'auto',
        position: 'fixed',
    }}>

      <div className="logo" ><ClusterOutlined />Monitoring webApp</div>
      <div className="servers" ><ClusterOutlined />List of servers </div>
        { dates.map((dattes) => { return (
          
          <Menu selectedKeys={clickedServers} onSelect={handleClickedServers} onDeselect={handleClickedServers} multiple={true} theme="dark" mode="inline">
            <SubMenu multiple={true} key={dattes.ip} icon={<DatabaseOutlined />} 
            title={<div>{dattes.ip} <StatusSign stat={dattes.status}/></div>} >

            <Row align="left">
              <Col xs={{ span: 7, offset: 5 }} lg={{ span: 8, offset: 3 }}>
              <Button ghost key={dattes.ip} className='but-menu' onClick={()=> selectAllValues(dattes.ip)}>All</Button>
              </Col>
              <Col xs={{ span: 7, offset: 5 }} lg={{ span: 8, offset: 3 }}>
                <Button ghost key={dattes.ip} className='but-menu' onClick={()=> unSelectAllValues(dattes.ip)}>None</Button>
              </Col>
          </Row>
              {valuesList.map((values, i) => {
                return <Menu.Item disabled={dattes.stat} key={dattes.ip +" "+ values}>{valuesList2[i]}</Menu.Item>})}
            </SubMenu>
          </Menu>
        )
        }
        )
        }
  
  </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Router>
          <Header className="header">
              <Navbar  className="header"/>
          </Header> 
          <div className='whole-content'>
             <Routes>
                <Route exact path='/' element={<Dashboard />} />
                <Route  path='/dashboard' element={<Dashboard/>} />
                <Route path='/current' element={<DataCurrent/>} />
                <Route path='/range' element={<DataRange/>} />
                <Route path='/settings' element={<Settings/>} />
              </Routes>
          </div>
             
        </Router>
      </Layout>
      
</Layout>

</div>

  )
}

export default Template