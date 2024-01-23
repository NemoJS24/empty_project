import Footer from '@src/views/main/utilities/footer/Footer'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import CalendarComponent from './calendar/CalendarComponent'

export default function ContactUs() {

  const type = useParams().type
  useEffect(() => {
    const myElement = document.getElementById('calender_comp')

    if (type === "superleadz") {
      myElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }

  }, [])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  })

  //   erors
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
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
      // Email validation
      if (formData.email) {
        if (!emailPattern.test(formData.email)) {
          errors.email = 'Invalid email address'
          isValid = false
        }
      }
      if (!isValid) {
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
      toast.success(() => <h6>success</h6>, {
        position: "top-center"
      })
    } else {
      console.log('Form data is invalid')
    }
  }

  return (
    <div style={{ background: "#fff" }}>


      {/* <Navbar /> */}
      {/* Section 1 */}
      <Container fluid='sm'>
        <div className='text-center mt240'>
          <h1 className='display-1 main-heading fw-bolder m-0  ' >
            Contact Us
          </h1>
          <h1 className=' text-center text-black   px-3 mt-1' >Understand how XIRCLS can help your business.</h1>
        </div>

        {/* from */}

        <Row className='justify-content-center  text-black '>
          <Col xs="10" md="10" lg="8" xl="7" className=' rounded-2'>
            <form className='mt-2'>
              <Row className='px-0 px-md-5'>
                <Col md="5">
                  <label className="fs-4">Name</label>
                  <input type="text" className={`form-control text-capitalize  form-control-sm fs-4 text-dark rounded-1  `} onChange={handleInputChange} name="name" placeholder="Name" style={{ marginTop: "4px" }} />
                  <div id="" className="invalid-feedback">
                    Please enter your name
                  </div>
                  <span className="error text-danger ">{formErrors.name}</span>

                </Col>
                <Col md="7" className='ms-0 px-1 px-md-1 mt-md-0 mt-1'>
                  <label className="fs-4">Phone</label>
                  <div className='d-flex justify-content-center  align-items-start ' style={{ marginTop: "4px" }}>
                    <select className="form-select form-select-sm fs-4 mt-0 ms-0 text-dark rounded-1" aria-label="Default select example" style={{ width: "120px" }}>
                      <option selected>+ 91</option>
                      <option value="1">+ 1</option>
                      <option value="2">+ 44</option>
                      <option value="3">+ 92</option>
                    </select>
                    <input type="number" className={`form-control form-control-sm fs-4 text-dark rounded-1  `} onChange={handleInputChange} name="phone" placeholder="Phone" style={{ marginLeft: "5px" }} />
                  </div>
                  <span className="error text-danger ">{formErrors.phone}</span>

                </Col>
                <Col xs="12" className='mt-1'>
                  <label className="fs-4">Email </label>
                  <input type="text" className={`form-control form-control-sm fs-4 text-dark rounded-1  `} onChange={handleInputChange} placeholder="Email" name="email" style={{ marginTop: "4px" }} />
                  <span className="error text-danger ">{formErrors.email}</span>
                </Col>
                <Col xs="12" className='mt-2'>
                  <label className="fs-4">Subject </label>
                  <input type="text" className={`form-control form-control-sm fs-4 text-dark rounded-1 `} onChange={handleInputChange} placeholder="Subject" name="subject" style={{ marginTop: "4px" }} />
                  <span className="error text-danger ">{formErrors.subject}</span>
                </Col>
                <Col xs="12" className='mt-2'>
                  <label for="exampleFormControlTextarea1" className="fs-4">Message </label>
                  <textarea className={`form-control form-control-sm fs-4 text-dark rounded-1 `} onChange={handleInputChange} rows="3" name="message" placeholder="Message" style={{ marginTop: "4px" }}></textarea>
                  <span className="error text-danger ">{formErrors.message}</span>
                </Col>
              </Row>
              <div className='text-center mt-4'>
                <h4 className='btn btn-lg main-btn-dark fs-3 fw-lig' onClick={handleSubmit}> Send Message</h4>
              </div>
            </form>
          </Col>
        </Row>


        <div id="calender_comp"></div>
        {/* calender */}
        <div className="mt100 ">
          {/* <CalendarComponent /> */}
        </div>

      </Container>


      {/* banner */}
      <div className='text-center py-5 mt150' style={{ background: "#000" }} >
        <Container fluid='sm'>

          <h1 className='display-6  text-white'> Reach us at :</h1>
          <h2 className=' text-white m-0'> info@xircls.com</h2>
          <h2 className=' text-white m-0'>+91 9969-333-666  </h2>

        </Container>
      </div>

      <Footer />

    </div>
  )
}
