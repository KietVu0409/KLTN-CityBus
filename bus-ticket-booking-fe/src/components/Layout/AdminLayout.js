import { Box, Toolbar } from "@mui/material";
import { notification } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import colorConfigs from "../../config/colorConfigs";
import sizeConfigs from "../../config/sizeConfigs";
import Sidebar from "../Common/Sidebar";
import Topbar from "../Common/Topbar";
import { Layout } from "antd";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AdminApi } from "../../utils/adminApi";

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const adminApi = new AdminApi();
  const handleAuthentication = async () => {
    const token = adminApi.get_token();
    if (token.access == null || token.refresh == null) {
      navigate("login");
      return;
    }
  };

  useEffect(() => {
    handleAuthentication();
  }, []);
  return (
    <Layout>
      <Sider
        width={245}
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: "100vh",
          overflow: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Sidebar />
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? 80 : 245 }}
      >
        <Header style={{ padding: 0 }}>
          <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            minHeight: 280,
            background: "#fff",
            padding: "16px",
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
