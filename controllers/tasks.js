const express = require('express')
const tasksRouter = require('express').Router()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect()
tasksRouter.use(express.json())

tasksRouter.get('/year/:year/quarter/:quarter', (req, res)=>{
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
    
  tasksRouter.get('/accountants/:acc_id', (req, res)=>{
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
  
  tasksRouter.get('/companies/:com_id', (req, res)=>{
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

  module.exports = tasksRouter
