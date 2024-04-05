import React from 'react'
import { Col, Container, Row } from 'reactstrap'
import { AiOutlineSafetyCertificate } from "react-icons/ai"
import { IoMdTime } from "react-icons/io"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { GrSecure } from "react-icons/gr"
import CardLeft from '@src/views/main/components/CardLeft'
import { Link } from 'react-router-dom'
import Footer from '@src/views/main/utilities/footer/Footer'
import { BiRightArrowAlt } from 'react-icons/bi'


const data = [
    {
        title: 'Anonymous visitor lands on your website.',
        desc: 'As far as you know, this could be a visitor with low-to-zero purchase intent or even a bot.'
    },
    {
        title: 'Visitor encounters SuperLeadz pop-up.',
        desc: 'It’s the moment of truth. Our high-quality pop-ups are designed to attract and incentivize ready-to-convert shoppers into action'
    },
    {
        title: 'Visitor opts in for an offer and verifies contact information.',
        desc: 'In one swift stroke, your anonymous visitor becomes a high-quality lead!'
    }

]

const Data2 = [
    {
        icon: <GrSecure />,
        title: 'Genuine Leads Only',
        desc: 'Our process ensures that every lead you capture is genuine, eliminating wasted resources on fake or low-quality leads.'
    },
    {
        icon: <AiOutlineSafetyCertificate />,
        title: 'Confirmed Interest',
        desc: 'Leads confirm their interest by opting in to receive offers, signaling their readiness to engage with your brand.'
    },
    {
        icon: <IoMdTime />,
        title: 'Real-Time Refinement',
        desc: 'We analyze visitor behavior in real time, refining lead qualification based on engagement metrics for maximum efficiency'
    },
    {
        icon: <RiMoneyDollarCircleLine />,
        title: 'Cost-Efficient Marketing',
        desc: 'Reduced marketing spend on unqualified leads leaves you free to invest where it matters most - in engaging with genuine prospects.'
    }
]
function NewPage() {
    return (
        <>
            <Row className=' justify-content-center mt160 match-height'>
                <Col  className='  px-0 rounded-2'>
                    <Row>
                        <Col className='text-center'>
                            <h1 className='display-1 main-heading fw-bolder'>
                                SuperLeadz Dual Verification
                            </h1>
                            <h1 className='mt-1'>
                                Verify that your website visitor is
                                human and has high purchase intent
                                in one go!
                            </h1>
                        </Col>
                    </Row>
                    <Row className='justify-content-center text-center mt100 '>
                        <Col md='10'>
                            <h1 className='display-4 fw-bolder main-heading '>Not Every Website Visitor is a Qualified Lead.</h1>
                            <h1 className='mt-2'>In fact, they may not even be human.
                                SuperLeadz by XIRCLS helps you filter out bots, fake leads and uninterested
                                website visitors so that you can zero in on shoppers most likely to convert!</h1>
                        </Col>
                    </Row>
                    <Row className='section8 justify-content-center mt180 '>
                        <Col lg="12" xl="10"  >
                            <h1 className=' text-center display-2 fw-bolder main-heading ' >How It Works</h1>

                            <Row className='  justify-content-center  mt-2 px-3 px-md-1 mt-3  '>
                                {
                                    data.map((item, index) => {
                                        return (
                                            <Col md="4" key={index} className='mt-2 mt-md-0'>
                                                <div key={index}>
                                                <div className='d-flex  align-items-center fs-3 text-black'>Step {index + 1}  <BiRightArrowAlt /></div>
                                                    <h2 className='fs-1 fw-bolder mt-1 main-heading'>{item.title}</h2>
                                                    <h3 className='mt-2 '>{item.desc}</h3>
                                                </div>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                            <h2 className='text-center display-5 fw-bolder mt-3'>Congratulations! You Just Won a SuperLead.</h2>
                        </Col>
                    </Row>
                    <div className='p-1 py-3 p-lg-5  mt120 border' >

                        <Row className='justify-content-center  text-center'>
                            <h1 className='display-4 fw-bolder '>
                                <span className='display-1 fw-bolder main-heading'> 96% </span> of visitors who come to your website aren’t ready to buy.
                            </h1>
                            <h1 className='display-4 fw-bolder '>
                                So why not zero in on the  <span className='display-1 fw-bolder main-heading'> 4% </span> that are?
                            </h1>
                        </Row>
                    </div>
                    <Row className=" justify-content-center mt120 ">
                        <Col lg="10" xs="10">
                            <Container fluid='sm'>

                                <h1 className='display-2 fw-bolder text-center  main-heading'>Why Dual Lead Verification with SuperLeadz?</h1>
                                <Row className='  justify-content-center '>
                                    {
                                        Data2.map((data, index) => (
                                            <Col lg="5" md="6" >
                                                <CardLeft icon={data.icon} title={data.title} desc={data.desc} key={index} />
                                            </Col>
                                        ))
                                    }

                                </Row>
                            </Container>

                        </Col>
                    </Row>
                    <div className='p-1 p-lg-5  mt180' style={{ background: "#e5e7eb" }}>

                        <Row className='justify-content-center  text-center '>
                            <Col lg="10"  >
                            <h1 className='display-2  main-heading fw-bolder '>
                                Elevate your marketing game with zero-party data.
                            </h1>
                            </Col>
                            <Col lg='8'>

                                <h3 className='text-black  fs-1 mt-1 '>Visitors self-verify their information, providing you with valuable zero-party
                                    data for personalized marketing campaigns</h3>
                            </Col>
                        </Row>
                    </div>
                    <Container fluid='sm' className='mt180 pb-5' style={{ background: '#000' }}>
                        <Row className=' justify-content-center'>
                            <Col xs="11" md="11" className='text-center' >
                                <div className='' style={{ background: '#000' }}>
                                    <h1 className='display-2 text-white  pt-4 fw-bolder'>Unlock the Power of Authentic Leads with
                                        SuperLeadz Dual Verification!</h1>
                                    <h1 className=' justify-content-center text-white px-2  pb-5' >Start capturing high-quality leads that drive real business results</h1>
                                    <Link to='' className=' btn btn-lg  main-btn-blue2 fw-lig fs-3 '> REQUEST A DEMO</Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                <Footer/>
                </Col>

            </Row>
        </>
    )
}

export default NewPage
