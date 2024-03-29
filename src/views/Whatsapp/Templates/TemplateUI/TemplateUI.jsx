/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Activity, CheckCircle, CornerDownLeft, Edit, ExternalLink, FileText, Home, List, Phone, RefreshCcw, Send, Star } from 'react-feather'
import toast from 'react-hot-toast'
import { BsFire } from "react-icons/bs"
import { CiCloud, CiMenuKebab } from "react-icons/ci"
import { Link, useNavigate } from 'react-router-dom'
import {
   Button,
   Card, CardBody, Col, Container,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
   Row
} from 'reactstrap'
import { postReq } from '../../../../assets/auth/jwtService'
import FrontBaseLoader from '../../../Components/Loader/Loader'
import SendContactTable from '../../Tables/SendContactTable'
import wp_back from '../imgs/wp_back.png'
import '../whatsapp.scss'
import AllTempTable from './pages/AllTempTable'
import { getBoldStr } from '../../SmallFunction'


export default function TemplateUI() {

   const nagivate = useNavigate()
   const [useLoader, setLoader] = useState(true)
   const [MainMenu, setMainMenu] = useState(1)
   const [SubMenu, setSubMenu] = useState(1)
   const [AllTemplatesData, setAllTemplatesData] = useState([])
   const [ActiveTemplates, setActiveTemplates] = useState([])
   const [modal, setModal] = useState(false)
   const [modal2, setModal2] = useState(false)
   const [CurrentTemplate, setCurrentTemplate] = useState()
   const [HeaderParameterList, setHeaderParameterList] = useState([''])
   const [useButtonLink, setButtonLink] = useState('')
   // const [useButtonLinkPresent, setButtonLinkPresent] = useState()
   const [BodyParameterList, setBodyParameterList] = useState([])
   const [testPhone, settestPhone] = useState('')
   const [msgBody, setMsgBody] = useState('')
   const [oldBodyPara, setoldBodyPara] = useState([])
   const [useDisplayBody, setDisplayBody] = useState('')
   const [useBulkModalScreen, setBulkModalScreen] = useState(1)

   const [msgHeader, setMsgHeader] = useState('')
   const [oldHeaderPara, setoldHeaderPara] = useState([])

   const [useGroupList, setGroupList] = useState([])
   const [useSelectedGroups, setSelectedGroups] = useState([])
   const [useSelectedContacts, setSelectedContacts] = useState([])

   const toggle = () => setModal(!modal)
   const toggle2 = () => setModal2(!modal2)

   // tavble tdata
   const tableDataFun = (useSelectedGroups) => {
      const form_data = new FormData()
      form_data.append("group_contact", useSelectedGroups)
      form_data.append("page", 1)
      form_data.append("size", 1000)
      form_data.append("searchValue", '')
      postReq(`get_group_contact`, form_data)
        .then(res => {
          console.log('res:', res.data)
          setSelectedContacts(() => res.data.contact_grp.map((elm) => elm.contact_details_id))
        })
        .catch(error => {
          // Handle errors here
          console.error('Error:', error)
        })
   }


   useEffect(() => {
      setSelectedGroups([])
      setBodyParameterList([])
      setHeaderParameterList([''])
      // setHeaderParameterList_2('')
      // setoldBodyPara([])
      // setoldHeaderPara([])
      setButtonLink('')
      setBulkModalScreen(1)
   }, [modal, modal2])

   const submenuList = [
      {
         title: "Trending",
         icon: <BsFire size={'20px'} />
      },
      {
         title: "General",
         icon: <CiCloud size={'20px'} />
      },
      {
         title: "Top Rated",
         icon: <Star size={'20px'} />
      }

   ]
   const mainMenuList = [
      {
         title: "Explore",
         icon: <Activity size={20} />
      },
      {
         title: "All Templates",
         icon: <List size={20} />
      }
      // {
      //    title: "Draft",
      //    icon: <Edit size={20} />
      // },
      // {
      //    title: "Pending",
      //    icon: <Clock size={20} />
      // },
      // {
      //    title: "Approved",
      //    icon: <Check size={20} />
      // }
   ]

   // get all data
   const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
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
   // group data
   const getGroupsData = () => {
      const form_data = new FormData()
      form_data.append("page", 1)
      form_data.append("size", 1000)
      form_data.append("searchValue", '')
      postReq("group_base_details", form_data)
         .then((resp) => {
            const list = []
            resp.data.group_details_obj.map((elm) => list.push({ value: elm.group_id, label: elm.group_name }))
            setGroupList(list)
         }).catch((err) => {
            console.log(err)
         })
   }
   useEffect(() => {
      getGroupsData()
      getData()
   }, [])


   // all themes display ui message
   const updateDisplayedMessage = (inputString, defData) => {
      let updatedMessage = getBoldStr(inputString)
      if (defData.example) {
         const data = defData.example?.body_text[0]
         updatedMessage = updatedMessage.replace(/{{(\d+)}}/g, (_match, index) => {
            return `[${data[index - 1]}]`
         })
      }
      return updatedMessage
   }
   const updateHeaderDisplayedMessage = (inputString, defData) => {
      let updatedMessage = inputString
      if (defData.example) {
         const data = defData.example?.header_text[0]
         updatedMessage = updatedMessage.replace(/{{(\d+)}}/g, () => {
            return `[${data}]`
         })
      }
      return updatedMessage
   }

   // modal display ui message
   const updateDisplayedMessage2 = (inputString, apiPara) => {
      let updatedMessage = getBoldStr(inputString)
      if (apiPara) {
         updatedMessage = updatedMessage.replace(/{{(\d+)}}/g, (_, index) => {
            if (BodyParameterList[index - 1] && BodyParameterList[index - 1] !== undefined) {
               return `[${BodyParameterList[index - 1]}]`
            } else {
               return `[${apiPara[index - 1]}]`
            }
         })
      }
      setDisplayBody(updatedMessage)
   }

   const parameterInput = (type, value, index) => {
      if (type === 'header') {
         setHeaderParameterList([value])
      } else {
         const oldpr = BodyParameterList
         oldpr[index] = value
         setBodyParameterList(oldpr)
         updateDisplayedMessage2(msgBody, oldBodyPara)
      }

   }

   // send template
   const sendTemplate = () => {

      setLoader(true)
      const formData = new FormData()

      if (HeaderParameterList.length > 0 && HeaderParameterList[0] !== '') {
         const header_variables = [
            {
               type: "text",
               text: HeaderParameterList[0]
            }
         ]
         formData.append("header_variables", JSON.stringify(header_variables))
         formData.append("type", "TEXT")
      }
      if (BodyParameterList.length > 0) {
         const body_variables = BodyParameterList.map(text => ({
            type: "text",
            text
         }))
         formData.append("body_variables", JSON.stringify(body_variables))
      }
      if (CurrentTemplate.components[0].format === "IMAGE") {
         formData.append("type", "IMAGE")
         formData.append("link", CurrentTemplate.components[0].example?.header_handle[0])
      } else if (CurrentTemplate.components[0].format === "VIDEO") {
         formData.append("type", "VIDEO")
         formData.append("link", CurrentTemplate.components[0].example?.header_handle[0])
      } else if (CurrentTemplate.components[0].format === "DOCUMENT") {
         formData.append("type", "DOCUMENT")
         formData.append("filename", "NotDefined")
         formData.append("link", CurrentTemplate.components[0].example?.header_handle[0])
      } else {
         formData.append("type", "TEXT")
      }
      const temp = CurrentTemplate.components
      const lastElm = temp[temp.length - 1]
      // console.log(lastElm)
      if (lastElm.buttons) {
         lastElm.buttons.map((elm) => {
            if (elm.type === "URL" && elm.example?.length > 0) {
               formData.append("button_variables", JSON.stringify([
                  {
                     type: "text",
                     text: useButtonLink
                  }
               ]))

            }
         })
      }

      formData.append("language", CurrentTemplate.language)
      formData.append("template_name", CurrentTemplate.name)
      formData.append("template_id", CurrentTemplate.id)
      formData.append("phone", testPhone)

      postReq("sendMessage", formData)
         .then(res => {
            // Handle the successful response here
            console.log('Response:', res.data)
            if (res.data.messages[0].message_status === "accepted") {
               toast.success("Message has sent!")
               setModal(false)
            } else {
               toast.error("Please try again")
            }
         })
         .catch(error => {
            // Handle errors here
            console.error('Error:', error)
            toast.error("Something went wrong!")
         })
         .finally(() => {
            setLoader(false)
         })
   }

   // send template bulk msg
   const sendTemplateBulk = () => {

      const formData = new FormData()

      formData.append("template_id", CurrentTemplate.id)
      formData.append("contact_group_list", useSelectedContacts.toString())
      const temp = CurrentTemplate.components
      const lastElm = temp[temp.length - 1]
      // console.log(lastElm)
      if (lastElm.buttons) {
         lastElm.buttons.map((elm) => {
            if (elm.type === "URL" && elm.example?.length > 0) {
               formData.append("button_variables", JSON.stringify([
                  {
                     type: "text",
                     text: useButtonLink
                  }
               ]))

            }
         })
      }
      if (CurrentTemplate.components[0]?.format === "DOCUMENT") {
         formData.append("filename", "Document")
      }
      // console.log(formData)
      setLoader(true)
      postReq("bulk_message", formData)
         .then(data => {
            toast.success("Message has sent!")
            setModal2(false)

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

   // get current template
   const getCurrentTemplate = (templateId, modal) => {

      const formData = new FormData()
      formData.append("templateId", templateId)
      setLoader(true)
      postReq("getTemplateById", formData)
         .then(res => {
            // console.log('Response:', res.data)
            if (res.data.name) {
               setCurrentTemplate(res.data)
               // console.log(res.data.components[0].format)
               res.data.components.map((elm) => {
                  if (elm.type === "HEADER" && elm.format === "TEXT") {
                     setMsgHeader(elm.text)
                     if (elm?.example) {
                        setoldHeaderPara(elm?.example?.header_text)
                     }
                     // updateHeaderDisplayedMessageModal(elm.text, elm.example?.header_text)
                     // console.log(elm.example?.header_text)
                  }
                  if (elm.type === "BODY") {
                     setMsgBody(elm.text)
                     setoldBodyPara(elm.example?.body_text[0])
                     updateDisplayedMessage2(elm.text, elm.example?.body_text[0])
                  }
                
               })
               if (modal === 'modal') {
                  setModal(true)

               } else {
                  setModal2(true)
               }
            } else {
               toast.error("Template doest not exist!")
               setModal(false)
               setModal2(false)
            }
         })
         .catch(error => {
            console.error('Error:', error)
         }).finally(() => setLoader(false))
   }

   const toggleActive = (tempID, isActive) => {
      const form_data = new FormData()
      form_data.append("templateID", tempID)
      form_data.append("is_active", isActive)
      postReq("template_active", form_data)
         .then((resp) => {
            getData()

         }).catch((err) => {
            console.log(err)
         })
   }

   //render templates
   const renderTemp = (SingleTemplate) => {
      return (
         <CardBody className="border-0 p-2  pe-5 hideScroll rounded-2 " style={{ backgroundImage: `url(${wp_back})`, gap: "5px", whiteSpace: 'pre-wrap', height: "400px", overflowY: "auto", scrollbarWidth: "0" }}>

            <div className="border-1 rounded-2 mb-0 whatsapp_template_card" style={{ maxWidth: "400px" }} >
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
                                       src={data.example?.header_handle[0] ?? ""}
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
      <Container fluid className='px-0' style={{ paddingBottom: "100px" }}>
         {
            useLoader && <FrontBaseLoader />
         }
         <style>
            {
               `
                    .menu_active{
                        border-bottom:solid 2px #000;
                    }
                    .menu_inactive{
                        border-bottom:solid 2px #fff;
                    }
                    .submenu_active{
                        background:#f8f8f8;
                    }
                    `
            }
         </style>
         <Card>
            <CardBody className='d-flex justify-content-between align-items-center '>
               <h4 className="m-0">Explore Campaigns</h4>
               <Link to="/merchant/whatsapp/is_template/" className="btn btn-primary " >Create Template</Link>
            </CardBody>
         </Card>

         <Card className='border position-relative '>
            <div className=' px-2 d-flex gap-5 py-1'>
               {
                  mainMenuList.map((list, index) => (
                     <div onClick={() => setMainMenu(index + 1)} className={`px-1  d-flex justify-content-start align-items-center gap-1  cursor-pointer  ${index + 1 === MainMenu ? 'menu_active' : 'menu_inactive'} `} style={{ padding: '10px' }}>
                        {list.icon}
                        <h5 className='m-0 '>{list.title}</h5>
                     </div>
                  ))
               }
            </div>
            <div className='position-absolute  end-0 me-2 mt-1 d-flex gap-1'>
               <button onClick={getData} className='btn btn-primary'><RefreshCcw size={15} /></button>
            </div>
         </Card>
         {
            MainMenu === 1 &&

            <div className="d-flex justtify-content-center align-items-start">

               <div className="navHere d-none" style={{ width: '350px', height: '100%', padding: '0px 20px 10px' }}>
                  <Card className='border-0'>
                     <CardBody>
                        <div className={`mb-2 d-flex justify-content-start align-items-center gap-1  cursor-pointer border-bottom`} style={{ padding: '10px' }}>
                           <Home size={'20px'} />
                           <h4 className='m-0'>All Templates</h4>
                        </div>

                        <div className={`mb-2`}>
                           {
                              submenuList.map((list, index) => (
                                 <div onClick={() => setSubMenu(index + 1)} className={`px-1 mt-1 d-flex justify-content-start align-items-center gap-1  cursor-pointer  rounded-2 ${index + 1 === SubMenu ? 'submenu_active' : ''} `} style={{ padding: '10px' }}>
                                    {list.icon}
                                    <h4 className='m-0 '>{list.title}</h4>
                                 </div>
                              ))
                           }
                        </div>
                     </CardBody>
                  </Card>

               </div>
               <div className=" w-100">
                  <Row className='match-height  '>
                     <Card className='border-0 p-0'>
                        <CardBody className='p-0'>
                           <Row className='match-height align-items-center '>

                              {
                                !AllTemplatesData  && <div className='fs-4 text-center mt-5 fw-bolder'>No Templates Available</div>
                              }
                              {
                                 AllTemplatesData && AllTemplatesData.map((SingleTemplate) => {
                                    const isActive = ActiveTemplates?.includes(SingleTemplate?.id)
                                    return (

                                       <Col md="6" xl="6" xxl="4" className='d-flex justify-content-center ' >
                                          <Card className="border p-1 rounded-2   position-relaive  shadow-lg " style={{ background: "#fff", gap: "5px" }} >
                                             {
                                                renderTemp(SingleTemplate)
                                             }

                                             <div className='mt-1'>
                                                <div className='  rounded-3 d-flex justify-content-between align-items-center  '>
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

                                                 
                                                   {
                                                      SingleTemplate.status === "APPROVED" && isActive && <>
                                                         <div class="dropdown">
                                                            <button class="dropbtn"> <CiMenuKebab /> </button>
                                                            <div class="dropdown-content cursor-pointer">
                                                               <div className='items' onClick={() => getCurrentTemplate(SingleTemplate.id, 'modal')}>Test</div>
                                                               <div className='items' onClick={() => nagivate(`/merchant/whatsapp/editTemplate/${SingleTemplate.id}`)} >Edit</div>
                                                               <div className='items text-danger ' onClick={() => toggleActive(SingleTemplate.id, false)} >Deactivate</div>
                                                            </div>
                                                         </div>
                                                         <button className='btn btn-primary px-3 send-btn' onClick={() => getCurrentTemplate(SingleTemplate.id, 'modal2')} >Start Campaign <Send id="send-icon" size={16} style={{ marginLeft: "5px" }} /></button>
                                                      </>
                                                   }
                                                   {
                                                      !isActive && <h6>This template is inactive click here to <span className='text-success cursor-pointer text-decoration-underline' onClick={() => toggleActive(SingleTemplate.id, true)}>Activate</span>. </h6>
                                                   }
                                                   {
                                                      SingleTemplate.status !== "APPROVED" && <h6 >This template is not Approved please refresh or <span className='text-danger cursor-pointer text-decoration-underline ' onClick={() => nagivate(`/merchant/whatsapp/editTemplate/${SingleTemplate.id}`)}>edit</span> </h6>
                                                   }
                                                </div>
                                                {/* <button className='btn text-success px-3' onClick={() => toggleActive(SingleTemplate.id, true)} >Active this Campaign </button> */}
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

               {/* modal send single message template-------------------------*/}
               <Modal
                  isOpen={modal}
                  toggle={toggle}
                  backdrop={'static'}
                  size="lg"
               >
                  <ModalHeader toggle={toggle} className='border-bottom'>Template Name : {CurrentTemplate?.name && CurrentTemplate.name}</ModalHeader>
                  <ModalBody className='py-2'>
                     {
                        useLoader && <FrontBaseLoader />
                     }
                     <Row className=' justify-content-center  align-items-center '>
                        <Col md="6" className=''>
                           <div className='px-3'>

                              {/* {
                                 CurrentTemplate && CurrentTemplate.components.map((data) => {
                                    if (data.type === "HEADER" && data.format === "DOCUMENT" && data.example) {
                                       // console.log(data.example?.header_text)
                                       return (
                                          <div>
                                             <h4 className='mt-3'>File Name</h4>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder={"file name"}
                                                onChange={(e) => setFileName(e.target.value)}
                                             />
                                          </div>
                                       )

                                    }
                                 })
                              } */}

                              {
                                 CurrentTemplate && CurrentTemplate.components.map((data) => {
                                    if (data.type === "HEADER" && data.format === "TEXT" && data.example) {
                                       // console.log(data.example?.header_text)
                                       return (
                                          <div>
                                             <h4 className='mt-3  sendMenuHeader'>Header</h4>
                                             {data.example?.header_text && data.example?.header_text.map((label, index) => {
                                                return (
                                                   <div className='mt-1' key={index}>
                                                      <h5 className="">{label}</h5>

                                                      <input
                                                         type="text"
                                                         className="form-control"
                                                         placeholder={label}
                                                         onChange={(e) => parameterInput('header', e.target.value, index)}
                                                      />
                                                   </div>
                                                )
                                             })}
                                          </div>
                                       )
                                    }
                                 })
                              }


                              {
                                 CurrentTemplate && CurrentTemplate.components.map((data) => {
                                    if (data.type === "BODY" && data.example) {
                                       return (
                                          <div>
                                             <h4 className='mt-3 sendMenuHeader '>Body</h4>
                                             {data.example?.body_text[0].map((label, index) => {
                                                return (
                                                   <div className='mt-1'>
                                                      <h5 className="">{label}</h5>

                                                      <input
                                                         type="text"
                                                         className="form-control "
                                                         placeholder={label}
                                                         onChange={(e) => parameterInput('body', e.target.value, index, data)}
                                                      />
                                                   </div>
                                                )
                                             })}
                                          </div>)
                                    }

                                 })
                              }
                              {
                                 CurrentTemplate && CurrentTemplate.components.map((data) => {
                                    if (data.type === "BUTTONS") {
                                       // console.log(data)
                                       return data.buttons.map((elm) => {
                                          // console.log(elm)
                                          if (elm.example) {
                                             return (
                                                <div className='mt-1'>
                                                   <h4 className=" mt-3 sendMenuHeader">Payment URL end point</h4>

                                                   <input
                                                      type="text"
                                                      className="form-control "
                                                      placeholder=".com/your den point"
                                                      onChange={(e) => setButtonLink(e.target.value)}
                                                   />
                                                </div>
                                             )
                                          }
                                       })
                                    }

                                 })
                              }
                              <div className='mt-1'>
                                 <h4 className=" mt-3 sendMenuHeader">Send to </h4>

                                 <input
                                    type="number"
                                    className="form-control "
                                    placeholder="95438xxxxx"
                                    onChange={(e) => settestPhone(e.target.value)}
                                 />
                              </div>

                           </div>

                        </Col>
                        <Col md="6"  >
                           <Card className="border-0 p-2 position-relaive  shadow-lg pe-5" style={{ background: "#c2c2c2", backgroundImage: `url(${wp_back})`, gap: "5px", maxWidth: "500px", whiteSpace: 'pre-wrap' }} >

                              <div className="border-1 rounded-3 mb-0 whatsapp_template_card" >
                                 <div className='p-0' >
                                    {
                                       CurrentTemplate && CurrentTemplate.components.map((data) => {

                                          if (data.format === "TEXT") {
                                             return (
                                                <div className='p-1'  >
                                                   {
                                                      // oldHeaderPara[0] ? <h6 className='fs-4 text-black bolder mb-1 '>{msgHeader?.replace(/{{(\d+)}}/g, HeaderParameterList[0] === '' ? `[${oldHeaderPara[0] ?? ''}]` : `[${HeaderParameterList[0]}]` ?? '')}</h6> : <h6 className='fs-4 text-black bolder mb-1 '>{msgHeader}</h6>
                                                      oldHeaderPara[0] ? <h6 className='fs-4 text-black bolder mb-1 '>{msgHeader?.replace(/{{(\d+)}}/g, `[${HeaderParameterList[0] === '' ? oldHeaderPara[0] : HeaderParameterList[0]}]`)}</h6> : <h6 className='fs-4 text-black bolder mb-1 '>{msgHeader}</h6>
                                                   }
                                                </div>
                                             )
                                          }
                                          if (data.format === "IMAGE") {
                                             return (
                                                <div className='p-1'  >
                                                   <img className=' img-fluid border-0 rounded w-100 object-fit-cover ' src={data.example?.header_handle[0] ?? ""} alt="" />
                                                </div>
                                             )
                                          }
                                          if (data.format === "VIDEO") {
                                             return (
                                                <div className='p-1'  >
                                                   <video className='rounded-3  object-fit-cover w-100' controls autoPlay mute style={{ height: "170px" }}>
                                                      <source
                                                         src={data.example?.header_handle[0] ?? ""}
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
                                                   {/* <p className='fs-6' dangerouslySetInnerHTML={{ __html: updateDisplayedMessage2(data.text, data) }}></p> */}
                                                   <p className='fs-6' dangerouslySetInnerHTML={{ __html: useDisplayBody }}></p>

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
                                                      <div className="border-top rounded-3 bg-white  d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
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

                           </Card>
                        </Col>
                     </Row>
                  </ModalBody>
                  <ModalFooter>
                     <div className='btn me-2' onClick={toggle}>
                        Cancel
                     </div>
                     <Button color="primary" onClick={sendTemplate}>
                        Send
                     </Button>
                  </ModalFooter>
               </Modal>


               {/* modal 2 bulk msg -------------------------*/}
               <Modal
                  isOpen={modal2}
                  toggle={toggle2}
                  backdrop={'static'}
                  size="lg"
                  style={{ maxWidth: "900px" }}
               >

                  <ModalHeader toggle={toggle2} className='border-bottom'>Template Name : {CurrentTemplate?.name && CurrentTemplate.name}</ModalHeader>
                  <ModalBody className='py-2'>
                     <Row className=' justify-content-center  align-items-start'>
                        {/* send contacts details */}
                        {
                           useLoader && <FrontBaseLoader />
                        }
                        {
                           useBulkModalScreen === 1 &&
                           <div>
                              <h4 className='sendMenuHeader'>Select Groups</h4>
                              <Row className='gy-1 mt-2'>
                                 {
                                    useGroupList.length === 0 && <h4>No Groups Created! <Link to='/merchant/whatsapp/groups/' className='text-decoration-underline ' >Create Group</Link></h4>
                                 }
                                 {/* <h3 className=' border-bottom'>Send to</h3> */}
                                 {
                                    useGroupList.map((elm) => {
                                       // console.log(elm)
                                       if (useSelectedGroups?.includes(elm.value)) {
                                          return (
                                             <Col md="4" >
                                                <div className='btn border btn-dark w-100 position-relative p-2 ' onClick={(e) => setSelectedGroups(() => useSelectedGroups.filter((ee) => ee !== elm.value))}>
                                                   <CheckCircle className=' position-absolute  top-0 end-0 mt-1 me-1' />
                                                   <div className=''  >{elm.label}</div>
                                                </div>
                                             </Col>
                                          )
                                       } else {
                                          return (
                                             <Col md="4" >
                                                <div className='btn border w-100 position-relative p-2 ' onClick={(e) => setSelectedGroups([...useSelectedGroups, elm.value])}>
                                                   {/* <CheckCircle className=' position-absolute  top-0 end-0 mt-1 me-1' /> */}
                                                   <div className=''  >{elm.label}</div>
                                                </div>
                                             </Col>
                                          )
                                       }
                                    })
                                 }
                                 {
                                    useGroupList.length !== 0 && CurrentTemplate && CurrentTemplate.components.map((data) => {
                                       if (data.type === "BUTTONS") {
                                          // console.log(data)
                                          return data.buttons.map((elm) => {
                                             if (elm.example) {
                                                return (
                                                   <div className='mt-1 '>
                                                      <h4 className=" mt-3 sendMenuHeader">Payment URL end point</h4>

                                                      <input
                                                         type="text"
                                                         className="form-control w-50 "
                                                         placeholder=".com/your end point"
                                                         onChange={(e) => setButtonLink(e.target.value)}
                                                      />
                                                   </div>
                                                )
                                             }
                                          })
                                       }

                                    })
                                 }
                              </Row>
                           </div>
                        }

                        {
                           useBulkModalScreen === 2 && <SendContactTable groupID={useSelectedGroups} />
                        }
                     </Row>
                  </ModalBody>
                  <ModalFooter>
                    <div className='btn me-2' onClick={toggle2}> Cancel </div>
                     

                     {useBulkModalScreen === 1 && useGroupList.length !== 0 && useSelectedGroups.length !== 0 && <Button color="primary" onClick={() => { setBulkModalScreen(2); tableDataFun(useSelectedGroups) }}>
                        Next
                     </Button>}
                     {useSelectedContacts.length !== 0 && useBulkModalScreen === 2 && <Button color="primary" onClick={() => { sendTemplateBulk() }}>
                        Send
                     </Button>}
                  </ModalFooter>
               </Modal>
            </div>
         }
         {
            MainMenu !== 1 && <AllTempTable />
         }
      </Container >
   )
}
