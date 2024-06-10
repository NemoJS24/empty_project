/* eslint-disable no-unused-vars */
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { Eye, X } from 'react-feather'
// import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Input, Modal, ModalBody } from 'reactstrap'
import { PermissionProvider } from '../../../Helper/Context'
import { postReq } from '../../../assets/auth/jwtService'
import ComTable from '../../Components/DataTable/ComTable'
import FrontBaseLoader from '../../Components/Loader/Loader'
import { defaultFormatDate } from '../../Validator'
export default function TemplateReports() {
  const { userPermission } = useContext(PermissionProvider)
  const [useLoader, setLoader] = useState(false)
  const [useisLoading, setisLoading] = useState(false)
  const [useTableData, setTableData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const { campaign_id } = useParams()
  const navigate = useNavigate()
  // const [formData, setFormData] = useState({
  //   group_name: "",
  //   group_description: ""
  // })
  // const [modal, setModal] = useState(false)
  // const toggle = () => {
  //   setModal(!modal)
  //   setFormData({
  //     group_name: "",
  //     group_description: ""
  //   })
  // }
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target

  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value
  //   }))

  // }

  const handleFilter = e => {
    const { value } = e.target
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = useTableData.filter(row => {
        const startsWith =
          row?.user?.first_name.toLowerCase().startsWith(value.toLowerCase()) ||
          row?.department[0]?.department.toLowerCase().startsWith(value.toLowerCase()) ||
          row?.user_position.toLowerCase().startsWith(value.toLowerCase()) ||
          row?.user?.username.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          row?.user?.first_name.toLowerCase().includes(value.toLowerCase()) ||
          row?.department[0]?.department.toLowerCase().includes(value.toLowerCase()) ||
          row?.user_position.toLowerCase().includes(value.toLowerCase()) ||
          row?.user?.username.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }

  const defferContent = <>
    <Col className='d-flex align-items-center justify-content-center' md='4' sm='12'>
      <h4 className='m-0'>Reports</h4>
    </Col>
    <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
      <Input
        className='dataTable-filter form-control ms-1'
        style={{ width: `180px`, height: `2.714rem` }}
        type='text'
        bsSize='sm'
        id='search-input-1'
        placeholder='Search...'
        value={searchValue}
        onChange={handleFilter}
      />
    </Col>
  </>


  const getData = () => {
    const form_data = new FormData()
    form_data.append('campaign_id', campaign_id)
    setisLoading(true)
    postReq("campagin_view", form_data)
      .then((resp) => {
        console.log("resp :", resp)
        setTableData(resp.data?.data)

      }).catch((err) => {
        console.log(err)
      }).finally(() => { setLoader(false); setisLoading(false) })
  }

  useEffect(() => {
    getData()
  }, [])

  console.log(useTableData)

  const columns = [
    {
      name: 'Created',
      minWidth: '200px',
      selector: row => `${defaultFormatDate(row.created_at, userPermission?.user_settings?.date_format)}, ${moment(row.created_at).format('HH:mm:ss')}`,
      dataType: 'text',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Template Name',
      minWidth: '280px',
      // selector: row => row.template_templateName, // Assuming 'name' is the property in your data for the name
      selector: row => row?.templateName, // Assuming 'name' is the property in your data for the name
      dataType: 'text',
      type: 'text',
      isEnable: true
    },
    // {
    //   name: 'Total Sent',
    //   minWidth: '100px',
    //   selector: row => row?.template_clicks ?? '', // Assuming 'category' is the property in your data for the category
    //   type: 'text',
    //   isEnable: true
    // },
    {
      name: 'Sent',
      minWidth: '100px',
      selector: row => row?.sent_count ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Delivered',
      minWidth: '100px',
      selector: row => row?.delivered_count ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Read',
      minWidth: '100px',
      selector: row => row?.read_count ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Failed',
      minWidth: '100px',
      selector: row => row?.failed_count ?? '', // Assuming 'category' is the property in your data for the category
      type: 'text',
      isEnable: true
    },
    {
      name: 'Actions',
      minWidth: '10%',
      cell: (row) => {
        return (<div className='d-flex gap-2'>
          {/* <button className='btn ' style={{padding:"5px 10px" }} onClick={() => handleDelete(row.group_id)} ><Trash size={18}/></button> */}
          <Link to={`/merchant/whatsapp/reports/template/${row.templateId}/${campaign_id}`} className='btn ' style={{ padding: "5px 10px" }}><Eye size={18} /></Link>
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

      <a onClick={() => navigate(-1)} className='btn btn-primary btn-sm mb-1' >Back</a>
      <Card>
        <CardBody>
          <ComTable
            tableCol={columns}
            data={useTableData}
            isLoading={useisLoading}
            content={defferContent}
            searchValue={searchValue}
            filteredData={filteredData}

          />

        </CardBody>
      </Card>

    </div>
  )
}
