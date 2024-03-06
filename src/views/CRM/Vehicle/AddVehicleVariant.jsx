import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Form, Row } from 'reactstrap'
import CreatableSelect from "react-select/creatable"
import axios from 'axios'
import { crmURL } from '../../../assets/auth/jwtService'
import toast from 'react-hot-toast'
function AddVehicleVariant() {
    const [formData, setFromData] = useState({
        brand: "",
        carModel: "",
        variant: ""
    })
    const [brands, setBrands] = useState([])
    const [carModels, setCarModels] = useState([])
    const [customOpt, setCustomOpt] = useState({ label: "", value: "" })

    const data = () => {
        axios.get(`${crmURL}/vehicle/add_variant/`)
            .then(response => {
                console.log('data', response.data)
                const arr = []
                response.data.brand.filter($ => $ !== "").forEach(element => {
                    arr.push({ label: element, value: element })
                })
                setBrands(arr)
            })
            .catch(error => {
                console.error('Error:', error)
            })

    }
    const fetchCarModels = (value) => {
        axios.get(`${crmURL}/vehicle/add_variant/?brand=${value}`)
            .then(response => {
                console.log(formData)
                console.log(response)
                const arr = []
                response.data.car_model.filter($ => $ !== "").forEach(element => {
                    arr.push({ label: element, value: element })
                })
                setCarModels(arr)
            })
            .catch(error => {
                console.error('Error:', error)
            })
    }

    const handleBrandChange = (selectedOption) => {
        setFromData({ ...formData, brand: selectedOption.value })
        fetchCarModels(selectedOption.value)
    }

    useEffect(() => {
        data()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
        const form_data = new FormData()
        form_data.append("brand", formData.brand)
        form_data.append("carmodel", formData.carModel)
        form_data.append("variant", formData.variant)
        axios.post(`${crmURL}/vehicle/add_variant/`, form_data)
            .then(response => {
                console.log(response.data)
                toast.success("Submitted Succesfully")
            })
            .catch(error => {
                console.error(error)
            })
        console.log(form_data)
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <h4>Brand</h4>
                                <CreatableSelect
                                    options={brands}
                                    onKeyDown={e => {
                                        setCustomOpt({ ...customOpt, label: e.target.value, value: e.target.value })
                                        if (e.key === "Enter") {
                                            if (e.target.value !== "") {
                                                setBrands([...brands, { label: e.target.value, value: e.target.value }])
                                                setFromData({ ...formData, brand: e.target.value })
                                                setCustomOpt({ label: "", value: "" })
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if (customOpt.value !== "" && customOpt.value !== "") {
                                            setBrands([...brands, { label: customOpt.label, value: customOpt.value }])
                                            setFromData({ ...formData, brand: customOpt.value })
                                            setCustomOpt({ label: "", value: "" })
                                        }
                                    }}
                                    onChange={handleBrandChange}
                                    value={brands.filter(brand => brand.value === formData.brand)}
                                />
                            </Col>
                            <Col md={6} className='mt-2 mt-md-0' >
                                <h4>Car Model</h4>
                                <CreatableSelect
                                    options={carModels}
                                    value={carModels.filter((model => model.value === formData.carModel))}
                                    onInputChange={e => {
                                        // setFromData({ ...formData, brand: e })
                                        setCustomOpt({ ...customOpt, label: e, value: e })
                                    }}
                                    onKeyDown={e => {
                                        setCustomOpt({ ...customOpt, label: e.target.value, value: e.target.value })
                                        if (e.key === "Enter") {
                                            if (e.target.value !== "") {
                                                setCarModels([...carModels, { label: e.target.value, value: e.target.value }])
                                                setFromData({ ...formData, carModel: e.target.value })
                                                setCustomOpt({ label: "", value: "" })
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if (customOpt.value !== "" && customOpt.value !== "") {
                                            setCarModels([...carModels, { label: customOpt.label, value: customOpt.value }])
                                            setFromData({ ...formData, carModel: customOpt.value })
                                            setCustomOpt({ label: "", value: "" })
                                        }
                                    }}
                                    onChange={(selectedOption) => {
                                        setFromData({ ...formData, carModel: selectedOption.value })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col md={6}>
                                <h4>Variant</h4>
                                <input type='text' className='w-100 form-control' value={formData.variant} style={{ height: "30px" }}
                                    onChange={(event) => {
                                        const newValue = event.target.value
                                        setFromData({ ...formData, variant: newValue })
                                    }}
                                />
                            </Col>
                            <div className='float-left mt-3'>
                                <Button type='submit' className='btn btn-primary '>Submit</Button>
                            </div>

                        </Row>


                    </Form>

                </CardBody>
            </Card>
        </div>
    )
}

export default AddVehicleVariant