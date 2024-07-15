/* eslint-disable no-unused-vars */
import moment from 'moment/moment'
import React, { useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
// import { PermissionProvider } from '../../Helper/Context'
import { postReq } from '../../../assets/auth/jwtService'
// import { getCurrentOutlet } from '../Validator'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Edit, Info, Trash } from 'react-feather'
import { getCurrentOutlet } from '../../Validator'
// import pixels from "../../assets/images/superLeadz/pixels.png"
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const Campaigns = ({ custom = false, name = "All Campaigns", draft = true, create = true }) => {
    // const { userPermission } = useContext(PermissionProvider)

    const [count, setCount] = useState(30)
    const [useTableData, setTableData] = useState([])
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)
    const [isLoading, setIsLoading] = useState(true)
    const outletData = getCurrentOutlet()
    const navigate = useNavigate()
    const [deleteModal, setDeleteModal] = useState(false)
    const [checkedThemes, setCheckedThemes] = useState([])

    const getAllThemes = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
        setIsLoading(true)
        const form_data = new FormData()
        Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
        form_data.append("page", currentPage + 1)
        form_data.append("size", currentEntry)
        form_data.append("searchValue", searchValue)
        postReq("whatsapp_view_campaign", form_data)
        .then(res => {
            console.log(res.data)
            setCount(res.data.whatsapp_count)
            setTableData(res.data.whatsapp)
        })
        .catch(error => {
            // Handle errors here
            console.error('Error:', error)
            // toast.error(error.response.data.error)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const checkState = (e, id) => {
        const form_data = new FormData()

        form_data.append('status', e.target.checked)
        form_data.append('id', id)
        form_data.append('action', "ACTIVE")
        form_data.append('shop', outletData[0]?.web_url)

        postReq("change_campaign_status", form_data)
        .then((resp) => {
            console.log(resp, "ppp")
            e.target.checked ? toast.success('Campaign Activated ') : toast.success('Campaign Deactivated ')
            getAllThemes()
        })
        .catch((error) => {
            console.log(error)
            toast.error('Something went wrong')
        })
    }

    const confirmStatus = (e, id) => {
        console.log(e)
        let text = ""
        if (e.target.checked) {
            text = "<h4>Are you sure you want activate this Campaign</h4>"
        } else {
            text = "<h4>Are you sure you want deactivate this Campaign</h4>"
        }
        Swal.fire({
            title: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367f0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
            }).then((result) => {
            if (result.isConfirmed) {
                checkState(e, id)
            } else {
                e.target.checked = !e.target.checked
            }
        })

    }

    const deleteCampaign = (id) => {
        console.log(id)
        // const form_data = new FormData()
        // form_data.append('action', "DELETE")
        // form_data.append('id', id)
        // postReq('change_campaign_status', form_data)
        // then((resp) => {
        //     console.log(resp)
        // })
        // .catch((error) => {
        //     console.log(error)
        // })
    }

    const confirmDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this campagin",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#7367f0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                deleteCampaign(id)
            }
        })
    }

    const columns = [
        {
            name: 'Campaign Name',
            selector: row => row?.whatsapp_campaign_name,
            type: "text",
            isEnable: true
        },
        {
            name: 'Template Name',
            selector: row => row?.whatsapp_template,
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
            name: 'Created On',
            selector: row => row?.whatsapp_created_at && moment(row?.whatsapp_created_at).format('YYYY-MM-DD'),
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
                return (
                    <>
                        <div className='d-flex justify-content-start align-items-center gap-1'>
                            <Link to={`/merchant/whatsapp/create-campaign/${row?.whatsapp_campaign_type}/${row?.whatsapp_template_id}/${row?.whatsapp_id}`}><Edit size={18} /></Link>
                            <a className='text-danger d-none' onClick={() => confirmDelete(row?.whatsapp_id)}>
                                <Trash size={18} />
                            </a>
                        </div>
                    </>
                )
            },
            isEnable: true
        }

    ]
    const RenderData = ({ title, data, info, url }) => {
        return <>
            <Card onClick={() => url && navigate(url)} className={'cursor-pointer'}>
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
                {/* <h5>Sender Number : {data.data.template_sender} </h5> */}
                {/* <h5>Delay : {data.data.template_delay}s </h5> */}

                <Row className='mt-2'>
                    <Col md="4">
                        <RenderData title="Total Sent" data={data?.data?.whatsapp_campaign_sent ?? 0} url={`/merchant/whatsapp/sent_reports/${data?.data?.whatsapp_id}`} />
                    </Col>
                    <Col md="4">
                        <RenderData title="Delivered" data={data?.data?.whatsapp_campaign_delivered ?? 0} />
                    </Col>
                    <Col md="4">
                        <RenderData title="Read" data={data?.data?.whatsapp_campaign_read ?? 0} />
                    </Col>
                    {/* <Col md="4">
                        <RenderData title="Clicks" data={data?.data?.whatsapp_campaign_click ?? 0} />
                    </Col> */}
                    <Col md="4">
                        <RenderData title="Failed" data={data?.data?.whatsapp_campaign_failed ?? 0} />
                    </Col>
                    {/* <Col md="4">
                        <RenderData title="Replies" data={data?.data?.whatsapp_campaign_failed ?? 0} />
                    </Col> */}

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
                                createLink={"/merchant/whatsapp/create-campaign/type/"}
                                createText={"Create Campaign"}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Campaigns