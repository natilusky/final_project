import asyncHandler from 'express-async-handler'
import connectDB from '../config/db.js'


//@desc Fetch all products
//@route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const products = await connectDB.select('*').from('product_schema')
  res.json(products)
})


//@desc Fetch single products
//@route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await connectDB
    .select('*')
    .from('product_schema')
    .where({ _id: req.params.id })

  if (product[0]) {
    res.json(product[0])
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
})

export { getProducts, getProductById }
