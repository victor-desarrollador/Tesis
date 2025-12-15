import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import Order from "../models/orderModel.js";

// @desc    Get stats
// @route   GET /api/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const categoriesCount = await Category.countDocuments();
  const brandsCount = await Brand.countDocuments();
  const ordersCount = await Order.countDocuments();

  // Get total revenue from completed orders
  const revenueData = await Order.aggregate([
    { $match: { status: { $in: ["paid", "completed", "delivered"] } } },
    { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
  ]);
  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  // Get user roles distribution
  const roles = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  // Get category distribution
  const categoryData = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $group: {
        _id: "$categoryInfo.categoryType",
        count: { $sum: 1 },
      },
    },
  ]);

  // Get top 15 selling products
  const topProductsData = await Order.aggregate([
    { $match: { status: { $in: ["paid", "completed", "delivered"] } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 15 },
  ]);

  res.json({
    counts: {
      users: usersCount,
      products: productsCount,
      categories: categoriesCount,
      brands: brandsCount,
      orders: ordersCount,
      totalRevenue: totalRevenue,
    },
    roles: roles.map((role) => ({
      name: role._id,
      value: role.count,
    })),
    categories: categoryData.map((category) => ({
      name: category._id,
      value: category.count,
    })),
    topProducts: topProductsData.map((product) => ({
      name: product._id,
      value: product.totalSold,
    })),
  });
});

export { getStats };
