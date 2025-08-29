import { useContext, useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/login", values);
      login(res.data.token);
      message.success("Đăng nhập thành công");
      navigate("/home");
    } catch (err) {
      message.error(err.response?.data?.error || "Sai email hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} style={{ maxWidth: 400, margin: "auto" }}>
      <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Mật khẩu" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        Đăng nhập
      </Button>
    </Form>
  );
}
