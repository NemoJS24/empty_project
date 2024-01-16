/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Container, Card, CardBody, Row, Col } from "reactstrap"
import Select from "react-select"
import { Link } from 'react-router-dom'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { crmURL, getReq } from '@src/assets/auth/jwtService'
import { useParams, useNavigate } from 'react-router-dom'
import axios from "axios"
import toast from "react-hot-toast"
import { validForm } from '../../Validator'

const AddServicing = () => {

    const mainFormvalueToCheck = [
        {
            name: 'customer_name',
            message: 'Enter Customer Name',
            type: 'string',
            id: 'customer_name'
        },
        {
            name: 'vehicle',
            message: 'Enter Vehicle Name',
            type: 'string',
            id: 'vehicle'
        },
        {
            name: 'service_advisor',
            message: 'Enter Service advisor Name',
            type: 'string',
            id: 'service_advisor'
        },
        {
            name: 'job_card_date',
            message: 'Enter Job card date',
            type: 'string',
            id: 'job_card_date'
        },
        {
            name: 'service_invoice_date',
            message: 'Enter Service invoice date',
            type: 'string',
            id: 'service_invoice_date'
        },
        {
            name: 'service_expiry_date',
            message: 'Enter Next service date',
            type: 'string',
            id: 'service_expiry_date'
        },
        {
            name: 'service_invoice_amount',
            message: 'Enter Service invoice amount',
            type: 'string',
            id: 'service_invoice_amount'
        }
    ]

    const addFormvalueToCheck = [
        {
            name: 'title',
            message: 'Enter title',
            type: 'string',
            id: 'title'
        },
        {
            name: 'cust_first_name',
            message: 'Enter customer first Name',
            type: 'string',
            id: 'cust_first_name'
        },
        {
            name: 'cust_last_name',
            message: 'Enter customer last Name',
            type: 'string',
            id: 'cust_last_name'
        },
        {
            name: 'email',
            message: 'Enter email',
            type: 'string',
            id: 'email'
        },
        {
            name: 'phone_no',
            message: 'Enter Phone no',
            type: 'string',
            id: 'phone_no'
        },
        {
            name: 'country',
            message: 'Enter Country',
            type: 'string',
            id: 'country'
        },
        {
            name: 'city',
            message: 'Enter City',
            type: 'string',
            id: 'city'
        },
        {
            name: 'state',
            message: 'Enter State',
            type: 'string',
            id: 'state'
        },
        {
            name: 'pincode',
            message: 'Enter Pincode',
            type: 'string',
            id: 'pincode'
        }
    ]

    const [formData, setFormData] = useState({
        mainForm: {
            customer_name: '',
            vehicle: '',
            service_advisor: '',
            job_card_date: '',
            service_invoice_date: '',
            next_service_date: '',
            service_invoice_amount: ''
        },
        addForm: {
            title: '',
            cust_first_name: '',
            cust_last_name: '',
            email: '',
            phone_no: '',
            country: 1,
            city: '',
            state: '',
            pincode: ''
        },
    })

    // const inputChangeHandler = (e) => {
    //     setFormData({ ...formData, mainForm: { ...formData.mainForm, [e.target.name]: e.target.value } })
    // }

    // const addInputChangeHandler = (e) => {
    //     setFormData({ ...formData, addForm: { ...formData.addForm, [e.target.name]: e.target.value } })
    // }

    // const [customerFormData, setCustomerFormData] = useState({
    //     title: "mr",
    //     cust_first_name: "vnasdf",
    //     cust_last_name: "poojary",
    //     email: "hello@lol.com",
    //     phone_no: "9132810845",
    //     country: "Albania",
    //     city: "mumbai",
    //     state: "maharashtra",
    //     pincode: "400080"
    // })
    const [country, setCountry] = useState([])
    const [isHidden, setIsHidden] = useState(false)
    const [allOptions, setAllOptions] = useState([])
    const [vehicleOptions, setVehicleOptions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const navigate = useNavigate()
    const { id } = useParams()

    const fetchServiceData = (id) => {
        const url = new URL(`${crmURL}/customers/merchant/get_view_customer/`)
        const form_data = new FormData()
        form_data.append("id", id)
        form_data.append('edit_type', 'is_servicing')
        fetch(url, {
            method: "POST",
            body: form_data
        })
            .then((response) => {
                return response.json()
            })
            .then((resp) => {
                console.log("ResponseId:", resp.success[0])
                if (resp.success.length === 0) {
                    // navigate(`/merchant/customer/all_cust_dashboard/add_servicing/`)
                    toast.error('Autofill is not available')
                    return
                }
                const newObject = {};
                for (const key in resp.success[0]) {
                    if (resp.success[0].hasOwnProperty(key) && resp.success[0][key] !== null) {
                        newObject[key] = resp.success[0][key];
                    }
                }
                // console.log('AfterRemovingNullId', newObject);
                setFormData(prefData => ({
                    ...prefData,
                    mainForm: {
                        ...prefData.mainForm,
                        ...newObject,
                        job_card_date: prefData?.job_card_date.substring(0, 10),
                        service_expiry_date: prefData?.service_expiry_date.substring(0, 10),
                        service_invoice_date: prefData?.service_invoice_date.substring(0, 10),
                        updated_at: prefData?.updated_at.substring(0, 10)
                    }
                }))
            })
            .catch((error) => {
                console.error("Error:", error)
                toast.error('Failed to fetch Servicing Detail')
            })
    }

    const postData = (btn) => {
        const url = new URL(`${crmURL}/customers/merchant/jmd-servicing-customers/`)
        const form_data = new FormData()
        Object.entries(formData.mainForm).map(([key, value]) => {
            form_data.append(key, value)
        })
        form_data.append("press_btn", btn)
        id && form_data.append("servicing_id", id)

        fetch(url, {
            method: "POST",
            body: form_data
        })
            .then((response) => {
                return response.json()
            })
            .then((resp) => {
                console.log("Response:", resp)
                toast.success('Customer Service saved successfully')
                resp.is_edit_url ? navigate(`/merchant/customers/edit_service/${resp.servicing_code}`) : navigate(`/merchant/customer/all_cust_dashboard/add_servicing/`)
                fetchServiceData(resp.servicing_code)
            })
            .catch((error) => {
                console.error("Error:", error)
                if (error.message === 'Customer Service already exists') {
                    toast.error('Customer Service already exists')
                } else {
                    toast.error('Failed to save customer')
                }
            })
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
                const option = [...allOptions, ...customerOptions]
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

    const selectCustomer = (e) => {
        setFormData(prev => ({ ...prev, mainForm: { ...prev.mainForm, customer: e.value } }))
        const form_data = new FormData()
        const url = new URL(`${crmURL}/customers/merchant/fetch_vehicle_number/`)
        form_data.append("id", e.value)
        // "SHIVAM KALE"
        fetch(url, {
            method: "POST",
            body: form_data
        })
            .then((response) => {
                console.log(response)
                return response.json()
            })
            .then((resp) => {
                console.log("Response:", resp)
                const vehicleOptions = resp.car_variant
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
    }

    const postNewCustomerData = () => {
        // console.log(customerFormData)
        const url = new URL(`${crmURL}/customers/merchant/add_customer/`)
        const form_data = new FormData()
        Object.entries(formData.addForm).map(([key, value]) => {
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
                handleClose('customer')
                fetchCustomerData(currentPage, null, () => { })

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

    useEffect(() => {
        fetchCustomerData(currentPage, null, () => { })
        getCountries()
        if (id) {
            fetchServiceData(id)
        }
    }, [])

    const handleInputChange = (e, keyType) => {
        console.log(e)
        setFormData(prevData => ({ ...prevData, [keyType]: { ...prevData[keyType], [e.target.name]: e.target.value } }))
    }

    // const handleAddInputChange = (e, keyType) => {
    //     console.log(e)
    //     setFormData(prevData => ({ ...prevData, [keyType]: { ...prevData[keyType], [e.target.name]: e.target.value } }))
    // }

    const handleClose = (type) => (type === 'customer') && (setIsHidden(false))
    const handleShow = (type) => (type === 'customer') && setIsHidden(true)

    // const handleSubmitSection = (event) => {
    //     event.preventDefault()
    //     // postData()
    // }

    const handleCustomerSubmitSection = (event) => {
        event.preventDefault()
        postNewCustomerData()
    }
    const handleSubmit = (event, btn) => {
        event.preventDefault()
        postData(btn)
    }

    const titleOptions = [
        { value: 'mr', label: 'Mr.' },
        { value: 'ms', label: 'Ms.' },
        { value: 'mrs', label: 'Mrs.' }
    ]

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

    // const handleCustomerSubmit = (event) => {
    //     event.preventDefault()

    //     const checkForm = validForm(mainFormvalueToCheck, formData.addForm); // Use mainFormvalueToCheck for validation
    //     console.log(checkForm)

    //     if (checkForm.isValid) {
    //         console.log('Form is valid')
    //         postNewCustomerData()
    //     }
    // }

    const handleSubmitSection = (e, action) => {
        e.preventDefault();

        const checkForm = validForm(mainFormvalueToCheck, formData.mainForm); // Use mainFormvalueToCheck for validation
        console.log(checkForm);

        if (checkForm.isValid) {
            console.log('Form is valid');

            if (action === 'SAVE') {
                // Save
            } else if (action === 'SAVE & CLOSE') {
                // Save and close
            }
        }
    }


    const handleAddSubmitSection = (e, action) => {
        e.preventDefault();

        const checkForm = validForm(addFormvalueToCheck, formData.addForm); // Use mainFormvalueToCheck for validation
        console.log(checkForm);

        if (checkForm.isValid) {
            console.log('Form is valid');

            if (action === 'SAVE') {
                // Save
            } else if (action === 'SAVE & CLOSE') {
                // Save and close
            }
        }
    }


    const AddCustomerForm = (
        <form onSubmit={handleCustomerSubmitSection}>
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
                        options={titleOptions}
                        closeMenuOnSelect={true}
                        value={titleOptions.find(option => option.value === formData.addForm?.title) ?? ''}
                        onChange={(event) => {
                            const e = { target: { name: "title", value: event.value } };
                            handleInputChange(e, "addForm")
                            // addInputChangeHandler({ target: { name: 'title', value: e?.value } });
                        }}
                    />

                    <p id="title_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-first-name">
                        First Name
                    </label>
                    <input placeholder="First Name" type='text' id='basicDetails-first-name' name='cust_first_name' className="form-control"
                        value={formData.addForm?.cust_first_name}
                        onChange={(e) => {
                            handleInputChange(e, "addForm")
                            // addInputChangeHandler(e)
                        }}
                    />
                    <p id="cust_first_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-last-name">
                        Last Name
                    </label>
                    <input placeholder="Last Name" type='text' id='basicDetails-last-name' name='cust_last_name' className="form-control"
                        value={formData.addForm?.cust_last_name}
                        onChange={(e) => {
                            handleInputChange(e, "addForm")
                            // addInputChangeHandler(e)
                        }}

                    />
                    <p id="cust_last_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-email">
                        Email
                    </label>
                    <input placeholder="Email" type='text' id='basicDetails-email' name='email' className="form-control"
                        value={formData.addForm?.email}
                        onChange={(e) => {
                            handleInputChange(e, "addForm")
                            // addInputChangeHandler(e)
                        }}
                    />
                    <p id="email_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-mobile">
                        Mobile Number
                    </label>
                    <input placeholder="Mobile Number" type='tel' maxLength={10} id='basicDetails-mobile' name='phone_no' className="form-control"
                        value={formData.addForm?.phone_no}
                        onChange={(e) => {
                            handleInputChange(e, "addForm")
                            // addInputChangeHandler(e)
                        }}
                    />
                    <p id="phone_no_val" className="text-danger m-0 p-0 vaildMessage"></p>

                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-country">Country</label>
                    <Select
                        options={country}
                        inputId="aria-example-input"
                        closeMenuOnSelect={true}
                        name="country"
                        value={country?.filter($ => $.value === formData?.addForm?.country)}
                        placeholder="Select Country"
                        // onChange={(e) => setCustomerFormData(prevData => ({ ...prevData, country: e.label }))}
                        onChange={(event) => {
                            const e = { target: { name: "country", value: event.value } }
                            handleInputChange(e, "addForm")
                            // inputChangeHandler({ target: { name: 'country', value: e?.value } })
                        }}
                    />
                    <p id="country_val" className="text-danger m-0 p-0 vaildMessage"></p>

                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-city">City</label>
                    <input
                        placeholder="City"
                        type="text"
                        id="address-1-city"
                        name="city"
                        className="form-control"
                        value={formData.addForm.city}
                        onChange={(e) => {
                            handleInputChange(e, "addForm")
                            // addInputChangeHandler(e)
                        }}
                    />
                    <p id="city_val" className="text-danger m-0 p-0 vaildMessage"></p>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-state">State</label>
                    <input
                        placeholder="State"
                        type="text"
                        id="address-1-state"
                        name="state"
                        className="form-control"
                        value={formData.addForm.state}
                        onChange={(e) => {
                            handleInputChange(e, "addForm")
                            // addInputChangeHandler(e)
                        }}
                    />
                    <p id="state_val" className="text-danger m-0 p-0 vaildMessage"></p>

                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-pincode">Pincode</label>
                    <input
                        placeholder="Pincode"
                        type="text"
                        id="address-1-pincode"
                        name="pincode"
                        className="form-control"
                        value={formData.addForm.pincode}
                        onChange={(e) => {
                            handleInputChange(e, "addForm")
                        }}
                    />
                    <p id="pincode_val" className="text-danger m-0 p-0 vaildMessage"></p>

                </Col>

                <div className='d-flex justify-content-between mt-2'>
                    <div>
                        <button className="btn btn-primary" type="submit" onClick={(e) => handleAddSubmitSection(e)}>Add</button>
                        <button className="btn btn-primary ms-2" type="button" >Cancel</button>
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

    const handleChange = (e, formType) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [formType]: {
                ...prevData[formType],
                [name]: value
            }
        }))
    }
    return (
        <div >
            <Offcanvas show={isHidden} onHide={() => handleClose('customer')} placement="end">
                <Offcanvas.Header closeButton>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {AddCustomerForm}
                </Offcanvas.Body>
            </Offcanvas>
            <form>
                <Row>
                    <Col md={12} className="mt-2">
                        <h4 className="mb-0">{id ? 'Edit Servicing' : 'Add Servicing'}</h4>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label
                            htmlFor="company-name"
                            className="form-label"
                            style={{ margin: "0px" }}
                        >
                            Customer Name
                        </label>
                        <Select
                            placeholder='Select Customer'
                            id='company-name'
                            options={allOptions}
                            closeMenuOnSelect={true}
                            onMenuScrollToBottom={() => fetchCustomerData(currentPage, null, () => { })}
                            components={{ Menu: CustomSelectComponent }}
                            onChange={(event) => {
                                selectCustomer(event)
                                const e = { target: { name: 'customer_name', value: e?.value } }
                                handleInputChange(e, "mainForm")
                            }}
                            value={id && { value: formData.mainForm?.customer_name, label: formData.mainForm?.customer_name }}
                            isDisabled={formData.mainForm?.customer_name}
                        />
                        <p id="customer_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label
                            htmlFor="vehicle-name"
                            className="form-label"
                            style={{ margin: "0px" }}
                        >
                            Vehicle Number
                        </label>
                        <Select
                            placeholder='Vehicle Number'
                            id="vehicle-name"
                            options={vehicleOptions}
                            // defaultValue={vehicleOptions[0]}
                            value={id && { value: formData.mainForm?.registration_number, label: formData.mainForm?.registration_number }}
                            isDisabled={formData.mainForm?.registration_number}
                            closeMenuOnSelect={true}
                            // onChange={e => setFormData(prev => ({ ...prev, vehicle: e.value }))}
                            onChange={(event) => {
                                const e = { target: { name: "vehicle", value: event.value } }
                                handleInputChange(e, "mainForm")
                            }}
                        />
                        <p id="vehicle_val" className="text-danger m-0 p-0 vaildMessage"></p>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="advisor-name">Service Advisor</label>
                        <input
                            placeholder="Service Advisor"
                            type="text"
                            id="advisor-name"
                            name="service_advisor"
                            className="form-control"
                            value={formData.mainForm.service_advisor ?? ""}
                            onChange={(e) => {
                                handleInputChange(e, "mainForm")
                            }}
                        />
                        <p id="service_advisor_val" className="text-danger m-0 p-0 vaildMessage"></p>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="job-card-date">Job Card Date</label>
                        <input
                            placeholder="Job Card Date"
                            type="date"
                            id="job-card-date"
                            name="job_card_date"
                            className="form-control"
                            value={formData.mainForm.job_card_date ?? ""}
                            onChange={(e) => {
                                handleInputChange(e, "mainForm")
                            }}
                        />
                        <p id="job_card_date_val" className="text-danger m-0 p-0 vaildMessage"></p>

                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="service-invoice-date">Service Invoice Date</label>
                        <input
                            placeholder="Service Invoice Date"
                            type="date"
                            id="service-invoice-date"
                            name="service_invoice_date"
                            className="form-control"
                            value={formData.mainForm.service_invoice_date ?? ""}
                            onChange={(e) => {
                                handleInputChange(e, "mainForm")
                            }}
                        />
                        <p id="service_invoice_date_val" className="text-danger m-0 p-0 vaildMessage"></p>

                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="next-service-date">Next Service Date</label>
                        <input
                            placeholder="Next Service Date"
                            type="date"
                            id="next-service-date"
                            name="service_expiry_date"
                            className="form-control"
                            value={formData.mainForm.service_expiry_date ?? ""}
                            onChange={(e) => {
                                handleInputChange(e, "mainForm")
                            }}
                        />
                        <p id="service_expiry_date_val" className="text-danger m-0 p-0 vaildMessage"></p>

                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="service-invoice-amount">Service Invoice Amount - ₹</label>
                        <input
                            placeholder="Service Invoice Amount"
                            type="tel"
                            id="service-invoice-amount"
                            name="service_invoice_amount"
                            className="form-control"
                            value={formData.mainForm.service_invoice_amount ?? ""}
                            onChange={(e) => {
                                handleInputChange(e, "mainForm")
                            }}
                        />
                        <p id="service_invoice_amount_val" className="text-danger m-0 p-0 vaildMessage"></p>

                    </Col>
                    <Col xs='12'>
                        <div className='d-flex justify-content-between mt-2'>
                            <div>
                                <button className="btn btn-primary" type="button" onClick={() => history.back()}>
                                    Back
                                </button>
                                {/* <button className="btn btn-primary ms-2" type="button">Cancel</button> */}
                            </div>
                            <div>
                                <button className="btn btn-primary" type="button" onClick={(e) => handleSubmitSection(e, 'SAVE')} >Save</button>
                                <button className="btn btn-primary ms-2" type="button" onClick={(e) => handleSubmitSection(e)}>Save & Close</button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </form>
        </div>
    )
}

export default AddServicing