import React from "react";
import { Menu } from 'antd';
import { HomeOutlined,
     AppstoreOutlined, 
     AreaChartOutlined, 
     PayCircleOutlined, 
     SettingOutlined,
     BarsOutlined,
    } from '@ant-design/icons';
const MenuList = () => {
    return( 
        <Menu theme="dark">
            <Menu.Item key="Home" icon={<HomeOutlined />}>
            Home
             </Menu.Item>
             <Menu.Item key="Activity" icon={<AppstoreOutlined />} >
             Acitivity
             </Menu.Item>
             <Menu.SubMenu key='subtasks' icon={<BarsOutlined/>} title='Tasks'>
            <Menu.Item key="task-1" >Task 1</Menu.Item>
            <Menu.Item key="task-2" >Task 2</Menu.Item>
             </Menu.SubMenu>
             <Menu.Item key="Progress" icon={<AreaChartOutlined />}>
             Progress
             </Menu.Item>
             <Menu.Item key="Payment" icon={<PayCircleOutlined />}>
             Payment
             </Menu.Item>
             <Menu.Item key="Settings" icon={<SettingOutlined />}>
             Settings
             </Menu.Item>
        </Menu>
    )
}

export default MenuList;