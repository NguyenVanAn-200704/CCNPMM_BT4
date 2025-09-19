const Category = require("../models/category");

const getAllCategory = async () => {
  try {
    const categoryList = await Category.find();
    return categoryList;
  } catch (e) {
    throw new Error(`Lỗi khi lấy danh mục: ${e.message}`);
  }
};

module.exports = { getAllCategory };
