import React from "react"
import { Container, Card, CardBody, Row, Col } from 'reactstrap'
import '../CustomerProfile.css'
import CustomerBasicNav from "./CustomerBasicNav"
import CustomerProfileNav from "../CustomerProfileNav"
import { Twitter, Facebook, Instagram } from "react-feather"

const CustomerBasicAccount = () => {

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
                                    <h4 className="mb-0">Account Details</h4>
                                </Col>
                                <Col md={12} className="mt-2">
                                    <div className="d-flex gap-1">
                                        <div style={{ width: '100px', height: '100px' }}>
                                            <img src="https://www.xircls.com/static/app-assets/images/avatars/default_user.jpg" style={{ width: '100%' }} />
                                        </div>
                                        <div>
                                            <h4 className="mb-0">Customer Name</h4>
                                            <button className="btn btn-primary">Edit</button>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="account-username">
                                        Username
                                    </label>
                                    <input readOnly placeholder="Username" type='text' id='account-username' name='account' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="account-email">
                                        Email
                                    </label>
                                    <input readOnly placeholder="Email" type='text' id='account-email' name='account' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="account-password">
                                        Password
                                    </label>
                                    <input readOnly placeholder="Password" type='password' id='account-password' name='account' className="form-control" />
                                </Col>
                            </Row>
                        </Container>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default CustomerBasicAccount