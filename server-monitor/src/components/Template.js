import React, {createContext} from "react"
import {Config} from '../config.js'
import Axios from 'axios'
import Overview from "./Overview.js"
import Grafy from "./Grafy.js"
import "antd/dist/antd.css";
import "../index.css";
import Temp3 from './Temp3'
import { Layout, Menu, Breadcrumb, Spin, Button } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Children } from "react/cjs/react.production.min"
import {CheckboxInt} from './App'


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 2 }} spin />;

const Template = ({children}) => {

    const context = React.useContext(CheckboxInt)
    const { data, setData,
        seconds, setSeconds,
        startStop, setStartStop,
        collapsed, setCollapsed,
        ipAdd, setIpAdd,
        objectKeys, setObjectKeys,
        clickedServers, setClickedServers,
        clickedValues, setClickedValues,
        timeInterval, setTimeInterval,
        valuesPost, setValuesPost, } = context


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

          function handleClick(){setStartStop(prevState => !prevState)}
  return (
    <div>
<Layout>
  <Header className="header">
    <div className="logo" />
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>

      <Menu.Item onClick={() => {setValuesPost('all'); }} key="1">Current</Menu.Item>
      <Menu.Item onClick={() => setValuesPost('range')} key="2">Time Interval</Menu.Item>
      <Menu.Item onClick={() => setValuesPost('times')} key="3">Settings</Menu.Item>
    </Menu>
  </Header>
  <Layout style={{ minHeight: '100vh' }}>
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>

        <Menu onClick={checkAllItems}
      multiple={true} selectedKeys theme="light" mode="inline">        
        <Menu.Item icon={<UserOutlined />} key="1" >check all servers</Menu.Item>
      </Menu>

      <Menu onClick={unCheckAllItems}
      multiple={true} selectedKeys theme="light" mode="inline">
        <Menu.Item icon={<UserOutlined />} key="101" >Uncheck all servers</Menu.Item>
      </Menu>
      
      <Menu selectedKeys={clickedServers} onSelect={handleClickedServers} onDeselect={handleClickedServers} multiple={true} theme="dark" mode="inline">
        <SubMenu multiple={true} key="sub1" icon={<UserOutlined />} title="Servers">

          {data ? ipAdd.map((nazev) => <Menu.Item key={nazev}>{nazev}</Menu.Item>) : <Menu.Item key="155"><Spin indicator={antIcon} /></Menu.Item>}
        </SubMenu>
      </Menu>


      <Menu onSelect={handleClickedValues} onDeselect={handleClickedValues} multiple={true} theme="dark" mode="inline">

        <SubMenu key="sub2" icon={<TeamOutlined />} title="Hodnoty">
            {data ? objectKeys.map((object_keys) => 
            <Menu.Item key={object_keys}>{object_keys}</Menu.Item>)
          : <Menu.Item key="156"><Spin indicator={antIcon} /></Menu.Item>}
        <Button onClick={() => setTimeInterval(20)}>20Second</Button>
        <Button onClick={() => setTimeInterval(60)}>60Second</Button>
        <Button onClick={() => setTimeInterval(120)}>2Mins</Button>
        <Button onClick={() => setTimeInterval(600)}>10Mins</Button>
        </SubMenu>

      </Menu>

    </Sider>
    <Layout className="site-layout">
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <div>
            {data === null ? <h4>Empty data</h4> : (
            data === 0 ? <h4>Server error</h4> : (
            <h5>Some data was received from the server, see the console.</h5>))}
        </div>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          {children}
        
        </div>
      </Content>
    </Layout>
  </Layout>
</Layout>
<div>Hello</div>
</div>

  )
}

export default Template