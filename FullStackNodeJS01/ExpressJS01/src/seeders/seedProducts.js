const mongoose = require("mongoose");
const Category = require("../models/category");
const Product = require("../models/product");
const { elasticClient } = require("../config/elasticClient");

const MONGO_URI = "mongodb://localhost:27017/fullstack01";

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Tìm category Sneaker và Sandals
    const sneakersCategory = await Category.findOne({ name: "Sneakers" });
    const sandalsCategory = await Category.findOne({ name: "Sandals" });
    const bootsCategory = await Category.findOne({ name: "Boots" });

    if (!sneakersCategory || !sandalsCategory) {
      console.log("⚠️ Cần seed categories trước khi seed products!");
      process.exit(1);
    }

    // Xoá dữ liệu cũ
    await Product.deleteMany({});
    await elasticClient.indices.delete({ index: "products" }, { ignore: [404] }); // xoá index cũ
    await elasticClient.indices.create({ index: "products" }); // tạo index mới

    // Tạo 15 sản phẩm cho Sneakers
    const sneakersProducts = Array.from({ length: 15 }, (_, i) => ({
      name: `Sneaker ${i + 1}`,
      description: `Mẫu sneaker ${i + 1} thời trang`,
      price: 1000000 + i * 50000,
      imageUrl:
        "https://www.bing.com/th/id/OIP.vL8llPQDwKrkXGisNbc14wHaHa?w=210&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
      categoryId: sneakersCategory._id,
    }));

    // Tạo 15 sản phẩm cho Sandals
    const sandalsProducts = Array.from({ length: 15 }, (_, i) => ({
      name: `Sandal ${i + 1}`,
      description: `Mẫu sandal ${i + 1} mùa hè`,
      price: 500000 + i * 30000,
      imageUrl:
        "https://www.bing.com/th/id/OIP.FXscHoXJXTuPBShiUb6GqwHaFj?w=244&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
      categoryId: sandalsCategory._id,
    }));

    const bootsProducts = Array.from({ length: 15 }, (_, i) => ({
      name: `Boots ${i + 1}`,
      description: `Giày boots ${i + 1} da cao cổ`,
      price: 500000 + i * 30000,
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfT5P3qBQ5r4lF9sQs88pY9xhe4tlGz-p0jA&s",
      categoryId: bootsCategory._id,
    }));

    // Insert MongoDB
    const allProducts = await Product.insertMany([...sneakersProducts, ...sandalsProducts, ...bootsProducts]);

    // Index vào Elasticsearch
    for (const product of allProducts) {
      await elasticClient.index({
        index: "products",
        id: product._id.toString(),
        document: {
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId.toString(),
          imageUrl: product.imageUrl,
        },
      });
    }

    console.log("✅ Seed products + index Elasticsearch thành công!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi seed products:", err);
    process.exit(1);
  }
};

seedProducts();
