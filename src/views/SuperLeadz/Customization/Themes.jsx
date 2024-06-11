import React, { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import skeletonBg from "./skeleton.svg"
import { Home } from 'react-feather'
import { SuperLeadzBaseURL } from '../../../assets/auth/jwtService'
import { PermissionProvider } from '@src/Helper/Context.js'
import DynamicForm from '@src/views/FlashAccounts/components/DynamicForm'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentOutlet, SuperLeadzTone, SuperLeadzPurpose, SuperLeadzStrategy } from '../../Validator'
import JsonToJsx from '../../Components/SuperLeadz/JsonToJsx'
import { AiOutlineDesktop, AiOutlineMobile } from 'react-icons/ai'
// import axios from 'axios'
import Spinner from '@src/views/Components/DataTable/Spinner.js'

const Themes = () => {

    const navigate = useNavigate()
    // const outletData = getCurrentOutlet()
    const [contWidth, setContWidth] = useState(600)

    const defaultType = {
        SuperLeadzPurpose: [],
        SuperLeadzStrategy: [],
        SuperLeadzTone: []
    }
    const [isLoading, setIsloading] = useState(true)
    const [filterType, setFilterType] = useState(defaultType)
    const { userPermission } = useContext(PermissionProvider)
    const [allThemes, setAllThemes] = useState([])
    const outletDetail = getCurrentOutlet()

    useEffect(() => {
        // const getUrl = new URL(`${SuperLeadzBaseURL}/api/v1/form_builder_template/?shop=${outletData[0]?.web_url}&app=superleadz`)
        // axios({
        //     method: "GET",
        //     url: getUrl
        // }).then((data) => {
        //     setThemeLength(data?.data?.success?.length)
        // }).catch((err) => {
        //     console.log(err)
        // })

        const innerCard = document.getElementById("themeContainer-0")

        if (Boolean(innerCard)) {
            const resizeObserver = new ResizeObserver(entries => {
                let contentWidth
                for (const entry of entries) {
                    contentWidth = entry.contentRect.width
                }
                setContWidth(contentWidth)
            })
            resizeObserver.observe(innerCard)

            return () => resizeObserver.unobserve(innerCard)
        }
    }, [])

    const getData = () => {
        fetch(`${SuperLeadzBaseURL}/api/v1/add_default_theme/?app=${userPermission?.appName}&shop=${outletDetail[0]?.web_url}`)
            .then((data) => data.json())
            .then((resp) => {
                setAllThemes(resp?.success)
                setIsloading(false)
                setFilterType({ ...filterType, SuperLeadzPurpose: SuperLeadzPurpose.map((curElem) => curElem?.id), SuperLeadzStrategy: SuperLeadzStrategy.map((curElem) => curElem?.id), SuperLeadzTone: SuperLeadzTone.map((curElem) => curElem?.id) })
            })
            .catch((error) => {
                console.log(error)
                setIsloading(false)
            })
    }

    useEffect(() => {
        getData()
    }, [])

    const filteredData = allThemes?.filter((curElem) => {
        const defaultTheme = JSON.parse(curElem?.default_theme)
        return (
            filterType?.SuperLeadzPurpose?.some(value => defaultTheme?.SuperLeadzPurpose?.includes(value)) &&
            filterType?.SuperLeadzStrategy?.some(value => defaultTheme?.SuperLeadzStrategy?.includes(value)) &&
            filterType?.SuperLeadzTone?.some(value => defaultTheme?.SuperLeadzTone?.includes(value))
        )
    })
    

    const [phoneView, setPhoneView] = useState(filteredData.map(() => {
        return false
    }))
    const strategyFilter = SuperLeadzStrategy?.filter((curElem) => {
        const list = curElem?.SuperLeadz_purpose_id?.some((pur_id) => {
            return filterType.SuperLeadzPurpose.includes(pur_id)
        })
        return list
    })

    const toneFilter = SuperLeadzTone?.filter((curElem) => {
        return curElem?.SuperLeadz_strategy_id?.some((strat_id) => {
            return filterType.SuperLeadzStrategy.includes(strat_id)
        })
    })
    useEffect(() => {
        const updatedStrategyFilter = SuperLeadzStrategy.filter(strategy => {
            const relatedPurposes = strategy.SuperLeadz_purpose_id
            return relatedPurposes.every(purpose => filterType.SuperLeadzPurpose.includes(purpose))
        })
        // console.log("updatedStrategyFilter", updatedStrategyFilter)
        setFilterType(prevState => ({
            ...prevState,
            SuperLeadzStrategy: updatedStrategyFilter.map(strategy => strategy.id)
        }))

        const strategyFilter = SuperLeadzStrategy?.filter((curElem) => {
            const list = curElem?.SuperLeadz_purpose_id?.some((pur_id) => {
                // console.log(filterType.SuperLeadzPurpose.includes(pur_id))
                return filterType.SuperLeadzPurpose.includes(pur_id)
            })
            // console.log("117", list)
            return list
        })


        setFilterType({ ...filterType, SuperLeadzStrategy: strategyFilter.map((curElem) => curElem?.id) })

    }, [filterType.SuperLeadzPurpose])

    useEffect(() => {
        const updatedToneFilter = SuperLeadzTone.filter(tone => {
            const relatedStrategies = tone.SuperLeadz_strategy_id
            return relatedStrategies.every(strategy => filterType.SuperLeadzStrategy.includes(strategy))
        })
        setFilterType(prevState => ({
            ...prevState,
            SuperLeadzTone: updatedToneFilter.map(tone => tone.id)
        }))
        const toneFilter = SuperLeadzTone?.filter((curElem) => {
            const list2 = curElem?.SuperLeadz_strategy_id?.some((strat_id) => {
                // console.log(filterType.SuperLeadzStrategy.includes(strat_id))
                return filterType.SuperLeadzStrategy.includes(strat_id)
            })
            return list2
        })

        setFilterType({ ...filterType, SuperLeadzTone: toneFilter.map((curElem) => curElem?.id) })


    }, [filterType.SuperLeadzStrategy])

    return (
        <Container fluid className='px-0'>

            <style>
                {`
                    .flash_themes.active {
                        border: 1px solid #ccc
                        border-radius: 6px
                    }
                `}
            </style>
            <div className="d-flex justtify-content-center align-items-start">
                <div className="navHere" style={{ width: '350px', height: '100%', padding: '0px 20px 10px' }}>
                    <Card>
                        <CardBody>

                            <div className={`mb-2 d-flex justify-content-start align-items-center gap-1 flash_themes cursor-pointer ${[...SuperLeadzStrategy, ...SuperLeadzTone, ...SuperLeadzPurpose].length === [...filterType?.SuperLeadzPurpose, ...filterType?.SuperLeadzTone, ...filterType?.SuperLeadzStrategy].length ? 'active' : ''}`} onClick={() => {
                                if ([...SuperLeadzStrategy, ...SuperLeadzTone, ...SuperLeadzPurpose].length === [...filterType?.SuperLeadzPurpose, ...filterType?.SuperLeadzTone, ...filterType?.SuperLeadzStrategy].length) {
                                    setFilterType(defaultType)
                                } else {
                                    setFilterType({ ...filterType, SuperLeadzPurpose: SuperLeadzPurpose.map((curElem) => curElem?.id), SuperLeadzStrategy: SuperLeadzStrategy.map((curElem) => curElem?.id), SuperLeadzTone: SuperLeadzTone.map((curElem) => curElem?.id) })
                                }
                            }} style={{ padding: '10px' }}>
                                <Home size={'20px'} />
                                <h4 className='m-0'>All Themes</h4>
                            </div>

                            <div className={`mb-2`} style={{ padding: '10px' }}>
                                <h4 className='m-0'>Purpose</h4>
                                <div className="checkboxs mt-1">
                                    {
                                        SuperLeadzPurpose?.map((curElem, key) => {
                                            return <div key={key} className="d-flex align-items-center justify-content-between gap-1 form-check form-check-success m-0" style={{ padding: '0px', paddingBottom: '8px' }}>
                                                <label style={{ fontSize: "15px" }} htmlFor="keep_email_check">{curElem?.label}</label>
                                                <input value={curElem?.id} id="keep_email_check" checked={filterType.SuperLeadzPurpose.includes(curElem?.id)} type='checkbox' className='form-check-input m-0 p-0 cursor-pointer' name="email_check" onChange={(e) => {
                                                    e.target.checked ? setFilterType({ ...filterType, SuperLeadzPurpose: [...filterType.SuperLeadzPurpose, e.target.value] }) : setFilterType({ ...filterType, SuperLeadzPurpose: [...filterType?.SuperLeadzPurpose.filter((curElem) => curElem !== e.target.value)] })
                                                }} />
                                            </div>
                                        })
                                    }

                                </div>
                            </div>

                            <div className={`mb-2`} style={{ padding: '10px' }}>
                                {
                                    strategyFilter.length > 0 ? <>
                                        <h4 className='m-0'>Strategy</h4>
                                        <div className="checkboxs mt-1">
                                            {
                                                strategyFilter.map((curElem, key) => {
                                                    return <div key={key} className="d-flex align-items-center justify-content-between gap-1 form-check form-check-success m-0" style={{ padding: '0px', paddingBottom: '8px' }}>
                                                        <label style={{ fontSize: "15px" }} htmlFor="keep_email_check">{curElem?.label}</label>
                                                        <input value={curElem?.id} id="keep_email_check" checked={filterType.SuperLeadzStrategy.includes(curElem?.id)} type='checkbox' className='form-check-input m-0 p-0 cursor-pointer' name="email_check" onChange={(e) => {
                                                            e.target.checked ? setFilterType({ ...filterType, SuperLeadzStrategy: [...filterType.SuperLeadzStrategy, e.target.value] }) : setFilterType({ ...filterType, SuperLeadzStrategy: [...filterType?.SuperLeadzStrategy?.filter((curElem) => curElem !== e.target.value)] })
                                                        }} />
                                                    </div>
                                                })
                                            }

                                        </div>

                                    </> : ""
                                }
                            </div>

                            <div className={`mb-2`} style={{ padding: '10px' }}>
                                {
                                    toneFilter.length > 0 ? <>
                                        <h4 className='m-0'>Tone</h4>
                                        <div className="checkboxs mt-1">
                                            {
                                                toneFilter.map((curElem, key) => {
                                                    return <div key={key} className="d-flex align-items-center justify-content-between gap-1 form-check form-check-success m-0" style={{ padding: '0px', paddingBottom: '8px' }}>
                                                        <label style={{ fontSize: "15px" }} htmlFor="keep_email_check">{curElem?.label}</label>
                                                        <input value={curElem?.id} id="keep_email_check" checked={filterType.SuperLeadzTone.includes(curElem?.id)} type='checkbox' className='form-check-input m-0 p-0 cursor-pointer' name="email_check" onChange={(e) => {
                                                            e.target.checked ? setFilterType({ ...filterType, SuperLeadzTone: [...filterType.SuperLeadzTone, e.target.value] }) : setFilterType({ ...filterType, SuperLeadzTone: [...filterType?.SuperLeadzTone?.filter((curElem) => curElem !== e.target.value)] })
                                                        }} />
                                                    </div>
                                                })
                                            }

                                        </div>
                                    </> : ''
                                }
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className="content_here w-100">
                    <Row className='match-height '>
                        {
                            !isLoading ? filteredData?.length > 0 ? filteredData?.map((theme, key) => {
                                return (
                                    <Col className='d-flex flex-column align-items-stretch' md={6} key={key}>
                                        <Card>
                                            <CardBody>
                                                <div id={`themeContainer-${key}`} style={{ aspectRatio: "16/9" }}>
                                                    <div className="d-flex justify-content-center align-items-center rounded position-relative m-auto innerRect" style={{ aspectRatio: phoneView[key] ? '3/4' : '16/9', height: '100%', backgroundSize: "100%", backgroundImage: `url(${skeletonBg})`, backgroundColor: "rgba(0,0,0,0.25)", backgroundBlendMode: "soft-light" }}>
                                                        <div className='position-absolute w-100' style={{ scale: `${(((contWidth - 200) * 100) / contWidth) / 100}` }}>
                                                            <JsonToJsx key={key} isMobile={phoneView[key]} renderObj={JSON.parse(theme?.default_theme)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center gap-2 mt-2">
                                                    <h3 className="mb-0">{JSON.parse(theme?.default_theme)?.theme_name}</h3>
                                                    <button onClick={() => {
                                                        if (typeof phoneView[key] === 'undefined') {
                                                            navigate('/merchant/SuperLeadz/new_customization/?isMobile=false')
                                                        } else {
                                                            navigate(`/merchant/SuperLeadz/new_customization/?isMobile=${phoneView[key]}`)
                                                        }

                                                        // navigate(`/merchant/SuperLeadz/new_customization/?isMobile=${phoneView[key]}`)
                                                        const defaultTheme = JSON.parse(theme?.default_theme)
                                                        localStorage.setItem("defaultThemeId", theme?.id)
                                                        localStorage.setItem("defaultTheme", JSON.stringify(defaultTheme))
                                                    }} state={{ data: JSON.parse(theme?.default_theme) }} className="btn btn-primary">Use Template</button>


                                                </div>
                                                <div className="d-flex justify-content-between align-items-center gap-2 mt-2">
                                                    <div className="d-flex">
                                                        <button style={{ padding: "0px", width: "30px", aspectRatio: "1" }} onClick={() => {
                                                            const newArr = [...phoneView]
                                                            newArr[key] = false
                                                            setPhoneView(newArr)
                                                        }} className={`btn ${phoneView[key] ? "text-dark" : "btn-outline-dark"}`}>
                                                            <AiOutlineDesktop size={"15px"} />
                                                        </button>
                                                        <button style={{ padding: "0px", width: "30px", aspectRatio: "1" }} onClick={() => {
                                                            const newArr = [...phoneView]
                                                            newArr[key] = true
                                                            setPhoneView(newArr)
                                                        }} className={`btn ${!phoneView[key] ? "text-dark" : "btn-outline-dark"}`}>
                                                            <AiOutlineMobile size={"15px"} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            }) : <>
                                <Card>
                                    <CardBody>
                                        <div className="text-center">
                                            <h4>Template not found</h4>
                                        </div>
                                    </CardBody>
                                </Card>
                            </> : <Card>
                                <CardBody>
                                    <div className="text-center">
                                        <Spinner size={'25px'} />
                                    </div>
                                </CardBody>
                            </Card>
                        }
                    </Row>
                </div>
            </div>
        </Container>
    )
}

export default Themes

