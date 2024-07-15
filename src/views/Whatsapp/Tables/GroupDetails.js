
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react'
import { ArrowLeft } from 'react-feather'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import { Card, CardBody, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { baseURL, postReq } from '../../../assets/auth/jwtService'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import FrontBaseLoader from '../../Components/Loader/Loader'
import { FiUpload } from 'react-icons/fi'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
export default function GroupDetails() {
  const { name, id } = useParams()
  const [useLoader, setLoader] = useState(false)
  const [tableData, settableData] = useState([])
  const [useSelectedRows, setSelectedRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalData, settotalData] = useState(0)
  const [modal2, setModal2] = useState(false)
  const [fileData, setFileData] = useState({})
  const fileInputRef = useRef(null)
  const containerRef = useRef(null)

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

  const uploadFile = (file) => {
    const form_data = new FormData()
    console.log('csvFile', fileData)
    form_data.append('csvFile', file)
    form_data.append('group_list', id)
    setLoader(true)
    postReq('group_import_customer', form_data)
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
    return <div className='d-flex justify-content-end align-items-center gap-1'>

      <button className='btn btn-primary' onClick={() => setModal2(!modal2)}>Import contacts </button>

      <Link to='/merchant/whatsapp/whatsapp_contact/' className='btn btn-primary'>Add Contacts </Link>
    </div> 
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

        <Modal size='lg' isOpen={modal2} toggle={() => setModal2(!modal2)} >
          <ModalHeader toggle={() => setModal2(!modal2)}></ModalHeader>
          <ModalBody>
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
                  <h5 className='m-0 text-center mt-1 px-3 fs-6 '><a href={`${baseURL}/static/template_document/contact.csv`} className="text-primary cursor-pointer" download>Click here</a>  to download dummy CSV Format file. </h5>

                </div> : <>
                  <h1 className=' text-center mt-2 fs-2 fw-bolder text-start main-heading'>{fileData.name}</h1>
                  <div className='rounded-3 d-grid align-content-center mt-3 cursor-pointer' style={{ border: '2px dashed #cecdcd', width: '400px', height: '200px' }}>
                    <div className='d-flex justify-content-center'>
                      <IoIosCheckmarkCircleOutline size={120} color='green' />
                    </div>
                    <h5 className='m-0 text-center mt-1 fw-medium'>{fileData.name}</h5>
                  </div>
                </>}
              </div>
            </div>
          </ModalBody>
        </Modal>

      </Row>

    </>

  )
}