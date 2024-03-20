
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { ArrowLeft } from 'react-feather'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import { Card, CardBody, Row } from 'reactstrap'
import { postReq } from '../../../assets/auth/jwtService'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import FrontBaseLoader from '../../Components/Loader/Loader'
export default function GroupDetails() {
  const { name, id } = useParams()
  const [useLoader, setLoader] = useState(false)
  const [tableData, settableData] = useState([])
  const [useSelectedRows, setSelectedRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalData, settotalData] = useState(0)

  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    const form_data = new FormData()
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)
    form_data.append("group_id", id)
    postReq(`group_details`, form_data)
      .then(res => {
        // Handle the successful res here
        console.log('res:', res.data)
        settableData(res.data.group_details_obj)
        settotalData(res.data.group_count
        )
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
      })
  }
  const handleDelete = () => {
    const form_data = new FormData()
    // console.log(useSelectedRows.map(elm => elm.contact_details_id))
    form_data.append('group_list', id)
    form_data.append('contact_list', useSelectedRows.map(elm => elm.contact_id))
    postReq(`group_contact`, form_data)
      .then(res => {
        // console.log('res:', res)
        if (res.data.success) {
          getData()
          toast.success("Contact deleted")
        } else {
          toast.error("Something went wrong")
        }
      })
      .catch(error => {
        console.error('Error:', error)
        toast.error("Something went wrong")
      })
  }
  const columns = [
    {
      name: 'First Name',
      minWidth: '200px',
      selector: row => row.contact_first_name, // Assuming 'name' is the property in your data for the name
      dataType: 'email',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Last Name',
      minWidth: '15%',
      selector: row => row.contact_last_name, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Country Code',
      minWidth: '15%',
      selector: row => row?.contact_phone_code, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Contact',
      minWidth: '15%',
      selector: row => row.contact_contact, // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    }
  ]

  const customButton1 = () => {
    return useSelectedRows.length > 0 ? <button className='btn btn-outline-danger btn-sm ' onClick={handleDelete} >Remove </button> : false
  }
  const customButton2 = () => {
    return <Link to='/merchant/whatsapp/whatsapp_contact/' className='btn btn-primary'>Add Contacts </Link>
  }
  return (
    <>
      {
        useLoader && <FrontBaseLoader />
      }

      <Link to='/merchant/whatsapp/groups/' className='btn btn-sm btn-primary mb-2'><ArrowLeft size={18} style={{ marginBottom: "2px" }} /> Back</Link>
      <Row >
        <Card>
          <CardBody>

            <AdvanceServerSide
              tableName={name}
              tableCol={columns}
              data={tableData}
              count={totalData}
              getData={getData}
              selectableRows={true}
              setSelectedRows={setSelectedRows}
              selectedRows={useSelectedRows}
              isLoading={isLoading}
              advanceFilter={false}
              customButtonLeft={customButton1}
              customButtonRight={customButton2}
            />
          </CardBody>
        </Card>

      </Row>

    </>

  )
}