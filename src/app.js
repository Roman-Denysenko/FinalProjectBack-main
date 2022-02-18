const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const usersRouter = require('./routes/api/usersRouter')
const dashboardRouter = require('./routes/api/dashboardRouter')

const db = require('./db/index.js')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

require('./config/passport-config')

app.use('/api/user', usersRouter)
app.use('/api/dashboard', dashboardRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(err.status).json({ message: err.message })
})

const PORT = process.env.PORT || 3001

db.then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running. Use on port:${PORT}`)
  })
}).catch(err => {
  console.log(`Server not running. Error message: ${err.message}`)
})
