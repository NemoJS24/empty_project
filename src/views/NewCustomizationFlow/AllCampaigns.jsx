import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, Row, UncontrolledButtonDropdown, UncontrolledDropdown } from 'reactstrap'
import toast from 'react-hot-toast'
import JsonToJsx from '../Components/SuperLeadz/JsonToJsx'
import { PermissionProvider, ThemesProvider } from '../../Helper/Context'
import { SuperLeadzBaseURL } from '../../assets/auth/jwtService'
// import { getCurrentOutlet } from '../Validator'
import Spinner from '../Components/DataTable/Spinner'
import { Copy, Edit, Edit2, Edit3, Eye, Grid, Info, Layout, MoreVertical, Plus, Table, Trash, X } from 'react-feather'
import { defaultFormatDate, getCurrentOutlet } from '../Validator'
import '@styles/react/libs/flatpickr/flatpickr.scss'
// import pixels from "../../assets/images/superLeadz/pixels.png"
import Flatpickr from 'react-flatpickr'
import CampaignWiseData from '../Components/SuperLeadz/CampaignWiseData'
import { HiOutlinePencilSquare } from "react-icons/hi2"
import { MdOutlineContentCopy, MdDelete, MdDeleteOutline } from "react-icons/md"
import AdvanceServerSide from '../Components/DataTable/AdvanceServerSide'
// import Swal from 'sweetalert2'

const AllCampaigns = ({ custom = false, name = "All Campaigns", draft = true, create = true }) => {
    const outletData = getCurrentOutlet()
    const [count, setCount] = useState(0)
    const navigate = useNavigate()
    const [viewType, setViewType] = useState("table")
    const [toggledClearRows, setToggleClearRows] = useState(false)
    const [allCampaigns, setAllCampaigns] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { setSelectedThemeNo, setEditTheme } = useContext(ThemesProvider)
    const { userPermission } = useContext(PermissionProvider)

    const [activeThemes, setActiveThemes] = useState([])
    const [conflictThemes, setConflictThemes] = useState([])
    const [conflictModal, setConflictModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [currDetails, setCurrDetails] = useState({})
    const [checkedThemes, setCheckedThemes] = useState([])
    const [afterModal, setAfterModal] = useState(false)
    const [deactivateModal, setDeactivateModel] = useState(false)
    const [deleteMode, setDeleteMode] = useState("single")
    const condition = ''

    console.log(checkedThemes, "checkedThemes")
    const [activatedTheme, setActivatedTheme] = useState({})
    const [modal1, setModal1] = useState(false)

    // const [dateModal, setDateModal] = useState(false)

    // const [prevModal, setPrevModal] = useState(false)

    // const [dateRow, setDateRow] = useState({})
    // console.log(setDateRow)

    // const [dates, setDates] = useState({
    //     start_date: "",
    //     end_date: ""
    // })

    // const toggleDateModal = () => setDateModal(!dateModal)

    const GridCard = ({ title, data, info }) => {
        return <Col md="6" className='border text-start d-flex align-items-center justify-content-between p-2'>
            <p style={{ borderBottom: '0px dotted lightgray', fontSize: '18px', whiteSpace: 'nowrap', paddingRight: '10px' }} className='h5 card-text m-0 ms-1 position-relative cursor-default'>
                {title}
                {info ? <span className='position-absolute' title={info} style={{ top: '-10px', right: '-4px', cursor: 'pointer' }}><Info size={12} /></span> : ''}
            </p>
            {/* <p className=" h5 card-text ms-1">{title} </p> */}
            <h4 className=' ps-2 me-1'>{data ? data : 0}</h4>
        </Col>
    }

    const getAllThemes = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
        setIsLoading(true)

        const getUrl = new URL(`${SuperLeadzBaseURL}/api/v1/show_all_form_builder_theme/`)
        const form_data = new FormData()
        // const url = new URL(`${SuperLeadzBaseURL}/api/v1/get/offer/`)
        if (Object.entries(advanceSearchValue).length > 0) {
            Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
        }
        form_data.append("shop", outletData[0]?.web_url)
        form_data.append('app', "superleadz")
        form_data.append("page", currentPage + 1)
        form_data.append("size", currentEntry)
        form_data.append("searchValue", searchValue)
        form_data.append('showDraft', draft)
        fetch(getUrl, {
            method: "POST",
            body: form_data
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                const newArr = []
                // if (draft) {
                //     setAllCampaigns(data?.grid_view_data.filter((curElem) => {
                //         return curElem.theme_name.is_draft === 0
                //     }))
                // } else {
                // console.log(data?.grid_view_data, "data?.grid_view_data")

                // const campaignData = data?.grid_view_data
                // if (Array.isArray(campaignData) && campaignData.length >= 1) {
                //     campaignData[0].defaultExpanded = true
                // }
                // // if (Boolean(campaignData[0].defaultExpanded)) {
                // // }
                // setAllCampaigns(campaignData)
                // // }
                // setIsLoading(false)
                // setCount(data?.total_count)
                // data.is_active.forEach(ele => {
                //     newArr.push(Number(ele))
                // })
                // setActiveThemes([...newArr])
                console.log(data?.grid_view_data, "data?.grid_view_data")

                const campaignData = data?.grid_view_data
                // if (campaignData && campaignData?.length > 0) {
                if (Array.isArray(campaignData) && campaignData.length >= 1) {
                    campaignData[0].defaultExpanded = true
                }
                // if (Boolean(campaignData[0].defaultExpanded)) {
                // }
                setAllCampaigns(campaignData)
                // }
                setCount(data?.total_count)
                data.is_active.forEach(ele => {
                    newArr.push(Number(ele))
                })
                setActiveThemes([...newArr])
                // }++
                setIsLoading(false)
            }).catch((err) => {
                console.log(err)
                toast.error("Data could not be loaded")
                setIsLoading(false)
            })
    }

    const deleteThemes = () => {
        // const obj = {
        //     theme_id: deleteMode === "single" ? [currDetails.id] : [...checkedThemes]
        // }
        // console.log(obj, "obj")
        const form_data = new FormData()

        if (deleteMode === "single") {
            form_data.append("theme_id", currDetails.id)
        } else {
            checkedThemes?.map((curElem) => {
                console.log(curElem, "curElem")
                form_data.append("theme_id", curElem?.theme_name?.id)
            })
        }

        axios(`${SuperLeadzBaseURL}/api/v1/delete/theme/`, {
            method: "POST",
            data: form_data
        })
            .then((data) => {
                console.log({ data })
                toast.success(data.data.message)
                setCheckedThemes([])
                setToggleClearRows(!toggledClearRows)
                getAllThemes()
            })
            .catch((error) => {
                console.log("Error while deleting theme", error)
            })

    }

    const overlapConfirmation = () => {
        const form_data = new FormData()
        form_data.append("shop", outletData[0]?.web_url)
        form_data.append("app", "superleadz")
        form_data.append('theme_id', currDetails.id)
        form_data.append('campaign_name', currDetails.campaign_name || "")
        conflictThemes.map(ele => {
            form_data.append('overlap_theme_id', Number(ele.theme))
        })
        axios(`${SuperLeadzBaseURL}/api/v1/get/change-theme-status-overlap/`, {
            method: 'POST',
            data: form_data
        })
            .then(() => {
                // const newArray = resData.active.filter(item => conflictThemes.some(ele => `${ele.theme}` !== `${item}`))
                // setResData({ ...resData, active: [...data.active_response] })
                getAllThemes()
                setConflictModal(false)
            })
    }

    const sendConfirmation = () => {
        const form_data = new FormData()
        form_data.append("shop", outletData[0]?.web_url)
        form_data.append("app", "superleadz")
        form_data.append('theme_id', currDetails.id)
        form_data.append('campaign_name', currDetails.campaign_name)
        form_data.append('is_active', !activeThemes.includes(currDetails.id) ? 1 : 0)
        axios(`${SuperLeadzBaseURL}/api/v1/get/change-theme-status/`, {
            method: 'POST',
            data: form_data
        })
        .then(() => {
            getAllThemes()
            
            if (!activeThemes.includes(currDetails.id)) {
                setAfterModal(!afterModal)
            } else {
                setDeactivateModel(!deactivateModal)
            }
        })
        .catch(err => {
            alert(err)
        })
    }

    const sendDuplicate = (ele) => {
        const form_data = new FormData()
        form_data.append('shop', outletData[0]?.web_url)
        form_data.append('app', 'superleadz')
        form_data.append('theme_id', ele.id)

        axios({
            method: "POST", url: `${SuperLeadzBaseURL}/api/v1/duplicate_form_builder/`, data: form_data
        }).then((data) => {
            console.log(data)
            if (data?.data?.success === "done") {
                getAllThemes()
                toast.success("Successfully created a duplicate!")
            } else {
                toast.error("Could not duplicate your theme")
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // const handleFilter = e => {
    //     const { value } = e.target
    //     let updatedData = []
    //     setSearchValue(value)

    //     if (value.length) {
    //         updatedData = allCampaigns.filter(item => {
    //             const startsWith =
    //                 item?.campaign_name?.toLowerCase().startsWith(value.toLowerCase())

    //             const includes =
    //                 item?.campaign_name?.toLowerCase().includes(value.toLowerCase())

    //             if (startsWith) {
    //                 return startsWith
    //             } else if (!startsWith && includes) {
    //                 return includes
    //             } else return null
    //         })
    //         setFilteredData(updatedData)
    //         setSearchValue(value)
    //     }
    // }

    // const defferContent = <>
    //     <Col className='d-flex align-items-center justify-content-center' md='4' sm='12'>
    //         <h4 className='m-0'>{name}</h4>
    //     </Col>
    //     <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
    //         <div className="d-flex gap-2 align-items-center">
    //             <Link to={"/merchant/superleadz/templates"} className='btn btn-primary-main' style={{ width: "240px" }}> Create Campaign</Link>
    //             <input type="text" className="form-control w-75" value={searchValue} onChange={handleFilter} placeholder='Search...' />
    //         </div>
    //     </Col>
    // </>

    const columns = [
        {
            name: 'Campaign',
            selector: row => {
                return (
                    <div title={row.theme_name.campaign_name} className='d-flex justify-content-start align-items-center gap-1 py-1'>
                        <div style={{ backgroundImage: `url("https://miro.medium.com/v2/resize:fit:678/1*ZPvzUShTe448VPDukHiskw.png")`, backgroundSize: "100%" }}>
                            <div onClick={() => {
                                // setSelectedThemeNo(row.default_id)
                                // setEditTheme(row)
                                localStorage.setItem("is_draft", row.theme_name.draft_status)
                                // navigate(`/merchant/SuperLeadz/overview/${row.theme_name.id}/`)
                            }} className="prev d-flex justify-content-center align-items-center rounded position-relative overflow-hidden cursor-pointer" style={{ width: "120px", height: "67.5px", backgroundColor: JSON.parse(row.theme_name.custom_theme).overlayStyles.backgroundColor, backgroundImage: JSON.parse(row.theme_name.custom_theme).overlayStyles.backgroundImage }}>
                                <span className="position-absolute">
                                    <JsonToJsx isMobile={false} renderObj={JSON.parse(row.theme_name.custom_theme)} scale={0.1125} index={0} />
                                </span>
                            </div>
                        </div>
                        <div onClick={() => {
                            // setSelectedThemeNo(row.theme_name.default_id)
                            // setEditTheme(row)
                            // navigate(`/merchant/SuperLeadz/overview/${row.theme_name.id}/`)
                        }} className='fw-bolder text-primary cursor-pointer' style={{ width: 'calc(100% - 135px)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.theme_name.campaign_name}</div>
                    </div>
                )
            },
            type: "text",
            isEnable: true
        },
        {
            name: 'Status',
            selector: row => {
                if (row.theme_name.draft_status === 0) {
                    return (
                        <div className="m-auto form-check form-switch form-check-success cursor-pointer p-0 m-0" style={{ filter: `drop-shadow(0px 0px 7.5px rgba(40, 199, 111, ${row.theme_name.is_active ? "0.5" : "0"}))` }}>
                            <input onChange={() => {
                                // if (userPermission?.currentPlan?.plan === "Forever Free") {
                                //     const activeCampaign = allCampaigns.filter((curElem) => curElem?.theme_name?.is_active === 1)
                                //     console.log(activeCampaign, "activeCampaign")
                                //     if (activeCampaign.length > 0) {
                                //         Swal.fire({
                                //             title: "Upgrade your plan"
                                //             // icon: "info"
                                //         })
                                //         return
                                //     }
                                // }
                                setCurrDetails(row.theme_name)
                                const getUrl = new URL(`${SuperLeadzBaseURL}/api/v1/get/active-template/`)
                                const form_data = new FormData()
                                form_data.append("shop", outletData[0]?.web_url)
                                form_data.append("app", "superleadz")
                                form_data.append('theme_id', row.theme_name.id)
                                form_data.append('campaign_name', row.theme_name.campaign_name)
                                axios({
                                    method: "POST",
                                    url: getUrl,
                                    data: form_data
                                }).then((data) => {
                                    // data.data.response.forEach(row => {
                                    //     newArr.push(row.theme_name.
                                    // })
                                    setActivatedTheme(row.theme_name)
                                    if ((data.data.response.length === 0) || (data.data.response.length > 0 && activeThemes.includes(row.theme_name.id))) {
                                        setModal1(true)
                                    } else {
                                        setConflictThemes([...data.data.response])
                                        setConflictModal(true)
                                    }
                                }).catch((err) => {
                                    console.log({ err })
                                })
                            }} type='checkbox' checked={activeThemes.includes(row.theme_name.id)} className='form-check-input cursor-pointer m-0' />
                        </div>
                    )
                } else {
                    return (
                        <div className='text-warning m-auto'>Draft</div>
                    )
                }
            },
            type: 'select',
            options: [
                { label: "Select", value: "" },
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 },
                { label: "Draft", value: "is_draft" }
            ],
            isEnable: true
            // new Date(row.theme_name.created_at).toUTCString().replace("GMT", "")
        },
        {
            name: 'Start Date',
            selector: row => <span className='cursor-pointer'>{defaultFormatDate(row.theme_name.start_date, userPermission?.user_settings?.date_format)}</span>,
            dataType: 'offer_code',
            type: 'date',
            isEnable: true
        },
        {
            name: 'End Date',
            selector: row => <span className='cursor-pointer'>{Boolean(row.theme_name.end_date) ? defaultFormatDate(row.theme_name.end_date, userPermission?.user_settings?.date_format) : "Perpetual"}</span>,
            type: 'date',
            isEnable: true
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <UncontrolledButtonDropdown className='more-options-dropdown'>
                        <DropdownToggle className={`btn-icon cursor-pointer`} color='transparent' size='sm'>
                            <span className={`border-none`}>
                                <MoreVertical size={15} />
                            </span>
                        </DropdownToggle>
                        <DropdownMenu className='border dropdown-menu-custom'>
                            {!activeThemes.includes(row.theme_name.id) && <DropdownItem onClick={() => {
                                setDeleteMode("single")
                                setCurrDetails(row.theme_name)
                                setDeleteModal(!deleteModal)
                            }} className='w-100'>
                                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                    <Trash stroke='#ea5455' size={"15px"} className='cursor-pointer' /> <span className='fw-bold text-black' style={{ fontSize: "0.75rem" }}>Delete</span>
                                </div>
                            </DropdownItem>}
                            <DropdownItem onClick={() => {
                                sendDuplicate(row.theme_name)
                            }} className='w-100'>
                                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                    <Copy stroke='#28c76f' size={"15px"} className='cursor-pointer' /> <span className='fw-bold text-black' style={{ fontSize: "0.75rem" }}>Duplicate</span>
                                </div>
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                setSelectedThemeNo(row.theme_name.default_id)
                                setEditTheme(row.theme_name)
                                localStorage.setItem("is_draft", row.theme_name.draft_status)
                                navigate(`/merchant/SuperLeadz/new_customization/${row.theme_name.id}?status=${activeThemes.includes(row.theme_name.id)}`, { state: row.theme_name })
                            }} className='w-100'>
                                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                    <Edit2 stroke='#ff9f43' size={"15px"} className='cursor-pointer' /> <span className='fw-bold text-black' style={{ fontSize: "0.75rem" }}>Edit</span>
                                </div>
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                navigate(`/merchant/SuperLeadz/preview/${row.theme_name.id}/`, { state: row.theme_name })
                            }} className='w-100'>
                                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                    <Layout stroke='#ff9f43' size={"15px"} className='cursor-pointer' />
                                    <span className='fw-bold text-black' style={{ fontSize: "0.75rem" }}>Preview</span>
                                </div>
                            </DropdownItem>

                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </div>
            ),
            width: "100px"
        }
    ]

    const ExpandedData = (data) => {
        console.log(data)
        return <CampaignWiseData campaignData={data.data} />
    }

    const deleteContent = checkedThemes.length > 0 && <button onClick={() => {
        setDeleteMode("multiple")
        setDeleteModal(!deleteModal)
    }} className="btn btn-danger d-block">Deleting {checkedThemes.length} item/s</button>

    return (
        <>
            <style>
                {`
            
                    .dropdown-menu-custom.dropdown-menu[data-popper-placement]:not([data-popper-placement^="top-"]) {
                        top: -100px !important;
                        left: -100px !important;
                    }

                    .datatableView {
                        padding: 5px 13px;
                        cursor: pointer
                    }

                    .datatableView.active {
                        background: #464646;
                        color: #fff
                    }

                    .grid-card {
                        margin-bottom: 1.5rem;
                        box-shadow: 0 4px 15px -8px #464646;
                        border: 1px solid #efefef;
                        background-color: #ffffff;
                    }
                    // .swal2-styled.swal2-confirm {
                    //     background: #006aff !important
                    // }
                `}
            </style>

            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <AdvanceServerSide
                                custom={custom}
                                tableName={name}
                                tableCol={columns}
                                data={allCampaigns}
                                isLoading={isLoading}
                                count={count}
                                advanceFilter={true}
                                isExpand={true}
                                ExpandableTable={ExpandedData}
                                getData={getAllThemes}
                                selectableRows={true}
                                selectedRows={checkedThemes}
                                setSelectedRows={setCheckedThemes}
                                deleteContent={deleteContent}
                                viewType={viewType}
                                create={create}
                                createLink={"/merchant/superleadz/templates"}
                                createText={"Create Campaign"}
                                setViewType={setViewType}
                                toggledClearRows={toggledClearRows}
                                viewContent={
                                    allCampaigns.length > 0 ? <Row>
                                        {
                                            isLoading ? <div className='d-flex justify-content-center align-items-center'>
                                                <Spinner size="40px" />
                                            </div> : allCampaigns.map((curElem) => {
                                                return <Col xs="10" md="5" className='px-5' >
                                                    <div className=' text-center rounded headings-compact content-max-width font-size-normal grid-card'>
                                                        <CardBody className='px-1'>
                                                            <div className='d-flex justify-content-between'>
                                                                <div>
                                                                    <h4 className='text-start fw-bolder text-black ps-2'>{curElem?.theme_name?.campaign_name}</h4>
                                                                    <p className='text-start  ps-2'> Created On : {defaultFormatDate(curElem?.theme_name.start_date, userPermission?.user_settings?.date_format)}</p>
                                                                </div>

                                                                <div className="d-flex justify-cotent-center align-items-center gap-1">
                                                                    <div className='cursor-pointer' onClick={() => {
                                                                        setSelectedThemeNo(curElem?.theme_name.default_id)
                                                                        setEditTheme(curElem?.theme_name)
                                                                        localStorage.setItem("is_draft", curElem?.theme_name.is_draft)
                                                                        navigate(`/merchant/SuperLeadz/new_customization/${curElem?.theme_name.id}`, { state: curElem?.theme_name })
                                                                    }}>
                                                                        <HiOutlinePencilSquare size={22} />
                                                                    </div>

                                                                    {
                                                                        curElem.theme_name.is_draft === 0 ? <>

                                                                            <div className="m-auto form-check form-switch form-check-success cursor-pointer p-0 m-0" style={{ filter: `drop-shadow(0px 0px 7.5px rgba(40, 199, 111, ${curElem?.theme_name.is_active ? "0.5" : "0"}))` }}>
                                                                                <input onChange={() => {
                                                                                    // if (userPermission?.currentPlan?.plan === "Forever Free") {
                                                                                    //     const activeCampaign = allCampaigns.filter((curElem) => curElem?.theme_name?.is_active === 1)
                                                                                    //     console.log(activeCampaign, "activeCampaign")
                                                                                    //     if (activeCampaign.length > 0) {
                                                                                    //         Swal.fire({
                                                                                    //             title: "Upgrade your plan"
                                                                                    //             // icon: "info"
                                                                                    //         })
                                                                                    //         return
                                                                                    //     }
                                                                                    // }
                                                                                    setCurrDetails(curElem?.theme_name)
                                                                                    const getUrl = new URL(`${SuperLeadzBaseURL}/api/v1/get/active-template/`)
                                                                                    const form_data = new FormData()
                                                                                    form_data.append("shop", outletData[0]?.web_url)
                                                                                    form_data.append("app", "superleadz")
                                                                                    form_data.append('theme_id', curElem?.theme_name.id)
                                                                                    form_data.append('campaign_name', curElem?.theme_name.campaign_name)
                                                                                    axios({
                                                                                        method: "POST",
                                                                                        url: getUrl,
                                                                                        data: form_data
                                                                                    }).then((data) => {
                                                                                        // data.data.response.forEach(curElem?.theme_name => {
                                                                                        //     newArr.push(curElem?.theme_name.
                                                                                        // })
                                                                                        if ((data.data.response.length === 0) || (data.data.response.length > 0 && activeThemes.includes(curElem?.theme_name.id))) {
                                                                                            setModal1(true)
                                                                                        } else {
                                                                                            setConflictThemes([...data.data.response])
                                                                                            setConflictModal(true)
                                                                                        }
                                                                                    }).catch((err) => {
                                                                                        console.log({ err })
                                                                                    })
                                                                                }} type='checkbox' checked={activeThemes.includes(curElem?.theme_name.id)} className='form-check-input cursor-pointer m-0' />
                                                                            </div>
                                                                        </> : <>
                                                                            <div className='text-warning m-auto'>Draft</div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <Row className='mt-2' style={{ height: '145px', overflow: 'auto' }}>

                                                                <GridCard title="Impressions" data={curElem[`${condition}pop_up_view`]} info={`Number of times pop-up was shown.`} />

                                                                <GridCard title="Leads" data={curElem[`${condition}total_leads`]} info={`Total instances of visitors submitting their contact information through a SuperLeadz pop-up`} />

                                                                <GridCard title="Conversion %" data={`${Number(curElem[`${condition}conversion_rate`]).toFixed(2)}%`} info={`Number of leads (total) / Number of redemptions`} />

                                                                <GridCard title="CTR" data={`${(curElem?.clicks && curElem[`${condition}pop_up_view`]) ? Number(curElem[`${condition}clicks`] / curElem[`${condition}pop_up_view`] * 100).toFixed(2) : 0}%`} info={`The percentage of clicks relative to the total number of impressions`} />

                                                                <Col md="6" className='d-none'>
                                                                    <GridCard title="Conversions" data={curElem?.conversion} info={`Number of redemptions.`} />
                                                                </Col>
                                                                <Col md="6" className='d-none'>
                                                                    <GridCard title="Engaged" data={curElem?.engaged} info={`Number of clicks in the pop-up`} />
                                                                </Col>
                                                                <Col md="6" className='d-none'>
                                                                    <GridCard title="Revenue" data={curElem?.revenue} info={`Redemption amount`} />
                                                                </Col>
                                                                <Col md="6" className='d-none'>
                                                                    <GridCard title="Immediately closed" data={curElem?.immediatelyClosed} info={`Pop-up closed within 2 second`} />
                                                                </Col>
                                                                <Col md="6" className='d-none'>
                                                                    <GridCard title="Offers sent" data={curElem?.offer_sent} info={`Number of offers displayed`} />
                                                                </Col>
                                                                <Col md="6" className='d-none'>
                                                                    <GridCard title="Redirected" data={curElem?.redirected} info={`Number of times they were redirected after clicking to redeem offer`} />
                                                                </Col>

                                                            </Row>

                                                            {/* <div className='d-flex justify-content-between'> */}

                                                            <div className='d-flex align-items-between justify-content-between mt-2 cursor-pointer'>
                                                                {!activeThemes.includes(curElem?.theme_name?.id) && <div onClick={() => {
                                                                    setDeleteMode("single")
                                                                    setCurrDetails(curElem?.theme_name)
                                                                    setDeleteModal(!deleteModal)
                                                                }}>
                                                                    <MdDeleteOutline size={23} className='' />
                                                                </div>}

                                                                <div className='cursor-pointer' onClick={() => {
                                                                    sendDuplicate(curElem?.theme_name)
                                                                }}>
                                                                    <MdOutlineContentCopy size={21} className='' />

                                                                </div>
                                                            </div>
                                                            {/* </div> */}
                                                        </CardBody>
                                                    </div>
                                                </Col>
                                            })
                                        }
                                    </Row> : <div className="sc-feUZmu cdUPdx">
                                        <div className="sc-hzhJZQ gmlwXk">
                                            <div className="sc-aXZVg jNIkof rdt_Table" role="table">
                                                <div className="sc-hmdomO cTsUPQ">
                                                    <div style={{ padding: 24 }}>There are no records to display</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                }
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Modal isOpen={afterModal} toggle={() => setAfterModal(!afterModal)} className='position-relative popup-cust'>
                <ModalBody>
                    <span className="position-absolute top-0 end-0" style={{ cursor: 'pointer', padding: "0.25rem" }} onClick={() => setAfterModal(!afterModal)}>
                        <X size={17.5} />
                    </span>
                        Your campaign is live!
                    <div className="text-end mt-2 d-flex justify-content-end align-items-center gap-1">
                        <button onClick={() => {
                            setAfterModal(!afterModal)
                        }} className={`btn btn-${activeThemes.includes(currDetails.id) ? 'outline-primary' : 'primary'} text-capitalize`}>OK</button>
                        <Link className={`btn btn-${activeThemes.includes(currDetails.id) ? 'outline-primary' : 'primary'} text-capitalize`} to={`/merchant/SuperLeadz/preview/${activatedTheme.id}`} state={activatedTheme}>View Pop-Up</Link>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={deactivateModal} toggle={() => setDeactivateModel(!deactivateModal)} className='position-relative popup-cust' >
                <ModalBody>
                    <span className="position-absolute top-0 end-0" style={{ cursor: 'pointer', padding: "0.25rem" }} onClick={() => setDeactivateModel(!deactivateModal)}>
                        <X size={17.5} />
                    </span>
                        Your campaign has been deactivated.
                    <div className="text-end mt-2 d-flex justify-content-end align-items-center gap-1">
                        <button onClick={() => {
                            setDeactivateModel(!deactivateModal)
                        }} className={`btn btn-${activeThemes.includes(currDetails.id) ? 'outline-primary' : 'primary'} text-capitalize`}>OK</button>
                    </div>
                </ModalBody>
            </Modal>
            {/* {checkedThemes.length > 0 && } */}
            <Modal isOpen={modal1} toggle={() => setModal1(!modal1)} className='position-relative popup-cust' >
                <ModalBody>
                    <span className="position-absolute top-0 end-0" style={{ cursor: 'pointer', padding: "0.25rem" }} onClick={() => setModal1(!modal1)}>
                        <X size={17.5} />
                    </span>
                    Are you sure you want to {activeThemes.includes(currDetails.id) && 'de'}activate this campaign?
                    <div className="text-end mt-2 d-flex justify-content-end align-items-center gap-1">
                        <button onClick={() => {
                            setModal1(!modal1)
                        }} className={`btn btn-${activeThemes.includes(currDetails.id) ? 'outline-primary' : 'primary'} text-capitalize`}>No</button>
                        <button onClick={() => {
                            setModal1(!modal1)
                            sendConfirmation()
                        }} className={`btn btn-${activeThemes.includes(currDetails.id) ? 'outline-primary' : 'primary'} text-capitalize`}>Yes</button>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={conflictModal} onClick={() => setConflictModal(!conflictModal)} toggle={() => setConflictModal(!conflictModal)}>
                <ModalBody>
                    <span className="position-absolute top-0 end-0" style={{ cursor: 'pointer', padding: "0.25rem" }} onClick={() => setConflictModal(!conflictModal)}>
                        <X size={17.5} />
                    </span>
                    This theme's settings conflict with {conflictThemes?.map((ele, index, array) => {
                        return <span className='fw-bold text-black' key={index}>{allCampaigns[allCampaigns?.findIndex($ => $?.id === Number(ele?.theme))]?.campaign_name}{index < array.length - 2 ? ',' : index === array.length - 2 ? " and" : ""} </span>
                    })}.<br />Activating this theme will deactivate the above theme/s.
                    <div className="mt-2 d-flex gap-1 justify-content-end align-items-center"><button className="btn btn-primary" onClick={overlapConfirmation}>Activate</button> <button onClick={() => setConflictModal(!conflictModal)} className='btn btn-outline-primary'>Cancel</button></div>
                </ModalBody>
            </Modal>
            <Modal isOpen={deleteModal} onClick={() => setDeleteModal(!deleteModal)} toggle={() => setDeleteModal(!deleteModal)}>
                <ModalBody>
                    <span className="position-absolute top-0 end-0" style={{ cursor: 'pointer', padding: "0.25rem" }} onClick={() => setDeleteModal(!deleteModal)}>
                        <X size={17.5} />
                    </span>
                    Are you sure you want to delete {deleteMode === "single" ? "this campaign" : checkedThemes.length === 1 ? "this campaign" : "these campaigns"}?
                    <div className="mt-2 d-flex gap-3 justify-content-end align-items-center">
                        <button className="btn btn-outline-primary" onClick={() => deleteThemes()}>Delete</button>
                    </div>
                </ModalBody>
            </Modal>
            {/* <Modal size='xl' isOpen={prevModal} toggle={() => setPrevModal(!prevModal)}>
                <ModalBody>
                    <span className="position-absolute top-0 end-0" style={{ cursor: 'pointer', padding: "0.25rem" }} onClick={() => setPrevModal(!prevModal)}>
                        <X size={17.5} />
                    </span>
                    {prevModal && <JsonToJsx renderObj={JSON.parse(dateRow.custom_theme)} scale={1} />}
                </ModalBody>
            </Modal> */}
        </>
    )
}

export default AllCampaigns