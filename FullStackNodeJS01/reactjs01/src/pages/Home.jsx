import { useEffect, useState } from "react";
import { Button, Select, message } from "antd";
import api from "../api/axios";
import ProductsList from "./ProductsList";

export default function Home() {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    api
      .get("/homepage")
      .then((res) => setData(res.data))
      .catch(() => message.error("Chưa đăng nhập hoặc token hết hạn"));

    // Lấy danh mục
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Trang chủ</h1>

      {data ? (
        <p>
          {data.message} – {data.email}
        </p>
      ) : (
        <p>Đang tải...</p>
      )}

      {/* Chọn danh mục */}
      <Select
        style={{ width: 200, marginBottom: 20 }}
        placeholder="Chọn danh mục"
        onChange={(value) => setCategoryId(value)}
      >
        {categories.map((c) => (
          <Select.Option key={c.id} value={c.id}>
            {c.name}
          </Select.Option>
        ))}
      </Select>

      {/* Danh sách sản phẩm */}
      {categoryId && <ProductsList categoryId={categoryId} />}

      <Button
        style={{ marginTop: 20 }}
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Đăng xuất
      </Button>
    </div>
  );
}
