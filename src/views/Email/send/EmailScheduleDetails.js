/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { getReq, postReq } from '../../../assets/auth/jwtService'
import { Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import { Link } from 'react-router-dom'
import { Eye } from 'react-feather'

export default function EmailScheduleDetails() {
  const [useTableData, setTableData] = useState([])
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  const getData = () => {

    getReq("email_schedule_details")
      .then(res => {
        console.log(res.data.email_schedule)
        setTableData(res.data.email_schedule)
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
        // toast.error(error.response.data.error)
      })
  }
  const columns = [
    {
      name: 'Created ',
      minWidth: '200px',
      selector: row => row.created_at, // Assuming 'name' is the property in your data for the name
      dataType: 'email',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Schedule at',
      minWidth: '15%',
      selector: row => row.timestamp_schedule, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Template',
      minWidth: '15%',
      selector: row => row.template, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Status',
      minWidth: '15%',
      selector: row => row.status, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Sender Email',
      minWidth: '15%',
      selector: row => row.sender, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Actions',
      minWidth: '10%',
      cell: (row) => {
        return (<div className='d-flex gap-'>
          
          <button className='btn' onClick={toggle} ><Eye size={18} /></button>
        </div>
        )
      },
      isEnable: true
    }
  ]
  return (

    <>
      <Link to="/merchant/email/" className='border btn btn-sm mb-2' > Back</Link>
      <Card>
        <CardBody>

          <AdvanceServerSide
            tableName="Email Schedule"
            tableCol={columns}
            data={useTableData}
            count={10}
            getData={getData}
            isLoading={false}
            advanceFilter={false}
          />

        </CardBody>
      </Card>

      {/* modal */}
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <div className='mt-1'>
            <h5 className="">Schedule Date</h5>
            {/* <input
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
            /> */}
          </div>
        </ModalBody>
        <ModalFooter>
          {/* <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" onClick={sendTemplateSchedule}>
            Start
          </Button> */}
        </ModalFooter>
      </Modal>
    </>
  )
}
