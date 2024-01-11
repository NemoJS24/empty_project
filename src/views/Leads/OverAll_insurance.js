import { Col, Row, Card, CardBody, CardHeader, Button } from "reactstrap"
import { useState } from "react"
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
import { crmURL } from "@src/assets/auth/jwtService.js"
import { Edit3, Eye, Trash2 } from "react-feather"
import { LuTrendingUp } from "react-icons/lu"
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia"
import { PiMoneyThin } from "react-icons/pi"
import { Link } from "react-router-dom"
import moment from "moment/moment"

/* eslint-disable */
const Customers = () => {
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState([])

  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    setIsLoading(true)
    const form_data = new FormData()
    const url = new URL(`${crmURL}/customers/merchant/all_cust_dashboard/`)
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
    form_data.append("slug", "add_insurance")
    // form_data.append("table_name", "today_insurance")
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)

    fetch(url, {
      method: "POST",
      body: form_data
    })
      .then((data) => data.json())
      .then((resp) => {
        console.log("pp", resp)
        setTableData(resp)

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
        <Link to={`/merchant/customers/view_customer/${row?.customer_id}`}>{row?.customer_name}</Link>
      ),
      type: 'text',
      isEnable: true
    },
    {
      name: "Brand",
      minWidth: "150px",
      selector: (row) => row?.brand,
      type: 'number',
      isEnable: true
    },
    {
      name: "Model",
      minWidth: "200px",
      selector: (row) => row?.car_model,
      type: 'text',
      isEnable: true
    },
    {
      name: "Variant",
      minWidth: "200px",
      selector: (row) => row?.variant,
      type: 'text',
      isEnable: true
    },
    {
      name: "Policy Number",
      minWidth: "200px",
      selector: (row) => row?.policy_number,
      type: 'text',
      isEnable: true
    },
    {
      name: "Insurance Company",
      minWidth: "200px",
      selector: (row) => row?.insurance_company,
      type: 'text',
      isEnable: true
    },
    {
      name: "Policy Purchase Date",
      minWidth: "200px",
      selector: (row) => moment(row?.policy_purchase_date).format("YYYY-MM-DD"),
      type: 'date',
      isEnable: true
    },
    {
      name: "Policy Expiry Date",
      minWidth: "200px",
      selector: (row) => moment(row?.policy_expiry_date).format("YYYY-MM-DD"),
      type: 'date',
      isEnable: true
    },
    {
      name: "Ammount",
      minWidth: "200px",
      selector: (row) => row?.amount,
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
          <Trash2 size={15} />
        </div>
      )
    }
  ]


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
                data={tableData?.insurance}
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
