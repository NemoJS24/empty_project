// import axios from 'axios'
import React, { useState } from 'react'
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledButtonDropdown } from 'reactstrap'
// import { SuperLeadzBaseURL } from '../../../assets/auth/jwtService'
import Spinner from '../DataTable/Spinner'
import { Info, Monitor, Smartphone } from 'react-feather'

const CampaignWiseData = ({campaignData}) => {

    console.log({campaignData})

    // const [isLoading, setIsLoading] = useState(true)
    const [displayType, setDisplayType] = useState("")
    console.log(displayType, "displayType")
    const condition = displayType ? `${displayType.toLowerCase()}_` : ''
    // const [data, setData] = useState({
    //     impression: "",
    //     conversion: "",
    //     conversion_rate: "",
    //     engaged: "",
    //     ctr: "",
    //     revenue: "",
    //     immediatelyClosed: "",
    //     leads: "",
    //     offer_sent: "",
    //     redirected: ""
    // })

    // console.log(data)

    // const getData = () => {
    //     // const form_data = new FormData()
    //     // form_data.append('theme_id', campaignData.id)
    //     axios.get(`${SuperLeadzBaseURL}/api/v1/pop_up_analytics/?theme_id=${campaignData.id}&is_filter=${displayType}`)
    //     .then((resp) => {
    //         console.log(resp)
    //         const condition = displayType ? `${displayType.toLowerCase()}_` : ''
    //         const updatedData = {
    //             impression: resp?.data?.data[`${condition}pop_up_view`],
    //             conversion: resp?.data?.data?.conversion,
    //             conversion_rate: resp?.data?.data?.conversion_rate,
    //             engaged: resp?.data?.data[`${condition}clicks`],
    //             ctr: (resp?.data?.data?.clicks && resp?.data?.data[`${condition}pop_up_view`]) ? Number(resp?.data?.data[`${condition}clicks`] / resp?.data?.data[`${condition}pop_up_view`] * 100).toFixed(2) : 0,
    //             revenue: resp?.data?.data?.Revenue,
    //             immediatelyClosed: resp?.data?.data[`${condition}immediate_closed`] ? resp?.data?.data[`${condition}immediate_closed`] : 0,
    //             leads: resp?.data?.data?.total_leads,
    //             offer_sent: resp?.data?.data?.offer_sent,
    //             redirected: resp?.data?.data[`${condition}offer_clicked`]
    //         }
    //         setData((preData) => ({
    //             ...preData,
    //             ...updatedData
    //         }))
    //         setIsLoading(false)
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //         setIsLoading(false)
    //     })
    // }

    // useEffect(() => {
    //     getData()
    // }, [displayType])

    const RenderData = ({title, data, info}) => {
        return <>
            <Card>
                <CardBody>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 style={{ borderBottom: '0px dotted lightgray', fontSize: '18px', whiteSpace: 'nowrap', paddingRight: '10px' }} className='m-0 position-relative cursor-default'>
                            {title}
                            {info ? <span className='position-absolute' title={info} style={{ top: '-10px', right: '-4px', cursor: 'pointer' }}><Info size={12} /></span> : ''}
                        </h4>
                        <h4 className='m-0' title={data} style={{ fontSize: '2rem', cursor:"default", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {data}
                        </h4>
                    </div>
                </CardBody>
            </Card>
        </>
    }

    return (
        <>
            <Card>
                <CardBody>
                    <Row>
                        <Col md="12">
                            <div className="d-flex justify-content-end align-items-center mb-2">
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle color='dark' style={{ padding: "0.5rem" }} className='hide-after-dropdown rounded'>
                                        {
                                            displayType === "DESKTOP" ? (
                                                <div title='Performance on desktop devices only'>
                                                    <Monitor size={"18px"} />
                                                </div>
                                            ) : displayType === "MOBILE" ? (
                                                <div title='Performance on mobile devices only'>
                                                    <Smartphone size={"18px"} />
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center gap-2" title='Overall campaign performance'>
                                                    <Monitor size={"18px"} /><Smartphone size={"18px"} />
                                                </div>
                                            )
                                        }
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                        <DropdownItem onClick={() => {
                                            setDisplayType("DESKTOP")
                                        }} className={`w-100`}>
                                            Desktop View Only
                                        </DropdownItem>
                                        <DropdownItem onClick={() => {
                                            setDisplayType("MOBILE")
                                        }} className={`w-100`}>
                                            Mobile View Only
                                        </DropdownItem>
                                        <DropdownItem onClick={() => setDisplayType("")} className={`w-100`}>
                                            Desktop and Mobile View
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3">
                            <RenderData title="Impressions" data={campaignData[`${condition}pop_up_view`]} info={`Number of times pop-up was shown.`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="Conversions" data={campaignData[`${condition}conversion`]} info={`Number of redemptions.`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="Conversion %" data={`${Number(campaignData[`${condition}conversion_rate`]).toFixed(2)}%`} info={`(Number of redemptions / Total number of leads) * 100`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="Engagements" data={campaignData[`${condition}clicks`]} info={`Total pop-up button clicks (includes OTP request and Redeem clicks)`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="CTR" data={`${(campaignData?.clicks && campaignData[`${condition}pop_up_view`]) ? Number(campaignData[`${condition}clicks`] / campaignData[`${condition}pop_up_view`] * 100).toFixed(2) : 0}%`} info={`The percentage of clicks relative to the total number of impressions`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="Campaign Revenue" data={`${localStorage.getItem("userPermission") ? JSON.parse(localStorage.getItem("userPermission")).currencySymbol : ""}${campaignData[`${condition}Revenue`]}`} info={`Total earnings from all transactions directly attributable to that campaign`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="Immediately closed" data={campaignData[`${condition}immediate_closed`] ? campaignData[`${condition}immediate_closed`] : 0} info={`Pop-up closed within 2 second`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="Leads" data={campaignData[`${condition}total_leads`]} info={`Total instances of visitors submitting their contact information through a SuperLeadz pop-up`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="Offers Given" data={campaignData[`${condition}offer_sent`]} info={`Total number of offers given to visitors/leads within the pop-up`} />
                        </Col>
                        <Col md="3">
                            <RenderData title="Offer Button Redirects" data={campaignData[`${condition}offer_clicked`]} info={`Total number of page redirects from offer CTA button`} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    )
}

export default CampaignWiseData