/* eslint-disable no-unused-vars */
import React from 'react'
import { FaArrowTrendDown } from 'react-icons/fa6'
import { Col, Container, Row } from 'reactstrap'
import CardLeft from '@src/views/main/components/CardLeft'

// imgs
import fromImg from './imgs/form.png'
import demoImg from './imgs/signUp.png'
import fromImg2 from './imgs/form2.png'
import loyalImg from './imgs/RepeatPurchases.png'
import personalImg from './imgs/First-step-to-loyalty.png'
import expImg from './imgs/Streamlined-customer-experience.png'
import gif1 from './imgs/flashAcc_vid.gif'
import discImg from './imgs/Data-driven.png'
import discImg2 from './imgs/Personalized-engagement.png'
import discImg3 from './imgs/Brand-advocacy.png'
import Footer from '../../utilities/footer/Footer'
import FaqFlash from './FaqFlash'
import Faqcomponent from './Faqcomponent'
export default function FlashAccount() {


    const CreationData = [
        {
            // icon: <FaArrowTrendDown />,
            imgSrc: loyalImg,
            title: "Repeat purchases",
            desc: "Signed-up customers who receive strong after-sales support and personalized offers are more likely to buy again."
        },
        {
            imgSrc: personalImg,    
            title: "First step to loyalty",
            desc: "Regular communication fosters a deeper bond with your brand among registered users."
        },
        {
            imgSrc: expImg,
            title: "Streamlined customer experience",
            desc: "More efficient checkouts, relevant recommendations, and access to exclusive offers enhance overall satisfaction."
        },
        {
            imgSrc: discImg2,
            title: "Personalized engagement",
            desc: "With customer information securely stored through sign-ups, marketing strategies can be tailored to match individual preferences."
        },
        {
            imgSrc: discImg,
            title: "Data-driven decision making",
            desc: "Analyzing the behaviour, preferences, and purchase history of registered customers makes marketing easier and boosts your returns."
        },
        {
            imgSrc: discImg3,
            title: "Brand advocacy",
            desc: "By encouraging registered customers to refer friends, leave reviews etc., you cultivate brand ambassadors who help expand customer reach."
        }   
    ]
    return (
        <div >
            <div fluid='sm' className='mt190' >
                <Row className=' justify-content-center'>
                    <Col xs='11' lg="11" className='' >
                        <Row className=' ' >
                            <Col md="7" className='d-flex justify-content-center flex-column align-items-start'>
                                <div className='  text-md-start '>
                                    <h3 className='fs-3 fw-bolder  text-dark '>ACCOUNT CREATION</h3>
                                    <h1 className='display-1 lh-83 text-start main-heading fw-bolder'>
                                    Convert Guest Customers into Registered Users.
                                    </h1>

                                    <h1 className=' text-black  mt-1' >Effortlessly build your customer base with
                                        <br />
                                        a discreet account creation prompt on your store's Thank You page.
                                    </h1>
                                    <div className=' d-flex  justify-content-start align-items-center gap-1  mt-2' >
                                        <h3 className=' btn  main-btn-blue fs-3 fw-lig '>Dummy button</h3>
                                        {/* <Link to="/contact-us" className="fs-3 text-primary"> Schedule a demo<BsArrowRight /></Link> */}
                                    </div>
                                </div>
                            </Col>
                            <Col md="5" className='d-flex text-center align-items-center ' >
                                <img src={gif1} alt='...' style={{
                                    width: '680px',
                                    height: '90%',
                                    '@media (max-width: 600px)': {
                                    width: '50%',
                                    height: 'auto'
                                    }
                                }} />

                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className='mt240'>
                <h1 className=' text-center display-2 lh-83 text-start main-heading fw-bolder'>
                Stop Losing Valuable First-Visit Buyers.
                </h1>
                {/* <Row className='justify-content-center px-2 pt-3 pb-3 gap-2' >
                    <Col xs="10" md="5" className='text-center  rounded  ' >
                        <h1 className=' fs- text-black px-2 pt-0 pb-2' >Encouraging sign-ups isn't just a transactional step; it's an investment in the
                            long-term success of your business.</h1>
                    </Col>
                    <Col xs="10" md="5" className='text-center  rounded  ' >

                        <h1 className=' fs- text-black px-2 pt-0 pb-2' >A growing community of engaged users creates a foundation that withstands
                            market changes and positions your brand for sustained growth.</h1>
                    </Col>

                </Row> */}
                 <h1 className='text-center' style={{paddingRight:"18%", paddingLeft:"18%"}}>
                Shoppers who buy on their first visit already display significant trust and interest that can grow into long-term loyalty, especially when they're in your customer database.
                </h1>
            </div>

            <Row className=" justify-content-center mt180 ">
                <Col lg="10" xs="10">
                    <h1 className=' text-center display-2 lh-83 text-start main-heading fw-bolder'>
                        Loyalty begins at sign-up.
                    </h1>
                    <Row className='justify-content-center  mt-5 ' >
                        <Col md='6' className='d-flex justify-content-center    ' >
                            <div className=' ' >
                                <img src={demoImg} className=' rounded-4 ' alt="" width={450} />
                            </div>
                        </Col>
                        <Col md="6" className='  rounded  mt-auto mb-auto m' >
                            <h1 className=' fs- text-black ' >A positive first-purchase interaction has a profound impact on the
                                trajectory of your customer-brand relationship.</h1>

                            <h1 className=' fs- text-black mt-3' >Seize this powerful moment with a discreet instant account creation
                                prompt on your store's Thank You page.</h1>
                        </Col>

                    </Row>
                </Col>
            </Row>


            <Row className=" justify-content-center mt180 ">
                <Col lg="10" xs="10" >
                    <h1 className='display-2 fw-bolder text-center  main-heading'>Why Account Creation Matters</h1>
                    <Row className='  justify-content-center '>
                        {
                            CreationData.map((data, index) => (
                                <Col md="6"  key={index}>
                                    <CardLeft imgSrc={data.imgSrc} title={data.title} desc={data.desc} />
                                </Col>
                            ))
                        }

                    </Row>
                </Col>
            </Row>
            
            <div className='mt180'>
                <h1 className=' text-center display-2 lh-83 text-start main-heading fw-bolder'>
                    Future-proof your revenue growth.
                </h1>
                <Row className='justify-content-center px-2 pt-3 pb-3 gap-2' >
                    <Col xs="10" md="5" className='text-center  rounded  ' >
                        <h1 className=' fs- text-black px-2 pt-0 pb-2' >Encouraging sign-ups isn't just a transactional step; it's an investment in the
                            long-term success of your business.</h1>
                    </Col>
                    <Col xs="10" md="5" className='text-center  rounded  ' >

                        <h1 className=' fs- text-black px-2 pt-0 pb-2' >A growing community of engaged users creates a foundation that withstands
                            market changes and positions your brand for sustained growth.</h1>
                    </Col>

                </Row>
               
            </div>

            <div className='section5 d-flex justify-content-center align-items-center flex-wrap mt180'  style={{ background: "#f2f2f2" }}>
                    <Row className=' justify-content-center'>
                        <Col md='10' className='  d-flex justify-content-center flex-column align-items-center p-5' >
                            <div className=' text-center text-sm-start ' >
                                <h3 className='display-3  main-heading fw-bolder ' >Ready-Made Strategies & Brand Voice Selection</h3>
                                <Row className="   justify-content-center mt-3">
                                    <Col lg='6' className=" P">
                                        <h3 className='display-5 fw-bolder text-black ' > Don't know where to start? </h3>
                                    </Col>
                                    <Col lg='6' className=" ">
                                        <h3 className='display-6 fw-lig text-black ' >We have you covered. Benefit from ready-made
                                            strategies to enhance user engagement and select a brand voice that
                                            resonates with your audience.</h3>
                                    </Col>
                                </Row>

                            </div>

                        </Col>
                    </Row>
            </div>
            <div className='mt180'>
                <h1 className=' text-center display-2 lh-83 text-start main-heading fw-bolder'>
                Diverse strategies for every kind of customer.
                </h1>
                <Row className='justify-content-center px-2 pt-3 pb-3 gap-2' >
                    <h1 className=' fs- text-black px-2 pt-0 pb-2 text-center'>Personalized for your brand identity.</h1>
                    <Col xs="10" md="5" className='text-center  rounded  ' >
                        <h1 className="text-black fw-bolder fs- text-center">Strategies</h1>
                        <ul className='mt-3'>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >Newsletter Subscription</h1></li>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >VIP Membership</h1></li>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >Birthday Incentives</h1></li>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >Birthday Incentives</h1></li>
                            <h1 className=' fs- text-black px-2 pt-0 pb-2 float-end mt-5 bottom-0' >more...</h1>
                        </ul>
                    </Col>
                    <Col xs="10" md="5" className='text-center  rounded  ' >
                        <h1 className="text-black fw-bolder fs- text-center">Brand Voice</h1>
                        <ul className='mt-3'>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >Direct</h1></li>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >Casual/Chatty</h1></li>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >Sophisticated</h1></li>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >Urgent</h1></li>
                            <li><h1 className=' fs- text-black px-2 pt-0 pb-2' >Prescriptive</h1></li>
                            <h1 className=' fs- text-black px-2 pt-0 pb-2 float-end ' >more...</h1>
                        </ul>
                    </Col>

                </Row>
                
               
            </div>
            <div style={{backgroundColor:"#000"}} className="py-3">
                <Faqcomponent />
            </div>

            {/* <Row className="justify-content-center mt180 align-items-center    " >
                <Col lg='11' xs='10'>
                    <Container fluid='sm' className='p-0 border rounded-2 py-3'>

                        <Row className="   align-items-center justify-content-center">
                            <Col lg='5' className="d-flex align-items-start justify-content-center ">
                                <img src={demoImg} alt="" srcSet="" width={350} />
                            </Col>
                            <Col lg='7' className=" ">
                                <h1 className="display-3 main-heading  fw-bolder ">
                                    Second Shot Sign-ups
                                </h1>
                                <h2 className="text-black fs-2 fw-lig mt-1">
                                    A second shot at guest customers who bounce off without engaging with the
                                    Flash Accounts widget on the Thank You page. Email reminder scheduling and
                                    engagement tracking.</h2>

                            </Col>
                        </Row>
                    </Container>
                </Col>

            </Row> */}
            <hr className='mt100' />
            <Footer />

        </div>
    )
}
