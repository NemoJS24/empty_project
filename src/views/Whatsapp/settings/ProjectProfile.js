/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { RiVerifiedBadgeFill } from "react-icons/ri"
import Select from 'react-select'
import { Card, CardBody } from 'reactstrap'
import { postReq } from '../../../assets/auth/jwtService'
import FrontBaseLoader from '../../Components/Loader/Loader'
export default function ProjectProfile() {
  const [useProfileDetails, setProfileDetails] = useState("")
  const [useIsLoading, setIsLoading] = useState(false)

  const categoryList = [
    { value: 'APPAREL', label: 'Clothing and Apparel' },
    { value: 'EDU', label: 'Education' },
    { value: 'BEAUTY', label: 'Beauty, cosmetic & personal care' },
    { value: 'ENTERTAIN', label: 'Entertainment' },
    { value: 'EVENT_PLAN', label: 'Event Planning and Service' },
    { value: 'FINANCE', label: 'Finance and Banking' },
    { value: 'GROCERY', label: 'Food and Grocery' },
    { value: 'GOVT', label: 'Public Service' },
    { value: 'HOTEL', label: 'Hotel and Lodging' },
    { value: 'HEALTH', label: 'Medical and Health' },
    { value: 'NONPROFIT', label: 'Non-profit' },
    { value: 'PROF_SERVICES', label: 'Professional Services' },
    { value: 'RETAIL', label: 'Shopping and Retail' },
    { value: 'TRAVEL', label: 'Travel and Transportation' },
    { value: 'RESTAURANT', label: 'Restaurant' },
    { value: 'OTHER', label: 'OTHER' }
  ]

  const getProfileDetails = () => {
    setIsLoading(true)
    postReq("get_project_profile")
      .then((resp) => {
        console.log("1799 api", resp?.data)
        // setProfileDetails({
        //   ...resp?.data?.wa_business_profile,
        //   websites: resp?.data?.wa_business_profile?.websites[0],
        //   name: resp?.data?.name,
        //   picture_url: resp?.data?.wa_display_image,
        //   profile_picture_url: resp?.data?.wa_display_image
        // })
        setProfileDetails({ ...resp?.data, picture_url: resp?.data?.profile_picture_url, websites: resp?.data?.websites })
      }).catch((err) => { console.log(err) })
      .finally(() => setIsLoading(false))
  }
  const handleInputChange = (title, value) => {
    setProfileDetails(prev => ({ ...prev, [title]: value }))
  }
  const handleImageChange = (e) => {
    console.log("1799 image", e.target.files[0])
    const newFormData = new FormData()
    newFormData.append('profile', e.target.files[0])
    newFormData.append('profileonly', 1)
    setIsLoading(true)
    postReq("update_profile", newFormData)
      .then((resp) => {
        console.log("1799 image", resp?.data)
        setProfileDetails({
          ...useProfileDetails,
          profile_picture_url: e.target.files[0],
          picture_url: URL.createObjectURL(e.target.files[0])
        })
        toast.success("Profile picture updated!")
      }).catch((err) => { console.log(err);  toast.error("Something went wrong!") })
      .finally(() => setIsLoading(false))

  }
  console.log("1799 TRYYYY", useProfileDetails)
  const handleSave = () => {
    console.log("1799 save", useProfileDetails)
    // console.log("1799 save", useProfileDetails?.websites[0])
    const newFormData = new FormData()
    newFormData.append('vertical', useProfileDetails.vertical)
    newFormData.append('about', useProfileDetails.about)
    newFormData.append('address', useProfileDetails.address)
    newFormData.append('email', useProfileDetails.email)
    newFormData.append('websites', useProfileDetails.websites)
    newFormData.append('description', useProfileDetails.description)
    newFormData.append('profileonly', 0)
    // return null
    setIsLoading(true)
    postReq("update_profile", newFormData)
      .then((resp) => {
        console.log("1799 api", resp?.data)
        toast.success("Profile details updated!")

      }).catch((err) => { console.log(err); toast.error("Something went wrong!") })
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    getProfileDetails()
  }, [])
  console.log("1799 new", useProfileDetails)
  return (
    <div style={{ marginBottom: "100px" }}>
      {
        useIsLoading && <FrontBaseLoader />
      }
      <Card>
        <CardBody className='d-flex justify-content-between '>
          <h4 className="">WhatsApp Profile </h4>
          <div className='d-flex gap-1'>
            <button className='btn btn-primary' onClick={getProfileDetails}>Cancel</button>
            <button className='btn btn-primary' onClick={handleSave}>Save</button>
          </div>
        </CardBody>
      </Card>
      <Row>
        <Col md="6">

          <div className=''>

            <div className=''>
              <h5 className='mb-0'>
                Profile photo
              </h5>
              <p className='mt-0 font-small-3'>This will be visible on your business profile</p>
              <div class="">
                <label htmlFor="profileMediaUrl" className='btn btn-secondary' style={{ maxWidth: "300px" }} >Choose Image</label>
                <input type="file" className='d-none' name="profileMediaUrl" id='profileMediaUrl' onChange={handleImageChange} />

              </div>
            </div>
            <div className='mt-2'>
              <h6>
                Display Name
              </h6>
              <input type="text" class="form-control"
                value={useProfileDetails?.wa_display_name ?? " ERROR_TO_LOAD"}
                id=""
                disabled
              />
            </div>
            <div className='mt-2'>
              <h5 className=''>
                Category
              </h5>
              {/* <input type="text" class="form-control"
                value={useProfileDetails?.vertical ?? ''}
                id=""
                onChange={(e) => handleInputChange("vertical", e.target.value)}
              /> */}
              <Select
                className=''
                options={categoryList}
                closeMenuOnSelect={true}
                value={categoryList.find(option => option.value === useProfileDetails.vertical)}
                onChange={(e) => handleInputChange("vertical", e.value)}
              />
            </div>
            <div className='mt-2' >
              <h5 className='mb-0'>
                Description
              </h5>
              <p className='mt-0 mb-0 font-small-3'>Tell your customers about your company</p>
              <textarea type="text" class="form-control"
                value={useProfileDetails?.description ?? ''}
                id=""
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            <div className='mt-2' >
              <h5 className='mb-0'>
                About
              </h5>
              <textarea type="text" class="form-control"
                value={useProfileDetails?.about ?? ''}
                id=""
                onChange={(e) => handleInputChange("about", e.target.value)}
              />
            </div>

            <div className='mt-2'>
              <h4>Contact information</h4>
              <h5>
                Address
              </h5>
              <textarea type="text" class="form-control"
                value={useProfileDetails?.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                id="" />
            </div>

            <div className='mt-2' >

              <h5 className=''>
                Email:
              </h5>
              <input type="text" class="form-control"
                value={useProfileDetails?.email ?? ''}
                id=""
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className='mt-2'>
              <div className='d-flex justify-content-between  align-items-center '>
                <h6>
                  Website
                </h6>
                {
                  useProfileDetails?.websites?.length !== 2 &&
                  <button className='btn btn-sm btn-primary' onClick={() => {
                    setProfileDetails(prev => {
                      const updatedWebsites = [...prev.websites]
                      updatedWebsites[1] = ''
                      return { ...prev, websites: updatedWebsites }
                    })
                  }}>
                    Add Website
                  </button>
                }
              </div>
              {
                useProfileDetails?.websites?.map((elm, index) => {
                  return (
                    <input type="text" class="form-control" style={{ marginTop: "5px" }}
                      value={useProfileDetails?.websites[index]}
                      id=""
                      placeholder='website'
                      onChange={(e) => {
                        setProfileDetails(prev => {
                          const updatedWebsites = [...prev.websites]
                          updatedWebsites[index] = e.target.value
                          return { ...prev, websites: updatedWebsites }
                        })
                      }
                      }
                    />
                  )
                })

              }

            </div>
          </div>

        </Col>
        <Col md="6"   >

          <div className='  p-1 border m-auto ' style={{ width: "500px", background: "#efefef" }}>
            <div className='text-center p-2 bg-white'>

              <div className='position-relative border d-flex justify-content-center align-items-center  rounded-circle m-auto overflow-hidden ' style={{ width: "150px", height: "150px" }}>

                <img src={useProfileDetails?.picture_url}
                  className='w-100 h-100 object-fit-cover '
                  alt=""
                />
              </div>
              <h4 className='mt-2 me-1'>{useProfileDetails?.wa_display_name ?? " ERROR_TO_LOAD"}<span><RiVerifiedBadgeFill color="#13a85d" /></span></h4>
              <h5 className='text-secondary'>{categoryList.find(option => option.value === useProfileDetails.vertical)?.label}</h5>

            </div>
            <div className='border-top border-bottom px-2 py-1 bg-white'>
              <h6 className='text-start m-0'>This is business account.</h6>
            </div>
            <div className='mt-1 p-2 d-flex flex-column gap-2 bg-white'>
              <h5>{useProfileDetails?.description}</h5>
              <h5>{useProfileDetails?.address}</h5>

              <h5>{useProfileDetails?.email}</h5>
              <div className=''>

                {
                  useProfileDetails?.websites?.map((elm, index) => {
                    return (
                      <a href={elm} className='mt-1' >
                        <h5 style={{ color: "#2f74bd" }}>{elm}</h5>
                      </a>
                    )
                  })
                }
              </div>
            </div>
            <div className=' px-2 py-1 mt-1 bg-white'>
              <h5 className='text-secondary mb-1'>About and phone Number</h5>
              <h5>{useProfileDetails?.about ?? ""}</h5>
              <h5>{useProfileDetails?.wa_number ?? ""}</h5>
            </div>
          </div>

        </Col>
      </Row>
    </div>
  )
}
