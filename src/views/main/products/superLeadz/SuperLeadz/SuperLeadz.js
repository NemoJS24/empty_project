import FaqComponent from '@src/views/main/components/Faq/FaqComponent'
import Footer from '@src/views/main/utilities/footer/Footer'
import React, { useEffect } from 'react'
import { BsArrowRight } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Card, Col, Container, Row } from 'reactstrap'

// icons
import { AiOutlineFileDone } from "react-icons/ai"
import { FiArrowUpRight } from 'react-icons/fi'
import { GiFootsteps } from "react-icons/gi"
import { HiOutlineViewfinderCircle } from "react-icons/hi2"
import { IoMdInformationCircleOutline } from "react-icons/io"
import { MdOutlineDashboardCustomize, MdOutlineImportantDevices } from "react-icons/md"
import { SiConvertio } from "react-icons/si"
import { TbArrowGuide } from "react-icons/tb"
// imgs
import { IoShieldCheckmarkOutline } from 'react-icons/io5'
import CardLeft from '../../../components/CardLeft'
// import gif1 from './images/Horizontal.gif'
// import arrow from './images/arrow.png'
// import giff1 from './images/gif1.gif'
import { Check, X } from 'react-feather'
import { affiliateTracking } from '../../../../Validator'

// faq data
export const superFaqData = [
    {
        q: "What is SuperLeadz?",
        a: "SuperLeadz is a lead generation tool to generate 100% self-verified leads, engage them with on-site incentives tailored by visit frequency and engagement, and facilitate one-click offer redemptions for a frictionless purchase journey."
    },
    {
        q: "How is SuperLeadz different from other lead generation tools?",
        a: <>SuperLeadz is markedly different from other lead generation tools, mainly in these aspects: <br /><br /><div className='mb-1'>1. <strong>Lead Verification:</strong> SuperLeadz employs a Dual Verification Process, validating both the authenticity and purchase intent of website visitors through OTP verification. This guarantees the generation of 100% self-verified leads, who can then be incentivized with offers personalized by visit frequency & engagement.</div><div className="mb-1">2. <strong>Diverse Offer Creation:</strong> Merchants can create different types of offers, from flat discount on order value to Buy & Get Free offers.</div><div className="mb-1">3. <strong>Multiple Offer Display:</strong> Visitors can choose from multiple offers in a single pop-up interaction, increasing the likelihood of conversions. </div><div className='mb-1'>1. <strong>One-Click Offer Redemptions:</strong> Leads can click the "Redeem" button adjacent to their selected offer in the pop-up and continue shopping.The chosen offer is automatically applied during the checkout process (even if the shopper forgets!)</div></>
    },
    {
        q: "How does SuperLeadz incentivize leads in a personalized manner?",
        a: "SuperLeadz empowers you to design personalized pop-ups catering to first-time shoppers, returning visitors, and existing customers. It dynamically showcases specific offers tailored to each of these distinct visitor segments. Offers can also be personalized based on engagement e.g. time spent on page, scroll percentage and more."
    },
    {
        q: "How does SuperLeadz help me build high-quality lists?",
        a: " Leads self-verify their contact details through One-Time Password (OTP) verification of their email address and/or mobile number. This guarantees 100% authentic lead data for future marketing campaigns."
    },
    {
        q: "How do I know whether Super Leadz is the right tool for me?",
        a: (
            <div>
                <p> Super Leadz is the right tool for you if you want to:</p>
                <p>
                    1. Reduce website drop-offs and increase average visit time</p>
                <p>2. Convert more anonymous visitors into self-qualified leads</p>
                <p>3. Personalize your communication & incentives for first-time visitors, returning shoppers and registered users</p>
                <p>4. Display multiple offers within a single pop-up interaction for a lead to choose from</p>
                <p> 5. Hyper-customize your pop-ups (multiple offer display, multiple page redirects, placeholder text customization etc.)</p>
                <p>  6. Give your customers one-click offer redemption for a seamless purchase experience</p>

            </div>
        )
    },
    {
        q: "Can I try out SuperLeadz for free?",
        a: "Yes, you can try out all features of SuperLeadz at no cost, for upto 25,000 page visits per month."
    },
    {
        q: "How does the pricing work?",
        a: "You can try out SuperLeadz for free, with a limit of up to 25,000 page visits per month. Once you surpass this limit, choose a plan based on the monthly average of visits you anticipate on your website."
    },
    {
        q: "What happens if I surpass the allocated number of page visits in my current plan?",
        a: "If you exceed the allocated number of page visits within your current plan, your SuperLeadz campaign will temporarily stop and resume in the next billing cycle. To resume the campaign immediately, upgrade to a higher plan."
    },
    {
        q: "What is the billing date?",
        a: "Billing will occur monthly, and the billing date will be the same as the date of your first purchase."
    },
    {
        q: "Can I cancel at any time?",
        a: <>We prioritize your satisfaction above all else. Should you encounter any challenges or have concerns, please reach out to <a href='mailto:support@xircls.com?subject=Support regarding plan cancellation.' className='text-primary'>support@xircls.com</a> or call/WhatsApp <a href='tel:+91 9969 333 666' className='text-primary'>+91 9969 333 666</a>. We will do our best to assist you. <br /><br /> To cancel your plan subscription, navigate to the Billing section of your Flash Accounts dashboard. <br /><br />Please note: After you cancel your subscription, your account will automatically revert to the free plan, which has no expiry date, allowing you to use it indefinitely. </>
    }
]
export default function SuperLeadz() {


    const smartData = [
        {
            icon: <HiOutlineViewfinderCircle />,
            p: "Visit Frequency Segmented.",
            s: "From first-time and returning shoppers to registered users, every visitor segment receives a tailored experience across design, content and offers."
        },
        {
            icon: <GiFootsteps />,
            p: "Behaviour Driven",
            s: "Pop-ups that respond to distinct user actions such as scroll trigger or time spent on page, enhance engagement without being intrusive."
        },
        {
            icon: <TbArrowGuide />,
            p: "Interest-Guided Selling",
            s: "Shoppers are redirected to store sections that correspond with the offer they selected, optimizing their journey to their desired products."
        },
        {
            icon: <MdOutlineImportantDevices />,
            p: "Device-Responsive Design",
            s: "Layouts are optimized and customizable for a consistent and adaptive experience across multiple devices."
        }

    ]

    const headingData = [
        {
            id: 0,
            heading: 'Identify',
            para: 'Lead source tracking. Google, Instagram ads etc. or organic.',
            icon: <IoShieldCheckmarkOutline />
        },
        {
            id: 1,
            heading: 'Personalize',
            para: 'Customized communication & incentives to optimize conversions.',
            icon: <MdOutlineDashboardCustomize />
        },
        {
            id: 2,
            heading: 'Verify',
            para: 'Leads self-verify themselves. Offers reach only a genuine, invested audience.',
            icon: <AiOutlineFileDone />
        },
        {
            id: 3,
            heading: 'Convert',
            para: 'One-click offer redemption for seamless checkouts. No codes to remember or copy-paste.',
            icon: <SiConvertio />
        }
    ]


    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.get('aft_no') || localStorage.getItem('aft_no')) {
            affiliateTracking(params.get('aft_no') ? params.get('aft_no') : localStorage.getItem('aft_no'))
        }
    }, [])


    return (
        <>


            {/* style={{ border: '1px solid #d9d9d9' }} */}

            <div style={{ background: "#fff" }} className=' '>
                <style>
                    {`
                    .vsCont{
                        margin-top:-75px;
                    }
                    @media only screen and (max-width: 600px) {
                        .vsCont{
                            margin-top: 0px !important;
                            padding: 50px 0px;
                        }
                      }
                    `}
                </style>

                {/* Section 1 */}
                <div className='mt160  ' >
                    <Row className=' justify-content-center'>
                        <Col xs='11' lg="11" className='' >
                            <Row className='' >
                                <Col md="7" className='d-flex justify-content-center flex-column align-items-start'>
                                    <div className=' text-sm-start '>
                                        <h3 className='fs-3 fw-bolder  text-dark text-start'>LEAD GENERATION POP-UPS</h3>
                                        <h1 className='display-1 lh-83 text-md-start main-heading fw-bolder'>
                                            Built to Convert
                                        </h1>
                                        <h1 className=' text-black  mt-1 text-start'>Strengthen your sales cycle with high-intent, verified leads.<br />
                                            Reduce marketing wastage. Increase Revenue.</h1>
                                        <div className=' d-flex  justify-content-start align-items-center gap-1  mt-2' >
                                            <a target='_blank' href='https://apps.shopify.com/superleadz-by-xircls' className='btn  main-btn-blue fs-3'>Install on Shopify</a>
                                            <Link to="/contact-us" className="fs-3 text-primary"> Schedule a demo<BsArrowRight /></Link>
                                        </div>
                                    </div>
                                </Col>
                                <Col md="5" className='align-items-center justify-content-center mt-1 mt-md-0 ' >

                                    <video className='w-100' controls src="https://xircls-static-files.s3.amazonaws.com/website_statics/superleadz_preview.mp4" width="400" height="300" autoPlay muted loop />
                                    {/* <img src={"https://api.xircls.com/static/images/website-slide/videos/XIRCLS%20E-Commerce%20Demo.mp4"} alt='...' style={{ width: '100%' }} /> */}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>


                <div className='mt180 px-1'>
                    <h1 className=' text-center display-2 lh-83 text-start main-heading fw-bolder'>
                        {/* What makes a lead a SuperLeadz? */}
                        Who is a SuperLead?
                    </h1>
                    <Row className='justify-content-center  px-1 ' >
                        <Col md="8" className=' text-center main-heading  ' >
                            <h1 className='text-center text-black ' >A high-potential customer who willfully shares and verifies their contact information to receive an incentive, thus demonstrating a clear intent to purchase.</h1>

                        </Col>
                    </Row>
                    <Row className='justify-content-center  pt-5 ' >

                        <Col xs="10" md="4" className=' text-center main-heading  ' >
                            <h1 className='display-5 text-black fw-bolder ps-2 pt-0  mb-2'>Regular Lead</h1>

                            <div className=' h-100  '>
                                <p className='fs-1 fw-lig'>Visit</p>
                                <p className='fs-1  fw-lig'>+</p>
                                <p className='fs-1 fw-lig'>Generic website engagement</p>
                                <p className='fs-1  fw-lig '>&</p>
                                <p className='fs-1 fw-lig'>No self-verification</p>
                                <p className='fs-1 fw-lig'>=</p>
                                <div className='d-flex  justify-content-center align-items-center '>
                                    {/* <img src={arrow} alt="" style={{ transform: "rotate(90deg)", height: "50px" }} /> */}
                                    <X size={'50px'} />
                                    <p className='display-1 '>100 %</p>
                                </div>

                                <p className='fs-1  fw-lig'>unverified, no-intent leads</p>
                                <p className='fs-3 '>80% unverified intent emails</p>
                                <p className='fs-3 '>5% to 15% incorrect emails</p>
                                <p className='fs-3 '>5% bot emails</p>
                            </div>
                        </Col>
                        <Col md="2" className='d-flex align-items-center justify-content-center' >
                            <h1 className='display-1 text-black d-flex vsCont' >
                                <p>V</p>
                                <p className='mt-1 ' style={{ marginLeft: "-13px" }}>S</p>

                            </h1>
                        </Col>

                        <Col xs="10" md="4" className=' text-center main-heading ' >
                            <h1 className='display-5 text-black ps-2 pt-0 fw-bolder px-2 mb-2'>SuperLeadz</h1>

                            <div className='fw-lig' >
                                <p className='fs-1 fw-lig'>Visit</p>
                                <p className='fs-1  fw-lig'>+</p>
                                <p className='fs-1 fw-lig'>Purchase-intent engagement</p>
                                <p className='fs-1  fw-lig'>+</p>
                                <p className='fs-1 fw-lig'>Self-verification</p>
                                <p className='fs-1 fw-lig'>=</p>
                                <div className='d-flex  justify-content-center align-items-center '>
                                    {/* <img src={arrow} alt="" style={{ transform: "rotate(-90deg)", height: "50px" }} /> */}
                                    <Check size={'50px'} />
                                    <p className='display-1 '>100 %</p>
                                </div>
                                <p className='fs-1 fw-lig'>verified, real high-intent leads</p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* SECTION 2 */}

                <div className='section5 d-flex justify-content-center align-items-center flex-wrap mt180' style={{ background: "#f2f2f2" }} >

                    <Row className=' justify-content-center'>
                        <Col md='10' className='  d-flex justify-content-center flex-column align-items-center p-2 p-md-5 px-1' >
                            <div className=' text-center text-sm-start ' >
                                <h3 className='display-3  main-heading fw-bolder pt-5' >What is SuperLeadz?</h3>
                                <h3 className='display-4 fw-bolder text-secondary pb-5 px-1 ' style={{ lineHeight: '1' }}>SuperLeadz generates 100% self-verified leads, tailors rewards to match visit frequency and engagement, and facilitates one-click offer redemptions for a frictionless purchase journey.</h3>
                            </div>

                        </Col>
                    </Row>
                </div>

                {/* SECTION TEST 1 */}
                <style>
                    {
                        `
                            .lh40{
                                line-height:40px !important;
                            }
                            @media only screen and (max-width: 600px) {
                                .lh40{
                                    line-height:25px !important;
                                }
                            }
                            `
                    }
                </style>
                <div className='mt180'>
                    <Row className='mt180 justify-content-center'>
                        <Col xs="11" md="11" className='text-center' >
                            <div className=''>
                                <h1 className='text-center display-2 text-start main-heading fw-bolder m-0'>Not all Website Visitors are Leads.</h1>
                                <h1 className=' justify-content-center display-5 text-black fw-bolder m-0 px-2 ' >In fact, they are not even human <IoMdInformationCircleOutline size={15} style={{ marginTop: "-20px", marginLeft: "-5px" }} /></h1>

                                <div className='mt-2 md-mt-5 '>

                                    <h1 className='lh40 justify-content-center text-black px-0 px-md-2 '>The SuperLeadz Dual Verification Process validates both the authenticity and purchase intent of visitors.<br />This qualification is further refined by analyzing visit frequency and engagement in real time, enabling incentive targeting for maximum revenue optimization.</h1>
                                    <h1 className='fs-5 justify-content-center text-black px-2  pb-2 fst-italic' >
                                        <IoMdInformationCircleOutline size={12} style={{ marginTop: "-5px", marginRight: "2px" }} />In 2022, nearly half (47.4%) of all internet traffic came from bots​ <Link to="https://www.imperva.com/blog/2023-imperva-bad-bot-report-key-learnings/" className="fs-5 text-primary">(Imperva Bad Bot Report 2023)</Link>  </h1>
                                </div>
                            </div>
                        </Col>
                    </Row>


                    {/* <div className='text-center'>
                            <h1>Visitor Arrives</h1>

                            
                        </div> */}
                </div>

                {/* SECTION 2.1 */}


                {/* Replace Section */}
                <div className='mt180'>
                    <h1 className=' text-center display-2 lh-83 text-start main-heading fw-bolder px-2 pb-3'>
                        Replace Data Lists <br /> with Real People
                    </h1>
                    <Row className='justify-content-center px-2 gap-1' >

                        <Col xs="12" md="5" className='text-center border rounded headings-compact content-max-width font-size-normal p-2' >
                            <div className='d-flex justify-content-center' >
                                <h1 className='display-5 text-black ps-2 fw-bolder px-2 '>Incentivize.</h1>
                            </div>
                            <h3 className='h3 justify-content-start text-black px-2 pt-0 pb-2' >Offers are displayed within the pop-up itself, not sent to an email inbox. Visitors stay focused on their shopping journey.</h3>
                        </Col>
                        <Col xs="12" md="5" className='text-center border rounded headings-compact content-max-width font-size-normal  p-2' >
                            <div className='d-flex justify-content-center' >
                                <h1 className='display-5 text-black ps-2 pt-0 fw-bolder px-2 '>Verify!</h1>
                            </div>
                            <h3 className='h3 justify-content-start text-black px-2 pt-0 pb-2' >One-time-password (OTP) verification. Visitors share & verify their information for an instant reward.</h3>
                        </Col>
                    </Row>
                </div>

                {/* SECTIOON 3 */}


                <Row className=' mt170 justify-content-center '>
                    <Col xs="10" xl="10" className='  px-0 rounded-2'>

                        <div className='text-center  border-bottom mt-0'>
                            <h1 className='display-2 main-heading fw-bolder mb-3'>Precision At Every Step</h1>
                        </div>

                        <Row className='  justify-content-center '>
                            {
                                headingData.map((data, index) => (
                                    <Col md="5" key={index} >
                                        <CardLeft icon={data.icon} title={data.heading} desc={data.para} />

                                    </Col>
                                ))
                            }

                        </Row>

                    </Col>
                </Row>
                {/*SECTION 6*/}

                <Container fluid='sm' className='mt180 pb-5' style={{ background: '#000' }}>
                    <Row className='mt180 justify-content-center'>
                        <Col xs="11" md="11" className='text-center' >
                            <div className='' style={{ background: '#000' }}>
                                <h1 className='display-2 text-white  pt-4 fw-bolder'>Shorten your sales cycle.</h1>
                                <h1 className=' justify-content-center text-white px-2  pb-5' >Start strong with high-intent SuperLeadz. Speed up sales.
                                    Boost your lead conversion rate.</h1>
                                {/* <Link to='/merchant/signup' className='main-btn-blue fs-4 mt-1 mb-1'>Get started for free</Link> */}
                                <Link to='/merchant/signup' className=' btn btn-lg  main-btn-blue2 fw-lig fs-3 '>Get started for free</Link>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* SECTION 7 */}

                <div className='d-flex flex-column gap-5 mt180'>

                    <Row className='justify-content-center py-0 text-center ' >
                        <Col xs="11" md="11" xl="11" className=''>
                            <Container fluid='lg'>
                                <h1 className='display-4 main-heading fw-bolder '>No more single-incentive pop-ups. </h1>
                                <h3 className='fs-1  text-black lh-32   '>Multiple offers displayed at once. Shoppers decide what they like best.</h3>


                            </Container>
                        </Col>
                    </Row>
                </div>
                <div className='d-flex flex-column gap-5 mt180'>

                    <Row className='justify-content-center py-0 text-center ' >
                        <Col xs="11" md="11" xl="11" className=''>

                            <h1 className='display-4 main-heading fw-bolder  '>Hyper-segmentation for
                                personalized experiences.</h1>
                            <h3 className='fs-1  text-black lh-32   '>Seamlessly tailored shopping journeys through real-time interaction mapping.</h3>
                        </Col>
                    </Row>
                </div>

                {/* SECOND SUBSECTION */}

                <div className='d-flex flex-column gap-5  mt180'>

                    <Row className='justify-content-center py-0 text-center' >
                        <Col xs="11" md="12" xl="11" className=''>

                            <h1 className='display-4 main-heading fw-bolder '>Trace every lead’s journey through your store.</h1>
                            <h4 className='fs-1  text-black lh-32 '>Understand your leads by the choices they make. Stick to the sale with hot leads. Exclude marketing-averse leads .</h4>

                        </Col>
                    </Row>
                </div>

                {/* SECTION 8 */}
                <div className='px-0 px-lg-5'>

                    <Row className=' mt170 justify-content-center '>
                        <Col xs="10" lg="12" xl="10" className='  px-0 rounded-2'>

                            <div className='text-center  border-bottom mt-0'>
                                <h1 className='display-2 main-heading fw-bolder'>Smart Interactivity</h1>
                                <h1 className='text-dark mb-3' >Dynamic pop-ups that adapt in real time to engage every kind of visitor.</h1>
                            </div>
                            <Row className='  justify-content-center '>
                                {
                                    smartData.map((data, index) => (
                                        <Col md="6" key={index} >
                                            <CardLeft icon={data.icon} title={data.p} desc={data.s} />

                                        </Col>
                                    ))
                                }

                            </Row>

                        </Col>
                    </Row>
                </div>
                {/* SECTION 10 */}

                <div className='mt180'>
                    <h1 className=' text-center display-2 lh-83 text-start main-heading fw-bolder'>
                        Shopping-Friendly Interface.
                    </h1>
                    <h1 className='text-center text-black px-2 pt-0 pb-0' >Nothing will distract your shoppers from doing what’s most important - make a purchase.</h1>
                    <Row className='    justify-content-center px-2 pt-3 pb-3 gap-2' >
                        <Col xs="12" md="5" className='text-center border rounded headings-compact content-max-width font-size-normal p-2' >
                            <div className='d-flex justify-content-center' >
                                <h1 className='display-6 text-black ps-2 pt-0 px-2 fw-bolder'>No Site Abandonments.</h1>
                            </div>
                            <h3 className='h3 justify-content-start text-black px-2 pt-0 pb-2' >Offers are displayed within the pop-up that the shopper interacts with. </h3>
                        </Col>
                        <Col xs="12" md="5" className='text-center border rounded headings-compact content-max-width font-size-normal p-2' >
                            <div className='d-flex justify-content-center' >
                                <h1 className='display-6 text-black ps-2 pt-0 px-2 fw-bolder '>No Coupon Codes to Copy-Paste.</h1>
                            </div>
                            <h3 className='h3 justify-content-start text-black px-2 pt-0 pb-2' >Shoppers click ‘Redeem’ on the offer they want and continue shopping. Code is auto-applied at checkout.  </h3>
                        </Col>
                    </Row>
                </div>

                {/* Section 12 */}

                <div className='mt180'>
                    <Row className=' justify-content-center align-items-center pb-5' style={{ background: '#000' }}>

                        <Col xs="10" md="10" lg="11">

                            <Row className='justify-content-center'>
                                <Col md="5" className='mt-3 me-5'>
                                    <h3 className='display-2 text-light fw-bolder float-start ps-1'>SuperLeadz in Action.</h3>
                                </Col>
                                <Col md="7" lg="5">
                                    <div className=' text-center text-sm-start border-bottom-white' >
                                        <h3 className='display-2  text-light fw-bolder pt-5' style={{ lineHeight: '0.7' }}>11X</h3>
                                        <h6 className='fs-3 text-light pb-5'>ROI in 7 months</h6>
                                    </div>
                                    <div className=' text-center text-sm-start border-bottom-white' >
                                        <h3 className='display-2  text-light fw-bolder pt-5' style={{ lineHeight: '0.7' }}>46%</h3>
                                        <h6 className='fs-3 text-light pb-5'>Increase in sales in 3 weeks</h6>
                                    </div>

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                {/*SECTION 13 */}

                <div className='mt180'>
                    <Row className='mt180 justify-content-center px-2 pt-3 pb-3 gap-2' >
                        <h1 className='display-2  main-heading fw-bolder text-center mb-2 mb-md-5 '>Start for free and pay as you grow.</h1>
                        <Col xs="12" md="5" className='text-start rounded headings-compact content-max-width font-size-normal p-2' style={{ background: '#000' }}>
                            <div className='d-flex justify-content-between' >
                                <h1 className='display-5 text-light ps-2 pt-0 px-2 '>Free plan</h1>
                                {/* <h1 className='ps-2 display-4 px-2 text-light'>$0</h1> */}
                            </div>
                            <h3 className='h3 justify-content-start text-light px-2 pt-0 pb-2' >Includes all features, upto 1,000 pop-up views.</h3>
                            <div>
                                <Link to="/merchant/signup" className=" btn  main-btn-blue2 fs-4 fw-lig mt-3 mb-1 text-center ms-2 " type="button" style={{ minWidth: "130px" }}>Get Started</Link>
                            </div>
                        </Col>
                        <Col xs="12" md="5" className='text-start rounded headings-compact content-max-width font-size-normal  p-2' style={{ background: '#c9e8f5' }}>
                            <div className='d-flex justify-content-between' >
                                <h1 className='display-5 text-black ps-2 pt-0 px-2 '>Paid plans</h1>
                                {/* <h1 className='ps-2 display-4 px-2 text-black'>$45</h1> */}
                            </div>
                            <h3 className='h3 justify-content-start text-black px-2 pt-0 pb-2' >Includes all features, upto 125,000 pop-up views.</h3>
                            <div>
                                <Link to='/products/superleadz/pricing' className=" btn  main-btn-blue2 fs-4 fw-lig mt-3 mb-1 text-center ms-2" type="button" style={{ minWidth: "130px" }}>Explore</Link>
                            </div>
                        </Col>
                    </Row>
                </div>


                <div>
                    <Row className=' justify-content-center mt170 '>
                        <Col lg="12" xl="10">
                            <Card className='shadow-none p-2 p-md-5 border overflow-hidden ' style={{ background: "#e5e7eb" }}>
                                <Row>
                                    <Col md="6">
                                        <h1 className='mainHeader display-2 main-heading fw-bolder m-0 '>
                                            No code.<br />
                                            No developers.
                                        </h1>
                                        <h1 className='fs-1 main-heading m-0 mt-1'>
                                            Install and go live within minutes. We’ll be there to guide you
                                            along the way.
                                        </h1>

                                        <br />

                                        <Link to='/products/superleadz/features/' className='btn  btn-lg  fs-4 fw-lig main-btn-dark px-3  py-md-1'>Learn More <FiArrowUpRight className='fs-4' style={{ marginLeft: "3px", marginBottom: "2px" }} /></Link>
                                    </Col>

                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Section 1.5 */}

                <Container fluid='sm' className='mt180 pb-5' style={{ background: '#fff', borderBottom: '20px solid #fff' }}>
                    <Row className='mt180 justify-content-center'>
                        <Col xs="11" md="11" className='text-center' >
                            <div className='' style={{ background: '#fff' }}>
                                <h1 className='text-center display-2 lh-83 text-start main-heading fw-bolder '>Go live in minutes</h1>
                                <Link to='/merchant/signup' className=' btn main-btn-blue fs-4 mt-1 mb-1 fw-lig'>Get started for free</Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
                {/* Section 9 */}
                <div className='py-3' style={{ background: "#000" }}>

                    <FaqComponent data={superFaqData} name='partner' theme='theme-black' />
                </div>
                <Footer />


            </div>
        </>
    )
}