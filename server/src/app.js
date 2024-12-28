// Import các thư viện cần thiết
const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const mongoSanitizer = require('express-mongo-sanitize')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
require('dotenv').config()

// Import các controller và utils
const globalErrorHandler = require('./utils/errorControllers')
const AppError = require('./utils/appError')

// Khởi tạo ứng dụng Express
const app = express()

// Cấu hình view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Cấu hình CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Chỉ cho phép một miền cụ thể
  methods: ['GET', 'POST'], // Chỉ cho phép các phương thức cụ thể
  allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ cho phép các header cụ thể
}

// Middleware
app.use(morgan('dev')) // Ghi log các request
app.use(helmet()) // Thiết lập các header bảo mật HTTP
app.use(compression()) // Nén phản hồi
app.use(cors(corsOptions)) // Cấu hình CORS

// Giới hạn số lượng request từ cùng một IP
const limiter = rateLimit({
  max: 100, // Giới hạn 100 request
  windowMs: 60 * 60 * 1000, // Trong khoảng thời gian 1 giờ
  message: 'Too many requests from this IP, please try again in an hour',
})
app.use('/api', limiter) // Áp dụng limiter cho các route bắt đầu bằng /api

// Body parser để đọc dữ liệu từ req.body
app.use(express.json({ limit: '10kb' })) // Xử lý request với Content-Type: application/json
app.use(express.urlencoded({ extended: true })) // Xử lý request với dạng url-encoded
app.use(cookieParser()) // Xử lý cookie

// Xử lý bảo mật dữ liệu
app.use(mongoSanitizer()) // Ngăn chặn NoSQL query injection
app.use(express.static(path.join(__dirname, 'public'))) // Phục vụ các tệp tĩnh
app.use(
  hpp({
    // Ngăn chặn parameter pollution
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
)

// Middleware để ghi lại thời gian request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// Khởi tạo cơ sở dữ liệu
require('./dbs/init.mongodb')
// Routes
const mainRoutes = require('./routers/index.route')
app.use('/api/v1', mainRoutes)

// Xử lý các route không tìm thấy
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

// Middleware xử lý lỗi
app.use(globalErrorHandler)

// Xuất ứng dụng
module.exports = app
