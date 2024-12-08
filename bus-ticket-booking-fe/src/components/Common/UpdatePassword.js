import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, message } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { AdminApi } from "../../utils/adminApi";
import customToast from "../ToastCustom";

const UserUpdatePassword = ({
  openEditModal,
  setOpenEditModal,
  type,
  info,
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [form] = Form.useForm();
  const passwordRef = useRef();

  const showModal = () => {
    setOpenEditModal(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenEditModal(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpenEditModal(false);
  };

  useEffect(() => {
    const initData = {
      password: Cookies.get("password"),
    };
    // console.log("initData", initData);
    form.setFieldsValue(initData);
  }, []);

  useEffect(() => {
    if (!info) {
      // setUser(get_info_from_cookie());
    } else {
      // setUser(info);
    }
  }, [info]);

  const onFinish = async (values) => {
    if (!/^.{6,}$/.test(values.newPassword)) {
      customToast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      passwordRef.current.focus();
      return;
    }
    if (values.newPassword != values.confirmNewPassword) {
      customToast.error("Xác nhận mật khẩu mới không giống nhau");
      passwordRef.current.focus();
      return;
    }
    try {
      const adminApi = new AdminApi();
      const res = await adminApi.changePassword(form.getFieldsValue());
      customToast.success("Đổi mật khẩu thành công!");
      setOpenEditModal(false);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Modal
        open={openEditModal}
        title="Đổi mật khẩu"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        // footer={[
        //     <Button key="back" onClick={handleCancel}>
        //         Hủy
        //     </Button>,
        //     <Button key="submit" type="primary" loading={loading} onClick={updateUserInfo}>
        //         Lưu
        //     </Button>
        // ]}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
            name="oldPassword"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu cũ"
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
            ]}
            name="newPassword"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              ref={passwordRef}
              type="password"
              placeholder="Mật khẩu mới"
            />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu mới!",
              },
            ]}
            name="confirmNewPassword"
          >
            <Input.Password
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              prefix={<LockOutlined className="site-form-item-icon" />}
              ref={passwordRef}
            />
          </Form.Item>
          <Space style={{ marginLeft: 350 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};
export default UserUpdatePassword;
