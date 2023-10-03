'use strict';

const API_URL = 'http://localhost:3001/api' ;

async function logIn(credentials) {

    let response = await fetch(API_URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
        })

        if (response.ok) {
            return await response.json();
        }
        else {
            const errDetail = await response.json();
            throw errDetail.error;
        }

}

async function logOut() {
    await fetch(API_URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    })
}

async function getTitle() {

    let response = await fetch(API_URL + '/title', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (response.ok){
        return response.json()
    }
    else
    {
        const errDetail = await response.json();
        throw errDetail.error;
    }

}

async function updateTitle(newTitle) {


    let response = await fetch(API_URL + '/title', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
body: JSON.stringify({newTitle: newTitle})
    })

    if (response.ok){
        return await response.json()
    }
    else
    {
        const errDetail = await response.json()
        throw errDetail.error
    }

}

async function getPages() {

        let response = await fetch(API_URL + '/pages', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok){
            return response.json()
        }
        else
        {
            const errDetail = await response.json();
            throw errDetail.error;
        }

}

async function getPublishedPages() {

            let response = await fetch(API_URL + '/publishedPages', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok){
                return response.json()
            }
            else
            {
                const errDetail = await response.json();
                throw errDetail.error;
            }

}

async function createPage(page) {

    let response = await fetch(API_URL + '/pages', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(page)

    })

    if (response.ok){
        return response.json()
    }
    else
    {
        const errDetail = await response.json()
        throw errDetail.error
    }

}

async function getPage(id) {
    let response = await fetch(API_URL + '/pages/' + id, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }

    })

    if (response.ok){

        return response.json()

    }
    else
    {
        const errDetail = await response.json()
        throw errDetail.error
    }
}



async function updatePage(page) {

    let response = await fetch(API_URL + '/pages/' + page.id, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(page)
    })

    if (response.ok){
        return response.json()
    }
    else
    {
        const errDetail = await response.json()
        throw errDetail.error
    }
}

async function deletePage(id) {

    let response = await fetch(API_URL+ /pages/ + id, {
        method: 'DELETE',
        credentials: 'include',
        headers:{
            'Content-Type': 'application/json',

        }

    })

    if (response.ok){
        return response.json()
    }
    else
    {
        const errDetail = await response.json()
        throw errDetail.error
    }

}

async function getUsers() {

    let response = await fetch(API_URL + '/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (response.ok){
        return response.json()
    }
    else
    {
        const errDetail = await response.json()
        throw errDetail.error
    }

}

async function getUserInfo() {

    let response = await fetch(API_URL + '/sessions/current', {
        credentials: 'include'
    })

    if (response.ok){
        return response.json()
    }
    else
    {
        const errDetail = await response.json()
        throw errDetail.error
    }

}



const API = {logIn, logOut, getTitle, updateTitle, getPages, getPublishedPages,
        deletePage, createPage, getPage, getUsers, updatePage, getUserInfo}
// eslint-disable-next-line react-refresh/only-export-components
export default API