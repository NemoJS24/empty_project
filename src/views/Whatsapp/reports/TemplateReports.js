/* eslint-disable no-unused-vars */
import moment from 'moment'
import React, { useContext, useState } from 'react'
import { Eye, X } from 'react-feather'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Card, CardBody, Input, Modal, ModalBody } from 'reactstrap'
import { PermissionProvider } from '../../../Helper/Context'
import { postReq } from '../../../assets/auth/jwtService'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import FrontBaseLoader from '../../Components/Loader/Loader'
import { defaultFormatDate } from '../../Validator'
export default function TemplateReports() {
  const { userPermission } = useContext(PermissionProvider)
  const [useLoader, setLoader] = useState(false)
  const [useisLoading, setisLoading] = useState(false)
  const [useTableData, setTableData] = useState([])
  const [totalData, settotalData] = useState(0)

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
    setisLoading(true)
    postReq("template_view", form_data)
      .then((resp) => {
        console.log("resp :", resp)
        setTableData(resp.data.template)
        settotalData(resp.data.template_count)

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
      name: 'Created',
      minWidth: '200px',
      selector: row => `${defaultFormatDate(row.template_created_at, userPermission?.user_settings?.date_format)}, ${moment(row.template_created_at).format('HH:mm:ss')}`,
      // selector: row => `${moment(row.template_created_at).format('DD MMM YYYY')}, ${moment(row.template_created_at).format('HH:mm:ss')}`, // Assuming 'name' is the property in your data for the name
      dataType: 'text',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Template Name',
      minWidth: '280px',
      // selector: row => row.template_templateName, // Assuming 'name' is the property in your data for the name
      selector: row => <Link to={`/merchant/whatsapp/reports/template/${row.template_templateId}`} className='btn ' style={{ padding: "5px 10px" }}>{row?.template_templateName}</Link>, // Assuming 'name' is the property in your data for the name
      dataType: 'text',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Total Sent',
      minWidth: '100px',
      selector: row => row?.template_template_clicks ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Sent',
      minWidth: '100px',
      selector: row => row?.template_template_read ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Delivered',
      minWidth: '100px',
      selector: row => row?.template_template_delivered ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Read',
      minWidth: '100px',
      selector: row => row?.template_template_read ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Failed',
      minWidth: '100px',
      selector: row => row?.template_template_failed ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Actions',
      minWidth: '10%',
      cell: (row) => {
        return (<div className='d-flex gap-2'>
          {/* <button className='btn ' style={{padding:"5px 10px" }} onClick={() => handleDelete(row.group_id)} ><Trash size={18}/></button> */}
          <Link to={`/merchant/whatsapp/reports/template/${row.template_templateId}`} className='btn ' style={{ padding: "5px 10px" }}><Eye size={18} /></Link>
        </div>
        )
      },
      isEnable: true
    }
  ]


  return (
    <div>
      {
        useLoader && <FrontBaseLoader />
      }

      <Link to='/merchant/whatsapp/' className='btn btn-primary btn-sm mb-1' >Back</Link>
      <Card>
        <CardBody>
          <AdvanceServerSide
            tableName="Sent Template Reports"
            tableCol={columns}
            data={useTableData}
            count={totalData}
            getData={getData}
            isLoading={useisLoading}

          />

        </CardBody>
      </Card>

      <Modal size='md' isOpen={modal} toggle={toggle} >
        {
          useLoader && <FrontBaseLoader />
        }
        <div className='px-2 py-1 border-bottom d-flex justify-content-between align-items-center  '>
          <h2 className='m-0'>Create WhatsApp Group </h2>
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
