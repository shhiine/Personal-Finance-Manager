
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))

// Request parsing
app.use(express.json({ limit: '10kb' }))

// API rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200
}))

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Personal Finance Manager API is running',
    environment: process.env.NODE_ENV || 'development'
  })
})

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
