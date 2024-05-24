/* eslint-disable no-unused-vars */
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Copy, Edit3, Eye, Trash2 } from 'react-feather'
import { Card, CardBody, Col, Input } from 'reactstrap'
import { Link } from 'react-router-dom'
import ComTable from '../Components/DataTable/ComTable'
import AdvanceServerSide from '../Components/DataTable/AdvanceServerSide'

export default function CodeUserData() {
    const [tableData, settableData] = useState([])
    const [showUserDetails, setshowUserDetails] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    // const [searchValue, setSearchValue] = useState("")

    const handleFilter = e => {
        const { value } = e.target
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = tableData.filter(row => {
                const startsWith =
                    row?.email?.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    row?.email?.toLowerCase().includes(value.toLowerCase())

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

    const columns = [
        {
            name: 'Date',
            sortable: true,
            minWidth: '100px',
            selector: row => moment(row?.created_at ? row?.created_at : "").format('YYYY-MM-DD')
          },
          {
            name: 'Time',
            sortable: true,
            minWidth: '100px',
            selector: row => moment(row?.created_at ? row?.created_at : "").format('HH:mm:ss')
          },
        {
            name: 'Email',
            minWidth: '200px',
            selector: row => row.email, // Assuming 'category' is the property in your data for the category
            dataType: 'email',
            type: 'text',
            isEnable: true
        },
        {
            name: 'Results',
            minWidth: '200px',
            selector: row => <Link to={`/codeskin-user/${row.unique_id}`} className='text-primary'>View</Link>,
            isEnable: true
        }

    ]

    const getData = () => {

        setIsLoading(true)
        fetch('https://apps.xircls.com/leads/lead_form_data/', {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
        })
        .then(data => {
            // Handle the successful response here
            console.log('Response:', data)
            settableData(data)
        })
        .catch(error => {
            // Handle errors here
            console.error('Error:', error)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    const defferContent = <>
        <Col className='d-flex align-items-center justify-content-center' md='4' sm='12'>
            <h4 className='m-0'>Report</h4>
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


    return (
        <>
            <Card>
                <CardBody>

                    <ComTable
                        // tableName="All Templates"
                        // tableCol={columns}
                        // data={tableData}
                        // count={10}
                        // getData={getData}
                        // isLoading={false}
                        // advanceFilter={true}

                        content={defferContent}
                        tableCol={columns}
                        data={tableData}
                        searchValue={searchValue}
                        filteredData={filteredData}
                        isLoading={isLoading}

                    />
                </CardBody>
            </Card>
        </>

    )
}
