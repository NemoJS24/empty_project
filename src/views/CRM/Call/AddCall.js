import React, { useState } from 'react'
import { Card, CardBody, Container, Row, Col, Input } from "reactstrap"
import Select from "react-select"
import { validForm } from '../../Validator'
import { postReq } from '../../../assets/auth/jwtService'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
// import { validForm } from "../Validator"

const AddCall = () => {

   const valueToCheck = [
      {
         name: 'customer_name',
         message: 'Enter Customer Name',
         type: 'string',
         id: 'customer_name'
      },
      {
         name: 'call_status',
         message: 'Select Call Status',
         type: 'string',
         id: 'call_status'
      },
      {
         name: 'call_purpose',
         message: 'Select Call Purpose',
         type: 'string',
         id: 'call_purpos'
      },
      {
         name: 'lead_status',
         message: 'Select Lead Status',
         type: 'string',
         id: 'lead_status'
      },
      {
         name: 'interested',
         message: 'Select Interested',
         type: 'string',
         id: 'interested'
      }
   ]

   const location = useLocation()

   const navigate = useNavigate()

   console.log(location, "location")

   const [formData, setFormData] = useState({ schedule_call: false })
   const [data, setData] = useState({
      customer_name: location?.state?.data?.customer_name,
      call_status: "",
      call_purpose: "",
      lead_status: "",
      interested: "",
      customer_id: location?.state?.data?.id
   })

   const inputChangeHandler = (e) => {
      setData({ ...data, [e.target.name]: e.target.value })
   }

   const saveData = (action) => {

      const form_data = new FormData()

      Object.entries(data).map(([key, value]) => form_data.append(key, value))

      postReq('add_call', form_data)
      .then((resp) => {
         console.log(resp)
         if (action === "SAVE & CLOSE") {
            navigate(-1)
         }

         toast.success("Saved Successfully")
      })
      .catch((error) => {
         console.log(error)
         toast.error("Something went wrong!")
      })
   }

   const handleSubmitSection = (e, action) => {
      e.preventDefault()

      const checkForm = validForm(valueToCheck, data)
      console.log(checkForm, "result")

      if (checkForm) {
         console.log("Form is valid")

         saveData(action)
      }
   }
   const handleInputChange = (e, type) => {
      if (type === undefined) {
         const { name, value, type } = e.target
         setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? !prev[name] : value
         }))
      } else {
         setFormData(prev => ({
            ...prev,
            [type]: value
         }))
      }
   }

   const callStatusOptions = [
      { value: 'Not Contacted', label: 'Not Contacted' },
      { value: 'Attempted to Contact', label: 'Attempted to Contact' },
      { value: 'Contacted', label: 'Contacted' },
      { value: 'Junk Lead', label: 'Junk Lead' },
      { value: 'Not Interested', label: 'Not Interested' },
      { value: 'DND (Call & SMS)', label: 'DND (Call & SMS)' },
      { value: 'DND (Email)', label: 'DND (Email)' },
      { value: 'DND (All)', label: 'DND (All)' },
      { value: 'Junk Lead', label: 'Junk Lead' }
   ]

   const callPurposeOptions = [
      { value: 'prospecting', label: 'Prospecting' },
      { value: 'sale_call', label: 'Sale Call' },
      { value: 'negotiation', label: 'Negotiation' },
      { value: 'close_Sale', label: 'Close Sale' }
   ]

   const leadStatusOptions = [
      { value: 'Cold', label: 'Cold' },
      { value: 'Warm', label: 'Warm' },
      { value: 'Hot', label: 'Hot' },
      { value: 'File Pickup', label: 'File Pickup' }
   ]

   const linterestedOptions = [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
      { value: 'Maybe', label: 'Maybe' }
   ]

   return (
      <>
         <div className="customer-profile">
            <Card>
               <CardBody>
                  {/* <h3 className="mb-0">{id ? 'Edit Vehicle' : 'Add Vehilcle'}</h3> */}
                  <h3 className="mb-0">Add Call</h3>
               </CardBody>
            </Card>
            <Card>
               <CardBody>
                  <form >
                     <Container fluid className="px-0 pb-1">
                        <Row>
                           <Col md={12} className="">
                              <h4 className="mb-0">Call Details</h4>
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="customer-name">Customer Name</label>
                              <input type='text' id='customer-name' name='customer_name' className="form-control"
                                 value={data?.customer_name}
                                 onChange={(e) => {
                                    inputChangeHandler(e)
                                 }}
                                 disabled
                              />
                              <p id="customer_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="call_status">Call Status</label>
                              <Select
                                 placeholder='Call Status'
                                 id="call_status"
                                 options={callStatusOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'call_status', value: e?.value } })
                                 }}
                              />
                              <p id="call_status_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="call_purpos">Call Purpose</label>
                              <Select
                                 placeholder='Call Purpose'
                                 id="call_purpos"
                                 options={callPurposeOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'call_purpose', value: e?.value } })
                                 }}
                              />
                              <p id="call_purpos_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="lead_status" className="" style={{ margin: '0px' }}>
                                 Lead Status
                              </label>
                              <Select
                                 placeholder='Lead Status'
                                 id="lead_status"
                                 // isDisabled={viewPage}
                                 options={leadStatusOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'lead_status', value: e?.value } })
                                 }}
                              // value={leadStatusOptions?.filter(option => option.value === formData?.vehicle_type)}
                              // onChange={e => handleInputChange(e, 'vehicle_type')}
                              />
                              <p id="lead_status_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Col md={12} className="mt-2">
                              <label htmlFor="notes-label" className="" style={{ margin: '0px' }}>
                                 Notes
                              </label>
                              {/* <div className="form-floating"> */}
                              <textarea className="form-control" placeholder="Leave a note here" id="notes-label" style={{ minHeight: '90px' }}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'note', value: e?.value } })
                                 }}
                              ></textarea>
                              {/* <label htmlFor="notes-label">Notes</label> */}
                              {/* </div> */}
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="interested" className="" style={{ margin: '0px' }}>
                                 Interested
                              </label>
                              <Select
                                 placeholder='Interested'
                                 id="interested"
                                 // isDisabled={viewPage}
                                 options={linterestedOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'interested', value: e?.value } })
                                 }}
                              // value={linterestedOptions?.filter(option => option.value === formData?.vehicle_type)}
                              // onChange={e => handleInputChange(e, 'vehicle_type')}
                              />
                              <p id="interested_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Row>
                              <Col md={12} className="mt-2">
                                 <div className="d-flex justify-content-start align-items-center gap-1">
                                    <input
                                       type="checkbox"
                                       id="schedule_next_call"
                                       className="form-check-input cursor-pointer"
                                       name="schedule_call"
                                       checked={formData.schedule_call}
                                       onChange={handleInputChange}
                                    />
                                    <label htmlFor="schedule_next_call">Schedule Next Call</label>
                                 </div>
                              </Col>

                              {formData.schedule_call && (
                                 <>
                                    {/* ... (previous code) */}
                                    <Col md={6} className="mt-2">
                                       <label htmlFor="vehicle-delivery-date">Date:</label>
                                       <input
                                          placeholder="Date"
                                          type="date"
                                          id="vehicle-delivery-date"
                                          name="delivery_date"
                                          className="form-control"
                                          value={formData.delivery_date}
                                          onChange={handleInputChange}
                                       />
                                    </Col>
                                    <Col md={6} className="mt-2">
                                       <label htmlFor="vehicle-delivery-date">Time:</label>
                                       <input
                                          type="time"
                                          id="appt"
                                          name="time"
                                          className="form-control"
                                          value={formData.time}
                                          onChange={handleInputChange}
                                       />
                                    </Col>
                                 </>
                              )}
                           </Row>

                           <Row>
                              <Col md={12} className="mt-2">
                                 <h4 className="mb-0">Send</h4>
                              </Col>
                              <Col md={12} className="mt-1">
                                 <div className="d-flex justify-content-start align-items-center gap-1">
                                    <input
                                       type="checkbox"
                                       id="send_email"
                                       className="form-check-input m-0 p-0 cursor-pointer"
                                       name="email"
                                       checked={formData?.email}
                                       onChange={handleInputChange}
                                    />
                                    <label htmlFor="send_email" >Send Email</label>
                                 </div>
                              </Col>
                              <Col md={12} className="mt-1">
                                 <div className="d-flex justify-content-start align-items-center gap-1">
                                    <input
                                       type="checkbox"
                                       id="send_sms"
                                       className="form-check-input cursor-pointer"
                                       name="sms"
                                       checked={formData?.sms}
                                       onChange={handleInputChange}
                                    />
                                    <label htmlFor="send_sms">Send SMS</label>
                                 </div>
                              </Col>
                           </Row>
                        </Row>
                        <div className='w-100 d-flex justify-content-between mt-3'>
                           <div>
                              <button className="btn btn-primary" type="button" onClick={() => navigate(-1)} >Back</button>
                           </div>
                           {/* {!viewPage &&  */}
                           <div className='d-flex justify-content-center align-items-center gap-2'>
                              <button className="btn btn-primary ms-2" type="button" onClick={e => handleSubmitSection(e, 'SAVE')}>Save</button>
                              <button className="btn btn-primary" type="button" onClick={e => handleSubmitSection(e, 'SAVE & CLOSE')} >Save & Close</button>
                           </div>
                           {/* } */}
                        </div>
                     </Container>
                  </form>
               </CardBody>
            </Card>
         </div>
      </>
   )
}

export default AddCall