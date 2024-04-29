
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { FiUpload } from "react-icons/fi"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import toast from 'react-hot-toast'
import { baseURL, getReq, postReq } from '../../../assets/auth/jwtService'
import FrontBaseLoader from '../../Components/Loader/Loader'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import Select from 'react-select'
import { Edit, Trash } from 'react-feather'
export default function EmailTable() {
  const [fileData, setFileData] = useState({})
  const [useLoader, setLoader] = useState(false)
  const fileInputRef = useRef(null)
  const containerRef = useRef(null)
  const [tableData, setTableData] = useState([])
  const [useSelectedRows, setSelectedRows] = useState([])
  const [useSelectedGroups, setSelectedGroups] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalData, settotalData] = useState(0)
  const [useGroupList, setGroupList] = useState([])
  const [useDelID, setDelID] = useState('')
  const [useShowTime, setShowTime] = useState(false)

  const [useFormData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: ""
  })
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [modal3, setModal3] = useState(false)
  const [modal4, setModal4] = useState(false)
  const toggle4 = () => {
    setModal4(!modal4)
  }
  const toggle3 = () => {
    setModal3(!modal3)
  }
  const toggle = (num) => {
    if (num === 1) {
      setModal1(!modal1)
    } else {
      setModal2(!modal2)
      setFileData()
    }
  }
  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    const form_data = new FormData()
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))

    setIsLoading(true)
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)
    postReq("email_details", form_data)
      .then(response => {
        // Handle the successful response here
        console.log('Response:', response)
        setTableData(response.data.contact_details_obj)
        settotalData(response.data.contact_count)
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
      }).finally(() => setIsLoading(false))
  }
  // add manual data

  // csv upload start
  const uploadFile = (file) => {
    const form_data = new FormData()
    console.log('csvFile', fileData)
    form_data.append('csvFile', file)
    setLoader(true)
    postReq('import_email', form_data)
      .then(res => {
        console.log(res)
        if (res.data.success) {
          toast.success(res.data.message)
          getData()
          setModal2(false)
        } else if (res.data.message) {
          toast.alert(res.data.message)
        } else {
          toast.alert("Something went wrong")
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          // Handle 500 error
          toast.error('Internal Server Error')
        } else {
          // Handle other errors
          console.log(error)
        }

      }).finally(() => setLoader(false))


  }
  const handleFile = (file) => {
    console.log('Selected file:', file)
    if (file) {
      const isCSV = file.name.toLowerCase().endsWith('.csv')
      if (isCSV) {
        console.log('Selected file:', file)
        setFileData(prev => (file))
        uploadFile(file)
      } else {
        toast.error('Please select a CSV file.')
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    console.log('Selected file:', selectedFile)
    handleFile(selectedFile)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    containerRef.current.style.cursor = 'alias'

  }

  const handleDragLeave = () => {
    containerRef.current.style.cursor = 'auto'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    containerRef.current.style.cursor = 'auto'
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }


  const handleDelete = (list) => {
    const form_data = new FormData()
    // console.log(useSelectedRows.map(elm => elm.contact_details_id))
    if (list) {
      form_data.append('contact_list', [list])

    } else {
      form_data.append('contact_list', useSelectedRows.map(elm => elm.contact_details_id))

    }
    postReq(`email_delete`, form_data)
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
  const customButton1 = () => {
    return useSelectedRows.length > 0 ? <button className='btn btn-outline-danger' onClick={handleDelete} >Delete </button> : false
  }
  const customButton2 = () => {
    return (
      <div className="d-flex gap-1">
        <Link to="/merchant/Email/addEmail" className='btn btn-primary' >Add Contact/s</Link>
        <button className='btn btn-primary' onClick={() => toggle(2)}>Import CSV</button>
      </div>
    )
  }
  const columns = [
    {
      name: 'First Name',
      minWidth: '200px',
      selector: row => row?.contact_first_name ?? '', // Assuming 'name' is the property in your data for the name
      dataType: 'email',
      type: 'text',
      isEnable: true
    },
    {
      name: 'Last Name',
      minWidth: '15%',
      selector: row => row?.contact_last_name ?? '', // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Email',
      minWidth: '15%',
      selector: row => row?.contact_details_email ?? '', // Assuming 'category' is the property in your data for the category
      type: 'select',
      isEnable: true
    },
    {
      name: 'Actions',
      minWidth: '10%',
      cell: (row) => {
        return (<div className='d-flex gap-'>
          <button className='btn ' style={{ padding: "5px 10px" }} onClick={() => {
            setModal3(true); setDelID(row.contact_details_id)
             setFormData({
              id: row?.contact_details_id,
              first_name:  row?.contact_first_name,
              last_name:  row?.contact_last_name,
              email:  row?.contact_details_email
            })
          }} ><Edit size={18} /></button>
          <button className='btn ' style={{ padding: "5px 10px" }} onClick={() => { setModal4(true); setDelID(row.contact_details_id) }} ><Trash size={18} /></button>

          {/* {row.group_contact !== 0 && <Link to={`/merchant/Email/templates/${row.group_id}`} className='btn btn-primary ms-1' style={{padding:"5px 10px" }}>Send Messages</Link> } */}
        </div>
        )
      },
      isEnable: true
    }
  ]
  useEffect(() => {
    const form_data = new FormData()
    form_data.append("page", 1)
    form_data.append("size", 1000)
    form_data.append("searchValue", '')
    postReq("email_group_base_details", form_data)
      .then((resp) => {
        const list = []
        console.log("resp grouplost:", resp.data.group_details_obj)
        resp.data.group_details_obj.map((elm) => list.push({ value: elm.group_id, label: elm.group_name }))
        setGroupList(list)
      }).catch((err) => {
        console.log(err)
      })
  }, [])

  const handleAddToGroup = () => {
    const formData = new FormData()
    formData.append("group_list", useSelectedGroups.map((elm) => elm.value))
    formData.append("contact_list", useSelectedRows.map((elm) => elm.contact_details_id))
    formData.append("add", 'True')
    postReq("email_group_contact", formData)
      .then(res => {
        console.log('res add group:', res)
        if (res.data.success) {
          toast.success("Emails added to Groups")
          setModal1(false)
        } else {
          toast.error("Something went wrong!")
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error)
      })
  }
  const confirmationContent = <button className='btn btn-primary' onClick={() => toggle(1)}>Add to Group </button>
  return (
    <>
      {
        useLoader && <FrontBaseLoader />
      }
      <Row >
        <Card>
          <CardBody>

            <AdvanceServerSide
              tableName="Contacts"
              tableCol={columns}
              data={tableData}
              count={totalData}
              getData={getData}
              selectableRows={true}
              setSelectedRows={setSelectedRows}
              selectedRows={useSelectedRows}
              selectedContent={confirmationContent}
              isLoading={isLoading}
              advanceFilter={false}
              customButtonLeft={customButton1}
              customButtonRight={customButton2}

            />
          </CardBody>
        </Card>

        {/* modal1 add to group */}
        <Modal size='lg' isOpen={modal1} toggle={() => toggle(1)} >
          <ModalHeader toggle={() => toggle(1)}>Select Groups</ModalHeader>
          <ModalBody style={{ minHeight: "200px" }}>


            <h6 className='mt-4'>You can select multiple groups</h6>
            <Select
              isMulti
              name="colors"
              options={useGroupList}
              className="basic-multi-select"
              classNamePrefix="select"
              // onChange={(e) => console.log(e)  }  
              onChange={(e) => setSelectedGroups(e)}
              styles={{
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: '#82878cff', // Change the background color of selected options
                  color: 'black',
                  borderRadius: '10px' // Change the border radius
                })
              }}
            />
          </ModalBody>
          <ModalFooter>
            <div className='btn' onClick={() => toggle(1)}>
              Cancel
            </div>
            <Button color="primary" onClick={handleAddToGroup}>
              Save
            </Button>
          </ModalFooter>
        </Modal>

        {/* modal 2 upload file*/}
        <Modal size='lg' isOpen={modal2} toggle={() => toggle(2)} >
          <ModalHeader toggle={() => toggle(2)}></ModalHeader>
          <ModalBody >
            <div className='d-grid align-items-center  pb-3'>
              <div className='d-flex flex-column justify-content-center align-items-center '>
                {!(fileData?.name) ? <div className='d-flex flex-column justify-content-center align-items-center '>
                  <h1 className=' text-center mt-2 fs-2 fw-bolder text-start main-heading'>Upload Your File</h1>
                  <h5 className='m-0 text-center '>Before uploading, please make sure that your file is in CSV format.</h5>
                  <div className='rounded-3 d-grid align-content-center mt-2 cursor-pointer' id='drag-container' ref={containerRef} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed #cecdcd', width: '400px', height: '200px', backgroundColor: '#f3f3f3' }}>
                    <div className='d-flex justify-content-center'>
                      <FiUpload scale={6} size={50} />
                    </div>
                    <p className='m-0 text-center mt-1 fw-medium cursor-pointer'>Drag and drop or <a>choose you file</a> to start uploading.</p>
                    <p className='m-0 text-center fw-medium cursor-pointer' >Only .csv format is supported.</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className='d-none'
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                  </div>
                  <h5 className='m-0 text-center mt-1 px-3 fs-6 '><a href={`${baseURL}/static/template_document/contact.csv`} className="text-primary cursor-pointer" download>Click here</a>  to download sample CSV format file. </h5>

                </div> : <>
                  {/* <h1 className=' text-center mt-2 fs-2 fw-bolder text-start main-heading'>Your File has been uploaded</h1> */}
                  <h1 className=' text-center mt-2 fs-2 fw-bolder text-start main-heading'>{fileData.name}</h1>
                  {/* <h5 className='m-0 text-center '>{fileData.name}</h5> */}
                  <div className='rounded-3 d-grid align-content-center mt-3 cursor-pointer' style={{ border: '2px dashed #cecdcd', width: '400px', height: '200px' }}>
                    <div className='d-flex justify-content-center'>
                      <IoIosCheckmarkCircleOutline size={120} color='green' />
                    </div>
                    <h5 className='m-0 text-center mt-1 fw-medium'>{fileData.name}</h5>
                  </div>
                  {/* <div className='d-flex '>

                    <button className='m-0 text-center mt-1 px-3 fw-medium btn  ' onClick={() => setFileData()}>Clear</button>
                    <button className='m-0 text-center mt-1 px-3 fw-medium btn btn-primary ' onClick={uploadFile}>Upload</button>
                  </div> */}
                </>}
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* edit contact*/}
        <Modal isOpen={modal3} toggle={toggle3} >
          <ModalHeader toggle={toggle3}>
            Edit Contact
          </ModalHeader>
          <ModalBody style={{ minHeight: "200px" }}>

            <div className='mt-1 form-group'>
              <h5>First Name</h5>
              <input type="text" name="first" value={useFormData.first_name} className='form-control' placeholder='first name' />
            </div>
            <div className='mt-1 form-group'>
              <h5>Last Name</h5>
              <input type="text" name="last" value={useFormData.last_name} className='form-control' placeholder='last name' />
            </div>
            <div className='mt-1 form-group'>
              <h5>Email</h5>
              <input type="text" name="email" value={useFormData.email} className='form-control' placeholder='email' />
            </div>

          </ModalBody>
          <div className='d-flex justify-content-between mt-2 p-2 pt-0'>
            <button className=' btn btn-primary  me-2' onClick={() => setModal3(false)}>Cancel</button>
            <div className='d-flex gap-1'>

              <button className=' btn btn-primary' >Save</button>
              <button className=' btn btn-primary' >Save & Close</button>
            </div>
          </div>
        </Modal>

        {/* delete */}
        <Modal isOpen={modal4} toggle={toggle4} >
          <ModalHeader toggle={toggle4} className='border-bottom'>Confirm Delete</ModalHeader>
          <ModalBody>
            <h5>Are you sure you want to delete this contact?</h5>
          </ModalBody>
          <ModalFooter>
            <div className='btn' onClick={toggle4}>
              Cancel
            </div>
            <div className='btn btn-danger' onClick={() => { handleDelete(useDelID); setModal4(false) }} >
              Delete
            </div>

          </ModalFooter>
        </Modal>
      </Row>

    </>
  )
}