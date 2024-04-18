import React, { useContext, useEffect, useState } from "react"
import { BarChart2, RefreshCcw, Settings, User, Info, X, Copy } from "react-feather"
import { SuperLeadzBaseURL, getReq } from "../../assets/auth/jwtService"
import { CompleteTimelineName, formatNumberWithCommas, getCurrentOutlet, timelineName } from "../Validator"
import { PermissionProvider } from "../../Helper/Context"
import axios from "axios"
import CardCom from "../Components/SuperLeadz/CardCom"
import Spinner from "../Components/DataTable/Spinner"
import PieChart from "./components/PieChart"
import { Card, CardBody, Modal, ModalBody, ModalHeader } from "reactstrap"
import { ImCheckmark, ImCross } from 'react-icons/im'
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

const Dashboard = () => {
  const [data, setData] = useState({
    total_cust: "",
    total_non_guests: "",
    total_revenue: "",
    conversion_rate: "",
    email_subscribed: "",
    sms_subscribed: ""
  })

    const copyCode = (id) => {
        document.getElementById(id).select()
        document.execCommand('copy')
        console.log('True')
        toast.success('Copied!')  
    }

  const params = new URLSearchParams(location.search)
  const outletData = getCurrentOutlet()
  const [isLoading, setIsLoading] = useState(true)
  const [campaign, setCampaign] = useState({
    isCampagin: 0,
    campaignLoader: true,
    timeline: [],
    addScriptModel: false
  })
  // const [isCampagin, setIsCampagin] = useState(0)
  const outletDetail = getCurrentOutlet()
  const { userPermission } = useContext(PermissionProvider)

  const getDataMain = () => {
    axios.get(`${SuperLeadzBaseURL}/flash_accounts/flash_dash/?shop=${outletDetail[0]?.web_url}&app=${userPermission?.appName}`)
      .then((resp) => {
        console.log(resp)
        // setToggle(resp?.data?.status)
        const updatedData = {
          total_cust: resp?.data?.total_cust,
          total_non_guests: resp?.data?.total_non_guests,
          total_revenue: resp?.data?.total_revenue,
          conversion_rate: resp?.data?.conversion_rate,
          email_subscribed: resp?.data?.email_subscribed,
          sms_subscribed: resp?.data?.sms_subscribed
        }

        setData((preData) => ({
          ...preData,
          ...updatedData
        }))
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false)
      })
  }

  const checkCampaignStatus = () => {
    getReq('campaignData', `?app=${userPermission?.appName}`)
    .then((resp) => {
      console.log(resp)
      const timeLine = resp?.data?.data?.timeline

      const showingTimeLine = timeLine?.filter((curElem) => curElem?.isShow === 1)
      const completedTimeLine = timeLine?.filter((curElem) => curElem?.isShow === 1 && curElem?.isComplete === 1)
      let status
      
      if (showingTimeLine.length === completedTimeLine.length) {
        status = 1
      } else {
        status = 0
      }

      const updatedData = {
        isCampagin: status,
        campaignLoader: false,
        timeline: showingTimeLine
      }

      setCampaign((preData) => ({
        ...preData,
        ...updatedData
      }))
        // setIsCampagin(resp?.data?.data?.status)
    })
    .catch((error) => {
      console.log(error)
      const updatedData = {
        isCampagin: 0,
        campaignLoader: false,
        timeline: []
      }

      setCampaign((preData) => ({
        ...preData,
        ...updatedData
      }))
    })
  }

  const chargeApi = () => {
    const form_data = new FormData()
    form_data.append('charge_id', params.get('charge_id'))
    form_data.append('app', userPermission?.appName)
    form_data.append('shop', outletData[0]?.web_url)
    axios({
      method: "POST",
      data: form_data,
      url: `${SuperLeadzBaseURL}/api/v1/add/billing/`
    })
      .then((data) => {
        console.log(data)
        if (data?.data?.response === "billing created successfully") {
          // navigate('/merchant/SuperLeadz/')
          checkCampaignStatus()
          // cancelApi()

        } else {
          checkCampaignStatus()
        }
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    // getData()
    checkCampaignStatus()
    getDataMain()
    if (params.get('charge_id')) {
      chargeApi()
    }
  }, [])

  return (
    <>
      <div className="row">
        <div className="col-12">
          {
            campaign.campaignLoader ? <>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <Spinner size={'30px'} />
                  </div>

                </CardBody>
              </Card>
            </> : campaign.isCampagin === 0 ? (
              <>
                <Card>
                    <CardBody>
                        
                      <div className="left_side d-flex justify-content-between align-items-center mb-1">
                        <div className='bg-primary text-center rounded-right WidthAdjust' style={{ width: "250px", padding: "6px", marginLeft: '-25px' }}>
                          <h4 className='bb text-white m-0' style={{ fontSize: "16px" }}>Complete these steps</h4>
                        </div>
                      </div>
                      <div className="row justify-content-start align-items-center flex-nowrap overflow-auto">
                        {
                            campaign?.timeline?.map((curElem, key) => {
                              const url = curElem.key === "is_outlet_created" ? `${outletData[0]?.id}/` : ''
                              const color = curElem.isComplete ? 'success' : 'danger'
                              return (
                                <>
                                  <div key={key} className="boxs aa col-md p-2 d-flex justify-content-center align-item-center">
                                      {
                                          color === "success" ? <>
                                              <ImCheckmark color='#00c900' size={18}/>
                                          </> : <ImCross color="#dc3545" size={18} />
                                      }
                                      <h6 className={`boxPad text-black fw-bolder ${curElem.key === "is_extension_enabled" && userPermission?.appName === "flash_accounts" ? "" : "d-flex align-items-center"}  m-0`}>
                                          {
            
                                              curElem.key === "is_extension_enabled" ? (
                                                  color === "success" ? curElem.name : <>
                                                    <div onClick={() => setCampaign({...campaign, addScriptModel: true})} className={`d-flex justify-content-start align-items-start cursor-pointer`} style={{gap: '6px', color: '#007aff'}}>
                                                      Add Script
                                                      <span style={{ cursor: 'pointer', display: 'flex' }} title="This script allows the account creation form to swiftly appear on your store's Thank You page."><Info size={'12'} color="#464646" /></span>
                                                    </div>
                                                    <span style={{fontSize: '11px', fontWeight: '400'}}>Adding this script is crucial for the account creation form to appear on your store's Thank You page. Once the campaign is live and the script runs, this step is complete.</span>
                                                  </> 
                                              ) : (
                                                  color === "success" ? curElem.name : <Link to={`${timelineName[userPermission?.appName] ? timelineName[userPermission?.appName][curElem.key] : ''}${url}`}>
                                                      {curElem.name}
                                                  </Link>
                                              )
                                          }
                                          
                                      </h6>
                                  </div>
                                </>
                              )
                          })
                        }
                      </div>
                    </CardBody>
                </Card>
              </>
            ) : (
              <>
                <div className="card">
                  <div className="card-body d-flex justify-content-between">
                    <h4 className="m-0">Dashboard</h4>
                  </div>
                </div>
              </>
            )
          }
        </div>
      </div>

      <div className="row match-height">
        <div className="col-md-6">
          <CardCom id={"TotalFlashAccountsCreatedFlash"} icon={<User width={'27px'} />} title={<>Total Flash Accounts Created</>} data={!isLoading ? formatNumberWithCommas(data.total_non_guests) : <Spinner size={'25px'} /> } />
          <CardCom id={"GuestConversionRateFlash"} icon={<RefreshCcw width={'27px'} />} title={<>Guest Conversion Rate</>} data={!isLoading ? `${Number(data.conversion_rate).toFixed(2)}%` : <Spinner size={'25px'} />} info={`% of guest checkouts converted at Thank You page`} />
          <CardCom id={"RevenueGeneratedfromFlash"} icon={<RefreshCcw width={'27px'} />} title={<>Revenue Generated from<br />Flash Accounts Registered Customers</>} data={!isLoading ? formatNumberWithCommas(data.total_revenue) : <Spinner size={'25px'} /> } />
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body d-flex justify-content-center align-items-center">
              {!isLoading ? (
                <div style={{width: '350px', margin: 'auto'}}>
                  <PieChart labels={['Customers', 'Accounts Created', 'Email Subscribed', 'SMS Subscribed']} data={[data?.total_cust, data?.total_non_guests, data?.email_subscribed, data?.sms_subscribed]} />

                </div>
              ) : (
                <div>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        <Modal isOpen={campaign?.addScriptModel}>
            <ModalHeader toggle={() => setCampaign({...campaign, addScriptModel: !campaign?.addScriptModel})}>
              <div className="d-flex justify-content-start align-items-start" style={{gap: '6px'}}>
                Add Script
                <span style={{ cursor: 'pointer', display: 'flex' }} title="This script allows the account creation form to swiftly appear on your store's Thank You page."><Info size={'12'} /></span>

              </div>
            </ModalHeader>
            <ModalBody>
                <div className="d-flex justify-content-start align-items-center pb-2" style={{gap: '8px'}}>
                    <input
                        id="code1"
                        className="form-control"
                        value={`<script src="https://apps.xircls.com/static/flash_accounts/my_script.js"></script>`}
                    />
                    <div className="text-success btn btn-sm btn-outline-secondary" onClick={() => copyCode('code1')}>
                        <Copy size="18px" />
                    </div>
                </div>
                <p className="">Copy-paste this code into the "Additional Scripts" field in your Shopify store. <a target="_blank" href={`https://${outletData[0]?.web_url}/admin/settings/checkout`}>Take me there</a></p>

            </ModalBody>
        </Modal>
    </>
  )
}

export default Dashboard
