import React, { useEffect, useState } from "react"
import { Container, Card, CardBody, Row, Col, Label } from "reactstrap"
import { Twitter, Facebook, Instagram } from "react-feather"
import Select from "react-select"
import toast from "react-hot-toast"
import { getReq, postReq } from "../../../../assets/auth/jwtService"
import Offcanvas from 'react-bootstrap/Offcanvas'
import { validForm, validateEmail } from "../../../Validator"

/* eslint-disable */
const CustomerBasicCompanyInfo = ({ allData, setFilteredData, filteredData }) => {
  const [companyData, getCompanyData] = useState([])
  const [country, setCountry] = useState([])
  const [newCompany, setNewCompany] = useState({
    company_name: "",
    company_phone: "",
    company_email: "",
    industry: "",
    company_gst: "",
    company_pancard: "",
    company_website: "",
    address_line1: "",
    street: "",
    area_building: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    par_company_name: "",
    par_industry: "",
    par_company_gst: "",
    par_company_pancard: "",
    par_company_phone: "",
    par_company_email: "",
    par_company_website: "",
    par_address_line1: "",
    par_street: "",
    par_area_building: "",
    par_landmark: "",
    par_city: "",
    par_state: "",
    par_pincode: "",
    mark_parent: "0"
  })
  const [newCompanyPage, setNewCompanyPage] = useState(1)

  const { formData, handleInputChange } = allData

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  
  // console.log('filteredData', filteredData)
  // console.log('newCompany', newCompany)

  const fetchCompanyData = async () => {
    getReq('get_company_details')
      .then((res) => {
        console.log(res)
        getCompanyData(res.data.success)
        // setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        // setIsLoading(false)
      })
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

  const postData = () => {
    // const url = new URL(`${crmURL}/customers/merchant/add_company_details/`)
    const form_data = new FormData()
    form_data.append('add_company_from_add', 'yes')
    Object.entries(newCompany).map(([key, value]) => {
      form_data.append(key, value)
      // form_data.append("press_btn", 'SAVE')
    })

    postReq("add_company_details", form_data)
      .then((resp) => {
        console.log({ resp })
        fetchCompanyData()
        if (resp.status === 409) {
          throw new Error('Customer already exists')
        } else {
          throw new Error(`HTTP error! Status: ${resp.status}`)
        }
      })
      .catch((error) => {
        console.error("Error:", error)

        // Display toast for 409 status code
        if (error.message === 'Customer already exists') {
          toast.error('Customer already exists')
        }
      })
  }

  const valueToCheck5 = [
    {
      name: 'company_name',
      message: 'Please enter your Company Name',
      type: 'string',
      id: 'basicDetails-name'
    },
    {
      name: 'company_phone',
      message: 'Please enter your Company Phone Number',
      type: 'number',
      id: 'basicDetails-phone'
    },
    {
      name: 'company_email',
      message: 'Please enter your Company Email',
      type: 'string',
      id: 'basicDetails-email'
    }
  ]

  useEffect(() => {
    fetchCompanyData()
    getCountries()
  }, [])

  const handleInputChange2 = (e, id, select) => {
    let { name, value, type, checked } = e.target
    console.log(id, name, value)

    if (name === "company_phone") {
      value = value.replace(/[^0-9]/g, "")
    }
    if (id === "new-company") {
      if (select) {
        setNewCompany((prev) => ({
          ...prev,
          [select]: e.value
        }))
      }
      else {
        setNewCompany((prev) => ({
          ...prev,
          [name]: value
        }))
      }
    } else {
      setFilteredData((prevForms) => {
        return prevForms.map((form) =>
          form.id === id
            ? { ...form, [name]: value }
            : form.formId == id
              ? { ...form, [name]: value }
              : form
        )
      })
    }
  }
  
  const handleSubmitSection3 = (event) => {
    event.preventDefault()
    let checkForm = false
    checkForm = validForm(valueToCheck5, newCompany)
    console.log({ checkForm, valueToCheck5, newCompany })
    if (checkForm) {
      const emailCheck = validateEmail(newCompany.company_email)
      if (!emailCheck) {
        // document.getElementById('email_val').innerHTML = 'Invaild email ID'
        toast.error("Invaild email ID")
      } else {
        postData()
      }
    }
  }

  let options = []
  companyData.forEach((item) => {
    // console.log(item, "items")
    if (item.id === "") {
      return
    }
    options.push({
      value: item.id,
      label: item.company_name
    })
  })

  const selectCompany = (e, id, i) => {
    const foundObject = companyData.find(
      (item) => item.id === e.value
    )

    console.log(foundObject, id, "foundObject")
    // console.log("Found:", foundObject.id)
    handleInputChange(foundObject, 'company', i)
    if (foundObject) {
      setFilteredData((prevForms) => prevForms.map((form) => form.id === id ? foundObject : form.formId == id ? foundObject : form))
    } else {
      console.log("Company not found")
    }
  }

  // useEffect(() => {
  //   if (id) {
  //     filteredData?.map((curElem, i) => {
  //       selectCompany({value: curElem?.id}, curElem?.id, i)
  //     })
  //   }
  // }, [])

  const selectCountry = (e, id) => {
    if (id === "new-company") {
      setNewCompany((prev) => ({
        ...prev,
        country: e.label
      }))
    } else {
      setFilteredData((prevForms) => {
        return prevForms.map((form) =>
          form.id === id
            ? { ...form, country: e.label }
            : form.formId == id
              ? { ...form, country: e.label }
              : form
        )
      })
    }
  }

  const addCompany = () => {
    const newId = filteredData.length + 1
    setFilteredData((prevForms) => [...prevForms, { formId: newId }])
  }

  const CustomSelectComponent = ({ innerProps, children }) => (
    <div {...innerProps} className="position-absolute w-100 bg-white border">
      <p className="m-1">
        <a
          onClick={handleShow}
          className="link-success link-underline-opacity-0 "
        >
          Add new company
        </a>
      </p>
      {children}
    </div>
  )

  const handleSubmitNewCompany = (e) => {
    e.preventDefault()
    console.log(newCompany)
  }

  const relationOptions = [
    { value: 'Business', label: 'Client' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Dealer', label: 'Dealer' },
    { value: 'Distributor', label: 'Distributor' },
    { value: 'Manufacturer', label: 'Manufacturer' },
    { value: 'Vendor', label: 'Vendor' },
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
      .offcanvas{
        --bs-offcanvas-width: 40%;
      }
      `}
    </style>
  )

  const CompanyForm = (
    <>
      {filteredData.map((form, i) => (
        <div key={i}>
          <>
            <Row>
              <Col md={12} className='d-flex justify-content-between align-items-end'>
                <h4 className="mb-0">Subsidiary Company Details {i + 1}</h4>
                {filteredData.length > 1 && <span className="cursor-pointer" onClick={() => deleteCompany(i)}><RiDeleteBin5Fill color="red" size={20} /></span>}
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-name">Name</Label>
                <Select
                  options={callOptions()}
                  closeMenuOnSelect={true}
                  components={{ Menu: CustomSelectComponent }}
                  placeholder="Select Company"
                  onChange={(e) => selectCompany(e, form.id ?? form.formId, i)}
                  value={options?.find(option => option.value === (form.id ?? form.formId))}
                // value={options?.find((curElem) => Number(curElem?.value) === Number(userData?.id))}
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-1-phone">Company Phone</Label>
                <Input
                  placeholder="Company Phone"
                  type="tel"
                  maxLength={10}
                  id="company-1-phone"
                  name="company_phone"
                  className="form-control"
                  value={form.company_phone ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-email">Company Email</Label>
                <Input
                  placeholder="Company Email"
                  type="text"
                  id="company-email"
                  name="company_email"
                  className="form-control"
                  value={form.company_email ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-website">Company Website</Label>
                <Input
                  placeholder="Company Website"
                  type="text"
                  id="company-website"
                  name="company_website"
                  className="form-control"
                  value={form.company_website ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="address-2-relation">Relation</Label>
                <Select
                  placeholder="Select Customer Type"
                  id="address-2-relation"
                  options={relationOptions}
                  closeMenuOnSelect={true}
                  value={relationOptions?.find(option => option.value === form?.type)}
                  // defaultValue={relationOptions?.find(option => option.value === 'business')}
                  name="type"
                  onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
                  isDisabled={isEdit}
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="address-2-platform">Platform</Label>
                <Select
                  placeholder="Select Platform"
                  id="address-2-platform"
                  options={platformOptions}
                  closeMenuOnSelect={true}
                  value={platformOptions?.find(option => option.value === form?.campany_platform)}
                  name='company_platform'
                  onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
                  isDisabled={isEdit}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mt-1">
                <div className="d-flex justify-content-between ">
                  <h4 className="mb-0">Address</h4>
                </div>
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-name">
                  Flat and/or Building/House Details
                </Label>
                <Input
                  placeholder="Flat and/or Building/House Details"
                  type="text"
                  id="company-name"
                  name="address_line1"
                  className="form-control"
                  value={form.address_line1 ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-industry">Street, Lane or Road</Label>
                <Input
                  placeholder="Street, Lane or Road"
                  type="text"
                  id="company-industry"
                  name="street"
                  className="form-control"
                  value={form.street ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-area">
                  Enter Area, Locality or Suburb
                </Label>
                <Input
                  placeholder="Enter Area, Locality or Suburb"
                  type="text"
                  id="company-area"
                  name="area_building"
                  className="form-control"
                  value={form.area_building ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-landmark">Landmark</Label>
                <Input
                  placeholder="Landmark"
                  type="text"
                  id="company-landmark"
                  name="landmark"
                  className="form-control"
                  value={form.landmark ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-city">City</Label>
                <Input
                  placeholder="City"
                  type="text"
                  id="company-city"
                  name="city"
                  className="form-control"
                  value={form.city ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-state">State</Label>
                <Input
                  placeholder="State"
                  type="text"
                  id="company-state"
                  name="state"
                  className="form-control"
                  value={form.state ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="company-pincard">Pincode</Label>
                <Input
                  placeholder="Pincode"
                  type="text"
                  id="company-pincard"
                  name="pincode"
                  className="form-control"
                  value={form.pincode ?? ""}
                  // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </Col>
              <Col md={6} lg={4} className="mt-1">
                <Label htmlFor="address-2-country">Country</Label>
                <Select
                  isMulti={false}
                  // options={country}
                  inputId="address-2-country"
                  closeMenuOnSelect={true}
                  name="country"
                  placeholder="Select Country"
                  // onChange={(e) => selectCountry(e, form.id ?? form.formId)}
                  isDisabled={true}
                  value={[{ label: form.country, value: form.country }]}
                // value={form.country}
                // value={country.find((item) => String(form?.country) === String(item.value))}
                // value={country.filter(option => String(data?.country) === String(option.value))}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mt-2">
                <h4 className="mb-0">Social Presence</h4>
              </Col>
              <Col md={6} lg={3} className="mt-1">
                <Label htmlFor="personalDetails-twitter">Twitter</Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <Twitter size={18} />
                  </span>
                  <Input
                    type="text"
                    id="personalDetails-twitter"
                    className="form-control social_input"
                    aria-label=""
                    name="company_twitter"
                    value={form.company_twitter ?? "None"}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </div>
              </Col>
              <Col md={6} lg={3} className="mt-0 mt-md-1">
                <Label htmlFor="personalDetails-facebook">Facebook</Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <Facebook size={18} />
                  </span>
                  <Input
                    type="text"
                    id="personalDetails-facebook"
                    className="form-control social_input"
                    aria-label=""
                    name="company_fb"
                    value={form.company_fb ?? "None"}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </div>
              </Col>
              <Col md={6} lg={3} className="mt-0 mt-lg-1">
                <Label htmlFor="personalDetails-instagram">Instagram</Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <Instagram size={18} />
                  </span>
                  <Input
                    type="text"
                    id="personalDetails-instagram"
                    className="form-control"
                    aria-label=""
                    name="company_insta"
                    value={form.company_insta ?? "None"}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </div>
              </Col>
              <Col md={6} lg={3} className="mt-0 mt-lg-1">
                <Label htmlFor="linkedin1">
                  Linkedin
                </Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <Linkedin size='18px' />
                  </span>
                  <Input
                    id='linkedin1'
                    type='text'
                    className="form-control social_input"
                    name='company_linkedIn'
                    value={form.company_linkedIn ?? "None"}
                    disabled
                  />
                </div>
              </Col>
            </Row>
          </>
          <hr />
          <>
            {form.parent_id && <>
              <Row>
                <Col md={12} className="mt-2">
                  <h4 className="mb-0">Parent Company Details</h4>
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label
                    htmlFor="company-name"
                    style={{ margin: "0px" }}>
                    Name
                  </Label>
                  <Select
                    options={options}
                    closeMenuOnSelect={true}
                    // components={{ Menu: CustomSelectComponent }}
                    value={{ label: form.parent_id.company_name, value: form.parent_id.company_name }}
                    placeholder="Select company Name"
                    // onChange={(e) => selectCompany(e, form.id ?? form.formId)}
                    isDisabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-industry">Industry</Label>
                  <Input
                    placeholder="Industry"
                    type="text"
                    id="company-industry"
                    name="industry"
                    className="form-control"
                    value={form.parent_id.industry ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                {/* <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-gst-no">GST Number</Label>
                  <Input
                    placeholder="GST Number"
                    type="text"
                    id="company-gst-no"
                    name="gst"
                    className="form-control"
                    value={form.parent_id.gst ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-pancard">Company Pan Card Number</Label>
                  <Input
                    placeholder="Company Pan Card Number"
                    type="text"
                    id="company-pancard"
                    name="company_panCard"
                    className="form-control"
                    value={form.parent_id.company_panCard ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col> */}
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-1-phone">Company Phone</Label>
                  <Input
                    placeholder="Company Phone"
                    type="tel"
                    maxLength={10}
                    id="company-1-phone"
                    name="company_phone"
                    className="form-control"
                    value={form.parent_id.company_phone ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input
                    placeholder="Company Email"
                    type="text"
                    id="company-email"
                    name="company_email"
                    className="form-control"
                    value={form.parent_id.company_email ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-website">Company Website</Label>
                  <Input
                    placeholder="Company Website"
                    type="text"
                    id="company-website"
                    name="company_website"
                    className="form-control"
                    value={form.parent_id.company_website ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12} className="mt-1">
                  <div className="d-flex justify-content-between ">
                    <h4 className="mb-0">Address</h4>
                  </div>
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-name">
                    Flat and/or Building/House Details
                  </Label>
                  <Input
                    placeholder="Flat and/or Building/House Details"
                    type="text"
                    id="company-name"
                    name="address_line1"
                    className="form-control"
                    value={form.parent_id.address_line1 ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-industry">Street, Lane or Road</Label>
                  <Input
                    placeholder="Street, Lane or Road"
                    type="text"
                    id="company-industry"
                    name="street"
                    className="form-control"
                    value={form.parent_id.street ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-area">
                    Enter Area, Locality or Suburb
                  </Label>
                  <Input
                    placeholder="Enter Area, Locality or Suburb"
                    type="text"
                    id="company-area"
                    name="area_building"
                    className="form-control"
                    value={form.parent_id.area_building ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-landmark">Landmark</Label>
                  <Input
                    placeholder="Landmark"
                    type="text"
                    id="company-landmark"
                    name="landmark"
                    className="form-control"
                    value={form.parent_id.landmark ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-city">City</Label>
                  <Input
                    placeholder="City"
                    type="text"
                    id="company-city"
                    name="city"
                    className="form-control"
                    value={form.parent_id.city ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-state">State</Label>
                  <Input
                    placeholder="State"
                    type="text"
                    id="company-state"
                    name="state"
                    className="form-control"
                    value={form.parent_id.state ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="company-pincard">Pincode</Label>
                  <Input
                    placeholder="Pincode"
                    type="text"
                    id="company-pincard"
                    name="pincode"
                    className="form-control"
                    value={form.parent_id.pincode ?? ""}
                    // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                    disabled
                  />
                </Col>
                <Col md={6} lg={4} className="mt-1">
                  <Label htmlFor="address-2-country">Country</Label>
                  <Select
                    // options={country}
                    inputId="address-2-country"
                    closeMenuOnSelect={true}
                    name="country"
                    placeholder="Select Country"
                    // onChange={(e) => selectCountry(e, form.id ?? form.formId)}
                    isDisabled={true}
                    value={{ label: form.country, value: form.country }}
                  // value={form.parent_id.country}
                  // value={country.find((item) => String(form?.country) === String(item.value))}
                  // value={country.filter(option => String(data?.country) === String(option.value))}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12} className="mt-2">
                  <h4 className="mb-0">Social Presence</h4>
                </Col>
                <Col md={6} lg={3} className="mt-1">
                  <Label htmlFor="personalDetails-twitter">Twitter</Label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <Twitter size={18} />
                    </span>
                    <Input
                      type="text"
                      id="personalDetails-twitter"
                      className="form-control social_input"
                      aria-label=""
                      name="company_twitter"
                      value={form.parent_id.company_twitter ?? "None"}
                      // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6} lg={3} className="mt-0 mt-md-1">
                  <Label htmlFor="personalDetails-facebook">Facebook</Label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <Facebook size={18} />
                    </span>
                    <Input
                      type="text"
                      id="personalDetails-facebook"
                      className="form-control social_input"
                      aria-label=""
                      name="company_fb"
                      value={form.parent_id.company_fb ?? "None"}
                      // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6} lg={3} className="mt-0 mt-lg-1">
                  <Label htmlFor="personalDetails-instagram">Instagram</Label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <Instagram size={18} />
                    </span>
                    <Input
                      type="text"
                      id="personalDetails-instagram"
                      className="form-control social_input"
                      aria-label=""
                      name="company_insta"
                      value={form.parent_id.company_insta ?? "None"}
                      // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6} lg={3} className="mt-0 mt-lg-1">
                  <Label htmlFor="linkedin2">
                    Linkedin
                  </Label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <Linkedin size='18px' />
                    </span>
                    <Input
                      id='linkedin2'
                      type='text'
                      className="form-control social_input"
                      name='company_linkedIn'
                      value={form.parent_id.company_linkedIn ?? "None"}
                      disabled
                    />
                  </div>
                </Col>

              </Row>
            </>}
          </>
        </div>
      ))}
    </>
  )

  const CompanyFormOG = (
    <>
      {filteredData.map((form, i) => (
        <div key={i}>
          <Row>
            <Col md={12} className="mt-2">
              <h4 className="mb-0">Company Details</h4>
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label
                htmlFor="company-name"
                className="form-label"
                style={{ margin: "0px" }}
              >
                Company Name
              </label>
              <Select
                options={options}
                closeMenuOnSelect={true}
                components={{ Menu: CustomSelectComponent }}
                placeholder="Select company Name"
                onChange={(e) => {
                  selectCompany(e, form.id ?? form.formId, i)
                }}
                value={options?.filter((curElem) => Number(curElem?.value) === Number(form?.id))}
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-industry">Industry</label>
              <input
                placeholder="Industry"
                type="text"
                id="company-industry"
                name="industry"
                className="form-control"
                value={form.industry ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-gst-no">GST Number</label>
              <input
                placeholder="GST Number"
                type="text"
                id="company-gst-no"
                name="gst"
                className="form-control"
                value={form.company_gst ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-1-phone">Company Phone</label>
              <input
                placeholder="Company Phone"
                type="text"
                pattern="[789][0-9]{9}"
                maxLength={10}
                id="company-1-phone"
                name="company_phone"
                className="form-control"
                value={form.company_phone ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-email">Company Email</label>
              <input
                placeholder="Company Email"
                type="text"
                id="company-email"
                name="company_email"
                className="form-control"
                value={form.company_email ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-website">Company Website</label>
              <input
                placeholder="Company Website"
                type="text"
                id="company-website"
                name="company_website"
                className="form-control"
                value={form.company_website ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-pancard">Company Pan Card Number</label>
              <input
                placeholder="Company Pan Card Number"
                type="text"
                id="company-pancard"
                name="company_panCard"
                className="form-control"
                value={form.company_pancard ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="address-2-relation">Relation</label>
              <Select
                placeholder="Relation"
                id="address-2-relation"
                options={relationOptions}
                closeMenuOnSelect={true}
                value={relationOptions?.find(option => option.value === formData?.shipping_relation)}
                defaultValue={relationOptions?.find(option => option.value === 'business')}
              // onChange={(e) => handleInputChange(e, 'shipping_relation', i)}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mt-5">
              <div className="d-flex justify-content-between">
                <h4 className="mb-0">Company Address</h4>
                <div className="d-none justify-content-around w-50">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault1"
                    >
                      Same as Billing Address
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                    >
                      Same as shipping Address
                    </label>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-name">
                Flat and/or Building/House Details
              </label>
              <input
                placeholder="Flat and/or Building/House Details"
                type="text"
                id="company-name"
                name="address_line1"
                className="form-control"
                value={form.address_line1 ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-industry">Street, Lane or Road</label>
              <input
                placeholder="Street, Lane or Road"
                type="text"
                id="company-industry"
                name="street"
                className="form-control"
                value={form.street ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-area">
                Enter Area, Locality or Suburb e.g. Bandra
              </label>
              <input
                placeholder="Enter Area, Locality or Suburb e.g. Bandra"
                type="text"
                id="company-area"
                name="area_building"
                className="form-control"
                value={form.area_building ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-landmark">Landmark</label>
              <input
                placeholder="Landmark"
                type="text"
                id="company-landmark"
                name="landmark"
                className="form-control"
                value={form.landmark ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-city">City</label>
              <input
                placeholder="City"
                type="text"
                id="company-city"
                name="city"
                className="form-control"
                value={form.city ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-state">State</label>
              <input
                placeholder="State"
                type="text"
                id="company-state"
                name="state"
                className="form-control"
                value={form.state ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="company-pincard">Pincode</label>
              <input
                placeholder="Pincode"
                type="text"
                id="company-pincard"
                name="pincode"
                className="form-control"
                value={form.pincode ?? ""}
                onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                disabled
              />
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="address-2-country">Country</label>
              <Select
                isMulti={false}
                options={country}
                inputId="aria-example-input"
                closeMenuOnSelect={true}
                name="country"
                placeholder="Select Country"
                onChange={(e) => selectCountry(e, form.id ?? form.formId)}
                isDisabled={true}
                value={country?.filter((curElem) => curElem?.value === form.country)}
              // value={country.find((item) => String(form?.country) === String(item.value))}
              // value={country.filter(option => String(data?.country) === String(option.value))}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mt-2">
              <h4 className="mb-0">Social Presence</h4>
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="personalDetails-twitter">Twitter</label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Twitter size={24} />
                </span>
                <input
                  type="text"
                  id="personalDetails-twitter"
                  className="form-control"
                  aria-label=""
                  name="company_twitter"
                  value={form.company_twitter ?? ""}
                  onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </div>
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="personalDetails-facebook">Facebook</label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Facebook size={24} />
                </span>
                <input
                  type="text"
                  id="personalDetails-facebook"
                  className="form-control"
                  aria-label=""
                  name="company_fb"
                  value={form.company_fb ?? ""}
                  onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </div>
            </Col>
            <Col md={6} lg={4} className="mt-2">
              <label htmlFor="personalDetails-instagram">Instagram</label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Instagram size={24} />
                </span>
                <input
                  type="text"
                  id="personalDetails-instagram"
                  className="form-control"
                  aria-label=""
                  name="insta"
                  value={form.insta ?? ""}
                  onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
                  disabled
                />
              </div>
            </Col>
          </Row>
        </div>
      ))}
    </>
  )

  const SideForm = (<form>
    {
      <>
        {newCompanyPage === 1 && (
          <Row className="">
            <Col md={12} className="mt-2">
              <h4 className="mb-0">Add Company</h4>
            </Col>
            <Col md={12} className="mt-2">
              <div className="form-check mb-1">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" name="mark_parent" checked={newCompany?.mark_parent === "1"} onChange={(e) => {
                  setNewCompany({...newCompany, mark_parent: e.target.checked ? "1" : "0"})
                }} />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  Mark as parent company
                </label>
              </div>

              <h5>Subsidiary Company Deatils</h5>

              <label htmlFor="basicDetails-companyName">Company Name</label>
              <input
                required
                placeholder="Name"
                type="text"
                id="basicDetails-name"
                name="company_name"
                className="form-control"
                value={newCompany.company_name ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
              <p id="basicDetails-name_val" className="text-danger m-0 p-0 vaildMessage"></p>
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">Industry</label>
              <input
                required
                placeholder="Industry"
                type="text"
                id="basicDetails-industry"
                name="industry"
                className="form-control"
                value={newCompany.industry ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">GST Number</label>
              <input
                required
                placeholder="GST Number"
                type="text"
                id="basicDetails-gstNumber"
                name="company_gst"
                className="form-control"
                value={newCompany.company_gst ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">
                Company PAN Card Number
              </label>
              <input
                required
                placeholder="PNA Card No."
                type="text"
                id="basicDetails-panNumber"
                name="company_pancard"
                className="form-control"
                value={newCompany.company_pancard ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-mobile">Phone</label>
              <input
                required
                placeholder="Phone"
                type="tel"
                pattern="[789][0-9]{9}"
                maxLength={10}
                id="basicDetails-phone"
                name="company_phone"
                className="form-control"
                value={newCompany.company_phone ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
              <p id="basicDetails-phone_val" className="text-danger m-0 p-0 vaildMessage"></p>
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">Email</label>
              <input
                required
                placeholder="Last Name"
                type="email"
                id="basicDetails-email"
                name="company_email"
                className="form-control"
                value={newCompany.company_email ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
              <p id="basicDetails-email_val" className="text-danger m-0 p-0 vaildMessage"></p>
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">Website</label>
              <input
                required
                placeholder="Website"
                type="text"
                id="basicDetails-website"
                name="company_website"
                className="form-control"
                value={newCompany.company_website ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col>
              <div className="d-flex justify-content-between mt-2">
                <div>
                  <button className="btn btn-primary" type="button">
                    Cancel
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-primary ms-2"
                    type="button"
                    onClick={() => setNewCompanyPage(2)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        )}
        {newCompanyPage === 2 && (
          <Row className="">
            <h5>Subsidiary Company Address</h5>
            <Col md={12} className="mt-2">
              <label htmlFor="company-name">
                Flat and/or Building/House Details
              </label>
              <input
                placeholder="Flat and/or Building/House Details"
                type="text"
                id="company-name"
                name="address_line1"
                className="form-control"
                value={newCompany.address_line1 ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-industry">Street, Lane or Road</label>
              <input
                placeholder="Street, Lane or Road"
                type="text"
                id="company-industry"
                name="street"
                className="form-control"
                value={newCompany.street ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-area">
                Enter Area, Locality or Suburb e.g. Bandra
              </label>
              <input
                placeholder="Enter Area, Locality or Suburb e.g. Bandra"
                type="text"
                id="company-area"
                name="area_building"
                className="form-control"
                value={newCompany.area_building ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-landmark">Landmark</label>
              <input
                placeholder="Landmark"
                type="text"
                id="company-landmark"
                name="landmark"
                className="form-control"
                value={newCompany.landmark ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-city">City</label>
              <input
                placeholder="City"
                type="text"
                id="company-city"
                name="city"
                className="form-control"
                value={newCompany.city ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-state">State</label>
              <input
                placeholder="State"
                type="text"
                id="company-state"
                name="state"
                className="form-control"
                value={newCompany.state ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-pincard">Pincode</label>
              <input
                placeholder="Pincode"
                type="text"
                id="company-pincard"
                name="pincode"
                className="form-control"
                value={newCompany.pincode ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="address-2-country">Country</label>
              <Select
                isMulti={false}
                options={country}
                inputId="aria-example-input"
                closeMenuOnSelect={true}
                name="country"
                placeholder="Select Country"
                onChange={(e) => selectCountry(e, "new-company", 'country')}
              />
            </Col>
            <Col md={12} className="mt-2">
              <div className="d-flex justify-content-between mt-2">
                <div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setNewCompanyPage(1)}
                  >
                    Previous
                  </button>
                </div>
                <div>
                  {
                    newCompany?.mark_parent === "1" ? <>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={(e) => {
                          // handleSubmitSection3
                          postData()
                          toast.success('Company Added Successfully')
                          setShow(false)
                        }}
                      >
                        Save
                      </button>
                    </> : <>
                    
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => {
                        // handleSubmitSection3
                        setNewCompanyPage(3)
                      }}
                    >
                      Next
                    </button>
                    </>
                  }
                  
                </div>
              </div>
            </Col>
          </Row>
        )}

        {newCompanyPage === 3 && (
          <Row className="">
            <Col md={12} className="mt-2">
              <h4>Parent Company</h4>
              <hr />
              <h5>Subsidiary Company Deatils</h5>

              <label htmlFor="basicDetails-companyName">Company Name</label>
              <input
                required
                placeholder="Name"
                type="text"
                id="basicDetails-name"
                name="par_company_name"
                className="form-control"
                value={newCompany.par_company_name ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
              <p id="basicDetails-name_val" className="text-danger m-0 p-0 vaildMessage"></p>
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">Industry</label>
              <input
                required
                placeholder="Industry"
                type="text"
                id="basicDetails-industry"
                name="par_industry"
                className="form-control"
                value={newCompany.par_industry ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">GST Number</label>
              <input
                required
                placeholder="GST Number"
                type="text"
                id="basicDetails-gstNumber"
                name="par_company_gst"
                className="form-control"
                value={newCompany.par_company_gst ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">
                Company PAN Card Number
              </label>
              <input
                required
                placeholder="PNA Card No."
                type="text"
                id="basicDetails-panNumber"
                name="par_company_pancard"
                className="form-control"
                value={newCompany.par_company_pancard ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-mobile">Phone</label>
              <input
                required
                placeholder="Phone"
                type="tel"
                pattern="[789][0-9]{9}"
                maxLength={10}
                id="basicDetails-phone"
                name="par_company_phone"
                className="form-control"
                value={newCompany.par_company_phone ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
              <p id="basicDetails-phone_val" className="text-danger m-0 p-0 vaildMessage"></p>
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">Email</label>
              <input
                required
                placeholder="Last Name"
                type="email"
                id="basicDetails-email"
                name="par_company_email"
                className="form-control"
                value={newCompany.par_company_email ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
              <p id="basicDetails-email_val" className="text-danger m-0 p-0 vaildMessage"></p>
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="basicDetails-last-name">Website</label>
              <input
                required
                placeholder="Website"
                type="text"
                id="basicDetails-website"
                name="par_company_website"
                className="form-control"
                value={newCompany.par_company_website ?? ''}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col>
              <div className="d-flex justify-content-between mt-2">
                <div>
                  <button onClick={() => setNewCompanyPage(2)} className="btn btn-primary" type="button">
                    Previous
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-primary ms-2"
                    type="button"
                    onClick={() => setNewCompanyPage(4)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {newCompanyPage === 4 && (
          <Row className="">
            <h4>Parent Company</h4>
            <hr />
            <h5 className="">Subsidiary Company Address</h5>
            <Col md={12}>
              <label htmlFor="company-name">
                Flat and/or Building/House Details
              </label>
              <input
                placeholder="Flat and/or Building/House Details"
                type="text"
                id="company-name"
                name="par_address_line1"
                className="form-control"
                value={newCompany.par_address_line1 ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-industry">Street, Lane or Road</label>
              <input
                placeholder="Street, Lane or Road"
                type="text"
                id="company-industry"
                name="par_street"
                className="form-control"
                value={newCompany.par_street ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-area">
                Enter Area, Locality or Suburb e.g. Bandra
              </label>
              <input
                placeholder="Enter Area, Locality or Suburb e.g. Bandra"
                type="text"
                id="company-area"
                name="par_area_building"
                className="form-control"
                value={newCompany.par_area_building ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-landmark">Landmark</label>
              <input
                placeholder="Landmark"
                type="text"
                id="company-landmark"
                name="par_landmark"
                className="form-control"
                value={newCompany.par_landmark ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-city">City</label>
              <input
                placeholder="City"
                type="text"
                id="company-city"
                name="par_city"
                className="form-control"
                value={newCompany.par_city ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-state">State</label>
              <input
                placeholder="State"
                type="text"
                id="company-state"
                name="par_state"
                className="form-control"
                value={newCompany.par_state ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="company-pincard">Pincode</label>
              <input
                placeholder="Pincode"
                type="text"
                id="company-pincard"
                name="par_pincode"
                className="form-control"
                value={newCompany.par_pincode ?? ""}
                onChange={(e) => handleInputChange2(e, "new-company")}
              />
            </Col>
            <Col md={12} className="mt-2">
              <label htmlFor="address-2-country">Country</label>
              <Select
                isMulti={false}
                options={country}
                inputId="aria-example-input"
                closeMenuOnSelect={true}
                name="par_country"
                placeholder="Select Country"
                onChange={(e) => selectCountry(e, "new-company", 'country')}
              />
            </Col>
            <Col md={12} className="mt-2">
              <div className="d-flex justify-content-between mt-2">
                <div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setNewCompanyPage(3)}
                  >
                    Previous
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) => {
                      // handleSubmitSection3
                      postData()
                      toast.success('Company Added Successfully')
                      setShow(false)
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        )}

      </>
    }
  </form>
  )

  return (
    <div>
      {InnerStyles}
      <>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            {/* <Offcanvas.Title>Offcanvas</Offcanvas.Title> */}
          </Offcanvas.Header>
          <Offcanvas.Body>
            {SideForm}
          </Offcanvas.Body>
        </Offcanvas>
      </>
      <Container fluid className="px-0 py-1">
        {CompanyForm}
        <div className="d-flex justify-content-end mt-2 gap-1">
          <button
            className="btn btn-primary"
            type="button"
            onClick={addCompany}
          >
            Add Company
          </button>
        </div>
        {/* <div className="d-flex justify-content-between mt-2">
          <div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleBack}
            >
              Back
            </button>
            <button className="btn btn-primary ms-2" type="button">
              Cancel
            </button>
          </div>
          <div><button className="btn btn-primary ms-2" type="button" >
              Save & Close
            </button>
            <button
              className="btn btn-primary ms-2"
              type="button"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div> */}
      </Container>
    </div>
  )
}

export default CustomerBasicCompanyInfo
