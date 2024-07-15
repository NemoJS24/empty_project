import React, { useState } from 'react'
import { Info } from 'react-feather'
import { Card, CardBody, Tooltip } from 'reactstrap'

const CardCom = ({ icon, title, data, info, id }) => {

    // console.log({ icon, title: typeof title, data, info })

    const [tooltipOpen, setTooltipOpen] = useState(false)

    const toggle = () => setTooltipOpen(!tooltipOpen)

    return (
        <Card>
            <CardBody>
                <div className='icon' style={{ paddingBottom: '5px' }}>
                    {icon ? icon : ""}
                </div>
                <div className="d-flex justify-content-between align-items-baseline">
                    <p className="mb-0 h5 card-text position-relative cursor-default p-0">
                        {title ? title : ""}
                        {info && data ? <span className='position-absolute' style={{ top: '-10px', right: '-15px', cursor: 'pointer' }} id={id ? id : "testId"}>

                            <Tooltip style={{ maxWidth: '50vh'}} key={info} placement="top" isOpen={tooltipOpen} autohide={true} target={id ? id : "testId"} onMouseOver={toggle} onMouseLeave={info} toggle={toggle}>{info}</Tooltip>
                            <Info size={12} />
                        </span> : ''}
                    </p>
                    <h3 title={data} className='m-0'>
                        {data ? data : "0"}
                    </h3>
                </div>

            </CardBody>
        </Card>
    )
}

export default CardCom