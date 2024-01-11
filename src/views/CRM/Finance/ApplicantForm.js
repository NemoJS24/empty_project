/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Select from "react-select"
import { createPortal } from 'react-dom'
import axios from "axios"
import toast from "react-hot-toast"
import { crmURL } from '@src/assets/auth/jwtService.js'
import AsyncSelect from 'react-select/async'
import Offcanvas from 'react-bootstrap/Offcanvas'

const ApplicantForm = ({ formHandler }) => {
    const [isHidden, setIsHidden] = useState(false)
    const [isAddProductHidden, setIsAddProductHidden] = useState(false)
    const [customerDetails, setCustomerDetails] = useState([])
    const [customerOptions, setCustomerOptions] = useState([])
    const [productOptions, setProductOptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // console.log('customerDetails')
    // console.log(customerDetails)
    // console.log('customerOptions')
    // console.log(customerOptions)
    // console.log('productOptions')
    // console.log(productOptions)

    const { handleNext, formData, handleInputChange } = formHandler

    const fetchCustomerData = async () => {
        try {
            const getUrl = new URL(`${crmURL}/customers/merchant/get_customer_details/`);
            const response = await axios.get(getUrl);

            // Assuming res.data.success is an array
            return response.data.success;
        } catch (error) {
            console.error('Error fetching customer data:', error);
            throw error; // Re-throw the error to be caught by the calling function
        }
    };

    const selectCustomer = (e) => {
        handleInputChange(e, 'customer_name_id')
        // setIsLoading(true)
        const form_data = new FormData()
        const url = new URL(`${crmURL}/customers/merchant/fetch_vehicle_details/`)
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
                if (resp.car_variant) {
                    changeProductName(resp)
                }
            })
            .catch((error) => {
                // setIsLoading(false)
                console.error("Error:", error)
                    (error.message) ? toast.error(error.message) : toast.error(error)
            })
    }

    const loadOptions = (inputValue, callback) => {
        const getUrl = new URL(`${crmURL}/customers/merchant/get_customer_details/`);
        // getUrl.searchParams.set("q", inputValue)
        axios.get(getUrl.toString())
            .then((response) => {
                const successData = response.data.success;
                if (successData && Array.isArray(successData)) {
                    const customerOptions = successData
                        .filter((item) => item.customer_name !== "")
                        .map((customer) => ({
                            value: customer.id,
                            label: customer.customer_name,
                        }));
                    callback(customerOptions);
                } else {
                    console.error("Invalid or missing data in the API response");
                    callback([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
                callback([]);
            });
    };
    // const fetchData = async () => {
    //     try {
    //     const getUrl = new URL(`${crmURL}/customers/merchant/get_customer_details/`);
    //         const response = await axios.get(getUrl.toString());
    //         const successData = response.data.success;
    //         const customerOptionss = successData
    //             .filter((item) => item.customer_name !== "")
    //             .map((customer) => ({
    //                 value: customer.id,
    //                 label: customer.customer_name,
    //             }));
    //             // console.log(customerOptions);
    //         setCustomerOptions(customerOptionss);
    //         // setCustomerOptions(filteredData);
    //     } catch (error) {
    //         console.error("Error fetching data:", error.message);
    //         setCustomerOptions([]);
    //     }
    // };

    // useEffect(() => {
    //     fetchData()
    // }, [])
    // console.log(customerOptions);

    // const loadOptions = (inputValue = '', callback) => {
    //     console.log('inputValue')
    //     console.log(inputValue)
    //     if (!inputValue) {
    //         // If no input, return all options
    //         callback(customerOptions);
    //       } else {
    //         // If input provided, filter options based on input
    //         const filteredOptions = customerOptions.filter((option) =>
    //           option.label.toLowerCase().includes(inputValue.toLowerCase())
    //         );
    //         callback(filteredOptions);
    //       }
    //   };

    const changeProductName = (data) => {
        const productOptions = data.car_variant.map(item => {
            let value = item[0]
            let label = item.slice(1).filter(Boolean).join(' -- ')
            return {
                value: value,
                label: label
            }
        })
        // setIsLoading(false)
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
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-first-name">
                        First Name
                    </label>
                    <input placeholder="First Name" type='text' id='basicDetails-first-name' name='basicDetail.cust_first_name' className="form-control"
                    // value={formData?.basicDetail?.cust_first_name} 
                    // onChange={handleInputChange} 

                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-last-name">
                        Last Name
                    </label>
                    <input placeholder="Last Name" type='text' id='basicDetails-last-name' name='basicDetail.cust_last_name' className="form-control"
                    // value={formData?.basicDetail?.cust_last_name} 
                    // onChange={handleInputChange} 
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-email">
                        Email
                    </label>
                    <input placeholder="Email" type='text' id='basicDetails-email' name='basicDetail.email' className="form-control"
                    //  value={formData?.basicDetail?.email} 
                    //  onChange={handleInputChange}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="basicDetails-mobile">
                        Mobile Number
                    </label>
                    <input placeholder="Mobile Number" type='tel' maxLength={10} id='basicDetails-mobile' name='basicDetail.phone_no' className="form-control"
                    // value={formData?.basicDetail?.phone_no}
                    //  onChange={handleInputChange} 
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-country">Country</label>
                    <select
                        placeholder="Country"
                        type="select"
                        id="address-1-country"
                        name="billingAddress.country"
                        className="form-select"
                    // value={formData.billingAddress.country}
                    // onChange={handleInputChange}
                    >
                        <option value="india" selected>
                            India
                        </option>
                    </select>
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="address-1-city">City</label>
                    <input
                        placeholder="City"
                        type="text"
                        id="address-1-city"
                        name="billingAddress.city"
                        className="form-control"
                    // value={formData.billingAddress.city}
                    // onChange={handleInputChange}
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
                    // value={formData.billingAddress.state}
                    // onChange={handleInputChange}
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
                    // value={formData.billingAddress.pincode}
                    // onChange={handleInputChange}
                    />
                </Col>

                <div className='d-flex justify-content-between mt-2'>
                    <div>
                        <button className="btn btn-primary" type="button">Add</button>
                        <button className="btn btn-primary ms-2" type="button">Cancel</button>
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
                    <input type='text' id='customer-name' name='basicDetail.cust_first_name' className="form-control"
                        // value={formData?.basicDetail?.cust_first_name} 
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
                        type='text' id='registration-name' name='basicDetail.cust_first_name' className="form-control"
                    // value={formData?.basicDetail?.cust_first_name} 
                    // onChange={handleInputChange} 
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="sales-person">
                        Sales Person
                    </label>
                    <input
                        placeholder='Sales Person'
                        type='text' id='sales-person' name='basicDetail.cust_first_name' className="form-control"
                    // value={formData?.basicDetail?.cust_first_name} 
                    // onChange={handleInputChange} 
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-identification">
                        Vehicle Identification Number (VIN) or Chassis Number
                    </label>
                    <input
                        placeholder='Vehicle Identification Number'
                        type='text' id='vehicle-identification' name='basicDetail.cust_first_name' className="form-control"
                    // value={formData?.basicDetail?.cust_first_name} 
                    // onChange={handleInputChange} 
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="engine-number">
                        Engine Number
                    </label>
                    <input
                        placeholder='Engine Number'
                        type='text' id='engine-number' name='basicDetail.cust_first_name' className="form-control"
                    // value={formData?.basicDetail?.cust_first_name} 
                    // onChange={handleInputChange} 
                    />
                </Col>

                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-type" className="form-label" style={{ margin: '0px' }}>
                        Vehicle Type
                    </label>
                    <Select
                        placeholder='Vehicle Type'
                        id="vehicle-type"
                        options={[
                            { value: 'newCar', label: 'New Car' },
                            { value: 'used', label: 'Used' },
                        ]}
                        closeMenuOnSelect={true}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="brand-select" className="form-label" style={{ margin: '0px' }}>
                        Select Brand
                    </label>
                    <Select
                        placeholder='Select Brand'
                        id="brand-select"
                        options={[
                            { value: 'newCar', label: 'New Car' },
                            { value: 'used', label: 'Used' },
                        ]}
                        closeMenuOnSelect={true}
                    />
                </Col>

                <Col md={12} className="mt-2">
                    <label htmlFor="model-select" className="form-label" style={{ margin: '0px' }}>
                        Select Model
                    </label>
                    <Select
                        placeholder='Select Model'
                        id="model-select"
                        options={[
                            { value: 'newCar', label: 'New Car' },
                            { value: 'used', label: 'Used' },
                        ]}
                        closeMenuOnSelect={true}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="variant-select" className="form-label" style={{ margin: '0px' }}>
                        Select Variant
                    </label>
                    <Select
                        placeholder='Select Variant'
                        id="variant-select"
                        options={[
                            { value: 'newCar', label: 'New Car' },
                            { value: 'used', label: 'Used' },
                        ]}
                        closeMenuOnSelect={true}
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-delivery-date">
                        Vehicle Delivery Date
                    </label>
                    <input placeholder="Vehicle Delivery Date" type='text' id='vehicle-delivery-date' name='basicDetail.cust_last_name' className="form-control"
                    // value={formData?.basicDetail?.cust_last_name} 
                    // onChange={handleInputChange} 
                    />
                </Col>
                <Col md={12} className="mt-2">
                    <label htmlFor="vehicle-registration-date">
                        Vehicle Registration Date
                    </label>
                    <input placeholder="Vehicle Registration Date" type='text' id='vehicle-registration-date' name='basicDetail.cust_last_name' className="form-control"
                    // value={formData?.basicDetail?.cust_last_name} 
                    // onChange={handleInputChange} 
                    />
                </Col>
                <div className='d-flex justify-content-end mt-2'>
                    <div>
                        <button className="btn btn-primary ms-2" type="button">Add Product</button>
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
            <Container fluid className="px-0 py-1">
                {/* <form onSubmit={handleSubmit}> */}
                <Row>
                    <Col md={12} className="mt-2">
                        <h4 className="mb-0">Applicant Details</h4>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="customer-name" className="form-label" style={{ margin: '0px' }}>
                            Customer Name
                        </label>
                        <AsyncSelect
                            placeholder='Select Customer Name'
                            defaultOptions
                            cacheOptions
                            id="customer-name"
                            loadOptions={loadOptions}
                            onChange={selectCustomer}
                            components={{ Menu: CustomSelectComponent }}
                        //   value={selectedOption}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-client-type" className="form-label" style={{ margin: '0px' }}>
                            Client
                        </label>
                        <Select
                            placeholder='Client Type'
                            id="basicDetails-client-type"
                            options={clientTypeOptions}
                            value={clientTypeOptions?.find(option => option.value === formData?.client)}
                            onChange={e => handleInputChange(e, 'client')}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-se_dsa-name">
                            SE/DSA Name
                        </label>
                        <input placeholder="SE/DSA Name" type='text' id='basicDetails-se_dsa-name' name='SE_DSA_Name' className="form-control"
                            value={formData?.SE_DSA_Name}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-Bank-name">
                            Bank Name
                        </label>
                        <input placeholder="Bank Name" type='text' id='basicDetails-Bank-name' name='Bank_Name' className="form-control"
                            value={formData?.Bank_Name}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="product-name" className="form-label" style={{ margin: '0px' }}>
                            Product Name
                        </label>
                        <Select
                            placeholder='Select Product Name'
                            id="product-name"
                            options={productOptions}
                            defaultValue={productOptions[0]}
                            components={{ Menu: CustomProductSelectComponent }}
                            onChange={e => handleInputChange(e, 'product_name_id')}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-loan-type" className="form-label" style={{ margin: '0px' }}>
                            Loan Type
                        </label>
                        <Select
                            placeholder='Loan Type'
                            id="basicDetails-loan-type"
                            options={loanTypeOptions}
                            value={loanTypeOptions?.find(option => option.value === formData?.Loan_Type)}
                            onChange={e => (handleInputChange(e, 'Loan_Type'))}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-rot">
                            Rate of Interest - %
                        </label>
                        <input placeholder="Rate of Interest" type='tel' maxLength={10} id='basicDetails-rot' name='Rate_of_Interest' className="form-control"
                            value={formData?.Rate_of_Interest}
                            onChange={e => handleInputChange(e, 'tel')}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-loan-acc-number">
                            Loan Account Number
                        </label>
                        <input placeholder="Loan Account Number" type='tel' maxLength={10} id='basicDetails-loan-acc-number' name='Loan_Number' className="form-control"
                            value={formData?.Loan_Number}
                            onChange={e => handleInputChange(e)}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-bank-acc-number">
                            Bank Account Number
                        </label>
                        <input placeholder="Bank Account Number" type='tel' maxLength={10} id='basicDetails-bank-acc-number' name='Bank_Number' className="form-control"
                            value={formData?.Bank_Number}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-loan-amount">
                            Loan Amount - ₹
                        </label>
                        <input placeholder="Loan Amount" type='tel' maxLength={10} id='basicDetails-loan-amount' name='Loan_amount' className="form-control"
                            value={formData?.Loan_amount}
                            onChange={e => (handleInputChange(e, 'tel'))}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="loan-disbursement">Loan Disbursement Date</label>
                        <input

                            placeholder="Loan Disbursement Date"
                            type="date"
                            id="personalDetails-dob"
                            name="Loan_Disbursement_Date"
                            className="form-control"
                            value={formData?.Loan_Disbursement_Date}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col xs={12} className='mt-2'>
                        <div className='d-flex justify-content-between mt-2'>
                            <div>
                                <button className="btn btn-primary" type="button">Cancel</button>
                            </div>
                            <div>
                                <button className="btn btn-primary ms-2" type="button" onClick={handleNext}>Next</button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* </form> */}
            </Container>
        </>
    )
}

export default ApplicantForm