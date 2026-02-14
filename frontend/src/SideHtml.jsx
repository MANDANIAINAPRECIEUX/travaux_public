import React from "react";
import { Layout, layout } from 'antd';
import './Components/Sidebar.css';
import Logo from "./Components/Logo";
import MenuList from "./Components/MenuList";

const {Header, Sider} = Layout;
function SideHtml() {
    return (
        <>
        <Layout>
            <Sider className='sidebar'>
                <Logo />
                <MenuList />
            </Sider>
        </Layout>
        </>
    )
}

export default SideHtml;