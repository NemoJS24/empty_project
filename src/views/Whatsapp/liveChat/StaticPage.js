import React from 'react'
import w1Img from './w1.jpg'
export default function StaticPage1() {
  return (
    <div className='d-flex flex-column  justify-content-center align-items-center border bg- h-100' style={{background:"#fafbfc"}}>
      <img src={w1Img} width={500} alt="" />
      <h5>Please select contact to view messages</h5>
    </div>
  )
}
