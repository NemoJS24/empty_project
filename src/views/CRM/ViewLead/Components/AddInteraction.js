/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Container, Row, Col, Input } from "reactstrap"
import Select from "react-select"
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getReq, postReq } from '../../../../assets/auth/jwtService'
import { validForm } from '../../../Validator'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'

const LeadAddInteraction = () => {
   const [userData, setUserData] = useState()
   const [scheduleData, setScheduleData] = useState({
      eventRecurr: 'No'
   })

   // const valueToCheck = [
   //    {
   //       name: 'customer_name',
   //       message: 'Enter Customer Name',
   //       type: 'string',
   //       id: 'customer_name'
   //    },
   //    {
   //       name: 'Call_Status',
   //       message: 'Select Call Status',
   //       type: 'string',
   //       id: 'Call_Status'
   //    },
   //    {
   //       name: 'Call_Purpose',
   //       message: 'Select Call Purpose',
   //       type: 'string',
   //       id: 'call_purpos'
   //    },
   //    {
   //       name: 'Lead_Status',
   //       message: 'Select Lead Status',
   //       type: 'string',
   //       id: 'Lead_Status'
   //    },
   //    {
   //       name: 'Interested',
   //       message: 'Select Interested',
   //       type: 'string',
   //       id: 'Interested'
   //    }
   // ]

   const navigate = useNavigate()

   const { id } = useParams()
   const params = new URLSearchParams(location.search)

   const [data, setData] = useState({
      schedule_Next_Call: false,
      email: false,
      sms: false
   })

   console.log(data, "data")

   const inputChangeHandler = (e) => {
      console.log(e)
      setData({ ...data, [e.target.name]: e.target.value })
   }
   const inputChangeHandlerSchedule = (e) => {
      console.log(e)
      setScheduleData(prev => ({ ...prev, [e.target.name]: e.target.value }))
   }

   const saveData = (action) => {
      const form_data = new FormData()
      Object.entries(data).map(([key, value]) => form_data.append(key, key === "schedule_Next_Call" ? Number(value) : value))
      if (data.schedule_Next_Call === true) {
         Object.entries(scheduleData).map(([key, value]) => form_data.append(key, value))
      }
      // form_data.append('xircls_customer_id', id)
      form_data.append('lead_id', id)

      if (params.get('type') === "edit") {
         form_data.append("add_call_id", id)
      }

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

   const getUser = () => {
      getReq('leads_get', `?lead_id=${id}`)
         .then((resp) => {
            setUserData(resp.data.data)
            //  setIsLoading(false)
         })
         .catch((err) => {
            console.log(err)
         })
   }

   const handleSubmitSection = (e, action) => {
      e.preventDefault()

      // const checkForm = validForm(valueToCheck, data)
      // console.log(checkForm, "result")

      // if (checkForm) {
      console.log("Form is valid")

      saveData(action)
      // }
   }


   const handleInputChange = (e) => {
      console.log(e)
      const { name, value, type } = e.target
      setData(prev => ({
         ...prev,
         [name]: type === 'checkbox' ? !prev[name] : value
      }))
   }

   // const handleInputChange = (e, type) => {
   //    if (type === undefined) {
   //       const { name, value, type } = e.target
   //       setData(prev => ({
   //          ...prev,
   //          [name]: type === 'checkbox' ? !prev[name] : value
   //       }))
   //    } else {
   //       setData(prev => ({
   //          ...prev,
   //          [type]: value
   //       }))
   //    }
   // }

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

   const smsOptions = []

   const callInteractionOptions = [
      { value: 'VoiceCall', label: 'Voice Call' },
      { value: 'VideoCall', label: 'Video Call' },
      { value: 'Email', label: 'Email' },
      { value: 'WhatsappMessage', label: 'Whatsapp Message' }
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

   const periodOptions = [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' }
   ]

   // const fetchServiceData = () => {

   //    const form_data = new FormData()

   //    form_data.append("id", id)
   //    postReq("get_view_customer", form_data)
   //       .then((resp) => {
   //          console.log("ResponseId:", resp)
   //          let updatedData
   //          if (params.get('type') === "customer") {
   //             updatedData = {
   //                customer_name: resp?.data?.success[0]?.customer_name,
   //                customer_id: resp?.data?.success[0]?.id
   //             }

   //          } else if (params.get('type') === "edit") {
   //             updatedData = {
   //                customer_name: resp?.data?.success[0]?.customer?.customer_name,
   //                customer_id: resp?.data?.success[0]?.customer?.id,
   //                Call_Status: resp?.data?.success[0]?.Call_Status,
   //                Call_Purpose: resp?.data?.success[0]?.Call_Purpose,
   //                Lead_Status: resp?.data?.success[0]?.Lead_Status,
   //                Note: resp?.data?.success[0]?.Note,
   //                Interested: resp?.data?.success[0]?.Interested,
   //                schedule_Next_Call: resp?.data?.success[0]?.schedule_Next_Call,
   //                schedule_Next_Call_date: resp?.data?.success[0]?.schedule_Next_Call_date,
   //                schedule_Next_Call_time: resp?.data?.success[0]?.schedule_Next_Call_time,
   //                email: false,
   //                sms: false
   //             }
   //          }
   //          setData((preData) => ({
   //             ...preData,
   //             ...updatedData
   //          }))
   //       })
   //       .catch((error) => {
   //          console.error("Error:", error)
   //          toast.error('Failed to fetch Customer details')
   //       })
   // }

   useEffect(() => {
      // fetchServiceData()
      getUser()
   }, [])

   return (
      <>
         <style>
            {`
         .hideDate .flatpickr-innerContainer {
            display: none !important;
         }
      `}
         </style>
         <div className="customer-profile">
            <Card>
               <CardBody>
                  {/* <h3 className="mb-0">{id ? 'Edit Vehicle' : 'Add Vehilcle'}</h3> */}
                  <h3 className="mb-0">Add Interaction</h3>
               </CardBody>
            </Card>
            <Card>
               <CardBody>
                  <form >
                     <Container fluid className="px-0 pb-1">
                        <Row>
                           {/* <Col md={12} className="">
                              <h4 className="mb-0">Interaction Details</h4>
                           </Col> */}
                           <Col md={4} className="mt-2">
                              <label htmlFor="customer-name">Customer Name</label>
                              <input type='text' id='customer-name' name='customer_name' className="form-control"
                                 value={userData?.customer_name}
                                 // onChange={(e) => inputChangeHandler(e)}
                                 disabled
                              />
                              <p id="customer_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Col md={4} className="mt-2">
                              <label htmlFor="interaction_type">Interaction Type</label>
                              <Select
                                 placeholder='Interaction Type'
                                 id="interaction_type"
                                 name="interaction_type"
                                 options={callInteractionOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => inputChangeHandler({ target: { name: 'interaction_type', value: e?.value } })}
                                 value={callInteractionOptions.filter(option => data.interaction_type === option.value)}
                              />
                              <p id="Call_Status_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Col md={4} className="mt-2">
                              <label htmlFor="Call_Status">Interaction Status</label>
                              <Select
                                 placeholder='Interaction Status'
                                 id="call_status"
                                 name="Call_Status"
                                 options={callStatusOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => inputChangeHandler({ target: { name: 'Call_Status', value: e?.value } })}
                                 value={callStatusOptions.filter(option => data.Call_Status === option.value)}
                              />
                              <p id="Call_Status_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           {/* <Col md={4} className="mt-2">
                              <label htmlFor="call_purpos">SMS</label>
                              <Select
                                 placeholder='SMS'
                                 id="call_purpos"
                                 name="Call_Purpose"
                                 options={smsOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'Call_Purpose', value: e?.value } })
                                 }}
                                 value={smsOptions.filter(option => data.Call_Purpose === option.value)}
                              />
                              <p id="call_purpos_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col> */}
                           <Col md={4} className="mt-2">
                              <label htmlFor="call_purpos">Call Purpose</label>
                              <Select
                                 placeholder='Call Purpose'
                                 id="call_purpos"
                                 name="Call_Purpose"
                                 options={callPurposeOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'Call_Purpose', value: e?.value } })
                                 }}
                                 value={callPurposeOptions.filter(option => data.Call_Purpose === option.value)}
                              />
                              <p id="call_purpos_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Col md={4} className="mt-2">
                              <label htmlFor="Lead_Status" className="" style={{ margin: '0px' }}>
                                 Lead Status
                              </label>
                              <Select
                                 placeholder='Lead Status'
                                 id="Lead_Status"
                                 name="Lead_Status"
                                 // isDisabled={viewPage}
                                 options={leadStatusOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'Lead_Status', value: e?.value } })
                                 }}
                                 value={leadStatusOptions.filter(option => data.Lead_Status === option.value)}
                              />
                              <p id="Lead_Status_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Col md={12} className="mt-2">
                              <label htmlFor="notes-label" className="" style={{ margin: '0px' }}>
                                 Notes
                              </label>
                              {/* <div className="form-floating"> */}
                              <textarea className="form-control" placeholder="Leave a note here" id="notes-label" style={{ minHeight: '90px' }}
                                 onChange={(e) => inputChangeHandler({ target: { name: 'Note', value: e.target.value } })}
                                 value={data?.Note} />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="interested" className="" style={{ margin: '0px' }}>
                                 Interested
                              </label>
                              <Select
                                 placeholder='Interested'
                                 // isDisabled={viewPage}
                                 options={linterestedOptions}
                                 closeMenuOnSelect={true}
                                 onChange={(e) => {
                                    inputChangeHandler({ target: { name: 'Interested', value: e?.value } })
                                 }}
                                 value={linterestedOptions?.filter(option => option.value === data?.Interested)}
                              // onChange={e => handleInputChange(e, 'vehicle_type')}
                              />
                              <p id="Interested_val" className="text-danger m-0 p-0 vaildMessage"></p>
                           </Col>
                           <Row>
                              <Col md={12} className="mt-2">
                                 <div className="d-flex justify-content-start align-items-center gap-1">
                                    <input
                                       type="checkbox"
                                       id="schedule_Next_Call"
                                       className="form-check-input cursor-pointer"
                                       name="schedule_Next_Call"
                                       checked={data.schedule_Next_Call}
                                       onChange={handleInputChange}
                                    />
                                    <label htmlFor="schedule_Next_Call">Schedule Next Interaction</label>
                                 </div>
                              </Col>

                              {data.schedule_Next_Call && (
                                 <>
                                    {/* <Col md={4} className="mt-2">
                                       <label htmlFor="scheWith">Schedule With</label>
                                       <Select
                                          placeholder='Select User'
                                          id="scheWith"
                                          name="scheWith"
                                          options={callStatusOptions}
                                          closeMenuOnSelect={true}
                                          onChange={(e) => inputChangeHandlerSchedule({ target: { name: 'scheWith', value: e?.value } })}
                                          value={callStatusOptions.filter(option => scheduleData?.scheWith === option.value)}
                                       />
                                       <p id="scheWith_val" className="text-danger m-0 p-0 vaildMessage"></p>
                                    </Col>
                                    <Col md={4} className="mt-2">
                                       <label htmlFor="timezoneABBR">Timezone</label>
                                       <Select
                                          placeholder='Select Timezone'
                                          id="timezoneABBR"
                                          name="timezoneABBR"
                                          options={callStatusOptions}
                                          closeMenuOnSelect={true}
                                          onChange={(e) => inputChangeHandlerSchedule({ target: { name: 'timezoneABBR', value: e?.value } })}
                                          value={callStatusOptions.filter(option => scheduleData?.timezoneABBR === option.value)}
                                       />
                                       <p id="timezoneABBR_val" className="text-danger m-0 p-0 vaildMessage"></p>
                                    </Col>
                                    <Col md={4} className="mt-2">
                                       <label htmlFor="timezone">Country</label>
                                       <Select
                                          placeholder='Select Country'
                                          id="timezone"
                                          name="timezone"
                                          options={callStatusOptions}
                                          closeMenuOnSelect={true}
                                          onChange={(e) => inputChangeHandlerSchedule({ target: { name: 'timezone', value: e?.value } })}
                                          value={callStatusOptions.filter(option => scheduleData?.timezone === option.value)}
                                       />
                                       <p id="timezone_val" className="text-danger m-0 p-0 vaildMessage"></p>
                                    </Col>

                                    <Col md={4} className="mt-2 d-flex align-items-center">
                                       <div className='d-flex justify-content-start'>
                                          <div className="form-check">
                                             <input
                                                className="form-check-input"
                                                type="radio"
                                                name="eventRecurr"
                                                id="flexRadioDefault1"
                                                value='Yes'
                                                checked={scheduleData?.eventRecurr === 'Yes'}
                                                onChange={inputChangeHandlerSchedule}
                                             />
                                             <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                Yes
                                             </label>
                                          </div>
                                          <div className="form-check ms-2">
                                             <input
                                                className="form-check-input"
                                                type="radio"
                                                name="eventRecurr"
                                                id="flexRadioDefault2"
                                                checked={scheduleData?.eventRecurr === 'No'}
                                                value='No'
                                                onChange={inputChangeHandlerSchedule}
                                             />
                                             <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                No
                                             </label>
                                          </div>
                                       </div>
                                    </Col>
                                    {scheduleData?.eventRecurr === 'Yes' && (<Col md={4} className="mt-2">
                                       <label htmlFor="eventPeriod">Period</label>
                                       <Select
                                          placeholder='Select Period'
                                          id="eventPeriod"
                                          name="eventPeriod"
                                          options={periodOptions}
                                          closeMenuOnSelect={true}
                                          onChange={(e) => inputChangeHandlerSchedule({ target: { name: 'eventPeriod', value: e?.value } })}
                                          value={periodOptions.filter(option => scheduleData?.eventPeriod === option.value)}
                                       />
                                    </Col>)} */}
                                    <Col md={6}>
                                       <label htmlFor="schedule_date">Schedule With</label>
                                       <Flatpickr options={{ minDate: "today" }} onChange={(e) => {
                                          console.log(moment(e[0]).format("YYYY-MM-DD"))
                                          setData({ ...data, schedule_Next_Call_date: moment(e[0]).format("YYYY-MM-DD") })
                                       }} className='form-control' />
                                    </Col>
                                    <Col md={6}>
                                       <label htmlFor="schedule_date">Schedule With</label>
                                       <Flatpickr options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }} onChange={(e) => {
                                          console.log(moment(e[0]).format("hh:mm a"))
                                          setData({ ...data, schedule_Next_Call_time: moment(e[0]).format("hh:mm a") })
                                       }} className='form-control hideDate' />
                                    </Col>
                                 </>
                              )}
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

export default LeadAddInteraction