import React, { useEffect, useState } from "react"
import { Container, Card, CardBody, Row, Col, Label, Input } from "reactstrap"
import { Twitter, Facebook, Instagram, Linkedin } from "react-feather"
import Select from "react-select"
import toast from "react-hot-toast"
import { getReq } from "@src/assets/auth/jwtService"
import Offcanvas from 'react-bootstrap/Offcanvas'
import { validForm } from "@src/views/Validator"
import { postReq } from "../../../../assets/auth/jwtService"
import { RiDeleteBin5Fill } from "react-icons/ri"

/* eslint-disable */
const LeadCompanyInfo = ({ AllFormData }) => {
  const [companyData, getCompanyData] = useState([])
  const [filteredData, setFilteredData] = useState([{ formId: 1 }])
  const [country, setCountry] = useState([])
  const [countryCode, setCountryCode] = useState([])
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
    par_address_line2: "",
    par_street: "",
    par_area_building: "",
    par_landmark: "",
    par_city: "",
    par_state: "",
    par_pincode: "",
    mark_parent: "0",
    phone_code: "",
    platform: ""
  }
  )
  const [newCompanyPage, setNewCompanyPage] = useState(1)

  console.log('filteredData', filteredData)
  // console.log('newCompany', newCompany)

  const { userData, handleInputChange, handleSelectInputChange, countryData, isEdit, parentComapany } = AllFormData

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    fetchCompanyData()
  }, []);

  useEffect(() => {
    if (userData.associate_clients_count && !(companyData.length === 0)) {
      let arr = [];
      for (let i = 0; i < userData.associate_clients_count; i++) {
        arr.push(companyData.find(item => item.id === userData[`associate_clients_${i}`]))
        selectCompany({ value: userData[`associate_clients_${i}`] }, userData[`associate_clients_${i}`], i);
      }
      setFilteredData(arr);
    }
  }, [companyData.length]);

  useEffect(() => {
    setCountryCode(
      countryData.map((curElem) => {
        return { value: curElem.phonecode, label: `+${curElem.phonecode}` }
      })
    )
    setCountry(
      countryData.map((curElem) => {
        return { value: curElem.name, label: `${curElem.name}` }
      })
    )
  }, [countryData])

  const postNewCompany = () => {
    console.log("aa")
    const form_data = new FormData()
    form_data.append('add_company_from_add', 'yes')
    // form_data.append("mark_parent", "0")
    Object.entries(newCompany).map(([key, value]) => {
      form_data.append(key, value)
    })
    postReq("add_company_details", form_data)
      .then((resp) => {
        // console.log({ resp })
        fetchCompanyData()
        if (resp.data.is_exist) {
          toast.error('Company already exists')
        } else {
          toast.success('Company Added Successfully')
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        toast.error('Failed to save Company')
      })
  }

  const fetchCompanyData = async () => {
    getReq('get_company_details')
      .then((res) => {
        // console.log(res)
        getCompanyData(res.data.success)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleInputChangeNewCompany = (e, AddressType = 'newcompany') => {
    if (AddressType === 'newcompany') {
      const { name, value, type } = e.target
      if (type === "tel") {
        value = value.replace(/[^0-9]/g, "")
      }
      setNewCompany(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectInputChangeNewCompany = (options, actionMeta, type = "newcompany") => {
    if (type === "newcompany") {
      setNewCompany(prev => ({ ...prev, [actionMeta.name]: options.value }))
    }
  }

  let options = []
  companyData.forEach((item) => {
    console.log(item.company_name)

    options.push({
      value: item.id,
      label: (item.company_name === "" || typeof item.company_name === 'object') ? '---' : item.company_name
    })
  })

  const callOptions = () => {
    let opt = options.slice()
    filteredData.forEach(item => {
      opt = opt.filter(option => option.value !== item.id)
    })
    return opt
  }

  const selectCompany = (event, id, i) => {
    const foundObject = companyData.find(item => item.id === event.value)
    handleInputChange({ target: { name: `associate_clients_count`, value: filteredData.length } })
    handleInputChange({ target: { name: `associate_clients_${i}`, value: foundObject.id } })
    if (foundObject) {
      setFilteredData((prevForms) => {
        const updatedForms = [...prevForms];
        updatedForms[i] = foundObject;
        return updatedForms;
      })
    } else {
      console.log("Company not found")
    }
  }

  const selectCountry = (options, actionMeta, type = "new-company") => {
    if (type === "new-company") {
      setNewCompany((prev) => ({
        ...prev,
        [actionMeta.name]: options.label
      }))
    }
  }

  const addCompany = () => {
    const newId = filteredData.length + 1
    setFilteredData((prevForms) => [...prevForms, { formId: newId }])
  }

  const deleteCompany = (i) => {
    if (filteredData.length > 1) {
      setFilteredData((prevForms) => {
        const updatedForms = [...prevForms];
        updatedForms.splice(i, 1);
        return updatedForms;
      });
    }
  }

  const CustomSelectComponent = ({ innerProps, children }) => (
    <div {...innerProps} className="position-absolute w-100 bg-white border">
      <p className="m-1">
        <a
          onClick={() => {
            setNewCompanyPage(1)
            handleShow()
          }}
          className="link-success link-underline-opacity-0 "
        >
          Add New Company
        </a>
      </p>
      {children}
    </div>
  )

  const AddCompanySubsidiaryValueToCheck = [
    {
      name: 'company_name',
      message: 'Please enter Company Name',
      type: 'string',
      id: 'company_name'
    },
    {
      name: 'company_phone',
      message: 'Please enter Company Phone Number',
      type: 'number',
      id: 'company_phone'
    },
    {
      name: 'company_email',
      message: 'Please enter Company Email',
      type: 'email',
      id: 'company_email'
    }
  ]

  const AddCompanyParentValueToCheck = [
    {
      name: 'par_company_name',
      message: 'Please enter Company Name',
      type: 'string',
      id: 'par_company_name'
    },
    {
      name: 'par_company_phone',
      message: 'Please enter Company Phone Number',
      type: 'number',
      id: 'par_company_phone'
    },
    {
      name: 'par_company_email',
      message: 'Please enter Company Email',
      type: 'email',
      id: 'par_company_email'
    }
  ]

  const relationOptions = [
    { value: 'Business', label: 'Client' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Dealer', label: 'Dealer' },
    { value: 'Distributor', label: 'Distributor' },
    { value: 'Manufacturer', label: 'Manufacturer' },
    { value: 'Vendor', label: 'Vendor' }
  ]

  const platformOptions = [
    { value: 'Shopify', label: 'Shopify' },
    { value: 'WooCommerce', label: 'WooCommerce' },
    { value: 'Magento', label: 'Magento' },
    { value: 'Wix', label: 'Wix' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Other', label: 'Other' }
  ]

  const InnerStyles = (
    <style>
      {`
      .hiddenRight{
        right: 0 !important
      }import { phonecode_list } from '../../../../default_components/MainData';

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
        --bs-offcanvas-width: 400px;
      }
      `}
    </style>
  )

  const ParentCompany = (company, index) => (
    <>
      <Row>
        <Col md={12} className="mt-2">
          <h4 className="mb-0">Parent Company Details {index + 1}</h4>
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
            value={{ label: company?.parent_id?.company_name, value: company?.parent_id?.company_name }}
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
            value={company?.parent_id?.industry ?? ""}
            // onChange={(e) => handleInputChange2(e, form.id ?? form.formId)}
            disabled
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
            value={company?.parent_id?.company_phone ?? ""}
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
            value={company?.parent_id?.company_email ?? ""}
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
            value={company?.parent_id?.company_website ?? ""}
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
            value={company?.parent_id?.address_line1 ?? ""}
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
            value={company?.parent_id?.street ?? ""}
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
            value={company?.parent_id?.area_building ?? ""}
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
            value={company?.parent_id?.landmark ?? ""}
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
            value={company?.parent_id?.city ?? ""}
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
            value={company?.parent_id?.state ?? ""}
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
            value={company?.parent_id?.pincode ?? ""}
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
            value={{ label: company?.country, value: company?.country }}
          // value={form?.parent_id?.country}
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
              value={company?.parent_id?.company_twitter ?? "None"}
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
              value={company?.parent_id?.company_fb ?? "None"}
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
              value={company?.parent_id?.company_insta ?? "None"}
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
              value={company?.parent_id?.company_linkedIn ?? "None"}
              disabled
            />
          </div>
        </Col>
      </Row>
    </>
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
            {
              parentComapany.length !== 0  ? (
                parentComapany.map((company, index) => (
                  ParentCompany(company, index)
                ))
              ) : (
                form.parent_id && ParentCompany(form, 1)
              )
            }
          </>
        </div>
      ))}
    </>
  )
  console.log('parentComapany',parentComapany)

  const SideForm = (
    <form>
      {newCompanyPage === 1 && (
        <Row className="">
          <Col md={12} className="">
            <div className="form-check mb-1">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" name="mark_parent" checked={newCompany?.mark_parent === "1"} onChange={(e) => {
                setNewCompany({ ...newCompany, mark_parent: e.target.checked ? "1" : "0" })
              }} />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                Mark as parent company
              </label>
            </div>
          </Col>
          <Col md={12} className="mt-1">
            <h6>Subsidiary Company Details</h6>
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="basicDetails-companyName">Name</Label>
            <Input
              placeholder="Name"
              type="text"
              id="basicDetails-name"
              name="company_name"
              className="form-control"
              value={newCompany.company_name ?? ''}
              onChange={handleInputChangeNewCompany}
            />
            <p id="company_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
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
              onChange={handleInputChangeNewCompany}
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
              onChange={handleInputChangeNewCompany}
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
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="newcomphonenumber">
              Mobile Number
            </Label>
            <div class="input-group " style={{ height: '33.44px' }}>
              <span class="" id="basic-addon1" style={{ height: '33.44px', marginRight: '20px' }} >
                <Select
                  name="phone_code"
                  options={countryCode}
                  closeMenuOnSelect={true}
                  value={countryCode?.find(option => option.value === newCompany?.phone_code)}
                  onChange={(value, actionMeta) => handleSelectInputChangeNewCompany(value, actionMeta)}
                // disabled
                />
              </span>
              <Input type="text" placeholder="Mobile Number" aria-label="Mobile Number" id="newcomphonenumber" value={newCompany.company_phone ?? ""} onChange={handleInputChangeNewCompany} name="company_phone" />
            </div>
            <p id="company_phone_val" className="text-danger m-0 p-0 vaildMessage"></p>
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="basicDetails-last-name">Email</Label>
            <Input
              placeholder="Email"
              type="email"
              id="basicDetails-email"
              name="company_email"
              className="form-control"
              value={newCompany.company_email ?? ''}
              onChange={handleInputChangeNewCompany}
            />
            <p id="company_email_val" className="text-danger m-0 p-0 vaildMessage"></p>
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="basicDetails-last-name">Website</Label>
            <Input
              placeholder="Website"
              type="text"
              id="basicDetails-website"
              name="company_website"
              className="form-control"
              value={newCompany.company_website ?? ''}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="address-2-platform">Platform</Label>
            <Select
              placeholder="Select Platform"
              id="address-2-platform"
              name="platform"
              options={platformOptions}
              closeMenuOnSelect={true}
              value={platformOptions?.find(option => option.value === newCompany?.platform)}
              onChange={(value, actionMeta) => handleSelectInputChangeNewCompany(value, actionMeta)}
            // disabled
            />
          </Col>
          <Col>
            <div className="d-flex justify-content-end mt-1">
              <div>
                <button className="btn btn-primary" type="button" onClick={() => handleClose()}>
                  Cancel
                </button>
              </div>
              <div>
                <button
                  className="btn btn-primary ms-2"
                  type="button"
                  onClick={() => {
                    const checkForm = validForm(AddCompanySubsidiaryValueToCheck, newCompany)
                    if (checkForm) {
                      setNewCompanyPage(2)
                    }
                  }
                  }
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
          <Col md={12} className="mt-">
            <h6>Subsidiary Company Address</h6>
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-name">
              Flat and/or Building/House Details
            </Label>
            <Input
              placeholder="Flat and/or Building/House Details"
              type="text"
              id="company-name"
              name="address_line1"
              className="form-control"
              value={newCompany.address_line1 ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-industry">Street, Lane or Road</Label>
            <Input
              placeholder="Street, Lane or Road"
              type="text"
              id="company-industry"
              name="street"
              className="form-control"
              value={newCompany.street ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-area">
              Enter Area, Locality or Suburb
            </Label>
            <Input
              placeholder="Enter Area, Locality or Suburb"
              type="text"
              id="company-area"
              name="area_building"
              className="form-control"
              value={newCompany.area_building ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-landmark">Landmark</Label>
            <Input
              placeholder="Landmark"
              type="text"
              id="company-landmark"
              name="landmark"
              className="form-control"
              value={newCompany.landmark ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-city">City</Label>
            <Input
              placeholder="City"
              type="text"
              id="company-city"
              name="city"
              className="form-control"
              value={newCompany.city ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-state">State</Label>
            <Input
              placeholder="State"
              type="text"
              id="company-state"
              name="state"
              className="form-control"
              value={newCompany.state ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-pincard">Pincode</Label>
            <Input
              placeholder="Pincode"
              type="text"
              id="company-pincard"
              name="pincode"
              className="form-control"
              value={newCompany.pincode ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="address-2-country">Country</Label>
            <Select
              isMulti={false}
              options={country}
              inputId="aria-example-input"
              closeMenuOnSelect={true}
              // value={{value: 'India', label: 'India'}}
              value={country.find(option => option.value === newCompany?.country) ?? ''}
              placeholder="Select Country"
              name='country'
              // onChange={(e) => {
              //   selectCountry(e, "new-company")
              //   // handleInputChange2(e, "new-company", 'country')
              // }
              // }
              onChange={(value, actionMeta) => selectCountry(value, actionMeta, 'new-company')}
            />
          </Col>
          <Col md={12} className="mt-2">
            <div className="d-flex justify-content-between mt-1">
              <div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    setNewCompanyPage(1)
                  }}
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
                        postNewCompany()
                        // toast.success('Company Added Successfully')
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
          <Col md={12} className="mt-1">
            <h6>Parent Company Details</h6>
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="basicDetails-companyName">Name</Label>
            <Input
              placeholder="Name"
              type="text"
              id="basicDetails-name"
              name="par_company_name"
              className="form-control"
              value={newCompany.par_company_name ?? ''}
              onChange={handleInputChangeNewCompany}
            />
            <p id="par_company_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
          </Col>
          {/* <Col md={12} className="mt-1">
            <Label htmlFor="address-2-category">Category:</Label>
            <Select
              placeholder="Category"
              id="address-2-category"
              // options={}
              isMulti
              closeMenuOnSelect={true}
            // value={relationOptions?.find(option => option.value === userData?.shipping_relation)}
            // onChange={(e) => handleInputChange2(e, 'shipping_relation')}
            // disabled
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="address-2-subCategory">Sub Category:</Label>
            <Select
              placeholder="Sub Category"
              id="address-2-subCategory"
              // options={}
              isMulti
              closeMenuOnSelect={true}
            // value={relationOptions?.find(option => option.value === userData?.shipping_relation)}
            // onChange={(e) => handleInputChange2(e, 'shipping_relation')}
            // disabled
            />
          </Col> */}
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
              onChange={handleInputChangeNewCompany}
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
              onChange={handleInputChangeNewCompany}
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
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="parphonenumber">
              Mobile Number
            </Label>
            <div class="input-group " style={{ height: '33.44px' }}>
              <span class="" id="basic-addon1" style={{ height: '33.44px', marginRight: '20px' }} >
                <Select
                  name="par_phone_code"
                  options={countryCode}
                  closeMenuOnSelect={true}
                  value={countryCode?.find(option => option.value === newCompany?.phone_code)}
                  onChange={(value, actionMeta) => setNewCompany(prev => ({ ...prev, [actionMeta.name]: value.value }))}
                // disabled
                />
              </span>
              <Input id="parphonenumber" type="text" placeholder="Mobile Number" aria-label="Mobile Number" name="par_company_phone" value={newCompany.par_company_phone ?? ""} onChange={handleInputChangeNewCompany} />
            </div>
            <p id="par_company_phone_val" className="text-danger m-0 p-0 vaildMessage"></p>
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="basicDetails-last-name">Email</Label>
            <Input
              placeholder="Email"
              type="email"
              id="basicDetails-email"
              name="par_company_email"
              className="form-control"
              value={newCompany.par_company_email ?? ''}
              onChange={handleInputChangeNewCompany}
            />
            <p id="par_company_email_val" className="text-danger m-0 p-0 vaildMessage"></p>
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="basicDetails-last-name">Website</Label>
            <Input
              placeholder="Website"
              type="text"
              id="basicDetails-website"
              name="par_company_website"
              className="form-control"
              value={newCompany.par_company_website ?? ''}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="address-2-platform">Platform</Label>
            <Select
              placeholder="Select Platform"
              id="address-2-platform"
              name="par_platform"
              options={platformOptions}
              closeMenuOnSelect={true}
              value={platformOptions?.find(option => option.value === newCompany?.par_platform)}
              onChange={(value, actionMeta) => handleSelectInputChangeNewCompany(value, actionMeta)}
            // disabled
            />
          </Col>
          <Col>
            <div className="d-flex justify-content-between mt-1">
              <div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    const checkForm = validForm(AddCompanyParentValueToCheck, newCompany)
                    if (checkForm) {
                      setNewCompanyPage(2)
                    }
                  }
                  }
                >
                  Previous
                </button>
              </div>
              <div>
                <button className="btn btn-primary" type="button" onClick={() => handleClose()}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary ms-2"
                  type="button"
                  onClick={() => {
                    const checkForm = validForm(AddCompanyParentValueToCheck, newCompany)
                    if (checkForm) {
                      setNewCompanyPage(4)
                    }
                  }
                  }
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
          <Col md={12} className="mt-">
            <h6>Parent Company Address</h6>
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-name">
              Flat and/or Building/House Details
            </Label>
            <Input
              placeholder="Flat and/or Building/House Details"
              type="text"
              id="company-name"
              name="par_address_line1"
              className="form-control"
              value={newCompany.par_address_line1 ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-industry">Street, Lane or Road</Label>
            <Input
              placeholder="Street, Lane or Road"
              type="text"
              id="company-industry"
              name="par_address_line2"
              // name="par_street"
              className="form-control"
              value={newCompany.par_address_line2 ?? ""}
              // value={newCompany.par_street ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-area">
              Enter Area, Locality or Suburb
            </Label>
            <Input
              placeholder="Enter Area, Locality or Suburb"
              type="text"
              id="company-area"
              name="par_area_building"
              className="form-control"
              value={newCompany.par_area_building ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-landmark">Landmark</Label>
            <Input
              placeholder="Landmark"
              type="text"
              id="company-landmark"
              name="par_landmark"
              className="form-control"
              value={newCompany.par_landmark ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-city">City</Label>
            <Input
              placeholder="City"
              type="text"
              id="company-city"
              name="par_city"
              className="form-control"
              value={newCompany.par_city ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-state">State</Label>
            <Input
              placeholder="State"
              type="text"
              id="company-state"
              name="par_state"
              className="form-control"
              value={newCompany.par_state ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="company-pincard">Pincode</Label>
            <Input
              placeholder="Pincode"
              type="text"
              id="company-pincard"
              name="par_pincode"
              className="form-control"
              value={newCompany.par_pincode ?? ""}
              onChange={handleInputChangeNewCompany}
            />
          </Col>
          <Col md={12} className="mt-1">
            <Label htmlFor="address-2-country">Country</Label>
            <Select
              isMulti={false}
              options={country}
              inputId="aria-example-input"
              closeMenuOnSelect={true}
              value={country.find(option => option.value === newCompany?.par_country) ?? ''}
              placeholder="Select Country"
              name='par_country'
              onChange={(value, actionMeta) => selectCountry(value, actionMeta, 'new-company')}
            />
          </Col>
          <Col md={12} className="mt-2">
            <div className="d-flex justify-content-between mt-1">
              <div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    setNewCompanyPage(3)
                  }}
                >
                  Previous
                </button>
              </div>
              <div>
                <button className="btn btn-primary ms-2" type="button" onClick={() => handleClose()}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={(e) => {
                    postNewCompany()
                    // toast.success('Company Added Successfully')
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
    </form>
  )

  return (
    <div>
      {InnerStyles}
      <>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Add Company</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {SideForm}
          </Offcanvas.Body>
        </Offcanvas>
      </>
      <Container fluid className="px-0 py-1">
        {/* Customer Basic Company Information 2 */}
        {CompanyForm}
        <div className="d-flex justify-content-end mt-1">
          <button
            className="btn btn-primary"
            type="button"
            onClick={addCompany}>
            Add Company
          </button>
        </div>
      </Container>
    </div>
  )
}

export default LeadCompanyInfo