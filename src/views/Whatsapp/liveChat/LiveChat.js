/* eslint-disable multiline-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { File, FileText, Headphones, Image, Plus, Users, Video } from 'react-feather'
import { BsBroadcast, BsPinAngle } from 'react-icons/bs'
import { FaEllipsisV, FaInstagram, FaSearch } from "react-icons/fa"
import { HiOutlineDotsVertical, HiOutlineTemplate } from "react-icons/hi"
import { IoMdSearch, IoMdSend } from "react-icons/io"
import { IoWarningOutline } from "react-icons/io5"
import { LiaCheckDoubleSolid } from "react-icons/lia"
import { LuEye } from "react-icons/lu"
import { MdOutlineLibraryAdd, MdOutlineQuickreply } from "react-icons/md"
import { RiCustomerService2Line } from "react-icons/ri"
import { RxCross2 } from "react-icons/rx"
import { TbExternalLink } from "react-icons/tb"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import {
  Button,
  Container,
  Input, InputGroup, InputGroupText, Tooltip
} from 'reactstrap'
import { SocketBaseURL, postReq } from '../../../assets/auth/jwtService'
import Spinner from '../../Components/DataTable/Spinner'
import FrontBaseLoader from '../../Components/Loader/Loader'
import { RenderLiveTemplateUI, chatsTagList, getBoldStr, getRemainingTime, timeDateLiveFormatter, timeLiveFormatter } from '../SmallFunction'
import WA_BG_2 from '../imgs/WA_BG_2.png'
import StaticPage1 from './StaticPage'
const LiveChat = () => {

  const [useLiveContactLoader, setLiveContactLoader] = useState(true)
  const [useLiveChatLoader, setLiveChatLoader] = useState(true)
  const [useIsLoading, setIsLoading] = useState(false)
  const [useMessageData, setMessageData] = useState([])
  const [useProfileDetails, setProfileDetails] = useState("")
  const [useSortBy, setSortBy] = useState("live")
  const [useQuickReplySearch, setQuickReplySearch] = useState("")
  const [useQuickReplyList, setQuickReplyList] = useState([])
  const [useRemainingTime, setRemainingTime] = useState('')

  // console.log("useProfileDetails", useProfileDetails)

  const [useInputMessage, setInputMessage] = useState('')
  const [users, setUsers] = useState([])
  const [useContactPage, setContactPage] = useState(1)
  const [useProjectNo, setProjectNo] = useState('')
  const [dynamicColumnValue, setDynamicColumnValue] = useState(0)
  const [toggleMedia, setToggleMedia] = useState(false)
  const [storeMedia, setStoreMedia] = useState({})
  const [useSearchContact, setSearchContact] = useState("")
  const [search, setSearch] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState(false)
  const [mediaText, setMediaText] = useState("")
  const chatContainerRef = useRef(null)
  const [useReplyModal, setReplyModal] = useState(false)
  const [useTemplateModal, setTemplateModal] = useState(false)
  const [selectedDescription, setSelectedDescription] = useState('')
  const [tooltipOpen, setTooltipOpen] = useState({
    TooltipButton1: false,
    TooltipButton2: false,
    TooltipButton3: false,
    TooltipButton4: false,
    TooltipButton10: false
  })

  const toggleTooltip = (buttonId) => {
    setTooltipOpen(prevState => ({
      ...prevState,
      [buttonId]: !prevState[buttonId]
    }))
  }
  const [ws, setWs] = useState('')
  const [useContactWs, setContactWs] = useState('')
  const ActiveTabList = [
    {
      title: "All",
      id: "",
      isActive: false
    },
    {
      title: "Ongoing",
      id: "live",
      isActive: false
    },
    {
      title: "Unread",
      id: "unread",
      isActive: false
    },
    {
      title: "Closed",
      id: "history",
      isActive: false
    }
  ]

  // mark msg read
  const markAsRead = (id, msgId, recieverNum) => {

    // console.log("99", id)
    // console.log("99", msgId)

    // return null
    const form_data = new FormData()
    form_data.append("messageId", id)
    form_data.append("unique_id", msgId)
    postReq("mark_message_read", form_data)
      .then((resp) => {
        console.log("msg read", resp)
      }).catch((err) => { console.log(err) })
  }

  const sendMessages = (type) => {
    const form_data = new FormData()
    form_data.append("reciever", useProfileDetails.messages_reciever)
    if (type === "text") {
      form_data.append("message_body", useInputMessage)
      form_data.append("type", "text")
    } else if (type === "files" && (storeMedia?.media?.type === "image/jpeg" || storeMedia?.media?.type === "image/png")) {
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
    console.log("storeMedia", storeMedia?.media?.type)
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
        console.info('Previous WebSocket chats connection closed')
      }

      // Create new WebSocket connection
      const newWs = new WebSocket(`${SocketBaseURL}/ws/chat/?unique_id=${users?.[index]?.messages_unique_id}`)
      setWs(newWs)

      newWs.onopen = () => {
        console.info('WebSocket chats connected', users?.[index]?.messages_unique_id)
      }

      newWs.onmessage = (event) => {
        console.log("New message:", event.data)
        setMessageData(prevMessageData => [JSON.parse(event.data), ...prevMessageData])
        const old = JSON.parse(event.data)
        console.log("old", old)

        markAsRead(JSON.parse(old.messages_context).id, old.unique_id)
        // eslint-disable-next-line no-use-before-define
        scrollToBottom()
      }

      newWs.onclose = () => {
        console.info('WebSocket chats disconnected', users?.[index]?.messages_unique_id)
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
    form_data.append("selected_no", useProfileDetails.messages_reciever)
    setLiveChatLoader(true)
    postReq("get_all_message", form_data)
      .then((resp) => {

        setMessageData(resp?.data?.messages)
        // console.log("260", resp?.data?.messages.slice(0, 1)[0].messages_message_id, useProfileDetails.messages_unique_id)
        markAsRead(resp?.data?.messages.slice(0, 1)[0].messages_message_id, useProfileDetails.messages_unique_id)

        // markAsRead(resp?.data?.messages.slice(0, 1)[0].messages_message_id)
      }).catch((err) => { console.log(err) })
      .finally(() => setLiveChatLoader(false))
  }

  // get all contacts
  const getAllContacts = () => {
    console.log("contacts load =============")
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 20)
    form_data.append("searchValue", useSearchContact)
    form_data.append("type", useSortBy)
    setLiveContactLoader(true)
    postReq("contact_relation", form_data)
      .then((res) => {
        // console.log("213", users)
        // console.log("214", res.data?.messages)
        setUsers(prev => [...prev, ...res.data?.messages])
        webSocketConnectionContacts(res?.data?.project_no)
      }).catch((err) => {
      }).finally(() => setLiveContactLoader(false))
  }
  const filterAllContacts = (sortby) => {
    console.log("contacts sortby =============", sortby)
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 20)
    form_data.append("searchValue", useSearchContact)
    form_data.append("type", sortby)
    setIsLoading(true)
    postReq("contact_relation", form_data)
      .then((res) => {
        setUsers(res.data?.messages)

      }).catch((err) => {
        // console.log(err)
      }).finally(() => setIsLoading(false))
  }
  const searchAllContacts = () => {
    console.log("contacts search =============", useSearchContact)
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 20)
    form_data.append("searchValue", useSearchContact)
    form_data.append("type", useSortBy)
    setIsLoading(true)
    postReq("contact_relation", form_data)
      .then((res) => {
        setUsers(res.data?.messages)

      }).catch((err) => {
        // console.log(err)
      }).finally(() => setIsLoading(false))
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchAllContacts()
    }, 500) // Adjust the delay (in milliseconds) as needed

    return () => clearTimeout(delayDebounceFn)
  }, [useSearchContact])

  useEffect(() => {
    // console.log("================== run contacts main useeffect")

    getAllContacts()
  }, [useContactPage])


  useEffect(() => { // when select number
    getAllMessages()
    // eslint-disable-next-line no-use-before-define
    scrollToBottom()
    // setRemainingTime(useProfileDetails?.messages_servicing_window)
    setRemainingTime(getRemainingTime(useProfileDetails?.messages_servicing_window ?? 0))
    const interval = setInterval(() => {
      setRemainingTime(getRemainingTime(useProfileDetails?.messages_servicing_window ?? 0))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [useProfileDetails])

  const handleChange = (e) => {
    const form_data = new FormData()
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
    try {

      const chatContScroll = document.getElementById("chatContScroll")
      chatContScroll.scrollTop = chatContScroll.scrollHeight
    } catch (error) {
      console.log(error)
    }
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

  // get quick replay
  const getQuickReplay = () => {
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 1000)
    form_data.append("searchValue", useQuickReplySearch)
    form_data.append("action", "get")
    postReq(`quick_replay`, form_data)
      .then(res => {
        // Handle the successful res here
        console.log('res:', res.data)
        setQuickReplyList(res?.data?.quick_reply ?? [])
      }).then((err) => {
        console.log(err)
        // toast.error("Something went wrong!")
      })
  }
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getQuickReplay()
    }, 500) // Adjust the delay (in milliseconds) as needed

    return () => clearTimeout(delayDebounceFn)
  }, [useQuickReplySearch])

  // console.log("350 ======", users)
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
     
        .timestamp-btn {
          background:none ;
          border:none;
          outline:none;
        }
        .timestamp-box {
          display: none;
        }
        
        .timestamp-btn:focus .timestamp-box {
          display: block;
        }
        .liveChatsTab .swiper{
         padding:0px 20px
        }
        .liveChatsTab .swiper-button-prev{
          margin-left: -17px;
        }
        .liveChatsTab .swiper-button-prev::after{
          background-color:none;
          outline:none
        }
 `}</style>
      {
        useIsLoading && <FrontBaseLoader />
      }

      <Container className='d-flex border fs-hel-lig' style={{ width: "100vw ", height: '85vh', marginTop: "-10px" }}>


        <Row >
          <Col>
            <div className='p-1 pt-2 h-100 prime-grey-bg' style={{ width: "70px" }}>

              <div className='d-flex flex-column align-items-center justify-content-start' style={{ gap: "7px" }}>
                <div className='rounded-circle position-relative select-grey' id="TooltipButton1" style={{ padding: "9px" }}>
                  <RiCustomerService2Line size={20} />
                  <div className='rounded-pill high-green-bg font-small-2 position-absolute top-0 end-0' style={{ padding: "2px 6px", marginRight: "-20px" }}>
                    206
                  </div>
                  <Tooltip
                    placement="right"
                    isOpen={tooltipOpen.TooltipButton1}
                    target="TooltipButton1"
                    toggle={() => toggleTooltip('TooltipButton1')}
                  >
                    Support
                  </Tooltip>
                </div>

                <div className='rounded-circle position-relative' id="TooltipButton2" style={{ padding: "9px" }}>
                  <IoWarningOutline size={20} />
                  <div className='rounded-pill high-red-bg font-small-2 position-absolute top-0 end-0' style={{ padding: "2px 6px", marginRight: "-20px" }}>
                    24
                  </div>
                  <Tooltip
                    placement="right"
                    isOpen={tooltipOpen.TooltipButton2}
                    target="TooltipButton2"
                    toggle={() => toggleTooltip('TooltipButton2')}
                  >
                    Lapsed
                  </Tooltip>
                </div>

                <div className='rounded-circle' id="TooltipButton3" style={{ padding: "9px" }}>
                  <BsBroadcast size={20} />
                  <Tooltip
                    placement="right"
                    isOpen={tooltipOpen.TooltipButton3}
                    target="TooltipButton3"
                    toggle={() => toggleTooltip('TooltipButton3')}
                  >
                    Broadcast
                  </Tooltip>
                </div>

                <div className='rounded-circle' id="TooltipButton4" style={{ padding: "9px" }}>
                  <FaInstagram size={20} />
                  <Tooltip
                    placement="right"
                    isOpen={tooltipOpen.TooltipButton4}
                    target="TooltipButton4"
                    toggle={() => toggleTooltip('TooltipButton4')}
                  >
                    Instagram
                  </Tooltip>
                </div>
              </div>
            </div>

          </Col>

        </Row>
        <Row className='d-flex justify-content-center match-height w-100' >
          {/* Sidebar contacts*/}
          <Col sm='4' className='m-0 p-0 ' style={{ maxWidth: "370px" }}>
            <div>

              <div className='d-flex align-items-center justify-content-between p-1 pt-2' style={{ height: '65pxs' }}>
                <div className='d-flex gap-1 align-items-center '>
                  {/* <img src={xircls_WA_LOGO} className='' width={40} alt="" /> */}

                  <h2 className='whats-font-bolder mb-0'>Chats</h2>
                </div>

                <div className='d-flex justify-content-center  align-items-center  gap-1'>
                  <MdOutlineLibraryAdd size={20} />
                  <HiOutlineDotsVertical size={20} />

                </div>
              </div>
              <div class="live-group-search px-1">
                <div class="group">
                  <IoMdSearch className='icon' size={20} />
                  <input className="input" type="search" onChange={(e) => setSearchContact(e.target.value)} placeholder="Search..." />
                </div>

              </div>
              <div className='d-flex gap-1 px-1 py-1'>
                {
                  ActiveTabList.map((elm, index) => (
                    <div className={`rounded-5 d-flex justify-content-center align-items-center cursor-pointer position-relative ${elm?.id === useSortBy ? 'prime-green' : "prime-grey-bg"} `}
                      onClick={() => { filterAllContacts(elm.id); setSortBy(elm.id) }}
                    >
                      {
                        index === 1 &&
                        <div className='position-absolute top-0 end-0 d-flex justify-content-center  align-items-center rounded-circle high-green-bg' style={{ width: "18px", height: "18px", marginTop: "-7px", marginRight: "-5px", fontSize: "13px" }}>5</div>
                      }
                      <p className='m-0 font-small-3 fw-bolder ' style={{ padding: "5px 10px" }}>{elm?.title} </p>
                    </div>
                  ))
                }

              </div>
            </div>

            {/*contacts list */}
            <div className='hideScroll  ' style={{ maxHeight: "calc(100vh - 240px)", overflow: "scroll", marginRight: "-6px" }}>

              <div className='mb-5'>
                {users.map((ContactData, index) => {

                  let lastMsgData = {}
                  // console.log("601 =========", ContactData)
                  // console.log("601 =========", ContactData?.messages_reciever)
                  try {
                    lastMsgData = JSON.parse(ContactData?.messages_last_message)
                  } catch (error) {
                    console.log(error)
                  }

                  return (
                    <div
                      key={ContactData.messages_reciever}
                      className={` w-100 px-1 ${ContactData.messages_reciever === useProfileDetails.messages_reciever ? "prime-grey-bg" : ''}`}

                      onClick={() => {
                        // setCurrentTab(ContactData)
                        webSocketConnection(index)
                        setProfileDetails(ContactData)
                        // console.log("ContactData", ContactData)

                      }}
                    >
                      <div>

                        <Row className="cursor-pointer h-100 " >
                          <Col md="2" className=' d-flex align-items-center justify-content-center flex-column '>
                            <div className="rounded-circle d-flex align-items-center justify-content-center prime-grey-bg text-capitalize " style={{ width: '45px', height: '45px', color: "#b9b6b6" }}>
                              {ContactData?.messages_display_name?.slice(0, 1) ?? <Users size={15} />}
                            </div>
                          </Col>
                          <Col md="10" className='border-bottom d-flex flex-column  justify-content-center ' style={{ minHeight: "60px", padding: "15px 0" }}>
                            <div className='d-flex justify-content-between  '>
                              <h5 className='mb-0 p-0  fs-hel-reg'>{ContactData?.messages_display_name ?? ContactData?.messages_reciever}</h5>
                              <div className={`font-small-3  ${ContactData?.messages_count > 0 ? "high-green-text" : ""}`}>

                                {ContactData?.messages_last_message_timestamp_sent && timeDateLiveFormatter(ContactData?.messages_last_message_timestamp_sent)}
                              </div>
                            </div>

                            <div className='position-relative ' style={{ color: "#404e58" }}>
                              <p className={`m-0 p-0 font-small-3 ${ContactData?.messages_count > 0 ? "fw-bold" : ""}`}>{lastMsgData?.text?.body?.slice(0, 25)} {lastMsgData?.text?.body?.length > 25 && <span>...</span>}</p>
                              <p className='m-0 p-0'>{lastMsgData?.name?.slice(0, 25)} {lastMsgData?.name?.length > 25 && <span>...</span>}</p>
                              <p className='m-0 p-0'>{lastMsgData?.type === "image" && <Image size={15} />} </p>
                              <p className='m-0 p-0'>{lastMsgData?.type === "video" && <Video size={15} />} </p>
                              <p className='m-0 p-0'>{lastMsgData?.type === "audio" && <Headphones size={15} />} </p>
                              <p className='m-0 p-0'>{lastMsgData?.type === "document" && <File size={15} />} </p>

                              {/* counter */}
                              {
                                (ContactData.messages_reciever !== useProfileDetails.messages_reciever && ContactData?.messages_count > 0) &&
                                <div className=' rounded-5 d-flex justify-content-center align-items-center position-absolute end-0 top-0 high-green-bg' style={{ width: "20px", height: "20px" }}>
                                  <p className=' m-0 font-small-3 '>{ContactData?.messages_count}</p>
                                </div>
                              }
                            </div>

                          </Col>

                        </Row>
                      </div>
                    </div>
                  )
                })}
                <div className='w-100 text-center py-1' >
                  {
                    useLiveContactLoader ? <Spinner size="40px" /> : <div className='px-2 text-center  text-primary cursor-pointer' onClick={() => { setContactPage(prev => prev + 1) }}>Load More...</div>
                  }
                </div>
              </div>
            </div>
          </Col>

          {/* Main Chat Container */}
          {useProfileDetails?.messages_reciever &&
            <Col className=' px-0 d-flex flex-column justify-content-between ' style={{ backgroundImage: `url(${WA_BG_2})`, height: '100%', backgroundSize: "370px" }}>
              {/* Header */}
              <div className=" d-flex justify-content-between align-items-center prime-grey-bg" >
                <div className="d-flex align-items-center ps-1 cursor-pointer w-100 " style={{ height: "65px" }} onClick={() => setDynamicColumnValue(3)}>
                  <div className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center select-grey text-secondary" style={{ width: '40px', height: '40px', color: "#b9b6b6" }}>
                    {/* <p className='fs-3 fw-bolder text-white mb-0'>{useProfileDetails?.firstName[0]}</p> */}
                    <p className='fs-3 fw-bolder text-white mb-0'>{useProfileDetails?.messages_display_name?.slice(0, 1)}</p>
                  </div>
                  <div className='d-flex justify-content-center align-items-center gap-1 ms-1'>
                    <div className=''>

                      <h4 className='mb-0 p-0 fw-bolder'>{useProfileDetails?.messages_display_name}</h4>
                      <h6 className='mb-0 p-0 fw-bold'>{useProfileDetails?.messages_reciever}</h6>
                    </div>
                    {
                      useProfileDetails?.contactType && <h6 className='text-primary font-small-3 mb-0'> - {useProfileDetails?.contactType}</h6>
                    }

                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div>
                    <BsPinAngle size={18} />
                  </div>
                  <div>
                    <div id="TooltipButton10" style={{width:"90px"}} className={`rounded-5 d-flex justify-content-center align-items-center cursor-pointer position-relative ${useRemainingTime?.status === 0
                        ? 'prime-red'
                        : useRemainingTime?.status === 1
                          ? 'prime-orange'
                          : 'prime-green'
                      }`}>
                      {/* <p className='m-0 font-small-3 fw-bolder' style={{ padding: "10px 15px" }}>{timeLiveFormatter(useProfileDetails?.messages_servicing_window)}</p> */}
                      <p className='m-0 font-small-3 fw-bolder' style={{ padding: "10px 15px" }}>{useRemainingTime ? `${useRemainingTime?.hour ?? '00'} : ${useRemainingTime?.minutes ?? '00'}` : '--'}</p>
                      <Tooltip
                        placement="bottom"
                        isOpen={tooltipOpen.TooltipButton10}
                        target="TooltipButton10"
                        toggle={() => toggleTooltip('TooltipButton10')}
                        style={{ minWidth: "150px" }}
                      >
                        Chat expires in {useRemainingTime?.hour ?? '00'} hrs {useRemainingTime?.minutes ?? '00'} mins. Once expired, WhatsApp allows only template messages to be sent
                      </Tooltip>
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }}>

                    <Select
                      className=''
                      style={{
                        control: (provided) => ({
                          ...provided,
                          minWidth: '300px'
                        })
                      }}
                      defaultValue={chatsTagList[0]}
                      options={chatsTagList}
                      closeMenuOnSelect={true}
                    />
                  </div>
                  <FaSearch onClick={() => {
                    setSearch(true)
                    setDynamicColumnValue(3)
                  }} />
                  <div className='position-relative pe-2' >
                    <div onClick={() => setDropdownOpen(!dropdownOpen)} className='bg-transparent '>
                      <FaEllipsisV />
                    </div>
                    <div className={`${dropdownOpen ? "" : "d-none"}`}
                      onClick={(e) => {
                        // e.stopPropagation()
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

              <div className='chat-container h-100 d-flex flex-column position-relative px-4' >

                {!imagePreview ? <div
                  key={useMessageData}
                  ref={chatContainerRef}
                  id='chatContScroll'
                  style={{ overflowY: "auto", height: '100%' }}
                  className={` d-flex flex-column-reverse  hideScroll`}
                >
                  {/* <div className='liveChatMessageLoader'>
                    <Spinner size="40px" />
                  </div> */}
                  {
                    useLiveChatLoader && <div className='w-100 text-center'><Spinner size="40px" /></div>
                  }

                  {!useLiveChatLoader && useMessageData.map((messageData, index) => {
                    // console.log("WEB SOCKET MESSAGE", messageData?.messages_context)
                    let messageJson = {}
                    let replyJson = {}
                    // console.log("messageData =====================", index)
                    try {
                      messageJson = JSON.parse(messageData?.messages_context)
                      replyJson = JSON.parse(messageData?.messages_reply_context)
                      // console.log("637", messageJson?.image?.link)
                      // console.log("755 0", replyJson?.components[0]?.text)
                      // console.log("755 1", replyJson?.components[1]?.text)
                    } catch (error) {
                      // console.log(JSON.parse(messageData)?.messages_context)
                      console.log(error)

                    }

                    const backgroundColor = useProfileDetails?.messages_sender === messageData?.messages_sender ? '#d8ffd4' : '#ffff'
                    const align = useProfileDetails?.messages_sender === messageData?.messages_sender ? 'end' : 'start'
                    // console.log(messageJson?.text?.body)
                    return (

                      <>
                        {messageJson &&
                          <div key={index} className={`message-box  ${useProfileDetails?.messages_sender === messageData?.messages_sender ? 'live_message_box-right' : 'live_message_box-left'}`} style={{
                            display: 'flex',
                            align,
                            backgroundColor,
                            flexDirection: 'column',
                            margin: '5px 10px',
                            padding: '5px',
                            borderRadius: '8px',
                            justifyContent: 'center',
                            alignSelf: align,
                            maxWidth: "fit-content",
                            maxWidth: "550px",
                            minWidth: "150px",
                            wordWrap: "break-word",
                            position: "relative",
                            boxShadow: "0px 1px 1px 1px rgba(0,0,0,0.1)"
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

                            <div className='  ' style={{ whiteSpace: "pre-wrap" }}>

                              {/* text */}
                              {
                                messageJson?.button?.text && <div className="message-info ps-1 pe-3">
                                  {messageJson?.button?.text}
                                </div>
                              }
                              {
                                messageJson?.text?.body && <div className="message-info ps-1 pe-3" dangerouslySetInnerHTML={{ __html: getBoldStr(messageJson?.text?.body) }}>
                                </div>
                              }
                              {/* image */}
                              {
                                messageJson?.image?.link && <div style={{ maxWidth: "300px" }}>
                                  <img src={messageJson?.image?.link} alt="" style={{ width: "100%" }} />

                                  <h5 className='mt-1 ms-1'>
                                    {messageJson?.image?.caption}
                                  </h5>

                                </div>
                              }
                              {/* video */}
                              {
                                messageJson?.video?.link && <div className='' style={{ maxWidth: "300px" }}>
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
                                    <FileText size={30} color='#a9abab' />
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
                              <button className='timestamp-btn position-relative  d-flex justify-content-end align-items-center ms-auto' style={{ gap: "5px", paddingRight: "5px", marginTop: "-10px" }}>
                                <span className='font-small-1 text-secondary'>
                                  {messageData?.messages_timestamp_sent && timeLiveFormatter(messageData?.messages_timestamp_sent)}
                                </span>
                                <span className={useProfileDetails?.messages_sender === messageData?.messages_sender ? '' : 'd-none'}>
                                  {
                                    messageData?.messages_timestamp_read ? <LiaCheckDoubleSolid size={16} color='#53bdeb' /> : messageData?.messages_timestamp_delivered ? <LiaCheckDoubleSolid size={16} color='#7c7c7c' /> : messageData?.messages_timestamp_sent ? <LiaCheckDoubleSolid size={16} color='#7c7c7c' /> : ''
                                  }
                                </span>

                                {
                                  useProfileDetails?.messages_sender === messageData?.messages_sender &&
                                  <div className='timestamp-box position-absolute bg-white rounded-2 p-1' style={{ width: "150px", top: "24px" }} >
                                    <ul className='ps-0 pb-0 mb-0 d-flex flex-column ' style={{ listStyleType: "none", gap: "3px" }}>

                                      <li className='d-flex justify-content-between align-items-center '><p className='m-0 font-small-3 text-secondary'>Sent</p> <p className='m-0 font-small-3 text-secondary'>{timeLiveFormatter(messageData?.messages_timestamp_sent)}</p></li>
                                      <li className='d-flex justify-content-between align-items-center '><p className='m-0 font-small-3 text-secondary'>Delivered</p> <p className='m-0 font-small-3 text-secondary'>{timeLiveFormatter(messageData?.messages_timestamp_delivered)}</p></li>
                                      <li className='d-flex justify-content-between align-items-center '><p className='m-0 font-small-3 text-secondary'>Read</p> <p className='m-0 font-small-3 text-secondary'>{timeLiveFormatter(messageData?.messages_timestamp_read)}</p></li>
                                      <li className='d-flex justify-content-between align-items-center '><p className='m-0 font-small-3 text-secondary'>Failed</p> <p className='m-0 font-small-3 text-secondary'>{timeLiveFormatter(messageData?.messages_timestamp_failed)}</p></li>
                                    </ul>
                                  </div>
                                }
                              </button>

                              {/* reaction */}
                              {/* <div className='position-absolute' style={{ marginTop: "-12px" }}>
                                  <div className=' p-1 border  rounded-circle d-flex justify-content-center align-items-center' style={{ width: "5px", height: "5px", backgroundColor }}>
                                    <h4 className='m-0' style={{ color: "red" }}>👍</h4>
                                  </div>
                                </div> */}
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
              {!imagePreview && useSortBy !== "history" && <div className=' d-flex align-items-center gap-1  px-1 position-sticky bottom-0 bg-white' style={{ padding: "10px" }} >

                <div className='p-1' onClick={() => setToggleMedia(!toggleMedia)}>
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


                {/* <div className='p-1'>
                  <BsEmojiSmile size={20} />
                </div> */}
                <div className='p-1' >
                  <HiOutlineTemplate size={20} onClick={() => setTemplateModal(true)} />
                </div>
                <div className='p-1' onClick={() => setReplyModal(true)}>
                  <MdOutlineQuickreply size={20} />
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
                    setInputMessage(e.target.value)
                  }}
                  style={{ borderRadius: "50px", resize: "none" }}
                />
                {/* {users.map((index) => ( */}
                {
                  useProfileDetails?.messages_reciever && <div className='d-flex align-items-center justify-content-center ' onClick={() => sendMessages('text')} style={{ width: "50px", height: "50px", minWidth: "50px", minHeight: "50px", maxWidth: "50px", maxHeight: "50px", background: '#00a884', borderRadius: "50%", cursor: "pointer" }} >
                    <IoMdSend className='fs-3' style={{ color: 'white' }} />
                  </div>
                }

              </div>}
              {!imagePreview && useSortBy === "history" && <div className=' d-flex align-items-center flex-column text-center gap-1 p-1 position-sticky bottom-0 prime-grey-bg' style={{ padding: "10px" }} >
                <h5 className='mb-0'>You cannot send message to this user as Whatsapp does not allow a business to send messages after 24 hours of the user's last message</h5>
                <div className='cursor-pointer fw-bolder rounded-2 high-green-bg' style={{ padding: "10px 20px" }}>Send Template Message</div>
              </div>}
            </Col>
          }
          {!useProfileDetails?.messages_reciever &&
            <Col className=' px-0 d-flex flex-column justify-content-between ' style={{ height: '100%' }}>
              <StaticPage1 />
            </Col>

          }
          {/* profile details */}
          {dynamicColumnValue === 3 &&
            (search ? (
              <Col md={2} style={{ background: '#fff' }} >
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
                    <input type='text' style={{ border: "0", color: '#8b98a0' }} placeholder='Search...' />
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

        </Row>
      </Container >
      {/* modals ------------------------------------------------------------------------------------------------------- */}
      {/* quick reply modal */}
      <Modal
        show={useReplyModal}
        onHide={() => setReplyModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header >
          <div className='d-flex align-items-center '>

            <h5 className='mb-0'>
              Quick Replies
            </h5>
            <Link to="/merchant/whatsapp/quick-replays/" >
              <span><TbExternalLink size={19} /></span>
            </Link>
          </div>
        </Modal.Header>
        <Modal.Body >
          <Row className='border-top' style={{ minHeight: "300px" }}>
            <Col xs={5}>
              <Input type='text' className="mt-1 mb-1" placeholder='search' onChange={(e) => setQuickReplySearch(e.target.value)} />
              <div className='reply-container hideScroll' style={{ maxHeight: "300px", overflow: "auto" }}>
                {useQuickReplyList.map((item, index) => {
                  return <div key={index} className='border-bottoms' style={{ cursor: "pointer" }}
                    onClick={() => { setSelectedDescription(item); setInputMessage(item.quick_reply_message) }}>
                    <div className='p-1 fw-bolder '>
                      {item.quick_reply_title}
                    </div>
                  </div>
                })}
                {
                  useQuickReplyList?.length <= 0 && <h5 className='text-center'>No Quick Replies</h5>
                }
              </div>
            </Col>
            <Col xs={7}>

              {selectedDescription ? <div className='ms-1 mt-1'>
                <div className="fw-bolder">{selectedDescription.quick_reply_title}</div>
                <div className='mt-2'>{selectedDescription.quick_reply_message}</div>
              </div> : <div className='d-flex align-items-center justify-content-center h-100'>
                <h4 className='fw-bolder text-uppercase fs-6 '>Please select a reply</h4>
              </div>}
            </Col>

          </Row>
        </Modal.Body>
        <Modal.Footer>

          <Button className='btn btn-primary ' onClick={() => { setInputMessage(""); setReplyModal(false) }}>Cancel</Button>
          {selectedDescription.quick_reply_message && <>
            <Button
              className='btn btn-primary '
              style={{ width: "auto" }}
              onClick={() => {
                // setNewMessage(selectedDescription.quick_reply_message)
                setInputMessage(selectedDescription.quick_reply_message)
                setReplyModal(false)
              }}>Copy to Editor</Button> <Button
                className='btn btn-primary'
                onClick={() => {
                  sendMessages('text')
                  setReplyModal(false)
                }}>Send</Button>
          </>}

        </Modal.Footer>
      </Modal>

      {/* template  modal */}
      <Modal
        show={useTemplateModal}
        onHide={() => setTemplateModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header >
          <div className='d-flex align-items-center ' style={{ padding: "8px 0px" }}>

            <h4 className='mb-0 ' style={{ marginRight: "5px" }}>
              Templates
            </h4>
            <Link to="/merchant/whatsapp/quick-replays/" >
              <span><TbExternalLink size={19} /></span>
            </Link>
          </div>
        </Modal.Header>
        <Modal.Body className='py-0 border-top'>
          <div>
            <Select
              className=''
              style={{
                control: (provided) => ({
                  ...provided,
                  minWidth: '300px'
                })
              }}
              defaultValue={chatsTagList[0]}
              options={chatsTagList}
              closeMenuOnSelect={true}
            />
          </div>
          <Row className='' style={{ minHeight: "300px" }}>
            <Col xs={5}>

            </Col>
            <Col xs={7}>

            </Col>

          </Row>
        </Modal.Body>
        <Modal.Footer>

          <Button className='btn btn-primary ' onClick={() => { setTemplateModal(false) }}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}
export default LiveChat