import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import Footer from '@src/views/main/utilities/footer/Footer'
import Price_Card from '../../components/Price_Card'

export default function Flash_Pricing() {
  const pricingData = [
    {
      head: "Free",
      value: "Free",
      subValue: "",
      button: "Get Started",
      items: ["All Features", "Up to 100 transactions"]
    },
    {
      head: "Lite",
      value: "$7.49",
      subValue: "$80.99/year (save 10%)",
      button: "Buy Now",
      items: ["All Features", "Up to 1,000 transactions"]
    },
    {
      head: "Grow",
      value: "14.99",
      subValue: "$80.99/year (save 10%)",
      button: "Buy Now",
      items: ["All Features", "Up to 2,500 transactions"]
    },
    {
      head: "Pro",
      value: "$49.99",
      subValue: "$80.99/year (save 10%)",
      button: "Buy Now",
      items: ["All Features", "Up to 10,000 transactions"]
    }

  ]

  return (
    <div style={{ background: "#fff" }} className=' p-0 px-3 px-md-0 mt160 '>
        {/* <Navbar position={'notFixed'} /> */}
        {/* <SubNavbar navTitle={'superLeadz'} /> */}

        <Row className=' justify-content-center '>
          <Col md="11" lg="11" xl="9" className='mt-md-2 mt-sm-2'>
            <h1 className='display-1 text-center main-heading fw-bolder mt-5'>Thoughtfully priced to help you  thrive and expand.</h1>
          </Col>
        </Row>


        <Row className=' justify-content-center mt-5  '>
          <Col md='11' lg="11" className='' >
            <Row className=' justify-content-center  match-height'>
              {
                pricingData.map((data) => (
                  <Col md="5" lg="3" className='  '>
                    <Price_Card data={data}  url ='https://apps.shopify.com/flash-accounts-by-xircls'/>
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