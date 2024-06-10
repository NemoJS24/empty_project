import React from 'react'
import WA_background from '../imgs/WA_background.png'
export default function StaticPage1() {
  return (
    <div className='d-flex flex-column justify-content-center  align-items-center  bg- h-100 ' style={{background:"#f0f2f5"}} >
      <img src={WA_background} width={500} alt="" style={{mixBlendMode:"darken"}} />
      <div className='display-6' style={{color:"#4d4d4d"}}>Welcome to WhatsApp by XIRCLS.</div>
      <h5>Click on a conversation to start interacting with your customers.</h5>
    </div>
  )
}
