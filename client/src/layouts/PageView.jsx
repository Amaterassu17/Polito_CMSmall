'use strict';

import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import API from "../API.jsx";

function PageView() {
    const [page, setPage] = useState({title: "", publishDate: "", author: ""})
    const pageId = useParams().id
    const navigator = useNavigate()
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {

        API.getPage(pageId).then(async (page) => {
            setPage({title: page.title, publishDate: page.publishDate, author: page.author, blocks: page.blocks})
            setIsLoading(false)
        }).catch((err) => {
            navigator("/error", {state: {errorMessage: err.toString()}})
        })



    }, [])


    return (
        <Container className={"p-3 non-scrollable"}>
        <Button variant={"dark"} onClick={() => {
            navigator(-1)
        }}>Back</Button>
        <Container className={"p-4 rounded border container-page-view "}>
            <Row>
                <Col md={8}>

                    { !isLoading?
                        <>
                            <h1>{page.title}</h1>
                            <h5>By: {page.author}</h5>
                            {
                                page.publishDate === "Invalid Date" ?
                                    <h5>This is a draft.</h5> :
                                    <h5>Published on: {page.publishDate}</h5>
                            }

                        </>

                        :
                        <></>}

                </Col>
            </Row>
        </Container>
        <Container className={"p-4 rounded border container-page-view "}>
            { !isLoading?
                page.blocks.map((block) => {
                        switch (block.type) {
                            case "header":
                                return (
                                    <>
                                        <Row>
                                            <Col>
                                                <h1 key={block.relativePos}>{block.content}</h1>
                                            </Col>
                                        </Row>
                                    </>
                                );

                            case "paragraph":
                                return (
                                    <>
                                        <Row>
                                            <Col>
                                                <p key={block.relativePos}>{block.content}</p>
                                            </Col>
                                        </Row>
                                    </>
                                );


                            case "image":
                                return (
                                    <>
                                        <Row>
                                            <Col>
                                                <img key={block.relativePos} width={"50%"}
                                                     src={"http://localhost:3001/server/images/" + block.content} alt={"Image not taken"}/>
                                            </Col>
                                        </Row>
                                    </>
                                );

                        }
                    }
                ) : <></>
            }
        </Container>


    </Container>

    )
}

export {PageView}