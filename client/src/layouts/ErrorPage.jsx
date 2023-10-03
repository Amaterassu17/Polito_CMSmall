'use strict';


import {Button, Col, Container, Row} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";

import face from '../assets/error.svg'

function ErrorPage(props) {

    const navigator = useNavigate()
    const setStateOffice = props.setStateOffice

    const {state} = useLocation();
    const {errorCode, errorMessage} = state || (props? {errorCode: props.errorCode, errorMessage: props.errorMessage} : {errorCode: 404, errorMessage: "Page not found"})

    return (

        <>
            <Container className={"p-1 d-flex flex-column align-items-center justify-content-center"}>

                <Row md={12}>
                    <Col>
                        <Button variant="dark" onClick={() => {
                            setStateOffice("front")
                            navigator('/') }}>Home</Button>
                    </Col>
                </Row>
             </Container>

            <Container className={"p-1 d-flex flex-column align-items-center justify-content-center"}>

                <Row md={12}>
                    <Col>
                        <h1>{errorCode}</h1>
                    </Col>
                </Row>

                <Row md={12}>
                    <Col>
                        <img src={face} width={300}/>
                    </Col>
                </Row>

                <Row md={12}>
                    <Col>
                        <h2>{errorMessage}</h2>
                    </Col>
                </Row>

                {/*<Row md={12}>*/}
                {/*    <Col>*/}
                {/*        <p>Sorry, the page you are looking for does not exist.</p>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
            </Container>

        </>




    )

}

export {ErrorPage}