import CardLeft from '@src/views/main/components/CardLeft'
import Footer from '@src/views/main/utilities/footer/Footer'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'

// icons

import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"
import { GiLifeBar } from "react-icons/gi"
import { TbPigMoney } from "react-icons/tb"
import { BsShieldCheck, BsBullseye } from 'react-icons/bs'
import { MdOutlineLoyalty } from 'react-icons/md'
import { AiOutlineLink, AiOutlineAppstoreAdd } from 'react-icons/ai'

export default function WhyXircls() {
  // data
  const whyXirlcsData = [
    {
      title: 'No More Targeting Anonymous Users.',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_03.c05dee5c.jpg",
      desc: ["If you’ve long been suspecting the authenticity of your online marketing reach, XIRCLS is for you. When you collaborate with genuine companies accepting payments from your target customer base, you know your marketing message is reaching a genuine human being, not a bot."]
    },
    {
      title: 'No More Blind Ads and Offers',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_01.ec879587.jpg",
      desc:
        [
          "What is the real impact of an ‘impression’? How do you verify if your offer was redeemed by a genuine customer? These are questions you no longer need to ask.",
          "With XIRCLS, make every marketing dollar count! Accurately track partner customer engagement such as email opens and clicks on your marketing messages and offer redemptions.",
          "Note: XIRCLS shows you engagement on your marketing messages via partner companies without sharing customer data."
        ]
    },
    {
      title: 'Freedom from Third-party Platforms',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_04.9a67aae0.jpg",
      desc: [
        "Stop actively driving your customers to your competitors on third-party delivery & coupon platforms!",
        "XIRCLS is a peer-to-peer marketing platform where you can directly reach your target audience without sharing the stage with your competitors, engaging in discount wars or paying hefty commissions."
      ]
    },
    {
      title: 'Protect Customer Data',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_05.2169ef44.jpg",
      desc: ["Take a stand against unethical data sharing practices. Lead your partners’ customers directly to your website and keep their data 100% secure."]
    },
    {
      title: 'Prepare For a Cookie-Less Future',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_15.00e4a81c.jpg",
      desc: [
        "Cookie-based advertising is on its way out, impacting the ability of advertisers to deliver targeted messages and track engagement.",
        "Stay ahead of the curve. Direct high-quality, inbound traffic directly from partner companies."
      ]
    },
    {
      title: 'Set Your Own Terms',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_06.7f635dee.jpg",
      desc: ["Choose your partners, customize marketing messages by partner audience types, give out discounts you’re comfortable with, create separate sets of offers for new customer acquisition and retention & more!"]
    },
    {
      title: 'Collaborate with Like-minded Businesses',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_07.5c0163b4.jpg",
      desc: [
        "Discover affinity partner companies on the XIRCLS network or invite them to partner with you.",
        "For example, a customer just bought from your clothing store? Gift her offers from businesses that sell fashion accessories & footwear!",
        "Are you a WooCommerce store that sells vegan makeup? Partner with other vegan businesses in categories like fashion, food & groceries."
      ]
    },
    {
      title: 'Market Precisely',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_08.c2ddd025.jpg",
      desc: ["XIRCLS gives you precision targeting like never before. Via your partners, instantly reach out to your ideal customer base with exclusive offers they can’t refuse!"]
    },
    {
      title: 'Keep your customers in a Perpetual Rewards Loop!',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_09.c7fa73bd.jpg ",
      desc: ["Reward every purchase at your website or store with partner offers. At zero cost to you. Perpetually! Run a 24/7, 365-day loyalty program where other businesses pay to reward your customers."]
    },
    {
      title: 'Multiply Reach',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_10.8b2d73a6.jpg",
      desc: ["As you grow your partner network on XIRCLS, exponentially increase your marketing reach. Let every purchase at a partner’s be an acquisition moment for you!"]
    },
    {
      title: 'Get Incredible ROIs',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_11.7c125b48.jpg",
      desc: ["Collaborative marketing is far more effective and with higher ROIs compared to your regular online marketing activities. Companies on the XIRCLS network currently see ROIs that exceed industry standards!"]
    },
    {
      title: 'Elevate your Brand Image',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_12.276a7371.jpg",
      desc: ["Reap the rewards of the company you keep! When allied / affinity companies keep recommending you to their customers, you create new brand associations in the minds of your target audience."]
    },
    {
      title: (<>Go Beyond Generic Discounts.<br /> Give Meaningful Value.</>),
      img: "https://www.xircls.com/static/media/xircls_why-xircls_13.be63f78f.jpg",
      desc: [
        "Delight your customers with timely discounts on partner products/services that go perfectly with what they just purchased with you or suits their lifestyle.",
        "For example, a customer just bought from your clothing store? Gift her offers from businesses that sell fashion accessories & footwear!",
        "Are you a store that sells vegan makeup? Partner with other vegan businesses in categories like fashion, food & groceries."


      ]
    },
    {
      title: 'Adopt an Always-On Approach',
      img: "https://www.xircls.com/static/media/xircls_why-xircls_14.37edb9cd.jpg",
      desc: [(<>No more stop-start marketing campaigns. Run a year-long loyalty program while also acquiring high-quality customers from your partners. Read more about Infiniti <Link to="">here.</Link></>)]
    }
  ]


  const data2 = [
    {
      title: (<>XIRCLS is a counter measure to bring
        power back into the hands of <br /> the millions
        of businesses that actually run the world.</>),
      desc: [
        "We’re going back to the values of the free internet by empowering companies around the world to market to each others’ customers on their own terms. Without sharing customer data.",
        "By replacing greed and fear with a sense of ease and community in the way business gets done, we want to fundamentally change the way companies work to achieve their marketing goals."
      ]
    },
    {
      title: (<>We’ve been helping businesses navigate
        their own course in a <br />highly manufactured
        ad environment for over two decades.</>),
      desc: ["XIRCLS is the outcome of the founding team’s 20+ years of experience as advertising, communications & marketing tech professionals."]
    },
    {
      title: (<>XIRCLS is not new. It’s eternal.</>),
      desc: [
        "It is our attempt at building technology that doesn’t just reinvent marketing but is an expression of life itself.",
        "Everything in life is connected to each other, often in ways we don't know (yet).",
        "XIRCLS is the physical manifestation of this universal connectedness of things. It is the line connecting two points anywhere in the world, no matter what those points are.",
        "We visualize XIRCLS to be the start of a collaborative, transparent world not just in marketing & business but the way we live our lives. Come join us on this journey."
      ]
    }
  ]
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
      desc: "Data-driven & user-friendly interfaces that know what your shoppers want.",
      icon: <BsBullseye />
    },
    {
      title: "Emotional Resonance",
      desc: "Powerful strategies that propel your sales pipeline forward for greater revenue generation.",
      icon: <BsShieldCheck />
    },
    {
      title: "Logical Appeal",
      desc: "Built to serve every kind of shopper. ",
      icon: <AiOutlineLink />
    },
    {
      title: "Building Community",
      desc: "Advanced offer creation & collaborative distribution tools to add value to your customers’ daily lives.",
      icon: <AiOutlineAppstoreAdd />
    }
  ]
  return (
    <div style={{ background: "#fff" }} >
      <Container fluid="sm" className='border p-0' style={{ overflow: "hidden" }}>

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

        <Row className=' mt170 justify-content-center '>

          <Col xs="10" xl="10" className='  px-0 rounded-2'>
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

          </Col>
        </Row >

        <Row className=' mt170 justify-content-center  '>
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

        <Container fluid='sm'>

          <Row className='section8 justify-content-center mt180 '>
            <Col xs="10" lg="12" xl="10"   >
              <h1 className=' text-center display-2 fw-bolder main-heading  ' >Connect with Humans, Not Data Points.</h1>
              <h1 className='text-center fs-1  text-black'>Our Approach to Human-Centric Marketing.</h1>
              <Row className='   justify-content-between  mt-2 '>
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

        <Row className=' mt170 justify-content-center '>

          <Col xs="10" xl="10" className='  px-0 rounded-2'>
            <h1 className='text-center display-4 main-heading fw-bolder mb-0'>Every business in the world obsesses daily over two fundamentals:</h1>

            <div lg="4" className='d-flex justify-content-center  gap-4 mt-4'>
              <div className='d-flex  justify-content-center gap-1  align-items-center'>
                {/* <p className='numBor fs-3 main-heading fw-bolder rounded-circle' >1</p> */}
                <h1 className='display-6 main-heading fw-bolder  m-0 p-0'>
                  Customer Acquisition</h1>
              </div>
              <div className='d-flex  justify-content-center gap-1  align-items-center'>
                {/* <p className='numBor fs-3 main-heading fw-bolder rounded-circle' >2</p> */}
                <h1 className='display-6 main-heading fw-bolder  m-0 p-0'>
                  Customer Retention</h1>
              </div>

            </div>
            <div lg="6" className='d-flex flex-column  gap-2 mt-2 text-center'>
              <h3 className='fs-2 text-black'>Ironically, companies have little control over their marketing activity aims
                to fulfill these fundamentals.</h3>
              <h3 className='fs-2 text-black'>Instead, they must trust the platforms they advertise on to deliver their message
                to the right audience at the right time.</h3>
              <h3 className='fs-2 text-black'>XIRCLS is the world’s first decentralized, collaborative marketing platform that, for the first time,
                has eliminated the need for companies to trust and be wholly dependent on a third party
                to secure their financial future.</h3>
            </div>

          </Col>
        </Row >

        <Row className='mt180 justify-content-center '>
          <Col xs="11" md="12" className='text-center d-flex flex-column  gap-5' >
            {
              data2.map((data) => (
                <div className='mt180 '>
                  <h1 className='display-4  main-heading fw-bolder'>{data.title}</h1>

                  <div className='mt-2 px-5 d-flex flex-column gap-1' >
                    {data.desc.map((list) => (
                      <h1 className='fs-2 text-center text-black fw-lig'>{list}</h1>
                    ))}
                  </div>

                </div>
              ))
            }

          </Col>
        </Row>


        <Row className='mt180 justify-content-center '>
          <Col xs="10" md="10" xl="10"  >
            <div className='  px-0  d-flex flex-column  gap-5 '>
              {
                whyXirlcsData && whyXirlcsData.map((data, index) => {
                  if (index % 2 === 0) {
                    return (
                      <Row className='justify-content-start my-3 '>
                        <Col md="4" className=''>
                          <img src={data.img} className='rounded-3' alt="" width={400} />
                        </Col>
                        <Col md="8" className='ps-3'>
                          <h1 className='main-heading display-4 fw-bolder  mb-0'>{data.title}</h1>
                          {
                            data.desc.map((list) => (
                              <h2 className='text-black lh-32 mt-1'>{list}</h2>
                            ))
                          }
                        </Col>
                      </Row>
                    )
                  } else {
                    return (
                      <Row className='justify-content-start my-3 flex-row-reverse '>
                        <Col md="4" className=''>
                          <img src={data.img} className='rounded-3' alt="" width={400} />
                        </Col>
                        <Col md="8" className=''>
                          <h1 className='main-heading display-4 fw-bolder text-end  mb-0'>{data.title}</h1>
                          {
                            data.desc.map((list) => (
                              <h2 className='text-black lh-32 mt-1'>{list}</h2>
                            ))
                          }
                        </Col>
                      </Row>
                    )
                  }
                })
              }

            </div>
          </Col>
        </Row>

        {/* black card */}
        <Row className='section8 justify-content-center mt170 py-5 mb-1' style={{ background: "#000" }}>
          <Col xs="11" className=' my-3'>


            <div className=' d-flex justify-content-center align-items-center '>
              <h1 className='display-3 fw-bolder m-0  text-white'>Join a collaborative marketing movement.</h1>
            </div>

            <h1 className=' display- text-center mt-0 text-white ' >Adapt to the global transition from an <br /> advertising-
              led internet to a transaction-led internet.</h1>

            <div className=' d-flex justify-content-center align-items-center gap-1 mt-4'>
              <Link to='/merchant/signup' className=' btn btn-lg  main-btn-blue fw-lig fs-3'>Signup</Link>
              <Link to='/contact-us' className=' btn btn-lg main-btn-light fs-3 fw-lig'>Contact Us</Link>

            </div>
          </Col>
        </Row>

        {/* footer */}
        <Footer />


      </Container>
    </div>
  )
}
