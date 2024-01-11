import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { GoDotFill } from "react-icons/go"
import { BsCurrencyDollar } from 'react-icons/bs'

export default function Price_Test({ data }) {
    return (
        <Card className='shadow-none border'>
            <CardBody className='position-relative d-flex flex-column  justify-content-between ' >
                <div>
                    {
                        data.high ? <h3 className=' fw-lig px-2 fs-4 user-select-none  position-absolute end-0 me-2 rounded-2 ' style={{ padding: "2px 8px", border: "solid 1px black", color: "black" }}>{data.high}</h3> : ""
                    }
                    <h1 className='display-6 main-heading mt-3 ms-1 ' style={{ fontWeight: "700" }}>{data.head}</h1>
                    <div className='ms-1 d-flex flex-column mt-1' style={{ gap: "7px" }}>
                        {
                            data.items.map((list) => (
                                <div className='d-flex align-items-center ' style={{ gap: "3px" }}> <GoDotFill size={10} /><h3 className='m-0 fs-4 text-black fw-lig ' >{list}</h3></div>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <div className='d-flex align-items-center ms-1 mt-4  '>
                        <div className=' d-flex justify-content-center align-items-center ' >
                            <h1 className=' main-heading fw-lig' style={{ marginRight: "-8px", fontWeight: "700" }}><BsCurrencyDollar size={40} /></h1>
                            <h1 className='  display-5 main-heading m-0 p-0 ' style={{ fontWeight: "700" }} > {data.value}</h1>
                        </div>
                        <h1 className=' mt-2 fs-2 main-heading fw-lig mb-0 pb-0' style={{ marginLeft: "3px", fontWeight: "700" }} >/mo.</h1>
                    </div>
                    <h4 className='ms-2 main-heading mb-2 fw-lig'>{data.subValue}</h4>

                    <button className='mt- w-100  btn border-black fs-3 fw-bolder   main-btn-dark ' style={{ padding: "12px" }}>{data.button}</button>
                </div>
            </CardBody>
        </Card>
    )
}