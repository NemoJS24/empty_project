import CardLeft from '@src/views/main/components/CardLeft'
import Footer from '@src/views/main/utilities/footer/Footer'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import React from 'react'
import { Col, Container, Row } from 'reactstrap'

// icons

import { AiOutlineAppstoreAdd, AiOutlineLink } from 'react-icons/ai'
import { BsBullseye, BsShieldCheck } from 'react-icons/bs'
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"
import { GiLifeBar } from "react-icons/gi"
import { TbPigMoney } from "react-icons/tb"

export default function WhyXircls() {
  // data
  const retentionData = [
    {
      icon: <FaArrowTrendDown />,
      title: 'Cost sustainability',
      desc: 'Eliminate redundant expenses associated with managing multiple systems. Identify areas that yield the highest returns, optimize marketing spend, and ensure that your budget is utilized judiciously.'
    },
    {
      icon: <FaArrowTrendUp />,
      title: 'Scalability',
      desc: 'Enjoy the benefits of a comprehensive martech stack regardless of your business size. Add functionalities as your marketing strategy expands, ensuring that you are always equipped with the right tools for the job.'
    },
    {
      icon: <TbPigMoney />,
      title: 'Single dashboard control',
      desc: 'Optimize campaigns, analyze performance metrics, and make data-driven decisions. No more navigating through disparate systems – everything you need, in one place.'
    },
    {
      icon: <GiLifeBar />,
      title: 'Data Privacy',
      desc: 'Build trust, mitigate risks, and safeguard your most valuable asset – customer data. Robust end-to-end encryption protocols shield your data from unauthorized access at every touchpoint.'
    }
  ]
  const techSellsData = [
    {
      title: "Personalization Beyond Numbers",
      desc: "No more faceless interactions. We tailor your marketing strategy to engage with individuals on a personal level, creating lasting connections.",
      icon: <BsBullseye />
    },
    {
      title: "Emotional Resonance",
      desc: "We understand that emotions drive decisions. Our solutions aim to evoke feelings, ensuring that your brand becomes more than just a product—it becomes a meaningful part of people's lives.",
      icon: <BsShieldCheck />
    },
    {
      title: "Logical Appeal",
      desc: "We craft narratives that align with the rational dimensions of consumer decision-making. We offer your customers not just a product or service, but a thoughtfully reasoned choice.",
      icon: <AiOutlineLink />
    },
    {
      title: "Building Community",
      desc: "Marketing (done right) isn't a one-way street. We foster connections that go beyond transactions, creating a loyal customer base that believes in your brand.",
      icon: <AiOutlineAppstoreAdd />
    }
  ]
  return (
    <div style={{ background: "#fff" }} >
  
        {/* <Navbar /> */}

        {/* section 1 */}

        <Row className=' text-center  justify-content-center mt240'>
          <Col xs="11" lg="8" xl="8"  >
            <h1 className='display-1 text-center main-heading fw-bolder  lh-83 '>
              Why XIRCLS ?
            </h1>
            <h1 className='text-black mt-1'>We help businesses consolidate diverse marketing tools
              that simplify, streamline & optimize every step of the buyer
              journey.</h1>
            <h1 className='text-black mt-1'>XIRCLS is a powerhouse platform to reduce overheads,
              improve transparency and protect customer data.</h1>
          </Col>
        </Row >

        <Container fluid='sm'>

          <Row className='section8 justify-content-center mt180 '>
            <Col xs="10" lg="12" xl="10"   >

              <h1 className=' text-center display-2 fw-bolder main-heading  ' >Connect with Humans, <br />Not Data Points.</h1>
              <h1 className='text-center fs-1  text-black mb-3'>Our Approach to Human-Centric Marketing.</h1>
              <Row className='   justify-content-between  mt-3'>
                {
                  techSellsData.map((data, index) => {
                    return (
                      <Col lg="6" md="6" className='' key={index}>
                        <CardLeft icon={data.icon} title={data.title} desc={data.desc} key={index} />
                      </Col>
                    )
                  })
                }
              </Row>
            </Col>
          </Row>
        </Container>

        {/* <Row className=' mt170 justify-content-center  '>
          <Col xs="10" xl="10" className='  px-0 rounded-2'>
            <Row className='justify-content-center mt-5 match-height flex-row-reverse'>
              <Col lg="5" className=' p-0  rounded-2 '>
                <img className='w-100 rounded-3' src="https://www.xircls.com/static/media/xircls_why-xircls_02.9021e3ee.jpg" alt="" />
              </Col>
              <Col lg="7" className='d-flex flex-column justify-content-end  mb-2   ps-2 text-end'>
                <div>
                  <h1 className='fs-1 main-heading fw-lig mt-5 pt-5'>With over two decades of experience navigating businesses through a manufactured ad environment, XIRCLS is the culmination of our founding team's 20+ years in advertising, communications, and marketing technology.</h1>
                </div>
              </Col>
            </Row>
          </Col>
        </Row> */}
        <div className=' p-5  mt180 text-center d-flex justify-content-center  align-items-center ' style={{ background: "#e5e7eb", minHeight: "250px" }}>
          <Container fluid='sm'>
            <h1 className='display-6 main-heading fw-lig '>With over two decades of experience navigating businesses through a manufactured ad environment, XIRCLS is the culmination of our founding team's 20+ years in advertising, communications, and marketing technology.</h1>
          </Container>
        </div>
        <Row className=" justify-content-center mt180 ">
          <Col lg="10" xs="10">
            <Container fluid='sm'>

              <h1 className='display-2 fw-bolder text-center  main-heading'>Our Focus Areas</h1>
              <Row className='  justify-content-center '>
                {
                  retentionData.map((data, index) => (
                    <Col md="6" >
                      <CardLeft icon={data.icon} title={data.title} desc={data.desc} key={index} />

                    </Col>
                  ))
                }

              </Row>
            </Container>

          </Col>
        </Row>

        <hr className='mt100' />
        {/* footer */}
        <Footer />


    </div>
  )
}
