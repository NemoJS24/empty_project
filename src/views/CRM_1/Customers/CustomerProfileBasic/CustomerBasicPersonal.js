import React from "react"
import { Container, Card, CardBody, Row, Col } from 'reactstrap'
import '../CustomerProfile.css'
import CustomerBasicNav from "./CustomerBasicNav"
import CustomerProfileNav from "../CustomerProfileNav"
import { Facebook, Instagram, Twitter } from "react-feather"

const CustomerBasicPersonal = () => {

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
                                    <h4 className="mb-0">Personal Details</h4>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-dob">
                                        Date Of Birth
                                    </label>
                                    <input readOnly placeholder="Date Of Birth" type='text' id='personaldetails-dob' name='personaldetails' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-gender">
                                        Gender
                                    </label>
                                    <input readOnly placeholder="Gender" type='text' id='personaldetails-gender' name='personaldetails' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-marital-status">
                                        Marital Status
                                    </label>
                                    <input readOnly placeholder="Marital Status" type='text' id='personaldetails-marital-status' name='personaldetails' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-children">
                                        Children
                                    </label>
                                    <input readOnly placeholder="Children" type='text' id='personaldetails-children' name='personaldetails' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-occupation">
                                        Occupation
                                    </label>
                                    <input readOnly placeholder="Occupation" type='text' id='personaldetails-occupation' name='personaldetails' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-designation">
                                        Designation
                                    </label>
                                    <input readOnly placeholder="Designation" type='text' id='personaldetails-designation' name='personaldetails' className="form-control" />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="mt-2">
                                    <h4 className="mb-0">Social Presence</h4>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-twitter">
                                        Twitter
                                    </label>
                                    <div id='personaldetails-twitter' name='personaldetails' className="form-control"><Twitter size={15} /> None</div>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-facebook">
                                        Facebook
                                    </label>
                                    <div id='personaldetails-facebook' name='personaldetails' className="form-control"><Facebook
                                     size={15} /> None</div>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="personaldetails-instagram">
                                        Instagram
                                    </label>
                                    <div id='personaldetails-instagram' name='personaldetails' className="form-control"><Instagram
                                     size={15} /> None</div>
                                </Col>
                            </Row>
                        </Container>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default CustomerBasicPersonal