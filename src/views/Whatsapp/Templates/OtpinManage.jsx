/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Card, CardBody, Col, Container, Input, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import whatsapp from './imgs/whatsapp.png'
import toast from 'react-hot-toast'
import Select from 'react-select'
import { Download, FileText, Image, Trash2 } from 'react-feather'
import ResizableTextarea from "./components/ResizableTextarea"
import { getReq, postReq } from '../../../assets/auth/jwtService'
import { getBoldStr } from '../SmallFunction'

export default function OtpinManage() {

    const msgTypeData = [
        {
            label: "Text",
            value: "TEXT"
        },
        {
            label: "Image",
            value: "IMAGE"
        },
        {
            label: "Document",
            value: "DOCUMENT"
        },
        {
            label: "Video",
            value: "VIDEO"
        }
    ]

    // opt out
    const [modal, setModal] = useState(false)
    const [modalIn, setModalIn] = useState(false)
    const [useOptOutRespConfig, setOptOutRespConfig] = useState({
        message_body: 'You have been opted-out of your future communications',
        type: "TEXT"
    })
    const [useOptInRespConfig, setOptInRespConfig] = useState({
        message_body: 'You have been opted-out of your future communications',
        type: "TEXT"
    })

    const [optOutKeyWords, setOptOutKeyWords] = useState([''])
    const [optInKeyWords, setOptInKeyWords] = useState([''])

    // opt in
    const toggle = () => setModal(!modal)
    const toggleIn = () => setModalIn(!modalIn)
    const addInputField = (type) => {
        const keywords = type === "in" ? optInKeyWords : optOutKeyWords
        if (keywords?.length < 5) {
            if (type === "in") {
                setOptInKeyWords([...keywords, ''])
            } else {
                setOptOutKeyWords([...keywords, ''])
            }
        }
    }
    
    const delInputField = (type, id) => {
        const keywords = type === "in" ? optInKeyWords : optOutKeyWords
        if (type === "in") {
            setOptInKeyWords(prev => prev.filter((_, index) => index !== id))
        } else {
            setOptOutKeyWords(prev => prev.filter((_, index) => index !== id))
        }
    }
    
    const handleKeyWordChange = (type, index, value) => {
        const keywords = type === "in" ? [...optInKeyWords] : [...optOutKeyWords]
        keywords[index] = value
        if (type === "in") {
            setOptInKeyWords(keywords)
        } else {
            setOptOutKeyWords(keywords)
        }
    }
    
    const updateState = (type, key, value) => {
        if (type === "in") {
            setOptInRespConfig(prevState => {
                if (prevState[key] !== value) {
                    return { ...prevState, [key]: value }
                }
                return prevState
            })
        } else {
            setOptOutRespConfig(prevState => {
                if (prevState[key] !== value) {
                    return { ...prevState, [key]: value }
                }
                return prevState
            })
        }
    }

    const RenderWhatsppUI = ({ UIdata }) => {
        return (
            <Card className='rounded-3 shadow-lg  position-relative ' style={{ width: "400px", whiteSpace: 'pre-wrap' }} >
                <img src={whatsapp} alt="" width={40} className=' position-absolute  ' style={{ marginTop: "-20px", marginLeft: "-20px", zIndex: '8' }} />
                {
                    UIdata?.type === "TEXT" &&
                    <CardBody  >
                        <h5>{getBoldStr(UIdata?.message_body)}</h5>
                    </CardBody>

                }
                {
                    UIdata?.type === "IMAGE" &&
                    <CardBody className='p-0 ' >
                        <div style={{ height: "200px" }}>
                            {UIdata?.mediaUrl && (
                                <img
                                    className='img-fluid border-0 rounded-top-2 w-100 object-fit-cover'
                                    style={{ height: "200px" }}
                                    src={typeof UIdata.mediaUrl === 'object' ? URL.createObjectURL(UIdata.mediaUrl) : UIdata.mediaUrl}
                                    alt=""
                                />
                            )}
                        </div>
                        <div className='p-1' >

                            <h5 >{getBoldStr(UIdata?.caption)}</h5>
                        </div>
                    </CardBody>

                }
                {
                    UIdata?.type === "DOCUMENT" &&
                    <CardBody className='position-relative d-flex align-items-center '>
                        <FileText size={25} />
                        <h5 className='m-0 ms-1 '>{UIdata?.file_name ? UIdata.file_name : 'Untitled'}</h5>
                        <Download size={25} className=' position-absolute  end-0 me-2' />
                    </CardBody>

                }
                {
                    UIdata?.type === "VIDEO" &&
                    <CardBody className='p-0 ' >
                        <div style={{ height: "200px" }} >

                            {UIdata?.mediaUrl &&
                                <video className=' object-fit-cover w-100' controls style={{ height: "200px" }}>
                                    <source
                                        src={(function () {
                                            try {
                                                return URL.createObjectURL(UIdata.mediaUrl)
                                            } catch (error) {
                                                // console.error('Error creating object URL:', error)
                                                return UIdata.mediaUrl // Fallback to Header.file if there's an error
                                            }
                                        })()}
                                        type="video/mp4"
                                    />
                                    Video not supported.
                                </video>
                            }
                        </div>
                        <div className='p-1'>
                            <h5>{getBoldStr(UIdata?.caption)}</h5>
                        </div>
                    </CardBody>

                }
            </Card>
        )
    }
    const getData = () => {
        getReq("opt_settings")
            .then((resp) => {
                console.log(resp)

                resp?.data?.opt_settings_instance?.map((elm) => {
                    if (elm.opt_out) {
                        setOptOutKeyWords(elm?.opt_keyword ?? [""])
                        let jsonString = elm?.message_data.replace(/'/g, '"')
                        jsonString = jsonString.replace(/None/g, 'null')
                        const old = JSON.parse(jsonString)
                        const newData = {
                            message_body: old?.message_body,
                            caption: old?.caption,
                            type: old?.type?.toUpperCase(),
                            mediaUrl: old?.media_link,
                            is_active: elm?.is_active
                        }
                        setOptOutRespConfig(newData)
                    } else {
                        setOptInKeyWords(elm?.opt_keyword ?? [""])
                        let jsonString = elm?.message_data.replace(/'/g, '"')
                        jsonString = jsonString.replace(/None/g, 'null')
                        const old = JSON.parse(jsonString)
                        const newData = {
                            message_body: old?.message_body,
                            caption: old?.caption,
                            type: old?.type?.toUpperCase(),
                            mediaUrl: old?.media_link,
                            is_active: elm?.is_active
                        }
                        setOptInRespConfig(newData)
                    }
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // get data
    useEffect(() => {
        getData()
    }, [])


    const submitForm = (type, isOptIn) => {
        const formData = new FormData()
        formData.append('opt', isOptIn)
        
        const config = isOptIn ? useOptInRespConfig : useOptOutRespConfig
        
        if (type === "template") {
            const mediaType = config?.mediaUrl?.type
            const caption = config?.caption
            
            if (config?.message_body) {
                formData.append("type", "text")
                formData.append("message_body", config.message_body)
            } else if (mediaType === "image/jpeg" || mediaType === "image/png") {
                formData.append("file", config.mediaUrl)
                formData.append("type", "image")
                formData.append("caption", caption)
            } else if (mediaType === "video/mp4") {
                formData.append("file", config.mediaUrl)
                formData.append("type", "video")
                formData.append("caption", caption)
            } else if (mediaType === "application/pdf") {
                formData.append("file", config.mediaUrl)
                formData.append("filename", config.mediaUrl?.name)
                formData.append("type", "document")
                formData.append("caption", caption)
            }
        } else if (type === "keylist") {
            const keyValues = isOptIn ? optInKeyWords : optOutKeyWords
            const filteredKeys = keyValues.filter(item => item !== "")
            formData.append('keyword_list', filteredKeys)
        } else if (type === "isActive") {
            formData.append('is_active', !config?.is_active)
        }
        
        postReq("opt_settings", formData)
            .then((resp) => {
                console.log(resp)
                setModal(false)
                setModalIn(false)
                getData()
            })
            .catch((error) => {
                console.log(error)
            })
    }
    
    const submitFormOutt = (type) => {
        submitForm(type, false)
    }
    
    const submitFormInn = (type) => {
        submitForm(type, true)
    }
    
    return (
        <Container>
            <style>
                {`
                @media (min-width: 992px) {

                    .modal-dialog {
                        --bs-modal-width: 1000px;
                    }
                }
                `}
            </style>
            <Card>
                <CardBody>
                    <h4 className="">Opt-in Management</h4>
                    <p className="fs-5">Setup keywords that user can type to Opt-in & Opt-out from messaging campaign</p>
                </CardBody>
            </Card>

            {/* optin 1 */}
            <Card>
                <CardBody>
                    <Row>
                        <Col md="6" >
                            <div className="p-2">
                                <h4 className="">Opt-out Keywords</h4>
                                <p className="fs-5">The user will have to type exactly one of these messages
                                    on which they should be automatically opted-out
                                </p>
                                <Row className='d-flex flex-column  gap-1'>
                                    {optOutKeyWords?.map((elm, index) => (
                                        <Col key={index} md="7" className=' d-flex align-items-center'>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name={`email_${index}`}
                                                value={elm}
                                                placeholder='Enter Keywords'
                                                onChange={(e) => handleKeyWordChange('out', index, e.target.value)}
                                            />
                                            <div className='ms-2' onClick={() => delInputField(1, index)}><Trash2 size={20} /> </div>
                                        </Col>
                                    ))}
                                </Row>

                                <button className={`btn text-success mt-3  `} onClick={() => addInputField('out')} >+ Add more</button>
                                <button className='btn btn-success text-white mt-3 ms-1' onClick={() => submitFormOutt("keylist")}>Save Setting</button>
                            </div>
                        </Col>
                        <Col md="6" >
                            <div className="p-2">
                                <div className='d-flex justify-content-between '>
                                    <div>
                                        <h4 className="">Opt-out Response</h4>
                                        <p className="fs-5">Setup a response message for opt-out user keywords </p>
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center '>
                                        <div className='form-check form-switch form-check-success'>
                                            <Input type='checkbox' id='inviteReceived' checked={useOptOutRespConfig?.is_active} onChange={() => submitFormOutt("isActive")} />
                                        </div>
                                        <button className='btn btn-outline-primary ' onClick={toggle}>Configure</button>

                                    </div>
                                </div>
                                <div className='d-flex align-items-center  flex-column  mt-4 '>
                                    <RenderWhatsppUI UIdata={useOptOutRespConfig} />
                                    <p >Auto response is disabled</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {/* optin 2 */}
            <Card>
                <CardBody>
                    <Row>
                        <Col md="6" >
                            <div className="p-2">
                                <h4 className="">Opt-in Keywords</h4>
                                <p className="fs-5">The user will have to type exactly one of these messages
                                    on which they should be automatically opted-out
                                </p>
                                <Row className='d-flex flex-column  gap-1'>
                                    {optInKeyWords?.map((elm, index) => (
                                        <Col key={index} md="7" className=' d-flex align-items-center'>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name={`email_${index}`}
                                                value={elm}
                                                placeholder='Enter Keywords'
                                                onChange={(e) => handleKeyWordChange("in", index, e.target.value)}
                                            />
                                            <div className='ms-2' onClick={() => delInputField(2, index)}><Trash2 size={20} /> </div>
                                        </Col>
                                    ))}
                                </Row>

                                <button className={`btn text-success mt-3  `} onClick={() => addInputField("in")} >+ Add more</button>
                                <button className='btn btn-success text-white mt-3 ms-1' onClick={() => submitFormInn("keylist")}>Save Setting</button>
                            </div>
                        </Col>
                        <Col md="6" >
                            <div className="p-2">
                                <div className='d-flex justify-content-between '>
                                    <div>
                                        <h4 className="">Opt-in Response</h4>
                                        <p className="fs-5">Setup a response message for Opt-in user keywords </p>
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center '>
                                        <div className='form-check form-switch form-check-success'>
                                            <Input type='checkbox' id='inviteReceived' checked={useOptInRespConfig?.is_active} onChange={() => submitFormInn("isActive")} />
                                        </div>
                                        <button className='btn btn-outline-primary ' onClick={toggleIn}>Configure</button>

                                    </div>
                                </div>
                                <div className='d-flex align-items-center  flex-column  mt-4 '>
                                    <RenderWhatsppUI UIdata={useOptInRespConfig} />
                                    <p >Auto response is disabled</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {/* modal 1 */}
            <Modal isOpen={modal} toggle={toggle} scrollable={true} size="lg">
                <ModalHeader toggle={toggle} className='mt-2 px-3'>
                    <h4 className="">Configure Message</h4>
                    <p className="fs-5 text-secondary">Send template message from one of your pre approved templates. You can also opt to send regular message to active users.</p>
                </ModalHeader>
                <ModalBody className='px-3 ' style={{ minHeight: "435px" }}>
                    <Row >
                        <Col lg="6" >
                            <div style={{ maxWidth: "380px" }}>

                                <div>
                                    <div className='mt-3' >
                                        <h4 className="m-0">Message Type {useOptOutRespConfig?.type}</h4>
                                        <p className="fs-5 m-0 text-secondary">Select one of available message types</p>

                                        <Select
                                            className='mt-1'
                                            isMulti={false}
                                            options={msgTypeData}
                                            closeMenuOnSelect={true}
                                            value={msgTypeData.find((elm) => elm.value === useOptOutRespConfig?.type)}
                                            onChange={(e) => {
                                                // Check if the selected value is different from the current value
                                                if (e && e.value !== useOptOutRespConfig?.type) {
                                                    setOptOutRespConfig({ type: e.value })
                                                } else {
                                                    // Handle the case when the selected value is the same
                                                    // You can choose to do something else or omit this block
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='mt-2'>
                                        {(() => {
                                            switch (useOptOutRespConfig?.type) {
                                                case 'TEXT':
                                                    return (
                                                        <div>
                                                            <h4 className="m-0">Message</h4>
                                                            <p className="fs- m-0 text-secondary">Your message can be up to 4096 characters long.</p>
                                                            <ResizableTextarea
                                                                maxLength={4096}
                                                                initialContent={useOptOutRespConfig?.message_body ?? ''}
                                                                placeholder='Opt-out Message'
                                                                onChange={(e) => updateState('out', 'message_body', e.target.value)}
                                                            />
                                                            {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
                                                        </div>
                                                    )
                                                case 'IMAGE':
                                                case 'DOCUMENT':
                                                case 'VIDEO':
                                                    return (
                                                        <div className='d-flex flex-column gap-2'>
                                                            <div>
                                                                <h4 className="m-0">Media</h4>
                                                                <div className='d-flex align-items-center gap-1 '>
                                                                    <div className='d-flex align-items-center gap-1'>
                                                                        <input type="file" className='d-none' name="carouselMediaUrl" id="carouselMediaUrl"
                                                                            onChange={(e) => {
                                                                                const selectedFile = e.target.files[0]
                                                                                if (selectedFile) {
                                                                                    let acceptedTypes
                                                                                    switch (useOptOutRespConfig?.type) {
                                                                                        case 'IMAGE':
                                                                                            acceptedTypes = ['image/png', 'image/jpeg']
                                                                                            break
                                                                                        case 'VIDEO':
                                                                                            acceptedTypes = ['video/mp4']
                                                                                            break
                                                                                        case 'DOCUMENT':
                                                                                            acceptedTypes = ['application/pdf']
                                                                                            break
                                                                                        default:
                                                                                            acceptedTypes = []
                                                                                    }
                                                                                    if (acceptedTypes.includes(selectedFile.type)) {
                                                                                        setOptOutRespConfig((prev) => ({ ...prev, mediaUrl: selectedFile }))
                                                                                        toast.dismiss()
                                                                                    } else {
                                                                                        toast.error(`Incorrect file type. Only ${acceptedTypes.join(', ')} allowed.`)
                                                                                    }
                                                                                }
                                                                            }} />
                                                                        <label htmlFor="carouselMediaUrl" className='d-flex gap-1 btn btn-secondary rounded-2  justify-content-center  align-items-center  border px-3' style={{ width: "300px", padding: "3px 0" }}><Image /> <p className="m-0">Upload from  Library</p> </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="m-0">Caption</h4>
                                                                <p className="fs m-0 text-secondary">Your message can be up to 4096 characters long.</p>
                                                                <ResizableTextarea
                                                                    maxLength={4096}
                                                                    initialContent={useOptOutRespConfig?.caption ?? ''}
                                                                    placeholder='Your caption goes here'
                                                                    onChange={(e) => updateState('out', 'caption', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                default:
                                                    return null
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* UI output */}
                        <Col lg="6" className='d-flex align-items-center  justify-content-center pt-5 pt-lg-1' >
                            <RenderWhatsppUI UIdata={useOptOutRespConfig} />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className=''>
                    <Button color="secondary" onClick={() => { toggle(); getData() }}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={() => submitFormOutt("template")}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>


            {/* modal 2 */}
            <Modal isOpen={modalIn} toggle={toggleIn} scrollable={true} size="lg">
                <ModalHeader toggle={toggleIn} className='mt-2 px-3'>
                    <h4 className="">Configure Message</h4>
                    <p className="fs-5 text-secondary">Send template message from one of your pre approved templates. You can also opt to send regular message to active users.</p>
                </ModalHeader>
                <ModalBody className='px-3 ' style={{ minHeight: "435px" }}>
                    <Row >
                        <Col lg="6" >
                            <div style={{ maxWidth: "380px" }}>

                                <div>
                                    <div className='mt-3' >
                                        <h4 className="m-0">Message Type {useOptInRespConfig?.type}</h4>
                                        <p className="fs-5 m-0 text-secondary">Select one of available message types</p>

                                        <Select
                                            className='mt-1'
                                            isMulti={false}
                                            options={msgTypeData}
                                            closeMenuOnSelect={true}
                                            value={msgTypeData.find((elm) => elm.value === useOptInRespConfig?.type)}
                                            onChange={(e) => {
                                                // Check if the selected value is different from the current value
                                                if (e && e.value !== useOptInRespConfig?.type) {
                                                    setOptInRespConfig({ type: e.value })
                                                } else {
                                                    // Handle the case when the selected value is the same
                                                    // You can choose to do something else or omit this block
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='mt-2'>
                                        {(() => {
                                            switch (useOptInRespConfig?.type) {
                                                case 'TEXT':
                                                    return (
                                                        <div>
                                                            <h4 className="m-0">Message</h4>
                                                            <p className="fs- m-0 text-secondary">Your message can be up to 4096 characters long.</p>
                                                            <ResizableTextarea
                                                                maxLength={4096}
                                                                initialContent={useOptInRespConfig?.message_body ?? ''}
                                                                placeholder='Opt-out Message'
                                                                onChange={(e) => updateState("in", 'message_body', e.target.value)}
                                                            />
                                                            {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
                                                        </div>
                                                    )
                                                case 'IMAGE':
                                                case 'DOCUMENT':
                                                case 'VIDEO':
                                                    return (
                                                        <div className='d-flex flex-column gap-2'>
                                                            <div>
                                                                <h4 className="m-0">Media</h4>
                                                                <div className='d-flex align-items-center gap-1 '>
                                                                    <div className='d-flex align-items-center gap-1'>
                                                                        <input type="file" className='d-none' name="carouselMediaUrl" id="carouselMediaUrl"
                                                                            onChange={(e) => {
                                                                                const selectedFile = e.target.files[0]
                                                                                if (selectedFile) {
                                                                                    let acceptedTypes
                                                                                    switch (useOptInRespConfig?.type) {
                                                                                        case 'IMAGE':
                                                                                            acceptedTypes = ['image/png', 'image/jpeg']
                                                                                            break
                                                                                        case 'VIDEO':
                                                                                            acceptedTypes = ['video/mp4']
                                                                                            break
                                                                                        case 'DOCUMENT':
                                                                                            acceptedTypes = ['application/pdf']
                                                                                            break
                                                                                        default:
                                                                                            acceptedTypes = []
                                                                                    }
                                                                                    if (acceptedTypes.includes(selectedFile.type)) {
                                                                                        setOptInRespConfig((prev) => ({ ...prev, mediaUrl: selectedFile }))
                                                                                        toast.dismiss()
                                                                                    } else {
                                                                                        toast.error(`Incorrect file type. Only ${acceptedTypes.join(', ')} allowed.`)
                                                                                    }
                                                                                }
                                                                            }} />
                                                                        <label htmlFor="carouselMediaUrl" className='d-flex gap-1 btn btn-secondary rounded-2  justify-content-center  align-items-center  border px-3' style={{ width: "300px", padding: "3px 0" }}><Image /> <p className="m-0">Upload from  Library</p> </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="m-0">Caption</h4>
                                                                <p className="fs m-0 text-secondary">Your message can be up to 4096 characters long.</p>
                                                                <ResizableTextarea
                                                                    maxLength={4096}
                                                                    initialContent={useOptInRespConfig?.caption ?? ''}
                                                                    placeholder='Your caption goes here'
                                                                    onChange={(e) => updateState('in', 'caption', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                default:
                                                    return null
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* UI output */}
                        <Col lg="6" className='d-flex align-items-center  justify-content-center pt-5 pt-lg-1' >
                            <RenderWhatsppUI UIdata={useOptInRespConfig} />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className=''>
                    <Button color="secondary" onClick={() => { toggleIn(); getData() }}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={() => submitFormInn("template")}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    )
}
