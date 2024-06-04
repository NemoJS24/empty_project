/* eslint-disable multiline-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { Edit, File, FileText, Headphones, Image, LogIn, Plus, Users, Video } from 'react-feather'
import { BsBroadcast, BsPinAngle } from 'react-icons/bs'
import { FaEllipsisV, FaInstagram, FaSearch } from "react-icons/fa"
import { HiOutlineDotsVertical, HiOutlineTemplate } from "react-icons/hi"
import { IoMdSearch, IoMdSend } from "react-icons/io"
import { IoWarningOutline, IoExitOutline } from "react-icons/io5"
import { LiaCheckDoubleSolid, LiaTagSolid } from "react-icons/lia"
import { LuEye, LuSettings } from "react-icons/lu"
import { TiPlus } from "react-icons/ti"
import { MdOutlineLibraryAdd, MdOutlineQuickreply, MdOutlineStickyNote2 } from "react-icons/md"
import { RiCustomerService2Line, RiRobot2Line } from "react-icons/ri"
import { RxCross2, RxExit } from "react-icons/rx"
import { TbExternalLink } from "react-icons/tb"
import { Link, useParams } from 'react-router-dom'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import {
  Button,
  Card,
  CardBody,
  Collapse,
  Container,
  Input, InputGroup, InputGroupText, Tooltip
} from 'reactstrap'

import { SocketBaseURL, deleteReq, getReq, postReq } from '../../../assets/auth/jwtService'
import Spinner from '../../Components/DataTable/Spinner'
import FrontBaseLoader from '../../Components/Loader/Loader'
import { ActiveTabList, RenderLiveTemplateUI, RenderTemplateUI, chatsTagList, getBoldStr, getRemainingTime, timeDateLiveFormatter, timeLiveFormatter } from '../SmallFunction'
import WA_BG_2 from '../imgs/WA_BG_2.png'
import xircls_LOGO from '../imgs/xircls_LOGO.jpg'
import StaticPage1 from './StaticPage'
const LiveChat = () => {
  const {defaultPage} = useParams()
  const [useLiveContactLoader, setLiveContactLoader] = useState(true)
  const [useLiveChatLoader, setLiveChatLoader] = useState(true)
  const [useTemplateLoader, setTemplateLoader] = useState(true)
  const [useIsLoading, setIsLoading] = useState(false)
  const [useMessageData, setMessageData] = useState([])
  const [useProfileDetails, setProfileDetails] = useState("")
  const [useSortBy, setSortBy] = useState("live")
  const [useQuickReplySearch, setQuickReplySearch] = useState("")
  const [useQuickReplyList, setQuickReplyList] = useState([])
  const [useRemainingTime, setRemainingTime] = useState('')
  const [useNewContact, setNewContact] = useState({
    contact:"",
    phone_code:""
  })

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
  const [selectedDescription, setSelectedDescription] = useState('')
  const [useTemplatesList, setTemplatesList] = useState([])
  const [useActiveTemplatesList, setActiveTemplatesList] = useState([])
  const [useTagsList, setTagsList] = useState([])
  const [useTagsCustomer, setTagsCustomer] = useState([])
  const [useTagsSelect, setTagsSelect] = useState([])
  const [useNotesList, setNotesList] = useState("")
const [useDefaultPage, setDefaultPage] = useState("SUPPORT")

  // modals
  const [useReplyModal, setReplyModal] = useState(false)
  const [useTemplateModal, setTemplateModal] = useState(false)
  const [useNewContactModal, setNewContactModal] = useState(false)

  const [ws, setWs] = useState('')
  const [useContactWs, setContactWs] = useState('')
  const [useTagsOpen, setTagsOpen] = useState(false)
  const [useNotesOpen, setNotesOpen] = useState(false)

  const getTagsList = () => {
    getReq("tags")
      .then((res) => {
        console.log(res.data, "tags res")
        const data = res.data.map((elm) => {
          return {
            label: elm.tag,
            value: elm.id // Note: typically use `value` instead of `key` for react-select
          }
        })
        setTagsList(data)
      })
      .catch((err) => console.log(err))
  }

  const getTagsCustomerFun = (ContactData) => {
    getReq("customer_tags_notes", `?phone_code=${ContactData?.messages_reciever?.slice(0, 2)}&contact=${ContactData?.messages_reciever?.slice(-10)}`)
      .then((res) => {
        console.log(res, "tags res")
        setTagsCustomer(res?.data?.tags)
        setNotesList(res?.data?.notes)

      })
      .catch((err) => {
        setTagsCustomer([])
        console.log(err)
      })
  }

  useEffect(() => {
    getTagsList()
  }, [])

  // tagfs
  const delAssignTagsFun = (id, useProfileDetails) => {
    deleteReq("customer_tags_notes", `?tag_id=${id}&phone_code=${useProfileDetails?.messages_reciever?.slice(0, 2)}&contact=${useProfileDetails?.messages_reciever?.slice(-10)}`)
      .then((resp) => {
        getTagsCustomerFun(useProfileDetails)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const assignTagsFun = () => {
    const formData = new FormData()
    formData.append("tag_ids", useTagsSelect)
    formData.append("phone_code", useProfileDetails?.messages_reciever?.slice(0, 2))
    formData.append("contact", useProfileDetails?.messages_reciever?.slice(-10))
    postReq("customer_tags_notes", formData)
      .then(res => {
        console.log("res", res.data.tags)
        getTagsCustomerFun(useProfileDetails)
        setTagsOpen(false)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleCustomTag = (inputValue, useProfileDetails) => {
    const formData = new FormData()
    formData.append("tag", inputValue)
    formData.append("phone_code", useProfileDetails?.messages_reciever?.slice(0, 2))
    formData.append("contact", useProfileDetails?.messages_reciever?.slice(-10))
    postReq("customer_tags_notes", formData)
    .then(res => {
      console.log("res", res.data.tags)
      getTagsCustomerFun(useProfileDetails)
      setTagsOpen(false)
    })
    .catch(error => {
      console.error('Error:', error)
    })
  }

  // niotes

  const saveNotesFun = () => {
    const formData = new FormData()
    formData.append("notes", useNotesList)
    formData.append("phone_code", useProfileDetails?.messages_reciever?.slice(0, 2))
    formData.append("contact", useProfileDetails?.messages_reciever?.slice(-10))
    postReq("customer_tags_notes", formData)
      .then(res => {
        console.log("res", res.data.tags)
        getTagsCustomerFun(useProfileDetails)
        setNotesOpen(false)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  const delNoteFun = (useProfileDetails) => {
    deleteReq("customer_tags_notes", `?phone_code=${useProfileDetails?.messages_reciever?.slice(0, 2)}&contact=${useProfileDetails?.messages_reciever?.slice(-10)}`)
      .then((resp) => {
        getTagsCustomerFun(useProfileDetails)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // chat status
  const contactStatusFun = (e) => {
    const formData = new FormData()
    formData.append("messages_unique_id", useProfileDetails?.messages_unique_id)
    formData.append("chat_status", e.value.toLowerCase())
    console.log(e)
    postReq("chat_status", formData)
      .then(res => {
        console.log("res", res.data.tags)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
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
    form_data.append("page", useContactPage)
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
    form_data.append("page", useContactPage)
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
    form_data.append("page", useContactPage)
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
    const oldusers = [...users]

    const updatedUsers = oldusers.map((elm) => {
      if (elm?.messages_reciever === useProfileDetails?.messages_reciever) {
        return {
          ...elm,
          messages_count: 0
        }
      } else {
        return {
          ...elm
        }
      }
    })
    setUsers(updatedUsers)

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

    const uptData = {
      ...JSON.parse(JSON.parse(newData).data),
      messages_reciever: JSON.parse(JSON.parse(newData).data).messages_receiver
    }
    // console.log("ProfileDetails", ProfileDetails)
    console.log("uptData", uptData)
    // console.log("useProfileDetails", useProfileDetails)
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

// tooltip
  const TooltipButton = ({ id, tooltipText, children, position = 'right' }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)

    const toggleTooltip = () => {
      setTooltipOpen(!tooltipOpen)
    }


    // send template
    return (
      <div className='rounded-circle' id={id ?? tooltipText} >
        {children}
        <Tooltip
          placement={position}
          isOpen={tooltipOpen}
          target={id ?? tooltipText}
          toggle={toggleTooltip}
        >
          {tooltipText}
        </Tooltip>
      </div>
    )
  }

    // templates
    const getTemplatesList = (currentPage = 0, currentEntry = 10, searchValue = "") => {
      const formData = new FormData()
  
      formData.append("page", currentPage + 1)
      formData.append("size", currentEntry)
      formData.append("searchValue", searchValue)
      setTemplateLoader(true)
      postReq("getTemplates", formData)
        .then(data => {
          setTemplatesList(data.data.data)
          setActiveTemplatesList(data.data.active_id)
        })
        .catch(error => {
          console.error('Error:', error)
          // toast.error("Please complete the onboarding process to create a template")
        })
        .finally(() => {
          setTemplateLoader(false)
        })
    }

    const sendTemplate = (ContactData, templateID) => {
      const formData = new FormData()
      formData.append("contact", ContactData?.messages_reciever?.slice(-10))
      formData.append("phone_code", ContactData?.messages_reciever?.slice(0, 2))
      formData.append("template", templateID)
  
      setTemplateLoader(true)
      postReq("contact_to_send_template", formData)
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.error('Error:', error)
        })
        .finally(() => {
          setTemplateLoader(false)
        })
    }

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

      <Container className=' fs-hel-lig d-flex justify-content-center  align-items-center ' style={{ width: "100vw", height: '100vh' }}>

        <div className='position-fixed' style={{ zIndex: -1 }}>
          <div className='' style={{ background: "#0fa885", width: "100vw", height: "20vh" }}>
          </div>
          <div className='' style={{ background: "#e0e0de", width: "100vw", height: "80vh" }}>
          </div>
        </div>

        <div className='d-flex  bg-white ' style={{ width: "95vw", height: "95vh", zIndex: 99 }}>
          <div className='d-flex justify-content-center match-height w-100' >

            {/* left menu */}
            <div className=' whats-bg-grey border-end d-flex flex-column justify-content-between py-2 pt-1' style={{ minWidth: "60px" }}>
              <div className='d-flex flex-column justify-content-center align-items-center ' style={{ gap: "5px" }}>

                <TooltipButton tooltipText="Exit">
                  <Link to="/merchant/whatsapp/" className="icon_color" style={{ transform: "scale(-1)" }}  >
                    <IoExitOutline />
                  </Link>
                </TooltipButton>

                <TooltipButton tooltipText="Support" >
                  <div className="icon_color" onClick={() => { filterAllContacts("live"); setDefaultPage("SUPPORT") }}>
                    <RiCustomerService2Line />
                  </div>
                </TooltipButton>
                
                <TooltipButton tooltipText="Lapsed" >
                  <div className="icon_color" onClick={() => { filterAllContacts("lapsed"); setDefaultPage("LAPSED") }} >
                    <IoWarningOutline />
                  </div>
                </TooltipButton>
                <TooltipButton tooltipText="Broadcast">
                  <div className="icon_color">
                    <BsBroadcast />
                  </div>
                </TooltipButton>
                <TooltipButton tooltipText="Bot">
                  <div className="icon_color">
                    <RiRobot2Line />
                  </div>
                </TooltipButton>
              </div>
              <div className='d-flex flex-column align-items-center justify-content-center border-top pt-1' style={{ gap: "10px" }}>
                {/* <div className="icon_color">
                  <RxExit />
                </div> */}
                <TooltipButton tooltipText="Settings">
                  <div className="icon_color">
                    <LuSettings />
                  </div>
                </TooltipButton>
                <TooltipButton tooltipText="Profile">
                  <div className='  '>
                    <img src={xircls_LOGO} className='' width={35} alt="" style={{ mixBlendMode: "darken" }} />
                  </div>
                </TooltipButton>
              </div>
            </div>

            {/* Sidebar contacts*/}
            <div sm='4' className=' m-0 chatsContacts bg-white border-end '  >
              <div>

                <div className='d-flex align-items-center justify-content-between  whats-bg-grey px-1' style={{ height: '60px' }}>
                  {/* <div className='d-flex  align-items-center '>
                    <img src={xircls_LOGO} className='' width={40} alt="" style={{ mixBlendMode: "darken" }} />
                  </div> */}
                  <h3 className='mb-0 fw-bolder'>
                    Chats
                  </h3>

                  <div className='d-flex justify-content-center  align-items-center  gap-' style={{ gap: "5px" }}>
                    <TooltipButton position='top' id="newContact" tooltipText="New Contact">
                      <div className="icon_color">
                        <MdOutlineLibraryAdd onClick={() => { setNewContactModal(true) }} />
                      </div>
                    </TooltipButton>

                    <TooltipButton position='top' tooltipText="Filter">
                      <div className="icon_color">
                        <HiOutlineDotsVertical />
                      </div>
                    </TooltipButton>

                  </div>
                </div>
                <div class="live-group-search px-1" style={{ marginTop: "7px" }}>
                  <div class="group">
                    <IoMdSearch className='icon' size={20} />
                    <input className="input" type="search" onChange={(e) => setSearchContact(e.target.value)} placeholder="Search" />
                  </div>

                </div>
                <div className='d-flex gap-1 px-1 flex-wrap ' style={{ marginTop: "7px" }}>
                  {
                   useDefaultPage === "SUPPORT" && ActiveTabList.map((elm, index) => (
                      <div className={`rounded-5 d-flex justify-content-center align-items-center cursor-pointer position-relative ${elm?.id === useSortBy ? 'prime-green' : "prime-grey-bg whats-text-green-100"} `}
                        onClick={() => { filterAllContacts(elm.id); setSortBy(elm.id); setContactPage(1) }}>
                        {
                          index === 1 &&
                          <div className='position-absolute top-0 end-0 d-flex justify-content-center  align-items-center rounded-circle high-green-bg' style={{ width: "20px", height: "20px", marginTop: "-7px", marginRight: "-5px" }}>
                            <p className='  font-small-3 ' style={{ margin: "2px 0 0 0" }}>5</p>
                          </div>
                        }
                        <p className='m-0  ' style={{ padding: "6px 12px", fontSize: "13px" }}>{elm?.title} </p>
                      </div>
                    ))
                  }

                </div>
                <hr className='mb-0 p-0' style={{ marginTop: "7px" }} />
              </div>

              {/*contacts list */}
              <div className=' contactsList' style={{ maxHeight: "calc(-197px + 100vh)", overflowY: "scroll" }}>

                <div div className='mb-2 ' id="style-1">
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
                        className={` w-100 whats-bg-grey-hover ${ContactData.messages_reciever === useProfileDetails.messages_reciever ? "prime-grey-bg" : ''}`}

                        onClick={() => {
                          // setCurrentTab(ContactData)
                          webSocketConnection(index)
                          setProfileDetails(ContactData)
                          getTagsCustomerFun(ContactData)
                          // console.log("ContactData", ContactData)

                        }}
                      >
                        <div className="cursor-pointer  d-flex " style={{}} >
                          <div md="2" style={{ width: "73px", padding: "0 15px 0 13px" }} className=' d-flex align-items-center justify-content-center flex-column '>
                            <div className="rounded-circle d-flex align-items-center justify-content-center " style={{ width: '50px', height: '50px' }}>
                              <svg viewBox="0 0 212 212" height="50" width="50" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 212 212"><title>default-user</title><path fill="#DFE5E7" class="background" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g><path fill="#FFFFFF" class="primary" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" class="primary" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path></g></svg>
                            </div>
                          </div>
                          <div md="10" className=' border-bottom d-flex flex-column  justify-content-center ' style={{ minHeight: "72px", width: "100%", padding: "0 15px 0 0px" }}>
                            <div className='d-flex justify-content-between  '>
                              <h5 className={`mb-0 p-0  fs-hel-reg  ${ContactData?.messages_count > 0 && "fw-bolder"}`}>{ContactData?.messages_display_name ?? ContactData?.messages_reciever}</h5>
                              <div className={`font-small-1  ${ContactData?.messages_count > 0 ? "high-green-text" : ""}`}>

                                {ContactData?.messages_last_message_timestamp_sent && timeDateLiveFormatter(ContactData?.messages_last_message_timestamp_sent)}
                              </div>
                            </div>

                            <div className='position-relative ' style={{ color: "#404e58" }}>
                              <p className={`m-0 p-0 font-small-3 ${ContactData?.messages_count > 0 && "fw-bolder"}`}>{lastMsgData?.text?.body?.slice(0, 25)} {lastMsgData?.text?.body?.length > 25 && <span>...</span>}</p>
                              <p className={`m-0 p-0 ${ContactData?.messages_count > 0 && "fw-bolder"}`}>{lastMsgData?.name?.slice(0, 25)} {lastMsgData?.name?.length > 25 && <span>...</span>}</p>

                              <p className='m-0 p-0'>{lastMsgData?.type === "image" && <Image size={15} />} </p>
                              <p className='m-0 p-0'>{lastMsgData?.type === "video" && <Video size={15} />} </p>
                              <p className='m-0 p-0'>{lastMsgData?.type === "audio" && <Headphones size={15} />} </p>
                              <p className='m-0 p-0'>{lastMsgData?.type === "document" && <File size={15} />} </p>

                              {/* counter */}
                              {
                                (ContactData?.messages_count > 0) &&
                                <div className=' rounded-5 d-flex justify-content-center align-items-center position-absolute end-0 top-0 high-green-bg' style={{ width: "20px", height: "20px" }}>
                                  <p className='  font-small-3 ' style={{ margin: "1px 0 0 0" }}>{ContactData?.messages_count}</p>
                                </div>
                              }
                            </div>

                          </div>

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
            </div>

            {/* Main Chat Container */}
            {useProfileDetails?.messages_reciever &&
              <div className=' px-0 d-flex flex-column justify-content-between ' style={{ backgroundImage: `url(${WA_BG_2})`, height: '100%', width: "100%", backgroundSize: "370px" }}>
                {/* Header */}
                <div className=" d-flex justify-content-between align-items-center prime-grey-bg" style={{ minHeight: "60px" }}>
                  <div className="d-flex align-items-center ps-1 cursor-pointer w-100 " onClick={() => { setDynamicColumnValue(3) }}>
                    <div className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center select-grey text-secondary" style={{ width: '40px', height: '40px', color: "#b9b6b6" }}>
                      {/* <p className='fs-3 fw-bolder text-white mb-0'>{useProfileDetails?.firstName[0]}</p> */}
                      <p className='fs-3 fw-bolder text-white mb-0'>{useProfileDetails?.messages_display_name?.slice(0, 1)}</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center gap-1 ms-1'>
                      <div className=''>

                        <h5 className='mb-0 p-0 fw-bolder'>{useProfileDetails?.messages_display_name}</h5>
                        <h6 className='mb-0 p-0 fw-bold'>{useProfileDetails?.messages_reciever}</h6>
                      </div>
                      {
                        useProfileDetails?.contactType && <h6 className='text-primary font-small-3 mb-0'> - {useProfileDetails?.contactType}</h6>
                      }

                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className='icon_color'>
                      <BsPinAngle size={18} />
                    </div>
                    <div>
                      <div style={{ width: "90px" }} className={`rounded-5 d-flex justify-content-center align-items-center cursor-pointer position-relative ${useRemainingTime?.status <= 1
                        ? 'prime-red'
                        : useRemainingTime?.status === 2
                          ? 'prime-orange'
                          : 'prime-green'
                        }`}>
                        {/* <p className='m-0 font-small-3 fw-bolder' style={{ padding: "10px 15px" }}>{timeLiveFormatter(useProfileDetails?.messages_servicing_window)}</p> */}
                        <TooltipButton position='bottom' id="chatExpire" tooltipText={`${useRemainingTime?.status === 0 ? 'Chat has Expired. Now you can send templates' : `Chat expires in ${useRemainingTime?.hour } hrs ${useRemainingTime?.minutes } mins. Once expired, WhatsApp allows only template messages to be sent.`}`}>
                         
                         {
                          useRemainingTime?.status !== 0 && <p className='m-0 font-small-3 fw-bolder' style={{ padding: "10px 15px" }}>{useRemainingTime ? `${useRemainingTime?.hour } : ${useRemainingTime?.minutes }` : '--'}</p>
                         }
                          {
                          useRemainingTime?.status === 0 && <p className='m-0 font-small-3 fw-bolder' style={{ padding: "10px 15px" }}>Expired</p>
                         }

                        </TooltipButton>
                      </div>
                    </div>
                    <div style={{ minWidth: "120px" }}>

                      <Select
                        className=''
                        defaultValue={chatsTagList[0]}
                        options={chatsTagList}
                        closeMenuOnSelect={true}
                        onChange={contactStatusFun}
                      />
                    </div>
                    <div className="icon_color">

                      <IoMdSearch onClick={() => {
                        setSearch(true)
                        setDynamicColumnValue(3)
                      }} />
                    </div>
                    <div className='position-relative pe-2' >
                      <div onClick={() => setDropdownOpen(!dropdownOpen)} className='icon_color '>
                        <HiOutlineDotsVertical />
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
                      useLiveChatLoader && <div className='w-100 h-100 d-flex justify-content-center align-items-center '><Spinner size="40px" /></div>
                    }

                    {!useLiveChatLoader && useMessageData.map((messageData, index) => {
                      // console.log("WEB SOCKET MESSAGE", messageData?.messages_context)
                      let messageJson = {}
                      let replyJson = {}
                      // console.log("messageData =====================", index)
                      try {
                        messageJson = JSON.parse(messageData?.messages_context)
                        replyJson = JSON.parse(messageData?.messages_reply_context)

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
                                  messageJson?.type === "unsupported" && <div className="message-info ps-1 pe-3" >
                                    Message type is currently not supported.
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
                {!imagePreview && useRemainingTime?.status !== 0 && <div className=' d-flex align-items-center gap-1  px-1 position-sticky bottom-0 whats-bg-grey' style={{ padding: "10px" }} >
                  <TooltipButton tooltipText="Media" position='top'>
                    <div className='icon_color' onClick={() => setToggleMedia(!toggleMedia)}>
                      <Plus style={{
                        transform: `rotate(${toggleMedia ? "45deg" : "0deg"})`,
                        transition: "transform 0.2s ease-in-out"
                      }} />
                    </div>
                  </TooltipButton>
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
                  <TooltipButton tooltipText="Templates" position='top'>
                    <div className='icon_color' >
                      <HiOutlineTemplate onClick={() => { setTemplateModal(true); getTemplatesList() }} />
                    </div>
                  </TooltipButton>
                  <TooltipButton id="quickReply" tooltipText="Quick Reply" position='top'>
                    <div className='icon_color' onClick={() => setReplyModal(true)}>
                      <MdOutlineQuickreply />
                    </div>
                  </TooltipButton>
                  <TooltipButton id="pvtNote" tooltipText="Private Note" position='top'>
                    <div className='icon_color' onClick={() => setReplyModal(true)}>
                      <MdOutlineStickyNote2 />
                    </div>
                  </TooltipButton>

                  <textarea
                    type="text"
                    className="form-control border rounded messageInput"
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

                  />
                  {/* {users.map((index) => ( */}
                  {/* {
                    useProfileDetails?.messages_reciever && <div className='d-flex align-items-center justify-content-center ' onClick={() => sendMessages('text')} style={{ width: "50px", height: "50px", minWidth: "50px", minHeight: "50px", maxWidth: "50px", maxHeight: "50px", background: '#00a884', borderRadius: "50%", cursor: "pointer" }} >
                      <IoMdSend  />
                    </div>
                  } */}
                  {
                    useProfileDetails?.messages_reciever && <div className='icon_color' onClick={() => sendMessages('text')}>
                      <IoMdSend />
                    </div>
                  }

                </div>}
                {!imagePreview && useRemainingTime?.status === 0 && <div className=' d-flex align-items-center flex-column text-center gap-1 p-1 position-sticky bottom-0 prime-grey-bg' style={{ padding: "10px" }} >
                  <h5 className='mb-0'>You cannot send message to this user as Whatsapp does not allow a business to send messages after 24 hours of the user's last message</h5>
                  <div className='cursor-pointer fw-bolder rounded-2 high-green-bg' style={{ padding: "10px 20px" }} onClick={() => { setTemplateModal(true); getTemplatesList() }}>Send Template Message</div>
                </div>}
              </div>
            }
            {!useProfileDetails?.messages_reciever &&
              <Col className=' px-0 d-flex flex-column justify-content-between ' style={{ height: '100%' }}>
                <StaticPage1 />
              </Col>

            }
            {/* profile details */}
            {dynamicColumnValue === 3 &&
              (search ? (
                <Col sm={2} className='' style={{ background: '#fff' }} >
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
                <Col className='bg-white chatsContacts '  >

                  <div className='d-flex align-items-center gap-1 fs-4 whats-bg-grey' style={{ height: "60px" }}>
                    <RxCross2 onClick={() => setDynamicColumnValue(0)} className='ms-1' />
                    <p className='mb-0'>Contact info</p>
                  </div>

                  <div className=' overflow-y-auto hideScroll' style={{ height: "calc(100vh - 100px)" }}>
                    <div className='d-flex align-items-center gap-1 p-1 mt-1'>
                      <div className="rounded-circle d-flex align-items-center justify-content-center " style={{ width: '50px', height: '50px' }}>
                        <svg viewBox="0 0 212 212" height="50" width="50" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 212 212"><title>default-user</title><path fill="#DFE5E7" class="background" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g><path fill="#FFFFFF" class="primary" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" class="primary" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path></g></svg>
                      </div>
                      <div className=''>
                        <h5 className='p-0 fw-bolder' style={{ marginBottom: "8px" }}>{useProfileDetails?.messages_display_name}</h5>
                        <h6 className='mb-0 p-0 fw-bolder'>{useProfileDetails?.messages_reciever}</h6>
                      </div>
                    </div>
                    <hr />

                    <div className='mt-1 p-1 ' >
                      <div className='d-flex justify-content-between align-items-center '>
                        <p className='fs-4 mb-0'>Tags <span className='' ><LiaTagSolid style={{ transform: "scale(-1) rotate(90deg)", marginLeft: "2px" }} /></span> </p>
                        <button onClick={() => setTagsOpen(!useTagsOpen)} className=' border rounded-2 whats-bg-grey' style={{ padding: "5px 10px" }}><TiPlus color="#3b4a54" size={15} /></button>
                      </div>
                      <div className='d-flex gap-1 px-1 flex-wrap ' style={{ marginTop: "7px" }}>
                        {
                          useTagsCustomer.map((elm, index) => (
                            <div className={`rounded-2 d-flex justify-content-center align-items-center  position-relative prime-grey-bg whats-text-green-100`}>
                              <p className='m-0  ' style={{ padding: "6px 12px", fontSize: "13px" }}>{elm?.tag} </p>
                              <div className=' position-absolute top-0 end-0 prime-grey-bg rounded-5 cursor-pointer ' onClick={() => delAssignTagsFun(elm?.id, useProfileDetails)} style={{ marginTop: "-5px", marginRight: "-5px" }}><RxCross2 size={12} /></div>
                            </div>
                          ))
                        }
                        {
                          useTagsCustomer.length <= 0 && <>No tags</>
                        }

                      </div>
                      <div className=''>

                        <Collapse isOpen={useTagsOpen} >
                          <CardBody>
                            <CardBody className='border p-1 mt-1'>
                              <CreatableSelect
                                className=''
                                // defaultValue={useTagsList[0]}
                                options={useTagsList}
                                closeMenuOnSelect={true}
                                onCreateOption={(input) => handleCustomTag(input, useProfileDetails)}
                                onChange={(e) => setTagsSelect(e.value)}
                              />
                              <div className='d-flex justify-content-end gap-1 mt-2'>
                                <div className='text-secondary cursor-pointer' style={{ padding: "2px " }} onClick={() => setTagsOpen(false)}> Cancel</div>
                                <button className='px-1 border rounded-2  ' onClick={assignTagsFun} style={{ padding: "2px 10px" }}> Save</button>
                              </div>
                            </CardBody>
                          </CardBody>
                        </Collapse>

                      </div>
                    </div>

                    <div className='mt-1 p-1 ' >
                      <div className='d-flex justify-content-between align-items-center '>
                        <p className='fs-4 mb-0'>Note <span className='' ><LiaTagSolid style={{ transform: "scale(-1) rotate(90deg)", marginLeft: "2px" }} /></span> </p>
                        <button onClick={() => setNotesOpen(!useNotesOpen)} className=' border rounded-2 whats-bg-grey' style={{ padding: "5px 10px" }}>
                        { useNotesList ? <Edit color="#3b4a54" size={15} /> : <TiPlus color="#3b4a54" size={15} />
}
                          </button>

                      </div>

                      <div className='d-flex flex-column   px-1' style={{ marginTop: "7px", gap: "5px" }}>
                        { useNotesList && !useNotesOpen &&
                            <div className={`rounded-2  cursor-pointer  prime-grey-bg whats-text-green-100  position-relative`}>
                              <p className='m-0  ' style={{ padding: "6px 12px", fontSize: "13px", wordWrap:"break-word" }}>{useNotesList}</p>
                              <div className=' position-absolute top-0 end-0 prime-grey-bg rounded-5 cursor-pointer ' onClick={() => delNoteFun(useProfileDetails)}  style={{ marginTop: "-5px", marginRight: "-5px" }}><RxCross2 size={12} /></div>
                            </div>
                        }

                      </div>
                      <div className=''>

                        <Collapse isOpen={useNotesOpen} >
                          <CardBody>
                            <CardBody className=' p-1 '>

                              <textarea type="text" value={useNotesList} onChange={(e) => setNotesList(e.target.value)} class="form-control" placeholder="notes..." />
                              <div className='d-flex justify-content-end gap-1 mt-2'>
                                <div className='text-secondary cursor-pointer' style={{ padding: "2px " }} onClick={(e) => { setNotesOpen(false); setNotesList('') }}> Cancel</div>
                                <button className='px-1 border rounded-2  ' style={{ padding: "2px 10px" }} onClick={saveNotesFun}> Save</button>
                              </div>
                            </CardBody>
                          </CardBody>
                        </Collapse>

                      </div>
                    </div>


                  </div>
                </Col>))
            }

          </div>

        </div>
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
            <Link to="/merchant/whatsapp/quick-replys/" >
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
      >
        <Modal.Header >
          <div className='d-flex align-items-center ' style={{ padding: "8px 0px" }}>

            <h4 className='mb-0 ' style={{ marginRight: "5px" }}>
              Templates
            </h4>
            {/* <Link to="/merchant/whatsapp/quick-replays/" >
              <span><TbExternalLink size={19} /></span>
            </Link> */}
          </div>
        </Modal.Header>
        <Modal.Body className='py-1 border-top'>

          {/* templates list */}
          <Row className='match-height align-items-center hideScroll' style={{ height: "500px", overflow: "scroll" }}>
            {
              useTemplateLoader && <div className='h-100 w-100 d-flex justify-content-center  align-items-center '><Spinner size="40px" /></div>
            }
            {
              !useTemplatesList && <div className='fs-4 text-center mt-5 fw-bolder'>No Templates Available</div>
            }
            {
              useTemplatesList && useTemplatesList.map((SingleTemplate) => {
                const isActive = useActiveTemplatesList?.includes(SingleTemplate?.id)
                if (!isActive || SingleTemplate.status !== "APPROVED") {
                  return null
                }
                return (

                  <Col md="6" className='d-flex justify-content-center '  >
                    <Card className="border p-1 rounded-2   position-relative  " style={{ background: "#fff", gap: "5px" }} >
                      {
                        // renderTemp(SingleTemplate)
                      }
                      <RenderTemplateUI SingleTemplate={SingleTemplate} />

                      <div className=''>
                        {
                          SingleTemplate.status === "APPROVED" && isActive && <div className='d-flex flex-column w-100'>
                            <div className='d-flex gap-1 align-items-center'>
                              <p className='m-0 p-0'>{SingleTemplate.name}</p>
                            </div>
                          </div>
                        }

                        <div className='d-flex justify-content-end '>
                          <button className='btn btn-primary' onClick={() => sendTemplate(useProfileDetails, SingleTemplate?.id)}>Send</button>
                        </div>
                      </div>

                    </Card>
                  </Col>
                )

              })
            }

          </Row>
        </Modal.Body>
        <Modal.Footer>

          <Button className='btn btn-primary ' onClick={() => { setTemplateModal(false) }}>Cancel</Button>
        </Modal.Footer>
      </Modal>


      {/* new Contacts  modal */}
      <Modal
        show={useNewContactModal}
        onHide={() => setNewContactModal(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header >
          <div className='d-flex align-items-center ' style={{ padding: "8px 0px" }}>

            <h4 className='mb-0 ' style={{ marginRight: "5px" }}>
              New Contact
            </h4>
          </div>
        </Modal.Header>
        <Modal.Body className='py-2 border-top' >
          <div className=''>
            <h5 className="">Country</h5>
            <input
              type="number"
              className="form-control "
              placeholder='Code'
            // onChange={() => {}}
            />

          </div>
          <div className='mt-1'>
            <h5 className="">Contact Number</h5>
            <input
              type="number"
              className="form-control "
              placeholder='Number'
            // onChange={() => {}}
            />

          </div>

        </Modal.Body>
        <Modal.Footer>

          <Button className='btn btn-primary ' onClick={() => { setNewContactModal(false) }}>Cancel</Button>
          <Button className='btn btn-primary ' onClick={() => { setNewContactModal(false); setTemplateModal(true) }}>Start</Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}
export default LiveChat