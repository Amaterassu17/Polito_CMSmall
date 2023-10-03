'use strict'

//Useful to access the users


const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('db.db', (err) => {
    if(err) throw err;
})


exports.getUserById = (id) => {


    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM users WHERE id = ?'
        db.get(sql, [id], (err, row) => {

            if(err)
                reject(err)
            else if(row === undefined)
                reject(err)
            else {
                const user = {id: row.id, name: row.name, email: row.email, role: row.role, username: row.username}
                resolve(user)
            }

        })

    })
}

exports.getUserByUsername = (username) => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?'
        db.get(sql, [username], (err, row) => {
            if(err)
                reject(err)
            else if(row === undefined)
                resolve({error: 'User not found.'})
            else {
                const user = {id: row.id, name: row.name, email: row.email, role: row.role, username: row.username}
                resolve(user)
            }
        })
    })


}


exports.getUser = (email, password) => {


    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM users WHERE email = ?'
        db.get(sql, [email], (err, row) => {

            if (err) {reject(err)}
            else if(row === undefined) {resolve(false)}
            else {

                const user = {id: row.id, email: row.email, username: row.username, role: row.role}

                const hashedpasswordDB = row.hashedPassword;
                const salt = row.salt;
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {

                    if(err) reject(err)

                    const passwordHex = Buffer.from(hashedpasswordDB, 'hex')


                    if(!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
                        resolve(false)
                    } else {
                        resolve(user)
                    }

                })

            }
        })

    })

}

exports.getUsers = () => {

        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM users'
            db.all(sql, (err, rows) => {

                if(err)
                    reject(err)
                else if(rows === undefined)
                    resolve({error: 'Users not found.'})
                else {
                    const users = rows.map((r) => {return {id: r.id, username: r.username, email: r.email, role: r.role}})
                    resolve(users)
                }

            })

        })

}