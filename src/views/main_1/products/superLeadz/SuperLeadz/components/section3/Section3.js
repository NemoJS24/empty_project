import React, { useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import image2 from '../../images/Booking App Square.png'
import image3 from '../../images/Booking App Square.png'
import { BsArrowRight } from 'react-icons/bs'
import { FiCheck } from 'react-icons/fi'




export default function Section3() {

    const items = [{title:'Visit frequency-based personalization'},{title:'Advanced pop-up customization'},{title:'Multiple redirect URLs'},{title:'Time-delay function'},{title:'Scroll-trigger function'},{title:'Advanced pop-up reports'},{title:'Device-specific'}];
    
    const items1 = [{title:'OTP verification'},{title:'No off-site navigation'},{title:'Diverse offer types'},{title:'Multiple offer display'},{title:'One-click offer redemption'}];


    const handleCardClick1 = () => {
        if (isFlipped1) {
            setIsFlipped1(false)
        } else {
            setIsFlipped1(true)
            setIsFlipped2(false)
        }
    }

    const handleCardClick2 = () => {
        if (isFlipped2) {
            setIsFlipped2(false)
        } else {
            setIsFlipped2(true)
            setIsFlipped1(false)
        }
    }

    const [isFlipped1, setIsFlipped1] = useState(false)
    const [isFlipped2, setIsFlipped2] = useState(false)

    return (
        <>
            <div className='mt180' style={{ width: '60%', margin: '0 auto' }}>
                <Row xs="1" md="12" sm='' className='row match-height '>

                <div>
                    <h1 className='display-3  main-heading fw-bolder text-center'>Make lead conversion your superpower!</h1>
                    <h2 className=' text-center text-black  mt-1 px-5 pb-3'>Feel like a sales superhero with our heavy arsenal of
                        top-notch features - many you’ve never seen before.</h2>
                </div>

                    {/* First Card */}
                    <Col className='col-md-6 mb-4 m-0 text-center'>
                        <Card className={`shadow-none border text-center flip-card ${isFlipped1 ? 'flipped' : ''}`} onClick={handleCardClick1}>
                            <div className='flip-card-inner'>
                                <div className={`flip-card-front ${isFlipped1 ? 'hidden' : ''}`}>
                                    <h1 className='display-6 main-heading fw-bold p-1 pt-4'>Smart Pop-ups</h1>
                                    <div>
                                        <h2 className='text-black h3 fw-bold p-1 pt-0'>Train your pop-ups to sell real-time based on visit frequency and visitor behaviour.</h2>
                                        <a className="fs-3 text-primary"> Read More <BsArrowRight /></a>
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <img src={image2} alt="image1" className='pt-3' style={{ width: "100%" }} />
                                        
                                        
                                    </div>
                                </div>
                                <div className={`flip-card-back ${isFlipped1 ? '' : 'hidden'}`} style={{ height: '100%' }}>
                                <h1 className='display-5 main-heading fw-bolder p-1 pt-4'>Smart Pop-ups</h1>
                                <h2 className='text-black h3 fw-bold p-1 pt-0'>Train your pop-ups to sell real-time based on visit frequency and visitor behaviour.</h2>
                                <ul className="" style={{ listStyle: 'none' }}>
                                            {items.map((item, index) => (
                                             <li  key={index} className="text-start text-black h3 pt-2 d-flex" > <FiCheck className='' color={'#2f85ff'} size={20} style={{minWidth:"30px"}}/>
                                                <div className='ps-1 pe-1'>
                                            {item.title}
                                                    </div>
                                                    </li>


                                            ))}
                                        </ul>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    {/* Second Card */}
                    <Col className='col-md-6 mb-4 m-0 text-center'>
                        <Card className={`shadow-none border match-height text-center flip-card ${isFlipped2 ? 'flipped' : ''}`} onClick={handleCardClick2}>
                            <div className='flip-card-inner'>
                                <div className={`flip-card-front ${isFlipped2 ? 'hidden' : ''}`}>
                                    <h1 className='display-5 main-heading fw-bolder p-0 pt-4' >Uninterrupted Buyer Journeys</h1>
                                    <div>
                                        <h2 className='text-black h3 fw-bold p-1 pt-0'>Generate high-quality leads, eliminate distractions and offer incentives to maximize conversions.</h2>
                                    </div>
                                    <a className="fs-3 text-primary"> Read More <BsArrowRight /></a>
                                    <div style={{ width: "100%" }}>
                                        <img src={image3} alt="image1" style={{ width: "100%"}} />
                                    </div>
                                </div>
                                <div className={`flip-card-back ${isFlipped2 ? '' : 'hidden'}`}>
                                <h1 className='display-5 main-heading fw-bolder p-1 pt-4'>Uninterrupted Buyer Journeys</h1>
                                        <h2 className='text-black h3 fw-bold p-1 pt-0'>Generate high-quality leads, eliminate distractions and offer incentives to maximize conversions. </h2>
                                        <ul className="" style={{ listStyle: 'none' }}>
                                            {items1.map((item, index) => (
                                             <li  key={index} className="text-start text-black h3 pt-2 d-flex" > <FiCheck className='' color={'#2f85ff'} size={20} style={{minWidth:"30px"}}/>
                                                <div className='ps-1 pe-1'>
                                            {item.title}
                                                    </div>
                                                    </li>
                                            ))}
                                        </ul>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}