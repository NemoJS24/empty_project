/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { FaGear } from "react-icons/fa6"
import { PiGear } from "react-icons/pi"
import { Card, CardBody, CardHeader, Button, Row, Col } from "reactstrap"
import { Link } from "react-router-dom"
import { BiUser } from "react-icons/bi"
import { Edit3, Eye, Trash2 } from "react-feather"
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
import { crmURL, getReq, postReq } from "../../assets/auth/jwtService"

const Leads_dashboard = () => {
   const [tableData, setTableData] = useState([])
   const [isLoading, setIsLoading] = useState(true)
   const [selected, setSelected] = useState([])
   const [leadStageOptions, setLeadStageOptions] = useState([])

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
                     />
                  </CardBody>
               </Card>
            </Col>
         </Row>
      </>
      {/* <ParkedFunnel_Table /> */}
      {/* <LeadsDetail_Table />
      <Watilist_Table /> */}
   </>
   )
}

export default Leads_dashboard