/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Select from "react-select"
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
import { VirtualizedSelect } from '../Test'

const Buyer = ({ allData }) => {
    const { id } = useParams()

    const navigate = useNavigate()
    const { formData, handleNext, handleInputChange, setFormData, handleChange, country, isCustomer, handleSubmitSection, currentStep, handleBack } = allData
    const [productModelOption, setProductModelOption] = useState([])
    const [productVariantOption, setProductVariantOption] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [customerList, setCustomerList] = useState([])
    const [vehicleOptions, setVehicleOptions] = useState([])
    const [customer, setCustomer] = useState()
    const [customerfinal, setCustomerfinal] = useState()
    


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
            Adharcard: "",
            pancard: ""
        },
        productForm: {
            xircls_customer_id: isCustomer ? id : '',
            engine_number: '',
            // brand: '',
            model: ''
        }
    })

    const selectCustomers = () => {
        // if () {
        // "SHIVAM KALE"
        getReq(`automotivetransaction`, `/?id=${(id && isCustomer) ? id : formData?.mainForm?.xircls_customer_id}`, crmURL)
            .then((resp) => {
                console.log("Response: selectCustomers", resp)
                const vehicleOptions = resp.data.car_variant
                    .map((vehicle) => ({
                        value: vehicle.id,
                        label: vehicle.registration_number
                    }))
                setVehicleOptions(vehicleOptions)
            })
            .catch((error) => {
                console.error("Error:", error)
                    (error.message) ? toast.error(error.message) : toast.error(error)
            })
        // }
    }


    const selectInsurance = () => {
        getReq(`automotivetransaction`, `?customer_id=${formData?.xircls_customer_id}&vehicle_id=${formData?.product_name_id}&xircls_customer_id=${formData?.buyer_id}`, crmURL)
            .then((resp) => {
                console.log("ResponseMail", resp?.data?.customer?.email)
                console.log("Get Customer", resp?.data?.finance)
                setCustomer(resp?.data)
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

    const checkCustomerDetails = () => {
        // getReq(`automotivetransaction`, `?customer_id=${formData?.xircls_customer_id}&vehicle_id=${formData?.product_name_id}`, crmURL)
        getReq('check_customer_details', `?customer_id=${formData?.buyer_xircls_customer_id}&vehicle_id=${formData?.product_name_id || ''}`, crmURL)
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
        if (formData?.buyer_xircls_customer_id) {
            checkCustomerDetails()
        }
    }, [formData?.buyer_xircls_customer_id, formData?.product_name_id])

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
        // form_data.append("Adharcard", '123456789012')
        // form_data.append("pancard", 'ACKPU1510U')
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


    const handleAddInputChange = (e, keyType) => {
        console.log(e)
        setCheck(prevData => ({ ...prevData, [keyType]: { ...prevData[keyType], [e.target.name]: e.target.value } }))
    }

    const handleAddSubmitSection = (e, action) => {
        e.preventDefault();

        const checkForm = validForm(addFormvalueToCheck, check.addForm)
        console.log(checkForm, "dd");
        if (checkForm) {
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
        form_data.append("id", formData?.xircls_customer_id)
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

    // useEffect(() => {
    //     if (formData.xircls_customer_id) {
    //         selectCustomer()
    //     }
    // }, [formData.xircls_customer_id])

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
        getReq("getAllCustomerNew", "", crmURL)
            .then((resp) => {
                console.log(resp, 'jghkuhk')
                setCustomerList(resp?.data?.success?.map((curElem) => {
                    return { label: curElem?.customer_name ? curElem?.customer_name : '-', value: curElem?.xircls_customer_id }
                }))
                setIsLoading(false)
                // setCustomerfinal{resp}
            })
            .catch((error) => {
                console.log(error)
            })

    }
    
    useEffect(() => {
        getCustomer()
        console.log(getCustomer(), 'jghkuhk')
    }, [])


    const InnerStyles = (
        <style>
            {`
            .hiddenRight{
                right: 0 !important
            }
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
                            const e = { target: { name: "title", value: event.value } };
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
                    </div>
                </div>
            </Row>
        </form>
    )

    return (
        <>
            {InnerStyles}
            <Offcanvas show={isHidden} onHide={() => handleClose('customer')} placement="end">
                <Offcanvas.Header closeButton>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {AddCustomerForm}
                </Offcanvas.Body>
            </Offcanvas>
            {
                !isLoading ? (
                    <Container fluid className="px-0 py-1">
                        <Row>
                            <Col md={12} className="mt-2">
                                <h4 className="mb-0">Applicant Details</h4>
                            </Col>
                            <Col md={6} className="mt-2" style={{ zIndex: '9' }}>
                                <label htmlFor="customer-name" className="form-label" style={{ margin: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Customer Name
                                    <a onClick={() => handleShow("customer")} className='text-primary'>Add New Customer</a>
                                </label>
                                <VirtualizedSelect
                                    placeholder='Customer Name'
                                    isDisabled={isCustomer}
                                    id="insurance-type"
                                    options={customerList}
                                    closeMenuOnSelect={true}
                                    name='buyer_customer_name'
                                    // components={{ Menu: CustomSelectComponent }}
                                    onChange={(e) => {
                                        console.log(e);
                                        setFormData((prevData) => {
                                            const updatedData = {
                                                buyer_customer_name: e.label,
                                                buyer_id: e.value,
                                                buyer_xircls_customer_id: e.value
                                            };
                                            return {
                                                ...prevData,
                                                ...updatedData
                                            };
                                        }, () => {
                                            handleAddInputChange({ target: { value: e.value, name: "xircls_customer_id_2" } }, 'productForm');
                                            // selectInsurance();
                                        });
                                    }}
                                    value={customerList?.find((curElem) => Number(curElem?.value) === Number(formData.buyer_xircls_customer_id))}
                                />
                                <p id="xircls_customer_id_val" className="text-danger m-0 p-0 vaildMessage"></p>
                            </Col>
                            {/* <Col md={6} className="mt-2">
                                <label htmlFor="product-name" className="form-label" style={{ margin: '0px' }}>
                                    Product Name
                                </label>
                                <Select
                                    placeholder='Select Product Name'
                                    id="product-name"
                                    options={productOptions}
                                    name="product_name_id"
                                    isDisabled={true}
                                    components={{ Menu: CustomProductSelectComponent }}
                                    // onChange={(value, actionMeta) => {
                                    //     handleChange(value, actionMeta)
                                    //     selectInsurance()
                                    // }}
                                    value={productOptions?.filter((curElem) => curElem?.value === formData?.product_name_id)}
                                    closeMenuOnSelect={true}
                                />
                                <p id="product_name_id_val" className="text-danger m-0 p-0 vaildMessage"></p>
                            </Col> */}
                            {/* new */}
                            <Col md={6} className="mt-2">
                                <label htmlFor="product-name" className="form-label" style={{ margin: '0px' }}>
                                    Product Name
                                </label>
                                <Select
                                    placeholder='Select Product Name'
                                    id="product-name"
                                    options={productOptions}
                                    name="product_name_id"
                                    value={{ value: formData.product_name_label, label: formData.product_name_label }}
                                    isDisabled={true}
                                />
                            </Col>
                            <Col md={6} className="mt-2">
                                <label htmlFor="basicDetails-rot">
                                    Mobile Number
                                </label>
                                <input placeholder="Enter your Mobile" id='basicDetails-rot' name='phone_no' className="form-control disabled"
                                    value={customer?.customer?.phone_no ?? formData?.buyer_phone_no}
                                    disabled
                                    readOnly
                                    onChange={e => handleInputChange(e, "addForm")
                                    }
                                />
                            </Col>
                            <Col md={6} className="mt-2">
                                <label htmlFor="basicDetails-rot">
                                    Email ID
                                </label>
                                <input placeholder="Enter your Email" id='basicDetails-rot' name='email' className="form-control"
                                    value={customer?.customer?.email ?? formData?.buyer_email}
                                    disabled
                                    onChange={e => handleInputChange(e, "addForm")}
                                />
                            </Col>
                            <Col md={6} className="mt-2">
                                <label htmlFor="sales-person">
                                    Sales Person
                                </label>
                                <input placeholder="Sales Person" type='text' id='sales-person' name='buyer_dealer' className="form-control"
                                    onChange={e => handleInputChange(e, "addForm")}
                                    value={formData.buyer_dealer}
                                />
                            </Col>
                        </Row>
                        {
                            currentStep === 2 && (
                                <>

                                    <div className='w-100 mt-3 d-flex justify-content-between align-items-center'>
                                        <div className='d-flex gap-2'>
                                            <button className="btn btn-primary" type="button" onClick={handleBack}>Back</button>
                                            <button className="btn btn-primary" type="button">Cancel</button>
                                        </div>
                                        <div className='d-flex gap-2'>
                                            <button className="btn btn-primary" type="button" onClick={() => {
                                                handleSubmitSection("SAVE")
                                            }}>Save</button>
                                            <button className="btn btn-primary" type="button" onClick={() => handleSubmitSection("SAVE & CLOSE")} >Save & Close</button>
                                        </div>
                                    </div>
                                </>
                            )
                        }
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