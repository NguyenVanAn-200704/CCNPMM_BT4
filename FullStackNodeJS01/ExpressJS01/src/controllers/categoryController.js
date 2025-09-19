const { getAllCategory } = require('../services/categoryService');

const getCategory = async (req, res) => {
  try {
    const responseData = await getAllCategory();
    res.json(responseData);
  } catch (error) {
    console.error("Error get category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getCategory };
