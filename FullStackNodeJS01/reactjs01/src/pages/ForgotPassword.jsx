import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../api/axios";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email }) => {
    setLoading(true);
    try {
      const res = await api.post("/forgot-password", { email });
      message.success(`Liên kết reset: ${res.data.resetLink}`);
    } catch (err) {
      console.error(err); // log ra console để debug
      message.error("Lỗi gửi email reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} style={{ maxWidth: 400, margin: "auto" }}>
      <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        Gửi reset password
      </Button>
    </Form>
  );
}
