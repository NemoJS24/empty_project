/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import Select from "react-select"
import { createPortal } from 'react-dom'
import axios from "axios"
import toast from "react-hot-toast"
import { crmURL } from '@src/assets/auth/jwtService.js'
import AsyncSelect from 'react-select/async'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { baseURL, getReq, postReq } from '../../../assets/auth/jwtService'
import { validForm } from '../../Validator'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../../Components/DataTable/Spinner'
import { Eye } from "react-feather"

const Buyer = ({ allData }) => {
    const { id } = useParams()

    const navigate = useNavigate()
    const { formData, handleNext, handleInputChange, setFormData, handleChange, country, isEdit , isCustomer } = allData
    const [productModelOption, setProductModelOption] = useState([])
    const [productVariantOption, setProductVariantOption] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [customerList, setCustomerList] = useState([])
    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [selectedVehicleType, setSelectedVehicleType] = useState('')
    const [changeVehicle, setChangeVehicle] = useState(false)
    const [customer, setCustomer] = useState({
        customer: {},
        finance: false,
        vehicle: {},
        insurance: []
    })
    const [isChecked, setIsChecked] = useState(formData?.is_insurance ? false : true)
    const [fileName, setFileName] = useState('')
    const [productFormData, setProductFormData] = useState({})

    console.log(allData, 'alldata')


    const handleCheckboxChange = (event) => {
        const newValue = event.target.checked; 
        console.log(newValue, "helooooooooV")
        setIsChecked(newValue)
        
        setFormData(prevState => ({
            ...prevState,
            is_insurance: newValue
        }));
    }


    useEffect(() => {
        if (selectedVehicleType === 'used') {
            setShowAdditionalFields(true)
        } else {
            setShowAdditionalFields(false)
        }
    }, [selectedVehicleType])

    const handleVehicleTypeChange = (selectedOption) => {
        setSelectedVehicleType(selectedOption?.value)
    }

    const addFormvalueToCheck = [
        {
            name: 'title',
            message: 'Select Title',
            type: 'string',
            id: 'title'
        },
        {
            name: 'cust_first_name',
            message: 'Enter customer name',
            type: 'string',
            id: 'cust_first_name'
        },
        {
            name: 'cust_last_name',
            message: 'Enter Last Name',
            type: 'string',
            id: 'cust_last_name'
        },
        {
            name: 'email',
            message: 'Enter Email',
            type: 'email',
            id: 'email'
        },
        {
            name: 'phone_no',
            message: 'Enter Phone No',
            type: 'number',
            id: 'phone_no'
        },
        {
            name: 'Adharcard',
            message: 'Enter Aadhaar No',
            type: 'number',
            id: 'Adharcard'
        },
        {
            name: 'pancard',
            message: 'Enter PAN No',
            type: 'string',
            id: 'pancard'
        }
    ]

    const addProductFormToCheck = [
        {
            name: 'brand',
            message: 'Please select a Brand',
            type: 'string',
            id: 'brand'
        },
        {
            name: 'car_model',
            message: 'Please select a Model',
            type: 'string',
            id: 'car_model'
        },
        {
            name: "variant",
            message: 'Please select a variant',
            type: 'string',
            id: 'variant'
        }
    ]

    const [check, setCheck] = useState({
        addForm: {
            title: '',
            cust_first_name: '',
            cust_last_name: "",
            email: "",
            phone_no: "",
        },
        productForm: {
            xircls_customer_id: isCustomer ? id : '',
            // engine_number: '',
            // model: ''
            // insurance_no:'',
            insurance_document:'',
            // insurance_end_date:'',
            roc_document:''
        }
    })

    const postNewCustomerData = () => {
        console.log(check.addForm)
        const form_data = new FormData()
        Object.entries(check.addForm).map(([key, value]) => {
            form_data.append(key, value)
        })
        form_data.append("dropdown", 'regular')
        form_data.append("pin", 'INsdfsdfsDV')
        form_data.append("entry_point", 'INDV')
        form_data.append("press_btn", 'SAVE & CLOSE')
        postReq('add_customer', form_data)
            .then((resp) => {
                console.log("Response:", resp)
                toast.success('Customer saved successfully')
                const addForm = { ...check.addForm }
                Object.keys(check.addForm).forEach((key) => {
                    addForm[key] = ""
                })
                setCheck(prev => {
                    return { ...prev, addForm }
                })
                handleClose("customer")
                getCustomer()
            })
            .catch((error) => {
                console.error("Error:", error)
                if (error?.response?.status === 409) {
                    toast.error('Customer already exists')
                } else {
                    toast.error('Failed to save customer')
                }
                handleClose("customer")
            })
    }


    const postBuyer = () => {
        console.log(check.addForm)
        const form_data = new FormData()
        Object.entries(check.addForm).map(([key, value]) => {
            form_data.append(key, value)
        })
        form_data.append("dropdown", 'regular')
        form_data.append("pin", 'INsdfsdfsDV')
        form_data.append("entry_point", 'INDV')
        form_data.append("press_btn", 'SAVE & CLOSE')
        postReq('automotivetransaction', form_data)
            .then((resp) => {
                console.log("Response:", resp)
                toast.success('Customer saved successfully')
                const addForm = { ...check.addForm }
                Object.keys(check.addForm).forEach((key) => {
                    addForm[key] = ""
                })
                setCheck(prev => {
                    return { ...prev, addForm }
                })
                handleClose("customer")
                getCustomer()
            })
            .catch((error) => {
                console.error("Error:", error)
                if (error?.response?.status === 409) {
                    toast.error('Customer already exists')
                } else {
                    toast.error('Failed to save customer')
                }
                handleClose("customer")
            })
    }

    const postData = () => {
        const check = checkVaildation()
        if (check) {
            const form_data = new FormData()
            Object.entries(formData).map(([key, value]) => {
                form_data.append(key, value)
            })
            form_data.append("press_btn", btn)
            if (isEdit) {
                form_data.append("finance_instance_id", id)
            }

            postReq("automotivetransaction", form_data, crmURL)
                .then((resp) => {
                    console.log("Response:", resp)
                    toast.success('Finance saved successfully')
                    resp.data?.is_edit_url ? navigate(`/merchant/customers/edit_finance/${resp.data?.finance_code}?type=edit`) : navigate(-1)
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
    }

    const handleAddInputChange = (e, keyType) => {
        setCheck(prevData => ({ ...prevData, [keyType]: { ...prevData[keyType], [e.target.name]: e.target.value } }))
    }



    const handleAddSubmitSection = (e, action) => {
        e.preventDefault()

        const checkForm = validForm(addFormvalueToCheck, check.addForm)  // Use addFormvalueToCheck for validation
        console.log(checkForm, "dd")
        if (checkForm) {
            // postData()
            postNewCustomerData()
        }
    }

    const vehicleTypeOptions = [
        { value: 'new', label: 'New Car' },
        { value: 'used', label: 'Used Car' },
        { value: 'renewal', label: 'Renewal' },
        { value: 'rollover', label: 'Rollover' },
        { value: 'data', label: 'Data' }
    ]

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

    console.log(check)

    const selectCustomer = () => {
        console.log(formData?.xircls_customer_id)
        const form_data = new FormData()
        const url = new URL(`${crmURL}/vehicle/fetch_vehicle_details/`)
        form_data.append("id", formData?.xircls_customer_id)
        // "SHIVAM KALE"
        getReq(`fetch_vehicle_details`, `?id=${formData?.xircls_customer_id}`, crmURL)
            .then((resp) => {
                console.log("Response:", resp)
                if (resp?.data?.car_variant) {
                    changeProductName(resp)
                }
            })
            .catch((error) => {
                console.error("Error:", error)
                toast.error('Something went wrong')

            })
    }



    const postVehicleDetails = () => {
        const form_data = new FormData()
        Object.entries(check?.productForm).map(([key, value]) => {
            form_data.append(key, value)
        })
        form_data.append("press_btn", 'SAVE')

        postReq('add_vehicle', form_data, crmURL)
            .then((resp) => {
                console.log("Response:", resp)
                toast.success('Vehicle saved successfully')
                handleClose('product')
                selectCustomer()
            })
            .catch((error) => {
                console.error("Error:", error)
                toast.error('Something went wrong')
            })
    }

    const handleProductSubmit = () => {
        const checkForm = validForm(addProductFormToCheck, check?.productForm)
        console.log({ checkForm }, addProductFormToCheck, check?.productForm)
        if (checkForm) {
            postVehicleDetails()
        }
    }

    const loadBrandOptions = (inputValue, callback) => {
        getReq('fetch_car_details', ``, crmURL)
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

    const selectChange = (value, actionMeta) => {
        console.log('checkForm 1212', { value, actionMeta })
        const form_data = new FormData()
        if (actionMeta.name === 'brand') {
            form_data.append("brand", value.value)
            handleAddInputChange({ target: { name: actionMeta.name, value: value.value } }, "productForm")
            setProductModelOption([])
            setProductVariantOption([])
        } else if (actionMeta.name === 'carmodel') {
            form_data.append("carmodel", value.value)
            actionMeta.name = 'car_model'
            handleAddInputChange({ target: { name: "car_model", value: value.value } }, "productForm")
            setProductVariantOption([])
        }
        postReq('fetch_car_details', form_data, crmURL)
            .then((resp) => {
                console.log("Response ooption:", resp)
                if (resp.data.car_model) {
                    const productModelOptions = []
                    resp.data.car_model.forEach((item) => {
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
                if (resp.data.car_variant) {
                    const variantOptions = []
                    resp.data.car_variant.map((item) => {
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
            })
            .catch((error) => {
                console.log(error)
                toast.error('Something went wrong!')
            })
    }

    //---------------------------------

    const [isHidden, setIsHidden] = useState(false)
    const [isAddProductHidden, setIsAddProductHidden] = useState(false)
    const [customerDetails, setCustomerDetails] = useState([])
    const [customerOptions, setCustomerOptions] = useState([])
    const [productOptions, setProductOptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (formData.xircls_customer_id) {
            selectCustomer()
        }
    }, [formData.xircls_customer_id])
    const changeProductName = (data) => {
        const productOptions = data?.data?.car_variant.map(item => {
            let value = item[0]
            let label = item.slice(1).filter(Boolean).join(' -- ')
            return {
                value: value,
                label: label
            }
        })
        setProductOptions(productOptions)
    }

    const handleClose = (type) => (type === 'customer') ? setIsHidden(false) : setIsAddProductHidden(false)
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
                <a
                    onClick={() => handleShow("product")}
                    className="link-success link-underline-opacity-0 "
                >
                    Add New Product
                </a>
            </p>
            {children}
        </div>
    )

    const clientTypeOptions = [
        { value: 'jmd', label: 'JMD' },
        { value: 'nonjmd', label: 'Non-JMD' }
    ]

    const loanTypeOptions = [
        { value: 'New Car', label: 'New Car' },
        { value: 'Old Car', label: 'Old Car' },
        { value: 'Topup', label: 'Topup' }
    ]

    const getCustomer = () => {
        getReq("getAllCustomer", "", crmURL)
            .then((resp) => {
                console.log(resp, "customer")

                setCustomerList(resp?.data?.success?.map((curElem) => {
                    return { label: curElem?.customer_name ? curElem?.customer_name : '-', value: curElem?.xircls_customer_id }
                }))
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    console.log(customerList, 'Email')


    const selectInsurance = () => {
        // getReq(`automotivetransaction`, `?customer_id=${formData?.xircls_customer_id}&vehicle_id=${formData?.product_name_id}`, crmURL)
        getReq('check_customer_details', `?customer_id=${formData?.xircls_customer_id}&vehicle_id=${formData?.product_name_id || ''}`, crmURL)
            .then((resp) => {
                console.log("ResponseMail", resp?.data?.customer?.email)
                console.log("Get Customer", resp?.data?.customer?.is_finance)
                const updatedData = {
                    customer: resp?.data?.customer ? resp?.data?.customer : {},
                    finance: resp?.data?.customer?.is_finance ? resp?.data?.customer?.is_finance : {},

                    vehicle: resp?.data?.vehicle ? resp?.data?.vehicle : {},
                    insurance: resp?.data?.insurance ? resp?.data?.insurance : []
                }

                setCustomer((preData) => ({
                    ...preData,
                    ...updatedData
                }))
                setFormData({...formData, is_insurance: resp?.data?.insurance?.length === 0 ? false : true})
                if (resp?.data?.car_variant) {
                    changeProductName(resp)
                    console.log(resp, "vehicle")
                }
            })
            .catch((error) => {
                console.error("Error:", error)
                toast.error('Something went wrong')

            })
    }

    useEffect(() => {
        if (formData?.xircls_customer_id) {
            selectInsurance()
        }
    }, [formData?.xircls_customer_id, formData?.product_name_id])

    useEffect(() => {
        getCustomer()
    }, [])

    const InnerStyles = (
        <style>
            {`
            .hiddenRight{
                right: 0 !important
            }import Vehicle from '../../Leads/Vehicle';

            .hiddenEle{
                overflow: auto;
                width: 30%;
                height: 100vh; 
                z-index: 1000;
                top: 0; 
                right: -100vh; 
                transform: translateX(0);  
                transition: right 0.8s ease-in-out;
            }
            #customer-name > div {
                z-index: 9;
            }
            `}
        </style>
    )

    const AddCustomerForm = (
        <form>
            <Row>
                <Col md={12} className="mt-2">
                    <h4 className="mb-0">Add Customer</h4>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-title" className="form-label" style={{ margin: '0px' }}>
                        Title
                    </label>
                    <Select
                        id="basicDetails-title"
                        options={[
                            { value: 'mr', label: 'Mr.' },
                            { value: 'ms', label: 'Ms.' },
                            { value: 'mrs', label: 'Mrs.' }
                        ]}
                        closeMenuOnSelect={true}
                        onChange={(event) => {
                            const e = { target: { name: "title", value: event.value } }
                            handleAddInputChange(e, "addForm")
                        }}
                    />
                    <p id="title_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="cust_first_name">
                        First Name
                    </label>
                    <input placeholder="First Name" type='text' id='cust_first_name' name='cust_first_name' className="form-control"
                        onChange={(e) => {
                            handleAddInputChange(e, "addForm")
                        }}

                    />
                    <p id="cust_first_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="cust_last_name">
                        Last Name
                    </label>
                    <input placeholder="Last Name" type='text' id='cust_last_name' name='cust_last_name' className="form-control"
                        onChange={(e) => {
                            handleAddInputChange(e, "addForm")
                        }}
                    />
                    <p id="cust_last_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-email">
                        Email
                    </label>
                    <input placeholder="Email" type='text' id='basicDetails-email' name='email' className="form-control"
                        onChange={(e) => {
                            handleAddInputChange(e, "addForm")
                        }}
                    />
                    <p id="email_val" className="text-danger m-0 p-0 vaildMessage"></p>

                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-mobile">
                        Mobile Number
                    </label>
                    <input placeholder="Mobile Number" type='tel' id='basicDetails-mobile' name='phone_no' className="form-control"
                        onChange={(e) => {
                            if (!isNaN(e.target.value)) {
                                handleAddInputChange(e, "addForm")
                                console.log("this is a number")
                            }
                        }}
                    />
                    <p id="phone_no_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-city">Aadhaar Card</label>
                    <input
                        placeholder="Aadhaar Card"
                        type="text"
                        id="aadhaarcard"
                        name="Adharcard"
                        className="form-control"
                        onChange={(e) => {
                            handleAddInputChange(e, "addForm")
                        }}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-city">PAN Card</label>
                    <input
                        placeholder="PAN Card"
                        type="text"
                        id="pancard"
                        name="pancard"
                        className="form-control"
                        onChange={(e) => {
                            handleAddInputChange(e, "addForm")
                        }}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-country">Country</label>
                    <Select
                        id="address-1-country"
                        placeholder="Country"
                        options={country}
                        value={country?.find(option => option.value === check?.addForm?.country)}
                        onChange={(value) => {
                            handleAddInputChange({ target: { value: value?.value, name: "country" } }, "addForm")
                        }}
                        closeMenuOnSelect={true}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-city">City</label>
                    <input
                        placeholder="City"
                        type="text"
                        id="address-1-city"
                        name="billingAddress.city"
                        className="form-control"
                        onChange={(e) => {
                            handleAddInputChange(e, "addForm")
                        }}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-state">State</label>
                    <input
                        placeholder="State"
                        type="text"
                        id="address-1-state"
                        name="billingAddress.state"
                        className="form-control"
                        onChange={(e) => {
                            handleAddInputChange(e, "addForm")
                        }}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-pincode">Pincode</label>
                    <input
                        placeholder="Pincode"
                        type="text"
                        id="address-1-pincode"
                        name="billingAddress.pincode"
                        className="form-control"
                        onChange={(e) => {
                            if (!isNaN(e.target.value)) {
                                handleAddInputChange(e, "addForm")
                                console.log("this is a number")
                            }
                        }}
                    />
                </Col>

                <div className='d-flex justify-content-between mt-2'>
                    <div>
                        <button className="btn btn-primary" type="button" onClick={((e) => {
                            handleAddSubmitSection(e)
                        })}>Add</button>
                        <button onClick={() => handleClose("customer")} className="btn btn-primary ms-2" type="button">Cancel</button>
                    </div>
                    <div>
                        {/* <button className="btn btn-primary" type="submit" onClick={handleSubmitSection1}>Save</button>
                    <button className="btn btn-primary ms-2" type="button">Save & Close</button> */}
                        {/* <button className="btn btn-primary ms-2" type="button" onClick={handleNext}>Next</button> */}
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
                    <Select
                        placeholder='Customer Name'
                        id="insurance-type"
                        options={customerList}
                        closeMenuOnSelect={true}
                        name='customer_name'
                        value={customerList?.filter((curElem) => Number(curElem?.value) === Number(formData.xircls_customer_id))}
                        isDisabled={true}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="registration-name">
                        Registration Name
                    </label>
                    <input
                        placeholder='Registration Number'
                        type='text' id='registration-name' name='registration_number' className="form-control"
                        value={check?.productForm.registration_number}
                        onChange={e => handleAddInputChange(e, 'productForm')}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="sales-person">
                        Sales Person
                    </label>
                    <input
                        placeholder='Sales Person'
                        type='text' id='sales-person' name='sales_executive' className="form-control"
                        value={check?.productForm?.sales_executive}
                        onChange={e => handleAddInputChange(e, 'productForm')}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-identification">
                        Vehicle Identification Number (VIN) or Chassis Number
                    </label>
                    <input
                        placeholder='Vehicle Identification Number'
                        type='text' id='vehicle-identification' name='vehicle_number' className="form-control"
                        value={check?.productForm?.vehicle_number}
                        onChange={e => handleAddInputChange(e, 'productForm')}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="engine-number">
                        Engine Number
                    </label>
                    <input
                        placeholder='Engine Number'
                        type='text' id='engine-number' name='engine_number' className="form-control"
                        value={check?.productForm?.engine_no}
                        onChange={e => handleAddInputChange(e, 'productForm')}
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
                        value={insuranceOptions?.find(option => option.value === check?.productForm?.vehicle_type)}
                        onChange={(selectedOption, actionMeta) => {
                            handleVehicleTypeChange(selectedOption)
                            handleChange(selectedOption, actionMeta, false, "productForm")
                        }}
                    />
                </Col>

                {showAdditionalFields && (
                    <>
                        <Col md={12} className="mt-2">
                            <label htmlFor="engine-number">
                                Upload Your Insurance
                            </label>
                            <input
                                type="file"
                                id="basicDetails-rot"
                                name="Insurance_document"
                                className="form-control"
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    const fileName = file.name
                                    const reader = new FileReader()
                                    reader.onload = function (event) {
                                        const binaryImageData = new Blob([event.target.result])
                                        const formData = new FormData()
                                        formData.append('insurance_document', binaryImageData, fileName)

                                        setFormData(formData)

                                        setCheck(prevData => ({
                                            ...prevData,
                                            productForm: {
                                                ...prevData.productForm,
                                                insurance_document: file
                                            }
                                        }))
                                    }
                                    reader.readAsArrayBuffer(file)
                                }}

                            />


                        </Col>
                        <Col md={12} className="mt-2">
                            <label htmlFor="insurance-no">
                                Insurance Number
                            </label>
                            <input
                                placeholder='Insurance Number'
                                type='text' id='insurance-no' name='insurance_no' className="form-control"
                                value={check?.productForm?.insurance_no}
                                onChange={e => handleAddInputChange(e, 'productForm')}
                            />
                        </Col>
                        <Col md={12} className="mt-2">
                            <label htmlFor="engine-number">
                                Insurance Expiry Date
                            </label>
                            <Flatpickr
                                placeholder="Insurance Expiry Date"
                                id='vehicle-registration-date'
                                name='insurance_end_date'
                                className="form-control"
                                value={productFormData?.insurance_end_date}
                                onChange={(date) => {
                                    handleAddInputChange({ target: { name: 'insurance_end_date', value: moment(date[0]).format("YYYY-MM-DD") } }, 'productForm')
                                }}

                            />
                        </Col>
                    </>
                )}

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
                        name='brand'
                        onChange={(value, actionMeta) => selectChange(value, actionMeta)}
                    />
                    <p id="brand_val" className="text-danger m-0 p-0 vaildMessage"></p>
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
                        name='carmodel'
                        onChange={(value, actionMeta) => selectChange(value, actionMeta)}
                    />
                    <p id="car_model_val" className="text-danger m-0 p-0 vaildMessage"></p>
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
                        onChange={e => {
                            handleAddInputChange({ target: { name: "variant", value: e.value } }, "productForm")
                        }}

                    />
                    <p id="variant_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-delivery-date">
                        Vehicle Delivery Date
                    </label>
                    <Flatpickr
                        placeholder="Insurance Expiry Date"
                        id='vehicle-registration-date'
                        name='vehicle_delivery_date'
                        className="form-control"
                        value={productFormData?.vehicle_delivery}
                        onChange={(date) => {
                            handleAddInputChange({ target: { name: 'delivery_date', value: moment(date[0]).format("YYYY-MM-DD") } }, 'productForm')
                        }}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-registration-date">
                        Vehicle Registration Date
                    </label>
                    <Flatpickr
                        placeholder="Insurance Expiry Date"
                        id='vehicle-registration-date'
                        name='vehicle_reg_date'
                        className="form-control"
                        value={productFormData?.insurance_end_date}
                        onChange={(date) => {
                            handleAddInputChange({ target: { name: 'registeration_date', value: moment(date[0]).format("YYYY-MM-DD") } }, 'productForm')
                        }}
                    />
                </Col>
                <div className='d-flex justify-content-end mt-2'>
                    <div>
                        <button className="btn btn-primary ms-2" type="button" onClick={handleProductSubmit}>Add Product</button>
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
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {AddCustomerForm}
                    </Offcanvas.Body>
                </Offcanvas>
                <Offcanvas show={isAddProductHidden} onHide={() => handleClose('product')} placement="end">
                    <Offcanvas.Header closeButton>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {AddNewProductSideForm}
                    </Offcanvas.Body>
                </Offcanvas>
            </>
            {
                !isLoading ? (
                    <Container fluid className="px-0 py-1">
                        <Row>
                            <Col md={12} className="mt-2">
                                <h4 className="mb-0">Applicant Details</h4>
                            </Col>
                            <Col md={6} className="mt-2" style={{ zIndex: '9' }}>
                                <label htmlFor="customer-name" className="form-label" style={{ margin: '0px' }}>
                                    Customer Name
                                </label>
                                {/* <Select
                                    placeholder='Customer Name'
                                    isDisabled={isCustomer}
                                    id="insurance-type"
                                    options={customerList}
                                    closeMenuOnSelect={true}
                                    name='customer_name'
                                    components={{ Menu: CustomSelectComponent }}
                                    value={customerList?.filter((curElem) => Number(curElem?.value) === Number(formData.xircls_customer_id))}
                                    onChange={(e) => {
                                        console.log(e);
                                        const updatedData = {
                                            customer_name: e.label,
                                            xircls_customer_id: e.value
                                        }
                                        setFormData((preData) => ({
                                            ...preData,
                                            ...updatedData
                                        }))
                                        handleAddInputChange({ target: { value: e.value, name: "xircls_customer_id" } }, 'productForm');
                                    }}
                                /> */}
                                <Select
                                    placeholder='Customer Name'
                                    isDisabled={isCustomer}
                                    id="insurance-type"
                                    options={customerList}
                                    closeMenuOnSelect={true}
                                    name='customer_name'
                                    components={{ Menu: CustomSelectComponent }}
                                    // value={customerList?.filter((curElem) => Number(curElem?.value) === Number(formData.xircls_customer_id))}
                                    value={(customerList?.filter((curElem) => Number(curElem?.value) === Number(formData.xircls_customer_id)))}
                                    onChange={(e) => {
                                        const updatedData = {
                                            customer_name: e.label,
                                            xircls_customer_id: e.value,
                                            seller_id: e.value
                                        }

                                        setFormData((preData) => ({
                                            ...preData,
                                            ...updatedData,
                                            value: e.value,
                                            product_name_label: "",
                                            product_name_id: ""
                                        }))
                                        // selectInsurance()
                                        handleAddInputChange({ target: { value: e.value, name: "xircls_customer_id" } }, 'productForm')
                                    }}
                                />

                                <p id="xircls_customer_id_val" className="text-danger m-0 p-0 vaildMessage"></p>
                            </Col>
                            <Col md={6} className="mt-2">
                                <label htmlFor="product-name" className="form-label" style={{ margin: '0px' }}>
                                    Product Name
                                </label>
                                <Select
                                    placeholder='Select Product Name'
                                    id="product-name"
                                    options={productOptions}
                                    name="product_name_id"
                                    components={{ Menu: CustomProductSelectComponent }}
                                    value={{ value: formData.product_name_label, label: formData.product_name_label }}
                                    onChange={(e) => {
                                        setChangeVehicle(true)
                                        // selectInsurance()
                                        // handleChange(value, actionMeta)
                                        const updatedData = {
                                            product_name_label: e.label,
                                            product_name_id: e.value,
                                        }

                                        setFormData((preData) => ({
                                            ...preData,
                                            ...updatedData, 
                                        }))
                                    }}
                                    // value={productOptions?.filter((curElem) => curElem?.value === formData?.product_name_id)}
                                    closeMenuOnSelect={true}
                                    
                                />
                                <p id="product_name_id_val" className="text-danger m-0 p-0 vaildMessage"></p>
                            </Col>
                            <Col md={6} className="mt-2">
                                <label htmlFor="basicDetails-rot">
                                    Mobile Number
                                </label>
                                <input placeholder="Enter your Mobile" id='basicDetails-rot' name='phone_no' className="form-control"
                                    value={customer?.customer?.phone_no ?? formData?.seller_phone_no}
                                    disabled
                                    onChange={e => handleInputChange(e, "addForm")
                                    }
                                />
                            </Col>
                            <Col md={6} className="mt-2">
                                <label htmlFor="basicDetails-rot">
                                    Email ID
                                </label>
                                <input placeholder="Enter your Email" id='basicDetails-rot' name='email' className="form-control"
                                    value={customer?.customer?.email ?? formData?.seller_email}
                                    disabled
                                    onChange={e => handleInputChange(e, "addForm")}
                                />
                            </Col>
                            <Col md={6} className="mt-2">
                                <label htmlFor="sales-person">
                                    Sales Person
                                </label>
                                <input placeholder="Sales Person" type='text' id='sales-person' name='seller_dealer' className="form-control"
                                    value={formData?.seller_dealer}
                                    onChange={e => handleInputChange(e, "addForm")}
                                />
                            </Col>
                            <Col md={6} className="mt-2">
                            {/* <iframe src={`https://crm.xircls.com/static/${formData?.productroc_document}`}></iframe>  */}
                                <div className='d-flex'><label htmlFor="basicDetails-rot">
                                    ROC Document
                                </label> 
                                {console.log(customer?.vehicle?.roc_document, "============")}
                            {isEdit === true && customer?.vehicle?.roc_document ? (<span className='d-flex'><span className='fs-6'>view </span><a target='_blank' href={`https://crm.xircls.com/static${customer?.vehicle?.roc_document}`}> <Eye size={15}/></a></span>) : (<></>)}
                            </div>
                                <input
                                    type="file"
                                    // accept=".pdf, .jpg, .jpeg, .png"
                                    id="ROC"
                                    name="roc_document"
                                    className="form-control"
                                    onChange={(e) => {
                                        handleInputChange(e, 'file')
                                        const file = e.target.files[0]
                                        setFileName(file.name)
                                        const reader = new FileReader()
                                        reader.onload = function (event) {
                                            const binaryImageData = new Blob([event.target.result])
                                            const updatedData1 = {
                                                roc_document: file,
                                            }
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                ...updatedData1
                                            }))
                                        }
                                        reader.readAsArrayBuffer(file)
                                    }}
                                />
                               
                                 
                            </Col>

                            {isChecked === false ? (

                                
                                formData.is_insurance ? "" : (
                                    <>
                                        <Col md={6} className="mt-2">
                                            <div className="d-flex">
                                                <label htmlFor="basicDetails-rot">
                                                Insurance Document
                                            </label>
                                            {isEdit === true && customer?.vehicle?.insurance_document ? (<span className='d-flex'><span className='fs-6'>view </span><a target='_blank' href={`https://crm.xircls.com/static${customer?.vehicle?.insurance_document}`}> <Eye size={15}/></a></span>) : (<></>)}
                                            </div>
                                            <input
                                                type="file"
                                                // accept=".pdf, .jpg, .jpeg, .png"
                                                id="Insurance"
                                                name="insurance_document"
                                                className="form-control"
                                                onChange={(e) => {
                                                    handleInputChange(e, 'file')
                                                    const file = e.target.files[0]
                                                    setFileName(file.name)
                                                    const reader = new FileReader()
                                                    reader.onload = function (event) {
                                                        const updatedData1 = {
                                                            insurance_document: file,
                                                        }
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            ...updatedData1
                                                        }))
                                                    }
                                                    reader.readAsArrayBuffer(file)
                                                }}
                                            />
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="basicDetails-rot">
                                                Insurance ID
                                            </label>
                                            <input placeholder="Insurance ID" id='basicDetails-rot' name='insurance_no' className="form-control"
                                                value={formData?.insurance_no}
                                                onChange={(e) => {
                                                    handleInputChange(e, "addForm")
                                                }}
                                            />
                                        </Col>
                                    </>
                                )
                                
                                
                            ) :
                                <></>
                            }
                            <Col xs={12} className='mt-2'>
                                {isEdit === true && changeVehicle === false && customer?.insurance.length === 0 ? (
                                    <div className={formData?.is_insurance} style={{ display: formData?.is_insurance === true ? '' : 'none' }}>
                                    {console.log("helooooooooooooo",formData.is_insurance )}
                                    <label>
                                        <input
                                            className='me-1'
                                            name='is_insurance'
                                            type="checkbox"
                                            checked={formData?.is_insurance}
                                            onChange={(e) => {
                                                
                                                handleCheckboxChange(e)
                                                handleInputChange(e, "addForm")
                                            }}
                                        />
                                        Transfer Vehicle Insurance
                                    </label>
                                </div>
                                ):(
                                    <div className={customer?.insurance} style={{ display: customer?.insurance.length === 0 ? 'none' : '' }}>
                                    {console.log("helooooooooooooo",formData.is_insurance )}
                                    <label>
                                        <input
                                            className='me-1'
                                            name='is_insurance'
                                            type="checkbox"
                                            checked={formData?.is_insurance}
                                            onChange={(e) => {
                                                
                                                handleCheckboxChange(e)
                                                handleInputChange(e, "addForm")
                                            }}
                                        />
                                        Transfer Vehicle Insurance
                                    </label>                
                                </div> 
                                )}
                            </Col>
                            <Col xs={12} className='mt-2'>
                                <div className='d-flex justify-content-between mt-2'>
                                    <div>
                                        <button className="btn btn-primary" onClick={() => {
                                            navigate(-1)
                                        }} type="button">Cancel</button>
                                    </div>
                                    <div>
                                        <button className="btn btn-primary ms-2" type="button" onClick={handleNext}>Next</button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                ) : (
                    <Container>
                        <div className='d-flex justify-content-center align-items-center w-100'>
                            <Spinner size={'40px'} />
                        </div>
                    </Container>

                )
            }

        </>
    )
}

export default Buyer