/* eslint-disable no-unused-vars */
import moment from 'moment/moment'
import React, { useContext, useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { PermissionProvider } from '../../Helper/Context'
import { getReq, postReq } from '../../assets/auth/jwtService'
// import { getCurrentOutlet } from '../Validator'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Edit, Info } from 'react-feather'
import { defaultFormatDate } from '../Validator'
// import pixels from "../../assets/images/superLeadz/pixels.png"
import AdvanceServerSide from '../Components/DataTable/AdvanceServerSide'

const EmailCampaigns = ({ custom = false, name = "All Campaigns", draft = true, create = true }) => {
    const { userPermission } = useContext(PermissionProvider)

    const [count, setCount] = useState(30)
    const [useTableData, setTableData] = useState([])
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)

    const [isLoading, setIsLoading] = useState(false)


    const [deleteModal, setDeleteModal] = useState(false)
    const [checkedThemes, setCheckedThemes] = useState([])

    const getAllThemes = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
        const form_data = new FormData()
        Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
        form_data.append("page", currentPage + 1)
        form_data.append("size", currentEntry)
        form_data.append("searchValue", searchValue)
        postReq("email_campaign_details", form_data)
            .then(res => {
                console.log(res.data)
                setCount(res.data.email_instance_count)
                setTableData(res.data.email_instance)
            })
            .catch(error => {
                // Handle errors here
                console.error('Error:', error)
                // toast.error(error.response.data.error)
            })
    }

    const columns = [
        {
            name: 'Campaign Name',
            selector: row => {
                return (
                    <div className='p-2 d-flex  justify-content-start align-items-center gap-1 '>
                        {/* <img src="https://fronty.com/static/uploads/1111.jpg" style={{ objectFit: "cover" }} className='w-100 rounded-1 ' height={100} alt="" /> */}
                        <div>{row.template_campaign_name ?? ''}</div>
                    </div>
                )
            },
            type: "text",
            isEnable: true
        },
        {
            name: 'Template Name',
            selector: row => {
                return (
                    <div>{row.template_template_name ?? ''}</div>
                )
            },
            type: "text",
            isEnable: true
        },
        {
            name: 'Status',
            selector: row => {
                return <>
                    <div className='form-check form-switch form-check-success cursor-pointer d-flex justify-content-start p-0' style={{cursor: 'pointer'}}>
                        <input className='form-check-input cursor-pointer m-0' type='checkbox' id='verify' defaultChecked={row.whatsapp_is_active} onChange={(e) => confirmStatus(e, row.whatsapp_id)} />
                    </div>
                </>
            },
            type: 'select',
            options: [
                { label: "Select", value: "" },
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 },
                { label: "Draft", value: "is_draft" }
            ],
            isEnable: true
        },
        {
            name: 'Sender Email',
            selector: row => <div>{row.template_sender ?? ''}</div>,
            dataType: 'offer_code',
            type: 'date',
            isEnable: true
        },
        {
            name: 'Created On',
            selector: row => <span className='cursor-pointer'>{`${defaultFormatDate(row.template_created_at, userPermission?.user_settings?.date_format)}, ${moment(row.template_created_at).format('HH:mm:ss')}`}</span>,
            dataType: 'offer_code',
            type: 'date',
            isEnable: true
        },
        // {
        //     name: 'Schedule at',
        //     selector: row => <span className='cursor-pointer'>{`${defaultFormatDate(row.timestamp_schedule, userPermission?.user_settings?.date_format)}, ${moment(row.timestamp_schedule).format('HH:mm:ss')}`}</span>,
        //     dataType: 'offer_code',
        //     type: 'date',
        //     isEnable: true
        // },
        {
            name: 'Actions',
            minWidth: '10%',
            cell: (row) => {
                return (<div className='d-flex gap-'>
                    {
                        row.status === "completed" ? <button className='btn' onClick={toggle} ><Edit size={18} /></button> : <button className='btn' onClick={toggle} ><Edit size={18} /></button>
                    }

                    {/* <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"  />
                    </div> */}

                </div>
                )
            },
            isEnable: true
        }

    ]
    const RenderData = ({ title, data, info }) => {
        return <>
            <Card>
                <CardBody>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 style={{ borderBottom: '0px dotted lightgray', fontSize: '18px', whiteSpace: 'nowrap', paddingRight: '10px' }} className='m-0 position-relative cursor-default'>
                            {title}
                            {info ? <span className='position-absolute' title={info} style={{ top: '-10px', right: '-4px', cursor: 'pointer' }}><Info size={12} /></span> : ''}
                        </h4>
                        <h4 className='m-0' style={{ fontSize: '2rem', cursor: "default", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {data}
                        </h4>
                    </div>
                </CardBody>
            </Card>
        </>
    }
    const ExpandedData = (data) => {
        console.log("data tempokate", data)
        return (
            <div className='mt-2'>
                <h5>Sender Email : {data.data.template_sender} </h5>
                <h5>Delay : {data.data.template_delay}s </h5>

                <Row className='mt-2'>
                    <Col md="4">
                        <RenderData title="Total Sent" data={data.data.template_template_sent ?? 0} />
                    </Col>
                    <Col md="4">
                        <RenderData title="Delivered" data={data.data.template_template_delivered ?? 0} />
                    </Col>
                    <Col md="4">
                        <RenderData title="Read" data={data.data.template_template_read ?? 0} />
                    </Col>
                    <Col md="4">
                        <RenderData title="Clicks" data={data.data.template_template_click ?? 0} />
                    </Col>
                    <Col md="4">
                        <RenderData title="Failed" data={data.data.template_template_failed ?? 0} />
                    </Col>

                </Row>

            </div>
        )
    }

    const deleteContent = <button onClick={() => {
        setDeleteModal(!deleteModal)
    }} className="btn btn-danger d-block">Deleting {checkedThemes.length} items</button>

    return (
        <>
            <style>
                {`
            
                    .dropdown-menu-custom.dropdown-menu[data-popper-placement]:not([data-popper-placement^="top-"]) {
                        top: -100px !important;
                        left: -100px !important;
                    }

                    .datatableView {
                        padding: 5px 13px;
                        cursor: pointer
                    }

                    .datatableView.active {
                        background: #464646;
                        color: #fff
                    }

                    .grid-card {
                        margin-bottom: 1.5rem;
                        box-shadow: 0 4px 15px -8px #464646;
                        border: 1px solid #efefef;
                        background-color: #ffffff;
                    }
                `}
            </style>

            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <AdvanceServerSide
                                custom={custom}
                                tableName={name}
                                tableCol={columns}
                                data={useTableData}
                                isLoading={isLoading}
                                count={count}
                                // advanceFilter={true}
                                isExpand={true}
                                ExpandableTable={ExpandedData}
                                getData={getAllThemes}
                                selectableRows={true}
                                selectedRows={checkedThemes}
                                setSelectedRows={setCheckedThemes}
                                deleteContent={deleteContent}
                                create={create}
                                createLink={"/merchant/email/create-campaign/type/"}
                                createText={"Create Campaign"}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default EmailCampaigns