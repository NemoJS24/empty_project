/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Crosshair, Edit, Image, Monitor, PlusCircle, Smartphone, Square, Tag, Target, Type, X, Trash2, XCircle, Columns, Disc, Trash, Percent, MoreVertical, ArrowLeft, Home, CheckSquare, Mail, RotateCcw, RotateCw, Check, ChevronRight, Plus } from 'react-feather'
import { Container, Row, UncontrolledAccordion, UncontrolledDropdown, Col, ModalHeader, UncontrolledButtonDropdown, CardBody, ModalFooter, Button, Input } from 'reactstrap'
import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'
import 'swiper/modules/navigation/navigation.min.css'
import 'swiper/modules/autoplay/autoplay.min.css'
import Render from './PushBuilderRender'
import { BiPlusCircle } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai'
import { postReq, SuperLeadzBaseURL } from "@src/assets/auth/jwtService.js"
import axios from 'axios'


const sectionWidths = {
    sidebar: "70",
    drawerWidth: "300",
    editSection: "280"
}

const CustomizationParent = () => {

    const [sideNav, setSideNav] = useState('theme')
    const [prevOpen, setPrevOpen] = useState(1)
    const [inputFields, setInputFields] = useState([])
    const [fileName, setFileName] = useState('')

    const handleAddField = () => {
        if (inputFields.length < 2) {
            setInputFields([
                ...inputFields, {
                    buttonText1: '',
                    buttonText2: '',
                    title: '',
                    showInput: false
                }
            ])
        }
    }

    const handleRemoveField = (index) => {
        const updatedFields = [...inputFields]
        updatedFields.splice(index, 1)
        setInputFields(updatedFields)
    }

    const handleInputChange = (index, fieldName, value) => {
        const updatedFields = [...inputFields]
        updatedFields[index][fieldName] = value
        setInputFields(updatedFields)
    }

    const handleCheckboxChange = (index) => {
        const updatedFields = [...inputFields]
        updatedFields[index].showInput = !updatedFields[index].showInput
        setInputFields(updatedFields)
    }


    const [formData, setFormData] = useState({
        imageUrl: "https://images.unsplash.com/photo-1562155847-c05f7386b204?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // iconImage: "https://images.unsplash.com/photo-1562155847-c05f7386b204?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        appName: "Google Chrome",
        title: "Text Title",
        subtitle: "Sub Title",
        website: "Your.website",
        inputPlaceholder1: "Type your explanation here",
        inputPlaceholder2: "Type your explanation here",
        buttonText1: "Button 1",
        buttonText2: "Button 2"
    })

    const testReq = () => {
        const form_data = new FormData()
        // form_data.append('id', id)
        form_data.append('edit_type', 'is_customer_detail')
        postReq('get_view_customer', formData)
            .then(() => {

            })
    }
    //     // const defaultData = {
    //     //     page_1: {
    //     //       name_color: "#3523d9",
    //     //       heading_color: "#000000",
    //     //       profile_color: "#c67cac",
    //     //       backgroundColor: "#c9c9c9",
    //     //       border_color: "#050505",
    //     //       card2background_color: "#ededed",
    //     //       card2label_color: "#3523d9",
    //     //       card2heading_color: "#000000",
    //     //       card2text_color: "#c67cac",
    //     //       card2backgroundColor: "#c9c9c9",
    //     //       card2border_color: "#050505",
    //     //       Orders: true,
    //     //       Wishlist: false,
    //     //       Credits: false,
    //     //       Recents: false,
    //     //       Profile: true,
    //     //       ChangePassword: true,
    //     //       Offers: false,
    //     //       Logout: false
    //     //     }
    //     //   }

    //     useEffect(() => {
    //         if (sideNav !== "" && sideNav !== "rules") {
    //             setPrevOpen(sideNav)
    //         }
    //     }, [sideNav])

    // const handleChange = (e) => {
    //     const { name, value } = e.target
    //     setFormData(prevData => ({
    //         ...prevData,
    //         [name]: value
    //     }))
    // }

    useEffect(() => {
        if (sideNav !== "" && sideNav !== "rules") {
            setPrevOpen(sideNav)
        }
    }, [sideNav])

    console.log("inputFields", formData)

    return (
        <>
            <Container fluid className='border-bottom px-0' style={{ height: "55px" }}>
                <Row className='align-items-center px-0'>
                    <div className='col-md-2 d-flex justify-content-start align-items-center gap-1'>
                        <button className="btn" style={{ border: "none", outline: "none" }}><ArrowLeft /></button>
                        <div className="d-flex flex-column align-items-center justify-content-center" style={{ gap: "0.5rem", cursor: "pointer", height: "55px" }}>
                            <Link to={"/merchant/SuperLeadz/"} className='text-secondary'><Home size={"20px"} /></Link>
                        </div>
                    </div>
                    <div className='col-md-10 d-flex flex-row justify-content-end align-items-center' style={{ padding: "0.5rem", gap: "0.5rem" }}>
                        <button className="btn custom-btn-outline d-none">Toggle View</button>

                        <div className="d-flex justify-content-center align-items-center" style={{ border: '1px solid #d8d6de', borderRadius: '0.357rem', gap: '5px' }}>
                            <input id='campaignNameInput' type="text" placeholder='Enter theme name' className="form-control" style={{ width: '250px', border: 'none' }} />
                        </div>
                        <div style={{ gap: "0.5rem" }} className="d-flex align-items-center">
                            <button title="Undo" id="xircls_undo" className="btn border btn-dark" style={{ padding: "0.75rem" }} ><RotateCcw size={15} /></button>
                            <button title="Redo" id="xircls_redo" className="btn border btn-dark" style={{ padding: "0.75rem" }} ><RotateCw size={15} /></button>
                        </div>
                        <button className="btn custom-btn-outline" onClick={() => { setCancelCust(!cancelCust) }}>Cancel</button>
                        <button className="btn custom-btn-outline">Previous</button>
                        <button className="btn custom-btn-outline">Next</button>
                        <button id='saveBtn1' className="btn custom-btn-outline" style={{ whiteSpace: 'nowrap' }}>Preview</button>
                        <button id='saveBtn2' className="btn custom-btn-outline" style={{ whiteSpace: 'nowrap' }}>Save</button>
                        <button id='saveBtn3' className="btn btn-primary-main" style={{ whiteSpace: 'nowrap' }}>Save & Close</button>

                    </div>
                </Row>
            </Container>
            <div className="d-flex justify-content-center align-items-stretch border position-relative" style={{ height: "calc(100vh - 55px)" }}>
                <div className="nav-sidebar d-flex flex-column align-items-stretch justify-content-start border-end text-center h-100" style={{ padding: "0.5rem", overflow: "auto", gap: '20px' }}>
                    <div className={`sideNav-items d-flex flex-column align-items-center justify-content-center ${sideNav === "theme" ? "text-black active-item" : ""}`} style={{ gap: "0.5rem", cursor: "pointer", padding: "10px" }} onClick={() => setSideNav(sideNav === "theme" ? "" : "theme")}>
                        <button className={`btn d-flex align-items-center justify-content-center`} style={{ aspectRatio: "1", padding: "0rem", border: "none", outline: "none", transition: "0.3s ease-in-out" }}>
                            <svg
                                width="15px"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                xmlSpace="preserve"
                                fill={sideNav === "theme" ? "#000" : "#85898e"}
                                style={{ transition: "0.3s ease-in-out" }}
                            >
                                <path d="M475.691.021c-14.656 0-27.776 8.725-33.451 22.251l-32.64 77.973c-9.728-9.152-22.421-14.933-36.267-14.933h-320C23.936 85.312 0 109.248 0 138.645v320c0 29.397 23.936 53.333 53.333 53.333h320c29.397 0 53.333-23.936 53.333-53.333V225.152l81.92-172.821c2.24-4.757 3.413-10.048 3.413-16.043C512 16.299 495.701.021 475.691.021zm-70.358 458.624c0 17.643-14.357 32-32 32h-320c-17.643 0-32-14.357-32-32v-320c0-17.643 14.357-32 32-32h320c11.243 0 21.312 6.101 27.072 15.573l-37.739 90.197v-52.437c0-5.888-4.779-10.667-10.667-10.667H74.667c-5.888 0-10.667 4.779-10.667 10.667v85.333c0 5.888 4.779 10.667 10.667 10.667h269.76l-8.939 21.333h-90.155c-5.888 0-10.667 4.779-10.667 10.667v128c0 .277.128.512.149.789-8.768 7.787-14.144 10.389-14.528 10.539a10.68 10.68 0 00-6.699 7.616 10.706 10.706 0 002.859 9.941c15.445 15.445 36.757 21.333 57.6 21.333 26.645 0 52.48-9.643 64.128-21.333 16.768-16.768 29.056-50.005 19.776-74.773l47.381-99.925v188.48zm-134.698-61.12c2.944-9.685 5.739-18.859 14.229-27.349 15.083-15.083 33.835-15.083 48.917 0 13.504 13.504 3.2 45.717-10.667 59.584-11.563 11.541-52.672 22.677-80.256 8.256 3.669-2.859 7.893-6.549 12.672-11.328 8.918-8.939 12.075-19.221 15.105-29.163zM256 375.339v-76.672h70.571l-16.363 39.083c-14.251-.256-28.565 5.483-40.448 17.387-6.635 6.634-10.752 13.524-13.76 20.202zm75.264-32.598l28.715-68.629 16.128 7.915-32.555 68.651c-3.947-3.201-8.021-5.931-12.288-7.937zm10.069-172.096v64h-256v-64h256zM489.28 43.243l-104.064 219.52-17.003-8.341 54.08-129.237 39.616-94.677c2.325-5.568 7.744-9.152 13.803-9.152 8.235 0 14.933 6.699 14.933 15.659 0 2.132-.469 4.329-1.365 6.228z" />
                                <path d="M181.333 277.312H74.667c-5.888 0-10.667 4.779-10.667 10.667v149.333c0 5.888 4.779 10.667 10.667 10.667h106.667c5.888 0 10.667-4.779 10.667-10.667V287.979c-.001-5.888-4.78-10.667-10.668-10.667zm-10.666 149.333H85.333v-128h85.333v128z" />
                            </svg>
                        </button>
                        <span style={{ fontSize: "8.5px", fontStyle: "normal", fontWeight: "500", lineHeight: "10px", transition: "0.3s ease-in-out" }} className={`text-uppercase transformSideBar`}>Theme</span>
                    </div>

                </div>
                <div className="d-flex">
                    <div className=" border-end bg-white position-relative h-100" style={{ width: (sideNav !== "" && sideNav !== "rules") ? `${sectionWidths.drawerWidth}px` : "0px", transition: "0.3s ease-in-out", opacity: "1", boxShadow: "10px 2px 5px rgba(0,0,0,0.125)", zIndex: "1" }}>
                        <span onClick={() => setSideNav(sideNav === "" ? prevOpen : "")} className="position-absolute d-flex justify-content-center align-items-center cursor-pointer" style={{ top: "50%", right: "0px", transform: `translateX(100%) translateY(-50%)`, padding: "0.25rem", aspectRatio: "9/30", height: "50px", borderRadius: "0px 10px 10px 0px", backgroundColor: "#ffffff", zIndex: "11111111" }}>
                            <ChevronRight style={{ rotate: sideNav === "" ? "0deg" : "-540deg", transition: "0.3s ease-in-out" }} size={12.5} color='#000000' />
                        </span>
                        <div className="overflow-x-hidden h-100 position-relative hideScroll">
                            <div className='w-100' style={{ height: "100%", overflowY: "auto" }}>
                                <div id="1212" style={{ width: `90%`, transform: `translateX(${(sideNav !== "" && sideNav !== "rules") ? "0px" : `-${sectionWidths.drawerWidth}px`})`, transition: "0.3s ease-in-out", position: "absolute", inset: "0px 0px 0px auto" }}>
                                    {sideNav === "theme" && <div style={{ transition: "0.3s ease-in-out", overflow: "hidden", width: "90%" }}>
                                        <div className='my-2'>
                                            <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>Title:</span>
                                            <div className="d-flex p-0 justify-content-between align-items-center gap-2">
                                                <input type="text" name='title' min="0" max="300" className='form-control' value={formData.title} onChange={(e) => {
                                                    const { name, value } = e.target
                                                    setFormData(prevData => ({
                                                        ...prevData,
                                                        [name]: value
                                                    }))
                                                }} />
                                            </div>
                                        </div>
                                        <div className='my-2'>
                                            <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>Sub title:</span>
                                            <div className="d-flex p-0 justify-content-between align-items-center gap-2">
                                                <input type="text" name='subtitle' min="0" max="300" className='form-control' value={formData.subtitle} onChange={(e) => {
                                                    const { name, value } = e.target
                                                    setFormData(prevData => ({
                                                        ...prevData,
                                                        [name]: value
                                                    }))
                                                }} />
                                            </div>
                                        </div>
                                        <div className='my-2'>
                                            <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>Image:</span>
                                            <div className="d-flex p-0 justify-content-between align-items-center gap-2">
                                                <input
                                                    type="file"
                                                    name='imageUrl'
                                                    className='form-control'
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0]
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onloadend = () => {
                                                                setFormData(prevData => ({
                                                                    ...prevData,
                                                                    imageUrl: reader.result
                                                                }))
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='my-2'>
                                            <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>Badge:</span>
                                            <div className="d-flex p-0 justify-content-between align-items-center gap-2">
                                                {/* <input type="text" name='iconImage' min="0" max="300" className='form-control' value={formData.iconImage} onChange={(e) => {
                                                    const { name, value } = e.target
                                                    setFormData(prevData => ({
                                                        ...prevData,
                                                        [name]: value
                                                    }))
                                                }} /> */}
                                                {/* <input
                                                    type="file"
                                                    name='iconImage'
                                                    className='form-control'
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0]
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onloadend = () => {
                                                                setFormData(prevData => ({
                                                                    ...prevData,
                                                                    iconImage: reader.result
                                                                }))
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                /> */}
                                                {/* <input
                                                    type="file"
                                                    name="iconImage"
                                                    id="iconImage"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0]
                                                        setFileName(file.name)
                                                        const reader = new FileReader()
                                                        reader.onload = function (event) {
                                                            const updatedData1 = {
                                                                iconImage: file
                                                            }
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                ...updatedData1
                                                            }))
                                                        }
                                                        reader.readAsArrayBuffer(file)
                                                    }}
                                                /> */}
                                                <input
                                                    type="file"
                                                    name="iconImage"
                                                    id="iconImage"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const form_data = new FormData()
                                                        // form_data.append('id', id)
                                                        form_data.append('iconImage', e.target.files[0])
                                                        postReq('get_view_customer', form_data)
                                                            .then(() => {
                                                            })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {/* <div className='my-2'>
                                            <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>Button:</span>
                                            <div className="d-flex p-0 justify-content-between align-items-center gap-2">
                                                <input type="text" name='buttonText2' min="0" max="300" className='form-control' value={formData.buttonText2} onChange={(e) => {
                                                    const { name, value } = e.target
                                                    setFormData(prevData => ({
                                                        ...prevData,
                                                        [name]: value
                                                    }))
                                                }} />
                                            </div>
                                        </div> */}
                                        {/* <div className="row mt-2">
                                            <label htmlFor="" style={{ fontSize: "12px" }}>Buttons:</label>
                                           
                                                    <div className="col-12">
                                                        <div className="p-0 position-relative d-flex align-items-center mb-1">
                                                            <input style={{ fontSize: "12px" }} className='form-control' type="text" placeholder='placeholder' /> <span className="d-flex justify-content-center alignn-items-center position-absolute end-0 p-1 cursor-pointer"><Trash stroke='red' size={12.5} /></span>
                                                        </div>
                                                    </div>
                                            <div className="col-12">
                                                <button style={{ padding: "5px" }} className="btn btn-dark w-100"><BiPlusCircle color='white' size={17.5} /></button>
                                            </div>
                                        </div> */}
                                        <div className="row mt-2">
                                            <label htmlFor="" style={{ fontSize: "12px" }}>Buttons:</label>
                                            {inputFields.map((field, index) => (
                                                <div key={index} className="col-12">
                                                    <div className="p-0 position-relative d-flex align-items-start flex-column mb-1">
                                                        {/* <div> */}
                                                        <span className='fw-bolder text-black mt-1' style={{ fontSize: "0.75rem" }}>Button:</span>
                                                        <input
                                                            style={{ fontSize: "12px" }}
                                                            className='form-control'
                                                            type="text"
                                                            placeholder='placeholder'
                                                            value={formData[`buttonText${index + 1}`]}
                                                            // onChange={(e) => handleInputChange(index, `buttonText${index + 1}`, e.target.value)}
                                                            onChange={(e) => {
                                                                const { name, value } = e.target
                                                                setFormData(prevData => ({
                                                                    ...prevData,
                                                                    [name]: value
                                                                }))
                                                            }}
                                                            name={`buttonText${index + 1}`}
                                                        />
                                                        {/* </div> */}
                                                        {/* <div> */}
                                                        <div className='d-flex justify-content-between mt-1 w-100' style={{ marginBottom: '10px' }}>
                                                            <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>Title:</span>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input cursor-pointer"
                                                                name="inputfield"
                                                                checked={field.showInput}
                                                                onChange={() => handleCheckboxChange(index)}
                                                            />
                                                        </div>
                                                        {field.showInput && (
                                                            <input
                                                                style={{ fontSize: "12px" }}
                                                                className='form-control'
                                                                type="text"
                                                                placeholder='placeholder'
                                                                value={formData[`inputPlaceholder${index + 1}`]}
                                                                onChange={(e) => {
                                                                    const { name, value } = e.target
                                                                    setFormData(prevData => ({
                                                                        ...prevData,
                                                                        [name]: value
                                                                    }))
                                                                }}
                                                                name={`inputPlaceholder${index + 1}`}
                                                            />
                                                        )}
                                                        {/* </div> */}

                                                        <span
                                                            className="d-flex justify-content-center align-items-center end-0 p-1 cursor-pointer w-100"
                                                            onClick={() => handleRemoveField(index)}
                                                        >
                                                            <AiOutlineClose color='red' size={12.5} />
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="col-12">
                                                <button
                                                    style={{ padding: "5px" }}
                                                    className="btn btn-dark w-100"
                                                    onClick={handleAddField}
                                                >
                                                    <BiPlusCircle color='white' size={17.5} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='my-2'>
                                            <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>Input Placeholder:</span>
                                            <div className="d-flex p-0 justify-content-between align-items-center gap-2">
                                                <input type="text" name='inputPlaceholder' min="0" max="300" className='form-control' value={formData.inputPlaceholder1} onChange={(e) => {
                                                    const { name, value } = e.target
                                                    setFormData(prevData => ({
                                                        ...prevData,
                                                        [name]: value
                                                    }))
                                                }} />
                                            </div>
                                        </div>
                                        <button className='btn bbtn-primary fw-bolder text-black' style={{ fontSize: "0.75rem" }} onClick={testReq}>Sound:</button><br />
                                        <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>Vibration:</span>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center bg-light-secondary flex-grow-1" style={{ width: sideNav === "rules" ? "auto" : `calc(100vw - ${sideNav !== "" ? sectionWidths.editSection : "0"}px - ${sectionWidths.drawerWidth}px - ${sectionWidths.sidebar}px)`, transition: "0.3s ease-in-out" }}>
                    <Render {...formData} />
                </div>
            </div>
        </>
    )
}
export default CustomizationParent