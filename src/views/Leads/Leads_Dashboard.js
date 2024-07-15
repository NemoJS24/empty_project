/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react'
import { FaGear } from "react-icons/fa6"
import { PiGear } from "react-icons/pi"
import { Card, CardBody, CardHeader, Button, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap"
import { Link } from "react-router-dom"
import { BiUser } from "react-icons/bi"
import { Edit3, Eye, Trash2 } from "react-feather"
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
import { crmURL, getReq, postReq } from "../../assets/auth/jwtService"
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { FiUpload } from 'react-icons/fi'
import toast from 'react-hot-toast'
import FrontBaseLoader from '../Components/Loader/Loader'

const Leads_dashboard = () => {
   const [tableData, setTableData] = useState([])
   const [isLoading, setIsLoading] = useState(true)
   const [selected, setSelected] = useState([])
   const [leadStageOptions, setLeadStageOptions] = useState([])
   const [modal2, setModal2] = useState(false)
   const [fileData, setFileData] = useState({})
   const fileInputRef = useRef(null)
   const containerRef = useRef(null)
   const [useLoader, setLoader] = useState(false)

   const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
      setIsLoading(true)
      const form_data = new FormData()
      Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
      form_data.append("page", currentPage + 1)
      form_data.append("size", currentEntry)
      form_data.append("searchValue", searchValue)

      postReq("leadstable_get_view", form_data)
      .then((resp) => {
         console.log("sdsadad", resp.data)
         setTableData(resp.data)
      })
      .catch((error) => {
         console.log(error)
      })
      .finally(() => {
         setIsLoading(false)
      })

   }

   const fetchStageOptions = () => {
      getReq('leads_stage_get', '')
      .then(res => {
         // console.log(res.data)
         const leadStageOptions = []
         res.data.data.forEach((item) => {
            leadStageOptions.push({
               value: item.stage,
               label: item.stage
            })
         })
         setLeadStageOptions(leadStageOptions)
      })
      .catch((error) => {
         console.error("Error:", error)
      })
   }

   const customButton2 = () => {
      return <div className='d-flex justify-content-end align-items-center gap-1'>
  
        <button className='btn btn-primary' onClick={() => setModal2(!modal2)}>Import </button>
      </div> 
    }

   const uploadFile = (file) => {
      const form_data = new FormData()
      console.log('csvFile', fileData)
      form_data.append('csvFile', file)
      // form_data.append('group_list', id)
      setLoader(true)
      postReq('import_leads', form_data)
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

   useEffect(() => {
      fetchStageOptions()
   }, [])

   console.log(tableData, "tableData")

   const leadsStatisticsData = [
      {
         name: "All Leads",
         data: tableData?.recordsTotal ?? '0',
         type: "number",
         icon: <BiUser size={30} className="text-warning m-auto" />,
         iconStyle: "bg-warning bg-opacity-25"
      },
      {
         name: "Hot Leads",
         data: tableData?.hot_count ?? '0',
         type: "number",
         icon: <BiUser size={30} className="text-info m-auto" />,
         iconStyle: "bg-info bg-opacity-25"
      },
      {
         name: "Warm Leads",
         data: tableData?.warm_count ?? '0',
         type: "number",
         icon: <BiUser size={30} className="text-danger m-auto" />,
         iconStyle: "bg-danger bg-opacity-25"
      },
      {
         name: "Cold Leads",
         data: tableData?.cold_count ?? '0',
         type: "number",
         icon: <BiUser size={30} className="text-success m-auto" />,
         iconStyle: "bg-success bg-opacity-25"
      }
   ]

   const columns = [
      {
         name: "Name",
         minWidth: "130px",
         selector: (row) => (
            <Link to={`/merchant/customers/view_lead/${row?.lead_user_id}`}>{row?.lead_customer_name}</Link>
         ),
         type: 'text',
         isEnable: true
      },
      {
         name: "Mobile",
         minWidth: "130px",
         selector: (row) => (row?.lead_phoneno),
         type: 'text',
         isEnable: true
      },
      {
         name: "Email ID",
         minWidth: "250px",
         selector: (row) => (row?.lead_email),
         type: 'text',
         isEnable: true
      },
      {
         name: "Stage",
         minWidth: "100px",
         selector: (row) => (row.lead_stage),
         type: 'select',
         options: leadStageOptions,
         isEnable: true
      },
      {
         name: "Source",
         minWidth: "100px",
         selector: (row) => (row?.lead_cust_source_dropdown),
         type: 'select',
         options: [
            { value: '', label: 'Select Source' },
            { value: 'Walk-In', label: 'Walk-In' },
            { value: 'Phone Enquiry', label: 'Phone Enquiry' },
            { value: 'Sales Cold Call', label: 'Sales Cold Call' },
            { value: 'Website', label: 'Website' },
            { value: 'Email Campaign', label: 'Email Campaign' },
            { value: 'Paid Ads', label: 'Paid Ads' },
            { value: 'Partner Referral', label: 'Partner Referral' },
            { value: 'Customer Referral', label: 'Customer Referral' },
            { value: 'Employee Referral', label: 'Employee Referral' },
            { value: 'Other', label: 'Other' }
         ],
         isEnable: true
      },
      {
         name: "Company",
         minWidth: "120px",
         selector: (row) => (row?.lead_associated_accounts),
         type: 'text'
      },
      // {
      //   name: "Last Contacted Date",
      //   minWidth: "120px",
      //   selector: (row) => (row?.finance_loan_disbursement_date ? moment(row.finance_loan_disbursement_date).format("YYYY-MM-DD") : "--"),
      //   type: 'date',
      //   isEnable: true
      // },
      // {
      //   name: "Follow-Up",
      //   minWidth: "120px",
      //   selector: (row) => (row?.finance_rate_of_interest ? row.finance_rate_of_interest : "--"),
      //   type: 'text'
      // },
      // {
      //   name: "Created By",
      //   minWidth: "120px",
      //   selector: (row) => (row?.finance_loan_amount),
      //   type: 'text'
      // },
      {
         name: "Action",
         width: "130px",
         selector: (row) => (
            <div className="d-flex ms-1 justify-content-center align-items-center text-center gap-1">
               <Link to={`/merchant/customers/view_customer/${row?.lead_user_id}`}><Eye size={15} /></Link>
               <Link to={`/merchant/customers/lead/edit_lead/${row?.lead_user_id}?type=edit`}> <Edit3 size={15} /></Link>
            </div>
         )
      }
   ]

   return (<>
      {
        useLoader && <FrontBaseLoader />
      }
      <Card>
         <CardHeader>
            <div className="d-flex justify-content-between w-100 align-items-center" >
               <h4 className="m-0">Leads Dashboard</h4>
               <div className="pe-2 d-flex">
                  <Link to="/merchant/customers/add_lead">
                     <Button className="btn btn-primary btn-block">Add Lead</Button>
                  </Link>
                  <Link className='ms-1' to="/merchant/customer/leads_settings">
                     <Button className="btn btn-primary btn-block"><FaGear /></Button>
                  </Link>
               </div>
            </div>
         </CardHeader>
      </Card>
      <Card>
         <CardHeader>
            <Row className="mb-2">
               <h4 className="">Statistics</h4>
            </Row>
         </CardHeader>
         <CardBody>
            <div className="mx-2 d-flex justify-content-between ">
               {leadsStatisticsData.map((ele) => (
                  <Row className="align-items-center">
                     <Col
                        xs="2"
                        className={`d-flex justify-content-start align-items-center d-black ${ele.iconStyle && ele.iconStyle
                           }`}
                        style={{
                           width: "48px",
                           height: "48px",
                           borderRadius: "50%"
                        }}
                     >
                        {ele.icon}
                     </Col>
                     <Col className="ms-1">
                        <p className=" fw-bolder" style={{ fontSize: "15px", margin: "0px" }}>
                           {ele.type === "money" ? `₹${ele.data}` : ele.data}
                        </p>
                        <h4 className="fs-6 fw-light" style={{ margin: "0px" }}>{ele.name}</h4>
                     </Col>
                  </Row>
               ))}
            </div>
         </CardBody>
      </Card>
      <>
         <Row>
            <Col>
               <Card>
                  <CardBody>
                     <AdvanceServerSide
                        tableName="Leads"
                        tableCol={columns}
                        data={tableData?.leads_obj}
                        isLoading={isLoading}
                        getData={getData}
                        count={tableData?.recordsTotal}
                        // selectableRows={true}
                        setSelectedRows={setSelected}
                        selectedRows={selected}
                        advanceFilter={true}
                        customButtonRight={customButton2}
                     />
                  </CardBody>
               </Card>
            </Col>
         </Row>
      </>
      {/* <ParkedFunnel_Table /> */}
      {/* <LeadsDetail_Table />
      <Watilist_Table /> */}

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
                  {/* <h5 className='m-0 text-center mt-1 px-3 fs-6 '><a href={`${baseURL}/static/template_document/contact.csv`} className="text-primary cursor-pointer" download>Click here</a>  to download dummy CSV Format file. </h5> */}

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
   </>
   )
}

export default Leads_dashboard