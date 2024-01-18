import React, { useEffect, useState } from 'react'
// import Select from 'react-select/dist/declarations/src/Select'
import { Col, Container, Row } from 'reactstrap'
// import { $ } from 'jquery'
// import AsyncSelect from 'react-select/dist/declarations/src/Async'
// import AsyncSelect from 'react-select/dist/declarations/src/Async'
import AsyncSelect from 'react-select/async'
import Select from "react-select"
import { crmURL } from '../../../assets/auth/jwtService'
import axios from 'axios'
import { validForm } from '../../Validator'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import Flatpickr from 'react-flatpickr'

const VehicleForm = ({ isView, apiCall, defaultData, edit }) => {
    const { id } = useParams()
    const [brand, setBrand] = useState()

    const [defaultState, setDefaultState] = useState({})

    const [productModelOption, setProductModelOption] = useState([])
    const [productVariantOption, setProductVariantOption] = useState([])

    const checkMessage = [
        {
            name: 'customer_name',
            message: 'Enter Customer Name',
            type: 'string',
            id: 'customer_name'
        },
        {
            name: 'vehicle_type',
            message: 'Select Vehicle Type',
            type: 'string',
            id: 'vehicle_type'
        },
        {
            name: 'brand',
            message: 'Select Brand',
            type: 'string',
            id: 'brand'
        },
        {
            name: 'car_model',
            message: 'Select Car Model',
            type: 'string',
            id: 'car_model'
        },
        {
            name: 'variant',
            message: 'Select Variant',
            type: 'string',
            id: 'variant'
        },
        {
            name: 'manufacture_date',
            message: 'Select Manufacture Date',
            type: 'string',
            id: 'manufacture_date'
        }
    ]

    // const handleSubmitSection = async (e) => {
    //     e.preventDefault()
    //     const checkForm = validForm(checkMessage, defaultState) // Use mainFormvalueToCheck for validation
    //     console.log({ checkForm })
    // }

    const handleSubmitSection = (e) => {
        e.preventDefault()

        const checkForm = validForm(checkMessage, defaultState)
        if (checkForm) {
            const formValues = document.getElementById(id)
            const form_data = new FormData(formValues)
            apiCall(form_data)
        } else {
            toast.error("Something Went Wrong")
            console.log("Form is not valid. Handle errors or show messages.")
        }
    }

    // const handleEditSubmit = (e) => {
    //     e.preventDefault()
    //     const form_value = id
    //     apiCall(form_value)
    // }


    const handleInputChange = (e) => {
        console.log(e)
        setDefaultState(prevData => ({ ...prevData, [e.target.name]: e.target.value }))
    }


    // const isView = false
    const startYear = 2000
    const endYear = 2050
    const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)
    const vehicleTypeOptions = [
        { value: 'new', label: 'New Car' },
        { value: 'used', label: 'Used Car' },
        { value: 'renewal', label: 'Renewal' },
        { value: 'rollover', label: 'Rollover' },
        { value: 'data', label: 'Data' }
    ]

    console.log(defaultState?.vehicle_type, "defaultState?.vehicle_type")
    console.log(productModelOption, productVariantOption, "productModelOption")

    const loadBrandOptions = (inputValue, callback) => {
        const getUrl = new URL(`${crmURL}/vehicle/fetch_car_details/`)
        axios.get(getUrl.toString())
            .then((response) => {
                const successData = response.data.car_brand
                const brandOptions = successData
                    .filter((item) => item[0] !== "")
                    .map((item) => ({
                        value: item[0],
                        label: item[0]
                    }))
                console.log(brandOptions, "brandOptions")
                setBrand(brandOptions)
                callback(brandOptions)
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message)
                callback([])
            })
    }

    const selectChange = async (e, select) => {
        console.log('getProductOptions runned')
        const url = new URL(`${crmURL}/vehicle/fetch_car_details/`)
        const form_data = new FormData()
        select === 'brand' ? form_data.append("brand", e.value) : form_data.append("carmodel", e.value)

        try {
            const response = await fetch(url, {
                method: "POST",
                body: form_data
            })

            const resp = await response.json()
            console.log("Response ooption:", resp)
            if (resp.car_model) {
                const productModelOptions = []
                resp.car_model.forEach((item) => {
                    if (item === "") {
                        return
                    }
                    productModelOptions.push({
                        value: item,
                        label: item
                    })
                })
                setProductModelOption(productModelOptions)
            }
            if (resp.car_variant) {
                const variantOptions = []
                resp.car_variant.map((item) => {
                    if (item === "") {
                        return
                    }
                    variantOptions.push({
                        value: item,
                        label: item
                    })
                })
                setProductVariantOption(variantOptions)
            }
        } catch (error) {
            console.error("Error:", error)
            if (error.message === 'Customer already exists') {
                toast.error('Customer already exists')
            } else {
                toast.error('Failed to save customer')
            }
            throw error
        }
    }
    const vehicleYearOption = years.map((year) => ({
        value: year.toString(),
        label: year.toString()
    }))

    useEffect(() => {
        if (edit) {
            setDefaultState(defaultData)
        } else {
            setDefaultState({
                // defaultData
                customer_name: "",
                registration_number: "",
                sales_person: "",
                vehicle_number: "",
                engine_no: "",
                vehicle_type: "",
                brand: "",
                car_model: "",
                variant: "",
                manufacture_date: "",
                delivery_date: "",
                registeration_date: ""
            })
        }
    }, [defaultData])

    console.log({ isView, apiCall, defaultData, edit, vehicleYearOption }, "defaultState")
    console.log(defaultData.delivery_date, defaultData.brand, defaultData.manufacture_date, "ooooco")
    return (
        <>
            <Container fluid className="px-0 pb-1">
                <Row>
                    {/* <Col md={12} className="">
                        <h4 className="mb-0">Vehicle Details</h4>
                    </Col> */}
                    <Col md={6} className="mt-2">
                        <label htmlFor="customer-name">
                            Customer Name
                        </label>
                        <input value={defaultState.customer_name} type='text' id='customer-name' name='customer_name' className="form-control" onChange={(e) => handleInputChange(e)} />
                        <p id="customer_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="registration-name">
                            Registration Name
                        </label>
                        <input
                            placeholder='Registration Number'
                            type='text' id='registration-name' value={defaultState.registration_number} name='registration_number' className="form-control" onChange={(e) => handleInputChange(e)} />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="sales-person">
                            Sales Person
                        </label>
                        <input
                            placeholder='Sales Person'
                            type='text' id='sales-person' value={defaultState.sales_person} name='sales_person' className="form-control" onChange={(e) => handleInputChange(e)} />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="vehicle-identification">
                            Vehicle Identification Number (VIN) or Chassis Number
                        </label>
                        <input
                            placeholder='Vehicle Identification Number'
                            type='text' id='vehicle-identification' name='vehicle_number' className="form-control" />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="engine-number">
                            Engine Number
                        </label>
                        <input
                            placeholder='Engine Number'
                            type='text' id='engine-number' value={defaultState.engine_no} name='engine_no' className="form-control" />
                    </Col>

                    <Col md={6} className="mt-2">
                        <label htmlFor="vehicle-type" className="" style={{ margin: '0px' }}>
                            Vehicle Type
                        </label>
                        <Select
                            placeholder='Vehicle Type'
                            id="vehicle-type"
                            options={vehicleTypeOptions}
                            closeMenuOnSelect={true}
                            isDisabled={isView}
                            value={vehicleTypeOptions?.filter((curElem) => defaultState?.vehicle_type === curElem?.value)}
                            onChange={selectedOption => {
                                handleInputChange({
                                    target: { name: 'vehicle_type', value: selectedOption ? selectedOption.value : '' }
                                })
                            }}
                        />

                        <input type='hidden' value={defaultState?.vehicle_type} id='vehicle_type' name='vehicle_type' />
                        <p id="vehicle_type_val" className="text-danger m-0 p-0 vaildMessage"></p>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="brand-select" className="" style={{ margin: '0px' }}>
                            Select Brand
                        </label>
                        <AsyncSelect
                            placeholder='Select Brand'
                            defaultOptions
                            cacheOptions
                            id="brand-select"
                            value={brand?.filter((curElem) => defaultState?.brand === curElem?.value)}
                            loadOptions={loadBrandOptions}
                            onChange={selectedOption => {
                                selectChange(selectedOption, 'brand')
                                document.getElementById('brand').value = selectedOption ? selectedOption.value : ''
                                handleInputChange({
                                    target: { name: 'brand', value: selectedOption ? selectedOption.value : '' }
                                })
                            }}
                            isDisabled={isView}
                        />
                        <input type='hidden' value={defaultState?.brand} id='brand' name='brand' />
                        <p id="brand_val" className="text-danger m-0 p-0 vaildMessage"></p>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="model-select" className="" style={{ margin: '0px' }}>
                            Select Model
                        </label>
                        <AsyncSelect
                            placeholder='Select Model'
                            id="model-select"
                            options={productModelOption}
                            closeMenuOnSelect={true}
                            isDisabled={isView}
                            value={productModelOption?.filter((curElem) => defaultState?.car_model === curElem?.value)}
                            onChange={selectedOption => {
                                selectChange(selectedOption, 'model')
                                document.getElementById('car_model').value = selectedOption ? selectedOption.value : ''
                                handleInputChange({
                                    target: { name: 'car_model', value: selectedOption ? selectedOption.value : '' }
                                })
                            }}
                        />
                        <input type='hidden' value={defaultState?.car_model} id='car_model' name='car_model' />
                        <p id="car_model_val" className="text-danger m-0 p-0 vaildMessage"></p>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="variant-select" className="" style={{ margin: '0px' }}>
                            Select Variant
                        </label>
                        <Select
                            placeholder='Select Variant'
                            id="variant-select"
                            options={productVariantOption}
                            closeMenuOnSelect={true}
                            isDisabled={isView}
                            value={productVariantOption?.filter((curElem) => defaultState?.variant === curElem?.value)}
                            onChange={selectedOption => {
                                document.getElementById('variant').value = selectedOption ? selectedOption.value : ''
                                handleInputChange({
                                    target: { name: 'variant', value: selectedOption ? selectedOption.value : '' }
                                })
                            }}
                        />
                        <input type='hidden' value={defaultState?.variant} id='variant' name='variant' />
                        <p id="variant_val" className="text-danger m-0 p-0 vaildMessage"></p>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="manufacture-select" className="" style={{ margin: '0px' }}>
                            Vehicle Manufacture Year
                        </label>
                        <Select
                            placeholder='Vehicle Manufacture Year'
                            id="manufacture-select"
                            options={vehicleYearOption}
                            closeMenuOnSelect={true}
                            value={vehicleYearOption?.filter((curElem) => defaultState?.manufacture_date === curElem?.value)}
                            isDisabled={isView}
                            onChange={selectedOption => {
                                document.getElementById('manufacture_date').value = selectedOption ? selectedOption.value : ''
                                handleInputChange({
                                    target: { name: 'manufacture_date', value: selectedOption ? selectedOption.value : '' }
                                })
                            }}
                        />
                        <input type='hidden' value={defaultState?.manufacture_date} id='manufacture_date' name='manufacture_date' />
                        <p id="manufacture_date_val" className="text-danger m-0 p-0 vaildMessage"></p>

                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="vehicle-delivery-date">
                            Vehicle Delivery Date
                        </label>
                        {/* <input value={defaultState?.delivery_date} placeholder="Vehicle Delivery Date" type='date' id='vehicle-delivery-date' name='delivery_date' className="form-control" /> */}
                        <Flatpickr
                            name='delivery_date'
                            className='form-control'
                            value={defaultState?.delivery_date} />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="vehicle-registration-date">
                            Vehicle Registration Date
                        </label>
                        {/* <input value={defaultState.registeration_date} placeholder="Vehicle Registration Date" type='date' id='vehicle-registration-date' name='registeration_date' className="form-control" /> */}
                        <Flatpickr
                            name='delivery_date'
                            className='form-control'
                            value={defaultState.registeration_date} />
                        {/* disabled={isView} */}
                    </Col>
                </Row>
                <div className='w-100 d-flex justify-content-between mt-2'>
                    <div>
                        <button className="btn btn-primary" type="button" onClick={() => navigate(-1)} >Back</button>
                    </div>
                    {!isView &&
                        <div>
                            <button className="btn btn-primary ms-2" type="button" onClick={(e) => {
                                if (edit) {
                                    e.preventDefault()
                                    const formValues = document.getElementById(id)
                                    console.log(formValues, "formValues")
                                    handleSubmitSection(e)
                                }

                                e.preventDefault()
                                const formValues = document.getElementById(id)
                                console.log(formValues, "uu")
                                handleSubmitSection(e)
                                // const form_data = new FormData(formValues)
                                // console.log(form_data)
                                // apiCall(form_data)
                            }} >Save</button>
                            {/* <button className="btn btn-primary ms-2" type="button" onClick={e => handleSubmitSection(e, 'SAVE & CLOSE')} >Save & Close</button> */}
                        </div>
                    }
                </div>
            </Container>
        </>
    )
}

export default VehicleForm