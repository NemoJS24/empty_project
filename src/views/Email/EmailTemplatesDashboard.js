/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Send } from 'react-feather'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { getReq } from '../../assets/auth/jwtService'
import { convertToHTML } from './EmailFunctions'
import { CiMenuKebab } from 'react-icons/ci'
import skeletonBg from './skeleton.svg'
export default function EmailTemplatesDashboard() {
  const [modal, setModal] = useState(false)
  const [useTemplatesList, setTemplatesList] = useState([])
  const params = new URLSearchParams(location.search)
  const toggle = () => setModal(!modal)

  useEffect(() => {
    getReq("template_details")
      .then((res) => {
        console.log(res.data.email_template)
        setTemplatesList(res.data.email_template)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])


  return (
    <div style={{ paddingBottom: "100px" }}>
      <Card>
        <CardBody className='d-flex justify-content-between align-items-center '>
          <h4 className="m-0">Templates</h4>
          <div onClick={toggle} className="btn btn-primary" >Create Template</div>
        </CardBody>
      </Card>
      <Row>
        {
          useTemplatesList.map((data, index) => {
            return (
              <Col md="6" key={index}>
                <Card>
                  <CardBody >
                    {/* <div className='p-1 px-4  rounded-2 bg-white  border d-flex justify-content-center  align-items-center' style={{ maxHeight: "400px", minHeight: "400px", overflow: "auto", background: `#fff` }}> */}
                    <div className='p-1 rounded-2 bg-white  border d-flex justify-content-center  align-items-start' style={{ maxHeight: "400px", overflow: "auto", background: `#fff` }}>
                      {/* render bidy */}
                      <style>{`
    .unset_class {
      
      margin: unset !important; 
      padding: unset !important; 
    }
    td{
      margin: unset !important; 
      padding: unset !important; 
    }
    // p{
    //   margin: unset !important; 
    //   padding: unset !important; 
    // }
  
    
  `}</style>
                      <div className='unset_class ' style={{ marginLeft: "-60px", marginTop: "-70px", all: "unset" }} dangerouslySetInnerHTML={{ __html: convertToHTML(data.body_content) }} />
                      {/* <div className='border-success'  dangerouslySetInnerHTML={{ __html: convertToHTML(data.body_content) }} /> */}
                    </div>
                    {/* buttons */}
                    <div>
                      <h5 className='mt-1 ms-1'>{data.template_name}</h5>
                    </div>
                    <div className='d-flex justify-content-between justify-content-center  mt-2'>
                      <div class="dropdown">
                        <button class="dropbtn"> <CiMenuKebab /> </button>
                        <div class="dropdown-content cursor-pointer">
                          {/* <div className='items'>Test</div> */}
                          <Link to={`/merchant/Email/builder/${data.unique_id}`} className='items'  >Edit</Link>
                          {/* <div className='items text-danger ' onClick={() => toggleActive(SingleTemplate.id, false)} >Deactivate</div> */}
                        </div>
                      </div>
                      <Link to={params.get('campagin_type') ? params.get('campagin_type') === "broadcast" ? `/merchant/Email/selectGroup/${data.unique_id}` : `/merchant/Email/create-campaign/${params.get('campagin_type')}/${data.id}` : `/merchant/Email/campaign/${data.id}`} className='btn btn-primary px-3 send-btn ' >Use Template </Link>

                    </div>
                  </CardBody>
                </Card>
              </Col>
            )
          })
        }

      </Row>
      <Modal size='lg' isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Try building one of these</ModalHeader>
        <ModalBody className='px-3'>
          <Row>

            <Col md="6">
              <Card style={{ minHeight: "400px", minWidth: "200px", background: "#f4f4f4" }}>
                <CardBody >
                  <div className=' rounded-2 bg-white text-center ' style={{ minWidth: "300px", minHight: "300px", maxHeight: "300px" }}>
                    <img src="https://fronty.com/static/uploads/1111.jpg" style={{ objectFit: "cover" }} className='w-100 rounded-1 ' alt="" />
                  </div>
                  <div className='mt-2'>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati aliquid suscipit eligendi incidunt.</p>
                  </div>
                  <div className='d-flex justify-content-end mt-2'>
                    <Link to="/merchant/Email/builder/" className='btn btn-primary px-3 send-btn ' >Start with Basic <Send id="send-icon" size={16} style={{ marginLeft: "5px" }} /></Link>

                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col md="6">
              <Card style={{ minHeight: "400px", minWidth: "200px", background: "#f4f4f4" }}>
                <CardBody >
                  <div className=' rounded-2 bg-white text-center ' style={{ minWidth: "300px", minHight: "300px", maxHeight: "300px" }}>
                    <img src="https://fronty.com/static/uploads/1111.jpg" style={{ objectFit: "cover" }} className='w-100 rounded-1 ' alt="" />
                  </div>
                  <div className='mt-2'>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati aliquid suscipit eligendi incidunt. </p>
                  </div>
                  <div className='d-flex justify-content-end mt-2'>
                    <Link to="/merchant/Email/builder/" className='btn btn-primary px-3 send-btn ' >Start with Advanced <Send id="send-icon" size={16} style={{ marginLeft: "5px" }} /></Link>

                  </div>
                </CardBody>
              </Card>
            </Col>


          </Row>
        </ModalBody>
      </Modal>
    </div>
  )
}
