/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'

export default function CodeUserDetails() {
    const { id } = useParams()
    const [UserDetails, setUserDetails] = useState('')
    const getData = () => {


    }
    useEffect(() => {
        fetch('https://apps.xircls.com/leads/lead_form_data/', {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                const user = data.filter(elm => elm.unique_id === id)
                console.log(user[0]?.json_data?.ques)
                setUserDetails(user[0])
            })
            .catch(error => {
                // Handle errors here
                console.error('Error:', error)
            })
    }, [])

    if (!UserDetails) {
        return null
    }

    const questions = UserDetails?.json_data?.ques || {}
    // console.log(UserDetails?.json_data?.ques['Are you making sure to apply sunscreen to your entire body?'])
    console.log(UserDetails?.json_data?.ques, "----")
    return (<>
        <Card>
            <CardBody>
                <h4 className="">Code skin user data </h4>
            </CardBody>
        </Card>
        <Card>
            <CardBody className='d-flex flex-column  gap-2'>
                <div className='d-flex gap-2'>
                    <h4 className="">Email : </h4>
                    <h4 className="fw-light"> {UserDetails?.email ?? ''}</h4>
                </div>
                {
                    Object.entries(questions).map(([key, value]) => {
                        console.log(key, value)
                        return (
                            <>
                                <div className=' flex-column '>
                                    <h4 className="">{key}</h4>
                                    <h4 className="fw-light mt-1 d-flex flex-column"> {value}</h4>
                                </div>
                            </>
                        )
                    })
                }
                {/* <div className=''>
                    <h4 className="">How many birthdays have you celebrated?  </h4>
                    <h4 className="fw-light mt-1"><li> {UserDetails?.json_data?.ques['How many birthdays have you celebrated?'] ?? ''} </li></h4>
                </div>
                <div className=' flex-column '>
                    <h4 className="">Which description most accurately characterizes your skin type?  </h4>
                    <h4 className="fw-light mt-1 d-flex flex-column"> {UserDetails?.json_data?.ques['Which description most accurately characterizes your skin type?'].map(elm => <li>{elm}</li>)}</h4>
                </div>
                <div className='x'>
                    <h4 className="">Are you making sure to apply sunscreen to your entire body? </h4>
                    <h4 className="fw-light mt-1"> <li> {UserDetails?.json_data?.ques['Are you making sure to apply sunscreen to your entire body?'] ?? ''} </li></h4>
                </div> */}
            </CardBody>
        </Card>
    </>
    )
}
