import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import "antd/dist/antd.css";
import "../index.css";
import { Layout, Menu, Breadcrumb, Spin, Button, Row, Col } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {CheckboxInt} from './App'
import { NavLink } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Current from '../tempMulti/current';
import Range from '../tempMulti/range';
import Dashboard from '../tempMulti/dashboard';
import Settings from '../tempMulti/settings';
import Navbar from '../tempMulti/navbar';
import 'chartjs-plugin-zoom';
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart } from 'chart.js'
import DataCurrent from './dataFormat/dataCurrent'

Chart.register(zoomPlugin); // REGISTER PLUGIN



const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 2 }} spin />;




const StatusColor = (props) => {
  if(props.stat == true)
  return <p className="statusDotGreen"></p>
  if (props.stat == false) {
    return <p className="statusDotRed"></p>
  }

}




const Template = ({children}) => {


  const valuesList2 = ['Cpu/Ram','Bit rate in','Bit rate out','Packet rate in','Packet rate out','Tcp established']

    const context = React.useContext(CheckboxInt)
    const { tempData, clickedServers, setClickedServers,
        dates, setDates,
        valuesList, setValuesList} = context

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
        overflow: 'auto',
        height: '100vh',
        width: '1000px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
    }}>
      <div className="logo" />
        { dates.map((dattes) => { return (
          
          <Menu selectedKeys={clickedServers} onSelect={handleClickedServers} onDeselect={handleClickedServers} multiple={true} theme="dark" mode="inline">
            <SubMenu disabled={false} multiple={true} key={dattes.ip} icon={<UserOutlined />} title={<p>{dattes.ip} <StatusColor stat={dattes.status}/></p>} >
            <Row align="middle">
    <Col xs={{ span: 7, offset: 5 }} lg={{ span: 6, offset: 5 }}>
    <Button key={dattes.ip} className='but-menu' onClick={()=> selectAllValues(dattes.ip)}>all</Button>
    </Col>
    <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
      <Button key={dattes.ip} className='but-menu' onClick={()=> unSelectAllValues(dattes.ip)}>none</Button>
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
              <Navbar />
          </Header> 
          <div>
              {tempData === null ? <h4>Empty oData</h4> : (
              tempData === 0 ? <h4>Server error</h4> : (
              <h5>Some oData was received from the server, see the console.</h5>))}
          </div>
              <Routes>
                <Route exact path='/' element={<Dashboard />} />
                <Route path='/dashboard' element={<Dashboard/>} />
                <Route path='/current' element={<DataCurrent/>} />
                <Route path='/settings' element={<Settings/>} />
                <Route path='/range' element={<Range/>} />
              </Routes>
        </Router>

      </Layout>
</Layout>

</div>

  )
}

export default Template