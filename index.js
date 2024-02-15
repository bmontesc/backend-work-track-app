require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const port = process.env.PORT || 3001
const app = express()
const connection = mysql.createConnection(process.env.DATABASE_URL);

app.use(cors())
connection.connect()

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/accountants', (req, res) => {
  connection.query('SELECT * FROM Accountants', function (err, rows, fields) {
    if (err) throw err
    res.send(rows)
  })
})

app.get('/api/companies', (req, res) => {
  connection.query('SELECT * FROM Companies', function (err, rows, fields) {
    if (err) throw err
    res.send(rows)
  })
})

app.get('/api/plans', (req, res) => {
  connection.query('SELECT * FROM Plans', function (err, rows, fields) {
    if (err) throw err
    res.send(rows)
  })
})

app.get('/api/tasks', (req, res) => {
  connection.query('SELECT * FROM Tasks', function (err, rows, fields) {
    if (err) throw err
    res.send(rows)
  })
})

app.get('/api/accountants/:id', (req, res) => {
  const id = Number(req.params.id)
  connection.query('SELECT * FROM Accountants WHERE id = ?', [id], function (err, rows, fields) {
    if(rows) {
      res.send(rows)
    } else {
      res.status(404).end()
    }
  })
})

app.get('/api/companies/:id', (req, res) => {
  const id = Number(req.params.id)
  connection.query('SELECT * FROM Companies WHERE id = ?', [id], function (err, rows, fields) {
    if(rows) {
      res.send(rows)
    } else {
      res.status(404).end()
    }
  })
})

app.get('/api/plans/:id', (req, res) => {
  const id = Number(req.params.id)
  connection.query('SELECT * FROM Plans WHERE id = ?', [id], function (err, rows, fields) {
    if(rows) {
      res.send(rows)
    } else {
      res.status(404).end()
    }
  })
})

app.get('/api/tasks/year/:year/quarter/:quarter', (req, res)=>{
  const year = Number(req.params.year)
  const quarter = Number(req.params.quarter)
  connection.query(
    'SELECT T.id, T.plan_id, P.date, C.code, C.name, T.type, T.status, A.reference, T.estimated_time, T.used_time, T.finish_date FROM (SELECT * FROM Plans WHERE year=? AND quarter=?) AS P LEFT JOIN (SELECT * FROM Tasks) AS T ON T.plan_id=P.id LEFT JOIN (SELECT * FROM Accountants) AS A ON T.accountant_id=A.id LEFT JOIN (SELECT * FROM Companies) AS C ON P.company_id=C.id',
    [year, quarter],
    function (err, rows, fields) {
      if(rows) {
        res.send(rows)
      } else {
        res.status(404).end()
      }
    })
})
  
app.get('/api/tasks/accountants/:acc_id', (req, res)=>{
  const acc_id = Number(req.params.acc_id)
  connection.query(
    'SELECT T.id, P.date, C.code, C.name, T.type, T.status, A.reference, T.estimated_time, T.used_time, T.finish_date FROM (SELECT * FROM Tasks WHERE accountant_id=? ) AS T LEFT JOIN (SELECT * FROM Plans) AS P ON T.plan_id=P.id LEFT JOIN (SELECT * FROM Accountants) AS A ON T.accountant_id=A.id LEFT JOIN (SELECT * FROM Companies) AS C ON P.company_id=C.id',
    [acc_id],
    function (err, rows, fields) {
      if(rows) {
        res.send(rows)
      } else {
        res.status(404).end()
      }
    })
})

app.get('/api/tasks/companies/:com_id', (req, res)=>{
  const com_id = Number(req.params.com_id)
  connection.query(
    'SELECT T.id, P.date, C.code, C.name, T.type, T.status, A.reference, T.estimated_time, T.used_time, T.finish_date FROM (SELECT * FROM Plans WHERE company_id=? ) AS P LEFT JOIN (SELECT * FROM Tasks) AS T ON T.plan_id=P.id LEFT JOIN (SELECT * FROM Accountants) AS A ON T.accountant_id=A.id LEFT JOIN (SELECT * FROM Companies) AS C ON P.company_id=C.id',
    [com_id],
    function (err, rows, fields) {
      if(rows) {
        res.send(rows)
      } else {
        res.status(404).end()
      }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


