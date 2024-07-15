import React, { useState } from 'react'
import { Plus, X } from 'react-feather'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { postReq } from '../../../assets/auth/jwtService'
import FrontBaseLoader from '../../Components/Loader/Loader'
import toast from 'react-hot-toast'

export default function AddEmailForm() {
  const [contacts, setContacts] = useState([{ first_name: '', last_name: '', email: '' }])
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const [useLoader, setLoader] = useState(false)
const navigate = useNavigate()

  const handleAddRow = () => {
    setContacts([...contacts, { first_name: '', last_name: '', email: '' }])
  }

  const handleInputChange = (index, event) => {
    const { name, value } = event.target
    const updatedContacts = [...contacts]
    updatedContacts[index][name] = value
    if (name === "email") {
      const iderr = document.getElementById(`err${index}`)
      if (!value.match(validRegex)) {
        console.log("invalid")
        iderr.style.opacity = 1
      } else {
        iderr.style.opacity = 0
      }
    }
    setContacts(updatedContacts)
  }

  const handleRemoveRow = (index) => {
    const updatedContacts = [...contacts]
    updatedContacts.splice(index, 1)
    setContacts(updatedContacts)

  }

  const handleUpload = (isClose) => {

    const formData = new FormData()
    formData.append("contact_list", JSON.stringify(contacts))
    console.log("contacts", contacts)
    const defData = contacts
    let isError = false
    defData.map((elm, index) => {
      const iderr = document.getElementById(`err${index}`)
      if (!elm.email.match(validRegex)) {
        iderr.style.opacity = 1
        isError = true
      } else {
        isError = false
      }
    })
    if (isError) {
      console.log("invalid email")
      return false
    }

    // return null
    setLoader(true)
    postReq("add_contacts", formData)
      .then(res => {
        console.log('res add group:', res)
        toast.success("Contacts added!")
        if (isClose === "close") {
          navigate('/merchant/Email/import')
        }
      })
      .catch(error => {
        console.error('Error:', error)
        toast.error("Something went wrong!")

      }).finally(() => setLoader(false))
  }
  return (
    <div>
      <style>
        {`
        .none{
          opacity:0
        }
        `}
      </style>
      {
        useLoader && <FrontBaseLoader />
      }
      <Card>
        <CardBody className='d-flex justify-content-between align-items-center'>
          <h5 className='m-0'>
            Add Contacts
          </h5>

        </CardBody>
      </Card>
      <div className='mt-3'>

        {contacts.map((contact, index) => {
          return (
            <Row key={index} className='mt-2'>
              <Col md="1" className='d-flex justify-content-start align-items-center'>
                <div className='mt-1 ms-3'> {index + 1}</div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <label htmlFor="fname">First Name</label>
                  <input
                    type="text"
                    className='form-control'
                    name="first_name"
                    placeholder="First Name"
                    value={contact.first_name}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <label htmlFor="lname">Last Name</label>
                  <input
                    type="text"
                    className='form-control'
                    name="last_name"
                    placeholder="Last Name"
                    value={contact.last_name}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className='form-control'
                    name="email"
                    placeholder="Email"
                    value={contact.email}
                    onChange={(e) => handleInputChange(index, e)}
                  />

                  <p id={`err${index}`} className={`text-danger font-small-3 none m-0`}>Please enter a valid email ID</p>
                </div>
              </Col>
              <Col md="1" className=''>
                <div className='d-flex justify-content-start align-items-center mt-2'>

                  {
                    contacts.length !== 1 && <button className="btn  btn-sm" onClick={() => handleRemoveRow(index)} ><X size={15} /></button>
                  }
                  {
                    contacts.length === index + 1 && <button className="btn  btn-sm ms-1" onClick={() => handleAddRow()}><Plus size={15} /></button>
                  }

                </div>
              </Col>
            </Row>
          )
        }
        )}
      </div>

      <div className='d-flex justify-content-between align-items-center mt-4 px-2'>
        <Link to="/merchant/Email/import" className='btn btn-primary' >Back</Link>
        <div className='d-flex gap-1'>

          <button className='btn btn-primary' onClick={() => handleUpload("save")}>Save</button>
          <button className='btn btn-primary' onClick={() => handleUpload("close")}>Save & Close</button>
        </div>
      </div>
    </div>
  )
}
