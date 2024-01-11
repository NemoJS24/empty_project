import React, { useState } from 'react'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import { Col, Row, Container } from 'reactstrap'
import Footer from '@src/views/main/utilities/footer/Footer'
import { Link } from 'react-router-dom'
import { BsCheck, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { selectPhoneList } from '../../../../Helper/data'
import Select from 'react-select'


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
        termsAndCondition: ''
    })

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

    // cutome error msg
    const CustErrorMsg = {
        first_name: 'Please enter your first name',
        last_name: 'Please enter your last name',
        email: 'Please enter your email ID',
        phone_no: 'Please enter your phone number',
        password: 'Please enter your password',
        confirm_password: 'Please confirm your password',
        termsAndCondition: 'Please check the terms and privacy policy'
    }

    // password error

    const passValid = (value) => {
        const errors = {}
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,18}$/
        if (!passwordPattern.test(value)) {
            errors.uppercase = !/(?=.*[A-Z])/.test(value) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one uppercase letter,</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one uppercase letter,</h6>
            errors.lowercase = !/(?=.*[a-z])/.test(value) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one lowercase letter, </h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one lowercase letter, </h6>
            errors.number = !/(?=.*\d)/.test(value) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one number,</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one number,</h6>
            errors.specialChar = !/(?=.*[@#$%^&+=!])/.test(value) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one special character</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one special character</h6>
            errors.length = (value.length < 8 || value.length > 18) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> password must be 8 to 18 characters long</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> password must be 8 to 18 characters long</h6>
            setFormErrors(errors)
            return false
        } else {

            errors.uppercase = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one uppercase letter,</h6>
            errors.lowercase = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one lowercase letter, </h6>
            errors.number = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one number,</h6>
            errors.specialChar = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one special character</h6>
            errors.length = <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> password must be 8 to 18 characters long</h6>
            setFormErrors(errors)
            return true

        }
    }


    //   change event
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

    //   form validation
    const validateForm = () => {
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,18}$/
        const errors = {}
        let isValid = true
        for (const key in formData) {
            if (!formData[key].trim()) {
                errors[key] = 'This field is required'
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
                if (!passwordPattern.test(formData.password)) {
                    errors.uppercase = !/(?=.*[A-Z])/.test(formData.password) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one uppercase letter,</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one uppercase letter,</h6>
                    errors.lowercase = !/(?=.*[a-z])/.test(formData.password) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one lowercase letter, </h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one lowercase letter, </h6>
                    errors.number = !/(?=.*\d)/.test(formData.password) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one number,</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one number,</h6>
                    errors.specialChar = !/(?=.*[@#$%^&+=!])/.test(formData.password) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one special character</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> one special character</h6>
                    errors.length = (formData.password.length < 8 || formData.password.length > 18) ? <h6 className='text-secondary m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> password must be 8 to 18 characters long</h6> : <h6 className='text-success m-0 p-0 d-flex justify-content-start  align-items-center '><BsCheck /> password must be 8 to 18 characters long</h6>
                    setFormErrors(errors)
                    return false
                }
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

    //   from sub,mit
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
        }
    }


    return (
        <div className='' style={{ background: "#fff" }}>

            {/* <Navbar /> */}
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
                                    <input type="text" className="form-control form-control  fs-5 text-dark rounded-1" onChange={handleInputChange} placeholder="Email" name="email" style={{ marginTop: "4px" }} />
                                    <span className="error text-danger ">{formErrors.email}</span>

                                </Col>

                                {/* mobile  */}
                                <Col xs="12" className='mt-2'>
                                    <label className="fs-4 main-heading">Mobile Number</label>
                                    <div className='d-flex justify-content-center  align-items-start ' style={{ marginTop: "4px" }}>
                                        {/* <select className="form-select  fs-5 mt-0 ms-0 text-dark rounded-1" aria-label="Default select example" style={{ width: "120px" }} defaultValue={91}>
                                                <option value={91}>+ 91</option>
                                                <option value="1">+ 1</option>
                                                <option value="2">+ 44</option>
                                                <option value="3">+ 92</option>
                                            </select> */}
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
