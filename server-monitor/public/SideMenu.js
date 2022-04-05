import React from 'react'
import { Menu, Button } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined,  MenuUnfoldOutlined,  MenuFoldOutlined,  PieChartOutlined,  DesktopOutlined,  ContainerOutlined, } from '@ant-design/icons';


const { SubMenu } = Menu;



const SideMenu = () => {

  const [inlineCollapsed, setInlineCollapsed] = React.useState(true)

    function handleClick(e) {
        console.log('click', e)
    }

    function handleColapsed() {
      setInlineCollapsed(prevInlineCollapsed => !prevInlineCollapsed)
    }

  return (
    <div>
      
      <Button type="primary" onClick={handleColapsed} style={{ marginBottom: 16 }}>
          {React.createElement(inlineCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
      <Menu
        onClick={handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="vertical"
        inlineCollapsed={inlineCollapsed}
      >
            <SubMenu key="sub1" icon={<MailOutlined />} title="List of Servers">
            <Menu.ItemGroup key="g1" title="Servers">
                <Menu.Item key="1">Server 1</Menu.Item>
                <Menu.Item key="2">Server 2</Menu.Item>
            </Menu.ItemGroup>
            </SubMenu>
            <SubMenu key="sub2" icon={<AppstoreOutlined />} title="List of Values">
            <Menu.Item key="5">CPU</Menu.Item>
            <Menu.Item key="6">RAM</Menu.Item>
            <SubMenu key="sub3" title="Throughput">
                <Menu.Item key="7">IN</Menu.Item>
                <Menu.Item key="8">OUT</Menu.Item>
            </SubMenu>
            </SubMenu>
        </Menu>
      </div>
  )
}

export default SideMenu





