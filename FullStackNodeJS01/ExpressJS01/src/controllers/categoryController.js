const Category = require("../models/Category");

async function getCategories(req, res) {
  try {
    const categories = await Category.findAll({ order: [["id", "ASC"]] });
    res.json(categories);
  } catch (err) {
    console.error("getCategories error", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getCategories };
