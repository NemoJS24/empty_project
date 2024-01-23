import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import Price_Card from '../../../components/Price_Card'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import Footer from '@src/views/main/utilities/footer/Footer'
import SubNavbar from '@src/views/main/utilities/navbar/SubNavbar'

export default function Superleadz_Pricing() {
  const pricingData = [
    {
      head: "Free",
      value: "0",
      subValue: "$00.00/year",
      button: "Get Started",
      items: ["Upto 1,000 pop-up views"]
    },
    {
      head: "Lite",
      value: "14.99",
      subValue: "$80.99/year (save 10%)",
      button: "Buy Now",
      items: ["Upto 20,000 pop-up views"]
    },
    {
      head: "Grow",
      value: "99.99",
      subValue: "$143.99/year (save 20%)",
      button: "Buy Now",
      high: "Recommended",
      items: [
        "150,000 pop-up views",
        "No XIRCLS branding",
        "2 Domains"


      ]
    },
    {
      head: "Pro",
      value: "299.99",
      subValue: "$419.99/year (save 30%)",
      button: "Buy Now",
      items: [
        "500,000 pop-up views",
        "No XIRCLS branding",
        "5 Domains"


      ]
    }

  ]

  return (
    <div style={{ background: "#fff" }} className=' p-0 px-3 px-md-0 '>
      {/* <Navbar position={'notFixed'} /> */}
      {/* <SubNavbar navTitle={'superLeadz'} /> */}

      <div className='text-center mt160'>
        <Row className=' justify-content-center '>
          <Col lg="12" xl="9">
            <h1 className='display-1 text-center main-heading fw-bolder mt-0'>Thoughtfully priced to help you  thrive and expand.</h1>
          </Col>
        </Row>

        <h1 className=' text-center text-black px-3'>Start for free and upgrade when you want to. Cancel anytime. No hidden fees.</h1>
      </div>


      <Row className=' justify-content-center mt-5  '>
        <Col md='11' lg="11" className='' >
          <Row className=' justify-content-center  match-height'>
            {
              pricingData.map((data) => (
                <Col md="5" lg="3" className='  '>
                  <Price_Card data={data} isFeature='true' />
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