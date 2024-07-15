/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Edit, Eye, Trash, X } from 'react-feather'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Card, CardBody, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { postReq } from '../../../assets/auth/jwtService'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import FrontBaseLoader from '../../Components/Loader/Loader'

function EmailGroupTable() {
  const [useLoader, setLoader] = useState(false)
  const [useisLoading, setisLoading] = useState(false)
  const [useTableData, setTableData] = useState([])
  const [totalData, settotalData] = useState(0)
  const [useDelID, setDelID] = useState('')
  const emptyData = {
    group_name: "",
    group_description: ""
  }
  const [formData, setFormData] = useState({
    group_name: "",
    group_description: ""
  })
  const [modal4, setModal4] = useState(false)
  const toggle4 = () => {
    setModal4(!modal4)
  }
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
    setFormData(emptyData)
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))

  }


  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    setisLoading(true)
    const form_data = new FormData()
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))

    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)
    postReq("email_group_base_details", form_data)
      .then((resp) => {
        console.log("resp :", resp)
        setTableData(resp.data.group_details_obj)
        settotalData(resp.data.total_group_count)
      }).catch((err) => {
        console.log(err)
      }).finally(() => { setLoader(false); setisLoading(false) })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData_new = new FormData()
    if (formData.group_name === "" || formData.group_description === "") {
      toast.error("All fields required")
      return false
    }
    Object.entries(formData).map(([key, value]) => {
      formData_new.append(key, value)
    })

    setLoader(true)
    postReq("email_add_group", formData_new)

      .then((resp) => {
        console.log(resp)
        if (resp.data.success) {
          toast.success("Group has been Created")
          setModal(false)
          getData()
        } else {
          toast.error("Something went wrong!")

        }
      }).catch((err) => {
        console.log(err)
        toast.error("Something went wrong!")
      }).finally(() => setLoader(false))
  }

  // deleted group
  const handleDelete = (group_id) => {
    const formData = new FormData()
    formData.append("group_list", [group_id])
    postReq(`email_group_delete`, formData)
      .then(res => {
        // console.log('res:', res)
        if (res.data.success) {
          getData()
          toast.success("Group deleted")
        } else {
          toast.error("Something went wrong")

        }
      })
      .catch(error => {
        console.error('Error:', error)
        toast.error("Server Error!")

      })
  }
  const columns = [
    {
      name: 'Group Name',
      minWidth: '200px',
      selector: row => row.group_name, // Assuming 'name' is the property in your data for the name
      dataType: 'email',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Description',
      minWidth: '15%',
      selector: row => row.group_description, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Total Emails',
      minWidth: '15%',
      selector: row => row.group_contact, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Actions',
      minWidth: '10%',
      cell: (row) => {
        return (<div className='d-flex gap-'>
          <Link to={`/merchant/Email/${row.group_name}/${row.group_id}`} className='btn ' style={{ padding: "5px 10px" }}><Eye size={18} /></Link>
          <button className='btn ' style={{ padding: "5px 10px" }} onClick={() => {
            toggle(true); setFormData({
              id:row.group_id,
              group_name: row.group_name,
              group_description: row.group_description
            })
          }} ><Edit size={18} /></button>
          <button className='btn ' style={{ padding: "5px 10px" }} onClick={() => { toggle4(true); setDelID(row.group_id) }} ><Trash size={18} /></button>

          {/* {row.group_contact !== 0 && <Link to={`/merchant/Email/templates/${row.group_id}`} className='btn btn-primary ms-1' style={{padding:"5px 10px" }}>Send Messages</Link> } */}
        </div>
        )
      },
      isEnable: true
    }
  ]


  const customButton2 = () => {
    return <button className='btn btn-primary' onClick={toggle}>Create Group </button>
  }

  return (
    <div>
      {
        useLoader && <FrontBaseLoader />
      }

      <Card>
        <CardBody>

          <AdvanceServerSide
            tableName="Groups"
            tableCol={columns}
            data={useTableData}
            count={totalData}
            getData={getData}
            isLoading={useisLoading}
            advanceFilter={false}
            customButtonRight={customButton2}
          />

        </CardBody>
      </Card>

      <Modal size='md' isOpen={modal} toggle={toggle} >
        {
          useLoader && <FrontBaseLoader />
        }
        <ModalHeader toggle={toggle}>
          <h4 className='m-0'>Create Group </h4>
        </ModalHeader>
        <ModalBody className='m'>

          <h5>Group Name</h5>
          <Input type="text" name="group_name" id="name" placeholder='Young....' value={formData.group_name} onChange={handleInputChange}></Input>

          <h5 className='mt-2'>Group Description</h5>
          <textarea className="form-control" id="group_description" placeholder="Group contains only people wh...." name='group_description' rows="4" onChange={handleInputChange} value={formData.group_description} style={{ resize: "none" }}></textarea>

          <div className='d-flex justify-content-between mt-2 '>
            <button className=' btn btn-primary  me-2' onClick={() => setModal(false)}>Cancel</button>
            <div className='d-flex gap-1'>

              <button className=' btn btn-primary' onClick={handleSubmit}>Save</button>
              <button className=' btn btn-primary' onClick={handleSubmit}>Save & Close</button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* delete */
        <Modal isOpen={modal4} toggle={toggle4} >
          <ModalHeader toggle={toggle4} className='border-bottom'>Confirm Delete</ModalHeader>
          <ModalBody>
            <h5>Are you sure you want to delete this group?</h5>
          </ModalBody>
          <ModalFooter>
            <div className='btn' onClick={toggle4}>
              Cancel
            </div>
            <div className='btn btn-danger' onClick={() => { handleDelete(useDelID); setModal4(false) }} >
              Delete
            </div>

          </ModalFooter>
        </Modal>}
    </div>
  )
}

export default EmailGroupTable