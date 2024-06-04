import React, { useEffect, useState } from 'react'
import { baseURL } from '../../../assets/auth/jwtService'
import { useParams } from 'react-router-dom'
import { ownUrl, validateEmail } from '../../Validator'
import FrontBaseLoader from '../../Components/Loader/Loader'
import toast from 'react-hot-toast'
const QRForm = () => {
    const { id } = useParams()
    const [showOffer, setShowOffer] = useState(false)
    const [data, setData] = useState({
        Email: "",
        Mobile: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const updateData = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    console.log(data)

    const getData = () => {

        fetch(`${baseURL}/qr/get_form/?outlet_id=${id}`)
        .then((data) => data.json())
        .then((resp) => {
            console.log(resp?.response?.selected_whatsapp_template)
            const updatedData = {
                form_id: resp?.response?.form_id,
                inner_xircls_id: resp?.response?.inner_xircls_id,
                selected_list: resp?.response?.selected_list,
                selected_whatsapp_template: resp?.response?.selected_whatsapp_template ? JSON.parse(resp?.response?.selected_whatsapp_template) : {}
            }

            setData((preData) => ({
                ...preData,
                ...updatedData
            }))
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const saveData = () => {
        // 478

        if (data['Email'] === "") {
            toast.error("Please enter your email address")
            return
        }
        const email = validateEmail(data['Email'])
        if (!email) {
            toast.error("Please enter a valid email address")
            return
        }
        if (data['Mobile'] === "") {
            toast.error("Please enter your mobile number")
            return
        }
        setIsLoading(true)
        const form_data = new FormData()
        form_data.append('form_id', data?.form_id)
        const form_json = {...data}
        delete form_json.form_id
        delete form_json.inner_xircls_id
        delete form_json.selected_whatsapp_template

        form_data.append('form_json', JSON.stringify(form_json))
        form_data.append('outlet_id', id)
        fetch(`${baseURL}/qr/save_form_answers/`, {
            method: "POST",
            body: form_data
        })
        .then((data) => data.json())
        .then((resp) => {
            console.log(resp)
            setShowOffer(!showOffer)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const saveForLater = (whatsapp_id) => {
        const form_data = new FormData()
        form_data.append('outlet_id', id)
        form_data.append('whatsapp_tem_id', whatsapp_id)
        form_data.append('contact', data?.Mobile)
        fetch(`${baseURL}/qr/send_whatsapp_message/`, {
            method: "POST",
            body: form_data
        })
        .then((data) => data.json())
        .then((resp) => {
            console.log(resp)
            toast.success('Offer sent to your inbox!')
            document.getElementById(`offer_id_${key}`).remove()
        })
        .catch((error) => {
            console.error(error)
        })
        
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            {
                isLoading ? <FrontBaseLoader /> : ''
            }
            <div className="main_qr_form" style={{ width: '818px', maxWidth: '100%', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', height: '100vh', overflow: 'auto', margin: '30px 0px' }}>
                <div className="row">
                    <div className="col-md-6 mb-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src="https://superleads-widgets-images.s3.amazonaws.com/SuXwsPDEtnC7.jpeg" alt="" style={{ width: '200px', height: '200px' }} />
                    </div>
                    <div className="col-md-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }}>
                        {
                            showOffer ? (
                                <>

                                    <div className="form" style={{width: '100%'}}>
                                        <p className="editor-paragraph ltr mb-2" dir="ltr" style={{ textAlign: 'center' }}>
                                            <strong className="editor-text-bold" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '21px', lineHeight: 1.25, color: 'rgb(0, 0, 0)' }} data-lexical-text="true">
                                                Thank you. Enjoy the offer!
                                            </strong>
                                        </p>
                                        
                                        {
                                            data?.selected_list?.length > 0 ? (
                                                data?.selected_list?.map((curElem, key) => {
                                                    const whatsapp_campagin = data?.selected_whatsapp_template?.filter((whatsapp_tem) => String(whatsapp_tem?.offer_id) === String(curElem?.id))
                                                    // console.log(whatsapp_campagin[0]?.whatsapp_tem_id)
                                                    // console.log(whatsapp_campagin[0])
                                                    // const offerJson = JSON.parse(curElem?.offer_json)
                                                    const offerImage = curElem.offer_image ? `${ownUrl}${curElem.offer_image}` : ''
                                                    const offerSavingsValue = parseFloat(curElem.offer_savings_value).toFixed(2)
                                                    const offerMinOrder = parseFloat(curElem.offer_min_order).toFixed(2)
                                                    return (
                                                        <>
                                                            <div
                                                                key={key}
                                                                className="container mt-1"
                                                                id={`offer_id_${key}`}
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    flexDirection: 'column',
                                                                    padding: 'auto 10px',
                                                                    marginBottom: '30px'
                                                                }}
                                                                >
                                                                <div className="parent" style={{ maxWidth: '100%' }}>
                                                                    <div className="card set_width" style={{ width: '100%', margin: 'auto auto 5px auto', borderRadius: '3px' }}>
                                                                    <div
                                                                        className="parent-border"
                                                                        data-aos="fade-in"
                                                                        style={{
                                                                        width: '100%',
                                                                        height: '149px',
                                                                        backgroundImage: `url(${offerImage})`,
                                                                        backgroundRepeat: 'no-repeat',
                                                                        backgroundSize: 'cover',
                                                                        position: 'relative',
                                                                        backgroundPosition: 'center'
                                                                        }}
                                                                    >
                                                                        <div
                                                                        className="text text-center d-none"
                                                                        style={{ color: '#fff', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                                                        >
                                                                        <div className="border-holder" style={{ border: '2px dashed #fff', padding: '20px' }}>
                                                                            <h4 style={{ fontWeight: 600, lineHeight: 1.7, fontSize: '1.1rem' }} className="text-white">
                                                                            {offerSavingsValue}% OFF ON ₹ {offerMinOrder} <br /> & ABOVE
                                                                            </h4>
                                                                        </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                    <a
                                                                    href={`https://xircls.com/merchant/outlets/tandc/${curElem?.id}`}
                                                                    data-aos="fade-in"
                                                                    style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '3px', fontSize: '10px' }}
                                                                    className=""
                                                                    >
                                                                    Terms & Conditions
                                                                    </a>
                                                                    <div
                                                                    className="set_width"
                                                                    data-aos="fade-up"
                                                                    style={{ width: '100%', padding: '0.9rem 0.5rem', borderRadius: '3px', marginTop: '10px' }}
                                                                    >
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                        <div className="holder" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                                                            <div className="btns">
                                                                                <a onClick={() => saveForLater(whatsapp_campagin[0]?.whatsapp_tem_id)} className="background-hover" style={{ whiteSpace: 'nowrap', padding: '7px 20px', color: '#20BD99', border: '1px solid #20BD99', borderRadius: '5px' }}>
                                                                                    Save for later
                                                                                </a>
                                                                            </div>
                                                                            <div className="btns">
                                                                            <a
                                                                                className="border-hover"
                                                                                onClick={() => {
                                                                                    window.open(`https://${curElem?.web_url}/discount/${curElem?.seller_ref_code}/`, '_blank')
                                                                                    // window.location.href = 
                                                                                }}
                                                                                style={{
                                                                                padding: '7px 20px',
                                                                                color: '#fff',
                                                                                backgroundColor: '#20BD99',
                                                                                border: '1px solid #20BD99',
                                                                                outline: 'none',
                                                                                borderRadius: '5px',
                                                                                whiteSpace: 'nowrap'
                                                                                }}
                                                                            >
                                                                                Redeem now
                                                                            </a>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                })
                                            ) : (
                                                <h5>Offer Not Found!</h5>
                                            )
                                        }
                                    </div>
                                    
                                </>
                            ) : (
                                <>

                                    <div className="form">
                                        <p className="editor-paragraph ltr" dir="ltr" style={{ textAlign: 'center' }}>
                                            <strong className="editor-text-bold" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '21px', lineHeight: 1.25, color: 'rgb(0, 0, 0)' }} data-lexical-text="true">
                                            Learn about Fashion Design & Interior Design courses!
                                            </strong>
                                        </p>
                                        <p className="editor-paragraph ltr" dir="ltr" style={{ textAlign: 'center' }}>
                                            <strong className="editor-text-bold" style={{ fontFamily: 'Montserrat', fontWeight: 300, fontSize: '15px', color: 'rgb(0, 0, 0)', lineHeight: 1.25 }} data-lexical-text="true">
                                                Enquire now and get exciting offers from top brands.
                                            </strong>
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                                            <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                <input onChange={(e) => updateData(e)} name='First Name' placeholder="First Name" type="text" style={{ width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.93)', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }} />
                                            </div>
                                            <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                <input onChange={(e) => updateData(e)} name='Last Name' placeholder="Last Name" type="text" style={{ width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.93)', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }} />
                                            </div>
                                            <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                <input value={data?.Email} onChange={(e) => updateData(e)} name='Email' placeholder="Email" type="text" style={{ width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.93)', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }} />
                                                <span id="email_address" className='text-danger text-center m-0 p-0 vaildMessage'></span>

                                            </div>
                                            <div value={data?.Mobile} style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                <input onChange={(e) => {
                                                    if (!isNaN(e.target.value)) {
                                                        updateData(e)
                                                    }
                                                }} name='Mobile' placeholder="Mobile No." type="text" style={{ width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.93)', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }} />
                                                <span id="mobile_number" className='text-danger text-center m-0 p-0 vaildMessage'></span>
                                            </div>
                                            <div onClick={() => saveData()} style={{ cursor: 'pointer', fontSize: '14px', backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', borderRadius: '6px', width: '250px', maxWidth: '100%', height: '45px', padding: '10px', margin: '10px 0px 22px', borderWidth: '0px', borderColor: 'rgb(0, 0, 0)', borderStyle: 'solid', minHeight: '0px', textShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px', rotate: '0deg', backgroundImage: 'none', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', boxSizing: 'border-box', fontFamily: 'Montserrat', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                            GET A SPECIAL OFFER
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default QRForm