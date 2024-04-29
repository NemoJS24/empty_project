/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'

const LeadBasicInfo = ({ AllFormData }) => {
   const [countryCode, setCountryCode] = useState(91)
   const [country, setCountry] = useState([])

   const { userData, handleInputChange, handleSelectInputChange, countryData, isEdit } = AllFormData

   useEffect(() => {
      setCountry(
         countryData.map((curElem) => {
            return { value: curElem.name, label: `${curElem.name}` }
         })
      )
   }, [countryData])

   const titleOptions = [
      { value: "Mr", label: "Mr." },
      { value: "Ms", label: "Ms." },
      { value: "Mrs", label: "Mrs." },
      { value: "Dr", label: "Dr." },
      { value: "Prof", label: "Prof." }
   ]
   // const editMode = true

   return (
      <>
         <Row>
            <Col md='12' className='d-flex justify-content-between align-items-center'>
               <h4 className='m-0'>Basic Details</h4>
            </Col>
            <Col md='4' className='mt-1'>
               <Label htmlFor="title">
                  Title
               </Label>
               <Select
                  // isDisabled={!editMode}
                  placeholder='Select Title'
                  options={titleOptions}
                  value={titleOptions.find(option => option.value === userData.title)}
                  name='title'
                  onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
               />
               <p id="title_val" className="text-danger m-0 p-0 vaildMessage" />
            </Col>
            <Col md='4' className='mt-1'>
               <Label htmlFor="first_name">
                  First Name
               </Label>
               <Input
                  id="first_name"
                  placeholder='First Name'
                  name="cust_first_name"
                  type="text"
                  // disabled={!editMode}
                  value={userData.cust_first_name}
                  onChange={handleInputChange}
               />
               <p id="cust_first_name_val" className="text-danger m-0 p-0 vaildMessage" />
            </Col>
            <Col md='4' className='mt-1'>
               <Label htmlFor="last_name">
                  Last Name
               </Label>
               <Input
                  placeholder='Last Name'
                  id="last_name"
                  name="cust_last_name"
                  type="text"
                  // disabled={!editMode}
                  value={userData.cust_last_name}
                  onChange={handleInputChange}
               />
               <p id="cust_last_name_val" className="text-danger m-0 p-0 vaildMessage" />
            </Col>
            <Col md='4' className='mt-1'>
               <Label htmlFor="email">
                  Email
               </Label>
               <Input
                  placeholder='Email'
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={isEdit}
               />
               <p id="email_val1" className="text-danger m-0 p-0 vaildMessage" />
               <p id="email_val" className="text-danger m-0 p-0 vaildMessage" />
            </Col>
            <Col md={4} className='mt-1'  >
               <Label htmlFor="country">
                  Country
               </Label>
               <Select
                  options={country}
                  inputId="country"
                  closeMenuOnSelect={true}
                  name="country"
                  placeholder="Select Country"
                  value={country.find(option => option.value === userData?.country) ?? ''}
                  onChange={(value, actionMeta) => {
                     handleSelectInputChange(value, actionMeta)
                     setCountryCode(() => {
                        const phonecode = countryData.find(option => option.name === value?.value).phonecode
                        handleInputChange({ target: { name: 'phone_code', value: phonecode } })
                        return phonecode
                     })
                     // setCountryCode(countryData.find(option => option.name === value?.value).phonecode)
                  }}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label htmlFor="number">
                  Mobile Number
               </Label>
               <div class="input-group " style={{ height: '33.44px' }}>
                  <span class="input-group-text" id="basic-addon1" style={{ height: '33.44px', backgroundColor: '#efefef' }} disabled={isEdit}>+{countryCode}</span>
                  <Input
                     type="tel"
                     placeholder="Mobile Number"
                     name='phone_no'
                     value={userData.phone_no}
                     onChange={handleInputChange}
                     aria-label="Mobile Number" 
                  disabled={isEdit}
                     />
               </div>
               <p id="phone_no_val" className="text-danger m-0 p-0 vaildMessage"></p>
            </Col>
            <Col md='4' className='mt-1'>
               <Label htmlFor="alt_number">
                  Alternate Mobile Number
               </Label>
               <Input
                  placeholder='Mobile Number'
                  id="alt_number"
                  name="phone_no2"
                  type="tel"
                  // disabled={!editMode}
                  value={userData.phone_no2}
                  onChange={handleInputChange}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label htmlFor="land_number">
                  Landline Number
               </Label>
               <Input
                  placeholder='Landline Number'
                  id="land_number"
                  name="landline1"
                  type="tel"
                  // disabled={!editMode}
                  value={userData.landline1}
                  onChange={handleInputChange}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label htmlFor="alt_land_number">
                  Alternate Landline Number
               </Label>
               <Input
                  placeholder='Landline Number'
                  id="alt_land_number"
                  type="tel"
                  name="landline2"
                  // isDisabled={!editMode}
                  value={userData.landline2}
                  onChange={handleInputChange}
               />
            </Col>
         </Row>
      </>
   )
}

export default LeadBasicInfo