import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
// import demoImg from './img/demoImg.jpg'
import { FaArrowRight } from "react-icons/fa6"
import video from './images/Leadz.mp4'
import Footer from '../../../utilities/footer/Footer'
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

export const superFaqData = [
    {
        q: "What is SuperLeadz?",
        a: " SuperLeadz is a lead generation pop-up tool to generate 100% self-verified leads, engage them with on-site incentives tailored by visit frequency and engagement, and facilitate one-click offer redemptions for a frictionless purchase journey."
    },
    {
        q: "How is SuperLeadz different from other lead generation & conversion tools?",
        a: (
            <div>
                <p>SuperLeadz is markedly different from other lead generation tools, mainly in these aspects:</p>
                <p>

                    i. Lead Verification: SuperLeadz employs a Dual Verification Process, validating
                    both the authenticity and purchase intent of website visitors through OTP
                    verification. This guarantees the generation of 100% self-verified leads, who
                    can then be incentivized with offers personalized by visit frequency &
                    engagement.</p>
                <p>
                    ii.  Diverse Offer Creation: Merchants can create different types of offers, from
                    flat discount on order value to Buy & Get Free offers.</p>
                <p>
                    iii.Multiple Offer Display: Visitors can choose from multiple offers in a single
                    pop-up interaction, increasing the likelihood of conversions.</p>
                <p>
                    iv.One-Click Offer Redemptions: Leads can click the "Redeem" button adjacent
                    to their selected offer in the pop-up and continue shopping. The chosen offer
                    is automatically applied during the checkout process (even if the shopper
                    forgets!)</p>
            </div >
        )
    },
    {
        q: "How does SuperLeadz personalize and incentivize based on visitor history?",
        a: "  SuperLeadz empowers you to design personalized pop-ups catering to first-time shoppers, returning visitors, and existing customers. It dynamically showcases specific offers tailored to each of these distinct visitor segments. Offers can also be personalized based on engagement e.g. time spent on page, scroll percentage and more."
    },
    {
        q: "How does Super Leadz help me authenticate lead data?",
        a: " Leads self-verify their contact details through One-Time Password (OTP) verification of their email address and/or mobile number. This guarantees 100% authentic lead data for future marketing campaigns."
    },
    {
        q: "How do I know whether Super Leadz is the right tool for me?",
        a: (
            <div>
                <p> Super Leadz is the right tool for you if you want to:</p>
                <p>
                    i.  Reduce website drop-offs and increase average visit time</p>
                <p>ii.  Convert more anonymous visitors into self-qualified leads</p>
                <p>iii. Personalize your communication & incentives for first-time visitors, returning shoppers and registered users</p>
                <p>iv. Display multiple offers within a single pop-up interaction for a lead to choose
                    from</p>
                <p> v. Hyper-customize your pop-ups (multiple offer display, multiple page redirects,
                    placeholder text customization etc.)</p>
                <p>  vi. Give your customers one-click offer redemption for a seamless purchase
                    experience</p>

            </div>
        )
    },
    {
        q: "What is a Lead?",
        a: "Lead is a store visitor who has signaled interest in making a purchase via a SuperLeadz pop-up i.e. they’ve submitted their contact information to receive a special offer."
    },
    {
        q: "What is a SuperLead?",
        a: "SuperLead is a Lead who has self-verified their contact information through One Time Password (OTP) authentication. Besides authenticity, a SuperLead implies interest as well, since the lead has taken the effort to complete the verification process in order to receive an offer. In essence, a SuperLead represents a high-quality, ready-to-convert lead."
    },
    {
        q: "What is a Sales Qualified Lead (SQL)?",
        a: "Lead who has self-verified their contact information through One Time Password (OTP) authentication, specifically with the intention of receiving an offer, qualifies as a Sales Qualified Lead."
    },
    {
        q: "What is a Marketing Qualified Lead (MQL)?",
        a: "Lead who has opted in to receive a newsletter or any other marketing communication in the future is further identified as a Marketing Qualified Lead."
    },
    {
        q: "What is a Visitor Type?",
        a: " Visitor Type identifies a store visitor as a first-time shopper, a returning visitor, or a registered user."
    },
    {
        q: "Who is a First-Time Shopper?",
        a: "First-Time Shopper is a prospective customer who has not previously visited your store. They are identified as such based on their IP address."
    },
    {
        q: "Who is a Returning Visitor?",
        a: "Returning Visitor is a prospective customer who has previously visited your store. They are identified as such based on their IP address."
    },
    {
        q: "Who is a Registered User?",
        a: "Registered User is a prospective or existing customer who has an account with your store."
    },
    {
        q: "What is Lead Rating?",
        a: " Lead Rating categorizes a lead as Cold, Warm, or Hot based on their position in the offer redemption and purchase journey."
    },
    {
        q: "What is a Cold Lead?",
        a: "Cold Lead is a lead who has shared their contact information via a SuperLeadz pop-up and requested a One-Time Password (OTP) but not entered it."
    },
    {
        q: "What is a Warm Lead?",
        a: "Warm Lead is a lead who verifies their contact information by submitting their One-Time Password (OTP) in a SuperLeadz pop-up, receives one or more offers but opts not to redeem them."
    },
    {
        q: "What is a Hot Lead?",
        a: "Hot Lead is a lead who clicks on the Redeem button of a SuperLeadz pop-up with the intent to redeem an offer but ultimately abandons the purchase."
    }
]

export default function SuperLeadzOneClickRedemption() {


    return (
        <>
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
                        <Row className='mt60 d-flex justify-content-center ' >
                            <Col md={7} className='mt-3 mt-lg-0 '>
                            <video autoPlay loop muted className='w-100'>
                                    <source src={video} type='video/mp4' />
                                </video>
                            </Col>

                        </Row>
                        <Row className='mt100'>
                            <Col className='text-center'>
                                <h1 className='display-3 main-heading fw-bolder '>
                                    See it in action.
                                </h1>
                                <Link to="/contact-us" className='btn btn-lg  fs-3 main-btn-dark mt-2 fw-bolder'>
                                    Book a demo
                                </Link>
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
                                <p className='mb-0 ' style={{ fontSize: "1.5rem" }}>View more features</p> <FaArrowRight style={{ marginLeft: "5px" }} />
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
                        <a target='_blank' href='https://apps.shopify.com/superleadz-by-xircls' className='btn btn-lg  fs-3 main-btn-dark mt-2 fw-bolder'>Start for free</a>
                    </Col>
                </Row>
                <div className='mt100'>
                    <hr />
                </div>
                <Footer />
            </div >
        </>
    )
}