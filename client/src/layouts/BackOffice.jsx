'use strict';


import {Button, ButtonGroup, Col, Container, ListGroupItem, Row} from "react-bootstrap";
import Card from 'react-bootstrap/Card'
import {Link, useNavigate} from "react-router-dom";
import CardHeader from "react-bootstrap/CardHeader";
import {useEffect, useState} from "react";
import API from "../API.jsx";

const columnsPerRow= 4;
function BackOffice(props){

    const user = props.user
    const [pages, setPages] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        if(isLoading)
        {
            console.log("useEffect BackOffice")
            API.getPages().then((pages) => {
                setPages(() => pages)
                setIsLoading(false)
            }).catch(err =>
                navigator("/error", {state: {errorMessage: err.toString()}})
            )
        }

    }, [isLoading])

    const navigator = useNavigate()

    const handleAdd = () =>{
        navigator("/backoffice/add")
    }

    const handleEdit = (id) =>{
        navigator("/backoffice/edit/" + id)
    }

    const handleDelete = (id) =>{

        API.deletePage(id).then((res) =>{
            setIsLoading(true)
        }).catch((err) =>{
            navigator('/error', {state: {errorMessage: err.toString()}})
         })


    }

    return(
        <Container>
            <Row><h1>Back Office</h1></Row>

            {isLoading? <h1>Loading...</h1> :<Row xs={1} md={columnsPerRow}>
                {pages && pages.length>0 ? pages.map((page) => (

                    <Card key={page.id}>


                        <Card.Body>
                            <Card.Title>{page.title}</Card.Title>
                            <Card.Text>Author: {page.author}</Card.Text>
                            <Card.Text>
                                Publication Date: {page.publishDate==="Invalid Date" ? "Draft" : page.publishDate}

                            </Card.Text>
                            <Row className={"justify-content-center"}>
                                <Col xs={12} md={6} lg={4}>
                                    <ButtonGroup className={"action-buttons"}>
                                        <Button variant={"dark"} onClick={() => {
                                            navigator("/page/" + page.id)
                                        }}>
                                            <i className="bi bi-search"></i>View
                                        </Button>
                                        {
                                            (user.username === page.author || user.role === "Admin")?
                                                <Button variant={'dark'} onClick={()=>{handleEdit(page.id)}}>
                                                    <i className="bi bi-pencil"></i>Edit
                                                </Button> : <></>
                                        }
                                        {
                                            (user.username === page.author || user.role === "Admin")?
                                        <Button variant={'dark'} onClick={()=>{handleDelete(page.id)}}>
                                            <i className="bi bi-trash"></i>Delete
                                        </Button>: <></>
                                        }
                                    </ButtonGroup>
                                </Col></Row>
                        </Card.Body>

                    </Card>


                )) : <></>}
                <Card className={"text-center"} onClick={handleAdd}>

                    <Card.Body>
                        <Card.Title>
                            Add a new Page...
                        </Card.Title>
                        <Card.Text>
                            <h1>+</h1>
                        </Card.Text>
                    </Card.Body>

                </Card>
            </Row>}


        </Container>

    )

}

export {BackOffice}