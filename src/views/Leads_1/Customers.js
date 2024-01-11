
import { Col, Row, Card, CardBody, Input } from 'reactstrap'
import "./Leads.css"
import ComTable from '../Components/DataTable/ComTable'
import { useEffect, useState } from 'react'
import { getReq } from "../../assets/auth/jwtService"


const Customers = () => {
    const [data, setdata] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith =
          item.customer_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.phone_no.toLowerCase().startsWith(value.toLowerCase()) ||
          item.email.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.customer_name.toLowerCase().includes(value.toLowerCase()) ||
          item.phone_no.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }

  const defferContent = <>
      <Col className='d-flex align-items-center justify-content-center' md='4' sm='12'>
        <h4 className='m-0'>Customers</h4>
      </Col>
      <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
        <Input
          className='dataTable-filter form-control ms-1'
          style={{ width: `180px`, height: `2.714rem` }}
          type='text'
          bsSize='sm'
          id='search-input-1'
          placeholder='Search...'
          value={searchValue}
          onChange={handleFilter}
        />
      </Col>
    </>

    const columns = [
        {
          name: 'Sr No.',
          cell: (row, index) => index + 1,
          width: '90px'
        },
        {
          name: 'Customer Name',
          minWidth: '200px',
          selector: row => row.customer_name
        },
        {
          name: 'Customer Group',
          minWidth: '200px',
          selector: row => row.group_name
        },
        {
          name: 'Mobile No',
          minWidth: '250px',
          selector: row => row.phone_no
        },
        {
          name: 'Email',
          minWidth: '250px',
          selector: row => row.email
        }
      ]

      useEffect(() => {

        getReq("getCustomersDetails", '?page_size=100')
        .then((resp) => {
          setdata(resp.data.data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.log(error)
          setIsLoading(false)
          
        })
      }, [])

    return (
        <>
            {/* <Card>
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <div className="flex-grow-1" style={{ marginTop: '10px' }}>
                            <h4>Customer Dashboard</h4>
                        </div>
                    </div>
                </CardBody>
            </Card> */}
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <ComTable
                              content={defferContent}
                              // tableName="Customers"
                              tableCol={columns}
                              data={data}
                              searchValue={searchValue}
                              // handleFilter={handleFilter}
                              filteredData={filteredData}
                              isLoading={isLoading}
                            />
                        </CardBody>
                    </Card>
                </Col>
                
            </Row>
        </>
    )
}

export default Customers