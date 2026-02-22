const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')

// json-server требует папку public
const publicDir = path.join(__dirname, 'public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir)

const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults({ static: false })

// CORS — разрешаем запросы с любого домена
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(middlewares)
app.use(router)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})
