/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Card, CardBody, Col, Input, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { deleteReq, getReq, postReq, putReq } from '../../../assets/auth/jwtService'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import FrontBaseLoader from '../../Components/Loader/Loader'
import WA_BAG from '../imgs/wp_back.png' 
import { Edit, Eye, Link, Trash } from 'react-feather'
import { getBoldStr } from '../SmallFunction'
export default function QuickReplySetting() {
  const [useLoader, setLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [modal, setModal] = useState(false)
  const [useCurrentMsg, setCurrentMsg] = useState({ title: "", message: "" })
  const toggle = () => {
    setModal(!modal)
  }

  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    const form_data = new FormData()
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)
    form_data.append("action", "get")
    setIsLoading(true)
    postReq(`quick_replay`, form_data)
      .then(res => {
        // Handle the successful res here
        console.log('res:', res.data)
        setTableData(res?.data?.quick_reply ?? [])
        // const newArr = res?.data?.quick_reply.map((elm, index) => {

        // })
        setTotal(res?.data?.quick_reply_count ?? 0)
      }).then((err) => {
        console.log(err)
        toast.error("Something went wrong!")
      }).finally(() => setIsLoading(false))

  }
  const FakeData = [
    {
      created_at: '2024-05-01',
      title: 'Apology',
      message: 'Sorry for the inconvenience caused to you. We are currently working on your request and will update you soon. 😊'
    },
    {
      created_at: '2024-05-02',
      title: 'Greeting',
      message: 'Hi. Thanks for visiting us. How can I help you today? 🚀'
    },
    {
      created_at: '2024-05-03',
      title: 'Not Sure',
      message: 'That’s a very good question! To be honest, I’m not sure about it myself, but let me find it out for you. 🎉'
    },
    {
      created_at: '2024-05-04',
      title: 'Apology Follow-up',
      message: 'I’m very sorry about the situation. I understand that it caused you a lot of trouble. Let me see what I can do about it. 📅'
    },
    {
      created_at: '2024-05-05',
      title: 'Thanks',
      message: 'Thank you for visiting us. Have a good day. 🔥'
    },
    {
      created_at: '2024-05-06',
      title: 'Help',
      message: 'Is there anything else I can help you with? 🤔'
    }
  ]

  const columns = [
    {
      name: 'Created On',
      minWidth: '100px',
      selector: row => row.quick_reply_created_at,
      type: 'select',
      isEnable: true
    },
    {
      name: 'Title',
      minWidth: '100px',
      selector: row => row.quick_reply_title,
      type: 'text',
      isEnable: true
    },
    {
      name: 'Message',
      minWidth: '200px',
      selector: row => row.quick_reply_message,
      type: 'text',
      isEnable: true
    },

    {
      name: 'Actions',
      cell: (row) => {
        return (<div className='d-flex gap-'>
          {/* <Link to={`/merchant/Email/`} className='btn ' style={{ padding: "5px 10px" }}><Eye size={18} /></Link> */}
          <button className='btn ' style={{ padding: "5px 10px" }} onClick={() => { setCurrentMsg({ title: row?.quick_reply_title ?? '', message: row.quick_reply_message ?? '' }); setModal(true) }} ><Eye size={18} /></button>
          <button className='btn ' style={{ padding: "5px 10px" }} onClick={() => { setCurrentMsg({ title: row?.quick_reply_title ?? '', message: row.quick_reply_message ?? '' }); setModal(true) }} ><Edit size={18} /></button>
          <button className='btn ' style={{ padding: "5px 10px" }} ><Trash size={18} /></button>

        </div>
        )
      },
      isEnable: true
    }
  ]
  const handleInputChange = (title, e) => {
    setCurrentMsg(prev => ({ ...prev, [title]: e.target.value }))
  }

  const handleDelete = (id) => {
    deleteReq("quick_replay", `?id=${id}`)
      .then((res) => {
        toast.success(useCurrentMsg.id ? "Updated!" : "Saved!")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // save edit
  const handleSave = (e) => {
    const newFormData = new FormData()
    e.preventDefault()
    if (useCurrentMsg.title === '' || useCurrentMsg.message === '') {
      return toast.error("All fields are required!")
    }
    newFormData.append("title", useCurrentMsg.title)
    newFormData.append("message", useCurrentMsg.message)
    newFormData.append("action", "create")
    useCurrentMsg.id ? putReq("quick_replay", newFormData) : postReq("quick_replay", newFormData)
      .then((res) => {
        toast.success(useCurrentMsg.id ? "Updated!" : "Saved!")
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const customButton2 = () => {
    return <button className='btn btn-primary' onClick={() => { toggle(); useState({ title: "", message: "" }) }}>New reply</button>
  }

  return (
    <>

      <Card>

        <CardBody>

          <AdvanceServerSide
            tableName="Quick Reply"
            tableCol={columns}
            data={tableData}
            count={total}
            getData={getData}
            isLoading={isLoading}
            advanceFilter={false}
            customButtonRight={customButton2}

          />
        </CardBody>
      </Card>
      <Modal size='lg' isOpen={modal} toggle={toggle} >
        {
          useLoader && <FrontBaseLoader />
        }
        <ModalHeader toggle={toggle}> Quick Reply</ModalHeader>
        <ModalBody className=''>
          <form onSubmit={handleSave}>
            <Row className=' '>
              <Col md="6" className=''>
                <div>
                  <h5 className=''>
                    Title
                  </h5>
                  <input type="text" class="form-control" value={useCurrentMsg?.title} onChange={(e) => handleInputChange("title", e)} />
                </div>
                <div className='mt-1'>

                  <h5 className=''>
                    Message
                  </h5>
                  <textarea type="text" row="10" style={{ height: "150px" }} class="form-control" value={useCurrentMsg?.message} onChange={(e) => handleInputChange("message", e)} />
                </div>

              </Col>
              <Col md="6" className=' d-flex align-items-center p-1' style={{backgroundImage: `url(${WA_BAG})` }}>
                <div>
                  <div className='message-box live_message_box-right position-relative p-1 rounded-1' style={{ background: "#d4f2c2" }}>
                  <p dangerouslySetInnerHTML={{ __html: getBoldStr(useCurrentMsg?.message ?? '') }}></p>
                  </div>
                </div>
              </Col>
            </Row>
            <div className='d-flex justify-content-end mt-2 '>
              <button className=' btn me-2' onClick={(e) => { e.preventDefault(); setModal(false) }}>Cancel</button>
              <button className=' btn btn-primary' type='submit'>Save</button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  )
}
