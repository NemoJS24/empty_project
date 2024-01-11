import React from "react"
import { Container, Card, CardBody, Row, Col } from 'reactstrap'
import '../CustomerProfile.css'
import CustomerBasicNav from "./CustomerBasicNav"
import CustomerProfileNav from "../CustomerProfileNav"

const CustomerBasicAddress = () => {

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
                                    <h4 className="mb-0">Billing Address</h4>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-house-details">
                                        Flat and / or Building / House Details
                                    </label>
                                    <input readOnly placeholder="Flat and / or Building / House Details" type='text' id='address-2-house-details' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-lane">
                                        Street Lane or Road
                                    </label>
                                    <input readOnly placeholder="Street Lane or Road" type='text' id='address-2-lane' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-locality">
                                        Enter Area, Locality or Suburb e.g. Bandra
                                    </label>
                                    <input readOnly placeholder="Enter Area, Locality or Suburb e.g. Bandra" type='text' id='address-2-locality' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-landmark">
                                        Landmark
                                    </label>
                                    <input readOnly placeholder="Landmark" type='text' id='address-2-landmark' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-city">
                                        City
                                    </label>
                                    <input readOnly placeholder="City" type='text' id='address-2-city' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-state">
                                        State
                                    </label>
                                    <input readOnly placeholder="State" type='text' id='address-2-alt-mobile' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-pincode">
                                        Pincode
                                    </label>
                                    <input readOnly placeholder="Pincode" type='text' id='address-2-pincode' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-country">
                                        Country
                                    </label>
                                    <input readOnly placeholder="Country" type='text' id='address-2-country' name='address' className="form-control" />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="mt-3 d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Shipping Address</h4><span className="form-check form-check-success"><input type='checkbox' id='billing-same' className="form-check-input" /><label htmlFor="billing-same">Same as Billing Address?</label></span>
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-house-details">
                                        Flat and / or Building / House Details
                                    </label>
                                    <input readOnly placeholder="Flat and / or Building / House Details" type='text' id='address-2-house-details' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-lane">
                                        Street Lane or Road
                                    </label>
                                    <input readOnly placeholder="Street Lane or Road" type='text' id='address-2-lane' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-locality">
                                        Enter Area, Locality or Suburb e.g. Bandra
                                    </label>
                                    <input readOnly placeholder="Enter Area, Locality or Suburb e.g. Bandra" type='text' id='address-2-locality' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-landmark">
                                        Landmark
                                    </label>
                                    <input readOnly placeholder="Landmark" type='text' id='address-2-landmark' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-city">
                                        City
                                    </label>
                                    <input readOnly placeholder="City" type='text' id='address-2-city' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-state">
                                        State
                                    </label>
                                    <input readOnly placeholder="State" type='text' id='address-2-alt-mobile' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-pincode">
                                        Pincode
                                    </label>
                                    <input readOnly placeholder="Pincode" type='text' id='address-2-pincode' name='address' className="form-control" />
                                </Col>
                                <Col md={4} className="mt-2">
                                    <label htmlFor="address-2-country">
                                        Country
                                    </label>
                                    <input readOnly placeholder="Country" type='text' id='address-2-country' name='address' className="form-control" />
                                </Col>
                            </Row>
                        </Container>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default CustomerBasicAddress