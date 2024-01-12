// /* eslint-disable no-unused-vars */
// /* eslint-disable prefer-const */
import React, { useContext, useState } from 'react'
// import Navbar from '@src/views/main/utilities/navbar/Navbar'
import { Col, Container, Row } from 'reactstrap'
import Footer from '@src/views/main/utilities/footer/Footer'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { setToken } from '../../../../assets/auth/auth'
import { postReq } from '../../../../assets/auth/jwtService'
import countries from '../../../NewFrontBase/Country'
import { PermissionProvider } from '../../../../Helper/Context'
// import $ from "jquery"
import FrontBaseLoader from '../../../Components/Loader/Loader'

export default function LoginPage() {
    // const { pathname } = useLocation()
    const navigate = useNavigate()
    const { setUserPermission, userPermission } = useContext(PermissionProvider)
    const [apiLoader, setApiLoader] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    console.log("getUserPermission", userPermission)
    //   erors
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: ''
    })

    //   change event
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    // make toast

    //   form validation
    const validateForm = () => {
        if (!formData.email) {
            setFormErrors({ email: "Please enter your email ID" })
            return false
        }
        if (!formData.password) {
            setFormErrors({ password: "Please enter your password" })
            return false
        }
        setFormErrors({})
        return true
    }

    // make a toast

    //   from sub,mit
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            // toast.success('form is valid')
            setApiLoader(true)

            const newformData = new FormData()
            Object.entries(formData).map(([key, value]) => newformData.append(key, value))
            postReq("login", newformData)
                .then((res) => {
                    console.log(res)
                    setApiLoader(false)
                    if (res?.data?.errors === "Email not verified yet") {
                        toast.error("Email not verified yet. Please check your inbox")
                    } else {

                        const tokenValue = JSON.stringify(res?.data?.token)
                        const merchantCurrency = countries.filter((curElem) => curElem?.currency?.code === res?.data?.outlet_list[0]?.outlet_currency)
                        setToken(tokenValue)
                        const updatedPermission = {
                            appName: "",
                            multipleDomain: res?.data?.outlet_list ? res?.data?.outlet_list : [],
                            apiKey: res?.data?.outlet_list ? res?.data?.outlet_list[0].api_key : "",
                            installedApps: res?.data?.installed_apps,
                            campagin: res?.data?.status,
                            currencySymbol: merchantCurrency[0]?.currency?.symbol ? merchantCurrency[0]?.currency?.symbol : '₹'
                        }
                        setUserPermission((curData) => ({
                            ...curData,
                            ...updatedPermission
                        }))

                        toast.success('Logged In Successfully')
                        navigate("/merchant/apps/")

                    }
                })
                .catch((err) => {
                    toast.error('Invaild email or password')
                    setApiLoader(false)
                    console.log(err)
                })
            // Submit the form data or perform any other action.
            console.log('Form data is valid:', formData)
        } else {
            console.log('Form data is invalid')
            // toast.error('form is not valid')

        }
    }


    return (
        <div className='login_cont' style={{ background: "#fff" }}>
            {
                apiLoader ? <FrontBaseLoader /> : ''
            }
            {/* <Navbar /> */}
            <Container fluid="sm" className=' login_cont+ ' >
                <Row className=' justify-content-center mt-lg-1 pt-lg-5 '>
                    <Col md="10" xl="8">
                        <form className='mt-2  rounded-2  p-3 ' >
                            <h1 className='display-3 main-heading text-center fw-bolder    ' >
                                Login
                                {/* for Merchant Account */}
                            </h1>
                            <h4 className='text-center text-secondary '>To Your Account</h4>
                            <Row className=' px-0 px-md-5 mt-1 '>

                                <Col xs="12" className='mt-2'>
                                    <label className="fs-4 main-heading">Email Address  </label>
                                    <input type="text" className={`form-control form-control  fs-5 text-dark rounded-1  `} onChange={handleInputChange} placeholder="Email" name="email" style={{ marginTop: "4px" }} />
                                    <span className="error text-danger ">{formErrors.email}</span>

                                </Col>

                                <Col xs="12" className='mt-2'>
                                    <label className="fs-4 main-heading">Password  </label>
                                    <input type="password" className={`form-control form-control  fs-5 text-dark rounded-1  `} onChange={handleInputChange} placeholder="Password" name="password" style={{ marginTop: "4px" }} />
                                    <span className="error text-danger ">{formErrors.password}</span>
                                </Col>
                                <div className='mt-1'>
                                    <Link to='/merchant/password_reset' className='text-dark  fs-5'>Forgotten Password?</Link>
                                </div>
                            </Row>

                            <div className='text-center mt-1'>
                                <h4 className='btn  main-btn-black btn-lg fs-4 px-5 fw-lig' onClick={handleSubmit}> Login</h4>
                            </div>
                            <div className='text-center'>
                                <Link to='/merchant/signup' className='fs-4 '>New to XIRCLS? <span className='text-primary'> Signup here.</span></Link>
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
