import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from 'antd';
import {CheckboxInt} from '../App'
import {
  LineChartOutlined,
  SettingOutlined,
  ColumnWidthOutlined,
  ClusterOutlined,
} from '@ant-design/icons';



const Navbar = () => {

    const context = React.useContext(CheckboxInt)
    const { setStartStop } = context
  
  return (
      <div >
      <Menu className="headerr" theme="dark" mode="horizontal">
      <Menu.Item key="1" icon={<ClusterOutlined />} >
               <NavLink to="/dashboard">
                    Dashboard
              </NavLink>
          </Menu.Item>
        <Menu.Item  key="2" icon={<LineChartOutlined />}>
               <NavLink to="/current">
                    Current
              </NavLink>
          </Menu.Item>
        <Menu.Item  
        onClick={() => {setStartStop(false)}} key="3"   icon={ <ColumnWidthOutlined />}>
               <NavLink to="/range">
                    Range
              </NavLink>
        </Menu.Item>
        <Menu.Item onClick={() => {setStartStop(false)}} key="4"   icon={<SettingOutlined />}>
               <NavLink to="/settings">
                    Settings
              </NavLink>
          </Menu.Item>
          </Menu>
      </div>

  )
}
export default Navbar;