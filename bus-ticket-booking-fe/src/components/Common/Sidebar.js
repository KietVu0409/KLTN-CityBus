import {
  BarChartOutlined,
  UserOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  DashboardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CarOutlined,
  IdcardOutlined,
  DollarCircleOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import store from "../../redux/store";
import logo from "../../assets/logo.jfif";
import CarRentalIcon from "@mui/icons-material/CarRental";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import Cookies from "js-cookie";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";

const { Title } = Typography;

const rootSubmenuKeys = ["subUser", "subDashboard", "subTicket", "subOrder"];

const Sidebar = (props) => {
  const [openKeys, setOpenKeys] = useState();
  const navigate = useNavigate();
  const isManager = Cookies.get("isManager");
  const getItem = (label, key, icon, children, type) => {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  };

  const getChildItem = (label, key) => {
    return {
      key,
      label,
    };
  };
  const items = [
    getItem("Tổng quan", "", <DashboardOutlined />),
    getItem("Đặt vé - Hóa đơn", "subOrder", <OrderedListOutlined />, [
      getChildItem("Đặt vé", "booking-trip"),
      getChildItem("Quản lý vé xe", "ticket-list"),
      getChildItem("Hóa đơn đặt vé", "order/order-list"),
      getChildItem("Hóa đơn hoàn vé", "order-refund/list"),
    ]),
    getItem("Bảng giá", "price-list", <IdcardOutlined />),
    getItem("Khuyến Mãi", "promotion", <DollarCircleOutlined />),

    getItem("Quản Lý Xe", "vehicle", <CarOutlined />),
    getItem("Quản Lý Bến Xe", "station", <CarRentalIcon />),
    getItem("Quản lý Tuyến Xe", "trip", <DepartureBoardIcon />),

    getItem(
      "Quản Lý Khách Hàng",
      "subUser",
      <UserOutlined />,
      [
        getChildItem("Khách hàng", "customer"),
        getChildItem("Nhóm khách hàng", "group-customer"),
      ],
      true
    ),
    isManager == "true"
      ? getItem("Quản lý Nhân Viên", "staff", <ContactEmergencyIcon />)
      : undefined,
    getItem("Thống kê", "subDashboard", <BarChartOutlined />, [
      getChildItem("Thống kê vé", "dashboard-ticket"),
      getChildItem("Thống kê khuyến mãi ", "dashboard-promotion"),
      getChildItem("Doanh số bán hàng", "dashboard-cost"),
    ]),
  ];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys?.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onSelect = (selected) => {
    navigate(`/admin/${selected.key}`);
  };

  const onClick = (selected) => {
    navigate(`/admin/${selected.key}`);
  };

  return (
    <>
      <div
        style={{
          background: "rgb(18, 10, 39)",
          minHeight: "16vh",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          items: "center",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: props.collapsed ? "50%" : "30%" }}
        />
        <span style={{ color: "white", fontWeight: "bold", fontSize: 25 }}>
          CITY Bus
        </span>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
        onSelect={onSelect}
        onClick={onClick}
        style={{
          minHeight: "84vh",
          overflow: "auto",
        }}
      />
    </>
  );
};

export default Sidebar;
