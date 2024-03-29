const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

//Get All Products => api/v1/products===================================================================================
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  //return next(new ErrorHandler("My Error", 400));  //Only to Test error toasts in front end
  const resPerPage = 10000; //Results Per Page
  const productsCount = await Product.countDocuments(); //Needed to Do Front-End Pagination (Show All Product Count)

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    //count: products.length,  //Not Need Anymore
    productsCount,
    products,
  });
});

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//Get Single Product Detail => api/v1/products/:id======================================================================
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//Create New Product => api/v1/admin/new ===============================================================================
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  console.log("New Product = ", req.body.product);
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Update Product => api/v1/admin/products/:id===========================================================================
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product => api/v1/products/:id=================================================================================
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product is Deleted",
  });
});
