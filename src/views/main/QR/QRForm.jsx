import React, { useEffect, useState } from 'react'
import { baseURL } from '../../../assets/auth/jwtService'
import { useParams } from 'react-router-dom'
import { ownUrl, validateEmail } from '../../Validator'
import FrontBaseLoader from '../../Components/Loader/Loader'
import toast from 'react-hot-toast'
const QRForm = () => {
    const { id } = useParams()
    const [showOffer, setShowOffer] = useState(false)
    const [secondPage, setSeondPage] = useState(false)
    const [data, setData] = useState({
        Email: "",
        Mobile: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const updateData = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    console.log(data)
    const inputStyle = { width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: '#ccc', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)', outline: 'none' }
    const getData = () => {

        fetch(`${baseURL}/qr/get_form/?outlet_id=${id}`)
        .then((data) => data.json())
        .then((resp) => {
            console.log(resp?.response?.selected_whatsapp_template)
            const updatedData = {
                form_id: resp?.response?.form_id,
                inner_xircls_id: resp?.response?.inner_xircls_id,
                selected_list: resp?.response?.selected_list,
                selected_whatsapp_template: resp?.response?.selected_whatsapp_template ? JSON.parse(resp?.response?.selected_whatsapp_template) : [],
                outlet_logo: resp?.response?.outlet_logo,
                platforms: resp?.response?.platforms
                // htmlcode: resp?.response?.htmlcode
            }
            try {
                document.getElementById('htmlcode').innerHTML = resp?.response?.htmlcode

            } catch (error) {
                console.log(error)
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
        delete form_json.outlet_logo
        delete form_json.selected_list

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

    console.log(setSeondPage)

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
        <style>{`
            .main_qr_form::-webkit-scrollbar {
                display: none;
            }
        `}
        </style>
            {
                isLoading ? <FrontBaseLoader /> : ''
            }
            <div className="main_qr_form" style={{ width: '818px', maxWidth: '90%', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', height: '90vh', overflow: 'auto', margin: 'auto', border: '1px solid #ccc', borderRadius: '7px', overflowX: 'hidden'}}>
                <div className="row">
                    <div className="col-md-6 mb-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={data?.outlet_logo ? `${ownUrl}/${data?.outlet_logo}` : ''} alt="" style={{ width: '200px', height: '200px' }} />
                    </div>
                    <div className="col-md-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {
                            showOffer ? (
                                <>

                                        {
                                            data?.selected_list?.length > 0 ? (
                                                <>
                                                    <div className="form p-1" style={{width: '100%'}}>
                                                        <div className='mb-2 text-center'>
                                                            <p className="editor-paragraph ltr" dir="ltr" style={{ textAlign: 'center', marginBottom: '5px' }}>
                                                                <strong className="editor-text-bold" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '21px', lineHeight: 1.25, color: 'rgb(0, 0, 0)' }} data-lexical-text="true">
                                                                    We'll reach out soon!
                                                                </strong>
                                                            </p>

                                                            <span className="editor-paragraph ltr" dir="ltr" style={{ textAlign: 'center' }}>
                                                                In the meantime, enjoy these offers.
                                                            </span>
                                                            
                                                        </div>
                                                        
                                                        {
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
                                                                                                window.open(data?.platforms === 'shopify' ? `https://${curElem?.web_url}/discount/${curElem?.seller_ref_code}/` : `https://${curElem?.web_url}`, '_blank')
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
                                                                                <a
                                                                                data-aos="fade-in"
                                                                                style={{ display: 'flex', justifyContent: 'center', marginRight: '3px', fontSize: '10px' }}
                                                                                className=""
                                                                                >
                                                                                Click 'Redeem Now' to auto-apply offer code at checkout
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                        
                                                    </div>

                                                </>
                                                
                                            ) : (
                                                <div className="form" style={{width: '100%'}}>
                                                    <div className='mb-2 text-center p-1'>
                                                        <p className="editor-paragraph ltr" dir="ltr" style={{ textAlign: 'center', marginBottom: '5px' }}>
                                                            <strong className="editor-text-bold" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '21px', lineHeight: 1.25, color: 'rgb(0, 0, 0)' }} data-lexical-text="true">
                                                                Thank you for your response.
                                                            </strong>
                                                        </p>
                                                        <span className="editor-paragraph ltr" dir="ltr" style={{ textAlign: 'center' }}>
                                                            We'll reach out soon!
                                                        </span>
                                                    </div>
                                                    
                                                    
                                                </div>
                                            )
                                        }
                                    
                                </>
                            ) : (
                                <>

                                    <div className="form p-1">
                                        {
                                            !secondPage && <div id="htmlcode" className='mb-1'></div>
                                        }
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '15px', lineHeight: '1.5' }}>
                                            {
                                                secondPage ? (
                                                    <>
                                                        <div className='form-group mb-2'>
                                                            <h5 style={{fontSize: '18px', marginBottom: '15px'}}>1. How do you decide which handbag to buy</h5>
                                                            <div className="form-check mb-1">
                                                                <input onClick={(e) => setData({...data, ['How do you decide which handbag to buy']: e.target.checked ? e.target.value : ""})} type="radio" name='first_handnag' id="first" value={"I go through the website, whichever I like I buy"} className="form-check-input cursor-pointer" />
                                                                <label className="cursor-pointer" style={{ fontSize: "14px" }} htmlFor="first">I go through the website, whichever I like I buy</label>
                                                            </div>
                                                            <div className="form-check mb-1">
                                                                <input onClick={(e) => setData({...data, ['How do you decide which handbag to buy']: e.target.checked ? e.target.value : ""})} type="radio" name='first_handnag' id="second" value={"I already have the size, color, functionality, and price decided, and I buy based on my requirements."} className="form-check-input cursor-pointer" />
                                                                <label className="cursor-pointer" style={{ fontSize: "14px" }} htmlFor="second">I already have the size, color, functionality, and price decided, and I buy based on my requirements.</label>
                                                            </div>
                                                            <div className="form-check mb-1">
                                                                <input onClick={(e) => setData({...data, ['How do you decide which handbag to buy']: e.target.checked ? e.target.value : ""})} type="radio" name='first_handnag' id="third" value={"I follow celebrities, top brands, Influencers etc. and I buy something that I have seen someone use"} className="form-check-input cursor-pointer" />
                                                                <label className="cursor-pointer" style={{ fontSize: "14px" }} htmlFor="third">I follow celebrities, top brands, Influencers etc. and I buy something that I have seen someone use</label>
                                                            </div>
                                                            <div className="form-check mb-1">
                                                                <input onClick={(e) => setData({...data, ['How do you decide which handbag to buy']: e.target.checked ? e.target.value : ""})} type="radio" name='first_handnag' id="fouth" value={"Others, Please specify"} className="form-check-input cursor-pointer" />
                                                                <label className="cursor-pointer" style={{ fontSize: "14px" }} htmlFor="fouth">Others</label>
                                                                {
                                                                    data['How do you decide which handbag to buy']?.includes("Others, Please specify") && (
                                                                        <>
                                                                            <input placeholder='Please specify' onChange={(e) => updateData({target: {name: e.target.name, value: `Others, Please specify - ${e.target.value}`}})} name='How do you decide which handbag to buy' type="text" style={{...inputStyle, textAlign: 'left'}} />
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className='form-group mb-2'>
                                                            <h5 style={{fontSize: '16px', marginBottom: '10px'}}>2. What are the biggest challenges you face when shopping for handbags online?</h5>
                                                            <div className="form-check mb-1">
                                                                <input type="radio" id="second_first" onClick={(e) => setData({...data, ['What are the biggest challenges you face when shopping for handbags online?']: e.target.checked ? e.target.value : ""})} name='second_design' value={"There are so many designs it’s so hard to choose."} className="form-check-input cursor-pointer" />
                                                                <label className="cursor-pointer" style={{ fontSize: "14px" }} htmlFor="second_first">There are so many designs it’s so hard to choose.</label>
                                                            </div>
                                                            <div className="form-check mb-1">
                                                                <input type="radio" id="second_second" onClick={(e) => setData({...data, ['What are the biggest challenges you face when shopping for handbags online?']: e.target.checked ? e.target.value : ""})} name='second_design' value={'There is not enough information provided by the brand on their website about the bag'} className="form-check-input cursor-pointer" />
                                                                <label className="cursor-pointer" style={{ fontSize: "14px" }} htmlFor="second_second">There is not enough information provided by the brand on their website about the bag</label>
                                                            </div>
                                                        </div>
                                                        <div className='form-group mb-2'>
                                                            <h5 style={{fontSize: '16px', marginBottom: '10px'}}>3. What features or functionalities do you wish handbags offered but currently do not?</h5>
                                                            <input onChange={(e) => updateData(e)} name='What features or functionalities do you wish handbags offered but currently do not?' type="text" style={{...inputStyle, textAlign: 'left'}} />
                                                        </div>

                                                        <div onClick={() => saveData()} style={{ cursor: 'pointer', fontSize: '14px', backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', borderRadius: '6px', width: '250px', maxWidth: '100%', height: '45px', padding: '10px', margin: '10px 0px 22px', borderWidth: '0px', borderColor: 'rgb(0, 0, 0)', borderStyle: 'solid', minHeight: '0px', textShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px', rotate: '0deg', backgroundImage: 'none', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', boxSizing: 'border-box', fontFamily: 'Montserrat', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            Submit
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                            <input onChange={(e) => updateData(e)} name='First Name' placeholder="First Name" type="text" style={inputStyle} />
                                                        </div>
                                                        <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                            <input onChange={(e) => updateData(e)} name='Last Name' placeholder="Last Name" type="text" style={inputStyle} />
                                                        </div>
                                                        <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                            <input value={data?.Email} onChange={(e) => updateData(e)} name='Email' placeholder="Email" type="text" style={inputStyle} />
                                                            <span id="email_address" className='text-danger text-center m-0 p-0 vaildMessage'></span>

                                                        </div>
                                                        <div value={data?.Mobile} style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                            <input onChange={(e) => {
                                                                if (!isNaN(e.target.value)) {
                                                                    updateData(e)
                                                                }
                                                            }} name='Mobile' placeholder="Mobile No." type="text" style={inputStyle} />
                                                            <span id="mobile_number" className='text-danger text-center m-0 p-0 vaildMessage'></span>
                                                        </div>
                                                        {
                                                            id === 1447 || id === '1447' ? (
                                                                <>
                                                                    <div onClick={() => {
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
                                                                        setSeondPage(true)
                                                                    }} style={{ cursor: 'pointer', fontSize: '14px', backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', borderRadius: '6px', width: '250px', maxWidth: '100%', height: '45px', padding: '10px', margin: '10px 0px 22px', borderWidth: '0px', borderColor: 'rgb(0, 0, 0)', borderStyle: 'solid', minHeight: '0px', textShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px', rotate: '0deg', backgroundImage: 'none', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', boxSizing: 'border-box', fontFamily: 'Montserrat', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                        Next
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div onClick={() => saveData()} style={{ cursor: 'pointer', fontSize: '14px', backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', borderRadius: '6px', width: '250px', maxWidth: '100%', height: '45px', padding: '10px', margin: '10px 0px 22px', borderWidth: '0px', borderColor: 'rgb(0, 0, 0)', borderStyle: 'solid', minHeight: '0px', textShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px', rotate: '0deg', backgroundImage: 'none', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', boxSizing: 'border-box', fontFamily: 'Montserrat', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                        GET A SPECIAL OFFER
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                        
                                                    </>
                                                )
                                            }
                                            
                                            
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