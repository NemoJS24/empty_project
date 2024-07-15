// import '@src/views/dashboard/Referral.css'
import { Col, Row, Card, CardBody } from 'reactstrap'
import LineChartWithCustomLegend from './components/LineChartWithCustomLegend'
import PieChartWithCustomLegend from './components/PieChartWithCustomLegend'
import CardCom from '../Components/SuperLeadz/CardCom'
// import PieChartWithCustomLegend from '../ui-element/PieChartWithCustomLegend'
// import LineChartWithCustomLegend from '../ui-element/LineGraphWithPercentage'
// import ResponsiveTable from '../tables/reactstrap/ResponsiveTable'
// import TableResponsive from '../tables/reactstrap/TableResponsive'
import { Users, CornerDownLeft, UserCheck, CreditCard, Gift, Command, CheckCircle, DollarSign, Target, Square, Layers, Columns } from 'react-feather'

const Reports = () => {

    return (
        <>
            <Card>
                <Row>
                    <Col sm={12} md={6} xl={4}>
                        <CardBody>
                            <div className='section-1-heading'>
                                <h4>Overview</h4>
                            </div>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
            <Card>
                <CardBody>
                    <div className='section-1-heading'>
                        <h4 className='ms-1' style={{ marginTop: "1vh", marginBottom: "3.2vh" }}>Customers</h4>
                    </div>
                    <Row>
                        <Col md={6}>
                            <div>
                                <CardCom icon={<Users width={'27px'} />} title='VISITS BY ALL LOYALTY CUSTOMERS' data={0} />

                            </div>
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<CornerDownLeft width={'27px'} />} title='VISITS BY RETURNING CUSTOMERS' data={0} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<UserCheck width={'27px'} />} title='NEW SIGN-UPS' data={0} />
                        </Col>
                    </Row>

                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <div className='section-1-heading'>
                        <h4 className='ms-1' style={{ marginTop: "1vh", marginBottom: "3.2vh" }}>Top Customers</h4>
                    </div>

                </CardBody>
            </Card>

            <Row>
                <Col sm={12} md={12} xl={12}>
                    <Card>
                        <CardBody>
                            {/* <ResponsiveTable></ResponsiveTable>  */}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <div className='section-1-heading'>
                        <h4 className='ms-1' style={{ marginTop: "1vh", marginBottom: "3.2vh" }}>Rewards Redeemed</h4>
                    </div>

                </CardBody>
            </Card>

            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            {/* <TableResponsive></TableResponsive> */}
                        </CardBody>
                    </Card>
                </Col>
            </Row>


            <Card>
                <CardBody>
                    <div className='section-1-heading'>
                        <h4 className='ms-1' style={{ marginTop: "1vh", marginBottom: "3.2vh" }}>Referrals</h4>
                    </div>
                    <Row>
                        <Col md={6}>
                            <CardCom icon={<CheckCircle width={'27px'} />} title='Successful Referrals' data={"XX"} />
                        </Col>
                        <Col md={6}>
                            <CardCom icon={<DollarSign width={'27px'} />} title='Amount Earned via Referrals' data={"Rs.XX"} />
                        </Col>
                    </Row>

                </CardBody>
            </Card>

                <Card>
                    <CardBody>
                        <div className='section-1-heading'>
                            <h4 className='ms-1' style={{ marginTop: "1vh", marginBottom: "3.2vh" }}>Rewards Issued</h4>
                        </div>
                        <Row>
                            <Col md={6}>
                                <CardCom icon={<CreditCard width={'27px'} />} title=' Store Credit Issued' data={"Rs.XX"} />
                            </Col>
                            <Col md={6}>
                                <CardCom icon={<Gift width={'27px'} />} title='Gift Cards Issued' data={"Rs.XX"} />
                            </Col>
                            <Col md={6}>
                                <CardCom icon={<Command width={'27px'} />} title=' Offers Issued' data={"Rs.XX"} />
                            </Col>
                        </Row>

                    </CardBody>
                </Card>

            <Card>
                    <CardBody>
                        <div className='section-1-heading'>
                            <h4 className='ms-1' style={{ marginTop: "1vh", marginBottom: "3.2vh" }}>Rewards Redeemed</h4>
                        </div>
                        <Row>
                            <Col md={6}>
                                <CardCom icon={<Target width={'27px'} />} title='Total Rewards Redeemed' data={"XX"} />
                            </Col>
                            <Col md={6}>
                                <CardCom icon={<DollarSign width={'27px'} />} title='Total Rewards Value Redeemed' data={"Rs.XX"} />
                            </Col>
                            <Col md={6}>
                                <CardCom icon={<CreditCard width={'27px'} />} title='Store Credit Redeemed' data={"Rs.XX"} />
                            </Col>
                            <Col md={6}>
                                <CardCom icon={<Square width={'27px'} />} title='Gift Cards Redeemed' data={"Rs.XX"} />
                            </Col>
                            <Col md={6}>
                                <CardCom icon={<Layers width={'27px'} />} title='Offers Redeemed' data={"Rs.XX"} />
                            </Col>
                            <Col md={6}>
                                <CardCom icon={<Columns width={'27px'} />} title='Samples Redeemed' data={"Rs.XX"} />
                            </Col>
                        </Row>

                    </CardBody>
                </Card>

        </>
    )
}

export default Reports