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
      items: ["Free - Upto 25,000 visits", "Unlimited campaigns", "24/7 email support"]
    },
    {
      head: "Lite",
      value: "29.99",
      subValue: "$80.99/year (save 10%)",
      button: "Buy Now",
      items: ["Upto 50,000 visits", "Visitor segmentation", "Unlimited campaigns", "24/7 email support"]
    },
    {
      head: "Grow",
      value: "99.99",
      subValue: "$143.99/year (save 20%)",
      button: "Buy Now",
      high: "Recommended",
      items: [
        "Upto 125,000 visits",
        "Visitor segmentation",
        "Unlimited campaigns",
        "24/7 priority email support",
        "Remove XIRCLS branding"
      ]
    },
    {
      head: "Pro",
      value: "299.99",
      subValue: "$419.99/year (save 30%)",
      button: "Buy Now",
      items: [
        "Upto 375,000 visits",
        "Visitor segmentation",
        "Unlimited campaigns",
        "Dedicated support manager",
        "Remove XIRCLS branding"
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
                  <Price_Card data={data} isFeature='true' url ='https://apps.shopify.com/superleadz-by-xircls' />
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