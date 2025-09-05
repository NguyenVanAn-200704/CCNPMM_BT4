const Product = require("../models/Product");

async function getProducts(req, res) {
  try {
    const categoryId = req.query.categoryId || null;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const offset = (page - 1) * limit;

    const where = {};
    if (categoryId) where.category_id = categoryId;

    const { rows, count } = await Product.findAndCountAll({
      where,
      offset,
      limit,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);
    const hasMore = page < totalPages;

    res.json({
      data: rows,
      page,
      limit,
      total: count,
      totalPages,
      hasMore,
    });
  } catch (err) {
    console.error("getProducts error", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getProducts };
