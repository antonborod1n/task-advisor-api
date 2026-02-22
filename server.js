import jsonServer from 'json-server'
import { mkdirSync } from 'fs'

// json-server требует папку public — создаём если нет
try { mkdirSync('./public') } catch {}

const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

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
