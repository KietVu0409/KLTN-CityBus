import {
  ClockCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { AppBar, Button, Menu, Toolbar } from "@mui/material";
import { Avatar, Dropdown, Typography, notification } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import colorConfigs from "../../config/colorConfigs";
import sizeConfigs from "../../config/sizeConfigs";
import { AdminApi } from "../../utils/adminApi";
import Cookies from "js-cookie";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import customToast from "../ToastCustom";
import ArticleIcon from "@mui/icons-material/Article";
import { menu } from "../../data/menuData";
import ModalAlert from "../Modal";
import UserUpdatePassword from "./UpdatePassword";

const Topbar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState();
  const [routeName, setRouteName] = useState();
  const [open, setOpen] = useState(false);
  const [openChangePassModal, setOpenChangePassModal] = useState(false);
  const handleCloseModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    setInterval(() => {
      var today = new Date();
      const hour =
        today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
      const minute =
        today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
      const second =
        today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
      const date =
        today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      const month =
        today.getMonth() + 1 < 10
          ? "0" + (today.getMonth() + 1)
          : today.getMonth() + 1;
      const year = today.getFullYear();
      setTime(` ${hour}:${minute}:${second} , ${date} tháng ${month}, ${year}`);
    }, 1000);
  }, []);

  const onClickLogout = async () => {
    const adminApi = new AdminApi();
    try {
      const response = await adminApi.logout();
      navigate("/admin/login");
      Cookies.remove("access_token");
      customToast.success("Đăng xuất thành công");
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    const name = menu().find((route) => route.path === location?.pathname);
    setRouteName(name);
  }, [location?.pathname]);

  const handleOpenProfileModal = () => {
    setOpen(true);
  };
  const handleOpenChangePass = () => {
    setOpenChangePassModal(true);
  };
  const items = [
    {
      key: "1",
      label: (
        <a rel="noopener noreferrer" onClick={handleOpenProfileModal}>
          Thông tin tài khoản
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a rel="noopener noreferrer" onClick={handleOpenChangePass}>
          Đổi mật khẩu
        </a>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <a rel="noopener noreferrer" onClick={onClickLogout}>
          Đăng xuất
        </a>
      ),
    },
  ];
  return (
    <AppBar
      position="fixed"
      sx={{
        width: props.collapsed ? `calc(100% - 80px)` : `calc(100% - 245px)`,
        ml: sizeConfigs.sidebar.width,
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        marginLeft: 0,
        zIndex: 3,
        boxShadow: "unset",
      }}
    >
      <Toolbar
        style={{
          right: 20,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            variant="text"
            onClick={() => {
              props.setCollapsed(!props.collapsed);
            }}
            style={{ color: "#000" }}
          >
            {" "}
            {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>

          <a
            href="/admin"
            className="home-title"
            style={{
              textDecoration: "none",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Trang chủ
          </a>
          <ChevronRightIcon className="icon-right-header" />
          <a className="home-title" style={{ color: "#4D4D4D" }}>
            {routeName?.text || "Cài đặt"}
          </a>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ClockCircleOutlined style={{ marginRight: 7 }} />
          <Typography
            style={{
              textDecoration: "none",
              color: "#000",
              fontWeight: "bold",
              marginRight: 30,
            }}
          >
            {" "}
            {time}
          </Typography>
          <Typography
            style={{ fontWeight: "500", color: "#333", marginLeft: 20 }}
          >
            Xin chào,
            <span
              style={{
                backgroundColor: "#f26565",
                marginLeft: 5,
                color: "#ffffff",
                fontWeight: "bold",
                paddingLeft: 5,
                paddingRight: 5,
                paddingBottom: 2,
                border: "1px solid",
                borderRadius: 5,
              }}
            >
              {Cookies.get("fullName")}
            </span>
          </Typography>
          <Dropdown menu={{ items }} className="avata-profile">
            <Avatar
              style={{
                color: "#f56a00",
                backgroundColor: "#fde3cf",
                width: "35px",
                height: "35px",
                marginLeft: "10px",
              }}
              onClick={(e) => e.preventDefault()}
              src="https://joesch.moe/api/v1/random?key=1"
            ></Avatar>
          </Dropdown>
          <ModalAlert
            isButton={true}
            open={open}
            handleClose={() => handleCloseModal()}
            handleCancel={() => handleCloseModal()}
            handleConfirm={() => {}}
            title={"Thông tin tài khoản"}
            renderContentModal={
              <div style={{ flexDirection: "column", alignItems: "center" }}>
                <div
                  className="view-input-discount"
                  style={{ flexDirection: "column", alignItems: "flex-start" }}
                >
                  <div>
                    <span style={{ fontWeight: "500" }}>Mã: </span>
                    <span style={{ fontSize: "15px", color: "#666666" }}>
                      {Cookies.get("code")}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: "500" }}>Tên: </span>
                    <span style={{ fontSize: "15px", color: "#666666" }}>
                      {Cookies.get("fullName")}
                    </span>
                  </div>
                  <div>
                    <span>Email: </span>
                    <span style={{ fontSize: "15px", color: "#666666" }}>
                      {Cookies.get("email")}
                    </span>
                  </div>

                  <div>
                    <span>Số điện thoại: </span>
                    <span style={{ fontSize: "15px", color: "#666666" }}>
                      {Cookies.get("phone")}
                    </span>
                  </div>
                </div>
              </div>
            }
            type={"information"}
          />
        </div>
        <UserUpdatePassword
          openEditModal={openChangePassModal}
          setOpenEditModal={setOpenChangePassModal}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
