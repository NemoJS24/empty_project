/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import LeadsNav from './components/LeadsNav'
import { Card, CardBody, Col, Label, Row } from 'reactstrap'
import LeadBasicInfo from './components/LeadBasicInfo'
import LeadPersonalInfo from './components/LeadPersonalInfo'
import LeadAddress from './components/LeadAddress'
import LeadCompanyInfo from './components/LeadCompanyInfo'
import Select from 'react-select'
import { crmURL, getReq, postReq } from '../../../assets/auth/jwtService'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { validForm, validateEmail } from '../../Validator'
import Spinner from '../../Components/DataTable/Spinner'

const LeadsMain = () => {
   const [userData, setUserData] = useState({
      phone_code: 91,
      children: 'No',
      country: 'India'
   })
   const [currentStep, setCurrentStep] = useState(1)
   const [countryData, setCountryData] = useState([])
   const [leadStageRawOptions, setLeadStageRawOptions] = useState([])
   const [isLoading, setIsLoading] = useState(false)

   const navigate = useNavigate()

   const { id } = useParams()

   const urlParams = new URLSearchParams(location.search)
   const isEdit = urlParams.get("type") === "edit"

   // console.log(userData, 'userData')

   const getCountries = () => {
      getReq("countries")
         .then((resp) => {
            setCountryData(resp.data.data.countries)
         })
         .catch((error) => {
            console.log(error)
         })
   }

   const postData = () => {
      const form_data = new FormData()
      Object.entries(userData).map(([key, value]) => {
         form_data.append(key, value)
      })
      form_data.append("pin", 'INsdfsdfsDV')
      postReq('add_leads', form_data)
         .then((resp) => {
            // console.log("Response:", resp.data)
            toast.success('Lead saved successfully')
            resp.data.cust_id ? navigate(`/merchant/customers/lead/edit_lead/${resp.data.cust_id}?type=edit`) : navigate(`/merchant/customers/lead/`)
            // window.location.reload()
         })
         .catch((error) => {
            console.error("Error:", error)
            if (error.message === 'Lead already exists') {
               toast.error('Lead already exists')
            } else {
               toast.error('Failed to save Lead')
            }
         })
   }

   const [parentComapany, setParentComapny] = useState([])

   const fetchData = (id) => {
      if (isEdit) {
         getReq('leads_get', `?lead_id=${id}`)
            .then((resp) => {
               console.log("ResponseId:", resp.data.data)
               //--

               const filteredParentCompanies = resp?.data?.data?.associated_accounts.filter((ele) => {
                  if (ele?.parent_id) {
                      console.log(ele.parent_id, "hhh")
                      return true
                  }
                  return false
              })
              setParentComapny(filteredParentCompanies)

               //--
               console.log("ResponseId:", resp.data.data.associated_accounts.filter((ele) => ele?.parent_id && console.log(ele?.parent_id, "hhh")))
               const data = resp.data.data
               data.customer_id = data.id
               const name = data.customer_name.split(' ')
               data.cust_first_name = name[0]
               data.cust_last_name = name[1]
               if (Array.isArray(data.associated_accounts)) {
                  data.associate_clients_count = data.associated_accounts.length
                  data.associated_accounts.map((item, index) => {
                     data[`associate_clients_${index}`] = item.id
                  })
               } else {
                  data.associate_clients_count = 1
                  data.associate_clients_0 = data.associated_accounts.id
               }
               const cleanedData = Object.fromEntries(Object.entries(data).filter(([key, value]) => (value !== null && typeof value !== 'object')))
               setUserData(cleanedData)
               setIsLoading(false)
            })
            .catch((error) => {
               console.error("Error:", error)
               toast.error('Failed to fetch Lead Detail')
            })
      }
   }

   const fetchStageOptions = () => {
      getReq('leads_stage_get', '')
         .then(res => {
            // console.log(res.data)
            setLeadStageRawOptions(res.data.data)
         })
         .catch((error) => {
            console.error("Error:", error)
         })
   }

   useEffect(() => {
      getCountries()
      if (id) {
         setIsLoading(true)
         fetchData(id)
      }
      fetchStageOptions()
   }, [])

   const handleInputChange = (e, AddressType = 'userData') => {
      if (AddressType === 'userData') {
         const { name, type } = e.target
         let { value } = e.target
         if (type === "tel") {
            value = value.replace(/[^0-9]/g, "")
         }
         setUserData(prev => ({ ...prev, [name]: value }))
      }
   }

   const handleSelectInputChange = (options, actionMeta, type = "userData") => {
      if (type === "userData") {
         setUserData(prev => ({ ...prev, [actionMeta.name]: options.value }))
      }
   }

   const valueToCheck = [
      {
         name: 'cust_lead_stage',
         message: 'Please select a Lead Stage',
         type: 'string',
         id: 'cust_lead_stage'
      },
      {
         name: 'title',
         message: 'Please enter your Title',
         type: 'string',
         id: 'title'
      },
      {
         name: 'cust_first_name',
         message: 'Please enter your first name',
         type: 'string',
         id: 'cust_first_name'
      },
      {
         name: 'cust_last_name',
         message: 'Please enter your last name',
         type: 'string',
         id: 'cust_last_name'
      },
      {
         name: 'email',
         message: 'Please enter your email ID',
         type: 'email',
         id: 'email'
      },
      {
         name: 'phone_no',
         message: 'Please enter your phone number',
         type: 'number',
         id: 'phone_no'
      }
   ]

   let checkForm = true
   const handleSubmitSection = (e) => {
      e.preventDefault()
      if (currentStep === 1) {
         checkForm = validForm(valueToCheck, userData)
      } else if (currentStep === 4) {
         checkForm = validForm([...valueToCheck], userData)
      }
      if (checkForm) {
         postData()
      }
   }

   const handleEmailBlur = () => {
      const emailCheck = validateEmail(userData.email)
      if (!emailCheck) {
         toast.error("Invaild email ID")
      }
   }

   const NavCurrentStep = (step) => {
      checkForm = validForm(valueToCheck, userData)
      if (checkForm) {
         setCurrentStep(step)
      }
   }

   const handleNext = async () => {
      checkForm = validForm(valueToCheck, userData)
      if (checkForm) {
         setCurrentStep(prevStep => prevStep + 1)
      }
   }

   const handleBack = () => {
      setCurrentStep((prevStep) => prevStep - 1)
   }

   const leadStageOptions = []
   leadStageRawOptions.forEach((item) => {
      leadStageOptions.push({
         value: item.stage,
         label: item.stage
      })
   })

   const statusOptions = [
      // { value: 'status', label: 'Status', isDisabled: true },
      { value: 'Open', label: 'Open' },
      { value: 'Contacted', label: 'Contacted' },
      { value: 'Qualified', label: 'Qualified' },
      { value: 'Unqualified', label: 'Unqualified' }
   ]

   const sourceOptions = [
      { value: 'Networking', label: 'Networking' },
      { value: 'Phone Enquiry', label: 'Phone Enquiry' },
      { value: 'Cold Call', label: 'Cold Call' },
      { value: 'Cold Email', label: 'Cold Email' },
      { value: 'Trade Show', label: 'Trade Show' },
      { value: 'Employee Referral', label: 'Employee Referral' },
      { value: 'Client Referral', label: 'Client Referral' },
      { value: 'External Referral', label: 'External Referral' },
      { value: 'SEO / SEM Campaign', label: 'SEO / SEM Campaign' },
      { value: 'Email Marketing Campaign', label: 'Email Marketing Campaign' },
      { value: 'Web - Contact Form', label: 'Web - Contact Form' },
      { value: 'Web - Enquiry Form', label: 'Web - Enquiry Form' },
      { value: 'Web - Search', label: 'Web - Search' },
      { value: 'Webinar', label: 'Webinar' },
      { value: 'Other', label: 'Other' }
   ]

   const ratingOptions = [
      // { value: 'Rating', label: 'Rating', isDisabled: true, isSelected: true },
      { value: 'Cold', label: 'Cold' },
      { value: 'Warm', label: 'Warm' },
      { value: 'Hot', label: 'Hot' }
   ]

   const AllFormData = {
      handleInputChange,
      handleSelectInputChange,
      NavCurrentStep,
      handleBack,
      handleNext,
      handleEmailBlur,
      isEdit,
      countryData,
      userData,
      parentComapany
   }

   return (
      <>
         <style>
            {`
                   input::-webkit-outer-spin-button,
                   input::-webkit-inner-spin-button {
                     -webkit-appearance: none !important;
                     margin: 0;
                   }
                   
                   /* Firefox */
                   input[type=number] {
                     -moz-appearance: textfield;
                   }
                   .css-13cymwt-control, .css-1hb7zxy-IndicatorsContainer, .css-t3ipsp-control, .css-3iigni-container, .css-16xfy0z-control, .social_input, .input-group-text{
                     height: 33.44px;
                     min-height: 33.44px;
                   }
                   .css-1jqq78o-placeholder {
                     font-size: small
                   }
                   .css-1nmdiq5-menu {
                     margin-top: 4px !important
                   }import Address from '../ViewCustomer/components/Address';

                   .css-16xfy0z-control {
                     border-color: rgb(216, 214, 222)
                   }
               `}
         </style>
         <Card>
            <CardBody>
               <h3 className="mb-0">{isEdit ? 'Edit Leads' : 'Add Leads'}</h3>
            </CardBody>
         </Card>
         {
            isLoading ? <>
               <div className='w-100 h-100 d-flex justify-content-center align-content-center'>
                  <Spinner size='40px' />
               </div>
            </> : <>
               <Card>
                  <CardBody>
                     <Row>
                        <Col md='12' className='d-flex justify-content-between align-items-center'>
                           <h4 className='m-0'>Lead Status</h4>
                        </Col>
                        <Col md='6' className='mt-1'>
                           <Label htmlFor="Status">
                              Status
                           </Label>
                           <Select
                              // isDisabled={!editMode}
                              options={statusOptions}
                              placeholder='Select Status'
                              value={statusOptions.find(option => option.value === userData.cust_status_dropdown)}
                              id='Status'
                              name='cust_status_dropdown'
                              onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
                           />
                        </Col>
                        <Col md='6' className='mt-1'>
                           <Label htmlFor="source">
                              Source
                           </Label>
                           <Select
                              // isDisabled={!editMode}
                              options={sourceOptions}
                              placeholder='Select Source'
                              value={sourceOptions.find(option => option.value === userData.cust_source_dropdown)}
                              id='source'
                              name='cust_source_dropdown'
                              onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
                           />
                        </Col>
                        <Col md='6' className='mt-1'>
                           <Label htmlFor="rating">
                              Rating
                           </Label>
                           <Select
                              // isDisabled={!editMode}
                              options={ratingOptions}
                              placeholder='Select Rating'
                              value={ratingOptions.find(option => option.value === userData.cust_rating)}
                              id='rating'
                              name='cust_rating'
                              onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
                           />
                        </Col>
                        <Col md='6' className='mt-1'>
                           <Label htmlFor="leadStage">
                              Lead Stage
                           </Label>
                           <Select
                              // isDisabled={!editMode}
                              options={leadStageOptions}
                              placeholder='Select Lead Stage'
                              value={leadStageOptions.find(option => option.value === userData?.cust_lead_stage)}
                              id='leadStage'
                              name='cust_lead_stage'
                              onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
                           />
                           <p id="cust_lead_stage_val" className="text-danger m-0 p-0 vaildMessage"></p>
                        </Col>
                     </Row>
                  </CardBody>
               </Card>
               <Card>
                  <CardBody>
                     <LeadsNav currentStep={currentStep} NavCurrentStep={NavCurrentStep} />
                     <div className='mt-2'>
                        {[
                           <LeadBasicInfo AllFormData={AllFormData} />,
                           <LeadPersonalInfo AllFormData={AllFormData} />,
                           <LeadAddress AllFormData={AllFormData} />,
                           <LeadCompanyInfo AllFormData={AllFormData} />
                        ][currentStep - 1]}
                     </div>
                     <div className='w-100 d-flex justify-content-between mb-3 mt-2'>
                        <div>
                           <button className={`btn btn-primary me-1 ${currentStep === 1 && 'd-none'}`} onClick={handleBack}>Back</button>
                           {/* <button className='btn btn-primary ' >Cancel</button> */}
                        </div>
                        <div>
                           <a className='btn btn-primary ' onClick={e => handleSubmitSection(e)}>Save</a>
                           <a className={`btn btn-primary ms-1 ${currentStep === 4 && 'd-none'}`} onClick={handleNext}>Next</a>
                        </div>
                     </div>
                  </CardBody>
               </Card>
            </>
         }
      </>
   )
}

export default LeadsMain