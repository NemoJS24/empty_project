import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import demoImg from './img/demoImg.jpg'
import Footer from '../utilities/footer/Footer'
import { FaArrowRight } from "react-icons/fa6"
import { Link } from 'react-router-dom'
const Data = [
    'Reduce cart abandonments',
    'Increase redemption rates',
    'Improve loyalty',
    'Increase engagement',
    'Gain a competitive advantage',
    'Cultivate goodwill'
]
const url = "https://www.xircls.com/products/superleadz/features/"

function SuperLeadzLandingPage() {
    return (
        <div>
            <Row className=' justify-content-center mt240'>
                <Col lg="12" xs="10" className='d-flex flex-column justify-content-center text-center '>
                    <h1 className='display-1 fw-bolder main-heading' >Free your shoppers from <br /> copy-pasting
                        coupon codes at checkout!</h1>
                    <h1 className='mt-2'>Offers should delight your customers, so why
                        make redemption such a burden?</h1>
                </Col>
            </Row>
            <Row className=' justify-content-center mt170 '>
                <Col lg="12" xl="10">
                    <Card className='shadow-none p-2 p-md-5 border overflow-hidden text-center' style={{ background: "#e5e7eb" }}>
                        <h1 className='mainHeader display-3 main-heading fw-bolder'>
                            Convert more with One-Click Offer Redemptions by SuperLeadz
                        </h1>
                    </Card>
                </Col>
            </Row>
            <Row className=' justify-content-center mt170 '>
                <Col lg="12" xl="10" className='text-center'>
                    <h1 className='display-3 main-heading fw-bolder '>Here’s how customers auto-apply coupons</h1>
                    <Row className='mt60 text-center' >
                        <Col lg={4} className='mt-3 mt-lg-0'>
                            <img src={demoImg} width={350} className='img-fluid' />
                        </Col>
                        <Col lg={4} className='mt-3 mt-lg-0'>
                            <img src={demoImg} width={350} className='img-fluid' />
                        </Col>
                        <Col lg={4} className='mt-3 mt-lg-0'>
                            <img src={demoImg} width={350} className='img-fluid' />
                        </Col>
                    </Row>
                    <Row className='mt100'>
                        <Col className='text-center'>
                            <h1 className='display-3 main-heading fw-bolder '>
                                See it in action.
                            </h1>
                            <Link to='/contact-us' className='btn btn-lg  fs-3 main-btn-dark mt-2 fw-bolder'>Book a demo</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className='section8Test d-flex flex-column justify-content-center align-items-center mt190 p-0 p-sm-5' style={{ background: "#000" }}>
                <div>
                    <Row className='justify-content-center '>
                        <Col xs="11" md="12" xl="11">
                            <Row className='match-height mt-2 '>
                                <Col lg="6" md="6" className=''>
                                    <h1 className='display-2 fw-bolder  text-white text-start lh-sm ' >It’s good for your customers. And you</h1>
                                    <div className='ms-auto arrow' >
                                        <img className='d-none d-lg-block ' src="https://uploads-ssl.webflow.com/5fac11c3554384e2baf6481c/61fa78aa61452b33bdbd7c9c_Arrow_01.svg" alt="" width={220} style={{ position: "relative", top: "20px" }} />
                                    </div>
                                </Col>
                                <Col lg="6" md="6" >
                                    <div className='   d-flex flex-column p-1 justify-content-end align-items-center mt-2' style={{ background: "#000", border: 'none' }}>
                                        <ul className='d-flex flex-column gap-2'>
                                            {
                                                Data.map((data, index) => (
                                                    <li className='d-flex align-items-center gap-3' key={index} ><img src="https://uploads-ssl.webflow.com/5fac11c3554384e2baf6481c/61fa78aa67d329961f45979f_check-icon.svg" alt="" srcSet="" width={30} /><h4 className='fs-1 text-white fw-lig m-0'>{data}</h4></li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <div >
                            <a target='_blank' href={url} className='d-flex justify-content-end align-items-center mb-2 mb-md-0 mt-2 me-3 me-md-0 text-white' style={{ cursor: "pointer" }} >
                            <Link to='/products/superleadz/features/' className='mb-0 text-white' style={{ fontSize: "1.5rem" }}>View more features</Link> <FaArrowRight style={{ marginLeft: "5px", marginTop:"2px" }} />
                            </a>
                        </div>
                    </Row>
                </div>
            </div>
            <Row className='p-2 p-lg-0 justify-content-center mt160 text-center'>
                <Col lg="12" xl="10">
                    <h1 className='display-3 main-heading fw-bolder '>
                        Instantly boost your offer redemption rate!
                    </h1>
                    <Link to='/merchant/signup' className='btn btn-lg  fs-3 main-btn-dark mt-2 fw-bolder'>Start for free</Link>
                </Col>
            </Row>
            <div className='mt100'>
                <hr />
            </div>
            <Footer />
        </div >
    )
}

export default SuperLeadzLandingPage