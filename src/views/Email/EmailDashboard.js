/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { AlignCenter, Check, Clock, UserPlus, Users } from 'react-feather'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { PermissionProvider } from '../../Helper/Context'
import { getReq } from '../../assets/auth/jwtService'
import Spinner from '../Components/DataTable/Spinner'
import CardCom from '../Components/SuperLeadz/CardCom'

const EmailDashboard = () => {
    const [cancel, setCancel] = useState(false)
    const [useDashboardData, setDashboardData] = useState('')
    const isLoading = false

    useEffect(() => {
        getReq('email_dashboard_view')
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

            <Row>
                <Card>
                    <CardBody>
                        <h4 className='m-0'>Dashboard</h4>
                    </CardBody>
                </Card>
            </Row>

            <Row className='match-height'>

                <Col className='col-md-6 cursor-default'>
                    <CardCom icon={<img src='https://cdn-icons-png.flaticon.com/512/1773/1773345.png' width='27px' />} title="Active Plan" data={!isLoading ? `Free` : <Spinner size={'25px'} />} />
                </Col>

                <div className='col-md-6 cursor-default'>
                    <Link to="/merchant/Email/reports/emailReport" >
                        <CardCom icon={<Check width={'27px'} />} title="Sent Emails" data={useDashboardData?.total_sent ?? 0} />
                    </Link>
                </div>
                <div className='col-md-6 cursor-default'>
                    <Link to="/merchant/Email/reports/emailReport" >
                        <CardCom icon={<Clock width={'27px'} />} title="Schedule Emails" data={useDashboardData?.total_sent ?? 0} />
                    </Link>
                </div>

                <div className='col-md-6 cursor-default'>
                    <Link to="/merchant/Email/templates" >
                        <CardCom icon={<AlignCenter width={'27px'} />} title="Total Templates" data={useDashboardData?.total_template ?? 0} />
                    </Link>
                </div>

                <div className='col-md-6 cursor-pointer'>
                    <Link to="/merchant/Email/import" >
                        <CardCom icon={<UserPlus width={'27px'} />} title="Total Emails" data={useDashboardData?.total_contact ?? 0} />
                    </Link>

                </div>

                <div className='col-md-6 cursor-default'>
                    <Link to='/merchant/Email/group'>
                        <CardCom icon={<Users width={'27px'} />} title="Total Groups" data={useDashboardData?.total_group ?? 0} />
                    </Link>
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

export default EmailDashboard