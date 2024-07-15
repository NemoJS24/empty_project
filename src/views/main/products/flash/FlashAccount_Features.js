import React from "react"
import Footer from '@src/views/main/utilities/footer/Footer'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import SubNavbar from '@src/views/main/utilities/navbar/SubNavbar'
import { Col, Container, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
// import giff1 from '../superLeadz/SuperLeadz/images/gif1.gif'
import CardLeft from '@src/views/main/components/CardLeft'
import { GoGoal } from "react-icons/go"
import { IoMdArrowRoundForward, IoMdCheckmark } from "react-icons/io"
import { IoBulbOutline } from "react-icons/io5"
import { RiUserVoiceLine, RiSpam2Line } from "react-icons/ri"
import { PiSignatureThin } from "react-icons/pi"
import optimization from "./imgs/optimization.png"
import SpamRisk from "./imgs/Spam-risk.png"
import brand from "./imgs/brand.png"
import FaqFlash from "./FaqFlash"

const Data1 = [
    {
        title: "Define your Purpose.",
        desc: "Objectives that align with your business goals, it is to increase brand recall, boost sales, grow your registered user base or build high-quality email lists.",
        icon: <GoGoal />
    },
    {
        title: "Choose a Strategy.",
        desc: "Diverse strategies to meet your objective, from a simple newsletter call-out to membership invitations, birthday incentives & more.",
        icon: <IoBulbOutline />
    },
    {
        title: "Select a Brand Voice.",
        desc: "Pick a personality that best matches your brand identity - chatty, sophisticated, warm, mysterious, enthusiastic… the list goes on!",
        icon: <RiUserVoiceLine />
    }
]

const Data2 = [
    {
        title: "Customizable to the core.",
        h1: "Form Design",
        h2: "Account creation success message",
        h3: "Email editor",
        h4: "Account creation success",
        h5: "Sign-up reminder"
    }
]

const Data3 = [

    // title: "100% transparency with guest conversion analysis.",
    // "Real-time performance reports for campaign optimization.",
    "How many guests sign up via Flash Accounts?",
    "At which purchase do they sign up?",
    "Do they opt in for email or SMS notifications?"

]

export default function FlashAccount_Features() {
    return (
        <div style={{ background: "#fff" }} className='flashaccount_features' >

            {/* <Navbar position={'notFixed'} /> */}
            {/* <SubNavbar navTitle={'flash-accounts'} /> */}

            <Row className=' justify-content-center mt160 match-height'>
                <Col xs="10" xl="10" className='  px-0 rounded-2'>
                    <Row className='justify-content-center  match-height  h-100'>
                        <Col md="6" className=' '>
                            <h1 className='display-1 main-heading fw-bolder lh-83'>
                                Flash Accounts Features
                            </h1>
                            <h1 className='text-black fw-bold mt-1'>Post-purchase account creation.</h1>
                            <div className='d-block mt-2' >
                                <a target='_blank' href='https://apps.shopify.com/flash-accounts-by-xircls' className=' btn  main-btn-blue fs-4 fw-bolder  '>Launch Now</a>
                            </div>
                            <Row className='justify-content-start mt-2'>
                                <Col md="6" className='  '>
                                    <h4 className='fw-bolder mb-0 text-black '>Need clarity?</h4>
                                    <h1 className='fs-4 text-black fw-bold mt-0'>  Let our sales specialists give you a personalized tour.</h1>
                                </Col>
                                <Col md="6" className=' mt-2 '>
                                    <Link to='/contact-us' className='m-0  fs-4   fw-bolder p-0  '>
                                        Book a demo
                                        <IoMdArrowRoundForward />  </Link>
                                </Col>
                            </Row>

                        </Col>
                        <Col md="6" className='overflow-hidden  p-0 m-0  d-flex justify-content-center align-items-center '>

                            {/* <img className=' rounded-2 border' src={featureVideo} alt="" style={{ width: "440px" }} /> */}
                        </Col>

                    </Row>
                </Col>
            </Row>

            <Row className=" justify-content-center mt180 px-2">
                <Col lg="12" xl="10">
                    <h1 className="text-center display-4 fw-bolder main-heading mb-2">
                        An instant sign-up module on your store’s 'Thank You' page.</h1>

                    <h2 className="text-black text-center fs-1 m-0 mb-1">
                        A light, no-code widget for speedy account creation at the end of a guest customer’s purchase journey.
                    </h2>
                </Col>
            </Row>

            <div>
                <Row className='section8 justify-content-center mt180 '>
                    <Col xs="11" lg="12" xl="10" >
                        <h1 className=' text-center display-4 fw-bolder main-heading'>Pre-built templates that fulfill every objective</h1>
                        <h1 className=' text-center display-4 fw-bolder main-heading'>and address diverse buyer personas.</h1>
                        <Row className='m-auto justify-content-between mt-1'>
                            {
                                Data1.map((data, index) => {
                                    return (
                                        <Col lg="4" md="6" className="gap-2 w-25 " key={index}>
                                            <CardLeft icon={data.icon} title={data.title} desc={data.desc} key={index} />
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </div>

            <Row className='justify-content-center match-height flex-row mt180 px-2'>
                <Col md="6" className=' p-0  rounded-2  d-flex justify-content-center  align-items-end align-items-md-center  '>
                    <img src={optimization} alt="optimization" width={200} />
                </Col>

                <Col md="6" className='text-start'>
                    <div>
                        <h1 className='display-6 main-heading fw-bolder '>Strategy optimization.</h1>
                        <h3 className='fs-3 fw-bold text-black '>Experiment with different templates and discover which strategies & communication suit your
                            audience the best.</h3>
                    </div>
                </Col>
            </Row>

            {/* <Row className="justify-content-center match-height flex-row-reverse mt180 px-2">
                <Col lg="12" xl="10">
                    <h1 className="text-center display-4 fw-bolder main-heading mb-2">
                        Strategy optimization.</h1>
                    <h3 className="d-flex text-black  text-center fs-1 m-0 mb-1" >
                        Experiment with different templates and discover which strategies & communication suit your
                        audience the best.
                    </h3>
                </Col>

                <Col lg="12" xl="10">
                <img src={optimization} alt="optimization" width={180}/>
                </Col>
            </Row> */}

            <Row className="justify-content-center mt180 px-2">
                <Col lg="12" xl="10">
                    {Data2.map((item, index) => (
                        <div key={index} className="mt-5 d-flex flex-column justify-content-center">
                            <h1 className="main-heading display-4 fw-bolder text-center mt-0 pb-1">
                                {item.title}
                            </h1>

                            {item.h1 && (
                                <div>
                                    {Array.isArray(item.h1) ? (
                                        item.h.map((heading, headingIndex) => (
                                            <div key={headingIndex}>{heading}</div>
                                        ))
                                    ) : (
                                        <div className=" d-flex justify-content-center " >
                                            <div className="d-flex text-black match-height text-start fs-3 " style={{gap:'50px'}}>
                                                <div className="ms-1">
                                                    <div className="fw-bolder ms-1 mb-1"><IoMdCheckmark style={{marginRight: '10px'}} />{item.h1}</div>
                                                    <div className="fw-bolder ms-1 mb-1"><IoMdCheckmark style={{marginRight: '10px'}} />{item.h2}</div>
                                                </div>
                                                <div className="ms-1">
                                                    <div className="fw-bolder ms-1 mb-1"><IoMdCheckmark style={{marginRight: '10px'}} />{item.h3}</div>
                                                    <div className="fw-bolder ms-1 mb-1"><IoMdCheckmark style={{marginRight: '10px'}} />{item.h4}</div>
                                                </div>
                                                <div className="ms-1">
                                                    <div className="fw-bolder ms-1 mb-1"><IoMdCheckmark style={{marginRight: '10px'}} />{item.h5}</div>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                </div>

                            )}
                        </div>
                    ))}
                </Col>
            </Row>

            <Row className=' mt180 justify-content-center '>
                <Col xs="10" xl="10" className='  px-0 rounded-2'>
                    <h1 className="text-center display-4 fw-bolder main-heading mb-2">
                        Elevated Brand Presence with DNS Integration.
                    </h1>
                    <Row className='justify-content-center match-height flex-row-reverse'>
                        <Col md="6" className=' p-0  rounded-2  d-flex justify-content-center  align-items-end align-items-md-center  '>
                            <img src={brand} alt="" srcSet="" width={200} />
                        </Col>
                        <Col md="6" className='text-end' style={{display: 'flex', justifyContent: 'center'}}>
                            <div>
                                <h1 className='display-6 main-heading fw-bolder '>Signature Branding.</h1>
                                <h3 className='fs-3 fw-bold text-black '>All emails to your customers go in your brand name and through your brand’s
                                    official email address.</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row className='justify-content-center mt-5 pt-5 match-height '>
                        <Col md="6" className=' p-0 rounded-2  d-flex justify-content-center  align-items-start align-items-md-center  '>
                            <img src={SpamRisk} alt="" srcSet="" width={200} />
                        </Col>
                        <Col md="6" className='text-left ' style={{display: 'flex', justifyContent: 'center'}}>
                            <div>
                                <h1 className='display-6 main-heading fw-bolder'>Reduced Spam Risks.</h1>
                                <h3 className='fs-3 fw-bold text-black '>Email authentication through DNS minimizes the chances of your valuable
                                    messages being flagged as spam or phishing attempts.</h3>
                            </div>

                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className=" justify-content-center mt180 px-2">
                <Col lg="12" xl="10">
                    <h1 className="text-center display-4 fw-bolder main-heading mb-2">
                        Reminder emails for a second shot.</h1>
                    <h3 className="d-flex text-black  text-center fs-1 m-0 mb-1" >
                        A brand-new add-on to post-purchase sign-ups. Non-converting guest customers
                        receive a scheduled friendly reminder to encourage account creation.
                    </h3>
                </Col>
            </Row>

            <Row className=" justify-content-center mt180 px-2">
                <Col lg="12" xl="10">
                    <h1 className="text-center display-4 fw-bolder main-heading mb-2">
                        User consent gathering for future marketing interactions.</h1>
                    <h3 className="d-flex text-black  text-center fs-1 m-0 mb-1" >
                        Email, SMS, newsletter opt-ins during sign-up. Build trust and align promotional
                        efforts with user preferences.
                    </h3>
                </Col>
            </Row>

            <div className='section8Test d-flex flex-column justify-content-center align-items-center mt190 p-0 p-sm-5' style={{ background: "#000" }}>
                <div>
                    <Row className='justify-content-center '>
                        <Col xs="11" md="12" xl="12">
                            <Row className='match-height mt-2 '>
                                <Col lg="6" md="6" className=''>
                                    <h1 className='display-4 fw-bolder  text-white text-start lh-sm ' >100% transparency with guest conversion analysis.</h1>
                                    <div className='ms-auto arrow' >
                                        <img className='d-none d-lg-block ' src="https://uploads-ssl.webflow.com/5fac11c3554384e2baf6481c/61fa78aa61452b33bdbd7c9c_Arrow_01.svg" alt="" width={220} style={{ position: "relative", top: "40px" }} />
                                    </div>
                                </Col>
                                <Col lg="6" md="6" >
                                    <div className="d-flex align-items-center" style={{ whiteSpace: "nowrap" }}>
                                        <h4 className='fs-1 text-white fw-lig m-0'>Real-time performance reports for campaign optimization.</h4>
                                    </div>
                                    <div className='d-flex flex-column p-0 justify-content-end align-items-start mt-2' style={{ background: "#000", border: 'none' }}>
                                        <ul className='d-flex flex-column gap-2 p-0'>
                                            {
                                                Data3.map((data, index) => (
                                                    <li className='d-flex align-items-center gap-3' key={index} ><img src="https://uploads-ssl.webflow.com/5fac11c3554384e2baf6481c/61fa78aa67d329961f45979f_check-icon.svg" alt="" srcSet="" width={30} /><h4 className='fs-1 text-white fw-lig m-0'>{data}</h4></li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>

            <Footer />
        </div>

    )
}
