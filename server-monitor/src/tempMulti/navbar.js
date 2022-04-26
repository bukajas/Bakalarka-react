import React from "react";
import { NavLink } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Spin, Button } from 'antd';
import {CheckboxInt} from '../components/App'




const Navbar = () => {

    const context = React.useContext(CheckboxInt)
    const { setValuesPost, setStartStop } = context

  
  return (
      <div>
      <Menu theme="light" mode="horizontal" >
      <Menu.Item  key="1">
               <NavLink to="/dashboard" activeStyle>
                    Dashboard
              </NavLink>
          </Menu.Item>
        <Menu.Item  onClick={() => {setValuesPost('all'); }} key="2">
               <NavLink to="/current" activeStyle>
                    Current
              </NavLink>
          </Menu.Item>
        <Menu.Item  
        onClick={() => {setValuesPost('range'); setStartStop(false)}} key="3">
               <NavLink to="/range" activeStyle>
                    Range
              </NavLink>
        </Menu.Item>
        <Menu.Item  
        onClick={() => {setValuesPost('update'); setStartStop(false)}} key="5">
Update
        </Menu.Item>    
        <Menu.Item onClick={() => {setValuesPost('range'); setStartStop(false)}} key="4">
               <NavLink to="/settings" activeStyle>
                    Settings
              </NavLink>
          </Menu.Item>
          </Menu>
      </div>

  );
};
export default Navbar;