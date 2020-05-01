import React from 'react'
import { Layout, Menu , Row , Col } from 'antd'
import FileList from '../components/file-list'
import style from './index.module.less'

const { Header, Content, Footer } = Layout;

export default () => {
    return <Layout className="layout">
        <Header>
            <div className={ style.logo } />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item key="2">资源开发</Menu.Item>
                <Menu.Item key="1">项目管理</Menu.Item>
            </Menu>
        </Header>
        <Content className={ style.content }>
            <Row
                typeof="flex"
                className={ style.mainContainer }
            >
                <Col>
                    <FileList />
                </Col>
                <Col className={ style.middleArea }>
                    1
                </Col>
                <Col>
                    1
                </Col>
            </Row>
        </Content>
        <Footer className={ style.footer }>
            fe-helper-react版
        </Footer>
    </Layout>
}