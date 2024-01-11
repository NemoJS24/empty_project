import React from 'react'
import { Container, Row, Col } from "reactstrap"
import Select from "react-select"

const ReferralForm = ({ formHandler }) => {

    const { handleBack, formData, handleInputChange } = formHandler

    const titleOptions = [
        { value: 'mr', label: 'Mr.' },
        { value: 'ms', label: 'Ms.' },
        { value: 'mrs', label: 'Mrs.' }
    ]

    const countryOptions = [{ value: 'India', label: 'India' }]
    
    return (
        <>
            <Container>
                <Row>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-title" className="form-label" style={{ margin: '0px' }}>
                            Title
                        </label>
                        <Select
                            id="basicDetails-title"
                            options={titleOptions}
                            closeMenuOnSelect={true}
                            value={titleOptions?.find(option => option.value === formData?.Ref_title)}
                            onChange={e => (handleInputChange(e, 'Ref_title'))}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-first-name">
                            First Name
                        </label>
                        <input placeholder="First Name" type='text' id='basicDetails-first-name' name='Ref_first_name' className="form-control"
                            value={formData?.Ref_first_name}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-last-name">
                            Last Name
                        </label>
                        <input required placeholder="Last Name" type='text' id='basicDetails-last-name' name='Ref_last_name' className="form-control"
                            value={formData?.Ref_last_name}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="basicDetails-mobile">
                            Mobile Number
                        </label>
                        <input required placeholder="10-digit Mobile Number" type='tel' pattern="[789][0-9]{9}" maxLength={10} id='basicDetails-mobile' name='Ref_phone_no' className="form-control"
                            value={formData?.Ref_phone_no}
                        onChange={ e => (handleInputChange(e))} 
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="address-1-house-details">
                            Flat and / or Building / House Details
                        </label>
                        <input
                            placeholder="Flat and / or Building / House Details"
                            type="text"
                            id="address-1-house-details"
                            name="Ref_address1"
                            className="form-control"
                            value={formData.Ref_address1}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="address-1-lane">Street Lane or Road</label>
                        <input
                            placeholder="Street Lane or Road"
                            type="text"
                            id="address-1-lane"
                            name="Ref_address2"
                            className="form-control"
                            value={formData.Ref_address2}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="address-1-locality">
                            Enter Area, Locality or Suburb e.g. Bandra
                        </label>
                        <input
                            placeholder="Enter Area, Locality or Suburb e.g. Bandra"
                            type="text"
                            id="address-1-locality"
                            name="area_building_ref"
                            className="form-control"
                            value={formData.area_building_ref}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="address-1-landmark">Landmark</label>
                        <input
                            placeholder="Landmark"
                            type="text"
                            id="address-1-landmark"
                            name="landmark_ref"
                            className="form-control"
                            value={formData.landmark_ref}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="address-1-city">City</label>
                        <input
                            placeholder="City"
                            type="text"
                            id="address-1-city"
                            name="Ref_city"
                            className="form-control"
                            value={formData.Ref_city}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="address-1-state">State</label>
                        <input
                            placeholder="State"
                            type="text"
                            id="address-1-state"
                            name="Ref_state"
                            className="form-control"
                            value={formData.Ref_state}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="address-1-pincode">Pincode</label>
                        <input
                            placeholder="Pincode"
                            type="text"
                            id="address-1-pincode"
                            name="Ref_pincode"
                            className="form-control"
                            value={formData.Ref_pincode}
                        onChange={ e => (handleInputChange(e))} 
                        />
                    </Col>
                    <Col md={6} className="mt-2">
                        <label htmlFor="address-1-country">Country</label>
                        <Select
                            id="address-1-country"
                            placeholder="Country"
                            options={countryOptions}
                            value={countryOptions?.find(option => option.value === formData?.Ref_country)}
                            onChange={e => (handleInputChange(e, 'Ref_country'))}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col xs='12' className='mt-2'>
                        <div className='d-flex justify-content-between mt-2'>
                            <div>
                                <button className="btn btn-primary" type="button" onClick={handleBack}>Back</button>
                                <button className="btn btn-primary ms-2" type="button">Cancel</button>
                            </div>
                            <div>
                                <button className="btn btn-primary" type="submit" >Save</button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ReferralForm