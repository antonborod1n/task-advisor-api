const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')

// json-server требует папку public
const publicDir = path.join(__dirname, 'public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir)

const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults({ static: publicDir })

// CORS — разрешаем только с продакшн-домена и локальной разработки
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://task.ffox.site,http://localhost:3000').split(',')

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*')
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// Health check endpoint для Railway
app.get('/health', (req, res) => res.sendStatus(200))

app.use(middlewares)
app.use(router)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})
