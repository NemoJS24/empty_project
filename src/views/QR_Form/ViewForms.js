import React, { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Input, Row } from 'reactstrap'
import AdvanceServerSide from '../Components/DataTable/AdvanceServerSide'
import { SuperLeadzBaseURL, postReq } from '../../assets/auth/jwtService'
import { getCurrentOutlet } from '../Validator'
import { PermissionProvider } from '../../Helper/Context'
import ComTable from '../Components/DataTable/ComTable'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Eye } from 'react-feather'

const ViewForms = () => {
    const [tableData, setTableData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const outletData = getCurrentOutlet()
    const [filteredData, setFilteredData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const { userPermission } = useContext(PermissionProvider)
    const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
        // console.log(advanceSearchValue)
        setIsLoading(true)
        const form_data = new FormData()
        // const url = new URL(`${SuperLeadzBaseURL}/flash_accounts/all_customers/`)
        Object.entries(advanceSearchValue).map(([key, value]) => value && form_data.append(key, value))
        form_data.append("shop", outletData[0]?.web_url)
        form_data.append("app", userPermission?.appName)
        form_data.append("page", currentPage + 1)
        form_data.append("size", currentEntry)
        form_data.append("searchValue", searchValue)
        // fetch(url, {
        //   method: "POST",
        //   body: form_data
        // })
        postReq('form_view', form_data)
        .then((resp) => {
          console.log("hh", resp)
          setTableData(resp?.data?.data)
          // setCount(resp?.count)
          setIsLoading(false)
        })
        .catch((error) => {
          console.log(error)
          setIsLoading(false)
        })
    }

    const columns = [
        {
            name: 'Created At',
            minWidth: '190px',
            selector: row => {
                return row?.created_at ? moment(row?.created_at).format('YYYY-MM-DD HH:mm') : ''
            },
            type: 'text',
            isEnable: true
        },
        {
            name: 'First Name',
            minWidth: '190px',
            selector: row => {
                const json_data = row.form_json ? JSON.parse(row.form_json) : {}
                return json_data['First Name']
            },
            type: 'text',
            isEnable: true
        },
        {
            name: 'Last Name',
            minWidth: '190px',
            selector: row => {
                const json_data = row.form_json ? JSON.parse(row.form_json) : {}
                return json_data['Last Name']
            },
            type: 'text',
            isEnable: true
        },
        {
          name: 'Email',
          minWidth: '190px',
          selector: row => {
            const json_data = row.form_json ? JSON.parse(row.form_json) : {}
            return json_data?.Email
          },
          type: 'text',
          isEnable: true
        },
        {
            name: 'Mobile No.',
            minWidth: '190px',
            selector: row => {
              const json_data = row.form_json ? JSON.parse(row.form_json) : {}
              return json_data?.Mobile
            },
            type: 'text',
            isEnable: true
          },
        {
            name: 'Actions',
            minWidth: '10%',
            cell: (row) => {
              return (<div className='d-flex gap-2'>
                {/* <button className='btn ' style={{padding:"5px 10px" }} onClick={() => handleDelete(row.group_id)} ><Trash size={18}/></button> */}
                <Link to={`/merchant/qr/reports/detail/${row.id}`} className='btn ' style={{ padding: "5px 10px" }}><Eye size={18} /></Link>
              </div>
              )
            },
            isEnable: true
        }
    ]

    const handleFilter = e => {
        const { value } = e.target
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = tableData.filter(row => {
                const startsWith =
                    row?.form_name?.form_name.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    row?.form_name?.form_name.toLowerCase().includes(value.toLowerCase())

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
            <h4 className='m-0'>Reports</h4>
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

    useEffect(() => {
        getData()
    }, [])
    return (
        <Row>
            <Col>
                <Card>
                    <CardBody>
                    <ComTable
                        content={defferContent}
                        tableCol={columns}
                        data={tableData}
                        searchValue={searchValue}
                        filteredData={filteredData}
                        isLoading={isLoading}
                    />
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default ViewForms