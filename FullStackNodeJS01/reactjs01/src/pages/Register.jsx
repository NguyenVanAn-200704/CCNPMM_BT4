import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../api/axios";

export default function Register() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post("/register", values);
      message.success("Đăng ký thành công! Hãy đăng nhập.");
    } catch (err) {
      message.error(err.response?.data?.error || "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} style={{ maxWidth: 400, margin: "auto" }}>
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input placeholder="Tên" />
      </Form.Item>
      <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Mật khẩu" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        Đăng ký
      </Button>
    </Form>
  );
}
