import React, { useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
// import axios from 'axios'
import { crmURL } from '../../../../assets/auth/jwtService'
import { useParams } from 'react-router-dom'
import moment from 'moment'

const InsuranceDetails = () => {

    const { id } = useParams()
    const [tableData, setTableData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selected, setSelected] = useState([])
    let serialNumber = 1


    const getData = () => {
        setIsLoading(true)
        const form_data = new FormData()
        const url = new URL(`${crmURL}/customers/merchant/get_view_customer/`)
        form_data.append("customer_id", id)
        form_data.append("tab_type", "insurance")
        fetch(url, {
            method: "POST",
            body: form_data
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res.success[0], "ll")
                setTableData(res.success)
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
    }


    const columns = [
        {
            name: "SR NO.",
            minWidth: "100px",
            selector: () => serialNumber++,
            type: 'text'
        },
        {
            name: "CUSTOMER NAME",
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
                row?.car_model !== undefined && row?.car_model !== null ? row.car_model : "None"
            ),
            type: 'text'
        },
        {
            name: "VARIANT",
            minWidth: "100px",
            selector: (row) => (
                row?.variant !== undefined && row?.variant !== null ? row.variant : "None"
            ),
            type: 'text'
        },
        {
            name: <>POLICY NUMBER</>,
            minWidth: "100px",
            selector: (row) => (
                row?.policy_number !== undefined && row?.policy_number !== null ? row.policy_number : "None"
            ),
            type: 'text'
        },
        {
            name: <>INSURANCE COMPANY</>,
            minWidth: "120px",
            selector: (row) => (
                row?.insurance_company !== undefined && row?.insurance_company !== null ? row.insurance_company : "None"
            ),
            type: 'text'
        },
        {
            name: <>POLICY PURCHASE DATE</>,
            minWidth: "150px",
            selector: (row) => (
                row?.policy_purchase_date !== undefined && row?.policy_purchase_date !== null ? moment(row.policy_purchase_date).format("YYYY-MM-DD") : 'None'
            ),
            type: 'text'
        },
        {
            name: <>POLICY EXPIRY DATE </>,
            minWidth: "150px",
            selector: (row) => (
                row?.policy_expiry_date !== undefined && row?.policy_expiry_date !== null ? moment(row.policy_expiry_date).format("YYYY-MM-DD") : 'None'
            ),
            type: 'text'
        },
        {
            name: "AMOUNT",
            minWidth: "100px",
            selector: (row) => (
                row?.amount !== undefined && row?.amount !== null ? row.amount : "None"
            ),
            type: 'text'
        }

    ]

    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <AdvanceServerSide
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
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default InsuranceDetails