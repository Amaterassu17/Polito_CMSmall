'use strict';

const dayjs = require('dayjs');
const dayjsLocaleIt= require('dayjs/locale/it')
dayjs.locale('it')
const customParseFormat = require('dayjs/plugin/customParseFormat')


dayjs.extend(customParseFormat)

const sqlite = require('sqlite3');
const db = new sqlite.Database('db.db', (err) => {
    if (err) throw err;
})

exports.getPages = () => {

        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM pages'
            db.all(sql, (err, rows) => {
                if (err)
                    reject(err)
                else if (rows === undefined)
                    reject(err)
                else {
                    const pages = rows.map((r) => { return { id: r.id, title: r.title, author: r.author,creationDate: dayjs(r.creationDate, 'DD/MM/YYYY').format('DD/MM/YYYY') , publishDate: dayjs(r.publishDate, 'DD/MM/YYYY').format('DD/MM/YYYY')} })
                        .sort((a, b) => dayjs(b.creationDate, 'DD/MM/YYYY').isBefore(dayjs(a.creationDate, 'DD/MM/YYYY')) ? 1 : -1)

                    resolve(pages)
                }
            })

        })
}

exports.getPage = (id) => {

        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM pages WHERE id = ?'
            db.get(sql, [id], (err, row) => {
                if (err)
                    reject(err)
                else if (row === undefined)
                    reject(err)
                else {
                    const page = {id: row.id, title: row.title, author: row.author,creationDate: dayjs(row.creationDate, 'DD/MM/YYYY').format('DD/MM/YYYY'), publishDate: dayjs(row.publishDate, 'DD/MM/YYYY').format('DD/MM/YYYY')}

                    resolve(page)
                }
            })

        })
}

exports.getPusblishedPages = () => {

            return new Promise((resolve, reject) => {

                const sql = 'SELECT * FROM pages'
                db.all(sql, (err, rows) => {
                    if (err)
                        reject(err)
                    else if (rows === undefined)
                        reject(err)
                    else {
                        const pages = rows.map((r) => {


                            return { id: r.id, title: r.title, author: r.author,creationDate: dayjs(r.creationDate, 'DD/MM/YYYY').format('DD/MM/YYYY') , publishDate: dayjs(r.publishDate, 'DD/MM/YYYY').format('DD/MM/YYYY') } })
                            .filter((p) => {
                                return p.publishDate !== "Invalid Date" && (dayjs(p.publishDate, 'DD/MM/YYYY').isBefore(dayjs()) || dayjs(p.publishDate, 'DD/MM/YYYY').isSame(dayjs()))
                            })
                            .sort((a, b) => dayjs(b.publishDate, 'DD/MM/YYYY').isBefore(dayjs(a.publishDate, 'DD/MM/YYYY')) ? -1 : 1)
                        resolve(pages)
                    }
                })

            })
}

exports.deletePage = (id) => {


    return new Promise(async (resolve, reject) => {
        const sql1 = 'DELETE FROM blocks WHERE PageId = ?'
        await db.run(sql1, [id], async (err) => {
            if (err) {
                reject(err)
                return
            }
            const sql = 'DELETE FROM pages WHERE id = ?'
            await db.run(sql, [id], (err) => {
                if (err)
                    reject(err)
                else
                    resolve("Page deleted.")
            })
        })
    })
}


exports.createPage =  (page) => {
    return new Promise(async (resolve, reject) => {
        const sql = 'INSERT INTO pages(title, author, creationDate, publishDate) VALUES(?, ?, ?, ?)'
        let pageID = null

        let nowDate = dayjs().format('DD/MM/YYYY')
        let publishDate = dayjs(page.publishDate, 'DD/MM/YYYY').format('DD/MM/YYYY')

        await db.run(sql, [page.title, page.author, nowDate, publishDate], async function (err1) {
            if (err1)
                reject(err1)
            else
                pageID = this.lastID

            for (const block of page.blocks) {
                const sql1 = 'INSERT INTO blocks(Type, Content, relativePos, PageId) VALUES(?, ? , ? , ? )'
                await db.run(sql1, [block.type, block.content, block.relativePos, pageID], (err) => {

                    if (err)
                        reject(err)
                })

            }
            resolve(pageID)
        })



    })
}


exports.updatePage = (id,page) => {
    return new Promise(async (resolve, reject) => {

        const sql1 = 'DELETE FROM blocks WHERE PageId = ?'
        await db.run(sql1, [id], async (err) => {
            if (err) {
                reject(err)
                return
            }
            const sql2 = 'UPDATE pages SET title = ?, author = ?, creationDate = ?, publishDate = ? WHERE id = ?'
                // const sql3 = 'INSERT INTO pages(id, title, author, creationDate, publishDate) VALUES(?,?, ?, ?, ?)'

                // await db.run(sql3, [id, page.title, page.author, page, dayjs(page.publishDate, 'DD/MM/YYYY').format('DD/MM/YYYY')], async function (err1) {
                await db.run(sql2, [page.title, page.author, dayjs(page.creationDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),dayjs(page.publishDate, 'DD/MM/YYYY').format('DD/MM/YYYY'), id], async function (err1) {
                    if (err1)
                        reject(err1)

                    for (const block of page.blocks) {
                        const sql4 = 'INSERT INTO blocks(Type, Content, relativePos, PageId) VALUES(?, ? , ? , ? )'
                        await db.run(sql4, [block.type, block.content, block.relativePos, id], (err) => {
                            if (err)
                                reject(err)
                        })

                    }
                    resolve(this.lastID)
                })


        })
    })
}

exports.getBlocks = (pageid) => {
    const sql = 'SELECT * FROM blocks WHERE PageId = ? ORDER BY relativePos ASC'
    return new Promise((resolve, reject) => {
        db.all(sql, [pageid], (err, rows) => {
            if (err)
                reject(err)
            else if (rows === undefined)
                reject(err)
            else {
                const blocks = rows.map((r) => { return { id: r.id, type: r.Type, content: r.Content, relPos: r.relativePos } })
                resolve(blocks)
            }
        })
    })

}

