import React, { useEffect, useState } from "react";
import { getCategory, Category, getProductByCategory, getProtected} from "../../services/auth/authApi";
import "./HomePage.css";

interface User {
  name: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}


const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  // Thêm trạng thái để quản lý sắp xếp
  const [sortOptions, setSortOptions] = useState({
    priceIncrease: false,
    priceDecrease: false,
    newest: false,
  });
  // Kiểm tra menu-item nào đang được chọn
  const [selectedSort, setSelectedSort] = useState<string>(""); // Thêm state này

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  // Thêm trạng thái để quản lý việc mở/đóng của mỗi filter section
  const [sortByOpen, setSortByOpen] = useState<boolean>(false);
  const [productTypeOpen, setProductTypeOpen] = useState<boolean>(false);

  // Lấy thông tin user
  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const res = await getProtected();
        setUser(res.data);
      } catch (error) {
        console.error("Token invalid or expired:", error);
      }
    };
    fetchProtected();
  }, []);

  // Lấy danh mục khi mở menu
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data: Category[] = await getCategory();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  if (menuOpen && categories.length === 0) {
    fetchCategories();
  }
}, [menuOpen, categories.length]);


// Lấy sản phẩm theo categoryId, search, page và các tùy chọn sắp xếp
useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Gọi API với các tham số sắp xếp mới
      const res = await getProductByCategory({
        categoryId: selectedCategoryId || "",
        currentPage: page,
        limit: 10,
        q: search,
        priceIncrease: sortOptions.priceIncrease,
        priceDecrease: sortOptions.priceDecrease,
        newest: sortOptions.newest,
      });

      if (res.data.totalPages >= 1 && res.data.totalPages < res.data.currentPage)
        setPage(1);

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [selectedCategoryId, page, search, sortOptions]); // Thêm sortOptions vào dependency array

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h2>👋 Welcome {user ? user.name : "Guest"}</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Hamburger Menu */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </header>

      {/* Menu dropdown */}
      {menuOpen && (
        <div className="menu-dropdown">
          {/* SORT BY */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => setSortByOpen(!sortByOpen)}>
              SORT BY
              <span className="dropdown-icon">{sortByOpen ? '▲' : '▼'}</span>
            </div>
            {sortByOpen && (
              <>
                <div
                  className={`menu-item ${selectedSort === 'priceIncrease' ? 'active' : ''}`}
                  onClick={() => {
                    setSortOptions({ priceIncrease: true, priceDecrease: false, newest: false });
                    setSelectedSort('priceIncrease');
                    setMenuOpen(false);
                  }}
                >
                  GIÁ (THẤP - CAO)
                </div>
                <div
                  className={`menu-item ${selectedSort === 'newest' ? 'active' : ''}`}
                  onClick={() => {
                    setSortOptions({ priceIncrease: false, priceDecrease: false, newest: true });
                    setSelectedSort('newest');
                    setMenuOpen(false);
                  }}
                >
                  MỚI NHẤT TRƯỚC
                </div>
                <div
                  className={`menu-item ${selectedSort === 'priceDecrease' ? 'active' : ''}`}
                  onClick={() => {
                    setSortOptions({ priceIncrease: false, priceDecrease: true, newest: false });
                    setSelectedSort('priceDecrease');
                    setMenuOpen(false);
                  }}
                >
                  GIÁ (CAO - THẤP)
                </div>
                <div
                  className={`menu-item ${selectedSort === 'none' ? 'active' : ''}`}
                  onClick={() => {
                    setSortOptions({ priceIncrease: false, priceDecrease: false, newest: false });
                    setSelectedSort('none');
                    setMenuOpen(false);
                  }}
                >
                  HỦY SẮP XẾP
                </div>
              </>
            )}
          </div>

          {/* LOẠI SẢN PHẨM */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => setProductTypeOpen(!productTypeOpen)}>
              LOẠI SẢN PHẨM
              <span className="dropdown-icon">{productTypeOpen ? '▲' : '▼'}</span>
            </div>
            {productTypeOpen && (
              <>
                {categories.length === 0 ? (
                  <p>Đang tải danh mục...</p>
                ) : (
                  <>
                    <div
                      className={`menu-item ${selectedCategoryId === "" ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategoryId("");
                        setPage(1);
                        setMenuOpen(false);
                        setProductTypeOpen(false);
                      }}
                    >
                      Tất cả
                    </div>
                    {categories.map(cat => (
                      <div
                        key={cat._id}
                        className={`menu-item ${selectedCategoryId === cat._id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategoryId(cat._id);
                          setPage(1);
                          setMenuOpen(false);
                          setProductTypeOpen(false);
                        }}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}



      {/* Product Section */}
      <main className="product-section">
        {loading ? (
          <p className="loading">Đang tải sản phẩm...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <img
                  src={product.imageUrl || "data:image/png;base64,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"}
                  alt={product.name}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <span className="price">{product.price.toLocaleString("vi-VN")} VND</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>⬅ Trước</button>
          <span>Trang {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Sau ➡</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 YourApp. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
