import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import "antd/dist/antd.css";
import "../index.css";
import { Layout, Menu, Breadcrumb, Spin, Button } from 'antd';
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



const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 2 }} spin />;

const Template = ({children}) => {

    const context = React.useContext(CheckboxInt)
    const { oData, setoData,
        tempData,
        startStop, setStartStop,
        collapsed, setCollapsed,
        ipAdd, setIpAdd,
        clickedServers, setClickedServers,
        timeInterval, setTimeInterval,
        valuesPost, setValuesPost,
        dates, setDates,
        valuesList, setValuesList} = context
          
          
          function handleClickedServers(e) {
            console.log('click ', e);
            setClickedServers(e.selectedKeys)
          };


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


        { dates.map((dates) => { return (
          <Menu selectedKeys={clickedServers} onSelect={handleClickedServers} onDeselect={handleClickedServers} multiple={true} theme="dark" mode="inline">
            <SubMenu multiple={true} key={dates.ip} icon={<UserOutlined />} title={dates.ip}>
              {valuesList.map((values) => <Menu.Item key={dates.ip +" "+ values}>{values}</Menu.Item>)}
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
                <Route path='/current' element={<Current/>} />
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