import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";

export default function ProductsList({ categoryId }) {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(1);
  const limit = 12;

  const sentinelRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: { page: pageRef.current, limit, categoryId },
      });

      const newItems = res.data.data || [];
      setProducts((prev) => [...prev, ...newItems]);
      setHasMore(res.data.hasMore);
      pageRef.current += 1;
    } catch (err) {
      console.error("API error", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, categoryId]);

  useEffect(() => {
    // reset khi đổi category
    setProducts([]);
    pageRef.current = 1;
    setHasMore(true);
    fetchProducts();
  }, [categoryId, fetchProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchProducts();
      },
      { threshold: 1 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [fetchProducts]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 8 }}>
            <img
              src={p.image || "https://via.placeholder.com/200"}
              alt={p.name}
              style={{ width: "100%", height: 150, objectFit: "cover" }}
            />
            <h4>{p.name}</h4>
            <p>{Number(p.price).toLocaleString()} VND</p>
          </div>
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 20 }} />

      {loading && <p style={{ textAlign: "center" }}>Đang tải...</p>}
      {!hasMore && <p style={{ textAlign: "center" }}>Hết sản phẩm</p>}
    </div>
  );
}
