/* eslint-disable no-unused-vars */
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { ChevronLeft, ChevronRight, File, FileText, Headphones, Image, Plus, Send, Sliders, Users, Video } from 'react-feather'
import { BsReply } from 'react-icons/bs'
import { FaEllipsisV, FaSearch, FaSortAmountDown } from "react-icons/fa"
import { HiOutlineTemplate } from "react-icons/hi"
import { IoMdSearch, IoMdSend } from "react-icons/io"
import { LiaCheckDoubleSolid, LiaCheckSolid } from "react-icons/lia"
import { MdOutlineLibraryAdd, MdErrorOutline } from "react-icons/md"
import { RxCross2 } from "react-icons/rx"
import Select from 'react-select'
import { LuEye } from "react-icons/lu"
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Container,
  Input, InputGroup, InputGroupText
} from 'reactstrap'
import { SocketBaseURL, postReq } from '../../../assets/auth/jwtService'
import XIRCLS_LOGO from '../../../assets/images/logo/XIRCLS_LOGO.png'
import { QuickReplayList, RenderLiveTemplateUI, templateCatgList } from '../SmallFunction'
import back from '../imgs/WhatsAppBack.png'
import FrontBaseLoader from '../../Components/Loader/Loader'
const LiveChat = () => {

  const [useIsLoading, setIsLoading] = useState(true)
  const [useMessageData, setMessageData] = useState([])
  const [useMessageCounter, setMessageCounter] = useState(0)
  const [useProfileDetails, setProfileDetails] = useState("")
  const [useSortBy, setSortBy] = useState("")

  // console.log("useProfileDetails", useProfileDetails)

  const [selectedDiv, setSelectedDiv] = useState(0)
  const [useInputMessage, setInputMessage] = useState('')
  const [users, setUsers] = useState([])
  const [useUsersData, setUsersData] = useState([])
  const [useContactPage, setContactPage] = useState(1)
  const [useContactCounter, setContactCounter] = useState(1)
  const [filterText, setFilterText] = useState('')
  const [useProjectNo, setProjectNo] = useState('')
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
  const [useSortShow, setSortShow] = useState(false)
  const [filterDropdown, setFilterDropdown] = useState(false)
  const [useActiveTab, setActiveTab] = useState(0)

  const [currentTab, setCurrentTab] = useState({})
  const [allSourceChecked, setAllSourceChecked] = useState(false)
  const [ws, setWs] = useState('')
  const [useContactWs, setContactWs] = useState('')
  const [checkboxes, setCheckboxes] = useState({
    Website: false,
    ChatbotApp: false,
    Chatbot: false,
    WhatsappService: false,
    Instagram: false,
    Facebook: false
  })
  const ActiveTabList = [
    {
      title: "All Chats",
      id: "",
      isActive: false
    },
    {
      title: "Live Chats",
      id: "live",
      isActive: false
    },
    {
      title: "unread Chats",
      id: "unread",
      isActive: false
    },
    {
      title: "History",
      id: "history",
      isActive: false
    }
  ]
  // Function to handle changes in the "All Source" checkbox
  const handleAllSourceChange = (event) => {
    const isChecked = event.target.checked
    setAllSourceChecked(isChecked)
    const updatedCheckboxes = { ...checkboxes }
    for (const key in updatedCheckboxes) {
      updatedCheckboxes[key] = isChecked
    }
    setCheckboxes(updatedCheckboxes)
  }

  // Function to handle changes in other checkboxes
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target
    setCheckboxes({ ...checkboxes, [id]: checked })
    if (!checked) {
      setAllSourceChecked(false)
    } else {
      const allChecked = Object.values(checkboxes).every((checkbox) => checkbox)
      setAllSourceChecked(allChecked)
    }
  }


  const [open, setOpen] = useState('1')
  const toggle = (id) => {
    if (open === id) {
      setOpen()
    } else {
      setOpen(id)
    }
  }

  const sendMessages = (type) => {
    const form_data = new FormData()
    form_data.append("reciever", currentTab.messages_reciever)
    if (type === "text") {
      form_data.append("message_body", useInputMessage)
      form_data.append("type", "text")
    } else if (type === "files" && storeMedia?.media?.type === "image/jpeg") {
      form_data.append("file", storeMedia.media)
      form_data.append("type", "image")
      form_data.append("caption", mediaText)
    } else if (type === "files" && storeMedia?.media?.type === "video/mp4") {
      form_data.append("file", storeMedia.media)
      form_data.append("type", "video")
      form_data.append("caption", mediaText)
    } else if (type === "files" && storeMedia?.media?.type === "application/pdf") {
      form_data.append("file", storeMedia.media)
      form_data.append("filename", storeMedia?.media?.name)
      form_data.append("type", "document")
      form_data.append("caption", mediaText)
    }
    console.log("storeMedia", storeMedia)
    setStoreMedia({})
    // return console.log("send is commented")
    postReq("send_live_chat", form_data)
      .then((resp) => {
        // console.log("msg sent", resp)
        // eslint-disable-next-line no-use-before-define
        // getAllMessages()
        setInputMessage('')

      }).catch((err) => { console.log(err) })
  }

  const webSocketConnection = (index) => {
    try {
      // Close existing WebSocket connection if there's any
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close()
        console.info('Previous WebSocket connection closed')
      }

      // Create new WebSocket connection
      const newWs = new WebSocket(`${SocketBaseURL}/ws/chat/?unique_id=${users?.[index]?.messages_unique_id}`)
      setWs(newWs)

      newWs.onopen = () => {
        console.info('WebSocket connected')
      }

      newWs.onmessage = (event) => {
        console.log("New message:", event.data)
        setMessageData(prevMessageData => [JSON.parse(event.data), ...prevMessageData])
        setMessageCounter(prevCounter => prevCounter + 1)
        // eslint-disable-next-line no-use-before-define
        scrollToBottom()
      }

      newWs.onclose = () => {
        console.info('WebSocket disconnected')
      }

    } catch (error) {
      console.error('Error establishing WebSocket connection:', error)
    }
  }

  const webSocketConnectionContacts = (projectNo) => {

    try {
      // Close existing WebSocket connection if there's any
      if (useContactWs && useContactWs.readyState === WebSocket.OPEN) {
        useContactWs.close()
        console.info('Previous WebSocket connection closed CONTACT', projectNo)
      }

      // Create new WebSocket connection
      const contWS = new WebSocket(`${SocketBaseURL}/ws/relation/?unique_id=${projectNo}`)
      setContactWs(contWS)

      contWS.onopen = () => {
        console.info('WebSocket connected CONTACT')
      }

      contWS.onmessage = (event) => {
        console.log("Received message from CONTACT SOCKET:", JSON.parse(event.data))
        // Process the received message here
        // eslint-disable-next-line no-use-before-define
        uptContactWebsocket(event?.data)

        // getAllContacts()
      }

      contWS.onclose = () => {
        console.info('WebSocket disconnected CONTACT')
      }
    } catch (error) {
      console.error('Error establishing WebSocket connection: CONTACT', error)
    }
  }


  const getAllMessages = () => {
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 1000)
    form_data.append("selected_no", currentTab.messages_reciever)
    postReq("get_all_message", form_data)
      .then((resp) => {

        setMessageData(resp?.data?.messages)
      }).catch((err) => { console.log(err) })
  }

  const handleDivClick = (index) => {
    setSelectedDiv(index)
  }

  // get all contacts
  const getAllContacts = () => {
    console.log("contacts load =============")
    const form_data = new FormData()
    form_data.append("page", useContactPage)
    form_data.append("size", 10)
    form_data.append("searchValue", filterText)
    form_data.append("type", useSortBy)
    setIsLoading(true)
    postReq("contact_relation", form_data)
      .then((res) => {
        // setUsers(res.data?.messages)
        console.log("213", users)
        console.log("214", res.data?.messages)
        // setUsers(res.data?.messages)
        setUsers(prev => [...prev, ...res.data?.messages])
        // setContactCounter(prev => prev + 1)
        webSocketConnectionContacts(res?.data?.project_no)
      }).catch((err) => {
        // console.log(err)
      }).finally(() => setIsLoading(false))
  }
  const filterAllContacts = (sortby) => {
    console.log("contacts sortby =============", sortby)
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 10)
    form_data.append("searchValue", filterText)
    form_data.append("type", sortby)
    setIsLoading(true)
    postReq("contact_relation", form_data)
      .then((res) => {
        setUsers(res.data?.messages)

      }).catch((err) => {
        // console.log(err)
      }).finally(() => setIsLoading(false))
  }


  // useeffects
  // useEffect(() => {
  //   getAllContacts()
  // }, [useContactPage])

  useEffect(() => {
    // console.log("================== run contacts main useeffect")

    getAllContacts()
  }, [useContactPage])

  // useEffect(() => {
  //   console.log("================== run contacts textfilter && useSortBy")
  //   const form_data = new FormData()
  //   form_data.append("page", useContactPage)
  //   form_data.append("size", 10)
  //   form_data.append("searchValue", filterText)
  //   form_data.append("type", useSortBy)
  //   postReq("contact_relation", form_data)
  //     .then((res) => {
  //       // setUsers(res.data?.messages)
  //       console.log("213", users)
  //       console.log("214", res.data?.messages)
  //       setUsers(res.data?.messages)
  //       // setUsers(prev => [...prev, ...res.data?.messages])
  //       setContactCounter(prev => prev + 1)

  //       // setProjectNo(res.data?.project_no)

  //     }).catch((err) => {
  //       // console.log(err)
  //     })
  // }, [filterText, useSortBy])

  useEffect(() => { // when select number
    getAllMessages()
    // eslint-disable-next-line no-use-before-define
    scrollToBottom()
  }, [currentTab])

  const [selectedCategory, setSelectedCategory] = useState(null)
  const form_data = new FormData()

  const handleChange = (e) => {
    // console.log(e.target.files[0])
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
      console.log(file)
      form_data.append("type", "image")
      form_data.append("image", e.target.files[0])
      if (mediaText) {
        form_data.append("caption", mediaText)
      }
    }
  }
  const containerRef = useRef(null)

  const scrollLeft = (type) => {
    // console.log("left press")
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth
      if (type === "left") {
        containerRef.current.scrollLeft -= scrollAmount
      } else {
        containerRef.current.scrollLeft += scrollAmount
      }
    }
  }
  const scrollToBottom = () => {
    console.log("scroll hit")
    const chatContScroll = document.getElementById("chatContScroll")
    chatContScroll.scrollTop = chatContScroll.scrollHeight
  }
  const uptContactWebsocket = (newData) => {
    // console.log("191 old", users)
    // console.log("191 user", newData)
    // console.log("344", JSON.parse(newData).data)
    const uptData = {
      ...JSON.parse(JSON.parse(newData).data),
      messages_reciever: JSON.parse(JSON.parse(newData).data).messages_receiver
    }
    console.log("uptData", uptData)

    setUsers(prevList => [
      uptData,
      ...prevList.filter(elm => elm?.messages_reciever !== uptData?.messages_reciever)
    ])
    // getAllContacts()
    // setUsers()

  }
  console.log("350 ======", users)
  return (
    <>
      <style>{`

        .custom-button:focus,
        .custom-button:active,
        .custom-button:hover {
        outline: none; 
        border: none; 
        }
        .pulse-animation{
        animation: mymove 1s infinite;
        }
        @keyframes mymove {
        0% {opacity: 1;}
        50% {opacity: .1;}
        100% {opacity: 1;}
        }
        .sidebar{
        //  height:80vh
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
        
        .reply-container,
        .emoji-container {
        //  -ms-overflow-style: none; /* Internet Explorer 10+ */
        //  scrollbar-width: none; /* Firefox */
        }
        
        
        .scale-up-bl {
        -webkit-animation: scale-up-bl 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        animation: scale-up-bl 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        }
 `}</style>
      {
        useIsLoading && <FrontBaseLoader />
      }

      <Container className='d-flex flex-column flex-grow-1 '>

        <Container className='d-flex flex-column flex-grow-1 ' style={{ width: "100vw" }}>
          <Row className='d-flex justify-content-center match-height' style={{ background: '#eff6ff', height: '90vh', marginTop: '-20px' }}>
            {/* Sidebar contacts*/}
            <Col sm='3' className='px-0' style={{ background: '#fff' }}>
              <div className='p-1 d-flex align-items-center justify-content-between ' style={{ background: '#f0f2f5', height: '65pxs' }}>
                <div className='d-flex gap-1 cursor-pointer position-relative ' >
                  <div className='d-flex align-items-center'>
                    <img src={XIRCLS_LOGO} alt="" className='rounded-5' width={40} />
                    {/* <BiSolidUserCircle style={{ height: "40px", width: "40px", color: "#dfe5e7" }} /> */}
                  </div>
                </div>

                <div className='d-flex gap-1'>
                  <MdOutlineLibraryAdd size={20} />
                  <Sliders size={20} onClick={() => setFilterDropdown(!filterDropdown)} cursor="pointer" />
                  {
                    filterDropdown === true ? <div className='border p-1 rounded-2 my-5 position-absolute mt-4 ' style={{ minWidth: "200px", background: '#fff', zIndex: "999", marginRight: "100px" }}>
                      <Accordion open={open} toggle={toggle}>
                        <AccordionItem>
                          <AccordionHeader targetId="1">Source</AccordionHeader>
                          <AccordionBody accordionId="1">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="AllSource"
                                checked={allSourceChecked}
                                onChange={handleAllSourceChange}
                              />
                              <label className="form-check-label" htmlFor="AllSource">
                                All Source
                              </label>
                            </div>
                            <hr />
                            {Object.entries(checkboxes).map(([key, checked]) => (
                              <div className="form-check" key={key}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={key}
                                  checked={checked}
                                  onChange={handleCheckboxChange}
                                />
                                <label className="form-check-label" htmlFor={key}>
                                  {key}
                                </label>
                              </div>
                            ))}

                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId="2">Status</AccordionHeader>
                          <AccordionBody accordionId="2">
                            sssssssss
                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId="3">Type</AccordionHeader>
                          <AccordionBody accordionId="3">
                            sssssssss
                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId="4">Group</AccordionHeader>
                          <AccordionBody accordionId="4">
                            sssssssss
                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId="5">Priority</AccordionHeader>
                          <AccordionBody accordionId="5">
                            sssssssss
                          </AccordionBody>
                        </AccordionItem>
                      </Accordion>
                    </div> : ""
                  }
                </div>
              </div>
              <div className='m-1 d-flex justify-content-center align-items-center ' style={{ borderRadius: "5px" }}>
                <InputGroup >
                  <InputGroupText className='opacity-0' color='transparent' style={{ border: "0", background: "#f0f2f5" }}>
                    <IoMdSearch className=' fs-3 ' />
                  </InputGroupText>
                  <div>
                    <h5 className='mt-1 mb-0'>Live Chats</h5>
                    {/* <p>{206}</p> */}
                  </div>
                  <Input className='opacity-0' type='text' value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder='Search... ' style={{ border: "0", background: "#f0f2f5" }} />

                  <div className='px-1 d-flex justify-content-center position-relative align-items-center '>
                    <button className='btn p-0' onClick={() => setSortShow(!useSortShow)} >
                      <FaSortAmountDown size={20} />
                    </button>
                    {
                      useSortShow === true ? <div className='border p-1 rounded-2 my-5 top-0 end-0 position-absolute mt-4 ' style={{ minWidth: "200px", background: '#fff', zIndex: "999", marginRight: "-160px" }}>

                        <div className='' style={{ padding: "5px 10px" }}>Sort by :</div>
                        <hr className="m-0" />
                        <div>
                          {/* <div className='mt-1'>List by</div> */}
                          {ActiveTabList.map((data, index) => (
                            <div class="form-check mt-1">
                              <input className="form-check-input" type="radio" name="flexRadioDefault" id={`sort_${data.id}`} checked={useSortBy === data.id} onClick={() => { filterAllContacts(data.id); setSortBy(data.id); setSortShow(false) }} />
                              <label className="form-check-label " for={`sort_${data.id}`} >
                                {data.title}
                              </label>
                            </div>
                          ))}


                        </div>
                        {/* <div>
                          <div className='mt-1'>Recency</div>
                          <div class="form-check mt-1">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                            <label className="form-check-label " for="flexRadioDefault1">
                              Newest First
                            </label>
                          </div>
                          <div className="form-check mt-1">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                            <label className="form-check-label" for="flexRadioDefault2">
                              Oldest First
                            </label>
                          </div>
                        </div> */}
                        {/* <div>
                          <div className='mt-1'>Priority</div>
                          <div class="form-check mt-1">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                            <label className="form-check-label " for="flexRadioDefault3">
                              Urgent First
                            </label>
                          </div>
                          <div className="form-check mt-1">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4" />
                            <label className="form-check-label" for="flexRadioDefault4">
                              Low First
                            </label>
                          </div>
                        </div> */}
                        <hr />
                        {/* <div className='border p-1  py-0 text-center rounded-4' onClick={getAllContacts}>Search</div> */}
                      </div> : ""
                    }

                  </div>
                </InputGroup>
              </div>
              {/* scrioller */}
              <div className='d-none p-1'>
                <div className='d-flex justify-content-center align-items-center cursor-pointer' onClick={() => scrollLeft("left")}>
                  <ChevronLeft />
                </div>
                <div className='d-flex overflow-x-scroll hideScroll gap-1' style={{ width: "fit-content", scrollBehavior: "smooth" }} ref={containerRef}>
                  {ActiveTabList.map((data, index) => (
                    <div className='cursor-pointer' style={{ padding: "10px 5px 5px 5px", width: "125px" }} key={data} onClick={() => { setActiveTab(index); filterAllContacts(data.id) }}>
                      <div className='d-flex justify-content-start align-items-center gap-1'>
                        <h6 className='m-0'>{data.title}</h6>
                        {/* <div className='border-success rounded-5 d-flex justify-content-center align-items-center' style={{ width: "17px", height: "17px", background: "rgb(40 199 111 / 20%)" }}>
                          <p className='text-success m-0 font-small-3 '>3</p>
                        </div> */}
                      </div>
                      {
                        useActiveTab === (index) && <hr className='w-75 m-0' style={{ background: "#000", height: "2px" }} />
                      }


                    </div>
                  ))}
                </div>
                <div className='d-flex justify-content-center align-items-center cursor-pointer' onClick={() => scrollLeft("right")}>
                  <ChevronRight />
                </div>
              </div>

              {/*contacts list */}
              <div className='hideScroll border ' style={{ maxHeight: "calc(100vh - 350px)", overflow: "scroll" }}>

                <div className='flex-column'>
                  {users.map((ContactData, index) => {

                    let lastMsgData = {}
                    // console.log("601 =========", ContactData)
                    console.log("601 =========", ContactData?.messages_reciever)
                    try {
                      lastMsgData = JSON.parse(ContactData?.messages_last_message)
                    } catch (error) {
                      console.log(error)
                    }

                    return (
                      <div
                        key={ContactData.messages_reciever}
                        style={{ background: ContactData.messages_reciever === currentTab.messages_reciever ? '#f0f2f5' : '#ffff' }}
                        onClick={() => {
                          handleDivClick(index)
                          setCurrentTab(ContactData)
                          webSocketConnection(index)
                          setProfileDetails(ContactData)
                        }}
                      >
                        <div>
                          <div className="mx-1 border-bottom cursor-pointer" style={{ minHeight: "75px", padding: "15px 10px" }} >
                            <Row className=" h-100" >
                              <Col md="2" className=' d-flex align-items-center justify-content-center flex-column '>
                                <div className="rounded-circle d-flex align-items-center justify-content-center text-success" style={{ width: '40px', height: '40px', background: "rgb(40 199 111 / 20%)" }}>
                                  {ContactData?.messages_display_name?.slice(0, 1) ?? <Users size={15} />}
                                </div>
                              </Col>
                              <Col md="10" className=' ' style={{ gap: "5px" }}>
                                <div className='d-flex justify-content-between '>
                                  <h5 className='mb-0 p-0 fw-bolder'>{ContactData?.messages_display_name ?? ContactData?.messages_reciever}</h5>
                                  <div className='font-small-3 '>
                                    {ContactData?.messages_last_message_timestamp_sent && moment(ContactData?.messages_last_message_timestamp_sent).format("hh:mm")}
                                  </div>
                                </div>

                                <div className='position-relative '>
                                  <p className='m-0 p-0'>{lastMsgData?.text?.body?.slice(0, 20)} {lastMsgData?.text?.body?.length > 20 && <span>...</span>}</p>
                                  <p className='m-0 p-0'>{lastMsgData?.name?.slice(0, 20)} {lastMsgData?.name?.length > 20 && <span>...</span>}</p>
                                  <p className='m-0 p-0'>{lastMsgData?.type === "image" && <Image size={15} />} </p>
                                  <p className='m-0 p-0'>{lastMsgData?.type === "video" && <Video size={15} />} </p>
                                  <p className='m-0 p-0'>{lastMsgData?.type === "audio" && <Headphones size={15} />} </p>
                                  <p className='m-0 p-0'>{lastMsgData?.type === "document" && <File size={15} />} </p>

                                  {/* counter */}
                                  {
                                    ContactData?.messages_count > 0 &&
                                    <div className='border-success rounded-5 d-flex justify-content-center align-items-center position-absolute end-0 top-0 ' style={{ width: "20px", height: "20px", background: "rgb(40 199 111 / 20%)" }}>
                                      <p className='text-success m-0 font-small-3 '>{ContactData?.messages_count}</p>
                                    </div>
                                  }
                                </div>
                                <div className='font-small-2 d-flex ' style={{ gap: "8px", marginTop: "5px" }}>

                                  {/* <span >{ContactData?.flag}</span> */}
                                  {/* <span ><Globe size={10} /> Return & Refund</span> */}
                                  {/* <span ><CiShoppingTag size={10} />MQL</span> */}
                                </div>
                              </Col>

                            </Row>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div className='w-100 ' >
                    <div className='px-2 text-center py-1 text-primary cursor-pointer' onClick={() => { setContactPage(prev => prev + 1) }}>Load More...</div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Main Chat Container */}

            <Col className=' px-0 d-flex flex-column justify-content-between ' style={{ backgroundImage: `url(${back})`, height: '100%' }}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center" style={{ background: '#f0f2f5' }} >
                <div className="d-flex align-items-center ps-1 cursor-pointer w-100 " style={{ background: '#f0f2f5', height: "65px" }} onClick={() => setDynamicColumnValue(3)}>
                  <div className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: "#00a884" }}>
                    {/* <p className='fs-3 fw-bolder text-white mb-0'>{useProfileDetails?.firstName[0]}</p> */}
                    <p className='fs-3 fw-bolder text-white mb-0'>{useProfileDetails?.messages_display_name?.slice(0, 1)}</p>
                  </div>
                  <div className='d-flex justify-content-center align-items-center gap-1 ms-1'>
                    <div className=''>

                      <h4 className='mb-0 p-0 fw-bolder'>{useProfileDetails?.messages_display_name}</h4>
                      <h6 className='mb-0 p-0 fw-bolder'>{useProfileDetails?.messages_reciever}</h6>
                    </div>
                    {
                      useProfileDetails?.contactType && <h6 className='text-primary font-small-3 mb-0'> - {useProfileDetails?.contactType}</h6>
                    }

                  </div>
                  <h4 className='pt-1' style={{ fontWeight: '500', lineHeight: '1.2em', marginLeft: '15px' }}>
                    {/* {useProfileDetails?.firstName}<br /> */}
                    {/* <span className='fs-6'>{subtext}</span> */}
                  </h4>
                </div>
                <div className="d-flex align-items-center gap-2">
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

              <div className='chat-container d-flex flex-column position-relative ' >

                {!imagePreview ? <div
                  key={useMessageData}
                  ref={chatContainerRef}
                  id='chatContScroll'
                  style={{ overflowY: "auto", height: '100%' }}
                  className={` d-flex flex-column-reverse  hideScroll`}
                >

                  {useMessageData.map((messageData, index) => {
                    // console.log("WEB SOCKET MESSAGE", messageData?.messages_context)
                    let messageJson = {}
                    let replyJson = {}
                    console.log("messageData =====================", index)
                    try {
                      messageJson = JSON.parse(messageData?.messages_context)
                      replyJson = JSON.parse(messageData?.messages_reply_context)
                      // console.log("637", messageJson?.image?.link)
                      // console.log("755 0", replyJson?.components[0]?.text)
                      // console.log("755 1", replyJson?.components[1]?.text)
                    } catch (error) {
                      // console.log(JSON.parse(messageData)?.messages_context)
                      console.log(error)
                      // const old = JSON.parse(messageData)
                      // messageJson = JSON.parse(old.messages_context)
                      // console.log(messageJson?.text?.body)
                    }

                    const backgroundColor = currentTab?.messages_sender === messageData?.messages_sender ? '#d4f2c2' : '#F2F3F4'
                    const align = currentTab?.messages_sender === messageData?.messages_sender ? 'end' : 'start'
                    // console.log(messageJson?.text?.body)
                    return (

                      <>
                        {messageJson &&
                          <div key={index} className={`message`} style={{
                            display: 'flex',
                            align,
                            backgroundColor,
                            flexDirection: 'column',
                            margin: '10px',
                            padding: '5px',
                            borderRadius: '8px',
                            justifyContent: 'center',
                            alignSelf: align,
                            maxWidth: "fit-content",
                            maxWidth: "400px"
                          }}>
                            {
                              (replyJson?.name) && <div className='border border-bottom-3 rounded-2 pe-2 mb-1'>
                                <p className='font-small-3 mb-0'>{replyJson?.name}</p>
                              </div>
                            }
                            {/* {
                              (replyJson?.components[0]?.text || replyJson?.components[1]?.text) && <div className='border border-bottom-3 rounded-2 pe-2 mb-1'>
                                <p className='font-small-3 mb-0'>...</p>
                              </div>
                            } */}

                            {
                              replyJson?.text?.body && <div className='border border-bottom-3 rounded-2 pe-2 mb-1'>
                                <p className='font-small-3 mb-0'>{replyJson?.text?.body?.slice(0, 15)}...</p>
                              </div>
                            }

                            <div className='  '>

                              {/* text */}
                              {
                                messageJson?.button?.text && <div className="message-info ps-1 pe-3">
                                  {messageJson?.button?.text}
                                </div>
                              }
                              {
                                messageJson?.text?.body && <div className="message-info ps-1 pe-3">
                                  {messageJson?.text?.body}
                                </div>
                              }
                              {/* image */}
                              {
                                messageJson?.image?.link && <div>
                                  <img src={messageJson?.image?.link} alt="" style={{ width: "100%" }} />

                                  <h5 className='mt-1 ms-1'>
                                    {messageJson?.image?.caption}
                                  </h5>

                                </div>
                              }
                              {/* video */}
                              {
                                messageJson?.video?.link && <div className=''>
                                  <video className='rounded-3  object-fit-cover w-100' controls mute style={{ width: "100%" }} >
                                    <source
                                      src={messageJson?.video?.link ?? ""}
                                      type="video/mp4"
                                    />
                                    Video not supported.
                                  </video>
                                  <h5 className='mt-1 ms-1'>
                                    {messageJson?.video?.caption}
                                  </h5>
                                </div>
                              }
                              {/* aduio */}
                              {
                                messageJson?.audio?.link && <div className='' style={{ minWidth: "300px" }}>
                                  <audio className='rounded-3  object-fit-cover w-100' controls   >
                                    <source
                                      src={messageJson?.audio?.link ?? ""}
                                      type="audio/ogg"
                                    />
                                    audio not supported.
                                  </audio>
                                  <h5 className='mt-1 ms-1'>
                                    {messageJson?.audio?.caption}
                                  </h5>
                                </div>
                              }
                              {/* document */}
                              {
                                messageJson?.document?.link && <div className=''>
                                  <div className='  d-flex justify-content-start  align-items-center  px-2 gap-1' style={{ height: "50px" }}>
                                    <FileText size={30} color='#000' />
                                    <div>{messageJson?.document?.filename ?? ''}</div>
                                    <a href={messageJson?.document?.link} target="_blank">
                                      <LuEye size={20} color='#a9abab' />
                                    </a>
                                  </div>
                                  <h5 className='mt-1 ms-1'>
                                    {messageJson?.document?.caption}
                                  </h5>
                                </div>
                              }
                              {/* template */}
                              {
                                messageJson?.name && <div className=''>
                                  <RenderLiveTemplateUI SingleTemplate={messageJson} />

                                </div>
                              }
                              {/* time and tick */}
                              <div className='d-flex justify-content-end align-items-center mt-1' style={{ gap: "5px", paddingRight: "5px" }}>
                                <span className='font-small-3 '>
                                  {messageData?.messages_timestamp_sent && moment(messageData?.messages_timestamp_sent).format("hh:mm")}
                                </span>
                                <span className={currentTab?.messages_sender === messageData?.messages_sender ? '' : 'd-none'}>
                                  {
                                    messageData?.messages_timestamp_read ? <LiaCheckDoubleSolid size={18} color='#006aff' /> : messageData?.messages_timestamp_delivered ? <LiaCheckDoubleSolid size={18} color='#7c7c7c' /> : messageData?.messages_timestamp_sent ? <LiaCheckDoubleSolid size={18} color='#7c7c7c' /> : ''
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        }

                      </>
                    )
                  })}


                </div > : <div className='p-2 d-flex flex-column justify-content-between ' style={{ height: "100%", background: '#e9edef' }}>
                  <div className=''>
                    <RxCross2 className='fs-3 '
                      onClick={() => {
                        setImagePreview(false)
                        setStoreMedia({})
                      }}

                    />
                  </div>
                  <div className='d-flex align-items-center justify-content-center '>

                    {/* {console.log(storeMedia.media.type.startsWith('video/') ? 'video' : 'photo')}' */}
                    {storeMedia?.media?.type.startsWith('video/') && <video controls width="250">
                      <source src={storeMedia?.media_display} type={storeMedia?.media?.type} />
                    </video>}
                    {storeMedia?.media?.type.startsWith('image/') &&
                      <img src={storeMedia?.media_display} style={{ height: '150px' }} loading='lazy' />}
                  </div>
                  <div >
                    <div className='text-center'>
                      <input type='text' className='border-0 p-1 w-50' placeholder='type a message' style={{ backgroundColor: '#ffffff', borderRadius: "5px" }} value={mediaText} onChange={(e) => setMediaText(e.target.value)} />
                    </div>
                    <div className='float-end '>
                      <div className='d-flex align-items-center justify-content-center ' style={{ width: "50px", height: "50px", background: '#00a884', borderRadius: "50%", cursor: "pointer" }} onClick={() => {
                        setImagePreview(false)
                        sendMessages("files")
                      }} >
                        <IoMdSend className='fs-3' style={{ color: 'white' }} />
                      </div>
                    </div>
                  </div>

                </div>

                }
                {/* input field */}

              </div>
              {/*bottom*/}
              {!imagePreview && <div className=' d-flex align-items-center gap-1 px-1 position-sticky bottom-0 bg-white' style={{ padding: "10px" }} >

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
                        <File size={17} style={{ color: '#7f66ff' }} /> Documents
                        <input
                          type="file"
                          id='uploadDocButton'
                          className="d-none"
                          onChange={handleChange}
                          name='media'
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


                {/* <div className='btn' onClick={() => setTemplateModal(true)}>
                  <HiOutlineTemplate size={20} />
                </div> */}
                <div className='btn' onClick={() => setReplyModal(true)}>
                  <BsReply size={20} />
                </div>

                <textarea
                  type="text"
                  className="form-control border rounded "
                  placeholder="Type your message..."
                  id='message_input'
                  autoComplete='off'
                  value={useInputMessage}
                  rows={1}
                  // onClick={inputMessageCursorChange}
                  onChange={(e) => {
                    // inputMessageCursorChange()
                    // setNewMessage(e.target.value)
                    setInputMessage(e.target.value)
                  }}
                  style={{ borderRadius: "50px", resize: "none" }}
                />
                {/* {users.map((index) => ( */}
                {
                  currentTab?.messages_reciever && <div className='d-flex align-items-center justify-content-center ' onClick={() => sendMessages('text')} style={{ width: "50px", height: "50px", minWidth: "50px", minHeight: "50px", maxWidth: "50px", maxHeight: "50px", background: '#00a884', borderRadius: "50%", cursor: "pointer" }} >
                    <IoMdSend className='fs-3' style={{ color: 'white' }} />
                  </div>
                }
            
              </div>}

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

                    <InputGroup style={{ borderRadius: "10px" }}>
                      <InputGroupText color='transparent' style={{ border: "0" }}>
                        <IoMdSearch className=' fs-3 ' />
                      </InputGroupText>
                      <input type='text' value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ border: "0", color: '#8b98a0' }} placeholder='Search...' />
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
                      <div className='d-flex align-items-center justify-content-center ' style={{ width: "200px", height: "200px", borderRadius: "50%", background: "#00a884" }}>
                        <p className='text-white fw-bolder mb-0' style={{ fontSize: "5rem" }}>{useProfileDetails?.messages_display_name?.slice(0, 1)}</p>
                      </div>

                      <div className='pt-1'>

                        <h4 className='mb-0 p-0 fw-bolder'>{useProfileDetails?.messages_display_name}</h4>
                        <h6 className='mb-0 p-0 fw-bolder'>{useProfileDetails?.messages_reciever}</h6>
                      </div>
                    </div>
                  </div>
                  <div className='mt-1 p-1' style={{ background: "#ffffff", boxShadow: '0px 15px 11px -16px rgba(0,0,0,0.1)' }}>
                    <p className='fs-5'>About</p>
                    <p style={{ color: 'black' }}>Busy</p>
                  </div>

                  <div className='mt-1 p-1' style={{ background: "#ffffff", boxShadow: '0px 15px 11px -16px rgba(0,0,0,0.1)' }}>
                    <p className='fs-5'>Tags</p>
                    <div className='input-group mb-1'>
                      <span className="input-group-text" id="basic-addon1">@</span>
                      <input type="text" className="form-control" placeholder="Tags" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <div className='mt-1 p-1' style={{ background: "#ffffff", boxShadow: '0px 15px 11px -16px rgba(0,0,0,0.1)' }}>
                    <p className='fs-5'>Notes</p>
                    <div class="input-group mb-1">
                      <input type="text" className="form-control" placeholder="Add a Note" aria-label="Recipient's username" aria-describedby="button-addon2" />
                      <button className="btn btn-outline-secondary" type="button" id="button-addon2">Add</button>
                    </div>

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
                          onClick={() => { setSelectedDescription(item); setInputMessage(item.description) }}>
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
                    </div> : <div className='d-flex align-items-center justify-content-center h-100'>
                      <span className='fw-bolder text-uppercase ' style={{ fontSize: "1.2rem" }}>Please select a reply</span>
                    </div>}
                  </Col>
                  <hr />
                </Row>
              </Modal.Body>
              <Modal.Footer>

                <Button className='btn btn-primary ' onClick={() => { setInputMessage(""); setReplyModal(false) }}>Cancel</Button>
                {selectedDescription.description && <>
                  <Button
                    className='btn btn-primary '
                    style={{ width: "auto" }}
                    onClick={() => {
                      // setNewMessage(selectedDescription.description)
                      setInputMessage(selectedDescription.description)
                      setReplyModal(false)
                    }}>Copy to Editor</Button> <Button
                      className='btn btn-primary'
                      onClick={() => {
                        // setMessages(prevMessages => [
                        // ...prevMessages,
                        // { text: selectedDescription.description, sender: 'user', timeStamp: currentMessageTime() }
                        // ])

                        sendMessages('text')
                        setReplyModal(false)
                      }}>Send</Button>
                </>}

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

                {/* <Card className='border-0' >
                  <CardBody>

                    <Row className='match-height'>
                      {
                        filteredTempData.map((SingleTemplate) => {
                          return (
                            <Col md="6 mt-3" >
                              <h5> {SingleTemplate.name}</h5>
                              <Card className="border-0 p-2 position-relative shadow-lg" style={{ background: "#c2c2c2", backgroundImage: `url(${wp_back})`, gap: "5px", maxWidth: "500px" }} >

                                <div className="border-1 rounded-3 mb-0 whatsapp_template_card" style={{ minHeight: "200px", background: "white" }}>
                                  <div className='p-0' >
                                    {

                                      SingleTemplate.components.map((data, index) => {
                                        if (messageData.format === "IMAGE") {
                                          return (
                                            <div className='p-1' >
                                              <img className='img-fluid border-0 rounded w-100 object-fit-cover ' src={messageData.example.header_handle[0] ?? ""} alt="" />
                                            </div>
                                          )
                                        }
                                        if (messageData.type === "BODY") {
                                          return (
                                            <div className='p-1 pe-2' >
                                              <p className='fs-6'>{getBoldStr(messageData.text)} </p>
                                            </div>
                                          )
                                        }
                                        if (messageData.type === "FOOTER") {
                                          return (
                                            <div className='pt-1 ps-1 pe-2' >
                                              <p className='text-secondary font-small-3'>{messageData.text} </p>
                                            </div>
                                          )
                                        }
                                        if (messageData.type === "BUTTONS") {
                                          return messageData.buttons.map((data, index) => {
                                            if (messageData.type === "URL") {
                                              return (
                                                <div className="border-top d-flex text-primary justify-content-center align-items-center " style={{ padding: "10px", gap: "8px" }} >
                                                  <ExternalLink size={17} /><h6 className='m-0 text-primary' >{messageData.text}</h6>
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
                                    if (messageData.type === "BUTTONS") {
                                      return messageData.buttons.map((data, index) => {

                                        if (messageData.type === "QUICK_REPLY") {
                                          return (
                                            <div className="border rounded-3 bg-white d-flex text-primary justify-content-center align-items-center " style={{ padding: "10px", gap: "8px" }} >
                                              <Phone size={17} /><h6 className='m-0 text-primary' > {messageData.text}</h6>
                                            </div>
                                          )
                                        }
                                      })
                                    }


                                  })

                                }
                              

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
                </Card> */}

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