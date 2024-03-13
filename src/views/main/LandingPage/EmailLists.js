import React from 'react'
import SubNavbar from '@src/views/main/utilities/navbar/SubNavbar'
import { Col, Row } from 'react-bootstrap'
import { IoCheckmarkSharp } from "react-icons/io5"
import Footer from '../utilities/footer/Footer'
import { VscWorkspaceTrusted } from "react-icons/vsc"
import { TbListCheck } from "react-icons/tb"
import { FaArrowRight } from "react-icons/fa6"
import video from './img/Leadz.mp4'
import { Link } from 'react-router-dom'

const data1 = [
    {
        desc: "Self-verify their contact data!"
    },
    {
        desc: "Confirm their interest in your product/service!"
    },
    {
        desc: "Consent to receiving future promotional emails!"
    }

]
const Features = [
    {
        desc: "Opt-ins: Email/SMS OTP verification"
    },
    {
        desc: "Lead segmentation"
    },
    {
        desc: "Lead source & behaviour targeting"
    },
    {
        desc: "Pre-built pop-up templates"
    },
    {
        desc: "Advanced pop-up functions such as multi-offer display, page customization, scheduled pop-ups etc."
    },
    {
        desc: "Real-time campaign performance tracking"
    }


]
const data2 = [
    {
        desc: "Increased website engagement time"
    },
    {
        desc: "Lead segmentation"
    },
    {
        desc: "Higher visitor-to-lead conversion rate"
    },
    {
        desc: "More sales conversions"
    }


]
const url = "https://www.xircls.com/products/superleadz/features/"

function EmailLists() {
    return (
        <>
            <style>{`
        .trust_icon{
            font-size:150px
        }
        .features_icon{
            font-size:150px
        }
        @media only screen and (max-width: 768px) {
          .features_icon, .trust_icon{
            font-size:100px
          }
        }
            `}
            </style>
            {/* <SubNavbar navTitle={'superleadz'} /> */}

            <Row className=' justify-content-center mt180 match-height'>
                <Col lg="11" xs="10" className='  px-0 rounded-2'>
                    <Row className=''>
                        <Col lg="6" className='d-flex flex-column justify-content-center'>
                            <h1 className='display-1 lh-83 text-md-start main-heading fw-bolder' >Stop wasting money
                                with fake or <br /> low-quality leads!</h1>
                            <h1 className='fw-bold mt-2'>
                                Build a 100% genuine & ready-to-convert email database. Increase your email campaign ROIs.
                            </h1>
                        </Col>
                        <Col lg="6" className='overflow-hidden  p-0 m-0  d-flex justify-content-center align-items-center mt-3 mt-lg-0 '>
                            <video autoPlay loop muted className='w-100'>
                                <source src={video} type='video/mp4' />
                            </video>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="justify-content-center mt180 align-items-center    " >
                <Col lg='11' xs='10'>
                    <Row className="d-flex align-items-center  justify-content-center m-2 m-lg-0 ">
                        <Col lg="5" className='d-flex align-items-start justify-content-center ' >
                            <VscWorkspaceTrusted color='#000' className='trust_icon' />
                        </Col>

                        <Col lg="7" className='mt-3 mt-lg-0' >
                            <div>
                                <h1 className="text-center text-black text-lg-start display-5 fw-bolder mb-2" >
                                    Start generating 100% genuine email lists.</h1>
                                <h1 className="text-center text-lg-start  main-heading mb-2">
                                    With SuperLeadz, your website visitors will:</h1>
                                <div className='d-flex flex-column  align-items-start'>

                                    {data1.map((item, index) => {
                                        return <div key={index} className='text-left'>
                                            <ul>
                                                <li className='fs-3'>{item.desc}</li>
                                            </ul>
                                        </div>

                                    })}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className='d-flex justify-content-center mt100 ' >
                <Col lg='11' xs='10' >
                    <Row>
                        <Col lg="5" className='d-flex align-items-center justify-content-center '>
                            <TbListCheck color='#000' className='features_icon' />
                        </Col>
                        <Col lg="7">
                            <div className='mt-2' >
                                <h1 className='display-5 fw-bolder main-heading text-center text-lg-start mb-3 mb-lg-0' >Top Features</h1>
                                {Features.map((item, index) => {
                                    return <div key={index} className='text-black mb-1 mt-1 d-flex align-items-center '>
                                        <IoCheckmarkSharp
                                            className="me-1 text-black"
                                            style={{ minWidth: "32px" }}
                                        />

                                        <p className='mb-0' style={{ fontSize: "20px" }}>
                                            {item.desc}
                                        </p>

                                    </div>
                                })}
                            </div>
                        </Col>


                    </Row>
                </Col>

            </Row>

            <Row className='mt180'>
                <Col className='text-center'>
                    <h1 className=' text-center display-2 text-start main-heading fw-bolder' >Start generating 100% genuine email lists.</h1>
                    <Link to='/contact-us' className='btn 
                    btn-lg  fs-3 main-btn-dark mt-2 fw-bolder'>Request a demo</Link>
                </Col>
            </Row>
            <Row className='d-flex justify-content-center mt120 p-1  p-md-3' style={{ background: "#e5e7eb" }}>
                <Col lg="10" className=''  >
                    <h1 className=' text-center display-2 text-start main-heading fw-bolder ' >Ready-to-convert leads guarantee:</h1>
                    <div className='mt-2'>

                        {data2.map((item, index) => {
                            return <div key={index} >
                                <ul>
                                    <li className='fs-3'>{item.desc}</li>
                                </ul>
                            </div>
                        })}
                    </div>
                </Col>


                <div >
                    <a href={url} target='_blank' className='d-flex justify-content-end align-items-center' style={{ cursor: "pointer" }}>
                        <Link to='/products/superleadz/features/' className='mb-0' style={{ fontSize: "1.5rem" }}>View more features</Link> <FaArrowRight style={{ marginLeft: "5px" }} />
                    </a>

                </div>
            </Row>
            <div className=" mt180 " style={{ background: "#000" }}>

                <Row className='text-center flex-column mb-4 p-3'>
                    <Col className='d-flex flex-column gap-1 text-white ' >
                        <h1 className='text-center display-2 text-white fw-bolder  '>Supercharge your email marketing efforts!</h1>
                        <h1 className=' justify-content-center px-2 pb-5 text-white'>Activate SuperLeadz for free.</h1>
                    </Col>
                    <Col className='mt-3'>
                        <a target='_blank' href='https://apps.shopify.com/superleadz-by-xircls' className='btn btn-lg fs-3 fw-bold main-btn-blue2 ' >Install Now</a>
                    </Col>
                </Row>
            </div>
            <Footer />
        </>
    )
}

export default EmailLists