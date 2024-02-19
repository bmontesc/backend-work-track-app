const express = require('express')
const apiRouter = require('express').Router()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect()
apiRouter.use(express.json())

apiRouter.get('/accountants', (req, res) => {
    connection.query('SELECT * FROM Accountants', function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
  })
  
  apiRouter.get('/companies', (req, res) => {
    connection.query('SELECT * FROM Companies', function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
  })
  
  apiRouter.get('/plans', (req, res) => {
    connection.query('SELECT * FROM Plans', function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
  })
  
  apiRouter.get('/tasks', (req, res) => {
    connection.query('SELECT * FROM Tasks', function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
  })
  
  apiRouter.get('/accountants/:id', (req, res) => {
    const id = Number(req.params.id)
    connection.query('SELECT * FROM Accountants WHERE id = ?', [id], function (err, rows, fields) {
      if(rows) {
        res.send(rows)
      } else {
        res.status(404).end()
      }
    })
  })
  
  apiRouter.get('/companies/:id', (req, res) => {
    const id = Number(req.params.id)
    connection.query('SELECT * FROM Companies WHERE id = ?', [id], function (err, rows, fields) {
      if(rows) {
        res.send(rows)
      } else {
        res.status(404).end()
      }
    })
  })
  
  apiRouter.get('/plans/:id', (req, res) => {
    const id = Number(req.params.id)
    connection.query('SELECT * FROM Plans WHERE id = ?', [id], function (err, rows, fields) {
      if(rows) {
        res.send(rows)
      } else {
        res.status(404).end()
      }
    })
  })

  module.exports = apiRouter