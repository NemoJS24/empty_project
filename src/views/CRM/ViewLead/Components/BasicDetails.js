import React from 'react'
import { Container, Row, Col, Card, CardBody, Label, Input, Button, CardHeader } from 'reactstrap'
import userprofile from '../../assets/user_profile.jpg'
import { User, Flag, Phone, Star, Send, Layout } from 'react-feather'
import { LuTrendingUp } from "react-icons/lu"
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia"
import { PiMoneyThin, PiStarThin } from "react-icons/pi"
import { Image } from 'react-bootstrap'
import { HiOutlineGlobeAmericas } from "react-icons/hi2"
import { AiOutlineRise } from "react-icons/ai"
import { BiPhoneCall } from "react-icons/bi"
import { IoCalendarClearOutline, IoDocumentTextOutline } from "react-icons/io5"
import { useNavigate, useParams } from 'react-router-dom'

const BasicDetails = ({ userData }) => {

    const { id } = useParams()
    const navigate = useNavigate()

   function getCurrentDate() {
      const date = new Date()
      const formattedDate = date.toLocaleString('en-US', {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
         hour: 'numeric',
         minute: '2-digit',
         hour12: true
      })
      return formattedDate.replace(',', '')
   }

   return (
      <>
         <style>
            {`
               .tab {
                     position: relative;
                     text-decoration: none;
                     color: #000; /* Set your desired text color */
               }
               .underline {
                     position: absolute;
                     left: 0;
                     bottom: -2px;
                     width: 100%;
                     height: 2px;
                     background-color: #000; /* Set your desired underline color */
                     transform: scaleX(0); /* Initially, set the underline to be invisible */
                     transition: transform 0.3s ease;
               }
               .lead-basic-details hr {
                  margin: 0.8rem 0
               }
          `}
         </style>
         <Row className='match-height lead-basic-details'>
            <Col md='9'>
               <Card>
                  <CardBody>
                  <div>
                  <Row className='d-flex justify-content-between'>
                     <Col md='12'>
                        <div className='d-flex justify-content-between'>
                           <h3>Basic Details</h3>
                           <div>
                              <span className='mx-1 cursor-pointer' onClick={() => navigate(`/merchant/customers/Add-Call-lead/${id}`)}><BiPhoneCall /></span>
                              <span className='mx-1'><IoCalendarClearOutline /></span>
                              <span className='mx-1'><IoDocumentTextOutline /></span>
                           </div>
                        </div>
                     </Col>
                     <Col md='4' className=' d-flex gap-2 justify-content-start align-items-center'>
                        {
                           userData?.user_profile_img ? (
                              {/* <Image src={`${crmURL}/static${userData?.user_profile_img}`} className="img-thumbnail" style={{ height: '104px' }} /> */ }
                           ) : <Image src={userprofile} className="img-thumbnail" style={{ height: '104px' }} />
                        }
                        <div className='d-flex flex-column justify-content-center'>
                           <h4>{userData?.title} {userData?.customer_name}</h4>
                           <div><span className='font-small-4'>{userData?.email}</span></div>
                           <button type="button" className="btn btn-primary mt-1" style={{ width: "fit-content" }} onClick={() => navigate(`/merchant/customers/lead/edit_lead/${id}?type=edit`)}>Edit</button>
                        </div>
                     </Col>
                     <Col md='8' className='d-flex justify-content-center gap-5'>

                        <div className='d-flex gap-3 align-items-center mt-1 justify-content-end'>
                           <div className='d-flex flex-column gap-1'>
                              <span className='d-flex gap-2 align-items-center fs-6 fw-bold'><User size='16px' />Full name</span>
                              <span className='d-flex gap-2 align-items-center fs-6 fw-bold'><Flag size='16px' />Country</span>
                              <span className='d-flex gap-2 align-items-center fs-6 fw-bold'><Phone size='16px' />Contact</span>
                              <span className='d-flex gap-2 align-items-center fs-6 fw-bold'><Phone size='16px' />Last Contacted on</span>
                           </div>
                           <div className='d-flex flex-column gap-1'>
                              <div> <span className='font-small-3'>{userData?.customer_name ?? "-"}</span></div>
                              <div><span className='font-small-4'>{userData?.country ?? "-"}</span></div>
                              <div><span className='font-small-4'>{userData?.phone_no ?? "-"}</span></div>
                              <div><span className='font-small-4'>{userData?.contacted_on ?? "-"}</span></div>
                           </div>
                        </div>
                     </Col>
                  </Row>
                  <Row className='mt-3'>
                     <Col md='12'>
                        <Row>
                           <Col md='3' className='d-flex gap-1 align-items-center'>
                              <div>
                                 <div className='bg-warning bg-opacity-25 d-flex justify-content-center align-items-center' style={{ width: "35px", height: "36px", borderRadius: "25%" }}>
                                    <HiOutlineGlobeAmericas size={18} className="text-warning" />
                                 </div>
                              </div>
                              <div>
                                 <h6>Web - Enquiry Form</h6>
                                 <span className='font-small-3'>Lead Source</span>
                              </div>
                           </Col>
                           <Col md='3' className='d-flex gap-1 align-items-center'>
                              <div>
                                 <div className='bg-success bg-opacity-25 d-flex justify-content-center align-items-center' style={{ width: "35px", height: "36px", borderRadius: "25%" }}>
                                    <AiOutlineRise size={18} className="text-success" />
                                 </div>
                              </div>
                              <div>
                                 <h6>Qualified</h6>
                                 <span className='font-small-3'>Status</span>
                              </div>
                           </Col>
                        </Row>
                     </Col>
                  </Row>
               </div>
                  </CardBody>
               </Card>
            </Col>

            <Col md='3'>
               <Card>
                  <CardBody>
                     <div className='h-100  d-flex justify-content-center'>
                        <div className='d-flex justify-content-around flex-column'>
                           <div className='d-flex flex-column justify-content-center '>
                              <p className='fw-medium text-center m-0' style={{ padding: '4px 0px' }}>You've</p>
                              <span className='fw-medium text-center m-0 fs-1' style={{ padding: '4px 0px' }}>Not</span>
                              <p className='fw-medium text-center m-0' style={{ padding: '4px 0px' }}>intereacted with this lead yet.</p>
                           </div>
                           <div className='d-flex justify-content-center'>
                              <button onClick={() => navigate(`/merchant/customers/Add-Call-lead/${id}`)} type="button" class="w-100 btn btn-primary" style={{ width: 'inherit' }}>Add Interaction</button>
                           </div>
                        </div>
                     </div>
                  </CardBody>
               </Card>
            </Col>
            <Col xs='12' className='pt-3'>
               <div>
                  <h3>Lead Timeline</h3>
               </div>
               <Row>
                  <Col md={6}>
                     <Card>
                        <CardBody>
                           <div className='d-flex justify-content-between align-content-center'>
                              <p className='m-0'>Lead is now in <span className='bg-dark text-white rounded-2'style={{padding:'0 4px'}}>Demo</span> stage</p>
                              <p className='m-0'>{getCurrentDate()}</p>
                           </div>
                        </CardBody>
                     </Card>
                  </Col>
               </Row>
            </Col>
            <Col md='6' className='pt-3'>
               <div>
                  <h3>Personal Details</h3>
               </div>
               <Card >
                  <CardBody>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>DOB:</p>
                        <p className='m-0'>{userData?.cust_dob ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>Gender:</p>
                        <p className='m-0'>{userData?.gender ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>Marital Status:</p>
                        <p className='m-0'>{userData?.marital_status ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>Marriage Anniversary:</p>
                        <p className='m-0'>{userData?.marriage_anniversery ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>Children:</p>
                        <p className='m-0'>{userData?.children ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>Occupation:</p>
                        <p className='m-0'>{userData?.occupation ?? 'N/A'}</p>
                     </div>
                  </CardBody>
               </Card>
            </Col>
            <Col md='6' className='pt-3'>
               <div>
                  <h3>Address</h3>
               </div>
               <Card>
                  <CardBody>
                  <div className='d-flex justify-content-between'>
                        <p className='m-0'>Address line 1:</p>
                        <p className='m-0'>{userData?.address_line1 ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>Address line 2:</p>
                        <p className='m-0'>{userData?.address_line2 ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>City:</p>
                        <p className='m-0'>{userData?.city ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>State:</p>
                        <p className='m-0'>{userData?.state ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>Country:</p>
                        <p className='m-0'>{userData?.country ?? 'N/A'}</p>
                     </div>
                     <hr/>
                     <div className='d-flex justify-content-between'>
                        <p className='m-0'>Pincode:</p>
                        <p className='m-0'>{userData?.pincode ?? 'N/A'}</p>
                     </div>
                     <hr/>
                  </CardBody>
               </Card>
            </Col>
         </Row>
      </>
   )
}

export default BasicDetails