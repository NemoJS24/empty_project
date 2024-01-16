import { Col, Row, Card, CardBody, CardHeader, Button } from "reactstrap"
import { useState } from "react"
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
import { Edit3, Eye, Trash2 } from "react-feather"
import { LuTrendingUp } from "react-icons/lu"
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia"
import { PiMoneyThin } from "react-icons/pi"
import { Link } from "react-router-dom"
import { crmURL, postReq } from "../../assets/auth/jwtService"
import moment from "moment"

/* eslint-disable */
const Customers = () => {
  const [tableData, setTableData] = useState([])
  const [custData, setCustData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState([])

  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    setIsLoading(true)
    const form_data = new FormData()
    // const url = new URL(`${crmURL}/customers/merchant/all_cust_dashboard/`)
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
    form_data.append("slug", "add_insurance")
    form_data.append("table_name", "today_insurance")
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)

    // fetch(url, {
    //   method: "POST",
    //   body: form_data
    // })
    postReq("insurance_dashboard", form_data, crmURL)
      .then((resp) => {
        setCustData(resp)
        console.log("today_insurance", resp.data)
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
      name: "Customer Name",
      minWidth: "150px",
      selector: (row) => (
        <Link to={`/merchant/customers/view_customer/${row?.insurance_id}`}>{row?.insurance_customer_name ? row.insurance_customer_name : "-"}</Link>
      ),
      type: 'text',
      isEnable: true
    },
    {
      name: "Brand",
      minWidth: "150px",
      selector: (row) => row?.insurance_brand ? row.insurance_brand : "-",
      type: 'number',
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
      selector: (row) => row?.insurance_policy_purchase_date ? moment(row?.insurance_policy_purchase_date).format("YYYY-MM-DD") : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Policy Expiry Date",
      minWidth: "200px",
      selector: (row) => row?.insurance_policy_expiry_date ? moment(row?.insurance_policy_expiry_date).format("YYYY-MM-DD") : "-",
      type: 'text',
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
      name: "Action",
      width: "130px",
      selector: (row) => (
        <div className="d-flex ms-1 justify-content-center align-items-center text-center gap-1">
          <Link to={`/merchant/customers/view_customer/${row?.customer_id}`}><Eye size={15} /></Link>
          <Link to={`/merchant/customers/insurance/edit_insurance/${row?.customer_id}`}> <Edit3 size={15} /></Link>
        </div>
      )
    }
  ]

  const customerStatisticsData = [
    {
      name: "All Insurance",
      data: custData.recordsTotal ?? "0",
      type: "number",
      icon: <LuTrendingUp size={30} className="text-warning" />,
      iconStyle: "bg-warning bg-opacity-25"
    },
    {
      name: "Today's Insurance",
      data: custData.recordsFiltered ?? "0",
      type: "number",
      icon: <LiaUserSolid size={30} className="text-info" />,
      iconStyle: "bg-info bg-opacity-25"
    },
    {
      name: "Total Customers Insured",
      data: custData.total_customers ?? "0",
      type: "number",
      icon: <LiaUserSlashSolid size={30} className="text-danger" />,
      iconStyle: "bg-danger bg-opacity-25"
    },
    {
      name: "Total Amount",
      data: custData.total_amount ?? "0",
      type: "money",
      icon: <PiMoneyThin size={30} className="text-success" />,
      iconStyle: "bg-success bg-opacity-25"
    }
  ]
  console.log("Main TableData", tableData)

  return (
    <>

      <Card>
        <CardHeader>
          <Row className="mb-2">
            <h4 className="">Statistics</h4>
          </Row>
        </CardHeader>
        <CardBody>
          <div className="mx-2 d-flex justify-content-between ">
            {customerStatisticsData.map((ele) => (
              <Row className="align-items-center">
                <Col
                  xs="2"
                  className={`d-flex justify-content-start align-items-center d-black ${ele.iconStyle && ele.iconStyle
                    }`}
                  style={{
                    width: "40px",
                    height: "40px",
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
      <Row>
        <Col>
          <Card>
            <CardBody>
              <AdvanceServerSide
                tableName="Upcoming Insurance"
                tableCol={columns}
                data={tableData?.data}
                isLoading={isLoading}
                getData={getData}
                count={tableData?.recordsTotal}
                selectableRows={true}
                setSelectedRows={setSelected}
                selectedRows={selected}
                advanceFilter={true}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Customers
