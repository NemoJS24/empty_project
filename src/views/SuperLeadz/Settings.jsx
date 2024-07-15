import React, { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { deplayTime, getCurrentOutlet } from '../Validator'
import Select from "react-select"
import { SuperLeadzBaseURL, getReq, postReq } from '../../assets/auth/jwtService'
import { PermissionProvider } from '../../Helper/Context'
import toast from 'react-hot-toast'
import FrontBaseLoader from '../Components/Loader/Loader'

const Settings = () => {
    const [data, setData] = useState({
        timeType: "",
        inputedTime: ""
    })
    const [isLoading, setIsLoading] = useState(true)

    const { userPermission } = useContext(PermissionProvider)
    const outletData = getCurrentOutlet()

    const convertToSeconds = ({ time, type }) => {
        if (type === "hours") {
            return time * 3600
        } else if (type === "minutes") {
            return time * 60
        } else if (type === "days") {
            return time * 86400
        } else {
            return time
        }
    }

    const updateData = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSubmit = () => {
        setIsLoading(true)
        const convertedTime = convertToSeconds({time: Number(data?.inputedTime), type: data?.timeType})
        console.log(convertedTime)
        const form_data = new FormData()
        form_data.append('app', userPermission?.appName)
        form_data.append('shop', outletData[0]?.web_url)
        form_data.append('cart_json', JSON.stringify(data))
        form_data.append('abandoned_delay', convertedTime)
        postReq('default_settings', form_data, SuperLeadzBaseURL)
        .then((data) => {
            console.log(data)
            toast.success("Saved SuccessFully")
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const getData = () => {
        getReq('default_settings', `?app=${userPermission?.appName}&shop=${outletData[0]?.web_url}`, SuperLeadzBaseURL)
        .then((data) => {
            console.log(data)
            // const updatedData = {

            // }
            if (data?.data?.data?.cart_json) {
                setData(JSON.parse(data?.data?.data?.cart_json))

            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getData()
    }, [])
    
    return (
        <>
            {
                isLoading ? (
                    <div className='d-flex justify-content-center align-items-center'>
                        <FrontBaseLoader />
                    </div>
                ) : ''
            }
            <Card>
                <CardBody>
                    <h4 className='m-0'>Settings</h4>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="row">
                                <label htmlFor="">Cart Abandoned Time</label>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        
                                        <input type="text" className='form-control custom_padding' placeholder='Time' name="inputedTime" value={data?.inputedTime} onChange={(e) => updateData(e)} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <Select
                                        name="timeType"
                                        options={deplayTime}
                                        value={deplayTime?.filter((curElem) => String(curElem?.value) === String(data?.timeType))}
                                        // onChange={(e) => setWhatsappJson({...whatsappJson, delay: e.value})}
                                        onChange={(e) => setData({...data, timeType: e.value})}
                                    />
                                </div>
                            </div>
                            

                        </div>
                    </div>
                </CardBody>
            </Card>
            <Row>
                <Col md="12">
                    <div className="d-flex justify-content-end align-items-center">
                        <a onClick={() => handleSubmit()} className='btn btn-primary'>Save</a>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default Settings