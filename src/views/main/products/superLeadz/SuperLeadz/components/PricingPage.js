import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import Price_Card from './Price_Card'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import Footer from '@src/views/main/utilities/footer/Footer'
import SubNavbar from '@src/views/main/utilities/navbar/SubNavbar'
import Price_Test from './Price_Test'

export default function PricingPage() {
  const pricingData = [
    {
      head: "Free",
      value: "0",
      subValue: "$00.00/year",
      button: "Get Started",
      items: [
        "All Features",
        "1,000 pop-up views"
        
      ]
    },
    {
      head: "Lite",
      value: "7.49",
      subValue: "$80.99/year (save 10%)",
      button: "Buy Now",
      items: [
        "All Features",
        "7,500 pop-up views"
        
      ]
    },
    {
      head: "Grow",
      value: "14.99",
      subValue: "$143.99/year (save 20%)",
      button: "Buy Now",
      high: "Recommended",
      items: [
        "All Features",
        "25,000 pop-up views",
        "No XIRCLS branding"
        
      ]
    },
    {
      head: "Pro",
      value: "49.99",
      subValue: "$419.99/year (save 30%)",
      button: "Buy Now",
      items: [
        "All Features",
        "125,000 pop-up views",
        "No XIRCLS branding"
        
      ]
    }

  ]

  return (
    <div style={{ background: "#fff" }} className='border p-0 px-3 px-md-0 '>
        {/* <Navbar position={'notFixed'} /> */}
        {/* <SubNavbar navTitle={'superLeadz'} /> */}

        <div className='text-center mt160'>
          <h1 className='display-1 text-center main-heading fw-bolder mt-0'>Thoughtfully priced to help you <br/> thrive and expand.</h1>
          <h1 className=' text-center text-black px-3'>Start for free and upgrade when you want to. Cancel anytime. No hidden fees.</h1>
        </div>


        <Row className=' justify-content-center mt-5  '>
          <Col md='11' lg="11" className='' >
            <Row className=' justify-content-center  match-height'>
              {
                pricingData.map((data) => (
                  <Col md="5" lg="3" className='  '>
                    <Price_Card data={data} />
                  </Col>
                ))
              }
            </Row>
          </Col>
        </Row>
      

        <hr className='mt-5' />
        <Footer />

    </div>
  )
}