import { useEffect, useState } from 'react'
import { Col, Row, Card, CardBody, Badge } from 'reactstrap'
// import { Link } from 'react-router-dom'
import StatsCard from './components/StatsCard'
// import instagram from '../../assets/images/referral/instagram.svg'
// import facebook from '../../assets/images/referral/square-facebook.svg'
// import X from '../../assets/images/referral/x-twitter.svg'
import { SuperLeadzBaseURL, getReq } from '../../assets/auth/jwtService'
// import axios from 'axios'
import { getCurrentOutlet } from '../Validator'
import RefferedTable from './components/RefferedTable'
import CardCom from '../Components/SuperLeadz/CardCom'
// import DataTableWithButtons from '../tables/data-tables/basic/TableMultilingual'
// import StatsCard from '../ui-element/Static'
import { Eye, Menu, User, Award, DollarSign, BarChart2, Instagram, Facebook, Hash } from 'react-feather'
import { FaXTwitter } from "react-icons/fa6"
import { MdAdsClick } from "react-icons/md"

const Dashboard = () => {
    const outletData = getCurrentOutlet()
    const [stats, SetStats] = useState()

    // const getData = () => {

    //     axios.get(`${SuperLeadzBaseURL}/referral/dashboard/?shop=${outletData[0]?.web_url}`)
    //         .then((resp) => {
    //             console.log(resp)
    //             SetStats(resp.data)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             // setIsLoading(false)
    //         })
    // }
    const getData = () => {
        getReq("referral_dashboard", `?shop=${outletData[0]?.web_url}`, SuperLeadzBaseURL)
        .then((resp) => {
            SetStats(resp.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => {
        getData()
        console.log('...', stats)
    }, [])

    return (
        <>

            <Card>
                <CardBody>

                    <Row className='match-height'>
                        <Col md={6}>
                            <CardCom icon={<Eye width={'27px'} />} title='Total views' data={stats?.total_views ?? 0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<Hash width={'27px'} />} title='Advocate Signups' data={stats?.advocate_signups ?? 0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<User width={'27px'} />} title='Total Referrals' data={stats?.total_referrals ?? 0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<Award width={'27px'} />} title='Total Redemptions' data={stats?.total_redemptions ?? 0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<DollarSign width={'27px'} />} title='Total Revenue' data={stats?.revenue ?? 0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<BarChart2 width={'27px'} />} title='Advocate Discounts Uses' data={stats?.advocate_discount_users ?? 0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<DollarSign width={'27px'} />} title='Total Earnings' data={stats?.total_earnings ?? 0} />
                        </Col>

                        <Col md={6}>
                            <CardCom icon={<MdAdsClick width={'27px'} className='fs-2' />} title='Total Clicks' data={stats?.total_clicks ?? 0} />

                        </Col>
                        <Col md={6}>
                            <CardCom icon={<Instagram width={'27px'} />} title='Instagram' data={stats?.instagram_clicks ?? 0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<Facebook width={'27px'} />} title='Facebook' data={stats?.facebook_clicks ?? 0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<FaXTwitter width={'27px'} className='fs-3' />} title='Twitter' data={stats?.twitter_clicks ?? 0} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <RefferedTable />
                </CardBody>
            </Card>
        </>
    )
}

export default Dashboard