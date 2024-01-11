import React from "react"
import { Container, Card, CardBody, Row, Col } from 'reactstrap'
import '../CustomerProfile.css'
import CustomerBasicNav from "./CustomerBasicNav"
import CustomerProfileNav from "../CustomerProfileNav"

const CustomerBasicIdProof = () => {

    return (
        <>
            <div className="customer-profile">
                <Card>
                    <CardBody>
                        <h3 className="mb-0">Customer Profile</h3>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Container className="px-2">
                            <CustomerProfileNav />
                        </Container>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <CustomerBasicNav />
                        <Container fluid className="px-0 py-1">
                            <Row>
                                <Col md={12} className="mt-2">
                                    <h4 className="mb-0">Identity Proofs</h4>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="idproof-aadhar-no">
                                        Aadhar Number
                                    </label>
                                    <input readOnly placeholder="AadharNumber" type='text' id='idproof-aadhar-no' name='idproof' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label>
                                        Upload Aadhar Card Image
                                    </label>
                                    <div className="form-control p-0 d-flex justify-content-between align-items-center">
                                        <span className="mx-1">
                                            File Name
                                        </span>
                                        <input name='idproof' type='file' id='idproof-aadhar' className="d-none" />
                                        <label className="btn btn-outline-primary" htmlFor="idproof-aadhar">
                                            Upload File
                                        </label>
                                    </div>
                                </Col>
                                <Col md={4} className="mt-2">
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="idproof-pan-no">
                                        Pan Number
                                    </label>
                                    <input readOnly placeholder="Pan Number" type='text' id='idproof-pan-no' name='idproof' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                <label>
                                        Upload Pan Card Image
                                    </label>
                                    <div className="form-control p-0 d-flex justify-content-between align-items-center">
                                        <span className="mx-1">
                                            File Name
                                        </span>
                                        <input name='idproof' type='file' id='idproof-pan' className="d-none" />
                                        <label htmlFor="idproof-pan" className="btn btn-outline-primary">Upload File</label>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default CustomerBasicIdProof