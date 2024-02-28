import React from 'react'
import { Card, CardBody } from 'reactstrap'

const LeadOffer = () => {
   return (
      <Card>
      <CardBody>
         <div className="d-flex flex-column justify-content-center">
            <h4 className='m-0 text-center'>No Offers to display</h4>
            <button type="button" class="btn btn-primary text-center mx-auto mt-1">Add Offers</button>
         </div>
      </CardBody>
   </Card>
   )
}

export default LeadOffer