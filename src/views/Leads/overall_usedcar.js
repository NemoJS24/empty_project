/* eslint-disable */
import {  Col, Row, Card, CardBody, CardHeader, Button} from "reactstrap"
import {useState } from "react"
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
import { Edit3, Eye, Trash2 } from "react-feather"
import { LuTrendingUp } from "react-icons/lu"
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia"
import { PiMoneyThin } from "react-icons/pi"
import { Link } from "react-router-dom"
import { crmURL, postReq } from "../../assets/auth/jwtService"
import moment from "moment"

const Customers = () => {
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
    setIsLoading(true)
    const form_data = new FormData()
    Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
    form_data.append("table_name", "today_usedcar")
    form_data.append("page", currentPage + 1)
    form_data.append("size", currentEntry)
    form_data.append("searchValue", searchValue)

    postReq("used_car_dashboard", form_data, crmURL)
      .then((resp) => {
        // console.log("fsfsffsdf", resp)
        setTableData(resp?.data)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
      })

  }


  const columns = [
    {
      name: "Created On",
      minWidth: "240px",
      selector: (row) => row?.transaction_created_at ? moment(row?.transaction_created_at).format("YYYY-MM-DD") : '',
      type: 'date',
      isEnable: true
    },
    {
      name: "Car Name",
      minWidth: "200px",
      selector: (row) => row?.transaction_vehicle_car_name ? row.transaction_vehicle_car_name : "-"
      // selector: (row) => (
      //   <Link to={`/merchant/customers/view_customer/${row?.xircls_customer_id}`}>{row?.finance_customer_name ? row.finance_customer_name : "-"}</Link>
      // )
      ,
      type: 'text',
      isEnable: true
    },
    {
      name: "Registration Number",
      minWidth: "200px",
      selector: (row) => row?.transaction_vehicle_registration_number ? row.transaction_vehicle_registration_number : "-",
      type: 'text',
      isEnable: true
    },
    // {
    //   name: "Registration Number",
    //   minWidth: "200px",
    //   selector: (row) => row?.finance_bank_name ? row.finance_bank_name : "-",
    //   type: 'text',
    //   isEnable: true
    // },
    {
      name: "Buyer Name",
      minWidth: "200px",
      selector: (row) => row?.transaction_buyer_name ? row.transaction_buyer_name : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Buyer Mobile",
      minWidth: "200px",
      selector: (row) => row?.transaction_buyer_phone_no ? row.transaction_buyer_phone_no : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Buyer Email",
      minWidth: "200px",
      selector: (row) => row?.transaction_buyer_email ? row.transaction_buyer_email : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Seller Name",
      minWidth: "200px",
      selector: (row) => row?.transaction_seller_name ? row?.transaction_seller_name : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Seller Mobile",
      minWidth: "200px",
      selector: (row) => row?.transaction_seller_phone_no ? row.transaction_seller_phone_no : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Seller Email",
      minWidth: "200px",
      selector: (row) => row?.transaction_seller_email ? row.transaction_seller_email : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Source",
      minWidth: "200px",
      selector: (row) => row?.finance_emi_amount ? row.finance_emi_amount : "-",
      type: 'text',
      isEnable: false
    },
    {
      name: "Dealer/ Executive",
      minWidth: "200px",
      selector: (row) => row?.finance_emi_start_date ? moment(row.finance_emi_start_date).format("YYYY-MM-DD") : "-",
      type: 'text',
      isEnable: true
    },
    {
      name: "Created By",
      minWidth: "250px",
      selector: (row) => <div className="py-1">
        <h6>{row?.transaction_created_by ? row?.transaction_created_by : row?.super_user_name}</h6>
        <p className="m-0">{row?.transaction_created_by_email ? row?.transaction_created_by_email : row?.super_user_email}</p>
      </div>,
      type: 'text'
    },
    {
      name: "Action",
      width: "130px",
      selector: (row) => (
        <div className="d-flex ms-1 justify-content-center align-items-center text-center gap-1">
          <Link to={`/merchant/customers/view_customer/${row?.transaction_id}`}><Eye size={15} /></Link>
          <Link to={`/merchant/customers/buyerseller/${row?.transaction_id}?type=edit`}> <Edit3 size={15} /></Link>
        </div>
      )
    }
  ]
  

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <AdvanceServerSide
                tableName="All Used Car Data"
                tableCol={columns}
                data={tableData?.customers_obj}
                isLoading={isLoading}
                getData={getData}
                count={tableData?.recordsTotal}
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
