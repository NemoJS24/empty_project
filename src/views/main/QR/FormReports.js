import React, { useEffect, useState } from 'react'
import { getReq } from '../../../assets/auth/jwtService'
import { useParams } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'

const FormReports = () => {
    const { id } = useParams()
    const [formData, setFormData] = useState({})
    const getData = () => {
        getReq('form_view', `?id=${id}`)
        .then((resp) => {
            console.log(resp)
            setFormData(resp?.data?.data?.form_json ? JSON.parse(resp?.data?.data?.form_json) : {})
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <>
            <Card>
                <CardBody>
                    <h4 className="mb-0">Form Response</h4>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    {
                        Object.entries(formData).map(([key, value], index) => {
                            console.log(key, value)
                            return (
                                <>
                                    <div className='flex-column mb-1'>
                                        <h5 style={{marginBottom: '5px'}}>{index + 1}. {key}</h5>
                                        <h6 className="fw-light mb-0 d-flex flex-column" style={{marginLeft: '15px'}}> {value}</h6>
                                    </div>
                                </>
                            )
                        })
                    }
                </CardBody>
            </Card>
        
        </>
    )
}

export default FormReports