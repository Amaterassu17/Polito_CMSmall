'use strict';

import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from "../API.jsx";
import '../styles/NavBar.css'; // Import custom CSS file for styling

const Navigation = (props) => {
    const { loggedIn, user, title, stateOffice, setStateOffice, setLoggedIn } = props;
    const navigator = useNavigate();

    const handleLoginButton = (e) => {
        e.preventDefault();
        if (!loggedIn)
            navigator('/login');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const goToCurrentOfficeHome = (e) => {
        e.preventDefault();
        setStateOffice("front");
        navigator("/");
    };

    const switchOffice = () => {
        const newOffice = stateOffice === "front" ? "back" : "front";
        setStateOffice(newOffice);
        navigator(newOffice === "front" ? "/" : "/backoffice");
    };

    const handleLogout = () => {
        API.logOut()
            .then(() => {
                setLoggedIn(false);
                navigator("/");
                setStateOffice("front");
            })
            .catch((err) => {
                navigator("/error", {state: {errorMessage: err.toString()}})

            });
    };

    return (
        <Navbar bg="dark" variant="dark" className="justify-content-between align-items-center" sticky={"top"}>
            <Navbar.Brand className={"title"} onClick={goToCurrentOfficeHome}>{title}</Navbar.Brand>
            <Nav className="ml-md-auto">
                <Nav.Item>
                    <Nav.Link onClick={handleLoginButton}>
                        <i className="bi bi-person-circle icon-size">
                            {loggedIn ? (user ? ` Hi, ${user.username} (${user.role})` : " Please Login") : " Please Login"}
                        </i>
                    </Nav.Link>
                </Nav.Item>
                {loggedIn && (
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </Nav>

            {loggedIn && (
                <Form onSubmit={handleSubmit}>
                    <Button variant={"dark"} onClick={switchOffice}>
                        {stateOffice === "front" ? "BackOffice" : "FrontOffice"}
                    </Button>
                    {user.role==="Admin" && stateOffice==="back" && (
                        <Button variant={"dark"} onClick={() => navigator("/backoffice/changeTitle")}>
                            Change Title
                        </Button>
                    )}
                </Form>
            )}
        </Navbar>
    );
};

export { Navigation };
