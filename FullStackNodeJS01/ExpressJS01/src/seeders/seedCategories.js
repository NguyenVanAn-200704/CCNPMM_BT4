const mongoose = require('mongoose');
const Category = require('../models/category');

const MONGO_URI = 'mongodb://localhost:27017/fullstack01';

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await Category.deleteMany({});
    const categories = [
      { name: 'Sneakers', description: 'Giày sneaker thời trang' },
      { name: 'Boots', description: 'Giày boots da cao cổ' },
      { name: 'Sandals', description: 'Dép sandal mùa hè' },
      { name: 'Sports', description: 'Giày thể thao chuyên dụng' },
      { name: 'Formal', description: 'Giày tây, giày công sở' },
    ];

    await Category.insertMany(categories);

    console.log('Seed categories thành công!');
    process.exit(0);
  } catch (err) {
    console.error('Lỗi seed categories:', err);
    process.exit(1);
  }
};

seedCategories();
