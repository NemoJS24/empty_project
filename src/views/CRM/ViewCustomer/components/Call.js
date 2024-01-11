import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, Row } from 'reactstrap'

const Call = () => {
    const navigate = useNavigate()

    return (
        <>
            <Row>
                <Col md='12'>
                    <Card>
                        <CardBody>
                            <div className='text-center py-1'>
                                <div>
                                    <h4>No Calls to display</h4>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-primary-main' onClick={() => navigate("/merchant/customers/add_call/")} style={{ width: "fit-content" }}>Add Call</button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Call