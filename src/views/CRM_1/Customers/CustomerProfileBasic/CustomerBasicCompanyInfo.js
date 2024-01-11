import React from "react"
import { Container, Card, CardBody, Row, Col } from 'reactstrap'
import '../CustomerProfile.css'
import CustomerBasicNav from "./CustomerBasicNav"
import CustomerProfileNav from "../CustomerProfileNav"
import { Twitter, Facebook, Instagram } from "react-feather"

const CustomerBasicCompanyInfo = () => {

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
                                    <h4 className="mb-0">Company Details</h4>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-name">
                                        Company Name
                                    </label>
                                    <input readOnly placeholder="Company Name" type='text' id='company-name' name='company' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-industry">
                                        Industry
                                    </label>
                                    <input readOnly placeholder="Industry" type='text' id='company-industry' name='company' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-gst-no">
                                        GST Number
                                    </label>
                                    <input readOnly placeholder="GST Number" type='text' id='company-gst-no' name='company' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-phone">
                                        Company Phone
                                    </label>
                                    <input readOnly placeholder="Company Phone" type='text' id='company-phone' name='company' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-email">
                                        Company Email
                                    </label>
                                    <input readOnly placeholder="Company Email" type='text' id='company-email' name='company' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-website">
                                        Company Website
                                    </label>
                                    <input readOnly placeholder="Company Website" type='text' id='company-website' name='company' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-pancard">
                                        Company Pan Card Number
                                    </label>
                                    <input readOnly placeholder="Company Pan Card Number" type='text' id='company-pancard' name='company' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-relation">
                                        Relation
                                    </label>
                                    <input readOnly placeholder="Relation" type='text' id='company-relation' name='company' className="form-control" />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="mt-2">
                                    <h4 className="mb-0">Social Presence</h4>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-twitter">
                                        Twitter
                                    </label>
                                    <div id='company-twitter' name='company' className="form-control"><Twitter size={15} /> None</div>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-facebook">
                                        Facebook
                                    </label>
                                    <div id='company-facebook' name='company' className="form-control"><Facebook
                                        size={15} /> None</div>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="company-instagram">
                                        Instagram
                                    </label>
                                    <div id='company-instagram' name='company' className="form-control"><Instagram
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

export default CustomerBasicCompanyInfo