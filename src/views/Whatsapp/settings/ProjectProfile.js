/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { postReq } from '../../../assets/auth/jwtService'
import { Col, Row } from 'react-bootstrap'
import { Card, CardBody } from 'reactstrap'
import FrontBaseLoader from '../../Components/Loader/Loader'
import ResizableTextarea from '../Templates/components/ResizableTextarea'
import { RiVerifiedBadgeFill } from "react-icons/ri"
import { FiEdit } from "react-icons/fi"
export default function ProjectProfile() {
  const [useProfileDetails, setProfileDetails] = useState("")
  const [useIsLoading, setIsLoading] = useState(false)


  const getProfileDetails = () => {
    setIsLoading(true)
    postReq("get_project_profile")
      .then((resp) => {
        console.log("1799 api", resp?.data)
        setProfileDetails({
          ...resp?.data?.wa_business_profile,
          websites: resp?.data?.wa_business_profile?.websites[0],
          name: resp?.data?.name,
          picture_url: resp?.data?.wa_display_image,
          profile_picture_url: resp?.data?.wa_display_image
        })
      }).catch((err) => { console.log(err) })
      .finally(() => setIsLoading(false))
  }
  const handleImageChange = (e) => {
    console.log("1799 image", e.target.files[0])
    setProfileDetails({
      ...useProfileDetails,
      profile_picture_url:e.target.files[0],
      picture_url:URL.createObjectURL(e.target.files[0])
    })
  }
  useEffect(() => {
    getProfileDetails()
  }, [])
  console.log("1799 new", useProfileDetails)
  return (
    <div>
      {
        useIsLoading && <FrontBaseLoader />
      }
      <Card>
        <CardBody className='d-flex justify-content-between '>
          <h4 className="">WhatsApp Profile </h4>
          <div className='d-flex gap-1'>
            <button className='btn btn-primary'>Edit</button>
            <button className='btn btn-primary'>Cancel</button>
            <button className='btn btn-primary'>Save</button>
          </div>
        </CardBody>
      </Card>
      <Row>
        <Col md="6">
         
          <div className='text-center mt-5'>
            <div className='position-relative d-flex justify-content-center align-items-center  rounded-circle m-auto overflow-hidden ' style={{width:"200px", height:"200px"}}>
            
            <img src={useProfileDetails?.picture_url}
              className='w-100 h-100 object-fit-cover '
              alt=""
               />
              </div>
            <h4 className='mt-2'>{useProfileDetails?.name}<span><RiVerifiedBadgeFill color="#13a85d" /></span></h4>
            <label htmlFor="profileMediaUrl" className='btn btn-primary' style={{ maxWidth: "100px" }} >Update Image</label>
            <input type="file" className='d-none' name="profileMediaUrl" id='profileMediaUrl' onChange={handleImageChange}  />

          </div>
        </Col>
        <Col md="6">

          <div className=''>
            <div className='mt-3'>
              <div className='mt-2'>
                <h6>
                  Name
                </h6>
                <div class="">
                  <input type="text" class="form-control"
                    value={useProfileDetails?.name}

                    disabled />
                </div>
              </div>
              <div className='mt-2'>
                <h6>
                  Description
                </h6>
                <div class="">
                  <input type="text" class="form-control"
                    value={useProfileDetails?.vertical}
                    id=""
                    disabled />
                </div>
              </div>
              <div className='mt-2'>
                <h6>
                  Email
                </h6>
                <div class="">
                  <input type="text" class="form-control"
                    value={useProfileDetails?.email}

                    id=""
                    disabled />
                </div>
              </div>
              <div className='mt-2' >
                <h6>
                  About
                </h6>
                <div class="">
                  <textarea type="text" class="form-control"
                    value={useProfileDetails?.description}

                    id=""
                    disabled />
                                                                    <ResizableTextarea isDisable={true} maxLength={4096} initialContent={useProfileDetails?.description} placeholder='Opt-out Message'  />

                </div>
              </div>
              <div className='mt-2' >
                <h6>
                  Address
                </h6>
                <div class="">
                  <textarea type="text" class="form-control"
                    value={useProfileDetails?.address}
                    id=""
                    disabled />
                </div>
              </div>
              <div className='mt-2'>
                <h6>
                  Website
                </h6>
                <div class="">
                  <input type="text" class="form-control"
                    value={useProfileDetails?.websites}
                    id=""
                    disabled />
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
