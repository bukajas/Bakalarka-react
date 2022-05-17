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
    const { setValuesPost, setStartStop } = context
  
  return (
      <div >

      <Menu className="headerr" theme="dark" mode="horizontal">
      <Menu.Item onClick={() => {setValuesPost('current'); }} key="1" icon={<ClusterOutlined />} >
               <NavLink to="/dashboard" activeStyle >
                    Dashboard
              </NavLink>
          </Menu.Item>
        <Menu.Item  onClick={() => {setValuesPost('current'); }} key="2" icon={<LineChartOutlined />}>
               <NavLink to="/current" activeStyle>
                    Current
              </NavLink>
          </Menu.Item>
        <Menu.Item  
        onClick={() => {setValuesPost('rangee'); setStartStop(false)}} key="3"   icon={ <ColumnWidthOutlined />}>
               <NavLink to="/range" activeStyle>
                    Range
              </NavLink>
        </Menu.Item>
        <Menu.Item onClick={() => {setValuesPost('range'); setStartStop(false)}} key="4"   icon={<SettingOutlined />}>
               <NavLink to="/settings" activeStyle>
                    Settings
              </NavLink>
          </Menu.Item>
          </Menu>
      </div>

  )
}
export default Navbar;