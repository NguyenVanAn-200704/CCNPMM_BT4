const Product = require("../models/product");
const { elasticClient } = require("../config/elasticClient");
// Tạo sản phẩm
const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

// Lấy tất cả sản phẩm (có filter theo category, phân trang / lazy load)
const getProducts = async ({ categoryId, page = 1, limit = 10, q }) => {
  const skip = (page - 1) * limit;

  const queryBody = {
    from: skip,
    size: limit,
    query: {
      bool: {
        filter: categoryId ? [{ term: { categoryId } }] : [],
      },
    },
  };

  if (q) {
    const queryTerms = q.trim().split(/\s+/);
    queryBody.query.bool.must = queryTerms.map((term) => ({
      bool: {
        should: [
          { prefix: { name: term.toLowerCase() } },
          { fuzzy: { name: { value: term.toLowerCase(), fuzziness: "AUTO", prefix_length: 1 } } },
          { wildcard: { name: `*${term.toLowerCase()}*` } },
        ],
        minimum_should_match: 1,
      },
    }));
  } else {
    // Nếu không có q, chỉ cần match_all
    if (!queryBody.query.bool.must) {
      queryBody.query = { bool: queryBody.query.bool };
      queryBody.query.bool.must = [{ match_all: {} }];
    }
  }

  const result = await elasticClient.search({
    index: "products",
    ...queryBody,
  });

  const products = result.hits.hits.map((hit) => hit._source);

  return {
    products,
    total: result.hits.total.value,
    currentPage: page,
    totalPages: Math.ceil(result.hits.total.value / limit),
  };
};

// Lấy sản phẩm theo ID
const getProductById = async (id) => {
  return await Product.findById(id).lean();
};

// Cập nhật sản phẩm
const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
