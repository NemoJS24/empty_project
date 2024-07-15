import React from 'react'
import { BsWhatsapp } from 'react-icons/bs'
import { ownUrl } from '../../Validator'

const IntegrationCard = ({ title, description, button, icon }) => {
    // console.log(title, description)
  return (
    <>
        <div className='card hover-card-active'  >
            <div className='card-body'>
                <div>
                    <img src={`${ownUrl}${icon}`} style={{width: '30px'}} />
                </div>
                <div className='mt-1'>
                    <h4 className='mb-0 fw-bolder' style={{textTransform: "capitalize", paddingBottom: '4px'}}>{title}</h4>
                    <h5 style={{ text: 'wrap' }}>{description}</h5>
                </div>
                <div className="d-flex justify-content-end" style={{cursor: 'pointer', marginTop: '1.5rem' }}>
                    {button}
                </div>
            </div>
        </div>
    </>
  )
}

export default IntegrationCard