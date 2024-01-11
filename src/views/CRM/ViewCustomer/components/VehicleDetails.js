import React, { useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import AdvanceServerSide from "@src/views/Components/DataTable/AdvanceServerSide.js"
// import axios from 'axios'
import { crmURL } from '../../../../assets/auth/jwtService'
import { useParams } from 'react-router-dom'
import { Edit, Eye } from 'react-feather'

const VehicleDetails = () => {

    const { id } = useParams()
    const [tableData, setTableData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selected, setSelected] = useState([])


    const getData = () => {
        setIsLoading(true)
        const form_data = new FormData()
        const url = new URL(`${crmURL}/customers/merchant/get_view_customer/`)
        form_data.append("customer_id", id)
        form_data.append("tab_type", "customer_data")
        fetch(url, {
            method: "POST",
            body: form_data
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res.success[0], "kk")
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
            name: "REGISTRATION NUMBER",
            minWidth: "320px",
            selector: (row) => (
                row?.registration_number !== undefined && row?.registration_number !== null ? row.registration_number : "None"
            ),
            type: 'text'
        },
        {
            name: "BRAND",
            minWidth: "320px",
            selector: (row) => (
                row?.brand !== undefined && row?.brand !== null ? row.brand : "None"
            ),
            type: 'text'
        },
        {
            name: "ENGINE NO",
            minWidth: "320px",
            selector: (row) => (
                row?.engine_no !== undefined && row?.engine_no !== null ? row.engine_no : "None"
            ),
            type: 'text'
        },
        {
            name: "VARIANT",
            minWidth: "320px",
            selector: (row) => (
                row?.variant !== undefined && row?.variant !== null ? row.variant : "None"
            ),
            type: 'text'
        },

        {
            name: "ACTION",
            minWidth: "50px",
            selector: () => (
                <>
                    <div className='d-flex justify-content-center align-items-center gap-2'>
                        <Eye size='17px' style={{cursor: "pointer"}} />
                        <Edit size='17px' style={{cursor: "pointer"}}/>
                    </div>
                </>
            ),
            type: 'date'
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
                            <AdvanceServerSide
                                tableName="Vehicle Details"
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
                                createLink={"/"}
                                createText={"Add Vehicle"}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default VehicleDetails