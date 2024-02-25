const express = require('express')
const rankingsRouter = require('express').Router()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect()
rankingsRouter.use(express.json())

rankingsRouter.get('/year/:year/quarter/:quarter', (req, res)=>{
    const year = Number(req.params.year)
    const quarter = Number(req.params.quarter)
    connection.query(
        `SELECT B.name, B.id, A.diff_time_total FROM
        (
          select accountant_id, sec_to_time(sum(time_to_sec(estimated_time)-time_to_sec(used_time))) as diff_time_total
          from Tasks as T
            LEFT JOIN
            Plans AS P ON
            P.id=T.plan_id
            where finish_date is not null and year=? and quarter=?
          group by accountant_id
        ) AS A
        LEFT JOIN Accountants AS B
        ON A. accountant_id=B.id
        order by A.diff_time_total desc;
        `,
        [year, quarter],
        function (err, rows, fields) {
          if(rows) {
            res.send(rows)
          } else {
            res.status(404).end()
          }
      })
  })



  module.exports = rankingsRouter
