import React from 'react'
import Footer from '@src/views/main/utilities/footer/Footer'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import { Link } from 'react-router-dom'

// compomponents
import CardLeft from '@src/views/main/components/CardLeft'
import LogoSlider from '../components/logoSlider/LogoSlider'
import Testimonial from './components/testimonial/Testimonial'

// bootstrap
import { Card, Col, Container, Row } from 'reactstrap'
import ReactGA from 'react-ga'
ReactGA.initialize('G-4NRGB5EKCP')

// icons
import { FiArrowUpRight } from 'react-icons/fi'
import { BsShieldCheck, BsBullseye } from 'react-icons/bs'
import { MdOutlineLoyalty } from 'react-icons/md'
import { TbMoneybag } from 'react-icons/tb'
import { AiOutlineLink, AiOutlineAppstoreAdd } from 'react-icons/ai'


// data
const techSellsData = [
  {
    title: "Intuition",
    desc: "User-friendly interfaces that predict customer needs and deliver seamless experiences.",
    icon: <BsBullseye />
  },
  {
    title: "Attraction",
    desc: "Powerful strategies that propel your sales pipeline forward for greater revenue generation.",
    icon: <BsShieldCheck />
  },
  {
    title: "Personalization",
    desc: "Tailored to individual preferences and fully customizable.",
    icon: <AiOutlineLink />
  },
  {
    title: "Value Addition",
    desc: "Advanced offer creation & collaborative distribution tools that add value.",
    icon: <AiOutlineAppstoreAdd />
  },
  {
    title: "Loyalty",
    desc: "From traditional points-based systems to partner rewards and cashback - we have it all.",
    icon: <MdOutlineLoyalty />
  },
  {
    title: "Goodwill",
    desc: "Customers become brand ambassadors and are incentivized to spread the love.",
    icon: <TbMoneybag />
  }
]
const data = [
  {
    heading: "IDENTIFY",
    list: [
      {
        title: "Zero-Party Data Collection",
        subTitle: "Democrazy",
        desc: "Customer demographic data collection to curate personalized buying experiences."
      }
    ]
  },
  {
    heading: "VERIFY",
    list: [
      {
        title: "Visitor Authentication",
        subTitle: (<> <a target='_blank' href="/products/superleadz/">SuperLeadz <FiArrowUpRight size={17} style={{ marginTop: "-5px" }} /></a></>),
        desc: "Make this clickable and open SuperLeadz overview page in a new tab"
      }
    ]
  },
  {
    heading: "INCENTIVIZE",
    list: [
      {
        title: "Shopping Engagement",
        subTitle: "Reviews, Social Shop",
        desc: "Solutions that instantly lock shoppers into buying mode and activate the cart journey."
      },
      {
        title: "Rewards & Incentives",
        subTitle: (<>
          <a target='_blank' href="/products/infiniti/">Infiniti <FiArrowUpRight size={17} style={{ marginTop: "-5px" }} /></a>
          <a target='_blank' href="/products/semperfi/">Semper Fi <FiArrowUpRight size={17} style={{ marginTop: "-5px" }} /></a>
        </>
        ),
        desc: "Timely offers, delivered discreetly, to delight shoppers and convert them into customers guaranteed to return."
      }
    ]
  },
  {
    heading: "ENABLE",
    list: [
      {
        title: "Purchase Enablement",
        subTitle: "Flash Accounts, UPI Payment Enabler",
        desc: "Sales acceleration products that simplify and enhance the checkout experience."
      },
      {
        title: "Revenue Optimization",
        subTitle: "Recommendations, Cross-sell & Upsell",
        desc: "Personalized suggestions tailored to past customer behaviour and purchase history."
      },
      {
        title: "Revenue Recovery",
        subTitle: "Revive",
        desc: "Smart tools that predict, protect and recover lost or at-risk revenue across the buying cycle."
      },
      {
        title: "Communication",
        subTitle: "Talk by XIRCLS, Chatbot",
        desc: "An integrated communications system to deliver a unified brand experience across channels."
      },
      {
        title: "Omnichannel Automation",
        subTitle: "QR Forms, CRM",
        desc: "Unified online/offline lead generation & conversion with a centralized customer database for streamlined operations."
      }
    ]
  },
  {
    heading: "ENHANCE",
    list: [
      {
        title: "Shopping Optimization",
        subTitle: "Flash Accounts, Oh My Customer!",
        desc: "Enhancement modules to enable frictionless, user-friendly shopping experiences."
      }
    ]
  },
  {
    heading: "RETAIN",
    list: [
      {
        title: "Loyalty Management",
        subTitle: "Semper Fi, TrueCash, Gift Cards",
        desc: "Loyalty solutions built to deliver meaningful interactions that add true value to your customers’ lives."
      },
      {
        title: "Repurchase Enablement",
        subTitle: "Subscriptions & Memberships",
        desc: "Recurring purchase activation to instantly turn one-time buyers into loyal patrons."
      },
      {
        title: "Goodwill & Partnerships",
        subTitle: "Referrals, Customer Affiliates",
        desc: "Referral management tools to track, reward and leverage the influence of satisfied customers and strategic partners."
      }
    ]
  }


]

const Home = () => {

  return (
    <div style={{ background: "#fff" }} >


      {/* <Navbar /> */}

      {/* section 1 */}
      <div className='mt240   d-flex flex-column justify-content-center ' >
        <h1 className='display-1 text-center main-heading fw-bolder lh-83 ' >
          From First Visit <br /> To Forever Loyal.
        </h1>
        <h1 className=' text-center text-black  mt-1 px-3' >An end-to-end martech stack to optimize every step of the buyer journey.</h1>

      </div>

      <LogoSlider />


      <Row className=' mt170 justify-content-center '>
        <Col xs="10" xl="10" className='  px-0 rounded-2 text-center '>
          <h1 className='display-2 main-heading fw-bolder  '>Trust is Everything.</h1>
          <h3 className='fs-1  text-black '>We prioritize digital interactions built on trust, transparency, and 100% consent of your valued customers.</h3>
        </Col>
      </Row>


      {/* section 3 */}
      <div>

        <Row className='section8 justify-content-center mt180 '>
          <h1 className=' text-center display-2 fw-bolder main-heading  px-0' >Technology That Sells. <br />The Way You Would.</h1>
          <Col xs="10" lg="12" xl="10"   >
            <h1 className='text-center fs-1  text-black'>A human-first approach to martech that prioritizes a personal experience for each customer.</h1>
            <Row className='  m-auto justify-content-between  mt-0 mt-md-2 '>
              {
                techSellsData.map((data, index) => {
                  return (
                    <Col lg="4" md="6" className='' key={index}>
                      <CardLeft icon={data.icon} title={data.title} desc={data.desc} key={index} />
                    </Col>
                  )
                })
              }
            </Row>
          </Col>
        </Row>
      </div>

      {/* we her for you */}
      <div>
        <style>
          {`
                      .numBor {
                          border: solid 2px rgb(55, 55, 55) !important;
                          min-height: 30px;
                          min-width: 30px;
                          max-height: 30px;
                          max-width: 30px;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                      }
                      .SlideDropDown{
                          max-height: 0;
                          overflow: hidden !important;
                          transition: max-height .6s ease-in-out;
                      }`}
        </style>
        <Row className='section9 justify-content-center mt180 '>
          <Col xs="10" lg="10"    >
            <Row className='pt-2'>
              <Col lg="6" className=''>
                <h1 className='display-4 main-heading fw-bolder '>All You Need. <br />
                  All In One Place.
                </h1>
              </Col>
              <Col lg="6" className='mt-2'>
                <h1 className='text-black'>Precision martech that activates crucial touch points across the buyer journey. </h1>
              </Col>
            </Row>

            {
              data.map((data, index) => {
                return (

                  <div className='border-top mt-3' key={index}>
                    <h1 className='text-center main-heading mt-3 fw-bolder display-6 '>{data.heading}</h1>

                    {
                      data.list.map((list, index) => (
                        <Row className=' mt-2 ' key={index}>
                          <Col lg="6" className='d-flex  gap-2'>
                            <div>
                              <h1 className='fs-1 main-heading d-flex fw-bolder justify-content-start gap-1  align-content-center mt-0'>
                                {list.title} </h1>
                              <h3 className='text-black fst-italic'>{list.subTitle}</h3>
                            </div>
                          </Col>
                          <Col lg="6" className=' d-flex flex-column gap-2  ps-3 ps-md-1'>
                            <h2 className='text-black ' >{list.desc}</h2>
                          </Col>
                        </Row>
                      ))
                    }
                  </div>
                )
              })
            }

          </Col>

        </Row>
      </div>
      <div>
        <Row className=' justify-content-center mt170 '>
          <Col lg="12" xl="10">
            <Card className='shadow-none p-5 border'>
              <div>
                <h4 className='fs-3 fw-bolder  text-secondary mt-4 mt-sm-0'>SUPERLEADZ</h4>
                <h1 className='mainHeader display-1 main-heading fw-bolder m-0'>Built to Convert</h1>
                <h1 className='fs-1 main-heading m-0 mt-1'>
                  Verified, high-intent lead generation.
                </h1>
                <h1 className='fs-1 main-heading m-0 '>
                  Minimize marketing wastage. Boost revenue.
                </h1>
                <br />

                <Link to='/products/superleadz/' className='btn  btn-lg  fs-3 main-btn-dark px-3 py-1'>Learn more about SuperLeadz <FiArrowUpRight className='fs-4' style={{ marginLeft: "3px", marginBottom: "2px" }} /></Link>
              </div>
            </Card>
          </Col>
        </Row>
      </div>


      {/* TESTIMONIAL */}
      <Testimonial />


      {/* card */}
      <div>
        <Row className=' justify-content-center mt170 '>
          <Col lg="12" xl="10">
            <Card className='shadow-none p-5 border'>
              <div>
                <h1 className='mainHeader display-3 main-heading fw-bolder m-0 mt-2'>
                  Refer Us And Earn<br />
                  20% Lifetime Commission.
                </h1>
                <h1 className='fs-2 main-heading m-0 mt-2'>
                  Recommend our solutions to your customers or simply help us spread the word as an affiliate.
                </h1>
                <h1 className='fs-2 main-heading m-0 '>
                  Earn additional revenue with zero investment or hidden costs!
                </h1>
                <br />

                <Link to='/partners' className='btn  btn-lg  fs-3 main-btn-dark px-3 py-1'>Learn More <FiArrowUpRight className='fs-4' style={{ marginLeft: "3px", marginBottom: "2px" }} /></Link>
              </div>
            </Card>
          </Col>
        </Row>
      </div>


      {/* black card */}
      <Row className='section8 justify-content-center mt170 py-5 mb-1' style={{ background: "#000" }}>
        <Col xs="11" className=' my-3'>


          <div className=' d-flex justify-content-center align-items-center '>
            <h1 className='display-2 fw-bolder m-0 text-center text-white'>Grow Your Business With XIRCLS.</h1>
          </div>

          <h1 className=' display- text-center mt-0 text-white ' >Reach out for customized solutions.</h1>

          <div className=' d-flex justify-content-center align-items-center gap-1 mt-4'>
            {/* <Link to='/contact-us/demo' className=' btn btn-lg  main-btn-blue fw-lig'>Request Demo</Link> */}
            <Link to='/contact-us' className=' btn btn-lg main-btn-light fw-lig'>Contact Us</Link>
          </div>
        </Col>
      </Row>

      {/* footer */}
      <Footer />

    </div>
  )
}

export default Home