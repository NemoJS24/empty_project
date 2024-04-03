/* eslint-disable no-unused-vars */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { ExternalLink, File, Image, Phone, Plus, Send, Video } from 'react-feather'
import { BiSolidUserCircle } from "react-icons/bi"
import { FaEllipsisV, FaSearch } from "react-icons/fa"
import { HiOutlineTemplate } from "react-icons/hi"
import { IoMdSearch, IoMdSend } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"
import Select from 'react-select'
import {
  Button,
  Card,
  CardBody,
  Container, Input, InputGroup, InputGroupText
} from 'reactstrap'
// import Prasad from './Prasad.jpg'
import { BsReply } from 'react-icons/bs'
import { postReq } from '../../../assets/auth/jwtService'
import back from '../imgs/WhatsAppBack.png'
import wp_back from '../imgs/wp_back.png'
import { QuickReplayList, getBoldStr, templateCatgList } from '../SmallFunction'

const LiveChat = () => {
  const [useMessageData, setMessageData] = useState([])
  const [usePojectContact, setPojectContact] = useState("919820016363")

  const url = 'https://8d37-2402-e280-3d9c-20d-1d7e-f3d6-c09b-c412.ngrok-free.app/'
  const dataArray = [
    // { id: 1, name: 'Prasad Gawade', status: 'Online', imageSrc: Prasad },
    { id: 2, name: 'John Doe', status: 'Online', imageSrc: 'https://picsum.photos/id/237/200/300' },
    { id: 3, name: 'Jane Smith', status: 'Offline', imageSrc: 'https://picsum.photos/id/238/200/300' },
    { id: 4, name: 'Bob Johnson', status: 'Online', imageSrc: 'https://picsum.photos/id/239/200/300' },
    { id: 5, name: 'Alice Williams', status: 'Away', imageSrc: 'https://picsum.photos/id/240/200/300' },
    { id: 6, name: 'Charlie Brown', status: 'Online', imageSrc: 'https://picsum.photos/id/241/200/300' },
    { id: 7, name: 'Charlie Brown', status: 'Online', imageSrc: 'https://picsum.photos/id/241/200/300' }
    
  ]

  const getMessageData = () => {
    const formData = new FormData()
    formData.append("page", 1)
    formData.append("size", 1000)
    formData.append("searchValue", '')
    formData.append("project_no", 919820016363)
    formData.append("selected_no", 917021470342)
    postReq('get_all_message', formData)
      .then((res) => {
        console.log(res)
        setMessageData(res.data.messages)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const getContactsData = () => {

  }
  useEffect(() => {
    getMessageData()
  }, [])


  const axios = require('axios')
  const initialSelectedDiv = 0
  const initialData = dataArray[initialSelectedDiv]

  const [selectedDiv, setSelectedDiv] = useState(initialSelectedDiv)
  const [text, setText] = useState(initialData.name)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [filterText, setFilterText] = useState('')
  const [dynamicColumnValue, setDynamicColumnValue] = useState(0)
  const [toggleMedia, setToggleMedia] = useState(false)
  const [storeMedia, setStoreMedia] = useState({})
  const [searchText, setSearchText] = useState("")
  const [search, setSearch] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState(false)
  const [mediaText, setMediaText] = useState("")
  const chatContainerRef = useRef(null)
  const [templateModal, setTemplateModal] = useState(false)
  const [replyModal, setReplyModal] = useState(false)
  const [selectedDescription, setSelectedDescription] = useState('')
  const [templatesDataList, setTemplatesDataList] = useState([])
  const [templateData, setTemplatesData] = useState('')

  const handleDivClick = (index) => {
    setSelectedDiv(index)
  }

  const currentMessageTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' || storeMedia.media) {
      const newMessages = [...messages]
      if (newMessage.trim() !== '') {
        newMessages.push({ text: newMessage, sender: 'user', timeStamp: currentMessageTime() })
        setNewMessage('')
      } else if (storeMedia?.media?.type.startsWith("image")) {
        console.log(storeMedia.media)
        newMessages.push({ image: storeMedia.media_display, sender: 'user', imgText: mediaText, timeStamp: currentMessageTime() })
        setStoreMedia({})

      } else if (storeMedia?.media?.type.startsWith("video")) {
        console.log(storeMedia.media)
        newMessages.push({ video: storeMedia.media_display, sender: 'user', videoText: mediaText, timeStamp: currentMessageTime() })
        setStoreMedia({})
      }
      setMessages(newMessages)
      console.log(newMessages)
    }
  }

  useLayoutEffect(() => {
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  //Enter Button
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage()
    }
  }
  const filteredData = dataArray.filter(data => data.name.toLowerCase().includes(filterText.toLowerCase()))

  const [selectedCategory, setSelectedCategory] = useState(null)
  const filteredTempData = selectedCategory ? templatesDataList.filter(item => item.category === selectedCategory.value) : templatesDataList
  const form_data = new FormData()

  const handleChange = (e) => {
    console.log(e.target.files[0])
    const name = e.target.name
    const file = e.target.files[0]
    if (file) {
      setMediaText("")
      setImagePreview(true)
      setStoreMedia(prevStoreMedia => ({
        ...prevStoreMedia,
        [`${name}_display`]: URL.createObjectURL(file),
        [name]: file
      }))
      form_data.append("type", "image")
      form_data.append("image", e.target.files[0])
      if (mediaText) {
        form_data.append("caption", mediaText)
      }
    }
  }
  const data = () => {

    messages.forEach(message => {
      console.log(form_data)
      if (message.text) {
        form_data.append("type", "text")
        form_data.append("messageBody", message.text)
        form_data.append("phone", '8169957318')
      }
      // else if (message.image) {
      //   form_data.append("type", "image")
      // form_data.append("link", message.image)
      // if (mediaText) {
      //   form_data.append("caption", mediaText)
      // }
      // }
    })

    axios.post(`${url}/send/`, form_data)
      .then(response => {
        console.log('Response:', response.data)
      })
      .catch(error => {
        console.error('Error:', error)
      })
    console.log(form_data)
  }

  useEffect(() => {
    data()
  }, [messages])

  const getCurrentTemplate = (templateId) => {
    const formData = new FormData()
    formData.append("templateId", templateId)
    postReq("getTemplateById", formData)
       .then(res => {
          console.log('Templates Response:', res.data)
          if (res.data.name) {
            setTemplatesData(res.data)
             // console.log(res.data.components[0].format)
          } else {
             toast.error("Template doest not exist!")
          }
       })
       .catch(error => {
          console.error('Error:', error)
       })
 }
 console.log("templateData", templateData)
 
  return (
    <>
      <style>{`

      .custom-button:focus,
      .custom-button:active,
      .custom-button:hover {
        outline: none; 
        border: none; 
      }
      
      .sidebar{
        height:80vh
      }
      .chat-messages{
            max-height: 500px;
            }

      @media only screen and (max-width: 930px) {
   
       }
      @media only screen and (max-width: 768px) {
          .chat-messages{
            max-height: 500px;
          }
      }
      @media only screen and (max-width: 480px) {
        .chat-messages{
            max-height: 500px;
          }
      }

      @media only screen and (min-width: 3840px) {
        .chat-messages{
            max-height: 500px;
            padding-bottom: 20px;
          }
      }

      .chat-container {
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;  
      }
      .chat-container::-webkit-scrollbar { 
          width: 0;
          height: 0;
      }
      .sidebar,
      .reply-container,
      .emoji-container {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
      }
      
      .sidebar::-webkit-scrollbar,
      .reply-container::-webkit-scrollbar,
      .emoji-container::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
      }
      .scale-up-bl {
        -webkit-animation: scale-up-bl 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
                animation: scale-up-bl 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
      }
    
  
    `}</style>


      <Container className='d-flex flex-column flex-grow-1 '>

        <Container className='d-flex flex-column flex-grow-1 ' style={{ width: "100vw" }}>
          <Row className='d-flex justify-content-center match-height' style={{ background: '#eff6ff', height: '90vh', marginTop: '-20px' }}>
            {/* Sidebar contacts*/}
            <Col sm='3' className='px-0' style={{ background: '#fff' }}>
              <div className='p-1 d-flex align-items-center  justify-content-between ' style={{ background: '#f0f2f5', height: '65pxs' }}>
                <div className='d-flex align-items-center'>
                  <BiSolidUserCircle style={{ height: "40px", width: "40px", color: "#dfe5e7" }} />
                </div>
                <div>
                  <FaEllipsisV />
                </div>
              </div>
              <div className='m-1' style={{ borderRadius: "5px" }}>
                <InputGroup >
                  <InputGroupText color='transparent' style={{ border: "0", background: "#f0f2f5" }}>
                    <IoMdSearch className=' fs-3  ' />
                  </InputGroupText>
                  <Input type='text' value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder='Search or start new chat ' style={{ border: "0", background: "#f0f2f5" }} />
                </InputGroup>
              </div>

              <div className='sidebar ' style={{ overflowY: 'auto ', overflowX: "hidden" }}>

                <Row className='flex-column'>
                  {filteredData.map((data, index) => (
                    <Col
                      key={index}
                      style={{ background: selectedDiv === index ? '#f0f2f5' : 'white' }}
                      onClick={() => {
                        handleDivClick(index)
                        setText(data.name)
                        // setSubText(data.status)      
                      }}
                    >
                      <div>
                        <div className="d-flex mx-1 justify-content-between align-items-center border-bottom " style={{ height: "65px" }}>
                          <div className="d-flex align-items-center cursor-pointer" >
                            <div className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: "#00a884" }}>
                              {/* <img className="w-100 h-100" src={data.imageSrc} alt="" /> */}
                              <p className='fs-3 fw-bolder text-white mb-0'>{data.name[0]}</p>
                            </div>
                            <p className='pt-1 fs-5' style={{ lineHeight: '1.2em', marginLeft: '15px', color: '#000000' }}>
                              {data.name}<br />
                              {/* <span style={{ color: '#6b7b85', fontSize: "13px" }}>{data.status}</span> */}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>

                  ))}
                </Row>
              </div>
            </Col>

            {/* Main Chat Container */}

            <Col className=' px-0 d-flex flex-column justify-content-between  ' style={{ backgroundImage: `url(${back})`, height: '100%' }}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center" style={{ background: '#f0f2f5' }}  >
                <div className="d-flex align-items-center ps-1 cursor-pointer w-100 " style={{ background: '#f0f2f5', height: "65px" }} onClick={() => setDynamicColumnValue(3)}>
                  <div className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: "#00a884" }}>
                    <p className='fs-3 fw-bolder text-white mb-0'>{text[0]}</p>
                  </div>
                  <h4 className='pt-1' style={{ fontWeight: '500', lineHeight: '1.2em', marginLeft: '15px' }}>
                    {text}<br />
                    {/* <span className='fs-6'>{subtext}</span> */}
                  </h4>
                </div>
                <div className="d-flex align-items-center  gap-2">
                  <FaSearch onClick={() => {
                    setSearch(true)
                    setDynamicColumnValue(3)
                  }} />

                  <div className='position-relative' >
                    <Button onClick={() => setDropdownOpen(!dropdownOpen)} color='' className='bg-transparent '>
                      <FaEllipsisV />
                    </Button>
                    <div className={`${dropdownOpen ? "" : "d-none"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setDropdownOpen(false)
                      }}
                      style={{ width: '100vw', height: '100vh', position: 'fixed', top: '0', right: '0' }}></div>
                    {dropdownOpen && <div className='position-absolute p-1' style={{ minWidth: "150px", background: "white", right: "10px", top: "60px", borderRadius: "10px", textAlign: "center", cursor: "pointer", zIndex: '10' }}>
                      <Row className='d-flex flex-column gap-1' >
                        <Col >
                          <p className='mb-0' onClick={() => {
                            setDynamicColumnValue(3)
                            setDropdownOpen(false)
                          }}>Contact Info</p>
                        </Col>
                      </Row>
                    </div>}
                  </div>
                </div>
              </div>
              {/* Chat Container */}
              {/* Chat content */}

              <div className='chat-container d-flex flex-column  position-relative' style={{ overflowY: "auto", height: '100%' }} ref={chatContainerRef}>

                {!imagePreview ? <div
                  style={{
                    // display: 'flex',
                    // flex: "1",
                    // justifyContent: 'flex-start',
                    // alignSelf: 'flex-end',
                    // alignItems: 'flex-end',
                    // flexDirection: 'column',
                    minWidth: '100%',
                    minHeight: "100%"
                    // maxWidth: '800px'
                  }}
                  className={` d-flex flex-column  `}
                >
                  {useMessageData.map((d, index) => {
                    console.log("SIMGLE", d)
                    const data = d.fields
                    console.log(data.content)
                    // const justifyContent = messageBy === 'receiver' ? 'flex-start' : 'flex-end'
                    const backgroundColor = usePojectContact === data.sender ? '#d4f2c2' : '#F2F3F4'
                    return (
                      <div key={index} className={`message`} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '10px',
                        padding: '5px',
                        borderRadius: '8px',
                        backgroundColor,
                        // justifyContent: 'center',
                        alignSelf: ` ${usePojectContact === data.sender ? 'end' : 'start'}`,
                        maxWidth: "fit-content"
                      }}>
                        {/* msg type */}
                        {data.templateId && (
                          <div className='d-flex flex-column  justify-content-end' style={{ maxWidth: "500px" }}>
                            <div className="message-content" style={{ alignSelf: 'flex-end', wordBreak: "break-word" }}>Template Data</div>
                          </div>
                        )}
                        {data.content && (
                          <div className='d-flex flex-column  justify-content-end' style={{ maxWidth: "500px" }}>
                            <div className="message-content" style={{ alignSelf: 'flex-end', wordBreak: "break-word" }}>{data.content}</div>
                            <div className="message-info" style={{ textAlign: 'right', fontSize: '10px', color: '#707B7C' }}>{data.timestamp_sent}</div>
                          </div>
                        )}

                        {data.image && (
                          <div style={{ width: "371px" }}>
                            <img src={data.image} style={{ height: "250px", width: '100%' }} />
                            {data.imgText && (
                              <div className='d-flex justify-content-between align-items-center w-100' style={{ marginTop: "5px" }}>
                                <p className='mb-0 text-break w-80'>{data.imgText}</p>
                                <div className="message-info align-items-end w-20" style={{ textAlign: 'right', color: '#707B7C', wordBreak: "normal" }}>{data.timeStamp}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {data.video && (
                          <div style={{ width: "300px" }}>
                            <video controls width="300">
                              <source src={data.video} />
                            </video>
                            {data.videoText && (
                              <div className='d-flex justify-content-between align-items-center' style={{ marginTop: "5px" }}>
                                <p className='mb-0 text-break'>{data.videoText}</p>
                                <div className="message-info align-items-end" style={{ textAlign: 'right', color: '#707B7C' }}>{data.timeStamp}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                </div> : <div className='p-2 d-flex flex-column justify-content-between  ' style={{ height: "100%", background: '#e9edef' }}>
                  <div className=''>
                    <RxCross2 className='fs-3 '
                      onClick={() => {
                        setImagePreview(false)
                        setStoreMedia({})
                      }}

                    />
                  </div>
                  <div className='d-flex align-items-center  justify-content-center '>

                    {/* {console.log(storeMedia.media.type.startsWith('video/') ? 'video' : 'photo')}' */}
                    {storeMedia.media.type.startsWith('video/') ? <video controls width="250">
                      <source src={storeMedia.media_display} type={storeMedia.media.type} />
                    </video> : <img src={storeMedia.media_display} style={{ height: '150px' }} loading='lazy' />}
                  </div>
                  <div >
                    <div className='text-center'>
                      <input type='text' className='border-0 p-1 w-50' placeholder='type a message' style={{ backgroundColor: '#ffffff', borderRadius: "5px" }} value={mediaText} onChange={(e) => setMediaText(e.target.value)} />
                    </div>
                    <div className='float-end '>
                      <div className='d-flex align-items-center  justify-content-center ' style={{ width: "50px", height: "50px", background: '#00a884', borderRadius: "50%", cursor: "pointer" }} onClick={() => {
                        setImagePreview(false)
                        handleSendMessage()
                      }}
                        onKeyDown={handleKeyPress}
                      >
                        <IoMdSend className='fs-3' style={{ color: 'white' }} />
                      </div>
                    </div>
                  </div>

                </div>

                }
                {/* input field */}
                {!imagePreview && <div className=' d-flex align-items-center gap-1 px-1 position-sticky bottom-0 bg-white' style={{ padding: "10px" }}  >

                  <div className='btn' onClick={() => setToggleMedia(!toggleMedia)}>
                    <Plus style={{
                      transform: `rotate(${toggleMedia ? "45deg" : "0deg"})`,
                      transition: "transform 0.2s ease-in-out"
                    }} />
                  </div>
                  <div className={`${toggleMedia ? '' : 'd-none'}`} onClick={(e) => {
                    e.stopPropagation()
                    setToggleMedia(false)
                  }} style={{ width: '100vw', height: '100vh', position: 'fixed', top: '0', right: '0' }}>
                  </div>
                  {/* menu */}
                  {toggleMedia && <div className='bg-white position-absolute p-1 ' style={{ bottom: '60px', left: "20px", width: "200px", borderRadius: "10px" }} >
                    <Row className='d-flex flex-column gap-1'>
                      <Col>

                        <label onClick={e => e.stopPropagation()} htmlFor="uploadDocButton" className="d-flex gap-1 cursor-pointer">
                          <File size={17} style={{ color: '#7f66ff' }} />  Documents
                          <input
                            type="file"
                            id='uploadDocButton'
                            className="d-none"

                          />
                        </label>
                      </Col>
                      <Col >
                        <label onClick={e => {
                          e.stopPropagation()
                        }} htmlFor="uploadImageButton" className="d-flex gap-1">
                          <Image size={17} style={{ color: '#007bfc' }} />Photos
                          <input
                            name='media'
                            onChange={handleChange}
                            type="file"
                            id='uploadImageButton'
                            className="d-none" />
                        </label>
                      </Col>
                      <Col >
                        <label onClick={e => {
                          e.stopPropagation()
                        }} htmlFor="uploadImageButton" className="d-flex gap-1">
                          <Video size={17} style={{ color: '#007bfc' }} />Videos
                          <input
                            name='media'
                            onChange={handleChange}
                            type="file"
                            id='uploadImageButton'
                            className="d-none" />
                        </label>
                      </Col>

                    </Row>
                  </div>}

                  <div className='btn' onClick={() => setTemplateModal(true)}>
                    <HiOutlineTemplate size={20} />
                  </div>
                  <div className='btn' onClick={() => setReplyModal(true)}>
                    <BsReply size={20} />
                  </div>

                  <textarea
                    type="text"
                    className="form-control  border rounded "
                    placeholder="Type your message..."
                    id='message_input'
                    autoComplete='off'
                    value={newMessage}
                    rows={1}
                    // onClick={inputMessageCursorChange}
                    onChange={(e) => {
                      // inputMessageCursorChange()
                      setNewMessage(e.target.value)
                    }}
                    // onKeyPress={handleKeyPress}
                    style={{ borderRadius: "50px" }}
                  />
                  <div className='btn btn-primary send-btn d-flex justify-content-center gap-1 align-items-center ' onClick={handleSendMessage}>
                    <p className='m-0'>Send</p> <Send id="send-icon" size={16} />
                  </div>

                </div>}
              </div>
              {/*bottom*/}

            </Col>

            {/* profile details */}
            {dynamicColumnValue === 3 &&
              (search ? (
                <Col md={dynamicColumnValue} style={{ background: '#fff' }} >
                  <div className='d-flex align-items-center gap-1 fs-4' style={{ height: "65px", fontWeight: "bold" }} >
                    <RxCross2
                      onClick={() => {
                        setSearch(false)
                        setDynamicColumnValue(0)
                      }}
                      className='ms-1'
                    />
                    <p className='mb-0'>Search Messages</p>
                  </div>
                  <div className='m-1 border border-secondary-subtle' style={{ borderRadius: "5px" }}>
                    <div>
                    </div>
                    <InputGroup style={{ borderRadius: "10px" }}>
                      <InputGroupText color='transparent' style={{ border: "0" }}>
                        <IoMdSearch className=' fs-3  ' />
                      </InputGroupText>
                      <Input type='text' value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ border: "0", color: '#8b98a0' }} placeholder='Search...' />
                    </InputGroup>

                  </div>
                </Col>

              ) : (
                <Col md={dynamicColumnValue} style={{ background: '#f0f2f5' }} >
                  <div className='d-flex align-items-center gap-1 fs-4 ' style={{ background: '#f0f2f5', height: "65px" }}>
                    <RxCross2 onClick={() => setDynamicColumnValue(0)} className='ms-1' />
                    <p className='mb-0'>Contact info</p>
                  </div>
                  <div style={{ background: "#ffffff", boxShadow: '0px 15px 11px -16px rgba(0,0,0,0.1)' }}>
                    <div className='d-flex flex-column align-items-center p-1'>
                      <div className='d-flex align-items-center  justify-content-center ' style={{ width: "200px", height: "200px", borderRadius: "50%", background: "#00a884" }}>
                        <p className='text-white fw-bolder mb-0' style={{ fontSize: "5rem" }}>{text[0]}</p>
                      </div>
                      <div className='pt-1'>
                        <h4 style={{ fontSize: "24px" }}>{text}</h4>
                      </div>
                    </div>
                  </div>
                  <div className='mt-1 p-1' style={{ background: "#ffffff", boxShadow: '0px 15px 11px -16px rgba(0,0,0,0.1)' }}>
                    <p className='fs-5'>About</p>
                    <p style={{ color: 'black' }}>Busy</p>
                  </div>
                </Col>))
            }

            {/* modals ------------------------------------------------------------------------------------------------------- */}
            {/* quick reply modal */}
            <Modal
              show={replyModal}
              onHide={() => setReplyModal(false)}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header className='mt-1'>
                <Modal.Title id="contained-modal-title-vcenter">
                  Quick Replies
                </Modal.Title>
              </Modal.Header>
              <Modal.Body >
                <Row >
                  <hr />
                  <Col xs={5}>
                    <Input type='text' placeholder='search' className='mb-1' />
                    <div className='reply-container' style={{ maxHeight: "300px", overflow: "auto" }}>
                      {QuickReplayList.map((item, index) => {
                        return <div key={index} style={{ cursor: "pointer" }}
                          onClick={() => setSelectedDescription(item)}>
                          <div className='p-1 fw-bolder '>
                            {item.title}
                          </div>
                        </div>
                      })}
                    </div>
                  </Col>
                  <Col xs={7}>

                    {selectedDescription ? <div className='ms-1'>
                      <div className="fw-bolder">{selectedDescription.title}</div>
                      <div className='mt-2'>{selectedDescription.description}</div>
                    </div> : <div className='d-flex align-items-center  justify-content-center h-100'>
                      <span className='fw-bolder text-uppercase ' style={{ fontSize: "1.2rem" }}>Please select a reply</span>
                    </div>}
                  </Col>
                  <hr />
                </Row>
              </Modal.Body>
              <Modal.Footer>

                <Button className='btn btn-primary ' onClick={() => setReplyModal(false)}>Cancel</Button>
                {selectedDescription.description && <Button
                  className='btn btn-primary '
                  style={{ width: "auto" }}
                  onClick={() => {
                    setNewMessage(selectedDescription.description)
                    setReplyModal(false)
                  }}>Copy to Editor</Button>}

                {selectedDescription.description && <Button
                  className='btn btn-primary'
                  onClick={() => {
                    setMessages(prevMessages => [
                      ...prevMessages,
                      { text: selectedDescription.description, sender: 'user', timeStamp: currentMessageTime() }
                    ])
                    handleSendMessage()
                    setReplyModal(false)
                  }}>Send</Button>}

              </Modal.Footer>
            </Modal>

            {/* templates map */}
            <Modal
              show={templateModal}
              onHide={() => setTemplateModal(false)}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header >
                <Modal.Title id="contained-modal-title-vcenter" className='mt-1 fw-bolder'>
                  TEMPLATES
                </Modal.Title>
              </Modal.Header>
              <Modal.Body >
                <Row >
                  <Col xs={6}>
                    <h5>Categories</h5>
                    <Select
                      className='react-select'
                      classNamePrefix='select'
                      options={templateCatgList}
                      isClearable={false}
                      onChange={(selectedCat) => setSelectedCategory(selectedCat)}
                    />

                  </Col>
                  <Col xs={6}>
                    <h5>Search Template</h5>
                    <Input type='text' placeholder='Enter a template name' />
                  </Col>


                </Row>

                <Card className='border-0' >
                  <CardBody>

                    <Row className='match-height'>
                      {
                        filteredTempData.map((SingleTemplate) => {
                          return (
                            <Col md="6 mt-3" >
                              <h5>  {SingleTemplate.name}</h5>
                              <Card className="border-0 p-2 position-relative  shadow-lg" style={{ background: "#c2c2c2", backgroundImage: `url(${wp_back})`, gap: "5px", maxWidth: "500px" }} >

                                <div className="border-1 rounded-3 mb-0 whatsapp_template_card" style={{ minHeight: "200px", background: "white" }}>
                                  <div className='p-0' >
                                    {

                                      SingleTemplate.components.map((data, index) => {
                                        if (data.format === "IMAGE") {
                                          return (
                                            <div className='p-1'  >
                                              <img className=' img-fluid border-0 rounded w-100 object-fit-cover ' src={data.example.header_handle[0] ?? ""} alt="" />
                                            </div>
                                          )
                                        }
                                        if (data.type === "BODY") {
                                          return (
                                            <div className='p-1 pe-2' >
                                              <p className='fs-6'>{getBoldStr(data.text)} </p>
                                            </div>
                                          )
                                        }
                                        if (data.type === "FOOTER") {
                                          return (
                                            <div className='pt-1 ps-1 pe-2' >
                                              <p className='text-secondary font-small-3'>{data.text} </p>
                                            </div>
                                          )
                                        }
                                        if (data.type === "BUTTONS") {
                                          return data.buttons.map((data, index) => {
                                            if (data.type === "URL") {
                                              return (
                                                <div className="border-top  d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                                  <ExternalLink size={17} /><h6 className='m-0 text-primary' >{data.text}</h6>
                                                </div>
                                              )
                                            }
                                          })
                                        }


                                      })

                                    }

                                  </div>
                                </div>

                                {

                                  SingleTemplate.components.map((data, index) => {
                                    if (data.type === "BUTTONS") {
                                      return data.buttons.map((data, index) => {

                                        if (data.type === "QUICK_REPLY") {
                                          return (
                                            <div className="border rounded-3 bg-white  d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                              <Phone size={17} /><h6 className='m-0 text-primary' > {data.text}</h6>
                                            </div>
                                          )
                                        }
                                      })
                                    }


                                  })

                                }
                                {/* <div className="border rounded-2  d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                                                <Phone size={17} /><h5 className='m-0 text-primary' > Relax, it was me</h5>
                                                            </div>
                                                            <div className="border rounded-2  d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                                                <ExternalLink size={17} /><h5 className='m-0 text-primary' > Relax, it was me</h5>
                                                            </div> */}

                              </Card>
                              <div className='d-flex gap-2 flex-wrap '>
                                <Button disabled className='' type='button'
                                  color=''
                                  style={{
                                    color: "white",
                                    borderRadius: "3px",
                                    backgroundColor:
                                      SingleTemplate.status === "APPROVED" ? "green" : SingleTemplate.status === "REJECTED" ? "red" : SingleTemplate.status === "PENDING" ? "yellow" : "white"
                                  }}>{SingleTemplate.status}</Button>
                                <Button type='button'>edit</Button>
                                <Button type='button'>send</Button>
                              </div>
                            </Col>
                          )

                        })
                      }
                    </Row>
                  </CardBody>
                </Card>

              </Modal.Body>
              <Modal.Footer>
                <Button className='btn btn-primary ' onClick={() => setTemplateModal(false)}>Close</Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </Container >
      </Container >
    </>

  )
}
export default LiveChat
