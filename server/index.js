'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const {check, validationResult} = require('express-validator');

const userDao = require("./user-dao");
const pagesDao = require("./pages-dao");

const dayjs = require('dayjs');
const dayjsLocaleIt= require('dayjs/locale/it')
dayjs.locale('it')
const customParseFormat = require('dayjs/plugin/customParseFormat')


//INITIALIZE EXPRESS
const app = new express();
const port = 3001;
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions)); //we use this to allow calls from the frontend to the backend

const session = require('express-session');
const passport = require('passport');
const {getTitle, updateTitle} = require("./title-dao");


const LocalStrategy = require('passport-local').Strategy;


app.use(session({
    secret: 'michiamoangelo',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());

app.use(passport.session());

app.use("/server/images", express.static('images'))

passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUser(username, password)
    if(!user)
        return callback(null, false, 'Incorrect username or password');

    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));
//Serialize and deserialize for user instance of the session to store it
passport.serializeUser(function(user, done) {

    done(null, user.id);
})

passport.deserializeUser(function(id, done) {


    userDao.getUserById(id).then((user) => {
        done(null, user);
    }).catch((err) => { return done(err); });
})



const answerDelay = 300;
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    console.log("not authenticated");
    return res.status(401).json({error: 'not authenticated'});
}

const isAdmin = (req, res, next) => {
    if(req.user.role==="Admin") {
        return next();
    }
    return res.status(401).json({error: 'not authenticated'});
}



//API CALLS

/*
*
* AUTHENTICATION
*
 */


//LOGIN

app.post('/api/sessions', check('username').isEmail().withMessage("Not a valid Email") ,function(req, res, next) {

    //Validate email first

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()[0].msg});
    }


    passport.authenticate('local', (err, user, info) => {
        if(err)
            return next(err);
        if(!user)
            return res.status(401).json(info);

        req.login(user, (err) => {
            if(err)
                return next(err);

            return res.json(req.user);
        })
    })(req, res, next);
})

//LOGOUT

app.delete('/api/sessions/current', isLoggedIn, (req, res) => {

    req.logout( () => { res.end(); });

})

app.get('/api/sessions/current' , (req, res) => {
    if(req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({error: 'Unauthenticated user!'});
})

/*
*
* Title APIS
*
 */

app.get('/api/title',(req, res, next) => {

        getTitle().then((title) => {
            res.status(200).json(title)

        }).catch((err) => res.status(500).json({error: "Could not get title"}))
})

app.put('/api/title',isLoggedIn, isAdmin ,(req, res, next) => {

    const newTitle = req.body.newTitle;
    if(!newTitle)
        return res.status(400).json({error: "Error: no title provided"})

    updateTitle(newTitle).then(() => {
        res.status(200).json({title: newTitle})
        })
        .catch((err) => res.status(500).json({error: "Error updating title"}))

})


/*** pages apis ***/

//GET PAGES
app.get('/api/pages', isLoggedIn ,(req, res, next) => {
    pagesDao.getPages().then((pages) => {
        res.status(200).json(pages)
    }).catch((err) => res.status(500).json({error: "Could not get pages"}))


})

//GET PUBLISHED PAGES
app.get('/api/publishedPages',  (req, res, next) => {

    pagesDao.getPusblishedPages().then((pages) => {
        res.status(200).json(pages)
    }).catch((err) => res.status(500).json({error: "Could not get published pages"}))

})

//GET PAGE BY ID
app.get('/api/pages/:id',  (req, res, next) => {

        pagesDao.getPage(req.params.id).then((page) => {

            if((page.publishDate==="Invalid Date" || dayjs(page.publishDate, 'DD/MM/YYYY') > dayjs()) && !req.isAuthenticated())
                return res.status(401).json({error: "Page not published yet. To see it, please login"})

            pagesDao.getBlocks(page.id).then((blocks) => {
                res.status(200).json({...page, blocks: blocks})
            }).catch((err) => res.status(500).json({error: "Could not get blocks"}))

        }).catch((err) => res.status(500).json({error: "Could not get page"}))

})

//CREATE PAGE
app.post('/api/pages', isLoggedIn ,  (req, res, next) => {

    const pageToAdd = req.body;
    const blocks = pageToAdd.blocks;

    console.log(pageToAdd)
    console.log(blocks)

    if (!pageToAdd.title || !pageToAdd.author)
        return res.status(400).send({error: "You must provide a title and an author"})

    if (blocks.length < 2) {
        return res.status(400).send({error: "You must add at least 2 blocks"});
    } else {
        const types = blocks.map((block) => block.type);
        if (!types.includes("header")) {
            return res.status(400).send({error: "You must add at least 1 header"});
        } else if (!types.includes("paragraph") && !types.includes("image")) {
            return res.status(400).send({error: "You must add at least 1 paragraph or 1 image"});

        }
    }

    const blocksContent = blocks.map((block) => block.content);

    if (blocksContent.includes("")) {
        return res.status(400).send({error: "You must fill all the blocks"});

    }

    pagesDao.createPage(pageToAdd).then((addedPage) => {
        res.status(200).json(addedPage)
    }).catch((err) => res.status(500).json({error: "Could not add page"}))

})

//UPDATE PAGE

app.put('/api/pages/:id', isLoggedIn ,  (req, res, next) => {

    pagesDao.getPage(req.params.id).then((retrievedPage) =>
    { userDao.getUserByUsername(retrievedPage.author).then((retrievedUser) =>
        {

            const pageToUpdate = req.body;
            console.log(pageToUpdate)

            const id = req.params.id;
            const pageAuthorToCompare = retrievedPage.author;

            if (req.user.username !== pageAuthorToCompare && req.user.role !== "Admin") {
                res.status(401).json({error: "You are not authorized to update this page"});
                return;
            }

            const blocks = pageToUpdate.blocks;

            if (!pageToUpdate.title || !pageToUpdate.author)
                return res.status(400).json({error: "You must provide a title and an author"})


            if (blocks.length < 2) {
                res.status(400).json({error: "You must add at least 2 blocks"});
                return;
            } else {
                const types = blocks.map((block) => block.type);
                if (!types.includes("header")) {
                    return res.status(400).json({error: "You must add at least 1 header"});
                } else if (!types.includes("paragraph") && !types.includes("image")) {
                   return res.status(400).json({error: "You must add at least 1 paragraph or 1 image"});

                }
            }

            const blocksContent = blocks.map((block) => block.content);

            if (blocksContent.includes("")) {
                res.status(400).json({error: "You must fill all the blocks"});
                return;
            }

            pagesDao.updatePage(id, pageToUpdate).then((updatedPage) => {
                res.status(200).json(updatedPage)
            }).catch((err) => res.status(500).json({error: "Could not update"}))
        }).catch((err) => res.status(500).json({error: "Mismatched Author"}))
    }).catch((err) => res.status(500).json({error: "Could not get page"}))

})

//DELETE PAGE
app.delete('/api/pages/:id', isLoggedIn ,(req, res, next) => {

    pagesDao.getPage(req.params.id).then((retrievedPage) => {

        if (req.user.username !== retrievedPage.author && req.user.role!=="Admin") {
            res.status(401).json({error: "You are not authorized to delete this page"});
            return;
        }

        pagesDao.deletePage(req.params.id).then((message) => {
            res.status(200).json(message)
        }).catch((err) => res.status(500).json({error:"Could not delete"}))
    }).catch((err) => res.status(500).json({error: "Could not get page"}))

})


//*** USERS API ***

//GET USERS
app.get('/api/users', isLoggedIn ,async (req, res, next) => {

    userDao.getUsers().then((users) => {
        res.status(200).json(users)
    }).catch((err) =>
        res.status(500).json({error:"Could not get users"}))
})

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


