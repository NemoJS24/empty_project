/* eslint-disable multiline-ternary */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getReq, postReq } from '../../../assets/auth/jwtService'
import BasicEditor from '../../Components/Editor/BaseEditor'
import FrontBaseLoader from '../../Components/Loader/Loader'

export default function CreateEmail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [usePlaceholder, setPlaceholder] = useState([])
  const [useLoader, setLoader] = useState(false)
  const defaultData = {
    editorState: "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":1,\"mode\":\"normal\",\"style\":\"font-weight: 300;\",\"text\":\"Hi {customer_first_name}\",\"type\":\"text\",\"version\":1},{\"detail\":0,\"format\":1,\"mode\":\"normal\",\"style\":\"font-weight: 300;font-size: 17px;line-height: 2;\",\"text\":\",\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"{otp} is your one-time password.\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Please enter this code in the relevant field to verify your identity as a genuine shopper at our\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"store.\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"{outlet_name}\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Thank you!\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Regards,\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Team\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
    htmlContent: "<p class=\"editor-paragraph\" style=\"text-align: center;\" dir=\"ltr\"><b><strong class=\"editor-text-bold\" style=\"font-weight: 300; white-space: pre-wrap;\">Hi {customer_first_name}</strong></b><b><strong class=\"editor-text-bold\" style=\"font-weight: 300; font-size: 17px; line-height: 2; white-space: pre-wrap;\">,</strong></b></p><p class=\"editor-paragraph\" style=\"text-align: center;\" dir=\"ltr\"><span style=\"white-space: pre-wrap;\">{otp} is your one-time password.</span></p><p class=\"editor-paragraph\" dir=\"ltr\"><br></p><p class=\"editor-paragraph\" style=\"text-align: center;\" dir=\"ltr\"><span style=\"white-space: pre-wrap;\">Please enter this code in the relevant field to verify your identity as a genuine shopper at our</span></p><p class=\"editor-paragraph\" style=\"text-align: center;\" dir=\"ltr\"><span style=\"white-space: pre-wrap;\">store.</span></p><p class=\"editor-paragraph\" style=\"text-align: center;\" dir=\"ltr\"><span style=\"white-space: pre-wrap;\">{outlet_name}</span></p><p class=\"editor-paragraph\" style=\"text-align: center;\" dir=\"ltr\"><span style=\"white-space: pre-wrap;\">Thank you!</span></p><p class=\"editor-paragraph\" style=\"text-align: center;\" dir=\"ltr\"><span style=\"white-space: pre-wrap;\">Regards,</span></p><p class=\"editor-paragraph\"><br></p><p class=\"editor-paragraph\" style=\"text-align: center;\" dir=\"ltr\"><span style=\"white-space: pre-wrap;\">Team</span></p>",
    subject: "{otp} is your one-time password at {outlet_name}",
    template_name: "Dummy Title"
  }
  const [finalObj, setFinalObj] = useState({ email_settings: defaultData })

  const [editorBar, setEditorBar] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {

    getReq("template_placeholder")
      .then((res) => {
        console.log(res.data.placeholder)
        setPlaceholder(res.data.placeholder)
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(id)

    getReq("template_details", `?unique_id=${id}`)
      .then((res) => {
        // console.log(res.data?.email_template[0])
        if (res.data?.email_template[0]?.unique_id) {
          setFinalObj({
            email_settings: {
              htmlContent: res.data?.email_template[0]?.body_content,
              editorState: res.data?.email_template[0]?.json_content,
              subject: res.data?.email_template[0]?.subject,
              template_name: res.data?.email_template[0]?.template_name
            }
          })
          setCount(count + 1)
        } else {
          console.log("not found")
          setFinalObj({ email_settings: defaultData })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const saveEmail = (isclose) => {
    const form_data = new FormData()
    form_data.append("htmlContent", finalObj.email_settings.htmlContent)
    form_data.append("editorState", finalObj.email_settings.editorState)
    form_data.append("subject", finalObj.email_settings.subject)
    form_data.append("template_name", finalObj.email_settings.template_name)
    form_data.append("is_active", false)
    setLoader(true)
    postReq("template_details", form_data)
      .then((res) => {
        // console.log(res)
        if (res.data.message) {
          toast.success(res.data.message)
          if (isclose) {
            navigate("/merchant/Email/templates")
          }
        }
      })
      .catch((err) => {
        console.log(err)
      }).finally(() => setLoader(false))

  }
  const uptEmail = (isclose) => {
    const form_data = new FormData()
    form_data.append("htmlContent", finalObj.email_settings.htmlContent)
    form_data.append("editorState", finalObj.email_settings.editorState)
    form_data.append("subject", finalObj.email_settings.subject)
    form_data.append("template_name", finalObj.email_settings.template_name)
    form_data.append("is_active", false)
    form_data.append("unique_id", id)
    setLoader(true)
    postReq("template_details", form_data)
      .then((res) => {
        console.log(res)
        if (res.data.message) {
          toast.success(res.data.message)
          if (isclose) {
            navigate("/merchant/Email/templates")
          }
        }
      })
      .catch((err) => {
        console.log(err)
      }).finally(() => setLoader(false))

  }

  return (
    <div>
        {/* <div className='d-flex p-1 border gap-2 m-1'>
          <div className='btn border'>setp1</div>
          <div className='btn border'>step2</div>
          <div className='btn border'>step3</div>
        </div> */}
{
 useLoader && <FrontBaseLoader />
}
      <Card className=''>
        <CardBody className='d-flex justify-content-between align-items-center '>
          <h4 className='m-0'>Build Your Email</h4>
          <div className="d-flex gap-2 justify-content-end align-items-center  ">
            <Link className='btn btn-primary rounded-1' to="/merchant/Email/templates">Back</Link>
            {/* <div className='btn border rounded-1' onClick={() => { setFinalObj({ email_settings: defaultData }); setCount(count + 1) }}>reset </div> */}
            {
              id ? <div className='d-flex gap-1'><div className='btn btn-primary' onClick={() => uptEmail(true)}>Save </div><div className='btn btn-primary' onClick={uptEmail}>Save & Close </div> </div> 
              : <div className='d-flex gap-1'><div className='btn btn-primary' onClick={() => saveEmail(true)}>Save </div> <div className='btn btn-primary' onClick={saveEmail}>Save & Close </div></div>
            }
         

          </div>
        </CardBody>
      </Card>


      <Row >
        <Col md="3" >
          <Card >
            <CardBody>
              <div >

                <div className="py-1">
                  <h4 className="">Template Name</h4>
                  <input value={finalObj?.email_settings?.template_name} onChange={(e) => setFinalObj({ ...finalObj, email_settings: { ...finalObj.email_settings, template_name: e.target.value } })} disabled={id} type="text" className="form-control" placeholder="name" />
                </div>
                <div className="py-1">
                  <h4 className="">Subject</h4>
                  <input value={finalObj?.email_settings?.subject} onChange={(e) => setFinalObj({ ...finalObj, email_settings: { ...finalObj.email_settings, subject: e.target.value } })} name="subject" type="text" className="form-control" id="subject" placeholder="Subject" />
                </div>

                <div className="py-1">
                  <h4 className="">Placeholders <span className='fs-6 fw-light '> {'('} Click to copy {')'}</span></h4>

                  <div className='border p-1 rounded' style={{ height: '350px', overflowY: 'auto' }}>
                    {
                      usePlaceholder?.map((curElem, index) => (
                        <div key={index} className="toggleSection d-flex flex-column align-items-start justify-content-start mb-1">
                          <div style={{ width: "100%", padding: "0.5rem" }}>
                            <div
                              className=" shadow-sm border rounded text-dark w-100 d-flex flex-column justify-content-between align-items-center p-1"
                              onClick={() => {
                                const tempInput = document.createElement('input')
                                tempInput.value = curElem.placeholders
                                document.body.appendChild(tempInput)
                                tempInput.select()
                                tempInput.setSelectionRange(0, 99999)
                                document.execCommand('copy')
                                document.body.removeChild(tempInput)
                                toast.success("Value Copied Successfully")
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <span className='fw-bolder text-black' style={{ fontSize: "0.75rem" }}>{curElem.variable}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

              </div>
            </CardBody>
          </Card>
        </Col>

        {/* render preview */}
        <Col md="9">
          <div className="d-flex justify-content-center align-items-start mt-3 ">

            <Card
              style={{ border: "1px solid #eee", maxWidth: "800px" }}
              onClick={() => setEditorBar(!editorBar)} onBlur={() => setEditorBar(!editorBar)}
            >
              <CardBody >
                {/* <CardBody style={{ height: '500px', overflowY: 'auto' }}> */}
                <div
                  style={{ padding: "10px 20px", lineHeight: '25px', color: "#424242" }}
                  // colSpan={2}
                  bgcolor="#fff"
                  align="center"
                >
                  <font size={3} face="sans-serif">
                    <div >
                      <div id="emailTemplateId"></div>
                      <BasicEditor elementId={`emailTemplateId`}
                        key={count}
                        style={{ width: '120%' }}
                        // hideToolbar={editorBar}
                        editorState={finalObj?.email_settings?.editorState}
                        htmlContent={finalObj?.email_settings?.htmlContent}
                        onChange={(html, ediorState) => {
                          // console.log("html", html)
                          // console.log("ediorState", ediorState)
                          setFinalObj({ ...finalObj, email_settings: { ...finalObj.email_settings, editorState: ediorState, htmlContent: html } })
                        }}
                      />
                    </div>
                  </font>
                </div>
              </CardBody>
            </Card>

          </div>
        </Col>
      </Row>
    </div>
  )
}
