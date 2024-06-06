/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup } from 'reactstrap'
import whatsapp from './imgs/whatsapp.png'
import toast from 'react-hot-toast'
import Select from 'react-select'
import { Download, FileText, Image, Trash2 } from 'react-feather'
import ResizableTextarea from "./components/ResizableTextarea"
import axios from 'axios'
import { filter, set } from 'lodash'
import { getReq, postReq } from '../../../assets/auth/jwtService'

export default function OtpinManage() {

    const msgTypeData = [
        {
            value: "Text",
            label: "Text"
        },
        {
            value: "Image",
            label: "Image"
        },
        {
            value: "File",
            label: "File"
        },
        {
            value: "Video",
            label: "Video"
        }
    ]

    // opt out
    const [modal, setModal] = useState(false)
    const [optOutTemp_type, setoptOutTemp_type] = useState('Regular')
    const [optOutMsg_type, setoptOutMsg_type] = useState(msgTypeData[0])

    const [useOptOutRespConfig, setOptOutRespConfig] = useState({
        msgBody: 'You have been opted-out of your future communications'
    })

    // opt in
    const [modal_2, setModal_2] = useState(false)
    const [optInTemp_type, setoptInTemp_type] = useState('Regular')
    const [optInMsg_type, setoptInMsg_type] = useState(msgTypeData[0])

    const [useOptInRespConfig, setOptInRespConfig] = useState({
        msgBody: 'Thanks, You have been opted-in of your future communications'
    })
    const toggle = () => setModal(!modal)
    const toggle2 = () => setModal_2(!modal_2)

    const makeToast = (msg = "success") => {
        toast.success(msg)
    }
    const [optOutKeyWords, setOptOutKeyWords] = useState(['Stop'])
    const [optInKeyWords, setOptInKeyWords] = useState(['Allow'])

    const addInputField = (num) => {
        if (num === 2) {
            // console.log("len", optInKeyWords.length)
            if (optInKeyWords.length < 5) {
                setOptInKeyWords([...optInKeyWords, ''])
            }

        } else {
            if (optOutKeyWords.length < 5) {
                setOptOutKeyWords([...optOutKeyWords, ''])

            }
        }
    }

    const delInputField = (num, id) => {
        const newArray = [...optOutKeyWords]
        if (num === 2) {
            // console.log("len", optInKeyWords.length)
            if (optInKeyWords.length < 5) {
                setOptInKeyWords([...optInKeyWords, ''])
            }

        } else {
            const newArray = optOutKeyWords.filter((_, index) => index !== id)
            setOptOutKeyWords(newArray)
        }
    }

    const handleKeyWordChange = (index, value) => {
        const updatedInputs = [...optOutKeyWords]
        updatedInputs[index] = value
        setOptOutKeyWords(updatedInputs)
        // console.log(updatedInputs)   
    }


    const updateState = (key, value) => {
        setOptOutRespConfig(prevState => ({ ...prevState, [key]: value }))
    }
    const updateState2 = (key, value) => {
        setOptInRespConfig(prevState => ({ ...prevState, [key]: value }))
    }
    const boldWordsInString = (inputString) => {
        if (inputString) {

            const boldedString = inputString.replace(/\*(.*?)\*/g, (_, match) => `<span style="font-weight: bolder;">${match}</span>`)
            return <p dangerouslySetInnerHTML={{ __html: boldedString }} />
        } else return null
    }
    const RenderWhatsppUI = ({ UIdata, msgDataType }) => {
        return (
            <Card className='rounded-3 shadow-lg  position-relative ' style={{ width: "400px", whiteSpace: 'pre-wrap' }} >
                <img src={whatsapp} alt="" width={40} className=' position-absolute  ' style={{ marginTop: "-20px", marginLeft: "-20px", zIndex: '8' }} />
                {
                    msgDataType.value === "Text" &&
                    <CardBody  >
                        <h5>{boldWordsInString(UIdata?.msgBody)}</h5>
                    </CardBody>

                }
                {
                    msgDataType.value === "Image" &&
                    <CardBody className='p-0 ' >
                        <div style={{ height: "200px" }} >

                            {UIdata?.mediaUrl && <img className=' img-fluid border-0 rounded-top-2 w-100 object-fit-cover ' style={{ height: "200px" }} src={UIdata.mediaUrl} alt="" />}
                        </div>
                        <div className='p-1' >

                            <h5 >{boldWordsInString(UIdata?.caption)}</h5>
                        </div>
                    </CardBody>

                }
                {
                    msgDataType.value === "File" &&
                    <CardBody className='position-relative d-flex align-items-center '>
                        <FileText size={25} />
                        <h5 className='m-0 ms-1 '>{UIdata?.file_name ? UIdata.file_name : 'Untitled'}</h5>
                        <Download size={25} className=' position-absolute  end-0 me-2' />
                    </CardBody>

                }
                {
                    msgDataType.value === "Video" &&
                    <CardBody className='p-0 ' >
                        <div style={{ height: "200px" }} >

                            {UIdata?.mediaUrl &&
                                <video className=' object-fit-cover w-100' controls style={{ height: "200px" }}>
                                    <source
                                        src={UIdata?.mediaUrl}
                                        type="video/mp4"
                                    />
                                    Video not supported.
                                </video>
                            }
                        </div>
                        <div className='p-1'>
                            <h5>{boldWordsInString(UIdata?.caption)}</h5>
                        </div>
                    </CardBody>

                }
                {
                    msgDataType.value === "Audio" &&
                    <CardBody className=''>
                        <audio controls>
                            <source src={UIdata?.mediaUrl}
                                type="audio/mpeg" />
                        </audio>
                    </CardBody>

                }
            </Card>
        )
    }
    const renderMediaContent = () => (
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
                                    switch (optOutMsg_type.value) {
                                        case 'Image':
                                            acceptedTypes = ['image/png', 'image/jpeg']
                                            break
                                        case 'Video':
                                            acceptedTypes = ['video/mp4']
                                            break
                                        case 'Document':
                                            acceptedTypes = ['application/pdf']
                                            break
                                        default:
                                            acceptedTypes = []
                                    }
                                    if (acceptedTypes.includes(selectedFile.type)) {
                                        // setHeader({ ...Header, file: selectedFile })
                                        // Clone the existing array
                                        // const updatedList = [...useCarouselMedia]
                                        // updatedList[useCurrCarouselIndex] = selectedFile
                                        // setCarouselMedia(updatedList)
                                        // console.log("list", updatedList)

                                        toast.dismiss()
                                    } else {
                                        toast.error(`Incorrect file type. Only ${acceptedTypes.join(', ')} allowed.`)
                                    }
                                }
                            }} />
                        <label htmlFor="carouselMediaUrl" className='d-flex gap-1 btn btn-secondary rounded-2  justify-content-center  align-items-center  border' style={{ width: "300px", padding: "3px 0" }}><Image /> <p className="m-0">Upload from  Library</p> </label>
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
                    onChange={(e) => updateState('caption', e.target.value)}
                />
            </div>
        </div>
    )
    const renderMessageContent = () => (
        <div>
            <h4 className="m-0">Message</h4>
            <p className="fs- m-0 text-secondary">Your message can be up to 4096 characters long.</p>
            <ResizableTextarea
                maxLength={4096}
                initialContent={useOptOutRespConfig?.msgBody ?? ''}
                placeholder='Opt-out Message'
                onChange={(e) => updateState('msgBody', e.target.value)}
            />
        </div>
    )
    useEffect(() => {
        getReq("opt_settings")
            .then((resp) => {
                console.log(resp)
                // setOptOutKeyWords(resp?.data?.keyword_list)
                // console.log("999", JSON.parse(resp?.data?.keyword_list))
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])


    const submitForm = () => {
        const newformData = new FormData()
        const optOutKeyValues = optOutKeyWords.filter(item => item !== "") // Filter out objects with empty values

        // newformData.append('keyword_list', optOutKeyValues)
        newformData.append('keyword_list', optOutKeyValues)
      form_data.append("message_body", useInputMessage)

        newformData.append('out', true)
        // newformData.append('optOutKeyValues', JSON.stringify(optOutKeyValues))


        postReq("opt_settings", newformData)
            .then((resp) => {
                console.log(resp)
            })
            .catch((error) => {
                console.log(error)
            })

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
                                                onChange={(e) => handleKeyWordChange(index, e.target.value)}
                                            />
                                            <div className='ms-2' onClick={() => delInputField(1, index)}><Trash2 size={20} /> </div>
                                        </Col>
                                    ))}
                                </Row>

                                <button className={`btn text-success mt-3  `} onClick={addInputField} >+ Add more</button>
                                {/* <button className='btn btn-success text-white mt-3 ms-1' onClick={() => makeToast("opt-out save")}>Save Setting</button> */}
                                <button className='btn btn-success text-white mt-3 ms-1' onClick={submitForm}>Save Setting</button>
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
                                            <Input type='checkbox' id='inviteReceived' onChange={() => makeToast("opt-out Enable")} />
                                        </div>
                                        <button className='btn btn-outline-primary ' onClick={toggle}>Configure</button>

                                    </div>
                                </div>
                                <div className='d-flex align-items-center  flex-column  mt-4 '>
                                    <RenderWhatsppUI UIdata={useOptOutRespConfig} msgDataType={optOutMsg_type} />
                                    <p >Auto response is disabled</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {/* modal 1 */}
            <Modal isOpen={modal} toggle={toggle} scrollable={true} size="lg"  >
                <ModalHeader toggle={toggle} className='mt-2 px-3'>
                    <h4 className="">Configure Message</h4>
                    <p className="fs-5 text-secondary">Send template message from one of your pre approved templates. You can also opt to send regular message to active users.</p>
                </ModalHeader>
                <ModalBody className='px-3 ' style={{ minHeight: "435px" }}>
                    <Row >
                        <Col lg="6" >
                            <div style={{ maxWidth: "380px" }}>

                                <div className='d-flex flex-column gap-1'>
                                    <div className='form-check p-0'>
                                        <Label className=' rounded form-check-label d-flex justify-content-start align-items-center gap-1' for='radio1' >
                                            <Input type='radio' id='radio1' style={{ marginLeft: '15px' }} name='radio1' value='Pre-approved' checked={optOutTemp_type === 'Pre-approved'} onChange={(e) => setoptOutTemp_type(e.target.value)} />
                                            <p className="m-0">Pre-approved template message</p>
                                        </Label>

                                    </div>
                                    <div className='form-check p-0'>
                                        <Label className=' rounded form-check-label d-flex justify-content-start align-items-center gap-1' for='radio2' >
                                            <Input type='radio' id='radio2' style={{ marginLeft: '15px' }} name='radio1' value='Regular' checked={optOutTemp_type === 'Regular'} onChange={(e) => setoptOutTemp_type(e.target.value)} />
                                            <p className="m-0">Regular Message</p>
                                        </Label>
                                    </div>
                                </div>


                                {/*  type of msg content */}
                                {
                                    // eslint-disable-next-line multiline-ternary
                                    optOutTemp_type === 'Regular' ?
                                        // eslint-disable-next-line multiline-ternary
                                        <div>
                                            <div className='mt-3' >
                                                <h4 className="m-0">Message Type {optOutMsg_type.value}</h4>
                                                <p className="fs-5 m-0 text-secondary">Select one of available message types</p>

                                                <Select
                                                    className='mt-1'
                                                    isMulti={false}
                                                    options={msgTypeData}
                                                    closeMenuOnSelect={true}
                                                    defaultValue={optOutMsg_type}
                                                    name="phone_code"
                                                    onChange={(e) => {
                                                        // Check if the selected value is different from the current value
                                                        if (e && e.value !== optOutMsg_type.value) {
                                                            setoptOutMsg_type(e)
                                                            setOptOutRespConfig(null)
                                                        } else {
                                                            // Handle the case when the selected value is the same
                                                            // You can choose to do something else or omit this block
                                                        }
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            fontSize: '12px'
                                                        })
                                                    }}
                                                />
                                            </div>
                                            <div className='mt-2'>
                                                {(() => {
                                                    switch (optOutMsg_type?.value) {
                                                        case 'Text':
                                                            return renderMessageContent()
                                                        case 'Image':
                                                        case 'File':
                                                        case 'Video':
                                                            return renderMediaContent()
                                                        default:
                                                            return null
                                                    }
                                                })()}
                                            </div>
                                        </div>

                                        : <div className='mt-3' >
                                            <h4 className="m-0">Template Name {optOutMsg_type.value}</h4>
                                            <p className="fs-5 m-0 text-secondary">Please choose a WhatsApp template message from your approved list</p>

                                            <Select
                                                className='mt-1'
                                                isMulti={false}
                                                options={msgTypeData}
                                                closeMenuOnSelect={true}
                                                defaultValue={msgTypeData[0]}
                                                onChange={(e) => { setoptOutMsg_type(e.value); setOptOutRespConfig(null) }}
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        fontSize: '12px'
                                                    })
                                                }}
                                            />
                                        </div>}


                            </div>
                        </Col>

                        {/* UI output */}
                        <Col lg="6" className='d-flex align-items-center  justify-content-center pt-5 pt-lg-1' >

                            <RenderWhatsppUI UIdata={useOptOutRespConfig} msgDataType={optOutMsg_type} />


                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className=''>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={() => submitForm()}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>

        </Container>
    )
}
