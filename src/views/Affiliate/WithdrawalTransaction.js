import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, UncontrolledButtonDropdown } from 'reactstrap'
import moment from 'moment'
import ComTable from '../Components/DataTable/ComTable'
import { useLocation, useNavigate } from 'react-router-dom'
import { getReq, postReq } from '../../assets/auth/jwtService'
import { MoreVertical } from 'react-feather'
import toast from 'react-hot-toast'
import NavbarAdmin from '../Admin/NavbarAdmin'
// import { getReq } from '../../../assets/auth/jwtService'

const WithdrawalTransaction = () => {

  const { state } = useLocation()
  const withdrawalUserID = state && state.withdrawalUserID

  const [searchFilter, setSearchFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)  // make it true
  const [tableData, setTableData] = useState([])
  const [selectedAction, setSelectedAction] = useState()
  const navigate = useNavigate()
const getData = () => {
  getReq(`admin_withdrawn_transactions`, `/?affiliate_id=${withdrawalUserID}`)
  .then((data) => {
    console.log("admin_withdrawn_transactions", data?.data?.withdrawn_trans_all)
    setTableData(data?.data?.withdrawn_trans_all)
    setIsLoading(false)
  })
  .catch((error) => {
    console.log(error)
  })
}
  useEffect(() => {
    getData()
  }, [])
  const filteredArray = tableData?.filter(cur => (cur.affiliate_person.firstname?.toLowerCase()?.includes(searchFilter.toLowerCase())) || (cur.affiliate_person.lastname?.toLowerCase()?.includes(searchFilter.toLowerCase())) || (cur.created_at?.toLowerCase()?.includes(searchFilter.toLowerCase())) || (cur.remark?.toLowerCase()?.includes(searchFilter.toLowerCase())) || (cur.action?.toLowerCase()?.includes(searchFilter.toLowerCase())))

  console.log(selectedAction)
  const options = [
    { value: "Pending", label: "Pending" },
    { value: "Initialize", label: "Initialize" },
    { value: "Transit", label: "Transit" },
    { value: "Paid", label: "Paid" }
  ]

  const columns = [
    {
      name: 'Date',
      sortable: true,
      minWidth: '100px',
      selector: row => moment(row.created_at ? row.created_at : "-").format('YYYY-MM-DD')
    },
    {
      name: 'Time',
      sortable: true,
      minWidth: '100px',
      selector: row => moment(row.created_at ? row.created_at : "-").format('HH:mm:ss')
    },
    {
      name: 'Name',
      sortable: true,
      minWidth: '100px',
      selector: row => (row.affiliate_person.firstname && row.affiliate_person.lastname ? `${row.affiliate_person.firstname} ${row.affiliate_person.lastname}` : <div className='text-center w-100'>-</div>)
    },
    {
      name: 'Email',
      sortable: true,
      minWidth: '200px',
      selector: row => (row.affiliate_person.personal_email ? (<div title={row.affiliate_person.personal_email} className='text-center w-100'> {row.affiliate_person.personal_email}</div>) : <div className='text-center w-100'>-</div>
      )
    },
    {
      name: <>Completed<br />on</>,
      sortable: true,
      minWidth: '100px',
      selector: row => {
        const completedOn = row.completed_on || null
        return completedOn ? moment(completedOn).format('YYYY-MM-DD') : '-'
      }
    },
    {
      name: 'Remarks',
      sortable: true,
      minWidth: '200px',
      selector: row => (row.remark ? row.remark : <div className='text-center w-100'>-</div>)
    },
    {
      name: <>Withdrawn<br />Amount</>,
      sortable: true,
      minWidth: '100px',
      selector: row => (row.requested_amount ? row.requested_amount : <div className='text-center w-100'>0</div>)
    },
    {
      name: <>Balance<br />Amount</>,
      sortable: true,
      minWidth: '100px',
      selector: row => (row.balance_amount ? row.balance_amount : <div className='text-center w-100'>-</div>)
    },
    {
      name: <>Status</>,
      sortable: true,
      minWidth: '100px',
      selector: row => (
        row.action && row.action === "Pending" ? (
          <div className="badge badge-light-warning">Pending</div>
        ) : row.action && row.action === "Paid" ? (
          <div className="badge badge-light-success">Paid</div>
        ) : row.action && row.action === "Initialize" ? (
          <div className="badge badge-light-secondary">Initialize</div>
        ) : <div className="badge badge-light-info">Transit</div>
      )
    },
    {
      name: 'Action',
      sortable: true,
      minWidth: '100px',
      cell: row => (
        <>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <UncontrolledButtonDropdown className='more-options-dropdown'>
              <DropdownToggle className={`btn-icon cursor-pointer`} color='transparent' size='sm'>
                <span className={`border-none`}>
                  <MoreVertical size={15} />
                </span>
              </DropdownToggle>
              <DropdownMenu className='border dropdown-menu-custom'>
                {options.map((ele) => (
                  <DropdownItem
                    key={ele.value}
                    value={ele.value}
                    className='w-100'
                    onClick={(e) => {
                      const newSelectedAction = e.target.value
                      setSelectedAction(newSelectedAction)
                      const form_data = new FormData()
                      form_data.append("affiliate_id", row.affiliate_person.id)
                      form_data.append("action", e.target.value)
                      form_data.append("created_at", row.created_at)

                      postReq("admin_withdrawn_request", form_data)
                        .then((res) => {
                          console.log(res)
                          toast.success(`Action Change ${row.action} to ${newSelectedAction}`)
                          getData()
                        })
                        .catch((err) => {
                          console.log(err)
                        })
                    }}
                  >
                    {ele.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </>
      ),
      width: "100px"
    }

  ]


  const defferContent = <>
    <Col className='d-flex align-items-center justify-content-center' md='4' sm='12'>
      <h4 className='m-0'>Withdrawal Transaction</h4>
    </Col>
    <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
      <input value={searchFilter} onChange={e => setSearchFilter(e.target.value)} type="text" placeholder="Search..." className='form-control ms-1' style={{ width: "200px" }} />
    </Col>
  </>

  return (
    <>
      <div className='d-flex align-items-center justify-content-between p-2 text-center' style={{ height: "vh", width: "100%", backgroundColor: "#7367F0" }}>
        <h1 style={{ color: "white", textAlign: "center", marginLeft: "30px" }} className='d-flex align-items-center '>Affiliates</h1>
        <NavbarAdmin />
      </div>
      <Row className='px-5 justify-content-center mt-5'>
        <Col lg="10" className=''>

          <div>

            <button className="btn btn-primary mb-2" onClick={() => navigate(-1)}>Back</button>

          </div>
          <div>
            <Card>
              <CardBody>
                <ComTable
                  content={defferContent}
                  tableCol={columns}
                  data={tableData}
                  searchValue={searchFilter}
                  filteredData={filteredArray}
                  isLoading={isLoading}
                />
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default WithdrawalTransaction