import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Input, Row } from 'reactstrap'
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
// import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { crmURL, postReq } from '../../../assets/auth/jwtService'
import moment from 'moment'
import ComTable from '../../Components/DataTable/ComTable'

const ServicingDetails = () => {

    const { id } = useParams()
    console.log("paramId", id)
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
        form_data.append("tab_type", "servicing")
        
        // fetch(url, {
        //     method: "POST",
        //     body: form_data
        // })
        postReq("get_customer_servicing", form_data, crmURL)
        .then((res) => {
            console.log(res.success, "kk")
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
            <h4 className='m-0'>Servicing Details</h4>
        </Col>
        <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
            <Link className='btn btn-primary-main' to={`/merchant/customers/add-servicing/${id}?type=customer`}>Add Servicing</Link>
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
            name: <>CUSTOMER <br /> NAME</>,
            minWidth: "240px",
            selector: (row) => (
                row?.customer_name !== undefined && row?.customer_name !== null ? row.customer_name : "None"
            ),
            type: 'text'
        },
        {
            name: <>BRAND</>,
            minWidth: "100px",
            selector: (row) => (
                row?.brand !== undefined && row?.brand !== null ? row.brand : "None"
            ),
            type: 'text'
        },
        {
            name: "MODEL",
            minWidth: "100px",
            selector: (row) => (
                row?.model !== undefined && row?.model !== null ? row.model : "None"
            ),
            type: 'text'
        },
        {
            name: <>VARIANT</>,
            minWidth: "100px",
            selector: (row) => (
                row?.variant !== undefined && row?.variant !== null ? row.variant : "None"
            ),
            type: 'text'
        },
        {
            name: <>SERVICE<br />LOCATION</>,
            minWidth: "100px",
            selector: (row) => (
                row?.service_location !== undefined && row?.service_location !== null ? row.service_location : "None"
            ),
            type: 'text'
        },
        {
            name: <>JOB CARD <br /> DATE</>,
            minWidth: "120px",
            selector: (row) => (
                row?.job_card_date !== undefined && row?.job_card_date !== null ? moment(row.job_card_date).format("YYYY-MM-DD") : 'None'
            ),
            type: 'text'
        },
        {
            name: <>SERVICE INVOICE<br /> DATE</>,
            minWidth: "150px",
            selector: (row) => (
                row?.service_invoice_date !== undefined && row?.service_invoice_date !== null ? moment(row.service_invoice_date).format("YYYY-MM-DD") : 'None'
            ),
            type: 'text'
        },
        {
            name: <>SERVICE EXPIRY<br />DATE </>,
            minWidth: "150px",
            selector: (row) => (
                row?.service_expiry_date !== undefined && row?.service_expiry_date !== null ? moment(row.service_expiry_date).format("YYYY-MM-DD") : 'None'
            ),
            type: 'text'
        },
        {
            name: <>SERVICE INVOICE <br /> AMOUNT</>,
            minWidth: "100px",
            selector: (row) => (
                row?.service_invoice_amount !== undefined && row?.service_invoice_amount !== null ? row.service_invoice_amount : "None"
            ),

            type: 'text'
        }

    ]


    // console.log("vehicalData", vehicalData[0])
    // console.log(tableData, "pp")
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            {/* <AdvanceServerSide
                                tableName="Servicing Details"
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
                                createLink={`/merchant/customers/add-servicing/${id}?type=customer`}
                                createText={"Add Servicing"}
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

export default ServicingDetails