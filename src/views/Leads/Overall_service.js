import { Col, Row, Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Input, ModalFooter } from "reactstrap"
import { useRef, useState } from "react"
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
// import { crmURL } from "@src/assets/auth/jwtService.js"
import { Edit3, Eye, Trash2 } from "react-feather"
import { LuTrendingUp } from "react-icons/lu"
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia"
import { PiMoneyThin } from "react-icons/pi"
import { Link } from "react-router-dom"
import moment from "moment/moment"
import { baseURL, crmURL, postReq } from "../../assets/auth/jwtService"
import ComTable from "../Components/DataTable/ComTable"
import { FiUpload } from "react-icons/fi"
import FrontBaseLoader from "../Components/Loader/Loader"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"

/* eslint-disable */
const Customers = () => {
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fileData, setFileData] = useState({})
  // const [selected, setSelected] = useState([])
  const containerRef = useRef(null)
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [fileJson, setFileJson] = useState({})
  // const [searchValue, setSearchValue] = useState('')
  // const [vehicleSearchValue, setVehicleSearchValue] = useState('')
  const [servicingSearchValue, setServicingSearchValue] = useState('')
  // const [filteredData, setFilteredData] = useState([])
  // const [vehicleFilteredData, setVehicleFilteredData] = useState([])
  const [servicingFilteredData, setServicingFilteredData] = useState([])
  const [modal3, setModal3] = useState(false)
  const fileInputRef = useRef(null)
  const [conflictData, setConflictData] = useState([])
  const [conflictDataInput, setConflictDataInput] = useState({
    customer_new:true,
    customer_overflow_write:false,
    vehicle_new:true,
    vehicle_overflow_write:false,
    servicing_new:true,
    servicing_overflow_write:false
  })
  const [useLoader, setLoader] = useState(false)

  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    setIsLoading(true)
    const form_data = new FormData()
    // const url = new URL(`${crmURL}/customers/merchant/all_cust_dashboard/`)
    // form_data.append("draw", "1")
    // form_data.append("length", "10")
    // form_data.append("start", "1")
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
    form_data.append("slug", "add_servicing")
    form_data.append("table_name", "overAll_servicing")
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)

    // fetch(url, {
    //   method: "POST",
    //   body: form_data
    // })
    postReq("servicing_dashboard", form_data, crmURL)
      .then((resp) => {
        console.log("hh", resp)
        setTableData(resp?.data)
        setIsLoading(false)
      })
      .catch((error) => {
        // console.log(error)
        setIsLoading(false)
      })

  }

  //   useEffect(() => {
  //     getData()
  //   }, [])

  const columns = [
    {
      name: "Created On",
      minWidth: "240px",
      selector: (row) => row?.servicing_created_at ? moment(row?.servicing_created_at).format("YYYY-MM-DD") : '',
      type: 'date'
    },
    {
      name: "Customer Name",
      minWidth: "150px",
      selector: (row) => (
        <Link to={`/merchant/customers/view_customer/${row?.xircls_customer_id}`}>{row?.servicing_customer_name ? row.servicing_customer_name : "-"}</Link>
      ),
      type: 'text',
      isEnable: true
    },
    {
      name: "Brand",
      minWidth: "150px",
      selector: (row) => row?.servicing_brand ? row.servicing_brand : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Model",
      minWidth: "200px",
      selector: (row) => row?.servicing_model ? row.servicing_model : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Variant",
      minWidth: "200px",
      selector: (row) => row?.servicing_variant ? row.servicing_variant : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Service Location",
      minWidth: "200px",
      selector: (row) => row?.servicing_service_location ? row.servicing_service_location : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Job Card Date",
      minWidth: "200px",
      selector: (row) => row?.servicing_job_card_date ? moment(row.servicing_job_card_date).format("YYYY-MM-DD") : "-",
      type: 'date',
      isEnable: true
    },
    {
      name: "Service Invoice Date",
      minWidth: "200px",
      selector: (row) => row?.servicing_service_invoice_date ? moment(row.servicing_service_invoice_date).format("YYYY-MM-DD") : '-',
      type: 'date',
      isEnable: true
    },
    {
      name: "Service Expiry Date",
      minWidth: "200px",
      selector: (row) => row?.servicing_service_expiry_date ? moment(row.servicing_service_expiry_date).format("YYYY-MM-DD") : "-",
      type: 'date',
      isEnable: true
    },
    {
      name: "Service Invoice Amount",
      minWidth: "200px",
      selector: (row) => row?.servicing_service_invoice_amount ? row.servicing_service_invoice_amount : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Created By",
      minWidth: "250px",
      selector: (row) => <div className="py-1">
        <h6>{row?.servicing_created_by ? row?.servicing_created_by : row?.super_user_name}</h6>
        <p className="m-0">{row?.servicing_created_by_email ? row?.servicing_created_by_email : row?.super_user_email}</p>
      </div>,
      type: 'text'
    },
    {
      name: "Action",
      width: "130px",
      selector: (row) => (
        <div className="d-flex ms-1 justify-content-center align-items-center text-center gap-1">
          {/* <Link to={`/merchant/customers/view_customer/${row?.xircls_customer_id}`}><Eye size={15} /></Link> */}
          <Link to={`/merchant/customers/add-servicing/${row?.servicing_id}?type=edit`}> <Edit3 size={15} /></Link>
        </div>
      )
    }
  ]
  const toggle = (num) => {
    if (num === 1) {
      setModal1(!modal1)
    } else {
      setModal2(!modal2)
      setFileData()
    }
  }
  const uploadFile = (file, conflict) => {
    const form_data = new FormData()
    console.log('csvFile', fileData)
    form_data.append('csvFile', file)
    form_data.append('check_conflict', conflict)
    form_data.append('TYPE', 'SERVICING')
    Object.entries(conflictDataInput).map(([key, value]) => {
      form_data.append(key, value ? '1' : '0')
    })
    setLoader(true)
    postReq('import_bulk_data', form_data, crmURL)
    .then(res => {
      console.log(res, "=====170")
      if (conflict === "TRUE") {
        if (res?.data?.insurance_obj?.length > 0) {
          setConflictData(res?.data)
          setModal3(true)
        } else {
          uploadFile(file, "FALSE")
        }

      } else {
        getData()
        
        toast.success("File Uploaded SuccessFully")
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

    }).finally(() => {
      setLoader(false)
      setModal2(false)
    })


  }
  const handleFile = (file) => {
    console.log('Selected file:', file)
    if (file) {
      const isCSV = file.name.toLowerCase().endsWith('.csv')
      if (isCSV) {
        console.log('Selected file:', file)
        setFileData(prev => (file))
        uploadFile(file, 'TRUE')
      } else {
        toast.error('Please select a CSV file.')
        fileInputRef.current.value = ''
      }
    }
  }

  const conflictSubmit = () => {
    uploadFile(fileJson, 'FALSE')
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFileJson(e.target.files[0])
    console.log('Selected file:', selectedFile)
    handleFile(selectedFile)
  }

  const customButton2 = () => {
    return <button className='btn btn-primary' onClick={() => toggle(2)}>Import Servicing Details </button>
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

  const servicingHandleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setServicingSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith =
          item.email_id.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.email_id.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setServicingFilteredData(updatedData)
      setServicingSearchValue(value)
    }
  }

  const servicingColumns = [
    {
      name: "Created On",
      minWidth: "200px",
      selector: (row) => row?.created_at ? moment(row.created_at).format("YYYY-MM-DD") : "-",
      type: 'date',
      isEnable: true
    },
    {
      name: "Customer Name",
      minWidth: "150px",
      selector: (row) => (
        <Link to={`/merchant/customers/view_customer/${row?.xircls_customer_id}`}>{row?.customer_name ? row?.customer_name : "-"}</Link>
      ),
      type: 'text',
      isEnable: true
    },
    {
      name: "Email",
      minWidth: "200px",
      selector: (row) => row?.email ?row?.email : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Phone No.",
      minWidth: "200px",
      selector: (row) => row?.phone_no ?row?.phone_no : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Brand",
      minWidth: "150px",
      selector: (row) => row?.brand ? row.brand : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Model",
      minWidth: "200px",
      selector: (row) => row?.car_model ? row.car_model : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Variant",
      minWidth: "200px",
      selector: (row) => row?.variant ? row.variant : "-",
      type: 'text',
      isEnable: true
    }
  ]

  const servicingDefferContent = <>
    <Col className='d-flex align-items-center justify-content-center' md='4' sm='12'>
      <h4 className='m-0'>Servicing</h4>
    </Col>
    <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
      <Input
        className='dataTable-filter form-control ms-1'
        style={{ width: `180px`, height: `2.714rem` }}
        type='text'
        bsSize='sm'
        id='search-input-1'
        placeholder='Search...'
        value={servicingSearchValue}
        onChange={servicingHandleFilter}
      />
    </Col>
  </>

  return (
    <>
    {
      useLoader ? <FrontBaseLoader /> : ''
    }
      <Row>
        <Col>
          <Card>
            <CardBody>
              <AdvanceServerSide
                tableName="All Servicing"
                tableCol={columns}
                data={tableData?.data}
                isLoading={isLoading}
                getData={getData}
                count={tableData?.recordsTotal}
                exportUrl={`${crmURL}/servicing/servicing_dashboard/`}
                isExport={true}
                // selectableRows={true}
                // setSelectedRows={setSelected}
                // selectedRows={selected}
                advanceFilter={true}
                customButtonRight={customButton2}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
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
                  <h5 className='m-0 text-center mt-1 px-3 fs-6 '><a href={`${baseURL}/static/images/website-slide/servicing_example.csv`} className="text-primary cursor-pointer" download>Click here</a>  to download dummy CSV Format file. </h5>

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


      <Modal size='xl' isOpen={modal3} toggle={() => setModal3(!modal3)} >
        <ModalHeader toggle={() => setModal3(!modal3)}></ModalHeader>
          
          <ModalBody>
            <div className="p-2">
              <div className="row">

                <div className="col-md-12">
                  <ComTable
                    // tableName="Verified Email"
                    custom={true}
                    content={servicingDefferContent}
                    tableCol={servicingColumns}
                    data={conflictData?.insurance_obj}
                    searchValue={servicingSearchValue}
                    // handleFilter={handleFilter}
                    filteredData={servicingFilteredData}
                  />
                  <div className="pb-1 Customer">
                    <h5>Customer</h5>
                    <div className="main d-flex justify-content-start algin-items-center my-1 gap-1">
                      <div className="form-check d-flex align-items-center mx-0 p-0" style={{gap: '5px'}}>
                        <input checked={conflictDataInput?.customer_new} id="customer_new" type="checkbox" name='title' min="0" max="300" className='form-check-input m-0' onChange={(e) => setConflictDataInput({ ...conflictDataInput, customer_new: !conflictDataInput?.customer_new })} />
                        <label htmlFor='customer_new' style={{ fontSize: "0.85rem", width: '100%' }} className="form-check-label m-0 p-0">Create New</label>
                      </div>
                      <div className="form-check d-flex align-items-center mx-0 p-0" style={{gap: '5px'}}>
                        <input checked={conflictDataInput?.customer_overflow_write} id="customer_overflow_write" type="checkbox" name='title' min="0" max="300" className='form-check-input m-0' onChange={(e) => setConflictDataInput({ ...conflictDataInput, customer_overflow_write: !conflictDataInput?.customer_overflow_write })} />
                        <label htmlFor='customer_overflow_write' style={{ fontSize: "0.85rem", width: '100%' }} className="form-check-label m-0 p-0">Over Write</label>
                      </div>
                      {/* <div className="form-check d-flex align-items-center mx-0 p-0" style={{gap: '5px'}}>
                        <input id="customer_both" type="checkbox" name='title' min="0" max="300" className='form-check-input m-0' onChange={(e) => setConflictDataInput({ ...conflictDataInput, customer_both: !conflictDataInput?.customer_both })} />
                        <label htmlFor='customer_both' style={{ fontSize: "0.85rem", width: '100%' }} className="form-check-label m-0 p-0">Both</label>
                      </div> */}
                    </div>
                  </div>
                  <div className="pb-1 Vehicle">
                    <h5>Vehicle</h5>
                    <div className="main d-flex justify-content-start algin-items-center my-1 gap-1">
                      <div className="form-check d-flex align-items-center mx-0 p-0" style={{gap: '5px'}}>
                        <input checked={conflictDataInput?.vehicle_new} id="vehicle_new" type="checkbox" name='title' min="0" max="300" className='form-check-input m-0' onChange={(e) => setConflictDataInput({ ...conflictDataInput, vehicle_new: !conflictDataInput?.vehicle_new })} />
                        <label htmlFor='vehicle_new' style={{ fontSize: "0.85rem", width: '100%' }} className="form-check-label m-0 p-0">Create New</label>
                      </div>
                      <div className="form-check d-flex align-items-center mx-0 p-0" style={{gap: '5px'}}>
                        <input checked={conflictDataInput?.vehicle_overflow_write} id="vehicle_overflow_write" type="checkbox" name='title' min="0" max="300" className='form-check-input m-0' onChange={(e) => setConflictDataInput({ ...conflictDataInput, vehicle_overflow_write: !conflictDataInput?.vehicle_overflow_write })} />
                        <label htmlFor='vehicle_overflow_write' style={{ fontSize: "0.85rem", width: '100%' }} className="form-check-label m-0 p-0">Over Write</label>
                      </div>
                      {/* <div className="form-check d-flex align-items-center mx-0 p-0" style={{gap: '5px'}}>
                        <input id="vehicle_both" type="checkbox" name='title' min="0" max="300" className='form-check-input m-0' onChange={(e) => setConflictDataInput({ ...conflictDataInput, vehicle_both: !conflictDataInput?.vehicle_both })} />
                        <label htmlFor='vehicle_both' style={{ fontSize: "0.85rem", width: '100%' }} className="form-check-label m-0 p-0">Both</label>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
                    

                    
            </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-between align-items-center">
            <a className="btn btn-outline" onClick={() => setModal3(!modal3)}>Cancel</a>
            <a className="btn btn-primary" onClick={() => conflictSubmit()}>Submit</a>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default Customers
