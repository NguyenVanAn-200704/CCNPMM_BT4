import { useEffect, useState } from "react";
import { Button, message } from "antd";
import api from "../api/axios";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/homepage")
      .then((res) => setData(res.data))
      .catch(() => message.error("Chưa đăng nhập hoặc token hết hạn"));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>Trang chủ</h1>
      {data ? (
        <p>{data.message} – {data.email}</p>
      ) : (
        <p>Đang tải...</p>
      )}
      <Button onClick={() => { localStorage.removeItem("token"); window.location.href="/login"; }}>
        Đăng xuất
      </Button>
    </div>
  );
}
