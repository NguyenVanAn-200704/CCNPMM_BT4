require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Kết nối DB
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
});

// Model Category
const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Model Product
const Product = sequelize.define("Product", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL(10, 2),
  image: DataTypes.STRING,
});

// Quan hệ
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

// Hàm seed
async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to DB");

    // Xóa và tạo lại bảng
    await sequelize.sync({ force: true });

    // Tạo categories
    const categories = await Category.bulkCreate([
      { name: "Sneakers" },
      { name: "Boots" },
      { name: "Sandals" },
      { name: "Running" },
      { name: "Casual" },
    ]);

    // Hàm random
    function randomPrice(min, max) {
      return (Math.random() * (max - min) + min).toFixed(0);
    }

    const products = [];
    for (let i = 1; i <= 100; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      products.push({
        name: `Product ${i}`,
        description: `Mô tả sản phẩm số ${i}`,
        price: randomPrice(100000, 2000000),
        image: `/imgs/product${i}.jpg`,
        category_id: cat.id,
      });
    }

    await Product.bulkCreate(products);
    console.log("🎉 Seed thành công 100 sản phẩm!");

    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
    process.exit(1);
  }
}

seed();
