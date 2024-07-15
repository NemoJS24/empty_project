/* eslint-disable no-unused-vars */
import React from 'react'
import { Card, CardBody, Col, FormGroup, Input, InputGroup, InputGroupText, Label, Row } from 'reactstrap'
import { Twitter, Facebook, Instagram, Edit, Linkedin } from 'react-feather'
import Select from 'react-select'
import moment from 'moment'
const LeadPersonalInfo = ({ AllFormData }) => {

  const { userData, handleInputChange, handleSelectInputChange, postData, handleNext, handleBack } = AllFormData

  // const handleChildrenChange = (e) => {
  //   setPersonalInfo({
  //     ...personalInfo,
  //     children: e.target.value
  //   })
  // }

  const marital_status = [
    { value: "Married", label: "Married" },
    { value: "Single", label: "Single" },
    { value: "In Relationship", label: "In Relationship" },
    { value: "Eivorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" }
  ]

  const occupation = [
    { value: "Employed", label: "Employed" },
    { value: "Business Owner", label: "Business Owner" },
    { value: "Retired Professional", label: "Retired Professional" },
    { value: "Student", label: "Student" },
    { value: "Homemaker", label: "Homemaker" }
  ]

  const gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" }
  ]

  const children = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ]

  return (
    <>
      <Row>
        <Col md='12' className='d-flex justify-content-between align-items-center'>
          <h4 className='m-0'>Personal Details</h4>
        </Col>

        <Col md='4' className='mt-1'>
          <Label htmlFor="dob">
            Date Of Birth
          </Label>
          <Input
            id="dob"
            name="cust_dob"
            type="date"
            //  disabled={!editMode}
            value={userData.cust_dob}
            // value={moment(userData.cust_dob).format("YYYY-MM-DD")}
            onChange={handleInputChange}
          />
        </Col>

        <Col md='4' className='mt-1'>
          <Label htmlFor="gender">
            Gender
          </Label>
          <Select
            //  isDisabled={!editMode}
            name='gender'
            placeholder='Select Gender'
            id='gender'
            options={gender}
            value={gender.find(option => option.value === userData.gender)}
            onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
          />
        </Col>

        <Col md='4' className='mt-1'>
          <Label htmlFor="marital_status">
            Marital Status
          </Label>
          <Select
            id='marital_status'
            options={marital_status}
            placeholder='Select Marital Status'
            name='marital_status'
            value={marital_status?.filter((curElem) => userData?.marital_status === curElem?.value)}
            //  isDisabled={!editMode}
            onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
          />
        </Col>

        <Col md='4' className='mt-1'>
          <Label htmlFor="children">Children</Label>
          <Select
            options={children}
            name='children'
            placeholder='Children'
            id='children'
            value={children.find(option => option.value === userData.children)}
            onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
          />
        </Col>
        {userData.children === "yes" && (
          <Col md='4' className='mt-1'>
            <Label htmlFor="count">Number of Children</Label>
            <Input
              id="count"
              type="number"
              placeholder='Number of Children'
              name='NO_Of_Children'
              value={userData.NO_Of_Children}
              onChange={handleInputChange}
            //  disabled={!editMode}
            />
          </Col>
        )}
        <Col md='4' className='mt-1'>
          <Label htmlFor="occupation">
            Occupation
          </Label>
          <Select
            //  isDisabled={!editMode}
            options={occupation}
            placeholder='Select Occupation'
            name='occupation'
            value={occupation.find(option => option.value === userData.occupation)}
            onChange={(value, actionMeta) => handleSelectInputChange(value, actionMeta)}
          />
        </Col>
        {['Business Owner', 'Employed'].includes(userData?.occupation) && <Col md='4' className='mt-1'>
          <Label htmlFor="sector">
            Sector
          </Label>
          <Input
            //  isDisabled={!editMode}
            options={occupation}
            id='sector'
            name='sector'
            placeholder='Sector'
            value={userData?.sector}
            onChange={handleInputChange}
          />
        </Col>
        }
        <Col md='4' className='mt-1'>
          <Label htmlFor="designation">
            Designation
          </Label>
          <Input
            id="designation"
            name="designation"
            placeholder="Designation"
            type="text"
            value={userData.designation}
            onChange={handleInputChange}
          //  disabled={!editMode}
          />
        </Col>
        <Col md='12' className='mt-2'>
          <h4 className='m-0'>lead_Social Presence</h4>
        </Col>
        <Col md='3' className='mt-1'>
          <Label htmlFor="twitter">
            Twitter
          </Label>
          <InputGroup>
            <InputGroupText>
              <Twitter size='18px' />
            </InputGroupText>
            <Input
              id='twitter'
              type='text'
              value={userData.lead_social_twitter}
              name="lead_social_twitter"
              placeholder='https://www.twitter.com/'
              //  disabled={!editMode}
              onChange={handleInputChange}
            />
          </InputGroup>
        </Col>

        <Col md='3' className='mt-1'>
          <Label htmlFor="facebook">
            Facebook
          </Label>
          <InputGroup>
            <InputGroupText>
              <Facebook size='18px' />
            </InputGroupText>
            <Input
              id='facebook'
              type='text'
              name='lead_social_fb'
              value={userData.lead_social_fb}
              placeholder='https://www.facebook.com/'
              //  disabled={!editMode}
              onChange={handleInputChange}
            />
          </InputGroup>
        </Col>
        <Col md='3' className='mt-1'>
          <Label htmlFor="instagram">
            Instagram
          </Label>
          <InputGroup>
            <InputGroupText>
              <Instagram size='18px' />
            </InputGroupText>
            <Input
              id='instagram'
              type='text'
              name='lead_social_insta'
              value={userData.lead_social_insta}
              placeholder='https://www.instagram.com/'
              //  disabled={!editMode}
              onChange={handleInputChange}
            />
          </InputGroup>
        </Col>
        <Col md='3' className='mt-1'>
          <Label htmlFor="Linkedin">
            Linkedin
          </Label>
          <InputGroup>
            <InputGroupText>
              <Linkedin size='18px' />
            </InputGroupText>
            <Input
              id='Linkedin'
              type='text'
              name='lead_social_linkedIn'
              value={userData.lead_social_linkedIn}
              placeholder='https://www.linkedin.com/'
              //  disabled={!editMode}
              onChange={handleInputChange}
            />
          </InputGroup>
        </Col>
      </Row>
    </>
  )
}

export default LeadPersonalInfo