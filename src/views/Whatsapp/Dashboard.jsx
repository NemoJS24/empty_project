import React, { useContext, useEffect, useState } from 'react'
import { PermissionProvider } from '../../Helper/Context'
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import { AiFillPhone, AiOutlineMail, AiOutlineQuestion } from 'react-icons/ai'
import Flatpickr from "react-flatpickr"
import Spinner from '../Components/DataTable/Spinner'
import CardCom from '../Components/SuperLeadz/CardCom'
import { Activity, AlignCenter, Check, Percent, Shield, User, UserCheck, UserPlus, Users } from 'react-feather'
import { SiConvertio } from 'react-icons/si'
import { BiDollar } from 'react-icons/bi'
import { getCurrentOutlet } from '../Validator'
import { getReq } from '../../assets/auth/jwtService'
import WhatsappCampaign from './WhatsappCampaign'

const Dashboard = () => {
    const { userPermission } = useContext(PermissionProvider)
    const outletData = getCurrentOutlet()
    const [filterType, setSetFilterType] = useState("week")
    const [cancel, setCancel] = useState(false)
    const toLoadCampaign = true
    const [campaignLoader, setCampaignLoader] = useState(false)
    const [isCampagin, setIsCampagin] = useState(false)
    const [useDashboardData, setDashboardData] = useState('')
    const isLoading = false
    const options = [
        { value: "all", label: "Lifetime" },
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "year", label: "This Year" },
        { value: "custom", label: "Custom" }
    ]
    useEffect(() => {
        getReq('campaignData', `?app=${userPermission?.appName}`)
            .then((resp) => {
                // console.log(resp)
                setCampaignLoader(true)
                const timeLine = resp?.data?.data?.timeline

                const showingTimeLine = timeLine?.filter((curElem) => curElem?.isShow === 1)
                const completedTimeLine = timeLine?.filter((curElem) => curElem?.isShow === 1 && curElem?.isComplete === 1)

                if (showingTimeLine.length === completedTimeLine.length) {
                    setIsCampagin(1)
                } else {
                    setIsCampagin(0)
                }
                // setIsCampagin(resp?.data?.data?.status)
            })
            .catch((error) => {
                console.log(error)
                setCampaignLoader(true)
            })

        getReq('whatsapp_dashboard_view')
            .then((resp) => {
                console.log(resp)
                setDashboardData(resp.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    return (
        <div>
            <style>
                {`
                    .apexcharts-toolbar {
                        display: none;
                    }
                `}
            </style>

            <div className="row match-height">

                {
                    campaignLoader ? (isCampagin === 0 || isCampagin === "0") ? (
                        <>
                            <div className=''>
                                <div className="col-md-12">
                                    <Card>
                                        <CardBody>

                                            <div className="left_side d-flex justify-content-between align-items-center mb-1">
                                                <div className='bg-primary text-center rounded-right WidthAdjust' style={{ width: "425px", padding: "6px", marginLeft: '-25px' }}>
                                                    <h4 className='bb text-white m-0' style={{ fontSize: "16px" }}>Complete these steps to convert leads faster!</h4>
                                                </div>
                                            </div>
                                            {/* <div className='cc text-center my-1 rounded-right ' style={{ width: "40px", padding: "6px", position: "absolute", left: "30px", top: "-1px", rotate: "290deg", zIndex: "-999", backgroundColor: "#4233ea" }}>
                                                <h4 className='text-info'>Complete</h4>
                                            </div> */}
                                            <div className="row justify-content-start align-items-center flex-nowrap overflow-auto">
                                                <WhatsappCampaign toLoadCampaign={toLoadCampaign} outletData={outletData} />
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>

                        </>

                    ) : (
                        <div className="col-md-12">
                            <Card>
                                <CardBody>
                                    <div className='row'>
                                        <div className='col-md-4 d-flex justify-content-start align-items-center'>
                                            <h4 className='m-0'>Dashboard</h4>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='d-flex justify-content-center align-items-center h-100 gap-1'>
                                                {/* <Link className="btn btn-primary" to="/merchant/SuperLeadz/"> Quick Set-Up</Link> */}
                                                <Link className="btn btn-primary" to="/merchant/SuperLeadz/themes/"> Create Campaign</Link>
                                            </div>

                                        </div>
                                        <div className='col-md-4'>
                                            <div className="parent d-flex justify-content-end align-items-center gap-1">
                                                <div className="left_side d-flex justify-content-end align-items-center gap-1">
                                                    <select className='form-control' style={{ width: '140px' }} onChange={(e) => setSetFilterType(e.target.value)}>
                                                        {
                                                            options.map((curElem) => {
                                                                return <option value={curElem.value} selected={curElem.value === filterType}>{curElem.label}</option>
                                                            })
                                                        }
                                                    </select>

                                                    {
                                                        filterType === "custom" ? (
                                                            <div className="custom">
                                                                <Flatpickr options={{ // Sets the minimum date as 14 days ago
                                                                    maxDate: "today", // Sets the maximum date as today
                                                                    mode: "range",
                                                                    dateFormat: "Y-m-d"
                                                                }} className='form-control' value={selectedData} onChange={(date) => setSelectedData(date)} id='default-picker' placeholder='Search' />

                                                            </div>
                                                        ) : ''
                                                    }
                                                </div>
                                                <div className="right_side">
                                                    <div className="d-flex justify-content-end align-items-start gap-1">
                                                        <Link to='/merchant/create_support/' className='shedule_btn btn btn-sm btn-primary btnCustom text-nowrap' title="Support">
                                                            <AiFillPhone size={14} style={{ marginBottom: "2px" }} />
                                                        </Link>
                                                        <Link to='/merchant/SuperLeadz/faq/' className='shedule_btn btn btn-sm btn-primary btnCustom text-nowrap' title="FAQ">
                                                            <AiOutlineQuestion size={14} style={{ marginBottom: "2px" }} />
                                                            {/* <span className='boxPadbtn' style={{fontSize:"11px"}}>Support</span> */}
                                                        </Link>
                                                        <Link to='/merchant/SuperLeadz/billing/' className='shedule_btn btn btn-sm btn-primary btnCustom text-nowrap' title="Billing">
                                                            <BiDollar size={14} style={{ marginBottom: "2px" }} />
                                                            {/* <span className='boxPadbtn' style={{fontSize:"11px"}}>Support</span> */}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    ) : <Card>
                        <CardBody>
                            <div className='w-100 d-flex justify-content-center align-items-center'>
                                <Spinner size={'25px'} />
                            </div>
                        </CardBody>
                    </Card>
                }
            </div>

            <Row className='match-height'>

                <Col className='col-md-6 cursor-default'>
                    <CardCom icon={<img src='https://cdn-icons-png.flaticon.com/512/1773/1773345.png' width='27px' />} title="Active Plan"  data={!isLoading ? `Free` : <Spinner size={'25px'} />} />
                </Col>

                <div className='col-md-6 cursor-default'>
                    <Link to="/merchant/whatsapp/reports/template" >
                        <CardCom icon={<Check width={'27px'} />} title="Total Sent Templates" data={useDashboardData?.total_sent ?? 0 }  />
                    </Link>
                </div>

                <div className='col-md-6 cursor-default'>
                    <Link to="/merchant/whatsapp/message" >
                        <CardCom icon={<AlignCenter width={'27px'} />} title="Total Templates" data={useDashboardData?.total_template ?? 0 }  />
                    </Link>

                </div>
                <div className='col-md-6 cursor-default'>
                    <CardCom icon={<Activity width={'27px'} />} title="Active Campaign" data={useDashboardData?.active_campaign ?? 0 }  />
                </div>
                <div className='col-md-6 cursor-default'>
                    <CardCom icon={<Shield width={'27px'} />} title="Approved Templates" data={useDashboardData?.approved_template ?? 0 }  />
                </div>

                <div className='col-md-6 cursor-pointer'>
                    <Link to="/merchant/whatsapp/whatsapp_contact/" >
                        <CardCom icon={<UserPlus width={'27px'} />} title="Total Contacts" data={useDashboardData?.total_contact ?? 0 }  />
                    </Link>

                </div>

                <div className='col-md-6 cursor-default'>
                    <CardCom icon={<Users width={'27px'} />} title="Total Groups" data={useDashboardData?.total_group ?? 0 }  />
                </div>

            </Row>

            <Row className='match-height'>

                <Modal
                    isOpen={cancel}
                    toggle={() => setCancel(!cancel)}
                    className='modal-dialog-centered'
                >
                    <ModalHeader toggle={() => setCancel(!cancel)}>Are you sure you want cancel the Plan</ModalHeader>
                    <ModalBody>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline onClick={() => setCancel(!cancel)}>
                            No
                        </Button>
                        <Button color='primary' onClick={() => cancelTrial()}>
                            Yes
                        </Button>
                    </ModalFooter>
                </Modal>
            </Row>

        </div>
    )
}

export default Dashboard