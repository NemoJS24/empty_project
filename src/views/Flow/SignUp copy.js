import { Container, Row, Col } from "reactstrap"
import { useContext, useEffect, useState } from "react"
import { baseURL, postReq } from "../../assets/auth/jwtService"
import { setToken } from "../../assets/auth/auth"
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { selectPhoneList } from "../../Helper/data"
import Select from 'react-select'
import { validateEmail } from "../Validator"
import { Eye, EyeOff } from "react-feather"
import { PermissionProvider } from "../../Helper/Context"
import axios from "axios"

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const { setUserPermission, userPermission } = useContext(PermissionProvider)
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }
    const ConfirmPasswordVisibility = () => {
      setShowRePassword(!showRePassword)
    }

    const [showError, setShowError] = useState(false)
    const [checked, setChecked] = useState(false)
    const [data, setData] = useState({
        first_name: "",
        last_name: "",
        phone_code: "",
        phone_no: "",
        email: params.get('email'),
        isExist: false,
        password: "",
        confirm_password: "",
        app: params.get('app'),
        website: params.get('shop')
    })
    const navigate = useNavigate()

    const inputChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleCheckBox = (e) => {
        setChecked(e.target.checked)
    }

    const handleChange = (options, actionMeta, check) => {
        if (check) { 
            const option_list = options.map((cur) => {
                return cur.value
            })
            setOfferData({...offerData, [actionMeta.name]: option_list })
        } else {
            setData({...data, [actionMeta.name]: options.value })
        }
    
    }

    const submitButtonHandler = () => {
        if (data.first_name === "" || data.last_name === "" || data.phone_no === "" || data.email === "" || data.isExist || data.password === "" || data.confirm_password === "" || checked === false) {
            setShowError(true)
        } else {
            const emailCheck = validateEmail(data.email)
            if (!emailCheck) {
                toast.error("Invaild email ID")
            } else {
                setShowError(false)
                const formData = new FormData()
                Object.entries(data).map(([key, value]) => formData.append(key, value))
                formData.append("platform", params.get("platform"))
                console.log(formData)
                postReq("signup", formData)
                .then((res) => {
                    console.log(res.data)
                    const tokenValue = JSON.stringify(res.data)
                    setToken(tokenValue, params.get('app'))
                    setUserPermission({...userPermission, appName: params.get('app')})
                    if (res.status === 201) {
                        toast.success('Signed In')
                        navigate(`/processing/?app=${params.get('app')}&shop=${params.get('shop')}&email=${data.email}&platform=${params.get("platform")}`)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    toast.error("Something went wrong!")
                })

            }
        }
    }

    const checkPassword = (e) => {
        inputChangeHandler(e)
        if (e.target.value !== data.password) {
            document.getElementById('confirm_password').innerHTML = "Passwords don't match"
        } else {
            document.getElementById('confirm_password').innerHTML = ""
        }
    }


    const checkValidation = (e) => {
        const emailCheck = e.target.name === 'email' ? validateEmail(data.email) : true
        if (!emailCheck) {
            toast.error("Invaild email ID")
        } else {
            const form_data = new FormData()
            e.target.name === 'email' ? form_data.append('email', data.email) : form_data.append('website', data.website)
            // fetch('https://api.xircls.net/merchant/check_validation/', {
            //     method: 'POST',
            //     body: form_data
            // })
            axios.post(`${baseURL}/merchant/check_validation/`, form_data)
            .then(resp => {
                console.log(resp)
                if (resp.status === 400) {
                    toast.error(resp.message)
                    setData({...data, isExist: true})
                    setShowError(true)
                } else {
                    setData({...data, isExist: false})
                }
            })
            .catch((error) => {
                console.log(error)
                setData({...data, isExist: true})
                setShowError(true)
                toast.error(`${e.target.name === 'email' ? 'Email' : 'Website'} already exist`)
            })
        }
    }

    useEffect(() => {
        fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(resp => {
            console.log(resp)
            setData({...data, phone_code: `${resp.country_calling_code}`})
        })
        .catch((error) => {
            console.log(error)
        })

        // if (params.get('email')) {
        //     checkValidation
        // }

    }, [])

    return (
        <div className="products bg-white">
            <Container className="mt-5 mb-5">
                <Row>
                    <Col lg={6} className='m-auto' style={{width: '665px', maxWidth: '90%'}}>
                        <div className="border p-1 p-md-3">
                            <div>
                                <h3 className="third-font text-center font-three mb-2">Signup</h3>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mt-2 me-2">
                                        <label className="font-three form-label label" htmlFor="">First Name: *</label>
                                        <input type="text" className="w- form-input text-capitalize" name="first_name" placeholder="First Name" onChange={(e) => inputChangeHandler(e)} />
                                        {showError && data.first_name === "" ? (
                                            <p
                                            className="text-danger m-0 p-0"
                                            style={{ fontSize: "0.9rem" }}
                                            >
                                            Please enter your first name
                                            </p>
                                        ) : ''}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-2 mt-2 me-2">
                                        <label className="font-three form-label label" htmlFor="last_name">Last Name: *</label>
                                        <input type="text" className="w- form-input text-capitalize" name="last_name" placeholder="Last Name" onChange={(e) => inputChangeHandler(e)} />
                                        {showError && data.last_name === "" ? (
                                            <p
                                            className="text-danger m-0 p-0"
                                            style={{ fontSize: "0.9rem" }}
                                            >
                                            Please enter your last name
                                            </p>
                                        ) : ""}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-2 me-2">
                              <label className="font-three form-label label" htmlFor="last_name">Shop Name: *</label>
                              <input type="text" className="form-input" name="app" readOnly value={data?.website} onBlur={(e) => checkValidation(e)} disabled />
                            </div>
                            <div className="mb-2 mt-2 me-2">
                                <label className="font-three form-label label" htmlFor="">Email address: *</label>
                                <input type="text" className="w- form-input" name="email" placeholder="Email address" value={data?.email} onBlur={(e) => checkValidation(e)} onChange={(e) => inputChangeHandler(e)} />
                                {showError && data.email === "" ? (
                                    <p
                                    className="text-danger m-0 p-0"
                                    style={{ fontSize: "0.9rem" }}
                                    >
                                    Please enter your email ID
                                    </p>
                                ) : ""}
                                {showError && data.isExist ? (
                                    <p
                                    className="text-danger m-0 p-0"
                                    style={{ fontSize: "0.9rem" }}
                                    >
                                    Email already exist
                                    </p>
                                ) : ""}
                            </div>
                            <div className="mb-2 mt-2 me-2">
                                <label className="font-three form-label label" htmlFor="">Mobile Number: *</label>
                                <div className="row">
                                    <div className="col-md-3 mb-md-0 mb-2">
                                        <Select
                                            isMulti = {false}
                                            options={selectPhoneList}
                                            inputId="aria-example-input"
                                            closeMenuOnSelect={true}
                                            name="phone_code"
                                            onChange={(value, actionMeta) => handleChange(value, actionMeta, false)}
                                            value={data?.phone_code ? selectPhoneList.filter(option => data?.phone_code.includes(option.value)) : ""}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    fontSize: '12px',
                                                    margin: 0,
                                                    height: '100%'
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-9 mb-md-0 mb-2">
                                        <div className="w-100">
                                            <input type="text" className="w-100 form-input" name="phone_no" placeholder="Mobile Number" onChange={(e) => inputChangeHandler(e)} />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="d-flex jusify-content-center align-items-center">
                                    <div className="me-2">
                                        
                                        {/* <select
                                            name="phone_code"
                                            id="phone_code"
                                            className="w-100 form-input"
                                            onChange={(e) => inputChangeHandler(e)}
                                            >
                                        </select> 
                                    </div>
                                    
                                </div> */}
                                {showError && data.phone_no === "" ? (
                                    <p
                                    className="text-danger m-0 p-0"
                                    style={{ fontSize: "0.9rem" }}
                                    >
                                    Please enter your phone number
                                    </p>
                                ) : ""}

                            </div>
                            <div className="mb-2 mt-2 me-2">
                                <label className="font-three form-label label" htmlFor="">Choose Password: *</label>
                                <div className="input-group">
                                    <input type={showPassword ? "text" : "password"} className="w- form-input" name="password" placeholder="Choose Password" onChange={(e) => inputChangeHandler(e)} required aria-autocomplete="list"/>
                                    <div className="input-group-addon position-relative">
                                    {showPassword ? (
                                        <EyeOff
                                        size={15}
                                        className="feather-icon position-absolute top-50 end-50 translate-middle-y me-1 cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                        />
                                    ) : (
                                        <Eye
                                        size={15}
                                        className="feather-icon position-absolute top-50 end-50 translate-middle-y me-1 cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                        />
                                    )}
                                    </div>
                                </div>
                                {showError && data.password === "" ? (
                                    <p
                                    className="text-danger m-0 p-0"
                                    style={{ fontSize: "0.9rem" }}
                                    >
                                    Please enter your password
                                    </p>
                                ) : ""}
                            </div>
                            <div className="mb-2 mt-2 me-2">
                                <label className="font-three form-label label" htmlFor="">Re-enter Password: *</label>
                                <div className="input-group">
                                    <input type={showRePassword ? "text" : "password"} className="w- form-input" name="confirm_password" placeholder="Re-enter Password" onChange={(e) => checkPassword(e)} required aria-autocomplete="list" />
                                    <div className="input-group-addon position-relative">
                                        {showRePassword ? (
                                            <EyeOff
                                            size={15}
                                            className="feather-icon position-absolute top-50 end-50 translate-middle-y me-1 cursor-pointer"
                                            onClick={ConfirmPasswordVisibility}
                                            />
                                        ) : (
                                            <Eye
                                            size={15}
                                            className="feather-icon position-absolute top-50 end-50 translate-middle-y me-1 cursor-pointer"
                                            onClick={ConfirmPasswordVisibility}
                                            />
                                        )}
                                    </div>
                                </div>
                                {showError && data.confirm_password === "" ? (
                                    <p
                                    className="text-danger m-0 p-0 mb-1"
                                    style={{ fontSize: "0.9rem" }}
                                    >
                                    Please confirm your password
                                    </p>
                                ) : ""}
                                <p
                                id="confirm_password"
                                className="text-danger m-0 p-0 mb-1"
                                style={{ fontSize: "0.9rem" }}
                                ></p>
                            </div>
                            <div className="parent mb-3 mt-2">
                                <div className="me-2 d-flex align-items-center">
                                    <input id="privacy" type="checkbox" onClick={handleCheckBox} />
                                    <label htmlFor="privacy" className="cursor-pointer">
                                        <div className="ms-1 fw-bolder" style={{ textTransform: 'uppercase' }}>
                                            By signing up, you agree to XIRCLS' 
                                            <Link to="/terms-of-use/">
                                            <a href="" onClick={(e) => e.preventDefault} className="text-blue">  Terms of Use </a>
                                            </Link> 
                                            and 
                                            <Link to="/privacy-policy/">
                                            <a href="" onClick={(e) => e.preventDefault} className="text-blue">  Privacy Policy.</a> 
                                            </Link> 
                                            *
                                        </div>

                                    </label>
                                </div>
                                {showError && checked === false ? (
                                    <p
                                    className="text-danger m-0 p-0 mb-1"
                                    style={{ fontSize: "0.9rem" }}
                                    >
                                    Please check the terms and privacy policy
                                    </p>
                                ) : ''}
                            </div>                           
                            <div className="mb-3">
                                <button onClick={() => submitButtonHandler()} type="button" className="btn bg-black text-white me-1 form-btn">SIGNUP</button>
                            </div>
                            <div>
                                <h6 className="sixth-font font-size-sm">
                                Already a XIRCLS merchant? Login <Link to="/flow/login/" className="text-blue">here</Link>.
                                </h6>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SignUp