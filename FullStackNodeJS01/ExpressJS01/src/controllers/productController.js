async function searchProducts(req, res) {
  try {
    const { q, categoryId, minPrice, maxPrice, hasDiscount, sortBy } = req.query;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const offset = (page - 1) * limit;

    const where = {};

    if (q) where.name = { [Op.like]: `%${q}%` };
    if (categoryId) where.category_id = categoryId;
    if (minPrice && maxPrice) {
      where.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
      where.price = { [Op.gte]: minPrice };
    } else if (maxPrice) {
      where.price = { [Op.lte]: maxPrice };
    }
    if (hasDiscount === "true") where.discount = { [Op.gt]: 0 };

    let order = [["id", "ASC"]];
    if (sortBy === "price_asc") order = [["price", "ASC"]];
    if (sortBy === "price_desc") order = [["price", "DESC"]];
    if (sortBy === "views") order = [["views", "DESC"]];

    const { rows, count } = await Product.findAndCountAll({
      where,
      order,
      offset,
      limit,
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
    console.error("searchProducts error", err);
    res.status(500).json({ error: "Server error" });
  }
}
