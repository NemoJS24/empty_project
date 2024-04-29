import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'

const LeadInteraction = ({id}) => {
   return (
      <Card>
         <CardBody>
            <div className="d-flex flex-column justify-content-center">
               <h4 className='m-0 text-center'>No Interactions to display</h4>
               <Link to={`/merchant/customers/Add-Call-lead/${id}`} className='text-center mx-auto mt-1'>
                  <button type="button" class="btn btn-primary " >Add Interaction</button>
               </Link>
            </div>
         </CardBody>
      </Card>
   )
}

export default LeadInteraction