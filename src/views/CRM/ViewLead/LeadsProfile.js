/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getReq } from '../../../assets/auth/jwtService'
import { Card, CardBody } from 'reactstrap'
import LeadsProfileNav from './Components/LeadsProfileNav'
import BasicDetails from './Components/BasicDetails'
import Spinner from '../../Components/DataTable/Spinner'
import LeadOffer from './Components/LeadOffer'
import LeadInteraction from './Components/LeadInteraction'

const LeadsProfile = () => {
  const { id } = useParams()
  const [userData, setUserData] = useState()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  console.log(userData)

  const getUser = () => {
    getReq('leads_get', `?lead_id=${id}`)
      .then((resp) => {
        setUserData(resp.data.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getUser()
  }, [])

  const NavCurrentStep = (step) => {
    setCurrentStep(step)
  }

  return (
    <>
      {isLoading ? <div className='w-100 h-100 d-flex justify-content-center align-content-center'>
        <Spinner size='40px' />
      </div> : <>
        <Card>
          <CardBody>
            <h4>Lead profile</h4>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className=''>
              <LeadsProfileNav currentStep={currentStep} NavCurrentStep={NavCurrentStep} />
            </div>
          </CardBody>
        </Card>
        {/* <Card>
        <CardBody> */}
        <div>
          {[<BasicDetails userData={userData} />, <LeadInteraction userData={userData} id={id}/>, <LeadOffer />][currentStep - 1]}
        </div>
        {/* </CardBody>
      </Card> */}</>
      }
    </>
  )
}

export default LeadsProfile