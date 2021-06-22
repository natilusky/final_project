import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/errorMiddlware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running..')
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

app.use(notFound)

app.use(errorHandler)

app.get('/getUsers', (req, res) => {
  getUsers()
    .then((users) => {
      res.send(users)
    })
    .catch((e) => {
      res.send({ message: e })
    })
})

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

const getUsers = () => {
  return connectDB.select('*').from('userschema') //return a promiss
}

async function createTableProduct() {
  await connectDB.schema.createTable('product_schema', function (table) {
    table.increments('_id')
    table.string('name')
    table.string('image')
    table.string('description')
    table.string('brand')
    table.string('category')
    table.string('sub_category')
    table.float('price')
  })
  connectDB.destroy()
}

//createTableProduct()
//print()
//printUser()
