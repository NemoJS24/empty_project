/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle, Users } from 'react-feather'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { getReq, ngURL, postReq } from '../../../assets/auth/jwtService'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import FrontBaseLoader from '../../Components/Loader/Loader'
import Select from 'react-select'

export default function EmailSelectGroup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [useGroupList, setGroupList] = useState([])
  const [useSelectedGroups, setSelectedGroups] = useState([])
  const [usePage, setPage] = useState(1)
  const [tableData, settableData] = useState([])
  const [totalData, settotalData] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [useSenderEmailList, setSenderEmailList] = useState([])
  const [useSchedule, setSchedule] = useState({
    date: '',
    time: ''
  })
  const [useCampaignDetail, setCampaignDetail] = useState({
    campaignName:"",
    senderEmail:"",
    delay:5
  })
  useEffect(() => {
    const today = new Date()
    let month = String(today.getMonth() + 1)
    let day = String(today.getDate())
    const year = today.getFullYear()

    if (month.length < 2) month = `0${  month}`
    if (day.length < 2) day = `0${  day}`

    const currentDate = `${year}-${month}-${day}`

    let hour = String(today.getHours())
    let minute = String(today.getMinutes())

    if (hour.length < 2) hour = `0${  hour}`
    if (minute.length < 2) minute = `0${  minute}`

    const currentTime = `${hour}:${minute}`

    setSchedule({
      date: currentDate,
      time: currentTime
    })
  }, [])
  const [useLoader, setLoader] = useState(false)
  const [modal, setModal] = useState(false)


  const toggle = () => setModal(!modal)

  // get groups
  const getGroupsData = () => {
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 10000)
    form_data.append("searchValue", '')
    setLoader(true)
    postReq("email_group_base_details", form_data)
      .then((resp) => {
        setGroupList(resp.data.group_details_obj)
      }).catch((err) => {
        console.log(err)
      }).finally(() => setLoader(false))
  }

  const columns = [
    {
      name: 'First Name',
      minWidth: '200px',
      selector: row => row?.contact_first_name ?? ' ', // Assuming 'name' is the property in your data for the name
      dataType: 'email',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Last Name',
      minWidth: '15%',
      selector: row => row?.contact_last_name ?? ' ', // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Email',
      minWidth: '15%',
      selector: row => row?.contact_details_email ?? ' ', // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    }

  ]

  // get concats
  const getContactsData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    const form_data = new FormData()
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))

    form_data.append("group_contact", useSelectedGroups)
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)
    postReq(`get_email_group_contact`, form_data)
      .then(res => {
        console.log('res:', res.data)
        settableData(res.data.contact_grp)
        settotalData(res.data.contact_grp_count)
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
      }).finally(() => setIsLoading(false))
  }

  // send templates
  const sendTemplateBulk = () => {

    const formData = new FormData()
    formData.append("contact_group_list", useSelectedGroups.toString())
    formData.append("unique_id", id)
    formData.append("sender_id", useCampaignDetail.senderEmail)
    formData.append("campaign_name", useCampaignDetail.campaignName)
    formData.append("delay", useCampaignDetail.delay)
    setLoader(true)
    postReq("bulk_send_mail", formData)
      .then(data => {
        toast.success("Email has sent!")
        navigate('/merchant/Email/templates')
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error.response)
        // toast.error(error.response.data.error)
      })
      .finally(() => {
        setLoader(false)
      })
  }

  const sendTemplateSchedule = () => {
    // return null
    const formData = new FormData()
    formData.append("group_list", useSelectedGroups.toString())
    formData.append("unique_id", id)
    formData.append("timestamp_schedule", `${useSchedule.date} ${useSchedule.time}:00`)
    formData.append("sender_id", useCampaignDetail.senderEmail)
    formData.append("campaign_name", useCampaignDetail.campaignName)
    formData.append("delay", useCampaignDetail.delay)
    setLoader(true)
    postReq("email_schedule_details", formData)
      .then(data => {
        toast.success("Email has sent!")
        navigate('/merchant/Email/templates')

      })
      .catch(error => {
        console.error('Error:', error.response)
      })
      .finally(() => {
        setLoader(false)
      })
  }
  const getSenderData = () => {

    getReq("mail_info")
      .then(response => {
        console.log(response.data.data)
        const senderData = response.data.data.map((data) => {
         if (data.is_default) {
          setCampaignDetail({...useCampaignDetail, senderEmail:data.id})
         }
          return { value: data.id, label: data.email_id }
        })
        setSenderEmailList(senderData)
        console.log(senderData)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  useEffect(() => {
    getGroupsData()
    getSenderData()
  }, [])
  const getCurrentDate = () => {
    const today = new Date()
    let month = String(today.getMonth() + 1)
    let day = String(today.getDate())
    const year = today.getFullYear()

    if (month.length < 2) month = `0${  month}`
    if (day.length < 2) day = `0${  day}`
    // setSchedule({ ...useSchedule, date: `${year}-${month}-${day}` })
    return `${year}-${month}-${day}`
  }
  const getCurrentTime = () => {
    const today = new Date()
    let hour = String(today.getHours())
    let minute = String(today.getMinutes())

    if (hour.length < 2) hour = `0${  hour}`
    if (minute.length < 2) minute = `0${  minute}`

    return `${hour}:${minute}`
  }
  if (usePage === 1) {
    return (<>
      {
        useLoader && <FrontBaseLoader />
      }
      <Card>
        <CardBody className=''>

          <div className='border-bottom py-1 d-flex justify-content-between  align-items-center '>
            <h3 className="m-0 ">Select Groups</h3>

          </div>
          <Row className='mt-2 gy-2'>
            {
              useGroupList.length === 0 && <h4>No Groups Created! <Link to='/merchant/whatsapp/groups/' className='text-decoration-underline ' >Create Group <ArrowRight size={17} /></Link></h4>
            }
            {
              useGroupList.map((elm) => {
                // console.log(elm)
                if (useSelectedGroups?.includes(elm.group_id)) {
                  return (
                    <Col md="4" >
                      <div className='btn border d-flex justify-content-center align-items-center flex-column  btn-dark w-100 position-relative p-3 ' onClick={(e) => setSelectedGroups(() => useSelectedGroups.filter((ee) => ee !== elm.group_id))}>
                        <CheckCircle className=' position-absolute  top-0 end-0 mt-1 me-1' />
                        <div className='fs-5'  >{elm.group_name}</div>
                        <div className='d-flex gap-1 mt-1 justify-content-center align-items-center  '>
                          <p className='m-0'>{`(`}{elm.group_description}{`)`}</p>
                          <Users size={15} /> {elm.group_count}
                        </div>
                      </div>
                    </Col>
                  )
                } else {
                  return (
                    <Col md="4" >
                      <div className='btn border d-flex justify-content-center align-items-center flex-column  w-100 position-relative p-3 ' onClick={(e) => setSelectedGroups([...useSelectedGroups, elm.group_id])}>
                        {/* <CheckCircle className=' position-absolute  top-0 end-0 mt-1 me-1' /> */}
                        <div className='fs-5'  >{elm.group_name}</div>
                        <div className='d-flex gap-1 mt-1 justify-content-center align-items-center  '>
                          <p className='m-0'>{`(`}{elm.group_description}{`)`}</p>
                          <Users size={15} /> {elm.group_count}
                        </div>
                      </div>
                    </Col>
                  )
                }
              })
            }
          </Row>
        </CardBody>
      </Card>

      <div className='d-flex justify-content-between mt-2'>
        <Link to='/merchant/Email/templates' className='btn btn-primary ' > Back</Link>
        <button onClick={() => setPage(2)} className={`btn  btn-primary ${useSelectedGroups.length === 0 ? 'disabled' : ''}`}>Next </button>

      </div>
    </>
    )
  }
  if (usePage === 2) {
    return (<>
      {
        useLoader && <FrontBaseLoader />
      }
      <Card>
        <CardBody className=''>
          <div className='border-bottom py-1 d-flex justify-content-between  align-items-center '>
            <h3 className="m-0 ">Contacts</h3>

          </div>
          <div className='mt-3'>
            <AdvanceServerSide
              tableName={"Contacts List"}
              tableCol={columns}
              data={tableData}
              count={totalData}
              getData={getContactsData}
              isLoading={isLoading}
              advanceFilter={false}
            />
          </div>
          {/* <Link to="/merchant/whatsapp/is_template/" className="btn btn-primary " >Create Template</Link> */}
        </CardBody>
      </Card>

      <div className='d-flex justify-content-between mt-3'>

        <button onClick={() => setPage(1)} className='btn btn-primary ' > Back</button>
        {/* <div className='d-flex gap-2  align-items-center'>

          <button className='btn btn-primary' onClick={toggle}>
            Schedule Campaign
          </button>
          <button onClick={sendTemplateBulk} className={`btn btn-primary px-3 ${useSelectedContacts.length === 0 ? 'opacity-0' : 'opacity-100'}`}>Send Now  </button>
        </div> */}
        <button onClick={() => setPage(3)} className={`btn  btn-primary `}>Next </button>

      </div>

      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Schedule</ModalHeader>
        <ModalBody>
          <div className='mt-1'>
            <h5 className="">Date</h5>
            <input
              type="date"
              className="form-control "
              value={useSchedule.date}
              onChange={(e) => setSchedule({ ...useSchedule, date: e.target.value })}
            />

            <h5 className="mt-1">Time</h5>
            <input
              type="time"
              className="form-control "
              value={useSchedule.time}
              onChange={(e) => setSchedule({ ...useSchedule, time: e.target.value })}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className='btn' onClick={toggle}>
            Cancel
          </div>
          <div className='btn btn-primary' onClick={sendTemplateSchedule}>
            Start
          </div>
        </ModalFooter>
      </Modal>
    </>
    )
  }

  if (usePage === 3) {
    return (<>
      {
        useLoader && <FrontBaseLoader />
      }
      <Card>
        <CardBody className=''>
          <div className='border-bottom py-1 d-flex justify-content-between  align-items-center '>
            <h3 className="m-0 ">Campaign Details</h3>
          </div>

          <Row className='mt-2'>
            <Col md="6">

              <div className='mt-2'>
                <h5 className="">Campaign Name</h5>
                <input
                  placeholder='Campaign Name'
                  type="text"
                  className="form-control "
                  value={useCampaignDetail.campaignName}
              onChange={(e) => setCampaignDetail({...useCampaignDetail, campaignName: e.target.value})}
              />
              
              </div>

              <div className='mt-2'>
                <h5 className="mb-0 pb-0">Set Delay <span>(in seconds)</span></h5>
                <p className='font-small-2 m-0 '>Set delay between email sending to avoid spam!</p>
                <input
                  placeholder='in seconds'
                  value={useCampaignDetail.delay}
                  type="number"
                  className="form-control "
                  onChange={(e) => setCampaignDetail({...useCampaignDetail, delay:e.target.value })}

                />
              </div>

              <div className='mt-2'>
                <h5 className="">Select Sender Email Address</h5>
                <Select
                  className=''
                  // value={{label:useCampaignDetail.senderEmail, value:useCampaignDetail.senderEmail}}
                  options={useSenderEmailList}
                  closeMenuOnSelect={true}
                  onChange={(e) => setCampaignDetail({...useCampaignDetail, senderEmail:e.value })}
                />
              </div>
            </Col>

          </Row>
        </CardBody>
      </Card>

      <div className='d-flex justify-content-between mt-3'>

        <button onClick={() => setPage(2)} className='btn btn-primary'> Back</button>
        <div className='d-flex gap-1'>

          <button className='btn btn-primary' onClick={() => setPage(4)}>
            Schedule Message
          </button>
          <button className='btn btn-primary' onClick={sendTemplateBulk}>
            Send Now
          </button>
        </div>
      </div>
    </>
    )
  }
  if (usePage === 4) {
    return (<>
      {
        useLoader && <FrontBaseLoader />
      }
      <Card>
        <CardBody className=''>
          <div className='border-bottom py-1 d-flex justify-content-between  align-items-center '>
            <h3 className="m-0 ">Schedule Date & Time </h3>
          </div>

          <Row className='mt-2'>
            <Col md="6">

            <div className='mt-1'>
            <h5 className="">Date</h5>
            <input
              type="date"
              className="form-control "
              min={getCurrentDate()}
              value={useSchedule.date}
              onChange={(e) => setSchedule({ ...useSchedule, date: e.target.value })}
            />

            <h5 className="mt-1">Time</h5>
            <input
              type="time"
              min={getCurrentTime()}
              className="form-control "
              value={useSchedule.time}
              onChange={(e) => setSchedule({ ...useSchedule, time: e.target.value })}
            />
          </div>
            </Col>

          </Row>
        </CardBody>
      </Card>

      <div className='d-flex justify-content-between mt-3'>

        <button onClick={() => setPage(3)} className='btn btn-primary'> Back</button>
        <div className='d-flex gap-1'>

          <button className='btn btn-primary' onClick={sendTemplateSchedule}>
            Schedule Message
          </button>
        </div>
      </div>
    </>
    )
  }
}

