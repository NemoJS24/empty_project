import React from 'react'
import WA_background from '../imgs/WA_background.png'
export default function StaticPage1() {
  return (
    <div className='d-flex flex-column justify-content-center  align-items-center border bg- h-100 bg-white' >
      <img src={WA_background} width={500} alt="" />
      <div className='display-4' style={{color:"#4d4d4d"}}>Welcome to WhatsApp by XIRCLS.</div>
      <h3>Click on a conversation to start interacting with your customers.</h3>
    </div>
  )
}
