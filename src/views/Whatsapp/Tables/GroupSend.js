/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { CornerDownLeft, ExternalLink, FileText, Phone } from 'react-feather'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    Card, CardBody, Col, Container,
    Row
} from 'reactstrap'
import { postReq } from '../../../assets/auth/jwtService'
import FrontBaseLoader from '../../Components/Loader/Loader'
import wp_back from '../Templates/imgs/wp_back.png'


export default function GroupSend() {
const {id} = useParams()
    const nagivate = useNavigate()
    const [useLoader, setLoader] = useState(true)
    const [AllTemplatesData, setAllTemplatesData] = useState([])
    const [ActiveTemplates, setActiveTemplates] = useState([])
    const [useSelectedContacts, setSelectedContacts] = useState([])

    // get all data
    const getDataTemplates = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
        setLoader(true)
        // Create a new FormData object and append the searchValue
        const formData = new FormData()

        Object.entries(advanceSearchValue).map(([key, value]) => value && formData.append(key, value))
        formData.append("slug", "customer_data")
        formData.append("page", currentPage + 1)
        formData.append("size", currentEntry)
        formData.append("searchValue", searchValue)

        postReq("getTemplates", formData)
            .then(data => {
                // Handle the successful response here
                // console.log('Response:', data.data.data)
                setAllTemplatesData(data.data.data)
                setActiveTemplates(data.data.active_id)
            })
            .catch(error => {
                // Handle errors here
                console.error('Error:', error)
                toast.error("Server error")
            })
            .finally(() => {
                setLoader(false)
            })
    }

    const getContacts = () => {
        const form_data = new FormData()
        form_data.append("group_contact", id)
        postReq(`get_group_contact`, form_data)
          .then(res => {
            console.log('res:', res.data)
            setSelectedContacts(() => res.data.contact_grp.map((elm) => elm.id))
          })
          .catch(error => {
            // Handle errors here
            console.error('Error:', error)
          })
      }
    useEffect(() => {
        getDataTemplates()
        getContacts()
    }, [])


    // str to bold
    const getBoldStr = (str) => {
        str = str.replace(/\*(.*?)\*/g, (_, p1) => `<strong>${p1}</strong>`)
        str = str.replace(/_(.*?)_/g, (_, p1) => `<em>${p1}</em>`)
        str = str.replace(/~(.*?)~/g, (_, p1) => `<del>${p1}</del>`)
        return str
    }
    // all themes display ui message
    const updateDisplayedMessage = (inputString, defData) => {
        let updatedMessage = getBoldStr(inputString)
        if (defData.example) {
            const data = defData.example.body_text[0]
            updatedMessage = updatedMessage.replace(/{{(\d+)}}/g, (_match, index) => {
                return `[${data[index - 1]}]`
            })
        }
        return updatedMessage
    }
    const updateHeaderDisplayedMessage = (inputString, defData) => {
        let updatedMessage = getBoldStr(inputString)
        if (defData.example) {
            const data = defData.example.header_text[0]
            updatedMessage = updatedMessage.replace(/{{(\d+)}}/g, () => {
                return `[${data}]`
            })
        }
        return updatedMessage
    }

    // send template bulk msg
    const sendTemplateBulk = (id) => {

        const formData = new FormData()

        formData.append("template_id", id)
        formData.append("contact_group_list", useSelectedContacts.toString())
        // if (CurrentTemplate.components[0]?.format === "DOCUMENT") {
        //     formData.append("filename", "Document")
        // }
        // console.log(formData)
        setLoader(true)
        postReq("bulk_message", formData)
            .then(data => {
                toast.success("Message has sent!")
            })
            .catch(error => {
                // Handle errors here
                console.error('Error:', error)
                toast.error("Please try again")
            })
            .finally(() => {
                setLoader(false)
            })
    }

    //render templates
    const renderTemp = (SingleTemplate) => {
        return (
            <CardBody className="border-0 p-2  pe-5 hideScroll rounded-2 " style={{ backgroundImage: `url(${wp_back})`, gap: "5px", height: "400px", overflowY: "auto", scrollbarWidth: "0" }}>

                <div className="border-1 rounded-2 mb-0 whatsapp_template_card" >
                    <div className='p-0' >
                        {

                            SingleTemplate.components.map((data) => {
                                if (data.format === "TEXT") {
                                    return (
                                        <div className='p-1 pb-0'  >
                                            <h6 className='fs-4 text-black bolder mb-1' dangerouslySetInnerHTML={{ __html: updateHeaderDisplayedMessage(data.text, data) }}></h6>

                                            {/* <h6 className='fs-4 text-black bolder mb-1 '>{data.text}</h6> */}
                                        </div>
                                    )
                                }
                                if (data.format === "IMAGE") {
                                    return (
                                        <div className='p-1'  >
                                            <img className='rounded-3 img-fluid border-0 rounded w-100 object-fit-cover ' src={data?.example?.header_handle[0] ?? ""} alt="" />
                                        </div>
                                    )
                                }
                                if (data.format === "VIDEO") {
                                    return (
                                        <div className='p-1'  >
                                            <video className='rounded-3  object-fit-cover w-100' controls autoPlay mute style={{ height: "170px" }}>
                                                <source
                                                    src={data.example.header_handle[0] ?? ""}
                                                    type="video/mp4"
                                                />
                                                Video not supported.
                                            </video>
                                        </div>
                                    )
                                }
                                if (data.format === "DOCUMENT") {
                                    return (
                                        <div className='border-bottom  d-flex justify-content-center  align-items-center py-3' style={{ height: "50px" }}>
                                            <FileText size={30} color='#000' />
                                        </div>
                                    )
                                }
                                if (data.type === "BODY") {
                                    return (
                                        <div className='p-1 pe-2' >
                                            <p className='fs-6' dangerouslySetInnerHTML={{ __html: updateDisplayedMessage(data.text, data) }}></p>

                                        </div>
                                    )
                                }
                                if (data.type === "FOOTER") {
                                    return (
                                        <div className=' ps-1 pe-2 pt-0' >
                                            <p className='text-secondary font-small-3 mt-0'>{data.text} </p>
                                        </div>
                                    )
                                }
                                if (data.type === "BUTTONS") {
                                    return data.buttons.map((data) => {
                                        if (data.type === "URL") {
                                            return (
                                                <div className="border-top  d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                                    <ExternalLink size={17} /><h6 className='m-0 text-primary' >{data.text}</h6>
                                                </div>
                                            )
                                        }
                                        if (data.type === "PHONE_NUMBER") {
                                            return (
                                                <div className="border-top  d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                                    <Phone size={17} /><h6 className='m-0 text-primary' >{data.text}</h6>
                                                </div>
                                            )
                                        }
                                        if (data.type === "QUICK_REPLY") {
                                            return (
                                                <div className="border-top  bg-white rounded-bottom-3   d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                                    <CornerDownLeft size={17} /><h6 className='m-0 text-primary' > {data.text}</h6>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            })
                        }

                    </div>
                </div>

            </CardBody>
        )
    }
    return (
        <Container fluid className='px-0'>
            {
                useLoader && <FrontBaseLoader />
            }
            <Link to='/merchant/whatsapp/groups' className='btn btn-primary btn-sm mb-1' >Back</Link>
            <Card>
                <CardBody className='d-flex justify-content-between '>
                    <h4 className="m-0">Select Templtes</h4>
                </CardBody>
            </Card>
            <div className="d-flex justtify-content-center align-items-start">
                <div className="content_here w-100">
                    <Row className='match-height '>
                        <Card className='border-0'>
                            <CardBody>
                                <Row className='match-height align-items-center '>

                                    {
                                        !AllTemplatesData  && <div className='fs-4 text-center mt-5 fw-bolder'>No Templates Available</div>
                                    }
                                    {
                                        AllTemplatesData && AllTemplatesData.map((SingleTemplate) => {
                                            let IsActive = true
                                            if (ActiveTemplates?.includes(SingleTemplate?.id)) {
                                                IsActive = true
                                            } else {
                                                IsActive = false
                                            }
                                            return (

                                                <Col md="6" lg="4" className='d-flex justify-content-center ' >
                                                    <Card className="border p-1 rounded-2   position-relaive  shadow-lg " style={{ background: "#fff", gap: "5px", maxWidth: "500px" }} >
                                                        {
                                                            renderTemp(SingleTemplate)
                                                        }

                                                        <div className='mt-  '>
                                                            <div className='mt-2  rounded-3 d-flex justify-content-end  '>
                                                                <div className='d-flex justify-content-evenly position-absolute top-0 end-0 me-1' style={{ marginTop: "8px", marginRight: "8" }}>

                                                                    {
                                                                        SingleTemplate.status === "APPROVED" && <div className=' border-0 px-1 bg-success text-white rounded-2 shadow-lg '>Approved</div>
                                                                    }
                                                                    {
                                                                        SingleTemplate.status === "REJECTED" && <div className=' border-0 px-1 bg-danger text-white rounded-2'>Rejected</div>
                                                                    }
                                                                    {
                                                                        SingleTemplate.status === "PENDING" && <div className=' border-0 px-1 bg-warning text-white rounded-2'>Pending</div>
                                                                    }
                                                                </div>

                                                                {/* <button className='btn btn-primary' onClick={() => delTemplate(SingleTemplate.name)} >Delete</button> */}
                                                                {/* <div class="form-check form-switch form-switch-sm">
                                                      <input class="form-check-input" type="checkbox" checked={IsActive}  onChange={() => toggleActive(SingleTemplate.id, !IsActive)} role="switch" id="flexSwitchCheckDefault" />
                                                      <label class="form-check-label" for="flexSwitchCheckDefault" >Activated</label>
                                                   </div>


                                                   <button className='btn btn-primary' onClick={() => nagivate(`/merchant/whatsapp/editTemplate/${SingleTemplate.id}`)} >Edit</button>
                                                   <button className='btn btn-primary' onClick={() => getCurrentTemplate(SingleTemplate.id, 'modal')}>Test</button> */}
                                                                <button className='btn btn-primary' onClick={ () => sendTemplateBulk(SingleTemplate.id)} >Send This Message</button>
                                                            </div>
                                                        </div>

                                                    </Card>
                                                </Col>
                                            )

                                        })
                                    }

                                </Row>

                            </CardBody>
                        </Card>

                    </Row>
                </div>
            </div>
        </Container >
    )
}
