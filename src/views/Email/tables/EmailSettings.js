/* eslint-disable multiline-ternary */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'

import Select from 'react-select'
import { Edit, Eye, EyeOff, Trash, X } from 'react-feather'
import toast from 'react-hot-toast'
import { deleteReq, getReq, postReq, putReq } from '../../../assets/auth/jwtService'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import FrontBaseLoader from '../../Components/Loader/Loader'

export default function EmailSettings() {
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [useLoader, setLoader] = useState(false)

  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [DelID, setDelID] = useState('')
  const [useShowPass, setShowPass] = useState(false)
  const [useViewType, setViewType] = useState('add')
  const hostName = {
    gmail: "smtp.gmail.com",
    outlook: "smtp-mail.outlook.com",
    hotmail: "smtp.office365.com"
  }
  const hostNameList = [
    { value: hostName.gmail, label: 'Gmail' },
    { value: hostName.outlook, label: 'Outlook' },
    { value: hostName.hotmail, label: 'Hotmail' },
    { value: '', label: 'Custom' }
  ]
 
  const PortList = [
    { value: 587, label: 587 },
    { value: 465, label: 465 },
    { value: 25, label: 25 }
  ]
  const SecurityList = [
    { value: "SSL", label: 'SSL' },
    { value: "TLS", label: 'TLS' }
  ]
  const toggle = () => {
    setModal(!modal)
  }
  const toggle2 = () => {
    setModal2(!modal2)
  }

  const defaultData = {
    mailtype: 'SMTP',
    security: 'TLS',
    smtp_port: 587,
    smtp_host: hostName.gmail,
    email_id: '',
    password: '',
    display_name: '',
    is_active: false
  }
  const [useSenderData, setSenderData] = useState(defaultData)

  const uptDropDown = () => {
    if (useSenderData.smtp_host === hostName.gmail) {
      return { value: hostName.gmail, label:"Gmail" }
    }  if (useSenderData.smtp_host === hostName.outlook) {
      return { value: hostName.outlook, label:"Outlook" }
    } if (useSenderData.smtp_host === hostName.hotmail) {
      return { value: hostName.hotmail, label:"Hotmail" }
    } else {
      return { value: "Custom", label: "Custom" }

    }
  }

  const handleSenderInputChange = (e) => {
    const { name, value } = e.target
    // setSenderData({ ...useSenderData, [name]: value })
    setSenderData((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const getSenderData = () => {

    setIsLoading(true)
    getReq("mail_info")
      .then(response => {
        setTableData(response.data.data)
      })
      .catch(error => {
        console.error('Error:', error)
      }).finally(() => setIsLoading(false))
  }

  const uptStatus = ({ id, is_active, is_default }) => {
    const form_data = new FormData()
    form_data.append("login_email_id", id)
    form_data.append("is_active", is_active)
    form_data.append("is_default", is_default)
    postReq("update_status", form_data)
      .then(response => {
        console.log('Response:', response)
        // settotalData(response.data.contact_count)
        getSenderData()
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
      })
  }
  const deleteEmail = (id) => {

    deleteReq("mail_info", `?mail_id=${id}`)
      .then(response => {
        console.log('Response:', response)
        getSenderData()
        modal2(false)
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
      })
  }
  // Sender table

  const columns = [
    {
      name: 'Username',
      minWidth: '200px',
      selector: row => row?.email_id ?? '',
      dataType: 'email',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Display name',
      minWidth: '200px',
      selector: row => row?.display_name ?? '',
      dataType: 'email',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Status',
      minWidth: '15%',
      selector: row => (
        <div>
          {
            row?.is_default ? <div className=' text-success'>Default</div> :
              <div class="form-check form-switch "> <input class="form-check-input form-check-input-sm" type="checkbox" role="switch" id="flexSwitchCheckDefault" defaultChecked={row?.is_active} onChange={() => uptStatus({ id: row?.email_id, is_active: !row.is_active, is_default: row?.is_default })} />
              </div>
          }
        </div>

      ),
      type: 'text',
      isEnable: true
    },
    {
      name: 'Actions',
      minWidth: '10%',
      cell: (row) => {
        return (<div className='d-flex gap-'>
          <button className='btn' style={{ padding: "5px 10px" }} onClick={() => { setViewType('view'); toggle() }}> <Eye size={16} /></button>
          <button className='btn ' style={{ padding: "5px 10px" }} onClick={() => {
            setViewType('edit')
            toggle()
            setSenderData({
              mailtype: row.mailtype,
              smtp_port: row.smtp_port,
              smtp_host: row.smtp_host,
              security: row.security,
              email_id: row.email_id,
              password: row.password,
              display_name: row.display_name,
              is_active: row.is_active,
              is_default: row.is_default,
              mail_id: row.id
            })
          }}><Edit size={16} /></button>

          {
            !row?.is_default && <button className='btn ' style={{ padding: "5px 10px" }} onClick={() => { setDelID(row?.id); toggle2() }} ><Trash size={18} /></button>
          }
          {
            !row?.is_default && <button className='btn border btn-sm' style={{ padding: "5px 10px" }} onClick={() => { uptStatus({ id: row?.email_id, is_active: row.is_active, is_default: !row?.is_default }) }} >Set as Default</button>
          }


        </div>
        )
      },
      isEnable: true
    }
  ]
  const customButton1 = () => {
    return <button className='btn btn-primary' onClick={() => { toggle(); setViewType('add'); setSenderData(defaultData) }}>Add SMTP Server</button>
  }


  const validateData = () => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (useSenderData.display_name === '') {
      toast.error("Display name is required")
      return false
    }
    if (useSenderData.smtp_host === '') {
      toast.error("Host is required")
      return false
    }
    // if (!useSenderData.email_id.match(validRegex)) {
    //   toast.error("Invalid username")
    //   return false
    // }
    if (!useSenderData.password === '') {
      toast.error("Password is required")
      return false
    }
    return true
  }
  const handleForm = (isClose) => {
    // console.log("useReceiverData", useReceiverData)
    if (!validateData()) {
      return false
    }
    console.log("useViewType", useViewType)
    console.log("useSenderData", useSenderData)

    // return null
    const form_data = new FormData()
    Object.entries(useSenderData).map(([key, value]) => {
      form_data.append(key, value)
    })
    form_data.append("login_email_id", useSenderData.email_id)

    setLoader(true)
    useViewType === "add" ?
      postReq("mail_info", form_data) :
      putReq("mail_info", form_data)
        .then((res) => {
          console.log(res)
          toast.success("SMTP Saved!")
          if (isClose) {
            setModal(false)
          }
          getSenderData()
        }).catch((err) => {
          console.log(err)
          toast.error(err.response.data.message)

        }).finally(() => { setLoader(false) })
  }
  const CheckConnection = () => {

    // console.log("useReceiverData", useReceiverData)
    if (!validateData()) {
      return false
    }
    // return null
    const form_data = new FormData()
    Object.entries(useSenderData).map(([key, value]) => {
      form_data.append(key, value)
    })
    form_data.append("login_email_id", useSenderData.email_id)

    setLoader(true)
    postReq("email_check", form_data)
      .then((res) => {
        console.log(res)
        toast.success("Connection Successful!")
        getSenderData()
      }).catch((err) => {
        console.log(err)
        toast.error("Connection failed!")


      }).finally(() => { setLoader(false) })
  }
  return (
    <div>
      {
        useLoader && <FrontBaseLoader />
      }
      <div>
        {/* <h3>Sender Credentials</h3> */}
        <div className='border p-2 rounded-2 '>

          <AdvanceServerSide
            tableName="SMTP Credentials"
            tableCol={columns}
            data={tableData}
            count={1}
            getData={getSenderData}
            isLoading={isLoading}
            advanceFilter={false}
            customButtonRight={customButton1}

          />
        </div>

      </div>
      {/*Sender modal */}

      <Modal size='lg' isOpen={modal} toggle={toggle} >
        <ModalHeader  toggle={toggle}>
          <h4 className='m-0'>SMTP Credentials</h4>
        </ModalHeader>
       
        {
          useLoader && <FrontBaseLoader />
        }
        <ModalBody style={{ minHeight: "200px" }}>
          <Row>
            <Col md="4">
              <div className='mt-2'>
                <h5 className="">Host</h5>
                <Select
                  className=''
                  options={hostNameList}
                  closeMenuOnSelect={true}
                  // value={{ value: hostName.gmail, label: 'Gmail' }}
                  value={uptDropDown()}
                  onChange={(e) => setSenderData({ ...useSenderData, smtp_host: e.value })}
                />
              </div>
            </Col>
            <Col md="4">
              <div className='mt-2'>
                <h5 className="">Security</h5>
                <Select
                  className=''
                  options={SecurityList}
                  closeMenuOnSelect={true}
                  value={{ value: useSenderData.security, label: useSenderData.security }}

                  onChange={(e) => setSenderData({ ...useSenderData, security: e.value })}
                />
              </div>
            </Col>
            <Col md="4">
              <div className='mt-2'>
                <h5 className="">Host</h5>
                <Select
                  className=''
                  options={PortList}
                  closeMenuOnSelect={true}

                  value={{ value: useSenderData.smtp_port, label: useSenderData.smtp_port }}
                  onChange={(e) => setSenderData({ ...useSenderData, smtp_port: e.value })}
                />
              </div>
            </Col>


            <Col md="6">
              <div className='mt-2'>
                <h5 className="">Display Name</h5>
                <input
                  type="text"
                  className="form-control "
                  placeholder='Display Name'
                  name='display_name'
                  value={useSenderData.display_name}
                  onChange={handleSenderInputChange}
                />
              </div>
            </Col>
            {
              (useSenderData.smtp_host !== hostName.gmail && useSenderData.smtp_host !== hostName.outlook && useSenderData.smtp_host !== hostName.hotmail) ?
                <Col md="6">
                  <div className='mt-2'>
                    <h5 className="">Custom Host</h5>
                    <input
                      type="text"
                      className="form-control "
                      placeholder='Host'
                      name='smtp_host'
                      value={useSenderData.smtp_host}
                      onChange={handleSenderInputChange}
                    />
                  </div>
                </Col> :
                <Col md="6">
                  <div className='mt-2'>
                    <h5 className="">Host</h5>
                    <input
                      type="text"
                      className="form-control "
                      placeholder='Host'
                      name='smtp_host'
                      value={useSenderData.smtp_host}
                      disabled
                    />
                  </div>
                </Col>
            }

            <Col md="6">
              <div className='mt-2'>
                <h5 className="">Username</h5>
                <input
                  type="text"
                  className="form-control "
                  placeholder='Username'
                  name='email_id'
                  value={useSenderData.email_id}
                  onChange={handleSenderInputChange}
                />
              </div>
            </Col>
            <Col md="6">
              <div className='mt-2  '>
                <h5 className="">Password</h5>
                <div className='position-relative'>
                  <input
                    type={useShowPass ? "text" : "password"}
                    className="form-control "
                    placeholder='Password'
                    name='password'
                    value={useSenderData.password}
                    onChange={handleSenderInputChange}
                  />
                  <div className=' position-absolute top-0 end-0 me-2 ' style={{ marginTop: "5px" }} onClick={() => setShowPass(!useShowPass)}>
                    {
                      !useShowPass ? <Eye size={14} /> : <EyeOff size={14} />
                    }

                  </div>
                </div>
              </div>
            </Col>

          </Row>

        </ModalBody>
        <ModalFooter className='d-flex justify-content-between mt-2' >

          <div className={`btn btn-primary `} onClick={CheckConnection}>
            Test
          </div>
          <div className='d-flex gap-1'>
            <div className='btn btn-primary' onClick={toggle}>
              Cancel
            </div>
            {
              useViewType === 'view' && <div className='btn btn-primary' onClick={() => setViewType('edit')} >
                Edit
              </div>
            }
         
            {
              useViewType === 'edit'  && <div className='btn btn-primary' onClick={() => handleForm("")} >
                Save
              </div>
            }
            {
              useViewType === 'add' && <div className='btn btn-primary' onClick={() => handleForm()} >
                Save
              </div>
            }
               {
              (useViewType === 'edit' || useViewType === 'add') && <div className='btn btn-primary' onClick={() => handleForm("close")} >
                Save & Close
              </div>
            }
          </div>
        </ModalFooter>
      </Modal>

      {/* deleted */}
      <Modal isOpen={modal2} toggle={toggle2} >
        <ModalHeader toggle={toggle2} className='border-bottom'>Confirm Delete</ModalHeader>
        <ModalBody>
          <h5>Are you sure you want to delete this credentials?</h5>
        </ModalBody>
        <ModalFooter>
          <div className='btn' onClick={toggle2}>
            Cancel
          </div>
          <div className='btn btn-danger' onClick={() => { deleteEmail(DelID) }} >
            Delete
          </div>

        </ModalFooter>
      </Modal>
    </div>
  )
}
