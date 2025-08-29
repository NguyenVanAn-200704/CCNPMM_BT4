import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const onFinish = async ({ newPassword }) => {
    setLoading(true);
    try {
      await api.post("/reset-password", { email, token, newPassword });
      message.success("Đổi mật khẩu thành công");
    } catch (err) {
      message.error(err.response?.data?.error || "Lỗi reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} style={{ maxWidth: 400, margin: "auto" }}>
      <Form.Item name="newPassword" rules={[{ required: true }]}>
        <Input.Password placeholder="Mật khẩu mới" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        Đổi mật khẩu
      </Button>
    </Form>
  );
}
