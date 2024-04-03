import React, { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { getReq, postReq } from '../../assets/auth/jwtService'
import { PermissionProvider } from '../../Helper/Context'
import IntegrationCard from './components/IntegrationCard'
import { ChevronRight } from 'react-feather'
import toast from 'react-hot-toast'
import Spinner from '../Components/DataTable/Spinner'
import FrontBaseLoader from '../Components/Loader/Loader'

export const Integrations = () => {

    const { userPermission } = useContext(PermissionProvider)
    const [integrationList, setInegrationList] = useState([])
    const [connectedList, setConnectedList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [apiLoader, setApiLoader] = useState(false)
    // console.log(setConnectedList)

    const getData = () => {
        setIsLoading(true)
        getReq("integration", `?app_name=${userPermission?.appName}`)
        .then((resp) => {
            setInegrationList(resp?.data?.app_list)
            setConnectedList(resp?.data?.connected_app_list?.map((curElem) => curElem?.unique_id))
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const integrationPlug = (data) => {
        if (!userPermission?.installedApps?.includes(data?.integration_app[0]?.slug)) {
            toast.error("App is not installed")
            return
        }
        setApiLoader(true)
        const form_data = new FormData()
        const status = connectedList.includes(data?.integration_app[0]?.unique_id)
        form_data.append("slug", data?.integration_app[0]?.unique_id)
        form_data.append("app_name", userPermission?.appName)
        form_data.append("connect", status ? "False" : "True")

        postReq("integrationPlug", form_data)
        .then((resp) => {
            console.log(resp)
            setConnectedList(resp?.data?.connected_app_list?.map((curElem) => curElem?.unique_id))
            if (status) {
                toast.success("Disconnected")
            } else {
                toast.success("Connected")
            }
        })
        .catch((error) => {
            console.log(error)
            toast.error("Something went wrong!")
        })
        .finally(() => {
            setApiLoader(false)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            {
                apiLoader ? <FrontBaseLoader /> : ''
            }
            <Card>
                <CardBody>
                    <h4 className='m-0'>
                        Integrations
                    </h4>
                </CardBody>
            </Card>

            <Row>

                {
                    isLoading ? <>
                        <div className='d-flex justify-content-center align-items-center'>
                            <Spinner size={'30px'} />
                        </div>
                    </> : (
                        integrationList?.length > 0 ? (
                            integrationList?.map((curElem, key) => {
                                return (
                                    <>
                                        <Col xxl="3" xl="4" md="6" key={key}>
                                            <IntegrationCard
                                                title={curElem?.integration_app[0]?.app_name}
                                                description={curElem?.integration_app[0]?.description}
                                                icon={curElem?.integration_app[0]?.logo}
                                                button={
                                                    <>
                                                        
                                                        <a onClick={() => integrationPlug(curElem)} className="btn btn-primary d-flex justify-content-center align-items-center w-100" style={{gap: '4px'}}>
                                                            {
                                                                connectedList.includes(curElem?.integration_app[0]?.unique_id) ? (
                                                                    <>
                                                                        Disconnect <ChevronRight size="17px" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Connect <ChevronRight size="17px" />
                                                                    </>
                                                                )
                                                            }
                                                            
                                                        </a>
                                                    </>
                                                }
                                            />
                                        </Col>
                                    </>
                                )
                            })
                        ) : <>
                            <div className='text-center'>
                                <h5>There are no records to display</h5>
                            </div>
                        </>
                    )
                }
                
            </Row>
        </>
    )
}
