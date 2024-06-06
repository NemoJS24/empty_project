/* eslint-disable prefer-const */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Copy, CornerDownLeft, ExternalLink, FileText, Image, MapPin, Phone, PlayCircle, Plus, Video } from 'react-feather'
import toast from 'react-hot-toast'
import Select from 'react-select'
import { Card, CardBody, Col, Container, Input, Label, Row } from 'reactstrap'
import wp_back from './imgs/wp_back.png'
import { selectPhoneList } from '../../../Helper/data'
import { postReq } from '../../../assets/auth/jwtService'
import FrontBaseLoader from '../../Components/Loader/Loader'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CarouselTypeList, HeaderTypeList, TooltipButton, getBoldStr, languageList, paramatersList, templateCatgList } from '../SmallFunction'
import { Pagination, Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js'
import { MdDeleteOutline } from "react-icons/md"

export default function EditTemplate() {
  const { templateID } = useParams()
  const navigate = useNavigate()
  const [CurrentTemplate, setCurrentTemplate] = useState()
  const [useLoader, setLoader] = useState(false)
  const [useIsNewTemp, setIsNewTemp] = useState(true)
  const [useLinkType, setLinkType] = useState("custom")

  const [BasicTemplateData, setBasicTemplateData] = useState({
    templateName: '',
    templateCategory: '',
    language: '',
    footer: 'Please reply with "STOP" to opt-out'
  })

  // headrer
  const [Header, setHeader] = useState({
    type: 'Image',
    text: '',
    file: ''
  })

  const [Header_Parameters, setHeader_Parameters] = useState([])

  const addHeaderParam = (e) => {
    const uptstr = `${Header.text}{{1}}`
    setHeader({ ...Header, text: uptstr })
  }

  useEffect(() => {
    if (Header.text.includes("{{1}}")) {
      // Update header parameters
      if (Header_Parameters.length !== 1) {
        setHeader_Parameters([''])
      }
    } else {
      setHeader_Parameters([])
    }

  }, [Header.text])

  // body data structure ---------------------
  const [Body_Parameters, setBody_Parameters] = useState([])
  const [useMsgBody, setMsgBody] = useState("Hello {{3}}, your code will expire in {{4}} mins.")
  const [displayedMessage, setDisplayedMessage] = useState(useMsgBody)

  const handleBodyDisplay = (message, parameters) => {
    let uptDisplayMsg = message.replace(/{{\s*(\d+)\s*}}/g, (_, n) => {
      const replacement = parameters[n - 1] // n starts from 1
      return (replacement === '' || replacement === undefined) ? `{{${n}}}` : `[${replacement}]`
    })
    uptDisplayMsg = getBoldStr(uptDisplayMsg)
    setDisplayedMessage(uptDisplayMsg)
  }

  const handleMsgBodyChange = () => {
    try {
      let str = useMsgBody
      let sequenceCount = (str.match(/{{\s*(\d+)\s*}}/g) || []).length
      let sequence = Array.from({ length: sequenceCount }, (_, i) => 1 + i)

      // Update Body_Parameters and useMsgBody simultaneously
      let newParam = sequence.map((_, i) => Body_Parameters[i] || '')
      let replacedString = str.replace(/{{\s*(\d+)\s*}}/g, () => `{{${sequence.shift()}}}`)

      setBody_Parameters(newParam)
      setMsgBody(replacedString)
      handleBodyDisplay(replacedString, newParam)
    } catch (error) {
      console.error(error)
      setBody_Parameters([])
      setMsgBody(useMsgBody)
    }
  }

  const handleParameterChange = (index, value) => {
    let updatedParameters = [...Body_Parameters]
    updatedParameters[index] = value
    handleBodyDisplay(useMsgBody, updatedParameters)
    setBody_Parameters(updatedParameters)
  }

  useEffect(() => {
    handleMsgBodyChange()
  }, [useMsgBody])

  // carosulel card ---------------------------
  const [useCarouselBasic, setCauseCarouselBasic] = useState({
    mediaType: "IMAGE"
  })
  const [useCurrCarouselIndex, setCurrCarouselIndex] = useState(0)


  const [useCarouselData, setCarouselData] = useState(
    {
      type: "CAROUSEL",
      cards: [
        {
          components: [
            {
              type: "HEADER",
              format: "IMAGE",
              example: {
                header_handle: [""]
              }
            },
            {
              type: "BODY",
              text: "body 1"
            },
            {
              type: "BUTTONS",
              buttons: [
                {
                  type: "QUICK_REPLY",
                  text: ""
                },
                {
                  type: "QUICK_REPLY",
                  text: ""
                }
              ]
            }
          ]
        },
        {
          components: [
            {
              type: "HEADER",
              format: "IMAGE",
              example: {
                header_handle: [""]
              }
            },
            {
              type: "BODY",
              text: "body 2"
            },
            {
              type: "BUTTONS",
              buttons: [
                {
                  type: "QUICK_REPLY",
                  text: ""
                },
                {
                  type: "QUICK_REPLY",
                  text: ""
                }
              ]
            }
          ]
        }
      ]
    }
  )
  const [useCarouselMedia, setCarouselMedia] = useState(['', ''])

  const addCarousel = () => {

    setCarouselData(prev => ({ ...prev, cards: [...prev.cards, prev.cards[0]] }))
    setCarouselMedia(prev => [...prev, ''])
  }
  const deleteCarousel = (index) => {
    let oldCar = {...useCarouselData}
    const newCar = useCarouselData.cards.filter((elm, i) => i !== index)
    // setCarouselData({...oldCar, oldCar: {cards:[...newCar]}})  
    // console.log("SEL", {...oldCar, cards:[...newCar]})
    setCarouselData({...oldCar, cards:[...newCar]})
    // console.log(newCar)
  }
  const showCarouselDetails = () => {
    console.log("useCarouselData", useCarouselData)
    console.log("useCarouselMedia", useCarouselMedia)
    console.log("useCurrCarouselIndex", useCurrCarouselIndex)
    console.log("buttons", useCarouselData.cards[useCurrCarouselIndex]?.components?.find((elm) => elm.type === "BUTTONS")?.buttons?.length)
  }
// Handler for changing body text
const handleBodyInputChange = (e) => {
  const val = e.target.value
  setCarouselData(prev => {
    const updatedCards = [...prev.cards]
    const currentCard = { ...updatedCards[useCurrCarouselIndex] }
    const currentComponents = currentCard.components.map(component => {
      if (component.type === "BODY") {
        return {
          ...component,
          text: val
        }
      }
      return component
    })

    updatedCards[useCurrCarouselIndex] = {
      ...currentCard,
      components: currentComponents
    }

    return {
      ...prev,
      cards: updatedCards
    }
  })
}
  const addCarBtn = (type) => {
    // Make a copy of the state
    let oldData = { ...useCarouselData }
    let newButton = {}
    console.log("type", type)
    if (type === 'QUICK_REPLY') {
      newButton = {
        type: 'QUICK_REPLY',
        text: ""
      }
    } else if (type === 'URL') {
      newButton = {
        type: 'URL',
        text: "",
        url: ""
      }
    } else if (type === 'PHONE_NUMBER') {
      newButton = {
        type: 'PHONE_NUMBER',
        code: '',
        text: "",
        value: ""
      }
    } else {
      return // No need to proceed further if type is not recognized
    }

    // Update the buttons in each component
    let newData = {
      ...oldData,
      cards: oldData.cards.map((card) => ({
        ...card,
        components: card.components.map((component) => {
          if (component.type === "BUTTONS") {
            return {
              ...component,
              buttons: [...component.buttons, newButton]
            }
          }
          return component
        })
      }))
    }

    // Set the updated data to the state
    setCarouselData(newData)
    console.log("newData", newData)

  }
  const delCarBtn = (index) => {
    // Make a copy of the state
    let oldData = { ...useCarouselData }

    // Iterate over each card's components
    let newData = {
      ...oldData,
      cards: oldData.cards.map((card) => ({
        ...card,
        components: card.components.map((component) => {
          // Check if the component is of type 'BUTTONS'
          if (component.type === "BUTTONS" && component.buttons && component.buttons.length > index) {
            // Remove the button at the specified index
            const updatedButtons = component.buttons.filter((button, i) => i !== index)
            return {
              ...component,
              buttons: updatedButtons
            }
          }
          return component
        })
      }))
    }

    // Set the updated data to the state
    setCarouselData(newData)
  }

  const carBtnInputChange = (index, field, value) => {
    setCarouselData(prev => {
      const updatedCards = [...prev.cards]
      const currentCard = { ...updatedCards[useCurrCarouselIndex] }
      const currentComponents = currentCard.components.map(component => {
        if (component.type === "BUTTONS") {
          const updatedButtons = component.buttons.map((button, i) => {
            if (i === index) {
              return {
                ...button,
                [field]: value
              }
            }
            return button
          })
          return {
            ...component,
            buttons: updatedButtons
          }
        }
        return component
      })

      updatedCards[useCurrCarouselIndex] = {
        ...currentCard,
        components: currentComponents
      }

      return {
        ...prev,
        cards: updatedCards
      }
    })
  }

  const addCarouselParam = () => {
    const res = useCarouselData.cards[useCurrCarouselIndex].components.find(component => component.type === "BODY").text
  }
  // carousel xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


  // body xxxxxxxxxxxxxxxxxxx ---------------------


  const [useInteractive, setInteractive] = useState([])
  const [useButtons, setButtons] = useState({
    QUICK_REPLY: 0,
    URL: 0,
    PHONE_NUMBER: 0,
    COPY_CODE: 0
  })

  // interactive change---------------------------------------------------
  const addInteractiveBtn = (type) => {
    const oldData = [...useInteractive]
    let newData

    if (type === 'QUICK_REPLY') {
      newData = {
        type: 'QUICK_REPLY',
        text: ""
      }
    } else if (type === 'URL') {
      newData = {
        type: 'URL',
        text: "",
        url: ""
      }
    } else if (type === 'PHONE_NUMBER') {
      newData = {
        type: 'PHONE_NUMBER',
        code: '',
        text: "",
        value: ""
      }
    } else if (type === 'COPY_CODE') {
      newData = {
        type: "COPY_CODE",
        example: "250FF"
      }
    } else {
      setInteractive([])
      // console.log(oldData)
      return // No need to proceed further if type is not recognized
    }
    const priorityMap = {
      COPY_CODE: 1,
      QUICK_REPLY: 2,
      URL: 3,
      PHONE_NUMBER: 4
    }

    // Sort the buttons based on their priority
    const updatedData = [...oldData, newData].sort((a, b) => priorityMap[a.type] - priorityMap[b.type])

    setInteractive(updatedData)
    console.log(updatedData)
    // setInteractive([...oldData, newData])
  }

  useEffect(() => {
    const count = useInteractive.reduce((acc, elm) => {
      if (elm.type === "QUICK_REPLY") {
        acc.QUICK_REPLY++
      } else if (elm.type === "COPY_CODE") {
        acc.COPY_CODE++
        acc.QUICK_REPLY++
      } else if (elm.type === "URL") {
        acc.URL++
        acc.QUICK_REPLY++
      } else if (elm.type === "PHONE_NUMBER") {
        acc.PHONE_NUMBER++
        acc.QUICK_REPLY++
      }
      return acc
    }, {
      QUICK_REPLY: 0,
      URL: 0,
      COPY_CODE: 0,
      PHONE_NUMBER: 0
    })
    setButtons(count)
    console.log(count)
  }, [useInteractive])

  const handleInputChange = (index, field, value) => {
    let oldData = [...useInteractive]
    oldData[index][field] = value
    setInteractive(oldData)
  }

  const handleDeleteAction = (index, type) => {
    let oldData = [...useInteractive]
    oldData.splice(index, 1)
    setInteractive(oldData)

    // deleted numbers
    const oldBtns = useButtons
    console.log(oldData.length)
    if (oldData.length === 0) {
      setButtons({
        QUICK_REPLY: 3,
        URL: 2,
        PHONE_NUMBER: 1
      })

    } else {
      if (type === 'QUICK_REPLY') {
        oldBtns[type] += 1

      } else {
        oldBtns['QUICK_REPLY'] += 1
        oldBtns[type] += 1
        setButtons(oldBtns)
      }

    }
  }

  const formValidation = () => {
    const errorMsg = {
      templateName: "Enter Template Name",
      templateCategory: "Select Template Category",
      language: "Select Template Language"
    }

    if (BasicTemplateData.useMsgBody === '') {
      toast.error(errorMsg['useMsgBody'])
      return false
    }
    return true


  }

  // load inital data
  useEffect(() => {

    const getCurrentTemplate = (templateId) => {
      const formData = new FormData()
      formData.append("templateId", templateId)
      postReq("getTemplateById", formData)
        .then(res => {
          console.log('Response:', res.data)

          const formatType = res.data.components[0]
          setCurrentTemplate(res.data)
          if (["IMAGE", "VIDEO", "DOCUMENT"].includes(formatType.format)) {
            setHeader({ ...Header, type: formatType.format.replace(/(\B)[^ ]*/g, match => (match.toLowerCase())).replace(/^[^ ]/g, match => (match.toUpperCase())), file: formatType.example.header_handle[0] })
          } else if (formatType.format === 'TEXT') {
            setHeader({ ...Header, type: formatType.format.replace(/(\B)[^ ]*/g, match => (match.toLowerCase())).replace(/^[^ ]/g, match => (match.toUpperCase())), text: formatType.text })
            if (formatType?.example?.header_text.length > 0) {
              setHeader_Parameters(formatType?.example?.header_text)
              // console.log(formatType?.example?.header_text)
            }
          } else {
            setHeader({ ...Header, type: "None" })

          }
          let footer = ''
          res.data.components.forEach((elm) => {
            if (elm.type === "BODY") {
              setMsgBody(elm.text)
              setBody_Parameters(elm.example?.body_text[0] ?? [])
              console.log(elm.example?.body_text[0])
              handleBodyDisplay(elm.text, elm.example?.body_text[0] ?? [])
            }
            if (elm.type === "FOOTER") {
              footer = elm.text
            }
            if (elm.type === "BUTTONS") {
              setInteractive(elm.buttons)
            }
          })

          setBasicTemplateData({
            templateName: res.data.name,
            templateCategory: res.data.category,
            language: res.data.language,
            footer
          })
          setIsNewTemp(false)
        })
        .catch(error => {
          // Handle errors here
          console.error('Error:', error)
        })
        .finally(() => {

        })
    }
    getCurrentTemplate(templateID)
  }, [])
  // handle submit
  const handleTemplateSubmit = () => {

    // console.log("------------------------------------------------")
    // console.log("Body_Parameters :   ", Body_Parameters)
    // console.log("useMsgBody :  ", useMsgBody)
    // console.log("Header :  ", Header)
    // console.log("Header_Parameters :  ", Header_Parameters)
    // console.log("BasicTemplateData :  ", BasicTemplateData)
    // console.log("useInteractive :  ", useInteractive)
    // console.log("useButtons :  ", useButtons)
    // return null
    // if (!formValidation()) {
    //   return false
    // }
    const formData = new FormData()

    const newInteractiveData = useInteractive.map(item => {
      if (item.title === '') {
        return null // Skip items without a title
      }

      if (item.type === "PHONE_NUMBER") {
        return {
          type: item.type,
          text: item.text,
          phone_number: item.code?.replace(/\+/g, '') + item.value
        }
      } else if (item.type === "URL" && useLinkType === "custom") {
        return {
          type: item.type,
          text: item.text,
          url: item.url
        }
      } else if (item.type === "URL" && useLinkType === "Razorpay") {
        return {
          type: item.type,
          text: item.text,
          url: "https://rzp.io/i/{{1}}",
          example: [`https://rzp.io/i/link`]
        }
      } else if (item.type === "QUICK_REPLY") {
        return {
          type: item.type,
          text: item.text
        }
      } else if (item.type === "COPY_CODE") {
        formData.append('coupon_variables', item.value)
        return {
          type: "COPY_CODE",
          example: item.value
        }
      } else {
        // Handle unmatched cases
        return null
      }
    }).filter(Boolean) // Remove null entries from the result

    console.log("newInteractiveData", newInteractiveData)
    // return null
    const components = [
      Header.type === 'Document' && {
        type: 'HEADER',
        format: Header.type.toUpperCase(),
        example: { header_handle: [''] }
      },
      Header.type === 'Image' && {
        type: 'HEADER',
        format: Header.type.toUpperCase(),
        example: { header_handle: [''] }
      },
      Header.type === 'Video' && {
        type: 'HEADER',
        format: Header.type.toUpperCase(),
        example: { header_handle: [''] }
      },
      Header.type === 'Text' && Header_Parameters.length > 0 && {
        type: 'HEADER',
        format: 'TEXT',
        text: Header.text,
        example: {
          header_text: Header_Parameters
        }
      },
      Header.type === 'Text' && Header_Parameters.length === 0 && {
        type: 'HEADER',
        format: 'TEXT',
        text: Header.text
      },
      Body_Parameters.length > 0 && {
        type: 'BODY',
        text: useMsgBody,
        example: {
          body_text:
            [Body_Parameters]
        }
      },
      Body_Parameters.length === 0 && {
        type: 'BODY',
        text: useMsgBody
      },
      Header.type === 'Carousel' && useCarouselData,

      Header.type !== "Carousel" && BasicTemplateData.footer !== '' && {
        type: 'FOOTER',
        text: BasicTemplateData.footer
      },

      useInteractive.length !== 0 && {
        type: "BUTTONS",
        buttons: newInteractiveData
      }

    ].filter(Boolean)

    // const payData = JSON.stringify(payload, null, 2)

    formData.append('name', BasicTemplateData.templateName)
    // eslint-disable-next-line no-unused-expressions
    !useIsNewTemp ? formData.append('templateId', CurrentTemplate.id) : ''
    formData.append('category', BasicTemplateData.templateCategory)
    formData.append('language', BasicTemplateData.language)
    formData.append('components', JSON.stringify(components))
// console.log("useCarouselMedia", useCarouselMedia)
    // return null
    if (Header.type === 'Carousel') {
      useCarouselMedia.map((file, index) => (
        formData.append(`headerUrl${index}`, file)
      ))
      formData.append(`headerUrlCount`, useCarouselMedia.length)
    } else {
      formData.append('headerUrl', Header.file)
    }

    if (typeof Header.file === 'object' && Header.file !== null) {
      formData.append('headerUrlChange', 1)
    } else {
      formData.append('headerUrlChange', 0)
    }

    function changeData(list) {
      const newPara = []
      list.map((elem) => {
        newPara.push({ type: 'Text', text: elem })
      })
      return newPara
    }
    if (Header_Parameters.length > 0) {
      formData.append('headerVariableList', JSON.stringify(changeData(Header_Parameters)))
    }
    if (Body_Parameters.length > 0) {
      formData.append('bodyVariableList', JSON.stringify(changeData(Body_Parameters)))
    }

    setLoader(true)
    //  useIsNewTemp ? postReq("createTemplate", formData) : postReq("editTemplate", formData)
    postReq(useIsNewTemp ? "createTemplate" : "editTemplate", formData)
      .then((res) => {
        console.log(res)
        if (res.data.status) {
          toast.success(useIsNewTemp ? "Template has been created!" : "Template has updated!")
          navigate('/merchant/whatsapp/templates/')
          // toast.success(res.data.error_msg)
        } else if (!res.data.status) {
          toast.error(res.data.error_user_msg && res.data.message)
        } else {
          toast.error("Something went wrong!")
        }
        setLoader(false)

      }).catch((err) => { console.log(err); toast.error("Something went wrong!") })
      .finally(() => {
        setLoader(false)
      }).finally(() => {
        setLoader(false)
      })


  }

  // if (!CurrentTemplate) {
  //   return <FrontBaseLoader />
  // }
  // massgae body function olny ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  return (
    <Container style={{ marginBottom: "200px" }}>
      {
        // !CurrentTemplate && <FrontBaseLoader />
      }
      {
        useLoader && <FrontBaseLoader />
      }
      <Link to='/merchant/whatsapp/templates' className='btn btn-primary btn-sm mb-1' >Back</Link>

      <Card className=''>
        <CardBody className=''>

          <Row>
            <Col md="6">
              <div>
                <h4 className="">Template Category</h4>
                <p className="fs-5  text-secondary">Your template should fall under one of these categories.</p>
                <Select
                  className=''
                  isDisabled={!useIsNewTemp}
                  options={templateCatgList}
                  value={templateCatgList.find((elm) => elm.value === BasicTemplateData.templateCategory)}
                  closeMenuOnSelect={true}
                  onChange={(e) => setBasicTemplateData({ ...BasicTemplateData, templateCategory: e.value })}
                />
              </div>
            </Col>
            <Col md="6">
              <div>
                <h4 className="">Template Language</h4>
                <p className="fs-5  text-secondary">Specify the language in which message template is submitted.</p>
                <Select
                  className=''
                  isDisabled={!useIsNewTemp}

                  options={languageList}
                  closeMenuOnSelect={true}
                  value={languageList.find((elm) => elm.value === BasicTemplateData.language)}
                  onChange={(e) => {
                    setBasicTemplateData({ ...BasicTemplateData, language: e.value })
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <div className='mt-3'>
                <h4 className="">Template Name</h4>
                <p className="fs-5  text-secondary">Name can only be in lowercase alphanumeric characters and underscores. Special characters and white-space are not allowed
                  e.g. - app_verification_code</p>
                <input
                  type="text"
                  disabled={!useIsNewTemp}
                  className="form-control"
                  placeholder="Template name"
                  value={BasicTemplateData?.templateName.toLowerCase()}
                  onChange={(e) => setBasicTemplateData({ ...BasicTemplateData, templateName: e.target.value.toLowerCase() })}
                />

              </div>

              <div className='mt-3'>
                <h4 className="mt-1">Template Type</h4>
                <p className="fs-5  text-secondary">Your template type should fall under one of these categories.</p>
                <Select
                  className=''
                  options={HeaderTypeList}
                  closeMenuOnSelect={true}
                  // value={{ value: Header.type, label: Header.type }}
                  value={HeaderTypeList.find((elm) => elm.value === Header.type)}

                  onChange={(e) => {
                    if (e && e.value !== Header.type.value) {
                      setHeader({ ...Header, type: e.value, file: '' })
                    }
                  }}
                />
              </div>
              {/* header */}
              <div>

                <div>
                  {Header.type === 'Text' &&
                    <div className='mt-3'>
                      <h4 className="">Template Header Text </h4>
                      <p className="fs-5  text-secondary">Your message content. Upto 60 characters are allowed.</p>
                      <input
                        type="text"
                        value={Header.text}
                        className="form-control "
                        placeholder='Enter Header text here'
                        maxLength={60}
                        onChange={(e) => setHeader({ ...Header, text: e.target.value })}
                      />
                      <button className={`btn btn-primary mt-1 ${Header_Parameters.length >= 1 ? 'd-none' : 'd-block'}`} onClick={addHeaderParam}>add parameter</button>
                      <div>
                        {
                          Header_Parameters.map((item) => {
                            console.log(item)
                            return (
                              <div className="mt-1">
                                <Select options={paramatersList}
                                  // value={{ value: item, label: item }}
                                  value={paramatersList.find((elm) => elm.value === item)}
                                  onChange={(e) => { setHeader_Parameters([e.value]) }}
                                  closeMenuOnSelect={true} />
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>}
                  {(Header.type === 'Image' || Header.type === 'Video' || Header.type === 'Document') &&

                    <div className='mt-3'>
                      <h4 className="">{Header.type} File</h4>
                      <p className="fs-5  text-secondary">Choose your file</p>
                      <div className='d-flex align-items-center gap-1 mt-1'>
                        <input type="file" className='d-none' name="mediaUrl" id="mediaUrl"
                          onChange={(e) => {
                            const selectedFile = e.target.files[0]
                            if (selectedFile) {
                              let acceptedTypes
                              switch (Header.type) {
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
                                setHeader({ ...Header, file: selectedFile })
                                toast.dismiss()
                              } else {
                                toast.error(`Incorrect file type. Only ${acceptedTypes.join(', ')} allowed.`)
                              }
                            }
                          }}
                        />
                        <label htmlFor="mediaUrl" className='d-flex gap-1 btn btn-secondary rounded-2  justify-content-center  align-items-center  border' style={{ width: "300px", padding: "3px 0" }}><Image /> <p className="m-0">Upload from  Library</p> </label>
                      </div>
                    </div>}
                </div>
                {/* msg body ---------------------------------------------- */}
                <div className='mt-3'>
                  <div className='mt-3'>
                    <h4 className="">Template Format</h4>
                    <p className="fs-5 text-secondary">
                      Use text formatting - *bold* , _italic_ & ~strikethrough~
                      Your message content. Upto 1024 characters are allowed.
                      e.g. - Hello {`{{1}}`}, your code will expire in {`{{2}}`} mins.
                    </p>
                    <textarea
                      className="form-control"
                      value={useMsgBody}
                      onChange={(e) => setMsgBody(e.target.value)}
                      rows="5"
                      maxLength={1024}
                    ></textarea>
                    <button className='btn btn-primary mt-1' onClick={() => setMsgBody((prev) => `${prev}{{${Body_Parameters.length + 1}}}`)} >Add parameter</button>
                  </div>
                  {/* Sample values for parameters input */}
                  <div className='mt-3'>
                    <h4 className="">Sample Values</h4>
                    <p className="fs-5 text-secondary">
                      Specify sample values for your parameters. These values can be
                      changed at the time of sending. e.g. - {'{{1}}'}: Mohit, {'{{2}}'}: 5.
                    </p>
                    <div className='d-flex flex-column gap-1'>
                      {Body_Parameters?.map((paramData, index) => {
                        // console.log(paramData)
                        // console.log(`${index} ==== ${paramData}`)
                        return (
                          <div className='d-flex' key={index + 1}>
                            <div className='w-25 d-flex justify-content-center align-items-center '>
                              <h5>{`{{ ${index + 1} }}`}</h5>
                            </div>
                            <div className='w-100'>
                              <Select options={paramatersList}
                                value={{ value: paramData, label: paramData }}
                                defaultValue={{ value: paramData, label: paramData }}
                                onChange={(e) => handleParameterChange(index, e.label)}
                                closeMenuOnSelect={true} />

                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                {/* msg body  end---------------------------------------------- */}
              </div>

              {/* carsoudal type */}

              {Header.type === 'Carousel' && <div>
                <div className='mt-3'>
                  <h4 className="mt-1">Carousel Type</h4>
                  <p className="fs-5  text-secondary">Your template type should fall under one of these categories.</p>
                  <Select
                    className=''
                    options={CarouselTypeList}
                    closeMenuOnSelect={true}
                    defaultValue={{ label: useCarouselBasic.mediaType, value: useCarouselBasic.mediaType }}
                    onChange={(e) => {
                      if (e && e.value !== useCarouselBasic.mediaType) {
                        setCauseCarouselBasic({ ...useCarouselBasic, mediaType: e.value })
                      }
                    }}
                  />
                </div>

                <div className='d-flex justify-content-between mt-3'>
                  <h4 className="">Cards ({useCarouselData?.cards?.length})</h4>
                  {
                    useCarouselData?.cards?.length <= 9 && <button className='btn border' onClick={addCarousel}>
                    + Add Card
                  </button>
                  }
                  
                  {/* <button className='btn-danger border-danger' onClick={showCarouselDetails}>
                    show detilas
                  </button> */}

                </div>
                <div className='mt-2'>
                  <h4 className="">{useCarouselBasic.mediaType}  File</h4>
                  <div className='d-flex align-items-center gap-1'>
                    <input type="file" className='d-none' name="carouselMediaUrl" id="carouselMediaUrl"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0]
                        if (selectedFile) {
                          let acceptedTypes
                          switch (useCarouselBasic.mediaType) {
                            case 'IMAGE':
                              acceptedTypes = ['image/png', 'image/jpeg']
                              break
                            case 'VIDEO':
                              acceptedTypes = ['video/mp4']
                              break
                            default:
                              acceptedTypes = []
                          }
                          if (acceptedTypes.includes(selectedFile.type)) {
                            // setHeader({ ...Header, file: selectedFile })
                            // Clone the existing array
                            const updatedList = [...useCarouselMedia]
                            updatedList[useCurrCarouselIndex] = selectedFile
                            setCarouselMedia(updatedList)
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
                <div className='mt-3'>
                  <div className='d-flex justify-content-between align-items-center mb-1'>
                    <h4 className="">CardBody {useCurrCarouselIndex + 1} <span className='text-secondary'>(Optional)</span></h4>
                    {/* <button className={`btn btn-primary `} onClick={addCarouselParam}>add parameter</button> */}

                  </div>
                  <textarea
                    type="text"
                    className="form-control "
                    placeholder='card body'
                    value={useCarouselData.cards[useCurrCarouselIndex].components.find(component => component.type === "BODY").text}
                    onChange={handleBodyInputChange}

                  />
                </div>
              </div>}
              {/* footer */}
              {
                Header.type !== 'Carousel' && <div className='mt-3'>
                  <h4 className="">Template Footer <span className='text-secondary'>(Optional)</span></h4>
                  <p className="fs-5  text-secondary">Your message content. Upto 60 characters are allowed.</p>
                  <input
                    type="text"
                    className="form-control "
                    placeholder='Enter Footer text here'
                    maxLength={60}
                    value={BasicTemplateData.footer}
                    onChange={(e) => setBasicTemplateData({ ...BasicTemplateData, footer: e.target.value })}
                  />
                </div>
              }
            </Col>

            {/* whatsapp ui  -------------------------------------------- */}
            <Col lg="6" className='d-flex align-items-center flex-column   justify-content-center ' >
              <div className=' d-flex flex-column  px-2 pe-4 py-5 ' style={{ width: '420px', whiteSpace: 'pre-wrap', gap: "5px", backgroundImage: `url(${wp_back})` }}>

                <Card className='rounded-3 shadow-lg  position-relative mb-0 whatsapp_template_card' >
                  <CardBody className='p-2'>
                    {Header.type === "Image" && <div className='border rounded-3 d-flex justify-content-center  align-items-center ' style={{ minHeight: "170px", background: "#ffddb0" }}>
                      {
                        Header.file === '' ? <Image size={45} color='#faad20' /> : <img
                          className='img-fluid border-0 rounded-3 w-100 object-fit-cover'
                          style={{ minHeight: "170px" }}
                          src={(function () {
                            try {
                              return URL.createObjectURL(Header.file)
                            } catch (error) {
                              // console.error('Error creating object URL:', error)
                              return Header.file // Fallback to Header.file if there's an error
                            }
                          })()}
                          // src={Header.file === '' ? '' : Header.file}
                          alt=""
                        />

                      }
                    </div>}

                    {Header.type === "Video" && <div className='border rounded-3 d-flex justify-content-center  align-items-center ' style={{ height: "170px", background: "#bbc7ff" }}>

                      {
                        Header.file === '' ? <PlayCircle size={45} color='#5f66cd' /> : <video className='rounded-3  object-fit-cover w-100' controls style={{ height: "170px" }}>
                          <source
                            src={(function () {
                              try {
                                return URL.createObjectURL(Header.file)
                              } catch (error) {
                                console.error('Error creating object URL:', error)
                                return Header.file // Fallback to Header.file if there's an error
                              }
                            })()}
                            type="video/mp4"
                          />
                          Video not supported.
                        </video>
                      }
                    </div>}
                    {Header.type === "Document" && <div className='border rounded-3 d-flex justify-content-center  align-items-center ' style={{ height: "170px", background: "#ffb8cf" }}>
                      <FileText size={45} color='#f33d79' />
                      {
                        Header.file === '' ? <h5>File not selected</h5> : <h5>File Selected</h5>
                      }
                    </div>}
                    {
                      Header.type === "Text" && <h6 className='fs-4 text-black bolder mb-1 '>{Header.text.replace(/\{\{1\}\}/g, Header_Parameters[0] === '' ? '{{1}}' : `[${Header_Parameters[0]}]`)}</h6>
                    }
                    {/* body */}
                    <div className='mt-2'>
                      <p className='fs-6' dangerouslySetInnerHTML={{ __html: displayedMessage }}></p>
                    </div>
                    {/* footer */}
                    {
                      Header.type !== "Carousel" && BasicTemplateData.footer && <h6 className='text-secondary mt-1'>{BasicTemplateData.footer}</h6>
                    }
                  </CardBody>

                  {/* Buttons */}

                  {
                    Header.type !== "Carousel" && useInteractive && useInteractive.map((elem) => {
                      if (elem.type === 'PHONE_NUMBER' && elem.text !== '') {
                        return (
                          <div className="border-top bg-white rounded-bottom-2 d-flex text-primary justify-content-center align-items-center" style={{ padding: "10px", gap: "8px" }} >
                            <Phone size={17} /><h6 className='m-0 text-primary' > {elem.text}</h6>
                          </div>)
                      }
                      if (elem.type === 'URL' && elem.text !== '') {
                        return (
                          <div className="border-top bg-white rounded-bottom-2 d-flex text-primary justify-content-center align-items-center" style={{ padding: "10px", gap: "8px" }} >
                            <ExternalLink size={17} /><h6 className='m-0 text-primary' > {elem.text}</h6>
                          </div>)
                      }
                      if (elem.type === 'QUICK_REPLY' && elem.text !== '') {
                        return (
                          <div className="border-top bg-white rounded-bottom-2 d-flex text-primary justify-content-center align-items-center" style={{ padding: "10px", gap: "8px" }} >
                            <CornerDownLeft size={17} /> <h6 className='m-0 text-primary' > {elem.text}</h6>
                          </div>)
                      }
                    })
                  }
                </Card>

                {/* carousel */}
                <style>
                  {
                    `
                    .swiper{
                      width:360px;
                      border:"solid red 2px"
                    }
                    `
                  }
                </style>
                {
                  Header.type === "Carousel" &&
                  <Card className='rounded-3 shadow-lg  position-relative mb-0 border-0' style={{ background: "none" }} >
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={5}
                      navigation={true}
                      // autoplay={{ delay: 1000 }}
                      speed={500}
                      // loop={true}
                      modules={[Pagination, Navigation, Autoplay]}
                      initialSlide={0}
                      width={330}
                      onSlideChange={(swiper) => setCurrCarouselIndex(swiper.activeIndex)}
                    >
                      {
                        useCarouselData && useCarouselData?.cards.map((currData, key) => {
                          return (
                            <SwiperSlide key={key} >
                              {
                                useCarouselData?.cards?.length >= 2 && <div className='float-end' onClick={() => deleteCarousel(key)} style={{ position: "absolute", right: "5px" }}>
                                <MdDeleteOutline size={16} />
                              </div>
                              }
                              
                              <div className='p-2 rounded-2 ' style={{ background: "#fff" }}>

                                {useCarouselBasic?.mediaType === "IMAGE" && <div className='border rounded-3 d-flex justify-content-center  align-items-center ' style={{ height: "190px", background: "#ffddb0" }}>
                                  {
                                    useCarouselMedia[key] === '' ? <Image size={45} color='#faad20' /> : <img
                                      className='img-fluid border-0 rounded-3 w-100 object-fit-cover'
                                      style={{ minHeight: "190px", height: "220px" }}
                                      // src={URL.createObjectURL(Header.file) ?? '' }
                                      src={useCarouselMedia[key] === '' ? '' : URL.createObjectURL(useCarouselMedia[key])}
                                      alt=""
                                    />
                                  }
                                </div>}
                                {useCarouselBasic?.mediaType === "VIDEO" && <div className='border rounded-3 d-flex justify-content-center  align-items-center ' style={{ height: "190px", background: "#bbc7ff" }}>

                                  {
                                    useCarouselMedia[key] === '' ? <PlayCircle size={45} color='#5f66cd' /> : <video className='rounded-3  object-fit-cover w-100' controls style={{ height: "190px" }}>
                                      <source
                                        src={useCarouselMedia[key] === '' ? '' : URL.createObjectURL(useCarouselMedia[key])}
                                        type="video/mp4"
                                      />
                                      Video not supported.
                                    </video>
                                  }
                                </div>}
                                <div className='mt-1'>
                                  <p className='fs-6' dangerouslySetInnerHTML={{ __html: getBoldStr(currData?.components?.find(elm => elm.type === "BODY").text) }}></p>

                                </div>
                              </div>

                              {/* Buttons */}
                              {
                                Header.type === "Carousel" && currData && currData?.components?.map((elem) => {
                                  if (elem.type === "BUTTONS") {
                                    return elem.buttons.map((ele, index) => {
                                      if (ele.type === 'PHONE_NUMBER') {
                                        return (
                                          <div className="border-top bg-white rounded-bottom-2  d-flex text-primary justify-content-center align-items-center" style={{ padding: "10px", gap: "8px" }} >
                                            <Phone size={17} /><h6 className='m-0 text-primary' > {ele.text}</h6>
                                          </div>)
                                      }
                                      if (ele.type === 'URL') {
                                        return (
                                          <div className="border-top bg-white rounded-bottom-2  d-flex text-primary justify-content-center align-items-center" style={{ padding: "10px", gap: "8px" }} >
                                            <ExternalLink size={17} /><h6 className='m-0 text-primary' > {ele.text}</h6>
                                          </div>)
                                      }
                                      if (ele.type === 'QUICK_REPLY') {
                                        return (
                                          <div className="border-top bg-white rounded-bottom-2  d-flex text-primary justify-content-center align-items-center" style={{ padding: "10px", gap: "8px" }} >
                                            <CornerDownLeft size={17} /> <h6 className='m-0 text-primary' > {ele.text}</h6>
                                          </div>)
                                      }
                                    })
                                  }
                                })
                              }
                            </SwiperSlide>
                          )
                        })
                      }
                    </Swiper>
                  </Card>
                }

              </div>

              <p className='mt-4' style={{ width: '400px' }}>Disclaimer: This is just a graphical representation of the message that will be delivered. Actual message will consist of media selected and may appear different.</p>
            </Col>
          </Row>
          <div>


            <div className='mt-3'>
              <h4 className="">Interactive Actions</h4>
              <p className="fs-5  text-secondary">In addition to your message, you can send actions with your message.<br />
                Maximum 25 characters are allowed in CTA button title & Quick Replies.
              </p>
              <div className=''>

                {/* UI Interactive */}
                {Header.type !== "Carousel" && <div className='mt-2 px-lg-1'>
                  {useInteractive?.length > 0 &&
                    <div className='gap-1 d-flex flex-column  '>
                      {useInteractive?.map((ele, index) => {
                        if (ele.type === 'COPY_CODE') {
                          return (
                            <Row key={index}>
                              <Col lg="2" className='d-flex justify-content-center  align-items-center '><p className='m-0'>Coupon Code {index + 1} :</p></Col>
                              <Col lg="4">
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder='code eg.XDFGDD'
                                  maxLength={25}
                                  value={ele.value}
                                  onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                                />
                              </Col>
                              <Col lg="1" className=' d-flex  justify-content-center  align-items-center fs-4'>
                                <div className='cursor-pointer' onClick={() => handleDeleteAction(index, ele.type)}>X</div>
                              </Col>
                            </Row>)
                        }
                        if (ele.type === 'QUICK_REPLY') {
                          return (
                            <Row key={index}>
                              <Col lg="2" className='d-flex justify-content-center  align-items-center '><p className='m-0'>Quick Reply {index + 1} :</p></Col>

                              <Col lg="4">
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder='Button Title'
                                  maxLength={25}
                                  value={ele.text}
                                  onChange={(e) => handleInputChange(index, 'text', e.target.value)}
                                />
                              </Col>
                              <Col lg="1" className=' d-flex  justify-content-center  align-items-center fs-4'>
                                <div className='cursor-pointer' onClick={() => handleDeleteAction(index, ele.type)}>X</div>
                              </Col>
                            </Row>)
                        }
                        if (ele.type === 'URL') {
                          // console.log(ele)
                          return (
                            <Row key={index}>
                              <Col lg="2" className='d-flex justify-content-center  align-items-center '><p className='m-0'>Call to Action {index + 1} :</p></Col>
                              <Col lg="2">
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder='Button Title'
                                  maxLength={25}
                                  value={ele.type}
                                  disabled
                                />
                              </Col>
                              <Col lg="2">
                                <Select defaultValue={[{ label: "custom", value: "custom" }]} options={[{ label: "custom", value: "custom" }, { label: "Razorpay", value: "Razorpay" }]}
                                  onChange={(e) => setLinkType(e.label)}
                                />
                              </Col>
                              <Col lg="2">
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder='Button Title'
                                  maxLength={25}
                                  value={ele.text}
                                  onChange={(e) => handleInputChange(index, 'text', e.target.value)}
                                />
                              </Col>
                              <Col >
                                {
                                  useLinkType === "custom" && <input
                                    type="text"
                                    className="form-control "
                                    placeholder='url'
                                    value={ele.url}
                                    onChange={(e) => handleInputChange(index, 'url', e.target.value)}
                                  />}
                                {
                                  useLinkType === "Razorpay" && <input
                                    type="text"
                                    className="form-control "
                                    placeholder='Button Value'
                                    value="https://rzp.io/i/{{1}}"
                                    disabled
                                  // onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                                  />
                                }

                              </Col>

                              <Col lg="1" className=' d-flex  justify-content-center  align-items-center fs-4'>
                                <div className='cursor-pointer' onClick={() => handleDeleteAction(index, ele.type)}>X</div>
                              </Col>
                            </Row>
                          )
                        }
                        if (ele.type === 'PHONE_NUMBER') {
                          return (
                            <Row key={index}>
                              <Col lg="2" className='d-flex justify-content-center  align-items-center '><p className='m-0'>Call to Action {index + 1} :</p></Col>
                              <Col lg="3">
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder='Button Title'
                                  maxLength={25}
                                  value={ele.type}
                                  disabled
                                />
                              </Col>

                              <Col lg="3">
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder='Button Title'
                                  maxLength={25}
                                  value={ele.text}
                                  onChange={(e) => handleInputChange(index, 'text', e.target.value)}
                                />
                              </Col>
                              <Col lg="1">
                                <Select options={selectPhoneList}
                                  onChange={(e) => handleInputChange(index, 'code', e.value)}
                                  closeMenuOnSelect={true} />
                              </Col>
                              <Col >
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder='Button Value'
                                  value={ele.value}
                                  onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                                />
                              </Col>

                              <Col lg="1" className=' d-flex  justify-content-center  align-items-center fs-4'>
                                <div className='cursor-pointer' onClick={() => handleDeleteAction(index, ele.type)}>X</div>
                              </Col>
                            </Row>
                          )
                        }
                      })}

                    </div>}
                  <div className='d-flex gap-2 mt-1'>
                    <div className={`btn btn-primary btn-sm d-flex justify-content-center  align-items-center   gap-1 ${(useButtons.QUICK_REPLY - 10) === 0 ? 'disabled' : ''}`} onClick={() => addInteractiveBtn("QUICK_REPLY")} >
                      <Plus size={18} /> <p className='m-0'>Quick Reply</p> <div className='border d-flex justify-content-center  align-items-center rounded-5 m-0' style={{ background: "#b9b9b9", color: "#fff", height: "20px", width: "20px" }}><p className="m-0 font-small-3">{10 - (useButtons.QUICK_REPLY)}</p></div>
                    </div>
                    <div className={`btn btn-primary btn-sm d-flex justify-content-center  align-items-center  gap-1 ${((useButtons.URL - 2) === 0) ? 'disabled' : ''}`} onClick={() => addInteractiveBtn("URL")}>
                      <Plus size={18} /> <p className='m-0'>URL</p> <div className='border d-flex justify-content-center  align-items-center rounded-5 m-0' style={{ background: "#b9b9b9", color: "#fff", height: "20px", width: "20px" }}><p className="m-0 font-small-3">{2 - (useButtons.URL)}</p></div>
                    </div>
                    <div className={`btn btn-primary btn-sm d-flex justify-content-center  align-items-center  gap-1 ${((useButtons.PHONE_NUMBER - 1) === 0) ? 'disabled' : ''}`} onClick={() => addInteractiveBtn("PHONE_NUMBER")}>
                      <Plus size={18} /> <p className='m-0'>Phone Number</p> <div className='border d-flex justify-content-center  align-items-center rounded-5 m-0' style={{ background: "#b9b9b9", color: "#fff", height: "20px", width: "20px" }}><p className="m-0 font-small-3">{1 - useButtons.PHONE_NUMBER}</p></div>
                    </div>
                    <div className={`btn btn-primary btn-sm d-flex justify-content-center  align-items-center  gap-1 ${((useButtons.COPY_CODE - 1) === 0) ? 'disabled' : ''} ${BasicTemplateData?.templateCategory !== "MARKETING" ? 'disabled ' : ''}`} onClick={() => addInteractiveBtn("COPY_CODE")}>
                      <Plus size={18} /> <p className='m-0'>Coupon Code</p> <div className='border d-flex justify-content-center  align-items-center rounded-5 m-0' style={{ background: "#b9b9b9", color: "#fff", height: "20px", width: "20px" }}><p className="m-0 font-small-3">{1 - useButtons.COPY_CODE}</p></div>
                    </div>
                  </div>
                </div>
                }
                {/* carousel  input UI    */}
                {Header.type === "Carousel" &&
                  <div className='mt-2 px-lg-1'>

                    <div className='gap-1 d-flex flex-column  '>
                      {useCarouselData.cards[useCurrCarouselIndex]?.components?.map((component, index) => {
                        console.log("1263", component)
                        if (component.type === "BUTTONS") {
                          return component.buttons.map((ele, index) => {
                            if (ele.type === 'QUICK_REPLY') {
                              return (
                                <Row key={index}>
                                  <Col lg="2" className='d-flex justify-content-center  align-items-center '><p className='m-0'>Quick Reply {index + 1} :</p></Col>

                                  <Col lg="4">
                                    <input
                                      type="text"
                                      className="form-control "
                                      placeholder='Button Title'
                                      maxLength={25}
                                      value={ele.text}
                                      onChange={(e) => carBtnInputChange(index, 'text', e.target.value)}
                                    />
                                  </Col>
                                  <Col lg="1" className=' d-flex  justify-content-center  align-items-center fs-4'>
                                    <div className='cursor-pointer' onClick={() => delCarBtn(index, ele.type)}>X</div>
                                  </Col>
                                </Row>)
                            }
                            if (ele.type === 'URL') {
                              console.log(ele)
                              return (
                                <Row key={index}>
                                  <Col lg="2" className='d-flex justify-content-center  align-items-center '><p className='m-0'>Call to Action {index + 1} :</p></Col>
                                  <Col lg="2">
                                    <input
                                      type="text"
                                      className="form-control "
                                      placeholder='Button Title'
                                      maxLength={25}
                                      value={ele.type}
                                      disabled
                                    />
                                  </Col>
                                  <Col lg="2">
                                    <Select defaultValue={[{ label: "custom", value: "custom" }]} options={[{ label: "custom", value: "custom" }, { label: "Razorpay", value: "Razorpay" }]}
                                      onChange={(e) => setLinkType(e.label)}
                                    />
                                  </Col>
                                  <Col lg="2">
                                    <input
                                      type="text"
                                      className="form-control "
                                      placeholder='Button Title'
                                      maxLength={25}
                                      value={ele.text}
                                      onChange={(e) => carBtnInputChange(index, 'text', e.target.value)}
                                    />
                                  </Col>
                                  <Col >
                                    {
                                      useLinkType === "custom" && <input
                                        type="text"
                                        className="form-control "
                                        placeholder='url'
                                        value={ele.url}
                                        // value={ele.url}
                                        onChange={(e) => carBtnInputChange(index, 'url', e.target.value)}
                                      />}
                                    {
                                      useLinkType === "Razorpay" && <input
                                        type="text"
                                        className="form-control "
                                        placeholder='Button Value'
                                        value="https://rzp.io/i/{{1}}"
                                        disabled
                                      // onChange={(e) => carBtnInputChange(index, 'value', e.target.value)}
                                      />
                                    }

                                  </Col>

                                  <Col lg="1" className=' d-flex  justify-content-center  align-items-center fs-4'>
                                    <div className='cursor-pointer' onClick={() => delCarBtn(index, ele.type)}>X</div>
                                  </Col>
                                </Row>
                              )
                            }
                            if (ele.type === 'PHONE_NUMBER') {
                              return (
                                <Row key={index}>
                                  <Col lg="2" className='d-flex justify-content-center  align-items-center '><p className='m-0'>Call to Action {index + 1} :</p></Col>
                                  <Col lg="2">
                                    <input
                                      type="text"
                                      className="form-control "
                                      placeholder='Button Title'
                                      maxLength={25}
                                      value={ele.type}
                                      disabled
                                    />
                                  </Col>

                                  <Col lg="3">
                                    <input
                                      type="text"
                                      className="form-control "
                                      placeholder='Button Title'
                                      maxLength={25}
                                      value={ele.text}
                                      onChange={(e) => carBtnInputChange(index, 'text', e.target.value)}
                                    />
                                  </Col>

                                  <Col lg="1">
                                    <Select options={selectPhoneList}
                                      onChange={(e) => carBtnInputChange(index, 'code', e.value)}
                                      closeMenuOnSelect={true} />
                                  </Col>
                                  <Col >
                                    <input
                                      type="text"
                                      className="form-control "
                                      placeholder='Button Value'
                                      value={ele.value}
                                      onChange={(e) => carBtnInputChange(index, 'value', e.target.value)}
                                    />
                                  </Col>

                                  <Col lg="1" className=' d-flex  justify-content-center  align-items-center fs-4'>
                                    <div className='cursor-pointer' onClick={() => delCarBtn(index, ele.type)}>X</div>
                                  </Col>
                                </Row>
                              )
                            }
                          })
                        }
                      })}

                    </div>
                    {/* carousel  input button UI    */}

                    <div className='d-flex gap-2 mt-1'>
                      <div className={`btn btn-primary btn-sm d-flex justify-content-center  align-items-center   gap-1 ${useCarouselData.cards[useCurrCarouselIndex]?.components?.find((elm) => elm.type === "BUTTONS")?.buttons?.length >= 2 ? 'disabled' : ''}`} onClick={() => addCarBtn("QUICK_REPLY")} >
                        <Plus size={18} /> <p className='m-0'>Quick Reply</p> <div className='border d-flex justify-content-center  align-items-center rounded-5 m-0' style={{ background: "#b9b9b9", color: "#fff", height: "20px", width: "20px" }}><p className="m-0 font-small-3"></p></div>
                      </div>
                      <div className={`btn btn-primary btn-sm d-flex justify-content-center  align-items-center  gap-1 ${useCarouselData.cards[useCurrCarouselIndex]?.components?.find((elm) => elm.type === "BUTTONS")?.buttons?.length >= 2 ? 'disabled' : ''} `} onClick={() => addCarBtn("URL")}>
                        <Plus size={18} /> <p className='m-0'>URL</p> <div className='border d-flex justify-content-center  align-items-center rounded-5 m-0' style={{ background: "#b9b9b9", color: "#fff", height: "20px", width: "20px" }}><p className="m-0 font-small-3"></p></div>
                      </div>
                      <div className={`btn btn-primary btn-sm d-flex justify-content-center  align-items-center  gap-1 ${useCarouselData.cards[useCurrCarouselIndex]?.components?.find((elm) => elm.type === "BUTTONS")?.buttons?.length >= 2 ? 'disabled' : ''} `} onClick={() => addCarBtn("PHONE_NUMBER")}>
                        <Plus size={18} /> <p className='m-0'>Phone Number</p> <div className='border d-flex justify-content-center  align-items-center rounded-5 m-0' style={{ background: "#b9b9b9", color: "#fff", height: "20px", width: "20px" }}><p className="m-0 font-small-3"></p></div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div>
              <button className='btn btn-primary mt-3' onClick={handleTemplateSubmit}> submit</button>
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}