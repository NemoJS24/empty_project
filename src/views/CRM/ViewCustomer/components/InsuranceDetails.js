import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Input, Row } from 'reactstrap'
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
// import axios from 'axios'
import { crmURL, postReq } from '../../../../assets/auth/jwtService'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import ComTable from '../../../Components/DataTable/ComTable'
import { Edit3 } from 'react-feather'

const InsuranceDetails = () => {

    const { id } = useParams()
    const [tableData, setTableData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filteredData, setFilteredData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    // const [selected, setSelected] = useState([])
    // let serialNumber = 1


    const getData = () => {
        setIsLoading(true)
        const form_data = new FormData()
        // const url = new URL(`${crmURL}/customers/merchant/get_view_customer/`)
        form_data.append("customer_id", id)
        form_data.append("tab_type", "insurance")
        // fetch(url, {
        //     method: "POST",
        //     body: form_data
        // })
        postReq('get_customer_insurance', form_data, crmURL)
        .then((res) => {
            console.log(res, "ll")
            setTableData(res?.data?.success)
            setIsLoading(false)
        })
        .catch((error) => {
            console.log(error)
            setIsLoading(false)
        })
    }

    const handleFilter = e => {
        const { value } = e.target
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = data.filter(item => {
                const startsWith =
                    item.registration_number.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.registration_number.toLowerCase().includes(value.toLowerCase())

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
            <h4 className='m-0'>Insurance Details</h4>
        </Col>
        <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
            <Link className='btn btn-primary-main' to={`/merchant/customers/add-insurance/${id}?type=customer`}>Add Insurance</Link>
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

    const columns = [
        {
            name: "Created On",
            minWidth: "240px",
            selector: (row) => (
                row?.created_at ? moment(row?.created_at).format("YYYY-MM-DD") : ''
            ),
            type: 'date'
        },
        {
            name: <>BRAND</>,
            minWidth: "100px",
            selector: (row) => (
                row?.brand
            ),
            type: 'text'
        },
        {
            name: "MODEL",
            minWidth: "100px",
            selector: (row) => (
                row?.car_model
            ),
            type: 'text'
        },
        {
            name: "VARIANT",
            minWidth: "100px",
            selector: (row) => (
                row?.variant
            ),
            type: 'text'
        },
        {
            name: <>POLICY NUMBER</>,
            minWidth: "100px",
            selector: (row) => (
                row?.policy_number
            ),
            type: 'text'
        },
        {
            name: <>INSURANCE COMPANY</>,
            minWidth: "120px",
            selector: (row) => (
                row?.insurance_company
            ),
            type: 'text'
        },
        {
            name: <>POLICY PURCHASE DATE</>,
            minWidth: "150px",
            selector: (row) => (
                row?.policy_purchase_date ? moment(row.policy_purchase_date).format("YYYY-MM-DD") : ''
            ),
            type: 'text'
        },
        {
            name: <>POLICY EXPIRY DATE </>,
            minWidth: "150px",
            selector: (row) => (
                row?.policy_expiry_date ? moment(row.policy_expiry_date).format("YYYY-MM-DD") : ''
            ),
            type: 'text'
        },
        {
            name: "AMOUNT",
            minWidth: "100px",
            selector: (row) => (
                row?.amount ? row.amount : "None"
            ),
            type: 'text'
        },
        {
            name: "Created By",
            minWidth: "250px",
            selector: (row) => <div className="py-1">
              <h6>{row?.member?.member_name ? row?.member?.member_name : row?.super_user_name}</h6>
              <p className="m-0">{row?.member?.email ? row?.member?.email : row?.super_user_email}</p>
            </div>,
            type: 'text'
        },
        {
            name: "Action",
            width: "130px",
            selector: (row) => (
              <div className="d-flex ms-1 justify-content-center align-items-center text-center gap-1">
                <Link to={`/merchant/customers/insurance/edit_insurance/${row?.id}?type=edit`}> <Edit3 size={15} /></Link>
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
                            {/* <AdvanceServerSide
                                tableName="Insurance Details"
                                tableCol={columns}
                                data={tableData}
                                isLoading={isLoading}
                                getData={getData}
                                count={tableData?.recordsTotal}
                                selectableRows={true}
                                setSelectedRows={setSelected}
                                selectedRows={selected}
                                advanceFilter={false}
                                create={true}
                                createLink={"/merchant/customers/add-insurance/"}
                                createText={"Add Insurance"}
                            /> */}
                            <ComTable
                                // tableName="Verified Email"
                                content={defferContent}
                                tableCol={columns}
                                data={tableData}
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

export default InsuranceDetails