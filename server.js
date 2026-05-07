const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')

// json-server требует папку public
const publicDir = path.join(__dirname, 'public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir)

const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults({ static: publicDir })

// CORS: список + любой поддомен task.ffox.site (и кастомный CORS_ORIGINS через env)
const ALLOWED_ORIGINS = (
  process.env.CORS_ORIGINS ||
  'https://task.ffox.site,https://www.task.ffox.site,http://localhost:3000,http://127.0.0.1:3000'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

function isAllowedOrigin(origin) {
  if (origin == null || origin === '') return true
  if (ALLOWED_ORIGINS.includes(origin)) return true
  try {
    const { protocol, hostname } = new URL(origin)
    if (protocol !== 'https:' && protocol !== 'http:') return false
    return hostname === 'task.ffox.site' || hostname.endsWith('.task.ffox.site')
  } catch {
    return false
  }
}

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*')
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With',
  )
  res.header('Vary', 'Origin')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
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
