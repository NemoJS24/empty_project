/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Card, CardBody, Container, Row, Col } from "reactstrap"
import AsyncSelect from 'react-select/async'
import { baseURL, crmURL, getReq } from '@src/assets/auth/jwtService'
import axios from "axios"
import Select from "react-select"
// import { createPortal } from 'react-dom'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useParams, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"


const AddVehicle = () => {
   const [formData, setFormData] = useState({
      vehicle_type: 'new',
      manufacture_date: '2000'
   })
   const [productModelOption, setProductModelOption] = useState([])
   const [productVariantOption, setProductVariantOption] = useState([])
   const [viewPage, setViewPage] = useState(false)

   const { id } = useParams()
   const navigate = useNavigate()

   let PageTitle = 'Add Vehicle'

   const getUser = (edit) => {
      const form_data = new FormData()
      form_data.append("id", id)
      edit ? form_data.append("edit_type", "is_vehicle") : form_data.append("edit_type", "is_customer_detail")
      axios.post(`${baseURL}/customers/merchant/get_view_customer/`, form_data)
         .then((res) => {
            console.log(res.data.success[0])
            if (edit) {
               setFormData(res.data.success[0])
               setFormData(prev => ({
                  ...prev,
                  delivery_date: prev?.delivery_date?.substring(0, 10) ?? '',
                  registeration_date: prev?.registeration_date?.substring(0, 10) ?? ''
               }))
            }
            else {
               setFormData(prev => ({ ...prev, customer_name: res.data.success[0].customer_name, customer_id: res.data.success[0].id }))
            }
         })
         .catch((err) => {
            console.log(err)
            toast.error('Failed to get Vehicle details')
         })
   }

   const postVehicleDetails = (btn) => {
      const url = new URL(`${crmURL}/vehicle/add_vehicle/`)
      const form_data = new FormData()
      Object.entries(formData).map(([key, value]) => {
         form_data.append(key, value)
      })
      form_data.append("press_btn", btn)

      fetch(url, {
         method: "POST",
         body: form_data
      })
         .then((response) => {
            return response.json()
         })
         .then((resp) => {
            console.log("Response:", resp)
            // resp.is_error ?  toast.error(resp.is_error) :  toast.success('Vehicle saved successfully')
            resp.is_error ? toast.error(resp.is_error) : resp.is_edit ? navigate(`/merchant/customers/edit-vehicle/${resp.vehicle_id}`) : navigate(`/merchant/customers/view_customer/${id}`)
         })
         .catch((error) => {
            console.error("Error:", error)
            toast.error('Failed to save Vehicle')
         })
   }
   const loadBrandOptions = (inputValue, callback) => {
      const getUrl = new URL(`${crmURL}/vehicle/fetch_car_details/`)
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

   useEffect(() => {
      if (location.pathname.startsWith('/merchant/customers/edit-vehicle/')) {
         getUser('edit')
         PageTitle = 'Edit Vehicle'
      } else if (location.pathname.startsWith('/merchant/customers/view-vehicle/')) {
         setViewPage(true)
         getUser('edit')
         PageTitle = 'View Vehicle'
      } else {
         getUser()
      }
   }, [])

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
            [type]: e.value
         }))
      }
   }

   const selectChange = async (e, select) => {
      console.log('getProductOptions runned')
      const url = new URL(`${crmURL}/vehicle/fetch_car_details/`)
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
      postVehicleDetails(btn)
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
                  <h3 className="mb-0">{PageTitle}</h3>
               </CardBody>
            </Card>
            <Card>
               <CardBody>
                  <form >
                     <Container fluid className="px-0 pb-1">
                        <Row>
                           <Col md={12} className="">
                              <h4 className="mb-0">Vehicle Details</h4>
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="customer-name">
                                 Customer Name
                              </label>
                              <input type='text' id='customer-name' name='customer_name' className="form-control"
                                 value={formData?.customer_name}
                                 // onChange={handleInputChange} 
                                 disabled={id || viewPage}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="registration-name">
                                 Registration Name
                              </label>
                              <input
                                 placeholder='Registration Number'
                                 type='text' id='registration-name' name='registration_number' className="form-control"
                                 value={formData?.registration_number}
                                 onChange={handleInputChange}
                                 disabled={viewPage}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="sales-person">
                                 Sales Person
                              </label>
                              <input
                                 placeholder='Sales Person'
                                 type='text' id='sales-person' name='sales_person' className="form-control"
                                 value={formData?.sales_person}
                                 onChange={handleInputChange}
                                 disabled={viewPage}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="vehicle-identification">
                                 Vehicle Identification Number (VIN) or Chassis Number
                              </label>
                              <input
                                 placeholder='Vehicle Identification Number'
                                 type='text' id='vehicle-identification' name='vehicle_number' className="form-control"
                                 value={formData?.vehicle_number}
                                 onChange={handleInputChange}
                                 disabled={viewPage}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="engine-number">
                                 Engine Number
                              </label>
                              <input
                                 placeholder='Engine Number'
                                 type='text' id='engine-number' name='engine_no' className="form-control"
                                 value={formData?.engine_no}
                                 onChange={handleInputChange}
                                 disabled={viewPage}
                              />
                           </Col>

                           <Col md={6} className="mt-2">
                              <label htmlFor="vehicle-type" className="" style={{ margin: '0px' }}>
                                 Vehicle Type
                              </label>
                              <Select
                                 placeholder='Vehicle Type'
                                 id="vehicle-type"
                                 isDisabled={viewPage}
                                 options={vehicleTypeOptions}
                                 closeMenuOnSelect={true}
                                 value={vehicleTypeOptions?.filter(option => option.value === formData?.vehicle_type)}
                                 onChange={e => handleInputChange(e, 'vehicle_type')}
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
                                 onChange={(e) => {
                                    setFormData(prev => ({ ...prev, car_model: '', variant: '' }))
                                    selectChange(e, 'brand')
                                    handleInputChange(e, 'brand')
                                 }}
                                 value={{ value: formData?.brand, label: formData?.brand }}
                                 isDisabled={viewPage}
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
                                 // value={productModelOption.filter(option => formData.car_model === option.value) ?? ''}
                                 value={{ value: formData?.car_model, label: formData?.car_model }}
                                 onChange={e => {
                                    setFormData(prev => ({ ...prev, variant: '' }))
                                    selectChange(e, 'model')
                                    handleInputChange(e, 'car_model')
                                 }}
                                 // isLoading={loading}
                                 isDisabled={viewPage}
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
                                 // value={productVariantOption.filter(option => formData.variant === option.value) ?? ''}
                                 value={{ value: formData?.variant, label: formData?.variant }}
                                 closeMenuOnSelect={true}
                                 onChange={e => handleInputChange(e, 'variant')}
                                 isDisabled={viewPage}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="manufacture-select" className="" style={{ margin: '0px' }}>
                                 Vehicle Manufacture Year
                              </label>
                              <Select
                                 placeholder='Vehicle Manufacture Year'
                                 id="manufacture-select"
                                 options={vehicleYearOption}
                                 value={vehicleYearOption.filter(option => formData?.manufacture_date === option.value) ?? ''}
                                 closeMenuOnSelect={true}
                                 onChange={e => handleInputChange(e, 'manufacture_date')}
                                 isDisabled={viewPage}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="vehicle-delivery-date">
                                 Vehicle Delivery Date
                              </label>
                              <input placeholder="Vehicle Delivery Date" type='date' id='vehicle-delivery-date' name='delivery_date' className="form-control"
                                 value={formData?.delivery_date ?? ''}
                                 onChange={handleInputChange}
                                 disabled={viewPage}
                              />
                           </Col>
                           <Col md={6} className="mt-2">
                              <label htmlFor="vehicle-registration-date">
                                 Vehicle Registration Date
                              </label>
                              <input placeholder="Vehicle Registration Date" type='date' id='vehicle-registration-date' name='registeration_date' className="form-control"
                                 value={formData?.registeration_date}
                                 onChange={handleInputChange}
                                 disabled={viewPage}
                              />
                           </Col>
                        </Row>
                        <div className='w-100 d-flex justify-content-between mt-2'>
                           <div>
                              <button className="btn btn-primary" type="button" onClick={() => navigate(-1)} >Back</button>
                           </div>
                           {!viewPage && <div>
                              <button className="btn btn-primary ms-2" type="button" onClick={e => handleSubmitSection(e, 'SAVE')} >Save</button>
                              <button className="btn btn-primary ms-2" type="button" onClick={e => handleSubmitSection(e, 'SAVE & CLOSE')} >Save & Close</button>
                           </div>}
                        </div>
                     </Container>
                  </form>
               </CardBody>
            </Card>
         </div>
      </>
   )
}

export default AddVehicle