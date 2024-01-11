import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap"

const CustomerType = () => {

    const navigate = useNavigate()

    return (
        <>
            <Card>
                <CardHeader>
                    <h4>Customer Type</h4>
                </CardHeader>
            </Card>
            <Row>
                <Col md='6'>
                    <Card onClick={() => navigate('/merchant/customers/add_customer')} className='cursor-pointer'>
                        <CardBody>
                            <a>
                                Add an Individual
                            </a>
                        </CardBody>

                    </Card>
                </Col>
                <Col md='6'>
                    <Card onClick={() => navigate('/merchant/customers/add_business')} className='cursor-pointer'>
                        <CardBody>
                            <a to={''}>
                                Add a Business
                            </a>
                        </CardBody>

                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CustomerType