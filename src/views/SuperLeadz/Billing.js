import React, { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Input, Row } from 'reactstrap'
import ComTable from '../Components/DataTable/ComTable'
import { SuperLeadzBaseURL, getReq } from '../../assets/auth/jwtService'
import moment from 'moment/moment'
import { defaultFormatDate, getCurrentOutlet } from '../Validator'
import Spinner from '../Components/DataTable/Spinner'
import { Link, useNavigate } from 'react-router-dom'
import CardCom from '../Components/SuperLeadz/CardCom'
import { Copy, DollarSign, Eye, Info } from 'react-feather'
import { PermissionProvider } from '../../Helper/Context'

const SuperLeadzBilling = () => {

    const { userPermission } = useContext(PermissionProvider)

    const [tableData, setTableData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [chargesLoader, setChargesLoader] = useState(true)
    const [toLoadCampaign, setToLoadCampaign] = useState(false)
    const [billing, setBilling] = useState({
        usage_count: 0,
        usage_charge: 0,
        mainLoadeder: true,
        daysLeft: 0,
        trial_days: 0,
        mainData: [],
        price: ""
    })
    const outletData = getCurrentOutlet()
    const navigate = useNavigate()
    console.log(toLoadCampaign)
    const getData = () => {
        // const form_data = new FormData()
        // form_data.append('shop', outletData[0]?.web_url)
        // form_data.append('app', "superleadz")
        // form_data.append('type', "ALL")
        getReq('supperLeadzBilling', `?app_name=superleadz`)
        .then((data) => {
            console.log(data)
            setTableData(data?.data?.data?.transactions)
            setIsLoading(false)
        })
        .catch((error) => {
            console.log(error)
            setIsLoading(false)
        })
    }

    const planData = () => {
        setChargesLoader(true)
        
        const form_data = new FormData()
        form_data.append('shop', outletData[0]?.web_url)
        form_data.append('app', "superleadz")
        form_data.append('type', "ACTIVE")

        fetch(`${SuperLeadzBaseURL}/api/v1/get_active_shop_billing/`, {
            method: "POST",
            body: form_data
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data, "billing ")
            const updatedDate = data?.data?.filter((cur) => cur.is_active === 1)
            setToLoadCampaign(true)
            console.log(updatedDate[0]?.usage_count, "usage")
            const json = JSON.parse(updatedDate[0]?.plan_details_json)

            const setData = {
                usage_charge: updatedDate[0]?.billing_usage_apply_after,
                usage_count: updatedDate[0]?.usage_count,
                daysLeft: json?.created_at ? defaultFormatDate(moment(new Date()).diff(moment(json?.created_at), 'days'), userPermission?.user_settings?.date_format) : 0,
                trial_days: json?.trial_days,
                price: json?.price,
                mainData: data?.data
            }

            setBilling((preData) => ({
                ...preData,
                ...setData
            }))

            setChargesLoader(false)
        })
        .catch((error) => {
            console.log(error)
            const setData = {
                usage_charge: 0,
                usage_count: 0,
                daysLeft: 0,
                trial_days: 0,
                price: "",
                mainData: []
            }

            setBilling((preData) => ({
                ...preData,
                ...setData
            }))
            setChargesLoader(false)
            setToLoadCampaign(true)
        })
    }

    useEffect(() => {
        getData()
        planData()
    }, [])


    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = data.filter(item => {
                const startsWith =
                    item.contact.toLowerCase().startsWith(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else return null
            })

            setFilteredData(updatedData)
            setSearchValue(value)
        }
    }

    const columns = [
        {
            name: 'Start Date',
            cell: (row) => {
                // let data
                let date
                try {
                    // data = JSON.parse(row.plan_details_json)
                    date = defaultFormatDate(row?.payment_date, userPermission?.user_settings?.date_format)
                } catch (error) {
                    // data = {}
                    date = ''
                }
                return date
            }

        },
        {
            name: 'Plan',
            cell: (row) => {
                // let data
                // try {
                //     data = JSON.parse(row?.plan_name)
                // } catch (error) {
                //     data = {}
                // }
                return <span style={{textTransform: 'capitalize'}}>{row?.plan_name[0]?.membership_plan_name}</span>
            }
        },
        {
            name: 'Transaction ID',
            selector: (row) => row.transaction_no
        }
        // {
        //     name: 'Status',
        //     selector: row => {

        //         return (
        //             <>
        //                 {
        //                     row.is_active ? <span>
        //                         <div className="circle" style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#388E3C", marginRight: '4px', display: "inline-block" }}></div>
        //                         Active
        //                     </span> : <span>
        //                         <div className="circle" style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ea5455", marginRight: '4px', display: "inline-block" }}></div>
        //                         Inactive
        //                     </span>
        //                 }
        //             </>
        //         )
        //     }
        // }
    ]

    const defferContent = <>
        <Col className='d-flex align-items-center justify-content-center' md='4' sm='12'>
        <h4 className='m-0'>Details</h4>
        </Col>
        <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
        <Input
            className='dataTable-filter form-control ms-1'
            style={{ width: `180px`, height: `2.714rem` }}
            type='text'
            bsSize='sm'
            id='search-input-1'
            placeholder='Search...'
            value={searchValue}
            onChange={handleFilter}
        />
        </Col>
    </>


    return (
        <>
            {/* <Card>
                <CardBody>
                    <h4>Billing</h4>
                </CardBody>
            </Card> */}
            <Row className='match-height'>
                <Col className='col-md-6 cursor-default'>
                    <Card>
                        <CardBody>
                            <div className='icon d-flex justify-content-between align-items-center mb-1'>
                                <DollarSign size="27px" />
                            </div>
                            <div className="d-flex justify-content-between align-items-baseline">
                                {/* <p className="mb-0 h5 card-text position-relative cursor-default p-0">
                                    Current Plan
                                </p> */}
                                <p style={{ borderBottom: '0px dotted lightgray', whiteSpace: 'nowrap', paddingRight: '10px' }} className='m-0 h5 position-relative cursor-default'>
                                    Current Plan
                                    <span className='position-absolute' title={"The plan you are currently subscribed to"} style={{ top: '-10px', right: '-4px', cursor: 'pointer' }}><Info size={12} /></span>
                                </p>
                                <h3 className='m-0'>
                                    {billing?.mainData[0]?.plan_id}
                                </h3>
                            </div>
                            
                        </CardBody>
                    </Card>
                </Col>
                <Col className='col-md-6 cursor-default'>
                    <Card>
                        <CardBody>
                            <div className='icon d-flex justify-content-between align-items-center mb-1'>
                                <Eye sixeze="27px" />
                                <button onClick={() => {
                                    navigate("/merchant/SuperLeadz/joinus/", {state: {plan_id: billing?.mainData[0]?.plan_id, main: billing?.mainData}})
                                }} className='btn btn-sm btn-success text-white'>Upgrade</button>
                            </div>
                            <div className="d-flex justify-content-between align-items-baseline">
                                {/* <p className="mb-0 h5 card-text position-relative cursor-default p-0">
                                    Visits
                                </p> */}
                                <p style={{ borderBottom: '0px dotted lightgray', whiteSpace: 'nowrap', paddingRight: '10px' }} className='m-0 h5 position-relative cursor-default'>
                                    Remaining Visits
                                    <span className='position-absolute' title={"Visits remaining in your plan’s usage limit"} style={{ top: '-10px', right: '-4px', cursor: 'pointer' }}><Info size={12} /></span>
                                </p>
                                <h3 className='m-0'>
                                    {billing?.usage_count}/{billing?.usage_charge}
                                </h3>
                            </div>
                            
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6" className='d-none'>
                    <Card>
                        <CardBody>
                            {
                                chargesLoader ? <div className='d-flex justify-content-center align-items-center'><Spinner width='45px' /></div> : billing?.mainData.length === 0 ? <>
                                    <div className=" d-flex flex-column normal-card text-center">
                                        <h5>No Plan Purchased</h5>
                                        <div className='mt-1'>
                                            <Link to="/merchant/SuperLeadz/joinus/" className='btn btn-primary'>BUY NOW</Link>
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="normal-card">
                                        <div className='d-flex justify-content-between align-items-center flex-grow-1 w-100 mb-2'>
                                            {/* <img width={"25px"} src="https://static.vecteezy.com/system/resources/previews/000/512/317/non_2x/vector-wallet`-glyph-black-icon.jpg" alt="" /> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-clipboard"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                                            <button onClick={() => {
                                                navigate("/merchant/SuperLeadz/joinus/", {state: billing?.mainData[0]?.plan_id})
                                            }} className='btn btn-sm btn-success text-white'>Upgrade</button>
                                        </div>
                                        {
                                            chargesLoader ? <div className='d-flex justify-content-center align-items-center'><Spinner width='45px' /></div> : <div className="d-flex justify-content-between align-items-center w-100">
                                                <h4 style={{ borderBottom: '0px dotted lightgray', fontSize: '18px', position: "relative", cursor: 'pointer' }}>{<p style={{color:""}}>Your Current Plan is <span style={{color:"#48a441", textTransform: 'capitalize'}}>{billing?.mainData[0]?.plan_id}</span></p>}<span className='position-absolute cursor-pointer' title={`Plan that you have subscribed to`} style={{ top: '-8px', right: '-16px' }}></span></h4>
                                                <div className='d-flex gap-3 align-items-center'>
                                                    <p className='position-relative' style={{ fontSize: `0.85rem`, borderBottom: '0.5px dotted lightgray;', cursor: 'pointer' }} onClick={() => navigate('/leads')}>{"Pop-ups - "}</p>
                                                    <h5 style={{ fontSize: `3rem`, cursor:"default"}}>{`${billing?.usage_count}/${billing?.usage_charge}`}</h5>
                                                </div>
                                            </div>
                                        }
                                        
                                    </div>
                                </>
                            }
                            
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <ComTable
                        content={defferContent}
                        // tableName="Details"
                        tableCol={columns}
                        data={tableData}
                        searchValue={searchValue}
                        // handleFilter={handleFilter}
                        filteredData={filteredData}
                        isLoading={isLoading}
                        isAction={true}
                    />
                </CardBody>
            </Card>
        </>
    )
}

export default SuperLeadzBilling