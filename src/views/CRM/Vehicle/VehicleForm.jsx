import React, { useState } from 'react'
import Select from 'react-select/dist/declarations/src/Select'
import { Col, Container, Row } from 'reactstrap'
import { $ } from 'jquery'
import AsyncSelect from 'react-select/dist/declarations/src/Async'

const VehicleForm = ({ viewPage }) => {

    const [productModelOption, setProductModelOption] = useState([])
    const [productVariantOption, setProductVariantOption] = useState([])

    const vehicleTypeOptions = [
        { value: 'new', label: 'New Car' },
        { value: 'used', label: 'Used Car' },
        { value: 'renewal', label: 'Renewal' },
        { value: 'rollover', label: 'Rollover' },
        { value: 'data', label: 'Data' }
    ]


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
                console.log(brandOptions)
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
    return (
        <>
            <Container fluid className="px-0 pb-1">
                <Row>
                    <Col md={12} className="">
                        <h4 className="mb-0">Vehicle Details</h4>
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="customer-name">
                            Customer Name
                        </label>
                        <input type='text' id='customer-name' name='customer_name' className="form-control" disabled={isView} />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="registration-name">
                            Registration Name
                        </label>
                        <input
                            placeholder='Registration Number'
                            type='text' id='registration-name' name='registration_number' className="form-control" disabled={isView} />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="sales-person">
                            Sales Person
                        </label>
                        <input
                            placeholder='Sales Person'
                            type='text' id='sales-person' name='sales_person' className="form-control" disabled={isView} />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="vehicle-identification">
                            Vehicle Identification Number (VIN) or Chassis Number
                        </label>
                        <input
                            placeholder='Vehicle Identification Number'
                            type='text' id='vehicle-identification' name='vehicle_number' className="form-control" disabled={isView} />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="engine-number">
                            Engine Number
                        </label>
                        <input
                            placeholder='Engine Number'
                            type='text' id='engine-number' name='engine_no' className="form-control" disabled={isView} />
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
                            isDisabled={viewPage}
                            onChange={e => {
                                $(`#vehicle_type`).value = e.value
                            }}
                        />
                        <input type='hidden' id='vehicle_type' name='vehicle_type' />
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
                            loadOptions={loadBrandOptions}
                            onChange={e => {
                                selectChange(e, 'brand')
                                $(`#brand`).value = e.value
                            }}
                            isDisabled={viewPage}
                        />
                        <input type='hidden' id='brand' name='brand' />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="model-select" className="" style={{ margin: '0px' }}>
                            Select Model
                        </label>
                        <Select
                            placeholder='Select Model'
                            id="model-select"
                            options={productModelOption}
                            closeMenuOnSelect={true}
                            isDisabled={viewPage}
                            onChange={e => {
                                selectChange(e, 'model')
                                $(`#car_model`).value = e.value
                            }}
                        />
                        <input type='hidden' id='car_model' name='car_model' />
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
                            isDisabled={viewPage}
                            onChange={e => {
                                $(`#variant`).value = e.value
                            }}
                        />
                        <input type='hidden' id='variant' name='variant' />
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
                            isDisabled={viewPage}
                            onChange={e => {
                                $(`#manufacture_date`).value = e.value
                            }}
                        />
                        <input type='hidden' id='manufacture_date' name='manufacture_date' />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="vehicle-delivery-date">
                            Vehicle Delivery Date
                        </label>
                        <input placeholder="Vehicle Delivery Date" type='date' id='vehicle-delivery-date' name='delivery_date' className="form-control" disabled={isView} />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="vehicle-registration-date">
                            Vehicle Registration Date
                        </label>
                        <input placeholder="Vehicle Registration Date" type='date' id='vehicle-registration-date' name='registeration_date' className="form-control" disabled={isView} />
                    </Col>
                </Row>
                <div className='w-100 d-flex justify-content-between mt-2'>
                    <div>
                        <button className="btn btn-primary" type="button" onClick={() => navigate(-1)} >Back</button>
                    </div>
                    {!viewPage &&
                        <div>
                            <button className="btn btn-primary ms-2" type="submit" >Save</button>
                            {/* <button className="btn btn-primary ms-2" type="button" onClick={e => handleSubmitSection(e, 'SAVE & CLOSE')} >Save & Close</button> */}
                        </div>
                    }
                </div>
            </Container>
        </>
    )
}

export default VehicleForm