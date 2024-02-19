const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect()
usersRouter.use(express.json())

usersRouter.post('/', async (req, res)=> {
    const { username, password, acc_id, isAdmin } = req.body
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    connection.query(
        'INSERT INTO Users (username, password, acc_id, is_admin) VALUES (?, ?, ?, ?);',
        [username, passwordHash, acc_id, isAdmin], 
        function(err, result){
            if(err) throw err;
            console.log('Record inserted')
        }
    )

    res.send(username)
})

usersRouter.post('/login', async (req, res)=> {
    const { username, password } = req.body

    const query = 'SELECT id, username, password, is_admin FROM Users WHERE username = ?';
    connection.query(query, [username], (error, results, fields) => {
        if (error) {
            console.error('Error al autenticar al usuario:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            verifyPassword (user,password,res)

        } else {
            res.status(401).send('Usuario o contraseña inválidos')
        }
    })

})


const verifyPassword = async (user, password,res) => {
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password)

    if (!(passwordCorrect && user)) {
        res.status(401).send('Usuario o contraseña inválidos')
    } else {
        const userForToken = {
            id: user.id,
            username: user.username
        }
        const token = jwt.sign(userForToken, process.env.SECRET)
        res.status(200).send({
            username: user.username,
            isAdmin: user.is_admin,
            token
        })
    }
}

module.exports = usersRouter