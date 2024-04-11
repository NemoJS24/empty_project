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
            console.log(resp?.data?.app_list, "resprespresp")
            setInegrationList(resp?.data?.app_list)
            setConnectedList(resp?.data?.connected_app_list?.map((curElem) => curElem?.integrated_app?.slug))
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const integrationPlug = (data) => {
        if (!userPermission?.installedApps?.includes(data?.app?.slug)) {
            toast.error("App is not installed")
            return
        }
        setApiLoader(true)
        const form_data = new FormData()
        const status = connectedList.includes(data?.slug)
        form_data.append("slug", data?.slug ? data?.slug : "whatsapp")
        form_data.append("app_name", userPermission?.appName)
        form_data.append("connect", status ? "False" : "True")

        postReq("integrationPlug", form_data)
        .then((resp) => {
            console.log(resp)
            setConnectedList(resp?.data?.connected_app_list?.map((curElem) => curElem?.integrated_app?.slug))
            if (status) {
                toast.success("App Disconnected")
            } else {
                toast.success("App Integrated")
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
                                                title={curElem?.app_name}
                                                description={curElem?.description}
                                                icon={curElem?.logo}
                                                button={
                                                    <>
                                                        
                                                        <a onClick={() => integrationPlug(curElem)} className="btn btn-primary d-flex justify-content-center align-items-center w-100" style={{gap: '4px'}}>
                                                            {
                                                                connectedList.includes(curElem?.slug) ? (
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
