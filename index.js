require('dotenv').config()
const express = require('express')
const cors = require('cors')
const apiRouter = require('./controllers/api')
const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')

const port = process.env.PORT || 3001
const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.use('/api', apiRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})