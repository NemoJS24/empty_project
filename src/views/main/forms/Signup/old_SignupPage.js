/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import { Col, Row, Container } from 'reactstrap'
import Footer from '@src/views/main/utilities/footer/Footer'
import { Link } from 'react-router-dom'
import { BsCheck, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { selectPhoneList } from '../../../../Helper/data'
import Select from 'react-select'
import axios from 'axios'
import { baseURL } from '../../../../assets/auth/jwtService'


export default function SignupPage() {
    const [ShowPass, setShowPass] = useState({
        pass: false,
        cpass: false
    })
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        website: '',
        email: '',
        phone_no: '',
        password: '',
        confirm_password: '',
        termsAndCondition: '',
        checkPassword: true,
        checkShop: true,
        checkEmail: true
    })

    const CustErrorMsg = {
        first_name: 'Please enter your first name',
        last_name: 'Please enter your last name',
        email: 'Please enter your email ID',
        phone_no: 'Please enter your phone number',
        password: 'Please enter your password',
        confirm_password: 'Please confirm your password',
        termsAndCondition: 'Please check the terms and privacy policy'
    }

    //   erors
    const [formErrors, setFormErrors] = useState({
        first_name: '',
        last_name: '',
        website: '',
        email: '',
        phone_no: '',
        password: '',
        confirm_password: '',
        termsAndCondition: '',
        uppercase: '',
        lowercase: '',
        number: '',
        specialChar: '',
        length: ''
    })

    // password error no pass chnage on;y
    const passValid = (value) => {
        const errors = {}
        let flag = false
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,18}$/
        if (!passwordPattern.test(value)) {
            errors.uppercase = !/(?=.*[A-Z])/.test(value) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one uppercase letter,</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one uppercase letter,</h6>
            errors.lowercase = !/(?=.*[a-z])/.test(value) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one lowercase letter, </h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one lowercase letter, </h6>
            errors.number = !/(?=.*\d)/.test(value) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one number,</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one number,</h6>
            errors.specialChar = !/(?=.*[@#$%^&+=!])/.test(value) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one special character</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one special character</h6>
            errors.length = (value.length < 8 || value.length > 18) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> password must be 8 to 18 characters long</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> password must be 8 to 18 characters long</h6>
            setFormErrors(errors)
            flag = false
            return false
        } else {

            errors.uppercase = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one uppercase letter,</h6>
            errors.lowercase = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one lowercase letter, </h6>
            errors.number = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one number,</h6>
            errors.specialChar = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one special character</h6>
            errors.length = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> password must be 8 to 18 characters long</h6>
            setFormErrors(errors)
            flag = true
            return true

        }
        return flag
    }

    //  handle emial is exist or not
    const isEmailExist = (name) => {
        let isExist = true
        const form_data = new FormData()
        form_data.append('email', formData.email)
        axios.post(`${baseURL}/merchant/check_validation/`, form_data)
            .then(resp => {
                console.log(resp)
                if (resp.status === 400) {
                    toast.error(resp.message)
                    // let updatedData
                    if (name === 'email') {
                        // document.getElementById('email_val').innerHTML = 'Email already exist'
                        // checkEmail = false
                        setFormErrors({ email: "Email already exist" })
                        setFormData({ ...formData, checkEmail: false })
                    } else {
                        document.getElementById('website_val').innerHTML = 'Shop already exist'
                        setFormErrors({ website: "Shop already exist" })
                        setFormData({ ...formData, checkShop: false })
                        // checkShop = false
                    }

                    // checkForm = false
                } else {
                    const updatedData = {
                        checkEmail: true,
                        checkShop: true
                    }
                    setFormData((preData) => ({
                        ...preData,
                        ...updatedData
                    }))
                    isExist = false
                    // checkEmail = true
                    // checkShop = true
                }
            })
            .catch((error) => {
                console.log(error)
                if (name === 'email') {
                    // document.getElementById('email_val').innerHTML = 'Email already exist'
                    setFormErrors({ email: "Email already exist" })
                    setFormData({ ...formData, checkEmail: false })
                } else {
                    // document.getElementById('website_val').innerHTML = 'Shop already exist'
                    setFormErrors({ website: "Shop already exist" })
                    setFormData({ ...formData, checkShop: false })
                }
                toast.error(`${name === 'email' ? 'Email' : 'Website'} already exist`)
            })
        console.log(formData)
        return isExist
    }

    //   input handle event
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
        if (name === 'password') {
            passValid(value)
        }
    }

    //  all form validation
    const validateForm = () => {
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        // const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,18}$/
        const errors = {}
        let isValid = true
        for (const key in formData) {
            if (key !== 'website' && !formData[key].trim()) {
                errors[key] = CustErrorMsg[key]
                isValid = false
            }


            // Email validation
            if (formData.email) {
                if (!emailPattern.test(formData.email)) {
                    errors.email = 'Invalid email address'
                    isValid = false
                }
                
            }
            // confirm password validatior
            if (formData.password) {
                passValid(formData.password)
            }
            if (formData.confirm_password) {
                if ((formData.password !== formData.confirm_password)) {
                    errors.confirm_password = 'Password does not match'
                    isValid = false
                }
            }

            if (!isValid) {
                console.log("break")
                break
            }
        }
        setFormErrors(errors)
        return isValid
    }

    //   from submit
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            // Submit the form data or perform any other action.
            console.log('Form data is valid:', formData)
            toast.success(() => <h6>success</h6>, {
                position: "top-center"
            })
        } else {
            console.log('Form data is invalid')
            toast.error(() => <h6>Form data is invalid</h6>, {
                position: "top-center"
            })
        }
    }


    return (
        <div className='' style={{ background: "#fff" }}>

            <Container fluid="sm" className='  ' >
                <Row className=' justify-content-center mt-lg-1 pt-lg-5 '>
                    <Col md="10" xl="8">
                        <form className='mt-2 p-3' >
                            <h1 className='display-3 main-heading text-center fw-bolder    ' >
                                Sign Up
                                {/* for Merchant Account */}
                            </h1>
                            <h4 className='text-center text-secondary '>For a New Merchant Account</h4>
                            <Row className=' px-0 px-md-5 mt-3 '>
                                <Col xs="12" md="6" className=''>
                                    <label className="fs-4 main-heading">First Name  </label>
                                    <input type="text" className="form-control form-control  fs-5 text-capitalize text-dark rounded-1" onChange={handleInputChange} placeholder="First Name" name="first_name" style={{ marginTop: "4px" }} />
                                    <span className="error text-danger ">{formErrors.first_name}</span>
                                </Col>
                                <Col xs="12" md="6" className='mt-1 mt-md-0'>
                                    <label className="fs-4 main-heading">Last Name  </label>
                                    <input type="text" className="form-control form-control  fs-5 text-capitalize text-dark rounded-1" onChange={handleInputChange} placeholder="Last Name" name="last_name" style={{ marginTop: "4px" }} />
                                    <span className="error text-danger ">{formErrors.last_name}</span>

                                </Col>

                                <Col xs="12" className='mt-2'>
                                    <label className="fs-4 main-heading">Store URL  </label>
                                    <input type="text" className="form-control form-control  fs-5 text-dark rounded-1" onChange={handleInputChange} placeholder="Store URL" name="website" style={{ marginTop: "4px" }} />
                                    <span className="error text-danger ">{formErrors.website}</span>

                                </Col>
                                <Col xs="12" className='mt-2'>
                                    <label className="fs-4 main-heading">Email Address  </label>
                                    <input type="text" className="form-control form-control  fs-5 text-dark rounded-1" onChange={handleInputChange} onBlur={(e) => isEmailExist(e.target.name)} placeholder="Email" name="email" style={{ marginTop: "4px" }} />
                                    <span className="error text-danger ">{formErrors.email}</span>

                                </Col>

                                {/* mobile  */}
                                <Col xs="12" className='mt-2'>
                                    <label className="fs-4 main-heading">Mobile Number</label>
                                    <div className='d-flex justify-content-center  align-items-start ' style={{ marginTop: "4px" }}>
                                        <Select
                                            isMulti={false}
                                            options={selectPhoneList}
                                            closeMenuOnSelect={true}
                                            name="phone_code"
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    fontSize: '12px',
                                                    width: "120px",
                                                    height: '100%'
                                                })
                                            }}
                                        />
                                        <input type="number" className={`form-control form-control fs-5 text-dark rounded-1`} style={{ marginLeft: "5px" }} onChange={handleInputChange} name="phone_no" placeholder="Mobile" />
                                    </div>
                                    <span className="error text-danger ">{formErrors.phone_no}</span>

                                </Col>

                                <Col xs="12" className='mt-2  position-relative '>
                                    <label className="fs-4 main-heading">Password  </label>
                                    <input type={ShowPass.pass ? 'text' : 'password'} className="form-control form-control  fs-5 text-dark rounded-1" id="signup_pass_input" onChange={handleInputChange} placeholder="Password" name="password" style={{ marginTop: "4px" }} autoComplete="new-password" />

                                    <h4 className='position-absolute  cursor-pointer' style={{ top: "38px", right: "30px", color: "#a9a9a9" }} onClick={() => setShowPass({ ...ShowPass, pass: !ShowPass.pass })} >{ShowPass.pass ? <BsEyeFill /> : <BsEyeSlashFill />}</h4>
                                    <div className='text-danger'> {formErrors.password}</div>
                                    <div className='d-flex flex-column user-select-none' >

                                        {formErrors.uppercase}
                                        {formErrors.lowercase}
                                        {formErrors.number}
                                        {formErrors.specialChar}
                                        {formErrors.length}
                                    </div>

                                </Col>
                                <Col xs="12" className='mt-2 mt-2 position-relative'>
                                    <label className="fs-4 main-heading">Confirm Password  </label>
                                    <input type={ShowPass.cpass ? 'text' : 'password'} className="form-control form-control  fs-5 text-dark rounded-1" onChange={handleInputChange} placeholder="Confirm Password" name="confirm_password" style={{ marginTop: "4px" }} autoComplete="new-password" />
                                    <h4 className='position-absolute  cursor-pointer' style={{ top: "38px", right: "30px", color: "#a9a9a9" }} onClick={() => setShowPass({ ...ShowPass, cpass: !ShowPass.cpass })} >{ShowPass.cpass ? <BsEyeFill /> : <BsEyeSlashFill />}</h4>

                                    <span className="error text-danger ">{formErrors.confirm_password}</span>
                                </Col>


                                <Col xs="12" className='mt-2'>

                                    <h5 className='text-black'> <input type="checkbox" name="termsAndCondition" id="" className='me-1' onChange={handleInputChange} /> BY SIGNING UP, YOU AGREE TO XIRCLS' TERMS OF USE AND PRIVACY POLICY.</h5>
                                    <span className="error text-danger ">{formErrors.termsAndCondition}</span>

                                </Col>
                            </Row>
                            <div className='text-center mt-3'>
                                <h4 className='btn  main-btn-black btn-lg fs-4 px-5 fw-lig' onClick={handleSubmit}> Signup</h4>
                            </div>
                            <div className='text-center'>
                                <Link to='/merchant/login' className='fs-4 '>Already a XIRCLS merchant?<span className='text-primary'> Login here.</span></Link>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
            <hr className='mt-5' />
            <Footer />

        </div>
    )

}
