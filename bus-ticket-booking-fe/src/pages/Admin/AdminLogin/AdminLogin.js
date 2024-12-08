import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { Button, Form, Input } from "antd";
import { React, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import imgLogin from "../../../assets/imgLogin.png";
import customToast from "../../../components/ToastCustom";
import { AdminApi } from "../../../utils/adminApi";
import "./AdminLogin.scss";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [loadings, setLoadings] = useState([]);
  
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  };

  const stopLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };
  const isEmail = (username) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(username);
  };

  const onFinish = async (values) => {
    enterLoading(0);
    const adminApi = new AdminApi();
    const userName = values.username;
    
    try {
      let response;
      if (isEmail(userName)) {
        response = await adminApi.login({
          email: userName,
          password: values.password
        });
        // Thực hiện đăng nhập với email
      } else {
        // Thực hiện đăng nhập với số điện thoại
        console.log('sdt');
        response = await adminApi.login({
          phone: userName,
          password: values.password
        });
      }
      
      if (response.status == 200) {
        adminApi.save_token(response.data);
      }
      const info = await adminApi.profile();
      adminApi.save_info(info?.data?.data);
      navigate("/admin");
      customToast.success("Đăng nhập thành công");
    } catch (error) {
      customToast.error("Tên đăng nhập hoặc mật khẩu không đúng");
    } finally {
      stopLoading(0);
    }
  };
  return (
    <div>
      <Grid container>
        <Helmet>
          <title> CITY BUS - Đăng nhập</title>
        </Helmet>
        <Grid className="item-login" md={5.5} xs={24}>
          <div className="container">
            <div className="text-login">Đăng nhập</div>
            <div className="form-field">
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email hoặc số điện thoại!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    ref={emailRef}
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Nhập email hoặc số điện thoại!"
                    autoFocus
                    style={{ height: 50 }}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu!",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    ref={passwordRef}
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Nhập mật khẩu"
                    style={{ height: 50 }}
                  />
                </Form.Item>

                <Form.Item>
                  <div className="view-link">
                    <Link
                      to="/forgot-password"
                      style={{ color: "#00354e", fontSize: 16 }}
                    >
                      Quên mật khẩu ?
                    </Link>{" "}
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn-primary-hover btn-login"
                    size="large"
                    loading={loadings[0]}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Grid>
        <Grid md={6.5} className="item-content-right">
          <div className="container-right">
            <div className="text-welcome">Chào mừng bạn quay lại</div>
            <h5 className="text">Vui lòng đăng nhập để sử dụng hệ thống</h5>
            <div>
              <img src={imgLogin} alt="Image" className="image-right" />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
