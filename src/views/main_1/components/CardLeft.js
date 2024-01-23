import React from 'react'

export default function CardLeft({ icon, title, desc, imgSrc }) {
    return (
        <div className='mt-4 mt-md-3 p-0 '>
            <div className='fs-1 text-dark ' style={{ marginBottom: '13px' }}>
                {icon}
                {imgSrc ? <img src={imgSrc} width={42} alt='rem' /> : ''}
            </div>
            <div className=''>
                <h1 className='fs-1 main-heading fw-bolder ' style={{ marginBottom: '10px' }}>{title}</h1>
                <h2 className='fs-3  text-black lh-32 m-0  '>{desc}</h2>
            </div>
        </div>
    )
}
