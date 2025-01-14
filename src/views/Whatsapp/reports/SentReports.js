/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Label, Input, Form, Button, Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { baseURL, getReq, postReq } from '../../../assets/auth/jwtService'
import FrontBaseLoader from '../../Components/Loader/Loader'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import toast from 'react-hot-toast'
import { Eye, Trash, X } from 'react-feather'
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { defaultFormatDate } from '../../Validator'
import { PermissionProvider } from '../../../Helper/Context'
import LineChart from '../components/charts/LineChart'
export default function SentReports() {
  const { templateId, campaign_id } = useParams()
  const [useLoader, setLoader] = useState(false)
  const [useisLoading, setisLoading] = useState(false)
  const [useTableData, setTableData] = useState([])
  const [totalData, settotalData] = useState(0)
  const { userPermission } = useContext(PermissionProvider)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    group_name: "",
    group_description: ""
  })
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
    setFormData({
      group_name: "",
      group_description: ""
    })
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))

  }


  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    const form_data = new FormData()
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)
    form_data.append("templateId", templateId)
    if (campaign_id) {
      form_data.append("campaign_id", campaign_id)

    }
    setisLoading(true)
    postReq("messagelog_view", form_data)
      .then((resp) => {
        console.log("resp :", resp)
        setTableData(resp.data.messagelog)
        settotalData(resp.data.messagelog_count)

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
    postReq("add_group", formData_new)

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

  const columns = [
    {
      name: 'Created On',
      minWidth: '150px',
      // selector: row => `${moment(row?.data?.messagelog_created_at).format('HH:mm:ss')}, ${moment(row?.data?.messagelog_created_at).format('DD MMM YYYY')}`, // Assuming 'name' is the property in your data for the name
      selector: row => `${defaultFormatDate(row?.data?.messagelog_created_at, userPermission?.user_settings?.date_format)}, ${moment(row?.data?.messagelog_created_at).format('HH:mm:ss')}`,
      dataType: 'date',
      type: 'date',
      isEnable: true
    },
    {
      name: 'First Name',
      minWidth: '150px',
      selector: row => row?.first_name ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: false
    },
    {
      name: 'Last Name',
      minWidth: '150px',
      selector: row => row?.last_name ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: false
    },
    {
      name: 'Contact',
      minWidth: '150px',
      selector: row => row?.data?.messagelog_contact ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Sent',
      minWidth: '150px',
      // selector: row => row?.data?.messagelog_timestamp_sent ?? '', // Assuming 'name' is the property in your data for the name
      selector: row => `${moment(row?.data?.messagelog_timestamp_sent, moment.ISO_8601, true).isValid() ? moment(row?.data?.messagelog_timestamp_sent).format('YYYY-MM-DD, HH:mm:ss') : ''}`, // Assuming 'name' is the property in your data for the name
      dataType: 'date',
      type: 'date',
      isEnable: true
    },
    {
      name: 'Delivered',
      minWidth: '150px',
      // selector: row => row?.data?.messagelog_timestamp_delivered ?? '', // Assuming 'name' is the property in your data for the name
      selector: row => `${moment(row?.data?.messagelog_timestamp_delivered, moment.ISO_8601, true).isValid() ? moment(row?.data?.messagelog_timestamp_delivered).format('YYYY-MM-DD, HH:mm:ss') : ''}`, // Assuming 'name' is the property in your data for the name
      dataType: 'date',
      type: 'date',
      isEnable: true
    },
    {
      name: 'Read',
      minWidth: '150px',
      // selector: row => row?.data?.messagelog_timestamp_read ?? '', // Assuming 'name' is the property in your data for the name
      selector: row => `${moment(row?.data?.messagelog_timestamp_read, moment.ISO_8601, true).isValid() ? moment(row?.data?.messagelog_timestamp_read).format('YYYY-MM-DD, HH:mm:ss') : ''}`, // Assuming 'name' is the property in your data for the name
      dataType: 'date',
      type: 'date',
      isEnable: true
    },
    {
      name: 'Failed',
      minWidth: '150px',
      // selector: row => row?.data?.messagelog_timestamp_failed ?? '', // Assuming 'name' is the property in your data for the name
      selector: row => `${moment(row?.data?.messagelog_timestamp_failed, moment.ISO_8601, true).isValid() ? moment(row?.data?.messagelog_timestamp_failed).format('YYYY-MM-DD, HH:mm:ss') : ''}`, // Assuming 'name' is the property in your data for the name
      dataType: 'date',
      type: 'date',
      isEnable: true
    },
    {
      name: 'Remark',
      minWidth: '150px',
      selector: row => row?.data?.messagelog_remark ?? '', // Assuming 'name' is the property in your data for the name
      dataType: 'text',
      type: 'text',
      isEnable: true
    }

  ]


  return (
    <div>
      {
        useLoader && <FrontBaseLoader />
      }
      <a onClick={() => navigate(-1)} className='btn btn-primary btn-sm mb-1' >Back</a>
      <Card>
        <CardBody>

          <AdvanceServerSide
            tableName="Template Reports"
            tableCol={columns}
            data={useTableData}
            count={totalData}
            getData={getData}
            isLoading={useisLoading}
            advanceFilter={true}
            exportUrl={`${baseURL}/talk/messagelog_view/`}
            isExport={true}
            exportAdditionalData={{templateId, campaign_id}}
          />

        </CardBody>
      </Card>
      <Card className='d-none'>
        <CardBody>
          <LineChart />
        </CardBody>
      </Card>

      <Modal size='md' isOpen={modal} toggle={toggle} >
        {
          useLoader && <FrontBaseLoader />
        }
        <div className='px-2 py-1 border-bottom d-flex justify-content-between align-items-center  '>
          <h2 className='m-0'>Create Group </h2>
          <X size={18} className='cursor-pointer' onClick={toggle} />
        </div>
        <ModalBody className='m'>

          <h5>Group Name</h5>
          <Input type="text" name="group_name" id="name" placeholder='Young....' value={formData.group_name} onChange={handleInputChange}></Input>

          <h5 className='mt-2'>Group Description</h5>
          <textarea className="form-control" id="group_description" placeholder="Group contains only people wh...." name='group_description' rows="4" onChange={handleInputChange} value={formData.group_description} style={{ resize: "none" }}></textarea>

          <div className='d-flex justify-content-end mt-2 '>
            <button className=' btn me-2' onClick={() => setModal(false)}>Cancel</button>
            <button className=' btn btn-primary' onClick={handleSubmit}>Save</button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}
