'use strict';


import {Button, Col, Container, Form, FormGroup, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import API from "../API.jsx";
import {useState} from "react";


function ChangeTitle(props){

    const navigator = useNavigate()
    const user = props.user
    const setIsTitleLoading = props.setIsTitleLoading;

    if(!user)
    {
        navigator("/error", {state: {errorMessage: "You are not logged in"}})
    }

    if(user.role!=="Admin")
    {
        navigator("/error", {state: {errorMessage: "You are not an admin"}})
    }

    const [title, setTitle] = useState("")
    const handleSubmit = (event) => {
        event.preventDefault();

        API.updateTitle(title).then(() =>{
            setIsTitleLoading(true)
            navigator(-1)
        }).catch((err) => {
            navigator("/error", {state: {errorMessage: err.toString()}})

        })

    }

    return(
        <Container className={"p-5 container-page-view rounded border"}>
                <Button variant={"dark"} onClick={() =>{
                    navigator("/backoffice")
                }}>Back</Button>


            <Row>

                <Col  className={"md-3"}>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup className={"mb-3"}>

                            <Form.Label>Title</Form.Label>
                            <Form.Control type={"text"} required={true} placeholder={"Title"} onChange={event => setTitle(event.target.value)}/>

                        </FormGroup>

                    <Row>
                        <Col>
                            <Button variant={"success"} type={"submit"}>Save</Button>
                        </Col>
                    </Row>

                    </Form>

                </Col>

            </Row>

        </Container>
    )

}

export {ChangeTitle}