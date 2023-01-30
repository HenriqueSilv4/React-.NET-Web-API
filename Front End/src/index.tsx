import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'
import { BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom'
import { EditOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, MenuProps, theme } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const { Header, Content, Footer, Sider } = Layout;

root.render(
  <React.StrictMode>
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          items={[
            { label: <a href='/'>Início</a>, key: "/", icon: <HomeOutlined /> },
            {
              label: "Cadastro", key: "menuCadastro", icon: <EditOutlined />, children: [
                { label: <a href='/clientes'>Clientes</a>, key: "/clientes", icon: <UserOutlined /> }
              ]
            }
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: "white" }}>
          {carregarHeader()}
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: "100vh", background: "white" }}>
            <App />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  </React.StrictMode>
);

function carregarHeader()
{
  return(
    <span>Página Atual</span>
  )
}