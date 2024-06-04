/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, ChevronLeft, Send, Users } from 'react-feather'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { postReq } from '../../../../../assets/auth/jwtService'
import AdvanceServerSide from '../../../../Components/DataTable/AdvanceServerSide'
import toast from 'react-hot-toast'
import FrontBaseLoader from '../../../../Components/Loader/Loader'

export default function StartCampaign() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [useGroupList, setGroupList] = useState([])
  const [useSelectedGroups, setSelectedGroups] = useState([])
  const [usePage, setPage] = useState(1)
  const [tableData, settableData] = useState([])
  const [totalData, settotalData] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [useSelectedContacts, setSelectedContacts] = useState([])
  const [useLoader, setLoader] = useState(false)

  // get groups
  const getGroupsData = () => {
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 10000)
    form_data.append("searchValue", '')
    postReq("group_base_details", form_data)
      .then((resp) => {
        setGroupList(resp.data.group_details_obj)
      }).catch((err) => {
        console.log(err)
      })
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
      name: 'Country Code',
      minWidth: '15%',
      selector: row => row?.contact_details_phone_code ?? ' ', // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Contact',
      minWidth: '15%',
      selector: row => row?.contact_details_contact ?? ' ', // Assuming 'category' is the property in your data for the category
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
    postReq(`get_group_contact`, form_data)
      .then(res => {
        console.log('res:', res.data)
        settableData(res.data.contact_grp)
        settotalData(res.data.contact_grp_count)
        setSelectedContacts(() => res.data.contact_grp.map((elm) => elm.contact_details_id))

      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
      })
  }

  // send templates
  const sendTemplateBulk = () => {
    const formData = new FormData()
    formData.append("template_id", id)
    formData.append("contact_group_list", useSelectedGroups.toString())

    // console.log(formData)
    setLoader(true)
    postReq("bulk_message", formData)
      .then(data => {
        toast.success("Message has sent!")
        navigate('/merchant/whatsapp/message/')
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
        toast.error("Please try again")
      })
      .finally(() => {
        setLoader(false)
      })
  }

  useEffect(() => {
    getGroupsData()
  }, [])

  if (usePage === 1) {
    return (<>
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
          {/* <Link to="/merchant/whatsapp/template/new/" className="btn btn-primary " >Create Template</Link> */}
        </CardBody>
      </Card>
      <div class="d-flex justify-content-between">
      <Link to='/merchant/whatsapp/message/' className='btn btn-primary btn' > Back</Link>
      <button onClick={() => setPage(2)} className={`btn  btn-primary ${useSelectedGroups.length === 0 ? 'opacity-0' : 'opacity-100'}`}>Next </button>
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
            <h3 className="m-0 ">Select Contacts</h3>

          </div>
          <div className='mt-3'>
            <AdvanceServerSide
              tableName={"Contacts List"}
              tableCol={columns}
              data={tableData}
              count={totalData}
              getData={getContactsData}
              // selectableRows={true}
              // setSelectedRows={setSelectedRows}
              // selectedRows={useSelectedContacts}
              isLoading={isLoading}
              advanceFilter={false}
            />
          </div>
          {/* <Link to="/merchant/whatsapp/template/new/" className="btn btn-primary " >Create Template</Link> */}
        </CardBody>
      </Card>
      <div class="d-flex justify-content-between">
      <button onClick={() => setPage(1)} className='btn btn-primary btn' > Back</button>
      <button onClick={sendTemplateBulk} className={`btn btn-primary px-3 ${useSelectedContacts.length === 0 ? 'opacity-0' : 'opacity-100'}`}>Send Templates  <Send id="send-icon" size={16} style={{ marginLeft: "5px" }} /></button>
      </div>
    </>
    )
  }
}

