import React, { useContext, useEffect, useState } from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import axios from "axios"
import { CheckCircle, Circle } from "react-feather"
// import pig from "../../assets/images/website-slide/pricing/pig.png"
// import money from "../../assets/images/website-slide/pricing/grow.png"
// import pro from "../../assets/images/website-slide/pricing/pro.png"
import { SuperLeadzBaseURL, postReq } from "../../assets/auth/jwtService"
import { getCurrentOutlet } from "../Validator"
import Spinner from "../Components/DataTable/Spinner"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import PricingCard from "./components/PricingCard"
import toast from "react-hot-toast"
import { PermissionProvider } from "../../Helper/Context"
import moment from "moment"
// import { PermissionProvider } from "../../Helper/Context"

const JoinUs = () => {
    // const [activeCard, setActiveCard] = useState()
    const [planData, setPlanData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const { userPermission, setUserPermission } = useContext(PermissionProvider)
    const { appName } = useParams()

    console.log(appName, "appName")
    const [selectedPlan, setSelectedPlan] = useState(location.state?.plan_id ? location.state?.plan_id : "grow plan")
    const purchaseDate = moment(new Date()).diff(moment(location.state?.main[0]?.created_at), 'days')
    const minutesDifference = moment().diff(moment(location.state?.main[0]?.created_at), 'minutes')
    console.log(purchaseDate, minutesDifference)
    const outletData = getCurrentOutlet()
    const callPlans = (id, data) => {

        if (data.plan_name === "Custom Pricing") {
            navigate("/merchant/support/")
            return
        }
        // e.preventDefault()
        console.log(data?.parent_plan_name)
        if (data?.parent_plan_name === "free") {
            const planName = data?.plan_name
            const url = new URL(`${SuperLeadzBaseURL}/api/v1/free_plan_shopify/`)
            const form = {
                app: appName?.toLowerCase(),
                shop: outletData[0]?.web_url,
                billing_plan_id: id,
                plan_name: data?.plan_name
            }
            const formData = new FormData()
            Object.entries(form).map(([key, value]) => {
                formData.append(key, value)
            })
            axios({
                method: "POST",
                data: formData,
                url
            })
            .then((resp) => {
                console.log(resp)
                if (data.plan_name === "Custom Pricing") {
                    toast.success("Custom plan activated")
                } else {
                    toast.success("Forever Free plan activated")

                }
                const form_data = new FormData()
                form_data.append('app', appName?.toLowerCase())
                const shop = userPermission?.multipleDomain.filter((cur) => cur.api_key === userPermission?.apiKey)
                form_data.append('shop', shop[0]?.web_url) 
                postReq('planSubscription', form_data)
                .then((resp) => {
                    console.log(resp)
                    if (appName.toLocaleLowerCase() === "superleadz") {
                        navigate("/merchant/SuperLeadz/billing/")
                    } else {
                        navigate("/merchant/Flash_Accounts/billing/")
                    }
                    setUserPermission({...userPermission, currentPlan: {...userPermission?.currentPlan, plan: planName}})
                })
                .catch((error) => {
                    console.log(error)
                })
                
                // console.log(
                //     data.data.response.recurring_application_charge.confirmation_url
                // )
                // if (data?.data?.response) {
                //     window.open(data.data.response.recurring_application_charge.confirmation_url)
                // }
            })
            .catch((error) => console.log(error))
        } else {
            const url = new URL(`${SuperLeadzBaseURL}/api/v1/billing/`)
            const form = {
                app: appName?.toLowerCase(),
                shop: outletData[0]?.web_url,
                billing_plan_id: id
            }
            const formData = new FormData()
            Object.entries(form).map(([key, value]) => {
                formData.append(key, value)
            })
            axios({
                method: "POST",
                data: formData,
                url
            })
            .then((data) => {
                console.log(
                    data.data.response.recurring_application_charge.confirmation_url
                )
                if (data?.data?.response) {
                    window.open(data.data.response.recurring_application_charge.confirmation_url)
                }
            })
            .catch((error) => console.log(error))

        }
    }

    // const handleCardClick = (card) => {
    //     setActiveCard(card === activeCard ? null : card)
    // }

    const getBilling = () => {

        fetch(`${SuperLeadzBaseURL}/api/v1/get/billing/?app=${appName?.toLowerCase()}`)
        .then((resp) => resp.json())
        .then((data) => {
            setPlanData(data?.billing_cards)
            setIsLoading(false)
        })
        .catch((error) => {
            console.log(error)
            setIsLoading(false)
        })

    }

    useEffect(() => {
        getBilling()
        console.log(location, "location")
    }, [])

    return (
        <>
            <style>
                {` 
                    .action {
                        width: 90%;
                        position: absolute;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    .points {
                        margin-bottom: 38px
                    }
                `}
            </style>


            <Row>
                <Col md='12'>
                    <Card>
                        <CardBody>
                            <div className="d-none justify-content-end align-items-center">
                                <a className="btn btn-outline-primary" onClick={() => {
                                  navigate(`/merchant/${appName}/joinus/`, {replace: true})
                                }}>Show All Plans</a>
                            </div>
                            <div className="textContent text-center pt-3">
                                <h2 className="pb-1" style={{ fontSize: '2rem' }}>Choose a Plan</h2>
                                <p> Start for free and upgrade when you want to. Cancel anytime. No hidden fees.</p>

                            </div>
                            <Row className="mb-2">
                                <Col className="col-lg-10 col-md-12 offset-lg-1 mt-3">
                                    <div className="row justify-content-center match-height">
                                        {
                                            isLoading ? <div className="d-flex justify-content-center align-items-center">
                                                <Spinner size={'40px'} />
                                            </div> : (
                                                <>
                                                    {
                                                        planData?.map((cur) => {
                                                            let details
                                                            try {
                                                                details = JSON.parse(cur?.details)
                                                            } catch (error) {
                                                                details = cur?.details
                                                            }
                                                            return cur.plan_name !== "Custom Pricing" ? <PricingCard minutesDifference={minutesDifference} purchaseDate={purchaseDate} data={cur} id={cur.id} title={cur.plan_name} price={cur.app_price} planTitle={cur.plan_name} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} callPlans={callPlans} btnCondition={String(location?.state?.plan_id).toLowerCase() === String(cur.plan_name).toLowerCase()} features={details ? details : []} popular={false} /> : ''
            
                                                        })
                                                    }

                                                    {
                                                        planData?.map((cur) => {
                                                            let details
                                                            try {
                                                                details = JSON.parse(cur?.details)
                                                            } catch (error) {
                                                                details = cur?.details
                                                            }
                                                            return cur.plan_name === "Custom Pricing" ? <PricingCard minutesDifference={minutesDifference} purchaseDate={purchaseDate} data={cur} id={cur.id} title={cur.plan_name} price={cur.app_price} planTitle={cur.plan_name} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} callPlans={callPlans} btnCondition={String(location?.state?.plan_id).toLowerCase() === String(cur.plan_name).toLowerCase()} features={details ? details : []} popular={false} /> : ''
            
                                                        })
                                                    }
                                                </>
                                            ) 
                                        }

                                    </div>
                                </Col>
                            </Row>
                            {/* <hr />
                            <div className="row page-pricing-free-trial-banner-bg">
                                <div className="col-md-10 col-12 d-flex align-center flex-md-row flex-column position-relative mx-auto">
                                    <div className="text-center text-md-start py-10 px-10 px-sm-0">
                                        <h3 className="text-h3 text-primary mb-2">
                                            Looking for Enterprise
                                        </h3>
                                        <p className="text-sm">
                                            You will get full access to all the features for 14 days.
                                        </p>
                                        <button
                                            type="button"
                                            className="btn btn-primary mt-4"
                                        >
                                            <span className="btn__content" data-no-activator="">
                                                Contact us
                                            </span>
                                        </button>
                                    </div>
                                    <div className="free-trial-illustrator">
                                        <div className="responsive img" style={{ width: 230 }}>
                                            <div
                                                className="responsive__sizer"
                                                style={{ paddingBottom: "113.636%" }}
                                            ></div>
                                            <img
                                                className="img__img img__img--contain"
                                                src="https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-1/assets/laptop-girl-35162850.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* <Row className="mt-3 mb-2">
                                <div className="text-center">
                                    <h4 className="mb-1">Overage (all plans): $0.001 / pop-up</h4>
                                    <h5 className="mb-1"><b>Enterprise</b></h5>
                                    <p className="mb-0"><u>Contact us</u> for enterprise-level customisation & pricing</p>
                                </div>
                            </Row> */}
                        </CardBody>
                    </Card>

                </Col>
            </Row>
        </>
    )
}

export default JoinUs
