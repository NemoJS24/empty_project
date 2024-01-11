import React, { useState } from 'react'
import { Card, CardBody, Container, Row, Col, Input } from "reactstrap"
import Select from "react-select"

const AddCall = () => {
   const [formData, setFormData] = useState({})

   const handleInputChange = (e, type) => {
      if (type === undefined) {
         const { name, value } = e.target
         setFormData(prev => ({
            ...prev,
            [name]: value
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
                              <label htmlFor="customer-name">
                                 Customer Name
                              </label>
                              <input type='text' id='customer-name' name='customer_name' className="form-control"
                                 value={formData?.customer_name}
                              // onChange={handleInputChange} 
                              // disabled={id || viewPage}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="call-status" className="" style={{ margin: '0px' }}>
                                 Call Status
                              </label>
                              <Select
                                 placeholder='Call Status'
                                 id="call-status"
                                 // isDisabled={viewPage}
                                 options={callStatusOptions}
                                 closeMenuOnSelect={true}
                              // value={callStatusOptions?.filter(option => option.value === formData?.vehicle_type)}
                              // onChange={e => handleInputChange(e, 'vehicle_type')}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="call-purpos" className="" style={{ margin: '0px' }}>
                                 Call Purpose
                              </label>
                              <Select
                                 placeholder='Call Purpose'
                                 id="call-purpos"
                                 // isDisabled={viewPage}
                                 options={callPurposeOptions}
                                 closeMenuOnSelect={true}
                              // value={callPurposeOptions?.filter(option => option.value === formData?.vehicle_type)}
                              // onChange={e => handleInputChange(e, 'vehicle_type')}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="lead-status" className="" style={{ margin: '0px' }}>
                                 Lead Status
                              </label>
                              <Select
                                 placeholder='Lead Status'
                                 id="lead-status"
                                 // isDisabled={viewPage}
                                 options={leadStatusOptions}
                                 closeMenuOnSelect={true}
                              // value={leadStatusOptions?.filter(option => option.value === formData?.vehicle_type)}
                              // onChange={e => handleInputChange(e, 'vehicle_type')}
                              />
                           </Col>
                           <Col md={12} className="mt-2">
                              <label htmlFor="notes-label" className="" style={{ margin: '0px' }}>
                                 Notes
                              </label>
                              {/* <div className="form-floating"> */}
                                 <textarea className="form-control" placeholder="Leave a note here" id="notes-label" style={{ minHeight: '90px' }}></textarea>
                                 {/* <label htmlFor="notes-label">Notes</label> */}
                              {/* </div> */}
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="interested-label" className="" style={{ margin: '0px' }}>
                                 Interested
                              </label>
                              <Select
                                 placeholder='Interested'
                                 id="interested-label"
                                 // isDisabled={viewPage}
                                 options={linterestedOptions}
                                 closeMenuOnSelect={true}
                              // value={linterestedOptions?.filter(option => option.value === formData?.vehicle_type)}
                              // onChange={e => handleInputChange(e, 'vehicle_type')}
                              />
                           </Col>
                           <Col md={12} className="mt-2">
                              <div>
                                 {/* <span className="form-check form-check-primary"> */}
                                 <input
                                    type="checkbox"
                                    id="schedule-next-call"
                                    className="form-check-input"
                                    name="schedule_call"
                                    checked={formData?.schedule_call}
                                    onChange={handleInputChange}
                                 />
                                 <label htmlFor="schedule-next-call" style={{ marginLeft: '10px' }}>Schedule Next Call</label>
                                 {/* </span> */}
                              </div>
                           </Col>

                           {formData?.schedule_call && <>
                              <Col md={6} className="mt-2">
                                 <label htmlFor="vehicle-delivery-date">
                                    Date:
                                 </label>
                                 <input placeholder="Date" type='date' id='vehicle-delivery-date' name='product.delivery_date' className="form-control"
                                    value={formData?.delivery_date}
                                    onChange={handleInputChange}
                                 />
                              </Col>
                              <Col md={6} className="mt-2">
                                 <label htmlFor="vehicle-delivery-date">
                                    Time:
                                 </label>
                                 <input type="time" id="appt" name="appt" className='form-control'
                                    value={formData?.time}
                                    onChange={handleInputChange}
                                 />
                              </Col>
                           </>}
                           <Col md={12} className="mt-2">
                              <h4 className="mb-0">Send</h4>
                           </Col>
                           <Col md={12} className="mt-1">
                              <div>
                                 <input
                                    type="checkbox"
                                    id="schedule-next-call"
                                    className="form-check-input"
                                    name="email"
                                    checked={formData?.email}
                                    onChange={handleInputChange}
                                 />
                                 <label htmlFor="schedule-next-call" style={{ marginLeft: '10px' }}>Send Email</label>
                              </div>
                           </Col><Col md={12} className="mt-1">
                              <div>
                                 <input
                                    type="checkbox"
                                    id="schedule-next-call"
                                    className="form-check-input"
                                    name="sms"
                                    checked={formData?.sms}
                                    onChange={handleInputChange}
                                 />
                                 <label htmlFor="schedule-next-call" style={{ marginLeft: '10px' }}>Send SMS</label>
                              </div>
                           </Col>
                        </Row>
                        <div className='w-100 d-flex justify-content-between mt-2'>
                           <div>
                              <button className="btn btn-primary" type="button" onClick={() => navigate(-1)} >Back</button>
                           </div>
                           {/* {!viewPage &&  */}
                           <div>
                              <button className="btn btn-primary ms-2" type="button" onClick={e => handleSubmitSection(e, 'SAVE')} >Save</button>
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