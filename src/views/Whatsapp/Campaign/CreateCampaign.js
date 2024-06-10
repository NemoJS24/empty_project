import React, { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import Select from 'react-select'
import { getReq, postReq } from '../../../assets/auth/jwtService'
import { useNavigate, useParams } from 'react-router-dom'
import { getCurrentOutlet, validForm } from '../../Validator'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import toast from 'react-hot-toast'
import { PermissionProvider } from '../../../Helper/Context'

const CreateCampaign = () => {
    const { campaign_type, temp_id, campaign_id } = useParams()
    const { userPermission } = useContext(PermissionProvider)
    const valueToCheck = [
        {
            name: 'campaign_name',
            message: 'Please enter campaign name',
            type: 'string',
            id: 'campaign_name'
        },
        {
            name: 'trigger',
            message: 'Please select trigger',
            type: 'string',
            id: 'trigger'
        },
        {
            name: 'delay',
            message: 'Please enter delay',
            type: 'string',
            id: 'delay'
        },
        {
            name: 'template_id',
            message: 'Please select template',
            type: 'string',
            id: 'template_id'
        },
        {
            name: 'start_date',
            message: 'Please select start date',
            type: 'string',
            id: 'start_date'
        }
    ]
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
    const [triggerList, setTriggerList] = useState([])
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
    
    // const triggerList = [{label: "Order Created", value: "Order Created"}]


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

        getReq('get_trigger_events', `?app=${userPermission?.appName}&platform=Shopify`)
        .then((resp) => {
            console.log(resp)
            setTriggerList(resp?.data?.data?.map((curElem) => {
                return {label: curElem?.name, value: curElem?.topic}
            }))
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const updateData = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const navigate = useNavigate()

    const handleSave = (type) => {
        const checkForm = validForm(valueToCheck, data)
        console.log(checkForm)
        if (checkForm) {
            console.log(type)
            const convertedSecondVal = convertToSeconds({time: Number(data?.delay), type: data?.delay_type})
            const custom_json = {
                template: data?.template_id,
                delay: data?.delay,
                convertedSecond: convertedSecondVal,
                delay_type: data?.delay_type,
                trigger: data?.trigger
            }
            const form_data = new FormData()
            form_data.append('campaign_name', data?.campaign_name)
            form_data.append('campaign_type', campaign_type)
            form_data.append('custom_json', JSON.stringify(custom_json))
            form_data.append('shop', outletDetails[0]?.web_url)
            form_data.append('template_id', data?.template_id)
            form_data.append('start_date', data.start_date)
            if (data.end_date) {
                form_data.append('end_date', data.end_date)
            }
            if (campaign_id) {
                form_data.append('id', campaign_id)
            }

            postReq('whatsapp_create_campaign', form_data)
            .then((resp) => {
                console.log(resp)
                toast.success('Campaign Saved Successfully')
                if (type === "save&close") {
                    navigate('/merchant/whatsapp/campaigns')
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    const getCampaignDeatils = () => {
        getReq('whatsapp_create_campaign', `?campaign_id=${campaign_id}`)
        .then((data) => {
            console.log(data?.data?.data?.custom_json, "ppppppppppppp")
            const custom_json_data = JSON.parse(data?.data?.data?.custom_json)
            const updateData = {
                campaign_name: data?.data?.data?.campaign_name,
                trigger: custom_json_data?.trigger,
                delay: custom_json_data?.delay,
                delay_type: custom_json_data?.delay_type,
                template_id: custom_json_data?.template,
                start_date: data?.data?.data?.start_date ? moment(data?.data?.data?.start_date).format('YYYY-MM-DD hh:mm:ss') : "",
                end_date: data?.data?.data?.end_date ? moment(data?.data?.data?.end_date).format('YYYY-MM-DD hh:mm:ss') : "",
                setDelay: false,
                setEndDate: false
            }

            setData((preData) => ({
                ...preData,
                ...updateData
            }))
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getDefaultData()
        if (campaign_id) {
            getCampaignDeatils()
        }
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

                    .custom_padding:disabled {
                        background-color: #efefef;
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
                                                <input type="text" className='custom_padding' name='campaign_name' placeholder='Campaign Name' value={data?.campaign_name} onChange={(e) => updateData(e)} />
                                                <p id="campaign_name_val" className="text-danger m-0 p-0 vaildMessage"></p>
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
                                                <p id="template_id_val" className="text-danger m-0 p-0 vaildMessage"></p>
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
                                                <p id="trigger_val" className="text-danger m-0 p-0 vaildMessage"></p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <label className='form-group d-flex justify-content-start align-items-center gap-1'>
                                                    Set Delay
                                                    {/* <input type="checkbox" className="form-check-input cursor-pointer" checked={data?.setDelay} onChange={() => setData({...data, setDelay: !data?.setDelay})} /> */}
                                                </label>
                                                <div className="col-6">
                                                    <input type="text" className='custom_padding' value={data?.delay} placeholder='Delay' name='delay' onChange={(e) => {
                                                        if (!isNaN(e.target.value)) {
                                                            updateData(e)
                                                        }
                                                    }} />
                                                </div>
                                                <div className="col-6">
                                                    <Select
                                                        options={deplayTime}
                                                        name="delay_type"
                                                        // isDisabled={!data?.setDelay}
                                                        value={deplayTime?.filter((curElem) => String(curElem?.value) === String(data?.delay_type))}
                                                        onChange={(e) => setData({...data, delay_type: e.value})}
                                                    />
                                                </div>
                                                <p id="delay_val" className="text-danger m-0 p-0 vaildMessage"></p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Start Date</label>
                                            <Flatpickr options={{ dateFormat: "Y-m-d" }} onChange={(e) => setData({...data, start_date: moment(e[0]).format('YYYY-MM-DD hh:mm:ss')})} className='form-control' placeholder="Start Date" value={data.start_date} />
                                            <p id="start_date_val" className="text-danger m-0 p-0 vaildMessage"></p>
                                        </div>
                                        <div className="col-md-6">
                                            <label className='form-group d-flex justify-content-start align-items-center gap-1'>
                                                End Date
                                                {/* <input type="checkbox" className="form-check-input cursor-pointer" checked={data?.setEndDate} onChange={() => setData({...data, setEndDate: !data?.setEndDate})} /> */}
                                            </label>
                                            <Flatpickr options={{ minDate: "today", dateFormat: "Y-m-d" }} onChange={(e) => setData({...data, end_date: moment(e[0]).format('YYYY-MM-DD hh:mm:ss')})} className='form-control' placeholder="End Date" value={data.end_date} />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="d-flex justify-content-end align-items-center gap-1">
                                            <a className='btn btn-primary' onClick={() => handleSave('save&close')}>Save & Close</a>
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