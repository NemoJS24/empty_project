/* eslint-disable no-unused-vars */
import moment from 'moment'
import React, { useState } from 'react'
import { Copy, Edit3, Eye, Trash2 } from 'react-feather'
import { Card, CardBody } from 'reactstrap'
import AdvanceServerSide from '../../../../Components/DataTable/AdvanceServerSide'
import { postReq } from '../../../../../assets/auth/jwtService'

export default function AllTempTable() {
    const [isLoading, setIsLoading] = useState(true)
    const [tableData, settableData] = useState(null)
    const [total, setTotal] = useState(0)
    function convertTimestampToDateString(timestamp) {
        // Multiply the timestamp by 1000 to convert it to milliseconds
        const milliseconds = timestamp * 1000

        // Use Moment.js to format the date
        const formattedDate = moment(milliseconds).format('MMMM D, YYYY')

        return formattedDate
    }


    const columns = [

        {
            name: 'Created On',
            minWidth: '200px',
            selector: row => convertTimestampToDateString(row?.quality_score.date),
            isEnable: true
        },
        {
            name: 'Name',
            minWidth: '200px',
            selector: row => row.name, // Assuming 'name' is the property in your data for the name
            dataType: 'email',
            type: 'text',
            isEnable: true
        },
        {
            name: 'Category',
            minWidth: '15%',
            selector: row => row.category, // Assuming 'category' is the property in your data for the category
            type: 'select',
            options: [
                { label: "Select", value: "" },
                { label: "First-Time Visitor", value: "First Visitor" },
                { label: "Returning Visitor", value: "Returning Visitor" },
                { label: "Registered Users", value: "Register User" }
            ],
            isEnable: true
        },

        {
            name: 'Status',
            minWidth: '10%',
            cell: (row) => {
                return (
                    <div className='d-flex justify-content-start align-items-start flex-column'>
                        <span className='text-success'>{row.status === 'APPROVED' && "APPROVED"}</span>
                        <span className='text-warning'>{row.status === 'PENDING' && "PENDING"}</span>
                        <span className='text-danger'>{row.status === 'REJECTED' && "REJECTED"}</span>
                        <span className='text-warning'>{row.status === 'DISABLED' && "DISABLED"}</span>
                    </div>
                )
            },
            isEnable: true
        }

        // {
        //     name: 'Activated',
        //     minWidth: '100px',
        //     cell: () => (<div className='d-flex gap-1'>
        //         <div class="form-check form-switch">
        //             <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
        //             <label class="form-check-label" for="flexSwitchCheckDefault">Activated</label>
        //         </div>
        //     </div>),
        //     isEnable: true
        // }
    ]


    const getData = (currentPage = 0, currentEntry = 10, searchValue = "", advanceSearchValue = {}) => {
        setIsLoading(true)

        // Create a new FormData object and append the searchValue
        const formData = new FormData()

        Object.entries(advanceSearchValue).map(([key, value]) => value && formData.append(key, value))
        formData.append("slug", "customer_data")
        formData.append("page", currentPage + 1)
        formData.append("size", currentEntry)
        formData.append("searchValue", searchValue)

        postReq("getTemplates", formData)
            .then(res => {
                // Handle the successful response here
                console.log('Response:', res)
                settableData(res.data.data)
                setIsLoading(false)
                setTotal(res.data.total)
            })
            .catch(error => {
                // Handle errors here
                console.error('Error:', error)
                setIsLoading(false)
            })
    }


    return (
        <Card>
            <CardBody>

                <AdvanceServerSide
                    tableName="All Templates"
                    tableCol={columns}
                    data={tableData}
                    count={total}
                    getData={getData}
                    isLoading={isLoading}
                    advanceFilter={false}

                />
            </CardBody>
        </Card>
    )
}
