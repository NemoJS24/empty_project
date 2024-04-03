/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Eye, Trash } from 'react-feather'
import { Link } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import { getReq, postReq } from '../../../assets/auth/jwtService'

export default function Catalogue() {
    const [useLoader, setLoader] = useState(false)
    const [useisLoading, setisLoading] = useState(false)
    const [useTableData, setTableData] = useState([])
    const [totalData, settotalData] = useState(0)
  
    const getData = () => {
        setisLoading(true)
      
        getReq("get_catalog")
        .then((resp) => {
          console.log("resp :", resp.data.catalogs)
          setTableData(resp.data.catalogs)
          settotalData(resp.data.results)
        }).catch((err) => {
          console.log(err)
        }).finally(() => { setLoader(false); setisLoading(false) })
      }

    const columns = [
        {
            name: 'Name',
            minWidth: '200px',
            selector: row => row.name, // Assuming 'name' is the property in your data for the name
            dataType: 'email',
            type: 'text',
            isEnable: true
        },
        {
            name: 'Products',
            minWidth: '15%',
            selector: row => row.product_count, // Assuming 'category' is the property in your data for the category
            type: 'select',
            isEnable: true
        },
        {
            name: 'Actions',
            minWidth: '10%',
            cell: (row) => {
                return (<div className='d-flex gap-2'>
                    <Link to={`/merchant/whatsapp/CatalogueView/${row.id}`} className='btn ' style={{ padding: "5px 10px" }}>View </Link>
                </div>
                )
            },
            isEnable: true
        }
    ]
    return (
        <>
                <Card className='mb-5'>
                <CardBody className='mb-5'>

                    <AdvanceServerSide
                        tableName="Catalogues"
                        tableCol={columns}
                        data={useTableData}
                        count={totalData}
                        getData={getData}
                        isLoading={useisLoading}
                        advanceFilter={false}
                    />

                </CardBody>
            </Card>
        </>

    )
}
