/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Input, InputGroup, InputGroupText, Label, Row } from 'reactstrap'
import { Edit } from 'react-feather'
import Select from 'react-select'

const LeadAddress = ({ AllFormData }) => {
   const [country, setCountry] = useState([])
   const { handleInputChange, handleSelectInputChange, userData, postData, countryData, handleBack, handleNext } = AllFormData
   const [sameBillingAddress, setSameBillingAddress] = useState(false)

   useEffect(() => {
      setCountry(
         countryData.map((curElem) => {
            return { value: curElem.name, label: `${curElem.name}` }
         })
      )
   }, [countryData])

   const handleSameBillingAddressChange = () => {
      setSameBillingAddress(!sameBillingAddress)

      // If checked, copy Billing Address to Shipping Address
      if (!sameBillingAddress) {
         handleInputChange({ target: { name: 'shipping_address1', value: userData.address_line1 } })
         handleInputChange({ target: { name: 'shipping_address2', value: userData.address_line2 } })
         handleInputChange({ target: { name: 'shipping_area_building', value: userData.area_building } })
         handleInputChange({ target: { name: 'shipping_landmark', value: userData.landmark } })
         handleInputChange({ target: { name: 'shipping_city', value: userData.city } })
         handleInputChange({ target: { name: 'shipping_state', value: userData.state } })
         handleInputChange({ target: { name: 'shipping_pincode', value: userData.pincode } })
         handleInputChange({ target: { name: 'shipping_country', value: userData.country } })
      }
      // else {
      //    handleInputChange({ target: { name: 'shipping_address1', value: '' } })
      //    handleInputChange({ target: { name: 'shipping_address2', value: '' } })
      //    handleInputChange({ target: { name: 'shipping_area_building', value: '' } })
      //    handleInputChange({ target: { name: 'shipping_landmark', value: '' } })
      //    handleInputChange({ target: { name: 'shipping_city', value: '' } })
      //    handleInputChange({ target: { name: 'shipping_state', value: '' } })
      //    handleInputChange({ target: { name: 'shipping_pincode', value: '' } })
      //    handleInputChange({ target: { name: 'shipping_country', value: null } })
      // }
   }

   return (
      <>
         <Row>
            <Col md='12' className='d-flex justify-content-between align-items-center'>
               <h4 className='m-0'>Billing Address</h4>
            </Col>

            <Col md='4' className='mt-1'>
               <Label for="building">
                  Flat and/or Building/House Details
               </Label>
               <Input
                  id="building"
                  name="address_line1"
                  type="text"
                  placeholder='Flat and/or Building/House Details'
                  value={userData.address_line1}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>

            <Col md='4' className='mt-1'>
               <Label for="street">
                  Street, Lane or Road
               </Label>
               <Input
                  id="street"
                  name="address_line2"
                  type="text"
                  placeholder='Street, Lane or Road'
                  value={userData.address_line2}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>

            <Col md='4' className='mt-1'>
               <Label for="area">
                  Enter Area, Locality or Suburb
               </Label>
               <Input
                  id="area"
                  name="area_building"
                  type="text"
                  placeholder='Enter Area, Locality or Suburb'
                  value={userData.area_building}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>

            <Col md='4' className='mt-1'>
               <Label for="landmark">
                  Landmark
               </Label>
               <Input
                  id="landmark"
                  name="landmark"
                  placeholder='Landmark'
                  type="text"
                  value={userData.landmark}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>

            <Col md='4' className='mt-1'>
               <Label for="city">
                  City
               </Label>
               <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  type="text"
                  value={userData.city}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>

            <Col md='4' className='mt-1'>
               <Label for="state">
                  State
               </Label>
               <Input
                  id="state"
                  name="state"
                  placeholder="State"
                  type="text"
                  value={userData.state}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>


            <Col md='4' className='mt-1'>
               <Label for="pincode">
                  Pincode
               </Label>
               <Input
                  id="pincode"
                  name="pincode"
                  placeholder="Pincode"
                  type="text"
                  value={userData.pincode}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>

            <Col md='4' className='mt-1'>
               <Label for="country2">
                  Country
               </Label>
               <Select
                  options={country}
                  inputId="country"
                  closeMenuOnSelect={true}
                  name="country"
                  placeholder="Select Country"
                  value={country.find(option => option.value === userData?.country) ?? ''}
                  onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
               />
            </Col>
         </Row>
         <Row>
            <Col
               md={12}
               className="mt-3 d-flex align-items-center justify-content-between"
            >
               <h4 className="m-0">Shipping Address</h4>
               <span className="form-check form-check-success">
                  <Input
                     type="checkbox"
                     id="billing-same"
                     className="form-control"
                     name="billingShippingAddressSame"
                     checked={sameBillingAddress}
                     onChange={handleSameBillingAddressChange}
                  />
                  <Label htmlFor="billing-same">Same as Billing Address</Label>
               </span>
            </Col>
            {/* <Col md='12' className='d-flex justify-content-end align-items-center'>
               <Label for='sameBillingAddress' className='fs-6'>
                  Same as Billing Address
               </Label>
               <Input
                  className='form-control'
                  id='sameBillingAddress'
                  type='checkbox'
                  checked={sameBillingAddress}
                  onChange={handleSameBillingAddressChange}
               />
            </Col>
            <Col md='12'>
               <h4>Shipping Address</h4>
            </Col> */}
            <Col md='4' className='mt-1'>
               <Label for="building">
                  Flat and/or Building/House Details
               </Label>
               <Input
                  id="building"
                  name="shipping_address1"
                  type="text"
                  placeholder='Flat and/or Building/House Details'
                  value={userData.shipping_address1}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label for="street">
                  Street, Lane or Road
               </Label>
               <Input
                  id="street"
                  name="shipping_address2"
                  type="text"
                  placeholder='Street, Lane or Road'
                  value={userData.shipping_address2}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label for="area">
                  Enter Area, Locality or Suburb
               </Label>
               <Input
                  id="area"
                  name="shipping_area_building"
                  type="text"
                  placeholder='Enter Area, Locality or Suburb'
                  value={userData.shipping_area_building}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label for="landmark">
                  Landmark
               </Label>
               <Input
                  id="landmark"
                  name="shipping_landmark"
                  type="text"
                  placeholder='Landmark'
                  value={userData.shipping_landmark}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label for="city">
                  City
               </Label>
               <Input
                  id="city"
                  name="shipping_city"
                  type="text"
                  placeholder='City'
                  value={userData.shipping_city}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label for="state">
                  State
               </Label>
               <Input
                  id="state"
                  name="shipping_state"
                  type="text"
                  placeholder='State'
                  value={userData.shipping_state}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>
            <Col md='4' className='mt-1'>
               <Label for="pincode">
                  Pincode
               </Label>
               <Input
                  id="pincode"
                  placeholder="Pincode"
                  name="shipping_pincode"
                  type="text"
                  value={userData.shipping_pincode}
                  //   disabled={!editMode}
                  onChange={handleInputChange}
               />
            </Col>

            <Col md='4' className='mt-1'>
               <Label for="shipping_country">
                  Country
               </Label>
               <Select
                  options={country}
                  inputId="shipping_country"
                  closeMenuOnSelect={true}
                  name="shipping_country"
                  placeholder="Select Country"
                  value={country.find(option => option.value === userData?.shipping_country) ?? ''}
                  onChange={(value, actionMeta) => {
                     handleSelectInputChange(value, actionMeta)
                  }}
               />
            </Col>
         </Row>
      </>
   )
}


export default LeadAddress