'use strict';

import {
    Alert,
    Button,
    ButtonGroup,
    Col,
    Container,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    Row
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../API.jsx";

import "../styles/AddPage.css"


// const dayjs = require('dayjs');
// const dayjsLocaleIt= require('dayjs/locale/it')
// dayjs.locale('it')
// const customParseFormat = require('dayjs/plugin/customParseFormat')

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjsLocaleIt from "dayjs/locale/it";
dayjs.locale("it");


const listOfImages = [
    "meme.png",
    "better_not_put_this.jpg",
    "due_fantagenitori.jpg",
    "induction.jpg",
    "eggs.png",
    "happy.gif",
    "heavy.png",
    "kirby.gif",
    "ryan_gosling.jpg",
    "ryan_gosling2.gif",
    "dauin.png",
    "dont_use_this.jpg",
];

function AddAndEditPageLayout(props) {
    const mode = props.mode;
    const user = props.user;
    const navigator = useNavigate();
    const [newPage, setNewPage] = useState({ title: "", publishDate: "", author: user? user.author : "" });
    const [blocks, setBlocks] = useState([]);
    const [warning, setWarning] = useState("");
    const [users, setUsers] = useState([]);
    const [isEditLoaded, setIsEditLoaded] = useState(false);
    let pageId = null;

    if(!user) navigator("/error", {state: {errorMessage: "You are not logged in"}})


    if (mode === "edit") {
        pageId = useParams().id;
    }

    useEffect( () => {
        if (mode === "edit" && user.role==="Admin") {
              API.getPage(pageId)
                .then((page) => {
                    var dateParts = page.publishDate.split("/");
                    var dateObject = new Date(dateParts[2], dateParts[1]-1, dateParts[0]);

                    var creationDateParts = page.creationDate.split("/");
                    var creationDateObject = new Date(creationDateParts[2], creationDateParts[1]-1, creationDateParts[0]);

                    setNewPage({
                        title: page.title,
                        author: page.author,
                        publishDate: dayjs(dateObject).format("YYYY-MM-DD"),
                        creationDate: dayjs(creationDateObject).format("YYYY-MM-DD"),
                    });

                    setBlocks(
                        page.blocks.map((block) => ({
                            type: block.type,
                            content: block.content,
                            relativePos: block.relPos
                        }))
                    );
                })
                  .then(() => {
                      API.getUsers().then((users) => {
                          setUsers(users);
                      }).catch((err) => {
                          navigator("/error", {state: {errorMessage: err.toString()}})
                      })
                  })
                  .then(() => {
                    setIsEditLoaded(true)
                  })
                .catch((err) => {
                    navigator("/error", {state: {errorMessage: err.toString()}})
                });

        }
        else if (mode !== "edit" && user.role==="Admin") {

            API.getUsers().then((users) => {
                setUsers(users);
            }).catch((err) => {
                    navigator("/error", {state: {errorMessage: err.toString()}})
            })
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if(newPage.title === "") {
            setWarning("You must insert a title");
            return;
        }

        if(mode === "edit" && newPage.author === "") {
            setWarning("You must insert an author");
            return;
        }

        if (blocks.length < 2) {
            setWarning("You must add at least 2 blocks");
            return;
        } else {
            const types = blocks.map((block) => block.type);
            if (!types.includes("header")) {
                setWarning("You must add at least 1 header");
                return;
            } else if (!types.includes("paragraph") && !types.includes("image")) {
                setWarning("You must add at least 1 paragraph or 1 image");
                return;
            }
        }

        const blocksContent = blocks.map((block) => block.content);

        if (blocksContent.includes("")) {
            setWarning("You must fill all the blocks");
            return;
        }

        const blocksWithRelativePos = blocks.map((block, index) => ({
            ...block,
            relativePos: index
        }));

        let dataToSend = {
            title: newPage.title,
            author: user.username,
            publishDate: dayjs(newPage.publishDate).format("DD/MM/YYYY"),
            blocks: blocksWithRelativePos
        };

        if (mode === "edit") {
            dataToSend = { ...dataToSend, author: newPage.author, id: pageId, creationDate: dayjs(newPage.creationDate, 'DD/MM/YYYY').format("DD/MM/YYYY") };

            console.log(dataToSend)

            API.updatePage(dataToSend)
                .then((response) => {
                    navigator(-1);
                })
                .catch((err) =>
                    navigator("/error", {state: {errorMessage: err.toString()}})

                );
        } else {
            API.createPage(dataToSend)
                .then((response) => {
                    navigator(-1);
                })
                .catch((err) =>
                    navigator("/error", {state: {errorMessage: err.toString()}})

                );
        }
    };

    const handleAdd = () => {
        setBlocks((prevBlocks) => [...prevBlocks, { type: "", content: "" }]);
    };

    const handleDelete = (id) => {
        setBlocks((prevBlocks) =>
            prevBlocks.filter((block, index) => index !== id)
        );
    };

    const handleSwap = (id, direction) => {
        setBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            if (direction === "up" && id > 0) {
                [updatedBlocks[id - 1], updatedBlocks[id]] = [
                    updatedBlocks[id],
                    updatedBlocks[id - 1]
                ];
            } else if (direction === "down" && id < updatedBlocks.length - 1) {
                [updatedBlocks[id], updatedBlocks[id + 1]] = [
                    updatedBlocks[id + 1],
                    updatedBlocks[id]
                ];
            }
            return updatedBlocks;
        });
    };


    return (
        <Container className="align-content-center gap-3 p-5 container-page-view rounded border">
            <Button variant="dark" onClick={() => {navigator("/backoffice");}}>Back</Button>
            <Row>
                <Col md={6} className="offset-md-3">
                    <h1 className="text-center">{mode === "edit" ? "Edit" : "Create"} Page</h1>
                    {warning !== "" ? (
                        <Alert variant="danger" onClose={() => setWarning("")} dismissible>{warning}</Alert>
                    ) : (
                        <></>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup className="mb-3">
                            <FormLabel>Title</FormLabel>
                            <FormControl type="text" value={newPage.title} required={true} placeholder="Title" onChange={(event) => setNewPage({ ...newPage, title: event.target.value })}/>
                        </FormGroup>

                        {user?.role === "Admin" ? (
                            <FormGroup className="mb-3">
                                <FormLabel>Author</FormLabel>
                                <FormControl as="select" className={"form-select"} value={newPage.author} required={true} onChange={(event) => setNewPage({ ...newPage, author: event.target.value })}>
                                    <option value="">Select Author</option>
                                    {users.map((user) => (
                                        <option key={user.username} value={user.username}>
                                            {user.username}
                                        </option>
                                    ))}
                                </FormControl>
                            </FormGroup>
                        ) : (
                            <></>
                        )}

                        <FormGroup className="mb-3">
                            <FormLabel>Publish Date (Don't change if Draft)</FormLabel>
                            <FormControl
                                type="date"
                                value={dayjs(newPage.publishDate, "DD/MM/YYYY").format("YYYY-MM-DD")}
                                required={false}
                                placeholder="Publication Date"
                                onChange={(event) => setNewPage({ ...newPage, publishDate: event.target.value })}
                            />
                        </FormGroup>

                        {blocks.map((block, index) => {
                            return (
                                <Container key={index} className="mb-3">
                                    <h1>{index}</h1>
                                    <FormGroup>
                                        <Row className={"justify-content-center"}>
                                            <Col md={9}>
                                                <FormLabel>Block Type</FormLabel>
                                                <FormControl as="select" className={"form-select"} name="type" value={block.type} onChange={(event) => {
                                                        setBlocks((prevBlocks) =>
                                                            prevBlocks.map((prevBlock, prevIndex) => {
                                                                if (prevIndex === index) {
                                                                    prevBlock.type = event.target.value;
                                                                }
                                                                return prevBlock;
                                                            })
                                                        );
                                                    }}>
                                                    <option value="">Select Type</option>
                                                    <option value="header">Header</option>
                                                    <option value="paragraph">Paragraph</option>
                                                    <option value="image">Image</option>
                                                </FormControl>
                                            </Col>
                                            <Col className="d-flex align-items-end">
                                                <Button variant="danger" onClick={() => {handleDelete(index);}}>
                                                    <i className="bi bi-trash"></i>Delete
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={9}>
                                                {block.type !== "" ? (
                                                    <FormLabel>Block Content</FormLabel>
                                                ) : (
                                                    <></>
                                                )}
                                                {block.type === "header" ? (
                                                    <FormControl value={block.content} required={true} type="text" name="content" onChange={(event) => {
                                                            setBlocks((prevBlocks) =>
                                                                prevBlocks.map((prevBlock, prevIndex) => {
                                                                    if (prevIndex === index) {
                                                                        prevBlock.content = event.target.value;
                                                                    }
                                                                    return prevBlock;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                ) : block.type === "paragraph" ? (
                                                    <FormControl as="textarea" value={block.content} required={true} name="content" onChange={(event) => {
                                                            setBlocks((prevBlocks) =>
                                                                prevBlocks.map((prevBlock, prevIndex) => {
                                                                    if (prevIndex === index) {
                                                                        prevBlock.content = event.target.value;
                                                                    }
                                                                    return prevBlock;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                ) : block.type === "image" ? (
                                                    <FormControl value={block.content} as="select" required={true} className={"form-select"} name="content" onChange={(event) => {
                                                            setBlocks((prevBlocks) =>
                                                                prevBlocks.map((prevBlock, prevIndex) => {
                                                                    if (prevIndex === index) {
                                                                        prevBlock.content = event.target.value;
                                                                    }
                                                                    return prevBlock;
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        <option value="">Select Image</option>
                                                        {listOfImages.map((image) => (
                                                            <option key={image} value={image}>
                                                                {image}
                                                            </option>
                                                        ))}
                                                    </FormControl>
                                                ) : (
                                                    <></>
                                                )}
                                            </Col>
                                            <Col className="d-flex align-items-end">
                                                <ButtonGroup >
                                                    {index !== 0 ? (
                                                        <Button variant="warning" value={index} onClick={() => {handleSwap(index, "up");}}>
                                                            <i className="bi bi-arrow-bar-up"></i>
                                                        </Button>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {index !== blocks.length - 1 ? (
                                                        <Button variant="warning" value={index} onClick={() => {handleSwap(index, "down");}}>
                                                            <i className="bi bi-arrow-bar-down"></i>
                                                        </Button>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </ButtonGroup>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Container>
                            );
                        })}

                        <Container className="mb-3">
                            <Row>
                                <Col>
                                    <Button variant="primary" onClick={handleAdd}>
                                        +
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                        <Container className="mb-3">
                            <Row>
                                <Col>
                                    <Button variant="success" type="submit">
                                        Save
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </Col>
            </Row>
        </Container>
    );

}

export {AddAndEditPageLayout};
