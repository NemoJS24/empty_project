/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Card, CardBody, Container, Row, Col } from "reactstrap"
import AsyncSelect from 'react-select/async'
import { crmURL, getReq } from '@src/assets/auth/jwtService'
import axios from "axios"
import Select from "react-select"
// import { createPortal } from 'react-dom'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useParams, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"


const AddVehicle = () => {
   const [formData, setFormData] = useState({})
   const [productModelOption, setProductModelOption] = useState([])
   const [productVariantOption, setProductVariantOption] = useState([])

   const { id } = useParams()

   const loadBrandOptions = (inputValue, callback) => {
      const getUrl = new URL(`${crmURL}/customers/merchant/fetch_car_details/`)
      axios.get(getUrl.toString())
         .then((response) => {
            const successData = response.data.car_brand
            const brandOptions = successData
               .filter((item) => item[0] !== "")
               .map((item) => ({
                  value: item[0],
                  label: item[0]
               }))
            console.log(brandOptions)
            callback(brandOptions)
         })
         .catch((error) => {
            console.error("Error fetching data:", error.message)
            callback([])
         })
   }

   const selectChange = async (e, select) => {
      console.log('getProductOptions runned')
      const url = new URL(`${crmURL}/customers/merchant/fetch_car_details/`)
      const form_data = new FormData()
      select === 'brand' ? form_data.append("brand", e.value) : form_data.append("carmodel", e.value)

      try {
         const response = await fetch(url, {
            method: "POST",
            body: form_data,
         })

         const resp = await response.json()
         console.log("Response ooption:", resp)
         if (resp.car_model) {
            const productModelOptions = []
            resp.car_model.forEach((item) => {
               if (item === "") {
                  return
               }
               productModelOptions.push({
                  value: item,
                  label: item
               })
            })
            setProductModelOption(productModelOptions)
         }
         if (resp.car_variant) {
            const variantOptions = []
            resp.car_variant.map((item) => {
               if (item === "") {
                  return
               }
               variantOptions.push({
                  value: item,
                  label: item
               })
            })
            setProductVariantOption(variantOptions)
         }
      } catch (error) {
         console.error("Error:", error)
         if (error.message === 'Customer already exists') {
            toast.error('Customer already exists')
         } else {
            toast.error('Failed to save customer')
         }
         throw error
      }
   }

   const handleSubmitSection = (event, btn) => {
      event.preventDefault()
      // postData(btn)
   }

   const vehicleTypeOptions = [
      { value: 'new', label: 'New Car' },
      { value: 'used', label: 'Used Car' },
      { value: 'renewal', label: 'Renewal' },
      { value: 'rollover', label: 'Rollover' },
      { value: 'data', label: 'Data' }
   ]

   const startYear = 2000;
   const endYear = 2050;
   const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
   const vehicleYearOption = years.map((year) => ({
     value: year.toString(),
     label: year.toString()
   }))

   return (
      <>
         <div className="customer-profile">
            <Card>
               <CardBody>
                  <h3 className="mb-0">{id ? 'Edit Vehicle' : 'Add Vehilcle'}</h3>
               </CardBody>
            </Card>
            <Card>
               <CardBody>
                  <form >
                     <Container fluid className="px-0 pb-1">
                        <Row>
                           <Col md={12} className="">
                              <h4 className="mb-0">Applicant Details</h4>
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="customer-name">
                                 Customer Name
                              </label>
                              <input type='text' id='customer-name' name='product.customer_name' className="form-control"
                                 // value={formData?.customer_name}
                                 // onChange={handleInputChange} 
                                 disabled
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="registration-name">
                                 Registration Name
                              </label>
                              <input
                                 placeholder='Registration Number'
                                 type='text' id='registration-name' name='product.registration_number' className="form-control"
                              // value={productFormData.registration_number}
                              // onChange={handleInputChange}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="sales-person">
                                 Sales Person
                              </label>
                              <input
                                 placeholder='Sales Person'
                                 type='text' id='sales-person' name='product.sales_executive' className="form-control"
                              // value={productFormData?.sales_executive}
                              // onChange={handleInputChange}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="vehicle-identification">
                                 Vehicle Identification Number (VIN) or Chassis Number
                              </label>
                              <input
                                 placeholder='Vehicle Identification Number'
                                 type='text' id='vehicle-identification' name='product.vehicle_number' className="form-control"
                              // value={productFormData?.vehicle_number}
                              // onChange={handleInputChange}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="engine-number">
                                 Engine Number
                              </label>
                              <input
                                 placeholder='Engine Number'
                                 type='text' id='engine-number' name='product.engine_no' className="form-control"
                              // value={productFormData?.engine_no}
                              // onChange={handleInputChange}
                              />
                           </Col>

                           <Col md={6} className="mt-2">
                              <label htmlFor="vehicle-type" className="" style={{ margin: '0px' }}>
                                 Vehicle Type
                              </label>
                              <Select
                                 placeholder='Vehicle Type'
                                 id="vehicle-type"
                                 options={vehicleTypeOptions}
                                 closeMenuOnSelect={true}
                              // value={insuranceOptions?.find(option => option.value === productFormData?.vehicle_type)}
                              // onChange={e => handleInputChange(e, 'product.vehicle_type')}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="brand-select" className="" style={{ margin: '0px' }}>
                                 Select Brand
                              </label>
                              <AsyncSelect
                                 placeholder='Select Brand'
                                 defaultOptions
                                 cacheOptions
                                 id="brand-select"
                                 loadOptions={loadBrandOptions}
                                 onChange={(e) => selectChange(e, 'brand')}
                              //  value={selectedOption}
                              />
                           </Col>

                           <Col md={6} className="mt-2">
                              <label htmlFor="model-select" className="" style={{ margin: '0px' }}>
                                 Select Model
                              </label>
                              <Select
                                 placeholder='Select Model'
                                 id="model-select"
                                 options={productModelOption}
                                 closeMenuOnSelect={true}
                                 onChange={e => selectChange(e, 'model')}
                              // isLoading={loading}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="variant-select" className="" style={{ margin: '0px' }}>
                                 Select Variant
                              </label>
                              <Select
                                 placeholder='Select Variant'
                                 id="variant-select"
                                 options={productVariantOption}
                                 closeMenuOnSelect={true}
                              // onChange={e => handleInputChange(e, 'product.variant')}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="manufacture-select" className="" style={{ margin: '0px' }}>
                                 Vehicle Manufacture Year
                              </label>
                              <Select
                                 placeholder='Select Variant'
                                 id="manufacture-select"
                                 options={vehicleYearOption}
                                 closeMenuOnSelect={true}
                              // onChange={e => handleInputChange(e, 'product.variant')}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="vehicle-delivery-date">
                                 Vehicle Delivery Date
                              </label>
                              <input placeholder="Vehicle Delivery Date" type='date' id='vehicle-delivery-date' name='product.delivery_date' className="form-control"
                              // value={productFormData.delivery_date}
                              // onChange={handleInputChange}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="vehicle-registration-date">
                                 Vehicle Registration Date
                              </label>
                              <input placeholder="Vehicle Registration Date" type='date' id='vehicle-registration-date' name='product.registeration_date' className="form-control"
                              // value={productFormData?.registeration_date}
                              // onChange={handleInputChange}
                              />
                           </Col>
                        </Row>
                        <div className='w-100 d-flex justify-content-end mt-2'>
                           <button className="btn btn-primary" type="button" onClick={e => handleSubmitSection(e, 'SAVE & CLOSE')} >Save & Close</button>
                           <button className="btn btn-primary ms-2" type="button" onClick={e => handleSubmitSection(e, 'SAVE')} >Save</button>
                        </div>
                     </Container>
                  </form>
               </CardBody>
            </Card>
         </div></>
   )
}

export default AddVehicle