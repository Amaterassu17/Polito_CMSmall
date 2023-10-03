'use strict';

import {Button, ButtonGroup, Col, Container, ListGroupItem, Row} from "react-bootstrap";
import Card from 'react-bootstrap/Card'
import {Link, useNavigate} from "react-router-dom";
import CardHeader from "react-bootstrap/CardHeader";
import {useEffect, useState} from "react";
import API from "../API.jsx";

const columnsPerRow= 4;
function FrontOffice(){

    const [pages, setPages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(()=>{
        if(isLoading) {
            console.log("useEffect" + isLoading)
            API.getPublishedPages().then((pages) => {
                setPages(pages)
                setIsLoading(false)
            }).catch(err => {
                navigator("/error", {state: {errorMessage: err.toString()}})
            })
        }

    }, [])

    const navigator = useNavigate()


    return(
        <Container>
            <Row><h1>Contents</h1></Row>
            {isLoading? <h1>Loading...</h1> : <Row xs={1} md={columnsPerRow}>
                {pages && pages.length> 0? pages.map((page) => (

                    <Card key={page.id}>


                        <Card.Body>
                            <Card.Title>{page.title}</Card.Title>
                            <Card.Text>Author: {page.author}</Card.Text>
                            <Card.Text>
                                Publication Date: {page.publishDate}

                            </Card.Text>
                            <Row className={"justify-content-center"}>
                                <Col xs={12} md={6} lg={4}>
                                    <ButtonGroup className={"action-buttons"}>
                                        <Button variant={"dark"} onClick={() => {
                                            navigator("/page/" + page.id)
                                        }}>
                                            <i className="bi bi-search"></i>View
                                        </Button>

                                    </ButtonGroup>
                                </Col></Row>


                        </Card.Body>

                    </Card>


                )): <h1>There are no published pages yet...</h1>}
            </Row>}


        </Container>

    )

}

export {FrontOffice}