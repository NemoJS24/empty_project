import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownUrl } from '../../Validator'
import { PermissionProvider } from '../../../Helper/Context'

export const CampaignType = () => {

  const [selectedCampaignType, setSelectedCampaignType] = useState('broadcast')
  const { userPermission } = useContext(PermissionProvider)
  const campaignTypeCard = [
    {
      img: `${ownUrl}/images/dashboard/broadcast_campaign.png`,
      description: "Send messages to multiple contacts simultaneously.",
      name: 'Broadcast',
      slug: 'broadcast'
    },
    {
      img: `${ownUrl}/images/dashboard/message_campaign.png`,
      description: "Trigger predefined messages for specific customer actions or events.",
      name: 'Automated Message',
      slug: 'automated-message'
    }
    // {
    //   img: `${ownUrl}/images/dashboard/journey_campaign.png`,
    //   description: "Design automated messaging paths for targeted engagement.",
    //   name: 'Automated Journeys',
    //   slug: 'automated-journey'
    // }
  ]

  const navigate = useNavigate()

  return (
    <>
      <div className="row">
        <div className="card">
          <div className="card-body">
            <h4 className='m-0'>Select Campaign Type</h4>
          </div>
        </div>
      </div>
      <div className="row match-height">
        {
          campaignTypeCard?.map((curElem) => {
            return (
              <div className="col-md-4" onClick={() => setSelectedCampaignType(curElem?.slug)}>
                <div className={`card ${curElem?.slug === selectedCampaignType ? 'border-primary' : ''} cursor-pointer`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-center align-items-center">
                      <img style={{ width: '250px', height: '250px', maxWidth: '100%'}} src={curElem?.img} alt="#" />

                    </div>
                    <div className='text-center'>
                      <h4>{curElem?.name}</h4>
                      <p>{curElem?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }

      </div>

      <div className="row">
        <div className="d-flex justify-content-end align-items-center">
          <a className="btn btn-primary" onClick={() => navigate(`/merchant/${userPermission?.appName}/templates/?campagin_type=${selectedCampaignType}`)}>
            Next
          </a>
        </div>
      </div>

    </>
  )
}
