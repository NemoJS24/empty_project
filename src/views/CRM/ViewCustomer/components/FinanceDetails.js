import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Input, Row } from 'reactstrap'
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
// import axios from 'axios'
import { crmURL, postReq } from '../../../../assets/auth/jwtService'
import { Link, useParams } from 'react-router-dom'
import { Edit, Eye } from 'react-feather'
import moment from 'moment'
import ComTable from '../../../Components/DataTable/ComTable'

const FinanceDetails = () => {

    const { id } = useParams()
    const [tableData, setTableData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filteredData, setFilteredData] = useState([])
    const [searchValue, setSearchValue] = useState('')


    const getData = () => {
        setIsLoading(true)
        const form_data = new FormData()
        // const url = new URL(`${crmURL}/customers/merchant/get_view_customer/`)
        
        form_data.append("customer_id", id)
        form_data.append("tab_type", "finance")
        // fetch(url, {
        //     method: "POST",
        //     body: form_data
        // })
        postReq('get_customer_finance', form_data, crmURL)
        .then((res) => {
            console.log(res.success, "pp")
            setTableData(res.success)
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
            <h4 className='m-0'>Finance Details</h4>
        </Col>
        <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
            <Link className='btn btn-primary-main' to={`/merchant/customers/jmd-finance-customers/${id}?type=customer`}>Add Finance</Link>
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
            name: <>VEHICLE <br /> NUMBER</>,
            minWidth: "110px",
            selector: (row) => (
                row?.vehicle_number !== undefined && row?.vehicle_number !== null ? row.vehicle_number : "None"
            ),
            type: 'text'
        },
        {
            name: <>BANK <br /> NAME</>,
            minWidth: "100px",
            selector: (row) => (
                row?.Bank_Name !== undefined && row?.Bank_Name !== null ? row.Bank_Name : "None"
            ),
            type: 'text'
        },
        {
            name: <>LOAN <br /> NUMBER</>,
            minWidth: "110px",
            selector: (row) => (
                row?.Loan_Number !== undefined && row?.Loan_Number !== null ? row.Loan_Number : "None"
            ),
            type: 'text'
        },
        {
            name: <>LOAN <br /> TYPE</>,
            minWidth: "100px",
            selector: (row) => (
                row?.Loan_Type !== undefined && row?.Loan_Type !== null ? row.Loan_Type : "None"
            ),
            type: 'text'
        },
        {
            name: <>DISBURSE <br /> DATE</>,
            minWidth: "150px",
            selector: (row) => (
                row?.Loan_Disbursement_Date !== undefined && row?.Loan_Disbursement_Date !== null ? moment(row.Loan_Disbursement_Date).format("YYYY-MM-DD") : 'None'
            ),
            type: 'date'
        },
        {
            name: <>RATE OF <br /> INTEREST</>,
            minWidth: "110px",
            selector: (row) => (
                row?.Rate_of_Interest !== undefined && row?.Rate_of_Interest !== null ? row.Rate_of_Interest : "None"
            ),
            type: 'text'
        },
        {
            name: <>LOAN <br /> AMOUNT</>,
            minWidth: "100px",
            selector: (row) => (
                row?.Loan_amount !== undefined && row?.Loan_amount !== null ? row.Loan_amount : "None"
            ),
            type: 'text'
        },
        {
            name: <>EMI <br /> AMOUNT</>,
            minWidth: "100px",
            selector: (row) => (
                row?.Emi_Amount !== undefined && row?.Emi_Amount !== null ? row.Emi_Amount : "None"
            ),
            type: 'text'
        },
        {
            name: <>EMI START<br />DATE</>,
            minWidth: "150px",
            selector: (row) => (
                row?.Emi_End_Date !== undefined && row?.Emi_End_Date !== null ? moment(row.Emi_End_Date).format("YYYY-MM-DD") : 'None'
            ),
            type: 'date'
        },
        {
            name: <>EMI END <br /> DATE</>,
            minWidth: "150px",
            selector: (row) => (
                row?.Emi_Start_Date !== undefined && row?.Emi_Start_Date !== null ? moment(row.Emi_Start_Date).format("YYYY-MM-DD") : 'None'
            ),
            type: 'date'
        },
        {
            name: "ACTION",
            minWidth: "80px",
            selector: () => (
                <>
                    <div className='d-flex justify-content-center align-items-center gap-1'>
                        <Eye size='15px' />
                        <Edit size='15px' />
                    </div>
                </>
            ),
            type: 'date'
        }
    ]

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            {/* <ComTable
                                tableName="Finance Details"
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
                                createLink={`/merchant/customers/jmd-finance-customers/${id}`}
                                createText={"Add Finance"}
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

export default FinanceDetails