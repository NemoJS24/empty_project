/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Card, CardBody, Col, Input, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { getReq, postReq } from '../../../assets/auth/jwtService'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import FrontBaseLoader from '../../Components/Loader/Loader'
export default function QuickReplySetting() {
  const [useLoader, setLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tableData, settableData] = useState([])
  const [total, setTotal] = useState(0)
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }
  const getData = () => {
    setIsLoading(true)
    setIsLoading(false)

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
      minWidth: '150px',
      selector: row => row.created_at, 
      type: 'select',
      isEnable: true
    },
    {
      name: 'Title',
      minWidth: '100px',
      selector: row => row.title, 
      type: 'text',
      isEnable: true
    },
    {
      name: 'Message',
      minWidth: '200px',
      selector: row => row.message, 
      type: 'text',
      isEnable: true
    },

    {
      name: 'Actions',
      minWidth: '100px',
      cell: (row) => {
        return (<div className='d-flex gap-2'>
          <button className='btn btn-secondary' style={{ padding: "5px 10px" }} >sync</button>
        </div>
        )
      },
      isEnable: true
    }
  ]

  const handleCreateProject = (e) => {
    e.preventDefault()

  }
  const customButton2 = () => {
    return <button className='btn btn-primary' onClick={toggle}>New replay</button>
  }

  return (
    <>

      <Card>

        <CardBody>

          <AdvanceServerSide
            tableName="Quick Replays"
            tableCol={columns}
            data={FakeData}
            count={1}
            getData={getData}
            isLoading={isLoading}
            advanceFilter={false}
            customButtonRight={customButton2}

          />
        </CardBody>
      </Card>
      <Modal size='' isOpen={modal} toggle={toggle} >
        {
          useLoader && <FrontBaseLoader />
        }
        <ModalHeader toggle={toggle}>Create New Replay</ModalHeader>
        <ModalBody className=''>
          <form onSubmit={handleCreateProject}>

            <Row className=' py-3'>
              <Col className='ms-1'>
                <h5>Title</h5>
                <input type="text" name="project_name" placeholder='Young....'  ></input>
              </Col>
            </Row>
            <div className='d-flex justify-content-end mt-2 '>
              <button className=' btn me-2' onClick={(e) => { e.preventDefault(); setModal(false) }}>Cancel</button>
              <button className=' btn btn-primary' type='submit'>Create</button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  )
}
