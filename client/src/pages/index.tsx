import React from 'react'
import { Layout, Menu , Button } from 'antd'

const { Header, Content, Footer } = Layout;


export default () => {
    return <Layout className="layout">
        <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item key="1">项目管理</Menu.Item>
                <Menu.Item key="2">资源开发</Menu.Item>
            </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
            <div className="site-layout-content"><Button type="primary">hello</Button></div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
}