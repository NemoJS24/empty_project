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

/* eslint-disable */
const AddInsurance = () => {
    const [formData, setFormData] = useState({})
    const [customerFormData, setCustomerFormData] = useState({
        title: "",
        cust_first_name: "",
        cust_last_name: "",
        email: "",
        phone_no: "",
        country: "",
        city: "",
        state: "",
        pincode: ""
    })

    console.log({formData, customerFormData}, "formData")

    const [productFormData, setProductFormData] = useState({})
    const [isAddProductHidden, setIsAddProductHidden] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const [productOptions, setProductOptions] = useState([])
    const [vehicleOptions, setVehicleOptions] = useState([])
    const [country, setCountry] = useState("")
    const [productModelOption, setProductModelOption] = useState([])
    const [productVariantOption, setProductVariantOption] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [allOptions, setAllOptions] = useState([])

    const navigate = useNavigate()
    const { id } = useParams()

    // const handleInputChange = (e, type) => {
    //     console.log(e)
    //     if (type === undefined) {
    //         const { name, value } = e.target
    //         if (name.includes('.')) {
    //             const [parent, child] = name.split('.')
    //             if (parent === 'customer') {
    //                 setCustomerFormData(prevData => ({
    //                     ...prevData,
    //                     [child]: value
    //                 }))
    //             } else if (parent === 'product') {
    //                 setProductFormData(prevData => ({
    //                     ...prevData,
    //                     [child]: value
    //                 }))
    //             }
    //         } else {
    //             setFormData(prevData => ({
    //                 ...prevData,
    //                 [name]: value
    //             }))
    //         }
    //     } else if (type === "tel") {
    //         let { value } = e.target
    //         const { name } = e.target
    //         value = value.replace(/[^0-9]/g, "")
    //         setFormData(prevFormData => ({
    //             ...prevFormData,
    //             [name]: value
    //         }))
    //     } else if (type) {
    //         console.log(e)
    //         if (type.includes('.')) {
    //             const [parent, child] = type.split('.')
    //             if (parent === 'customer') {
    //                 setCustomerFormData(prevData => ({
    //                     ...prevData,
    //                     [child]: e.value
    //                 }))
    //             } else if (parent === 'product') {
    //                 setProductFormData(prevData => ({
    //                     ...prevData,
    //                     [child]: e.value
    //                 }))
    //             }
    //         } else {
    //             setFormData(prevFormData => ({
    //                 ...prevFormData,
    //                 [type]: e.value
    //             }))
    //         }
    //     }
    // }

    const handleInputChange = (e, type="formData") => {
        if (type === "formData") {
            setFormData({...formData, [e.target.name]: e.target.value})
        } else {
            setCustomerFormData({...customerFormData, [e.target.name]: e.target.value})
        }
    }

    // const handleInputChangeCustomerFrom = (e) => {
    //     setCustomerFormData({...customerFormData, [e.target.name]: e.target.value})
    // }

    const handleChange = (options, actionMeta, check, type="formData") => {
        if (check) {
            const option_list = options.map((cur) => {
                return cur.value
            })
            if (type === "formData") {
                setFormData({ ...formData, [actionMeta.name]: option_list })

            } else {
                setCustomerFormData({ ...customerFormData, [actionMeta.name]: option_list })
            }
        } else {
            if (type === "formData") {
                setFormData({ ...formData, [actionMeta.name]: options.value })
            } else {
                setCustomerFormData({ ...customerFormData, [actionMeta.name]: options.value })
            }
            
        }

    }

    // const handleChangeCustomerForm = (options, actionMeta, check) => {
    //     if (check) {
    //         const option_list = options.map((cur) => {
    //             return cur.value
    //         })
    //         setCustomerFormData({ ...customerFormData, [actionMeta.name]: option_list })
    //     } else {
    //         setCustomerFormData({ ...formData, [actionMeta.name]: options.value })
    //     }

    // }

    const fetchInsuranceData = (id) => {
        const url = new URL(`${crmURL}/customers/merchant/get_view_customer/`)
        const form_data = new FormData()
        form_data.append("id", id)
        form_data.append('edit_type', 'is_insurance')
        fetch(url, {
            method: "POST",
            body: form_data
        })
            .then((response) => {
                return response.json()
            })
            .then((resp) => {
                console.log("ResponseId:", resp.success[0])
                const newObject = {};
                for (const key in resp.success[0]) {
                    if (resp.success[0].hasOwnProperty(key) && resp.success[0][key] !== null) {
                        newObject[key] = resp.success[0][key];
                    }
                }
                // console.log('AfterRemovingNullId', newObject);
                setFormData(newObject)
                // setFormData(prefData => ({
                //     ...prefData,
                //     job_card_date: prefData.job_card_date.substring(0, 10),
                //     service_expiry_date: prefData.service_expiry_date.substring(0, 10),
                //     service_invoice_date: prefData.service_invoice_date.substring(0, 10),
                //     updated_at: prefData.updated_at.substring(0, 10)
                // }))
            })
            .catch((error) => {
                console.error("Error:", error)
                toast.error('Failed to fetch Servicing Detail')
            })
    }

    const postData = (btn) => {
        console.log(formData)
        const url = new URL(`${crmURL}/customers/merchant/get_add_insurance/`)
        const form_data = new FormData()
        Object.entries(formData).map(([key, value]) => {
            form_data.append(key, value)
        })
        form_data.append("press_btn", btn)
        id && form_data.append("insurance_id", id)

        fetch(url, {
            method: "POST",
            body: form_data
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('Customer already exists')
                } else {
                    toast.error(`HTTP error! Status: ${response.status}`)
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
            }
            return response.json()
        })
        .then((resp) => {
            console.log("Response:", resp)
            toast.success('Insurance saved successfully')
            resp.is_edit_url ? navigate(`merchant/customers/insurance/edit_insurance/${resp.insurance_code}`) : navigate(`/merchant/customers/insurance/`)
            fetchInsuranceData(resp.insurance_code)
        })
        .catch((error) => {
            console.error("Error:", error)
            if (error.message === 'Customer already exists') {
                toast.error('Customer already exists')
            } else {
                toast.error('Failed to save customer')
            }
        })
    }

    const postNewCustomerData = () => {
        console.log(customerFormData)
        const url = new URL(`${crmURL}/customers/merchant/add_customer/`)
        const form_data = new FormData()
        Object.entries(customerFormData).map(([key, value]) => {
            console.log(key, ": ", value)
            form_data.append(key, value)
        })
        form_data.append("dropdown", 'regular')
        form_data.append("pin", 'INsdfsdfsDV')
        form_data.append("entry_point", 'INDV')
        form_data.append("press_btn", 'SAVE & CLOSE')

        fetch(url, {
            method: "POST",
            body: form_data
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 409) {
                        throw new Error('Customer already exists')
                    }
                    else {
                        toast.error(`HTTP error! Status: ${response.status}`)
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                }
                return response.json()
            })
            .then((resp) => {
                console.log("Response:", resp)
                toast.success('Customer saved successfully')
            })
            .catch((error) => {
                console.error("Error:", error)
                if (error.message === 'Customer already exists') {
                    toast.error('Customer already exists')
                } else {
                    toast.error('Failed to save customer')
                }
            })
    }

    const postVehicleDetails = () => {
        const url = new URL(`${crmURL}/customers/merchant/add_vehicle_details/`)
        const form_data = new FormData()
        Object.entries(productFormData).map(([key, value]) => {
            form_data.append(key, value)
        })
        form_data.append("press_btn", 'SAVE')

        fetch(url, {
            method: "POST",
            body: form_data
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 409) {
                        throw new Error('Vehicle  already exists')
                    }
                }
                return response.json()
            })
            .then((resp) => {
                console.log("Response:", resp)
                toast.success('Vehicle saved successfully')
                handleClose('product')
            })
            .catch((error) => {
                console.error("Error:", error)
                    toast.error('Failed to save Vehicle')
            })
    }

    const getCountries = () => {
        getReq("countries")
            .then((resp) => {
                console.log(resp)
                setCountry(
                    resp.data.data.countries.map((curElem) => {
                        return { value: curElem.id, label: `${curElem.name}` }
                    })
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const loadOptions = (inputValue, callback) => {
        // console.log(callback, 'callback')
        fetchCustomerData(currentPage, inputValue, callback)
    }

    const fetchCustomerData = async (page, inputValue, callback) => {
        // console.log(callback, 'callback2')
        try {
            const response = await axios.get(
                `https://api.demo.xircls.in/customers/merchant/get_customer_details/?page=${page}`
            )
            const successData = response.data.success
            // console.log(successData)
            if (successData && Array.isArray(successData)) {
                const customerOptions = successData
                    .filter((item) => item.customer_name !== "")
                    .map((customer) => ({
                        value: customer.id,
                        label: customer.customer_name
                    }))
                let option = [...allOptions, ...customerOptions]
                console.log(option, "option")
                setAllOptions(option)
                callback(option)
                // setCurrentPage((prevPage) => prevPage + 1)
                setCurrentPage((prevPage) => {
                    const nextPage = Math.min(prevPage + 1, (response.data.total_count / 100))
                    return nextPage
                })
            } else {
                console.error("Invalid or missing data in the API response")
                callback([])
            }
        } catch (error) {
            console.error("Error fetching data:", error.message)
        }
    }

    useEffect(() => {
        getCountries()
        fetchCustomerData(currentPage, null, () => { })
        if (id) {
            fetchInsuranceData(id)
        }
    }, [])

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

    const changeProductName = (data) => {
        const productOptions = data.car_variant.map(item => {
            let value = item[0]
            let label = item.slice(1).filter(Boolean).join(' -- ')
            return {
                value: value,
                label: label
            }
        })
        setProductOptions(productOptions)
    }

    const changeVehicleOptions = (data) => {
        const vehicleOptionss = data.car_variant.map(item => {
            return {
                value: item[3],
                label: item[3] === null ? 'null' : item[3]
            }
        })
        setVehicleOptions(vehicleOptionss)
    }

    const selectCustomer = (value, actionMeta, check) => {
        handleChange(value, {name: "customer_name_id"}, check)
        // setFormData(prevData => ({ ...prevData, customer_name: e.label }))
        const form_data = new FormData()
        const url = new URL(`${crmURL}/customers/merchant/fetch_vehicle_details/`)
        form_data.append("id", value.value)
        // "SHIVAM KALE"
        fetch(url, {
            method: "POST",
            body: form_data
        })
        .then((response) => {
            return response.json()
        })
        .then((resp) => {
            console.log("Response:", resp)
            if (resp.car_variant) {
                changeProductName(resp)
                changeVehicleOptions(resp)
            }
        })
        .catch((error) => {
            console.error("Error:", error)
            (error.message) ? toast.error(error.message) : toast.error(error)
        })
    }

    const handleClose = (type) => {
        (type === 'customer') ? (setIsHidden(false)) : setIsAddProductHidden(false)
        setProductModelOption([])
        setProductVariantOption([])
    }
    const handleShow = (type) => (type === 'customer') ? setIsHidden(true) : setIsAddProductHidden(true)

    const CustomSelectComponent = ({ innerProps, children }) => (
        <div {...innerProps} className="position-absolute w-100 bg-white border">
            <p className="m-1">
                <a
                    onClick={() => handleShow("customer")}
                    className="link-success link-underline-opacity-0 "
                >
                    Add New Customer
                </a>
            </p>
            {children}
        </div>
    )

    const CustomProductSelectComponent = ({ innerProps, children }) => (
        <div {...innerProps} className="position-absolute w-100 bg-white border">
            <p className="m-1">
                {formData.customer_name_id &&
                    <a
                        onClick={() => handleShow("product")}
                        className="link-success link-underline-opacity-0"
                    >
                        Add New Product
                    </a>}
            </p>
            {children}
        </div>
    )

    const handleSubmitSection = (event, btn) => {
        event.preventDefault()
        postData(btn)
        // setErrors(previousErrors => {
        //   const newErrors = validateValues(formData)
        //   if (Object.keys(newErrors).length === 0) {
        //     postData()
        //   }
        //   return newErrors
        // })
    }

    const handleCustomerSubmitSection = (event) => {
        event.preventDefault()
        postNewCustomerData()
    }

    const insuranceOptions = [
        { label: 'Select Insurance', value: '' },
        { label: 'Health', value: 'Health' },
        { label: 'Motor', value: 'Motor' },
        { label: 'Travel', value: 'Travels' },
        { label: 'Life', value: 'Life' },
        { label: 'Personal Accident', value: 'Personal Accident' },
        { label: 'Fire Burglary', value: 'Fire Burglary' },
        { label: 'Lease Car', value: 'Lease Car' }
    ]

    const titleOptions = [
        { value: 'mr', label: 'Mr.' },
        { value: 'ms', label: 'Ms.' },
        { value: 'mrs', label: 'Mrs.' }
    ]

    const vehicleTypeOptions = [
        { value: 'new', label: 'New Car' },
        { value: 'used', label: 'Used Car' }
        // { value: 'renewal', label: 'Renewal' },
        // { value: 'rollover', label: 'Rollover' },
        // { value: 'data', label: 'Data' },
    ]

    const InnerStyles = (
        <style>
            {`
                .customer-profile > div {
                    z-index: 9
                }
                .offcanvas{
                    --bs-offcanvas-width: 40%
                }
          `}
        </style>
    )

    const AddCustomerForm = (
        <form onSubmit={handleCustomerSubmitSection}>
            <Row>
                <Col md={12} className="mt-2">
                    <h4 className="mb-0">Add Customer</h4>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-title" className="" style={{ margin: '0px' }}>
                        Title
                    </label>
                    <Select
                        id="basicDetails-title"
                        name="title"
                        options={titleOptions}
                        closeMenuOnSelect={true}
                        value={titleOptions.find(option => option.value === customerFormData.title) ?? ''}
                        onChange={(value, actionMeta) => handleChange(value, actionMeta, false, "customerData")}
                        isDisabled={id}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-first-name">
                        First Name
                    </label>
                    <input placeholder="First Name" type='text' id='basicDetails-first-name' name='cust_first_name' className="form-control"
                        value={customerFormData?.cust_first_name}
                        // onChange={handleInputChangeCustomerFrom}
                        onChange={(e) => handleInputChange(e, "customerData")}
                        isDisabled={id}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-last-name">
                        Last Name
                    </label>
                    <input placeholder="Last Name" type='text' id='basicDetails-last-name' name='cust_last_name' className="form-control"
                        value={customerFormData?.cust_last_name}
                        // onChange={handleInputChangeCustomerFrom}
                        onChange={(e) => handleInputChange(e, "customerData")}
                        isDisabled={id}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-email">
                        Email
                    </label>
                    <input placeholder="Email" type='text' id='basicDetails-email' name='email' className="form-control"
                        value={customerFormData?.email}
                        // onChange={handleInputChangeCustomerFrom}
                        onChange={(e) => handleInputChange(e, "customerData")}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-mobile">
                        Mobile Number
                    </label>
                    <input placeholder="Mobile Number" type='tel' maxLength={10} id='basicDetails-mobile' name='phone_no' className="form-control"
                        value={customerFormData?.phone_no}
                        // onChange={handleInputChangeCustomerFrom}
                        onChange={(e) => handleInputChange(e, "customerData")}
                        isDisabled={id}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-country">Country</label>
                    <Select
                        options={country}
                        inputId="aria-example-input"
                        closeMenuOnSelect={true}
                        name="country"
                        placeholder="Select Country"
                        // onChange={(e) => setCustomerFormData(prevData => ({ ...prevData, country: e.label }))}
                        onChange={(value, actionMeta) => handleChange(value, actionMeta, false, "customerData")}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-state">State</label>
                    <input
                        placeholder="State"
                        type="text"
                        id="address-1-state"
                        name="state"
                        className="form-control"
                        value={customerFormData.state}
                        // onChange={handleInputChangeCustomerFrom}
                        onChange={(e) => handleInputChange(e, "customerData")}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-city">City</label>
                    <input
                        placeholder="City"
                        type="text"
                        id="address-1-city"
                        name="city"
                        className="form-control"
                        value={customerFormData.city}
                        // onChange={handleInputChangeCustomerFrom}
                        onChange={(e) => handleInputChange(e, "customerData")}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-pincode">Pincode</label>
                    <input
                        placeholder="Pincode"
                        type="text"
                        id="address-1-pincode"
                        name="pincode"
                        className="form-control"
                        value={customerFormData.pincode}
                        // onChange={handleInputChangeCustomerFrom}
                        onChange={(e) => handleInputChange(e, "customerData")}
                    />
                </Col>

                <div className='d-flex justify-content-between mt-2'>
                    <div>
                        <button className="btn btn-primary" type="submit">Add</button>
                        <button className="btn btn-primary ms-2" type="button">Cancel</button>
                    </div>
                </div>
            </Row>
        </form>
    )

    const AddNewProductSideForm = (
        <form>
            <Row>
                <Col md={12} className="mt-2">
                    <h4 className="mb-0">Add Product</h4>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="customer-name">
                        Customer Name
                    </label>
                    <input type='text' id='customer-name' name='product.customer_name' className="form-control"
                        value={formData?.customer_name}
                        // onChange={handleInputChange} 
                        disabled
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="registration-name">
                        Registration Name
                    </label>
                    <input
                        placeholder='Registration Number'
                        type='text' id='registration-name' name='product.registration_number' className="form-control"
                        value={productFormData.registration_number}
                        onChange={handleInputChange}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="sales-person">
                        Sales Person
                    </label>
                    <input
                        placeholder='Sales Person'
                        type='text' id='sales-person' name='product.sales_executive' className="form-control"
                        value={productFormData?.sales_executive}
                        onChange={handleInputChange}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-identification">
                        Vehicle Identification Number (VIN) or Chassis Number
                    </label>
                    <input
                        placeholder='Vehicle Identification Number'
                        type='text' id='vehicle-identification' name='product.vehicle_number' className="form-control"
                        value={productFormData?.vehicle_number}
                        onChange={handleInputChange}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="engine-number">
                        Engine Number
                    </label>
                    <input
                        placeholder='Engine Number'
                        type='text' id='engine-number' name='product.engine_no' className="form-control"
                        value={productFormData?.engine_no}
                        onChange={handleInputChange}
                    />
                </Col>

                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-type" className="" style={{ margin: '0px' }}>
                        Vehicle Type
                    </label>
                    <Select
                        placeholder='Vehicle Type'
                        id="vehicle-type"
                        name="vehicle_type"
                        options={vehicleTypeOptions}
                        closeMenuOnSelect={true}
                        value={insuranceOptions?.find(option => option.value === productFormData?.vehicle_type)}
                        onChange={(value, actionMeta) => handleChange(value, actionMeta, false, "customerData")}
                        // onChange={e => handleInputChange(e, 'product.vehicle_type')}
                    />
                </Col>
                <Col md={12} className="mt-2">
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
                    //   value={selectedOption}
                    />
                </Col>

                <Col md={12} className="mt-2">
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
                <Col md={12} className="mt-2">
                    <label htmlFor="variant-select" className="" style={{ margin: '0px' }}>
                        Select Variant
                    </label>
                    <Select
                        placeholder='Select Variant'
                        id="variant-select"
                        name="variant"
                        options={productVariantOption}
                        closeMenuOnSelect={true}
                        // onChange={e => handleInputChange(e, 'product.variant')}
                        onChange={(value, actionMeta) => handleChange(value, actionMeta, false, "customerData")}

                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-delivery-date">
                        Vehicle Delivery Date
                    </label>
                    <input placeholder="Vehicle Delivery Date" type='date' id='vehicle-delivery-date' name='product.delivery_date' className="form-control"
                        value={productFormData.delivery_date}
                        onChange={handleInputChange}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-registration-date">
                        Vehicle Registration Date
                    </label>
                    <input placeholder="Vehicle Registration Date" type='date' id='vehicle-registration-date' name='product.registeration_date' className="form-control"
                        value={productFormData?.registeration_date}
                        onChange={handleInputChange}
                    />
                </Col>
                <div className='d-flex justify-content-end mt-2'>
                    <div>
                        <button className="btn btn-primary ms-2" type="button" onClick={postVehicleDetails}>Add Product</button>
                    </div>
                </div>
            </Row>
        </form>
    )

    return (
        <>
            {InnerStyles}
            <>
                <Offcanvas show={isHidden} onHide={() => handleClose('customer')} placement="end">
                    <Offcanvas.Header closeButton>
                        {/* <Offcanvas.Title>Offcanvas</Offcanvas.Title> */}
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {AddCustomerForm}
                    </Offcanvas.Body>
                </Offcanvas>
                <Offcanvas show={isAddProductHidden} onHide={() => handleClose('product')} placement="end">
                    <Offcanvas.Header closeButton>
                        {/* <Offcanvas.Title>Offcanvas</Offcanvas.Title> */}
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {AddNewProductSideForm}
                    </Offcanvas.Body>
                </Offcanvas>
            </>
            <div className="customer-profile">
                <Card>
                    <CardBody>
                        <h3 className="mb-0">{id ? 'Edit Insurance' : 'Add Insurance'}</h3>
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
                                    <Col md={6} className="mt-2" style={{ zIndex: '9' }}>
                                        <label htmlFor="customer-name" className="" style={{ margin: '0px' }}>
                                            Customer Name
                                        </label>
                                        <Select
                                            placeholder='Select Insurance'
                                            id="insurance-type"
                                            options={allOptions}
                                            closeMenuOnSelect={true}
                                            name=''
                                            onMenuScrollToBottom={() => fetchCustomerData(currentPage, null, () => { })}
                                            components={{ Menu: CustomSelectComponent }}
                                            onChange={(value, actionMeta) => selectCustomer(value, actionMeta, false)}
                                            // onChange={(value, actionMeta) => handleChange(value, actionMeta, false)}
                                        />
                                    </Col>
                                    <Col md={6} className="mt-2">
                                        <label htmlFor="insurance-type" className="" style={{ margin: '0px' }}>
                                            Insurance Type
                                        </label>
                                        <Select
                                            placeholder='Select Insurance'
                                            id="insurance-type"
                                            name="insurance_type"
                                            options={insuranceOptions}
                                            value={insuranceOptions?.find(option => option.value === formData?.insurance_type)}
                                            // onChange={e => handleInputChange(e, 'insurance_type')}
                                            onChange={(value, actionMeta) => handleChange(value, actionMeta, false)}
                                            closeMenuOnSelect={true}
                                        />
                                    </Col>
                                    {(formData?.insurance_type === 'Motor' || formData?.insurance_type === 'Lease Car') && <>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="product-name" className="" style={{ margin: '0px' }}>
                                                Product Name
                                            </label>
                                            <Select
                                                placeholder='Select Product Name'
                                                id="product-name"
                                                options={productOptions}
                                                name="insurance_product_name"
                                                // defaultValue={productOptions[0]}
                                                components={{ Menu: CustomProductSelectComponent }}
                                                onChange={(value, actionMeta) => handleChange(value, actionMeta, false)}
                                                // onChange={e => handleInputChange(e, 'insurance_product_name')}
                                                closeMenuOnSelect={true}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="Vehicle-type" className="" style={{ margin: '0px' }}>
                                                Vehicle Type
                                            </label>
                                            <Select
                                                placeholder='Vehicle Type'
                                                id="Vehicle-type"
                                                name="vehicle"
                                                options={vehicleOptions}
                                                defaultValue={vehicleOptions[0]}
                                                value={vehicleOptions?.find(option => option.value === formData?.vehicle)}
                                                onChange={(value, actionMeta) => handleChange(value, actionMeta, false)}
                                                closeMenuOnSelect={true}
                                            />
                                        </Col>
                                    </>}
                                    <Col md={6} className="mt-2">
                                        <label htmlFor="policy-number">
                                            Policy Number
                                        </label>
                                        <input placeholder="Policy Number" type='text' id='policy-number' name='policy_number' className="form-control"
                                            value={formData?.policy_number}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                    <Col md={6} className="mt-2">
                                        <label htmlFor="Insurance-company">
                                            Insurance Company
                                        </label>
                                        <input placeholder="Insurance Company" type='text' id='Insurance-company' name='insurance_company' className="form-control"
                                            value={formData?.insurance_company}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                    <Col md={6} className="mt-2">
                                        <label htmlFor="Policy-purchase-date">
                                            Policy Purchase Date
                                        </label>
                                        <input
                                            placeholder="Policy Purchase Date"
                                            type="date"
                                            id="Policy-purchase-date"
                                            name="policy_purchase_date"
                                            className="form-control"
                                            value={formData?.policy_purchase_date}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                    <Col md={6} className="mt-2">
                                        <label htmlFor="Policy-expiry-date">
                                            Policy Expiry Date
                                        </label>
                                        <input
                                            placeholder="Policy Purchase Date"
                                            type="date"
                                            id="Policy-expiry-date"
                                            name="policy_expiry_date"
                                            className="form-control"
                                            value={formData?.policy_expiry_date}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                    <Col md={6} className="mt-2">
                                        <label htmlFor="Insurance-sales-executive">
                                            Insurance Sales Executive
                                        </label>
                                        <input placeholder="Insurance Company" type='text' id='Insurance-sales-executive' name='executive_name' className="form-control"
                                            value={formData?.executive_name}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                    <Col md={6} className="mt-2">
                                        <label htmlFor="amount-r">
                                            Amount - ₹
                                        </label>
                                        <input placeholder="Amount" type='tel' id='amount-r' name='amount' className="form-control"
                                            value={formData?.amount}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                    {(formData?.insurance_type === 'Motor' || formData?.insurance_type === 'Lease Car') && <>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="add-on-plan">
                                                Add on Plan
                                            </label>
                                            <input placeholder="Add on Plan" type='text' id='add-on-plan' name='add_on_plan' className="form-control"
                                                value={formData?.add_on_plan}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="add-on-plan">
                                                IDV – Insured Declared Value
                                            </label>
                                            <input placeholder="Insured Declared Value" type='tel' maxLength={10} id='add-on-plan' name='insured_declared_value' className="form-control"
                                                value={formData?.insured_declared_value}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="owndamage">
                                                OD – Own Damage
                                            </label>
                                            <input placeholder="Own Damage" type='tel' maxLength={10} id='owndamage' name='own_damage' className="form-control"
                                                value={formData?.own_damage}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="NoClaimBonus">
                                                NCB – No Claim Bonus
                                            </label>
                                            <input placeholder="No Claim Bonus" type='tel' maxLength={10} id='NoClaimBonus' name='ncb_no_claim_bonus' className="form-control"
                                                value={formData?.ncb_no_claim_bonus}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="PaymentMode">
                                                PM – Payment Mode
                                            </label>
                                            <input placeholder="Payment Mode" type='text' id='PaymentMode' name='pm_payment_mode' className="form-control"
                                                value={formData?.pm_payment_mode}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="Declaration">
                                                NCB – Declaration
                                            </label>
                                            <input placeholder="Declaration" type='text' id='Declaration' name='ncb_declaration' className="form-control"
                                                value={formData?.ncb_declaration}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="ThirdPartyDate">TPD – Third Party Date</label>
                                            <input
                                                placeholder="Third Party Date"
                                                type="date"
                                                id="ThirdPartyDate"
                                                name="third_party_date"
                                                className="form-control"
                                                value={formData?.third_party_date}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="InbuiltDiscount">
                                                ID – Inbuilt Discount
                                            </label>
                                            <input placeholder="Inbuilt Discount" type='tel' maxLength={10} id='InbuiltDiscount' name='inbuilt_discount' className="form-control"
                                                value={formData?.inbuilt_discount}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="NetPremium">
                                                NP – Net Premium.
                                            </label>
                                            <input placeholder="Net Premium" type='tel' maxLength={10} id='NetPremium' name='net_premimum' className="form-control"
                                                value={formData?.net_premimum}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </>}
                                    <Col md={6} className="mt-2">
                                        <label htmlFor="health_insurance">Do they have health insurance?</label>
                                        <div className='d-flex justify-content-between w-50' style={{ padding: '0.571rem 1rem' }}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="health_insurance"
                                                    id="flexRadioDefault1"
                                                    value="Data not available"
                                                    onChange={(e) => handleInputChange(e)}
                                                />
                                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                    Data not available
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="health_insurance"
                                                    id="flexRadioDefault2"
                                                    value="No"
                                                    onChange={(e) => handleInputChange(e)}
                                                />
                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                    No
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="health_insurance"
                                                    id="flexRadioDefault3"
                                                    value="Yes"
                                                    onChange={(e) => handleInputChange(e)}
                                                />
                                                <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                    Yes
                                                </label>
                                            </div>
                                        </div>
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
            </div>
        </>
    )
}

export default AddInsurance