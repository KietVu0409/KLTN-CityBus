import { CodeOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Typography, message } from "antd";
import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { AdminApi } from "../../../utils/adminApi";
import customToast from "../../../components/ToastCustom";

const { Title } = Typography;

const Forgot = () => {
  const phoneRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const navigate = useNavigate();
  const [loadings, setLoadings] = useState([]);
  const [flag1, setFlag1] = useState(true);
  const [flag2, setFlag2] = useState(false);
  const [flag3, setFlag3] = useState(false);
  const otpRef = useRef();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [OTP, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [expandForm, setExpandForm] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const regex = /^0/i;
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

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
  const handleCancel = () => {
    setFlag1(true);
    setFlag2(false);
  };
  const isEmail = (username) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(username);
  };

  const onFinish = async (values) => {
    try {
      console.log(values.phoneNumber);

      const adminApi = new AdminApi();
      const userName = values.phoneNumber;
      let response;
      if (isEmail(userName)) {
        response = await adminApi.sendOtp({
          oldEmail: userName,
        });
        setEmail(userName);
        setPhone("");
        setFlag1(false);
        setFlag2(true);
        // Thực hiện đăng nhập với email
      } else {
        // Thực hiện đăng nhập với số điện thoại
        console.log("sdt");
        response = await adminApi.sendOtp({
          phone: userName,
        });
        setPhone(userName);
        setEmail("");
        setFlag1(false);
        setFlag2(true);
      }
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  const requestOTP = async () => {};

  const verifyOTP = async (e) => {
    try {
      e.preventDefault();
      if (OTP === "" || OTP === null) {
        customToast.error("Bạn chưa nhập OTP");
        return;
      }
      const adminApi = new AdminApi();
      const res = await adminApi.activeAccount({
        phone: phone != "" ? phone : undefined,
        email: email != "" ? email : undefined,
        otp: OTP,
      });
      customToast.success("Xác thực thành công");
      setFlag1(false);
      setFlag2(false);
      setFlag3(true);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  const onFinishChangePass = async (values) => {
    if (!/^.{6,}$/.test(values.password)) {
      customToast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      passwordRef.current.focus();
      return;
    }

    if (values.password != values.repeat_password) {
      customToast.error("Mật khẩu không giống nhau");
      stopLoading(0);
      passwordRef.current.focus();
      return;
    }
    try {
      const adminApi = new AdminApi();
      const res = await adminApi.resetPassword({
        phone: phone != "" ? phone : undefined,
        email: email != "" ? email : undefined,
        newPassword: values.password,
        confirmNewPassword: values.repeat_password,
      });

      customToast.success("Lấy lại mật khẩu thành công");
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 1000); // Chờ 2 giây trước khi chuyển trang
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  return (
    <Row
      justify="space-around"
      align="middle"
      style={{
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Col
        span={8}
        xs={18}
        sm={14}
        md={10}
        lg={8}
        style={{
          backgroundColor: "white",
          padding: "50px",
          borderRadius: "10px",
        }}
      >
        <Helmet>
          <title> CITY BUS - Quên mật khẩu</title>
        </Helmet>
        <Title level={2} style={{ marginBottom: "20px" }}>
          {flag3 == true ? "Lấy lại mật khẩu" : "Quên mật khẩu"}
        </Title>
        <Form
          form={form}
          onSubmit={requestOTP}
          name="normal_register"
          className="register-form"
          onFinish={onFinish}
          style={{ display: flag1 ? "block" : "none" }}
        >
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email hoặc số điện thoại!",
              },
            ]}
          >
            <Input
              size="large"
              ref={phoneRef}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email hoặc số điện thoại"
              autoFocus
              id="phoneNumberInput"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              size="large"
              loading={loadings[0]}
            >
              Gửi mã OTP
            </Button>
          </Form.Item>
          <br></br>
          <p>
            <Link to="/admin/login">Đăng nhập ngay</Link>{" "}
          </p>
        </Form>
        <div id="recaptcha-container"></div>
        <form
          onSubmit={verifyOTP}
          name="otp"
          className="otp-form"
          initialValues={{
            remember: true,
          }}
          style={{ display: flag2 ? "block" : "none" }}
        >
          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã OTP!",
              },
            ]}
          >
            <p>Nhập mã OTP được gửi đến {phoneNumber}</p>
            <Input
              size="large"
              ref={otpRef}
              prefix={<CodeOutlined className="site-form-item-icon" />}
              placeholder="Nhập mã OTP"
              autoFocus
              id="otpInput"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
            />

            <Button
              type="secondary"
              className="register-form-button"
              size="large"
              loading={loadings[0]}
              onClick={handleCancel}
              style={{ marginRight: 10, marginTop: 10 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
              size="large"
              loading={loadings[0]}
            >
              Verify
            </Button>
          </Form.Item>
        </form>
        <Form
          form={form2}
          // onSubmit={requestOTP}
          name="normal_changePass"
          className="changePass-form"
          onFinish={onFinishChangePass}
          style={{ display: flag3 ? "block" : "none" }}
        >
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu mới"
            />
          </Form.Item>
          <Form.Item
            name="repeat_password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu!",
              },
            ]}
          >
            <Input.Password
              size="large"
              ref={passwordRef}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="changePass-form-button"
              size="large"
              loading={loadings[0]}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
          <br></br>
          <p>
            <Link to="/admin/login">Đăng nhập ngay</Link>{" "}
          </p>
        </Form>
      </Col>
    </Row>
  );
};

export default Forgot;
