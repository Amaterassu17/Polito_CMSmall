'use strict';

import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
// import API from "../API";
import {Alert, Button, ButtonGroup, Col, Container, Form, FormGroup, Row} from "react-bootstrap";
import API from "../API.jsx";

function LoginLayout(props) {

    const setLoggedIn = props.setLoggedIn;
    const setUser = props.setUser;


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigator = useNavigate()
    const [errorMessage, setErrorMessage] = useState("")

    const validateEmail = (email) => {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email.match(validRegex)) {
            return true;
        } else {
            return false;
        }
    }
    const handleSubmit = (e) => {

        e.preventDefault()

        if (!validateEmail(email)) {
            setErrorMessage("Invalid email")
        } else {

            API.logIn({username:email, password:password})
                .then((res) => {
                    setLoggedIn(true);
                    setUser(res)
                    navigator(-1);
                })
                .catch(e => {
                    setErrorMessage("Invalid credentials")
                });
        }
    }


    return (
        <Container className="p-3 align-items-center justify-content-center container-page-view rounded border">
            <Button variant="dark" onClick={() => { navigator(-1) }}>Back</Button>
            <Row className="mb-3">
                <Col className="below-nav">
                    {errorMessage!=="" && (
                        <Alert variant="danger" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>
                        )}
                    <Form className=" mb-0 form-padding" onSubmit={handleSubmit}>
                        <FormGroup className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" required placeholder="Email" onChange={event => setEmail(event.target.value)} />
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required placeholder="Insert your password here" onChange={event => setPassword(event.target.value)} />
                        </FormGroup>

                        <Container>
                            <Row className="justify-content-center align-content-center">
                                <Col md={12} >
                                    <ButtonGroup>
                                        <Button variant={"success"} type="submit">Login</Button>


                                    </ButtonGroup>
                                </Col>


                            </Row>
                        </Container>

                    </Form>
                </Col>
            </Row>
        </Container>

    )
}

export {LoginLayout}