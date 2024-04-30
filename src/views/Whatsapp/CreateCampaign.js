import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import Select from 'react-select'
import { getReq, postReq } from '../../assets/auth/jwtService'
import { useParams } from 'react-router-dom'
import { getCurrentOutlet } from '../Validator'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'

const CreateCampaign = () => {
    const { campaign_type, temp_id } = useParams()
    const [data, setData] = useState({
        campaign_name: "",
        trigger: "",
        delay: "0",
        delay_type: "minutes",
        template_id: temp_id,
        start_date: "",
        end_date: "",
        setDelay: false,
        setEndDate: false
    })
    const outletDetails = getCurrentOutlet()
    console.log(data)
    const [templateList, setTemplateList] = useState([])
    const deplayTime = [
        { label: "Minutes", value: "minutes" },
        { label: "Hours", value: "hours" },
        { label: "Days", value: "days" }
    ]

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
    
    const triggerList = [{label: "Order Created", value: "Order Created"}]


    const getDefaultData = () => {
        getReq("getTemplates")
        .then((resp) => {
            console.log(resp, "ppppppp")
            // setTemplateList(resp?.data?.data)
            const activeTemplate = resp?.data?.data?.map((curElem) => {
                if (resp?.data?.active_id.includes(curElem?.id)) {
                    return { label: curElem?.name, value: curElem?.id }
                } else {
                    return null
                }
            }).filter(elem => elem !== null)
            // console.log(activeTemplate, "ppppppp")
            setTemplateList(activeTemplate)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const updateData = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSave = (type) => {
        console.log(type)
        const convertedSecond = convertToSeconds({time: Number(data?.delay), type: data?.delay_type})
        const custom_json = {
            template: data?.template_id,
            delay: convertedSecond,
            trigger: data?.trigger
        }
        const form_data = new FormData()
        form_data.append('campaign_name', data?.campaign_name)
        form_data.append('campaign_type', campaign_type)
        form_data.append('custom_json', JSON.stringify(custom_json))
        form_data.append('shop', outletDetails[0]?.web_url)
        form_data.append('template_id', data?.template_id)
        form_data.append('start_date', data.start_date)
        form_data.append('end_date', data.end_date)

        postReq('whatsapp_create_campaign', form_data)
        .then((resp) => {
            console.log(resp)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getDefaultData()
    }, [])

    return (
        <>
            <style>
                {`
                    
                    .custom_padding {
                        padding: 0.571rem 1rem !important;
                        background-color: #fff;
                        background-clip: padding-box;
                        border: 1px solid #d8d6de;
                        border-radius: 0.357rem;
                        width: 100%
                    }
                `}

            </style>
            <Card>
                <CardBody>
                    <h4 className='m-0'>Create Campaign</h4>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-1">
                                                <label htmlFor="campagin_name">Campaign Name</label>
                                                <input type="text" className='custom_padding' name='campaign_name' placeholder='Campaign Name' onChange={(e) => updateData(e)} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-1">
                                                <label htmlFor="campagin_name">Template</label>
                                                <Select
                                                    options={templateList}
                                                    name="template_id"
                                                    placeholder="Select Template"
                                                    value={templateList?.filter((curElem) => String(curElem?.value) === String(data?.template_id))}
                                                    onChange={(e) => setData({...data, template_id: e.value})}
                                                    isDisabled={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-1">
                                                <label htmlFor="campagin_name">Trigger</label>
                                                <Select
                                                    options={triggerList}
                                                    name="trigger"
                                                    value={triggerList?.filter((curElem) => String(curElem?.value) === String(data?.trigger))}
                                                    onChange={(e) => setData({...data, trigger: e.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <label className='d-flex justify-content-start align-items-center gap-1'>
                                                    Set Delay
                                                    <input type="checkbox" className="form-check-input cursor-pointer" checked={data?.setDelay} onChange={() => setData({...data, setDelay: !data?.setDelay})} />
                                                </label>
                                                <div className="col-6">
                                                    <input type="text" className='custom_padding' placeholder='Delay' name='delay' onChange={(e) => updateData(e)} />
                                                </div>
                                                <div className="col-6">
                                                    <Select
                                                        options={deplayTime}
                                                        name="delay_type"
                                                        value={deplayTime?.filter((curElem) => String(curElem?.value) === String(data?.delay_type))}
                                                        onChange={(e) => setData({...data, delay_type: e.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Start Date</label>
                                            <Flatpickr options={{ minDate: "today", dateFormat: "Y-m-d" }} onChange={(e) => setData({...data, start_date: moment(e[0]).format('YYYY-MM-DD')})} className='form-control' placeholder="Start Date" value={data.start_date} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">End Date</label>
                                            <Flatpickr options={{ minDate: "today", dateFormat: "Y-m-d" }} onChange={(e) => setData({...data, end_date: moment(e[0]).format('YYYY-MM-DD')})} className='form-control' placeholder="End Date" value={data.end_date} />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="d-flex justify-content-end align-items-center gap-1">
                                            <a className='btn btn-primary' onClick={() => handleSave('save&close')}>Save & Close</a>
                                            <a className='btn btn-primary' onClick={() => handleSave('save')}>Save</a>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default CreateCampaign