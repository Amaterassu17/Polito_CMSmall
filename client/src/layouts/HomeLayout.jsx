'use strict';


import {Navigation} from "./NavBar.jsx";
import {Outlet} from "react-router-dom";


function HomeLayout(props) {

    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;

    const user = props.user;



    return (
        <div>
            <Navigation loggedIn = {loggedIn} title = {props.title} setStateOffice = {props.setStateOffice} stateOffice = {props.stateOffice} user={user} setLoggedIn = {setLoggedIn} />
            <Outlet></Outlet>
        </div>
    )
}

export {HomeLayout}