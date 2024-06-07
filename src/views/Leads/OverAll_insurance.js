import { Col, Row, Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
import { useRef, useState } from "react"
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
import { Edit3, Eye, Trash2 } from "react-feather"
import { LuTrendingUp } from "react-icons/lu"
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia"
import { PiMoneyThin } from "react-icons/pi"
import { Link } from "react-router-dom"
import moment from "moment/moment"
import { baseURL, crmURL, postReq } from "../../assets/auth/jwtService"
import { FiUpload } from "react-icons/fi"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"

/* eslint-disable */
const Customers = () => {
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fileData, setFileData] = useState({})
  const containerRef = useRef(null)
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const fileInputRef = useRef(null)
  // const [selected, setSelected] = useState([])
  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    setIsLoading(true)
    const form_data = new FormData()
    // const url = new URL(`${crmURL}/customers/merchant/all_cust_dashboard/`)
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
    form_data.append("slug", "add_insurance")
    // form_data.append("table_name", "today_insurance")
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)

    // fetch(url, {
    //   method: "POST",
    //   body: form_data
    // })
    postReq("insurance_dashboard", form_data, crmURL)
      .then((resp) => {
        console.log("pp", resp)
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
  const toggle = (num) => {
    if (num === 1) {
      setModal1(!modal1)
    } else {
      setModal2(!modal2)
      setFileData()
    }
  }

  const columns = [
    {
      name: "Created On",
      minWidth: "200px",
      selector: (row) => row?.insurance_created_at ? moment(row.insurance_created_at).format("YYYY-MM-DD") : "-",
      type: 'date',
      isEnable: true
    },
    {
      name: "Customer Name",
      minWidth: "150px",
      selector: (row) => (
        <Link to={`/merchant/customers/view_customer/${row?.xircls_customer_id}`}>{row?.insurance_customer_name ? row.insurance_customer_name : "-"}</Link>
      ),
      type: 'text',
      isEnable: true
    },
    {
      name: "Brand",
      minWidth: "150px",
      selector: (row) => row?.insurance_brand ? row.insurance_brand : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Model",
      minWidth: "200px",
      selector: (row) => row?.insurance_model ? row.insurance_model : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Variant",
      minWidth: "200px",
      selector: (row) => row?.insurance_variant ? row.insurance_variant : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Policy Number",
      minWidth: "200px",
      selector: (row) => row?.insurance_policy_number ? row.insurance_policy_number : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Insurance Company",
      minWidth: "200px",
      selector: (row) => row?.insurance_insurance_company ? row.insurance_insurance_company : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Policy Purchase Date",
      minWidth: "200px",
      selector: (row) => row?.insurance_policy_purchase_date ? moment(row.insurance_policy_purchase_date).format("YYYY-MM-DD") : "-",
      type: 'date',
      isEnable: true
    },
    {
      name: "Policy Expiry Date",
      minWidth: "200px",
      selector: (row) => row?.insurance_policy_expiry_date ? moment(row.insurance_policy_expiry_date).format("YYYY-MM-DD") : "-",
      type: 'date',
      isEnable: true
    },
    {
      name: "Amount",
      minWidth: "200px",
      selector: (row) => row?.insurance_amount ? row.insurance_amount : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Created By",
      minWidth: "250px",
      selector: (row) => <div className="py-1">
        <h6>{row?.insurance_created_by ? row?.insurance_created_by : row?.super_user_name}</h6>
        <p className="m-0">{row?.insurance_created_by_email ? row?.insurance_created_by_email : row?.super_user_email}</p>
      </div>,
      type: 'text'
    },
    {
      name: "Action",
      width: "130px",
      selector: (row) => (
        <div className="d-flex ms-1 justify-content-center align-items-center text-center gap-1">
          {/* <Link to={`/merchant/customers/view_customer/${row?.xircls_customer_id}`}><Eye size={15} /></Link> */}
          <Link to={`/merchant/customers/insurance/edit_insurance/${row?.insurance_id}?type=edit`}> <Edit3 size={15} /></Link>
        </div>
      )
    }
  ]

  const uploadFile = (file, conflict) => {
    const form_data = new FormData()
    console.log('csvFile', fileData)
    form_data.append('csvFile', file)
    form_data.append('check_conflict', conflict)
    setLoader(true)
    postReq('import_insurance', form_data)
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
        uploadFile(file, 'TRUE')
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

  const customButton2 = () => {
    return <button className='btn btn-primary' onClick={() => toggle(2)}>Import Insurance Details </button>
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

  console.log("Main TableData", tableData)

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <AdvanceServerSide
                tableName="All Insurance"
                tableCol={columns}
                data={tableData?.data}
                isLoading={isLoading}
                getData={getData}
                count={tableData?.recordsTotal}
                exportUrl={`${crmURL}/insurance/insurance_dashboard/`}
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
                  <h5 className='m-0 text-center mt-1 px-3 fs-6 '><a href={`${baseURL}/static/images/website-slide/insurance_example.csv`} className="text-primary cursor-pointer" download>Click here</a>  to download dummy CSV Format file. </h5>

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
    </>
  )
}

export default Customers
