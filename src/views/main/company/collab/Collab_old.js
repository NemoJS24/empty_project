import React from 'react'
import { Col, Row } from 'react-bootstrap'
import competition from './Images/competition.png'
import bulb from './Images/bulb.png'
import field from './Images/field.png'
import thoughts from './Images/thoughts.png'
import accessibility from './Images/accessibility.png'
import click from './Images/click.png'
import connection from './Images/connection.png'
import collab from './Images/collab.png'
import bow from './Images/bow.png'
import scissors from './Images/scissors.png'
import affordable from './Images/affordable.png'
import advanced from './Images/advanced-customer.png'
import ethical from './Images/ethical-marketing.png'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import Footer from '@src/views/main/utilities/footer/Footer'
import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'

const Collab = () => {

    const CardData = [
        {
            title: (<>This is title one,<br /> Not Competition</>
            ),
            items: [
                { subTitle: "Think back to every achievement or landmark event in your personal or professional life and you will remember the people around you who helped make it possible." },
                { subTitle: "In a fear-driven world, we fixate on competition. Forgetting that for every competitor, there are hundreds of potential collaborators who would love to partner with you. Why not start there?" },
                { subTitle: "If life on this planet and human society itself thrives through collaboration, why not apply the same to business?" }
            ],
            image: competition
        },
        {
            title: "What if Businesses Helped Each Other Reach Their Marketing Goals?",
            items: [
                { subTitle: "XIRCLS started out by asking this simple question." },
                { subTitle: "Every day, thousands of companies invest time, money and resources individually to market to the same customer base." },
                { subTitle: "On advertising & marketing platforms, businesses bid and compete to grab the attention of potential customers, pushing ad prices higher and ROIs lower." },
                { subTitle: "Meanwhile, consumers are bombarded with marketing messages that rarely make an 'impression' and are perceived to be a nuisance." },
                { subTitle: "On advertising & marketing platforms, businesses bid and compete to grab the attention of potential customers, pushing ad prices higher and ROIs lower." }
            ],
            image: bulb
        },
        {
            title: "A global level playing field.",
            items: [
                { subTitle: "XIRCLS helps counter corporate monopolies with a technology that essentially brings human beings together to make resources easily shareable and their end goals easily attainable - with no central authority or hidden agendas." },
                { subTitle: "We picture XIRCLS bringing people together across sectors, across platforms, across touchpoints, across borders, across cultures... across the world." }
            ],
            image: field
        },
        {
            title: "Help, just a thought away.",
            items: [{ subTitle: "From a one-man show to small and medium size enterprises to global companies, everybody can benefit from collaboration. We’ve created a worldwide platform for businesses to instantly connect with one another and collaborate 100% virtually, within minutes. Never feel alone again." }],
            image: thoughts
        },
        {
            title: "What Collaboration means to us.",
            items: [
                { subTitle: "In an ‘Every Man for Himself’ kind of world, it’s no surprise that we’re often asked- what’s in it for XIRCLS, especially in the long run?" },
                { subTitle: "Collaboration, to us, will always mean one thing - that we are all in it together." },
                { subTitle: "Yes, we have big dreams. Yes, we want to make the world a gentler place. Yes, we want to create a safe haven for businesses dying every day in the face of crony capitalism and hateful greed." },
                { subTitle: "But we’re not in it for the glory. We promise to leave that - as well as your customers and profits - to you, our merchants. That’s why XIRCLS will never communicate with your customers directly. We’ll try our very best to remain anonymous to your customers." }
            ],
            image: ""
        },
        {
            title: "We want to create a viable alternative to online advertising that is accessible to every merchant in the world.",
            items: [{ subTitle: "The uneven distribution of power, abysmally low ROIs, transparency issues, ad fraud and privacy concerns that plague advertising today have been our starting points. By creating a 100% transparent and decentralized marketing model, XIRCLS is the first marketing platform in the world that resolves all of the above concerns and puts the power squarely in the hands of businesses who use it." }],
            image: accessibility
        },
        {
            title: " Changing the world, one company at a time. ",
            items: [{ subTitle: "We acknowledge the huge mindshift required to counter decades of advertising thinking among businesses and marketing professionals. That is part of the reason why we’ve kept our pricing incredibly simple. Our pay-as-you-go model makes it possible for any business to start using our platform from today and discover a whole new way to market." }],
            image: click
        },
        {
            title: "We’re here to address inefficient systems.",
            items: [{ subTitle: "Through collaboration-driven innovations, our mission is to address problems of cost, access and quality for players in every industry. We don’t see competitors, only future partners. If you sense a synergy between XIRCLS and what your company does, let’s talk." }],
            image: connection
        },
        {
            title: (<h1 className='display-2 main-heading fw-bolder'>Benefits of Collaborative Marketing:</h1>),
            items: [{ subTitle: "" }],
            image: ""
        },
        {
            title: "Instant collaborations with any business in the world.",
            items: [{ subTitle: "Our platform makes it possible to run collaborative marketing campaigns with almost anybody, be it a global brand, a niche e-commerce company, an NGO, a professional or a local dairy farmer in rural India." }],
            image: collab
        },
        {
            title: "Address genuine customers who are most likely to buy from you, right now.",
            items: [{ subTitle: "Strategic collaborations make it possible for you to market to real-time buyers in allied categories and therefore, most likely to need your product/service." }],
            image: bow
        },
        {
            title: "Dramatically reduce your marketing & customer retention costs.",
            items: [{ subTitle: "We’ve used the power of collaboration to make marketing precise yet low-priced, so that no business feels left out." }],
            image: scissors
        },
        {
            title: "Make products & services more affordable.",
            items: [{ subTitle: "By keeping marketing costs down and raising ROIs, companies can pass on their savings to customers, increase access and expand their addressable market. In the context of industries like healthcare, collaborative marketing can literally save lives." }],
            image: affordable
        },
        {
            title: "Accountability = ethical marketing.",
            items: [
                { subTitle: "Collaborative marketing is all about relationships - between companies and their customers. And when businesses themselves become marketing channels for each other, ethical practices become everyone’s priority." },
                { subTitle: "We’ve managed to address this concern and eradicate many evils in advertising (think spam, ad fraud, lack of measurability etc.) at its very root, ensuring customers always receive messages of value and companies know exactly what they’re paying for. At a B2B level, our network-based platform ensures that all players always act responsibly." }
            ],
            image: advanced
        },
        {
            title: "Advanced customer profiling.",
            items: [{ subTitle: "Gain valuable insights into your customers’ shopping behaviour. Get the benefits of collaborative customer profiling while keeping your customer data 100% secure." }],
            image: ethical
        }
    ]


    return (
        <div style={{ background: "#fff" }}>
            <Container fluid="sm" className='border p-0 position-relative ' style={{ overflow: "hidden" }}>


                {/* <Container className='fixed-bottom d-flex justify-content-between mb-3 ' style={{ whiteSpace: 'nowrap' }}>
                    <Link to="/merchant/signup" className='btn main-btn-black fs-4 fw-lig '>Contact us</Link>
                    <Link to="/merchant/signup" className='btn main-btn-dark fs-4 bg-white fw-lig'>Careers</Link>
                </Container> */}

                {/* <Navbar /> */}

                <Row className='text-black justify-content-center'>
                    <Col lg='10' xs='10' >
                        <div className='text-black text-center mt240' >
                            <h1 className=" display-1 main-heading  fw-bolder lh-83">Why Collaborative Marketing?</h1>
                            <h1 className="text-black fs-1" >
                                We believe the future of marketing must be collaborative.
                            </h1>
                        </div>

                        {/* demo 1 */}

                        <div className='  px-0 rounded-2 mt180'>
                            <h1 className='text-center display-2 main-heading fw-bolder mb-0'>The Power of Many.<br /> To Empower Every One.</h1>
                            <h1 className='text-center fs-1  text-black'>The World’s First Collaborative Marketing Network.</h1>

                            <Row className='mt-5'>
                                <Col md="5">
                                    <div className="border h-100 rounded-3 ">

                                    </div>
                                </Col>
                                <Col md="7">
                                    <div className='d-flex flex-column  gap-2 mt-2 '>
                                        <h3 className='fs-2 text-black mt-5 pt-5'>A global virtual network for online and offline businesses,
                                            an alternative to current advertising & marketing practices
                                            with a global, virtual network for online and offline
                                            companies to collaborate and market to each other's
                                            customers.</h3>
                                        <div>
                                            <Link to='/about-us/vision-&-mission-statement/' className=' btn  main-btn-blue2 fw-lig fs-3 '>Read about our Vision & Mission</Link>
                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                        {/* demo 2 */}
                        <div className='  px-0 rounded-2 mt180'>
                            <h1 className='text-center display-2 main-heading fw-bolder mb-0'>XIRCLS - Your Gateway to a <br /> Global Advertising Alternative</h1>
                            <Row className='mt-5'>
                                <Col md="5">
                                    <div className="border h-100 rounded-3 ">

                                    </div>
                                </Col>
                                <Col md="7">
                                    <div className='d-flex flex-column  gap-2 mt-2 '>
                                        <h3 className='fs-2 text-black'>XIRCLS seeks to restore power into the hands of the millions of businesses that actually run the world.</h3>
                                        <h3 className='fs-2 text-black'>By reinstating the values of the free internet, we enable global companies to market to each other's customers independently, without sharing sensitive data.</h3>
                                        <h3 className='fs-2 text-black'>Our mission is to replace greed and fear with a sense of ease and community, fundamentally reshaping the way companies pursue their marketing goals.</h3>
                                        <div>
                                            <Link to='/about-us/vision-&-mission-statement/' className=' btn  main-btn-blue2 fw-lig fs-3 '>Read about our Vision & Mission</Link>
                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </div >

                        <div className='mt180'>
                            <h1 className="main-heading display-4 fw-bolder mb-2">XIRCLS is a Technology Inspired by <br /> Universal Fundamentals.</h1>
                            <p className='text-black fs-3 '>“The journey to the self is through the other.”</p>
                            <p className='text-black fs-3 '>In the history of mankind, we see this principle expressed time and again, across ancient texts, philosophical doctrines and the world of literature.</p>
                            <p className='text-black fs-3 '>Science too acknowledges all life as a complex network of cells in perpetual motion, operating in absolute harmony within themselves and with each other.</p>
                            <p className='text-black fs-3 '>It is as if we exist in a state of completion and incompletion all at once.</p>
                            <p className='text-black fs-3 '>Call it scientific, spiritual or divine, life seems to be an eternal journey that begins with you, leads to someone else and finally, comes back to you. A complete XIRCLE.</p>
                            <p className='text-black fs-3 '>XIRCLS is an attempt to leverage technology to give this universal principle form and function.</p>
                        </div>

                        {CardData.map((data, index) => {
                            if (index === 4) {

                                return (

                                    <div key={index} className='' style={{ marginTop: '180px' }}>
                                        <h1 className="main-heading display-1 fw-bolder">{data.title}</h1>
                                        {data.items.map((item, i) => (
                                            <p className='text-black fs-3' key={i}>{item.subTitle}</p>
                                        ))}
                                    </div>

                                )
                            } if (index === 8) {

                                return (
                                    <Row key={index}>
                                        <div style={{ marginTop: '180px' }}>
                                            <h1 className="main-heading display-4 fw-bolder text-center">{data.title}</h1>
                                        </div>
                                    </Row>
                                )
                            } if (index % 2 === 0) {
                                return (
                                    <>
                                        <Row key={index} className='mt180 justify-content-center'>
                                            <Col md='12' lg="10" className='' >
                                                <Row className=''>
                                                    <Col lg='4' className='text-black d-flex align-items-center justify-content-center ' >
                                                        <img src={data.image} style={{ width: '45%' }} alt=''/>
                                                    </Col>
                                                    <Col lg='8' className='text-black text-start'>
                                                        <h1 className='main-heading display-4 fw-bolder'>{data.title}</h1>
                                                        {data.items.map((item, i) => (
                                                            <p className='text-black fs-3 lh-32' key={i}>{item.subTitle}</p>
                                                        ))}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </>)
                            } else {

                                return (

                                    <Row key={index} className='mt180 justify-content-center'>
                                        <Col md='12' lg="10" className='' >
                                            <Row className='d-flex flex-row-reverse '>
                                                <Col lg='4' className='text-black d-flex align-items-center justify-content-center ' >
                                                    <img src={data.image} style={{ width: '45%' }} alt=''/>
                                                </Col>
                                                <Col lg='8' className='text-black text-start'>
                                                    <h1 className='main-heading display-4 fw-bolder'>{data.title}</h1>
                                                    {data.items.map((item, i) => (
                                                        <p className='text-black fs-3 lh-32' key={i}>{item.subTitle}</p>
                                                    ))}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                )
                            }
                        }
                        )}

                    </Col>
                </Row>
                <Row className="justify-content-center mt170 py-5" style={{ background: "#F5F7F8" }}>

                    <Col lg='12' xs='10' className='mt-5'>
                        <Container fluid='sm'>
                            <Row className=" align-items-start   text-start ">
                                <Col lg='6' >
                                    <h1 className="display-1 fw-bolder main-heading ms-2 text-start">XIRCLS is not new.<br /> It’s eternal.</h1>

                                </Col>
                                <Col lg='6' className="d-flex  flex-column  gap-3" >
                                    <h3 className=" fs-1 fw-lig lh-32  text-black">We endeavor to create technology that transcends mere marketing innovation, reflecting the interconnectedness of life itself.</h3>
                                    <h3 className="fs-1 fw-lig lh-32  text-black">XIRCLS is the physical manifestation of this universal connectedness, the line connecting any two points in the world.</h3>
                                    <h3 className="fs-1 fw-lig lh-32  text-black">We envision XIRCLS to be the start of a
                                        collaborative, transparent world not just in marketing
                                        & business, but the way we live our lives. Come join
                                        us on this journey.</h3>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <div style={{ marginTop: '180px' }}>
                    <h1 className="main-heading display-2 text-center fw-bolder mb-0">Join a collaborative marketing movement.</h1>
                    <p className='text-black text-center fs-1 lh-32' >Adapt to the global transition from an advertising-
                        led internet to a transaction-led internet.</p>

                    <div>

                    </div>
                </div>

                <hr className='mt100' />
                <Footer />


            </Container>
        </div>
    )
}

export default Collab
