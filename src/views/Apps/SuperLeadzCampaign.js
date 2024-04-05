import React, { useContext, useEffect, useState } from 'react'
import { getReq } from '../../assets/auth/jwtService'
// import Timeline from '@components/timeline'
// import MomentTime from '../Components/Time-Moment/MomentTime'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { PermissionProvider } from '../../Helper/Context'
import Spinner from '../Components/DataTable/Spinner'
import { Link } from 'react-router-dom'
import { CompleteTimelineName, getCurrentOutlet, timelineName } from '../Validator'
// import toast from 'react-hot-toast'
import { ImCheckmark } from 'react-icons/im'

const SuperLeadzCampaign = ({toLoadCampaign, outletData}) => {

    const { userPermission } = useContext(PermissionProvider)
    const [data, setData] = useState({
        timeLine: [],
        isLoading: true
    })

    // const [isCampagin, setIsCampagin] = useState(0)
    // const navigate = useNavigate()
    console.log(userPermission)
    const outletDetails = getCurrentOutlet()

    const getData = () => {

        setData({...data, isLoading: true})
        getReq('campaignData', `?app=${userPermission?.appName}`)
        .then((resp) => {
            console.log(resp)
            const updatedData = {
                timeLine: resp?.data?.data?.timeline,
                isLoading: false
            }
            setData((preData) => ({
                ...preData,
                ...updatedData
            }))
            // setIsCampagin(resp?.data?.data?.status)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        if (toLoadCampaign) {
            getData()
        }
    }, [toLoadCampaign])
    
    // const startCampagin = () => {
    //     const form_data = new FormData()
    //     form_data.append('app', userPermission.appName)
    //     postReq('startCampagin', form_data)
    //     .then((resp) => {
    //         console.log(resp)
    //         const updatedPermission = {
    //             campaign: resp?.data?.status
    //         }
    //         setUserPermission((curElem) => ({
    //             ...curElem,
    //             ...updatedPermission
    //         }))
    //         toast.success('Campaign Started')
    //         navigate("/merchant/dashboard/")
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //         toast.error('Something went wrong!')
    //     })
    // }

    return (
        <>
        {
            data.isLoading ? <div> <Spinner size={'30px'} /> </div> : data?.timeLine.filter((cur) => cur.isShow).map((curElem, key) => {

                const url = curElem.key === "is_outlet_created" ? `${outletDetails[0]?.id}/` : ''
                const color = curElem.isComplete ? 'success' : 'danger'
                return (
                    <div key={key} className="boxs aa col-md p-2 d-flex justify-content-center align-item-center">
                        {
                            color === "success" ? <>
                                <ImCheckmark color='#00c900' size={20}/>
                            </> : ''
                        }
                        <h6 className='boxPad text-black fw-bolder d-flex align-items-center'>
                            {

                                curElem.key === "is_extension_enabled" ? (
                                    color === "success" ? curElem.name : <a target='_blank' href={`https://${outletData[0]?.web_url}/admin/themes/current/editor?context=apps`}>
                                        {curElem.name}
                                    </a>
                                ) : (
                                    color === "success" ? <Link to={`${CompleteTimelineName[userPermission?.appName] ? CompleteTimelineName[userPermission?.appName][curElem.key] : ''}${url}`}>
                                        {curElem.name}
                                    </Link> : <Link to={`${timelineName[userPermission?.appName] ? timelineName[userPermission?.appName][curElem.key] : ''}${url}`}>
                                        {curElem.name}
                                    </Link>
                                )
                            }
                            
                        </h6>

                    </div>
                )
            })
        }
        </>
    )
}

export default SuperLeadzCampaign