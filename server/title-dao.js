'use strict'

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.db', (err) => {
    if(err) throw err;
})

exports.getTitle = () =>{

    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM title'
        db.get(sql, (err, row) => {
          if(err)
            reject(err)
          else if(row === undefined)
            resolve({error: 'Title not found.'})
          else {
            const title =  row.Title

            resolve(title)
          }
        })

    })
}

exports.updateTitle = (newTitle) =>{
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE title SET title = ?'
        db.run(sql, [newTitle], (err) => {
        if(err)
            reject(err)
        else {
            resolve(newTitle)
        }        })
    })
}