import React, { useState } from 'react'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import { Col, Container, Row } from 'reactstrap'
import Footer from '@src/views/main/utilities/footer/Footer'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: ''
    })

    //   erors
    const [formErrors, setFormErrors] = useState({
        email: ''
    })

    //   change event
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    //   form validation
    const validateForm = () => {
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        const errors = {}
        let isValid = true
        for (const key in formData) {
            if (!formData[key].trim()) {
                errors[key] = 'This field is required'
                isValid = false
            }
            if (!isValid) {
                break
            }
        }
        // Email validation
        if (formData.email) {
            if (!emailPattern.test(formData.email)) {
                errors.email = 'Invalid email address'
                isValid = false
            }
        }
        setFormErrors(errors)
        return isValid
    }
  // make a toast
  const makeToast = (type, msg) => {
    if (type === 'success') {
        toast.success(() => <h6>{msg}</h6>, {
            position: "top-center"
        })
    }    else {
        toast.error(() => <h6>{msg}</h6>, {
            position: "top-center"
        })
    }

}
    //   from sub,mit
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            // Submit the form data or perform any other action.
            makeToast('success', 'Please check your inbox')

            console.log('Form data is valid:', formData)
        } else {
            console.log('Form data is invalid')
            makeToast('error', 'User not found')

        }
    }

  
    return (
        <div className='login_cont' style={{ background: "#fff" }}>

                {/* <Navbar /> */}
                <Container fluid="sm" className='  ' >
                    <Row className=' justify-content-center mt-lg-1 pt-lg-5 '>
                        <Col md="10" xl="8">
                            <form className='mt-2  rounded-2  p-3 ' >
                                <h1 className='display-3 main-heading text-center fw-bolder    ' >
                                    Reset Password
                                </h1>
                                <Row className=' px-0 px-md-5 mt-1 '>

                                    <Col xs="12" className='mt-2'>
                                        <label className="fs-4 main-heading">Enter Email Address  </label>
                                        <input type="text" className={`form-control form-control  fs-5 text-dark rounded-1  `} onChange={handleInputChange} placeholder="Email" name="email" style={{ marginTop: "4px" }} />
                                        <span className="error text-danger ">{formErrors.email}</span>

                                    </Col>
                                    <Col xs="12" className='mt-2'>
                                        <h5 className='text-dark'>Enter the email address you used to sign up to receive a password reset link
                                            in your inbox.<br /> Click on the link and follow instructions to reset your password in a flash!</h5>

                                    </Col>
                                </Row>

                                <div className='text-center mt-1'>
                                    <h4 className='btn  main-btn-black btn-lg fs-4 px-5' onClick={handleSubmit}> Send Email</h4>
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
