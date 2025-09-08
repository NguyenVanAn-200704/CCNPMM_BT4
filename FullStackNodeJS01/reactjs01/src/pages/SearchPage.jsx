import { useEffect, useState } from "react";
import { Input, Select, Button, Slider, Checkbox, Spin } from "antd";
import api from "../api/axios";

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // filter state
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [sortBy, setSortBy] = useState(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // load categories
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // gọi API search (dùng chung cho search + lazy load)
  const fetchProducts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const res = await api.get("/products/search", {
        params: {
          q,
          categoryId,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          hasDiscount,
          sortBy,
          page: reset ? 1 : page,
          limit: 8,
        },
      });

      if (reset) {
        setProducts(res.data.data);
      } else {
        setProducts((prev) => [...prev, ...res.data.data]);
      }

      setHasMore(res.data.hasMore);
      setPage(res.data.page + 1);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  // handler search mới
  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    fetchProducts(true);
  };

  // scroll event để lazy load
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        fetchProducts();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, hasMore, loading, q, categoryId, priceRange, hasDiscount, sortBy]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Tìm kiếm & Lọc sản phẩm</h2>

      <Input
        placeholder="Nhập tên sản phẩm..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: 200, marginRight: 10 }}
      />

      <Select
        placeholder="Chọn danh mục"
        allowClear
        style={{ width: 200, marginRight: 10 }}
        onChange={(value) => setCategoryId(value)}
      >
        {categories.map((c) => (
          <Select.Option key={c.id} value={c.id}>
            {c.name}
          </Select.Option>
        ))}
      </Select>

      <div style={{ margin: "10px 0", width: 300 }}>
        <span>Khoảng giá:</span>
        <Slider
          range
          min={0}
          max={2000000}
          step={50000}
          defaultValue={priceRange}
          onChange={(value) => setPriceRange(value)}
        />
      </div>

      <Checkbox checked={hasDiscount} onChange={(e) => setHasDiscount(e.target.checked)} style={{ marginRight: 10 }}>
        Có khuyến mãi
      </Checkbox>

      <Select
        placeholder="Sắp xếp"
        style={{ width: 180, marginRight: 10 }}
        onChange={(value) => setSortBy(value)}
        allowClear
      >
        <Select.Option value="price_asc">Giá ↑</Select.Option>
        <Select.Option value="price_desc">Giá ↓</Select.Option>
        <Select.Option value="views">Lượt xem</Select.Option>
      </Select>

      <Button type="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>

      {/* kết quả */}
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: 8,
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <img
              src={p.image || "https://via.placeholder.com/200"}
              alt={p.name}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                marginBottom: 8,
              }}
            />
            <h4>{p.name}</h4>
            <p>{Number(p.price).toLocaleString()} VND</p>
            {p.discount > 0 && <p>Giảm giá: {p.discount}%</p>}
            <p>Lượt xem: {p.views}</p>
          </div>
        ))}
      </div>

      {loading && <Spin style={{ marginTop: 20 }} />}
      {!hasMore && <p style={{ textAlign: "center" }}>Hết sản phẩm</p>}
    </div>
  );
}
