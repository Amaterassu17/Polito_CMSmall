'use strict';

import 'bootstrap/dist/css/bootstrap.min.css'
// import { Col, Container, Row, Button, Form, Table} from 'react-bootstrap'
// import { useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom'
import dayjs from 'dayjs'

import {LoginLayout} from "./layouts/LoginLayout.jsx";
import {HomeLayout} from "./layouts/HomeLayout.jsx";
import {useEffect, useState} from "react";
import API from "./API.jsx";
import './styles/CardStyle.css'
import {FrontOffice} from "./layouts/FrontOffice.jsx";
import {PageView} from "./layouts/PageView.jsx";
import {BackOffice} from "./layouts/BackOffice.jsx";
import {AddAndEditPageLayout} from "./layouts/AddPageAndEdit.jsx";
import {ChangeTitle} from "./layouts/ChangeTitle.jsx";

import './styles/Background.css'
import {ErrorPage} from "./layouts/ErrorPage.jsx";

function App() {

    const [loggedIn, setLoggedIn] = useState(false)
    const [title, setTitle] = useState("CMS")
    const [stateOffice, setStateOffice] = useState("front")
    const [user, setUser] = useState(null)
    const [isTitleLoading, setIsTitleLoading] = useState(true)


    useEffect(() => {
        if(isTitleLoading) {
            API.getTitle()
                .then((title) => {

                    setTitle(title)
                    document.title = title
                    setIsTitleLoading(false)
                })
                .catch((err) => {
                    setTitle("CMS")
                    document.title = "CMS"
                    setIsTitleLoading(false)
                })
        }
    }, [isTitleLoading])


    useEffect(()=>{
        console.log("login useEffect")
      API.getUserInfo().then((user) =>{
         setUser(user)
         setLoggedIn(true)
      }).catch((err) => {
        setUser(null)
        setLoggedIn(false)
      })
    }, [loggedIn])


    return (
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<HomeLayout loggedIn = {loggedIn} title={title} setStateOffice = {setStateOffice} stateOffice = {stateOffice} user={user} setLoggedIn = {setLoggedIn} />} >
            <Route index path={'/'} element={<FrontOffice/>}></Route>
            <Route path={'/login'} element={(!loggedIn)? <LoginLayout  setLoggedIn={setLoggedIn} loggedIn={loggedIn} setUser ={setUser}/> : <></>}/>
            <Route path={'/page/:id'} element={<PageView/>}></Route>
            <Route path={'/backoffice'} element={<BackOffice user={user}/>}></Route>
            <Route path={'/backoffice/changeTitle'} element={<ChangeTitle setIsTitleLoading={setIsTitleLoading} user={user}/>}></Route>
            <Route path={'/backoffice/add'} element={<AddAndEditPageLayout user={user} mode ={"add"}/>}/>
            <Route path={'/backoffice/edit/:id'} element={<AddAndEditPageLayout user={user} mode ={"edit"} />}/>
            <Route path={'/error'} element={<ErrorPage setStateOffice={setStateOffice}/>}></Route>
            <Route path={'*'} element={<ErrorPage setStateOffice={setStateOffice}/>}></Route>
        </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
