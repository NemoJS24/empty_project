import React, { useState } from 'react'
const QRForm = () => {
    const [showOffer, setShowOffer] = useState(false)

    return (
        <>
            <div className="main_qr_form" style={{ width: '818px', maxWidth: '90%', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="row">
                    <div className="col-md-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src="https://superleads-widgets-images.s3.amazonaws.com/SuXwsPDEtnC7.jpeg" alt="" style={{ width: '200px', height: '200px' }} />
                    </div>
                    <div className="col-md-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {
                            showOffer ? (
                                <>
                                    <div className="form">
                                        <p className="editor-paragraph ltr mb-2" dir="ltr" style={{ textAlign: 'center' }}>
                                            <strong className="editor-text-bold" style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '21px', lineHeight: 1.25, color: 'rgb(0, 0, 0)' }} data-lexical-text="true">
                                                Thank you. Enjoy the offer!
                                            </strong>
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', margin: '10px 0px', backgroundColor: '#ffffff' }}>
                                            <div style={{ padding: '7.5px', borderBottom: '1px dashed black' }}>
                                                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '12.5px', color: '#000000' }}>
                                                    Get a FLAT 15% OFF on a spend of Rs. 1,499 and above!
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: '7.5px 15px', gap: '15px' }}>
                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="#000000" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="feather feather-tag">
                                                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                                            <line x1="7" y1="7" x2="7.01" y2="7" />
                                                        </svg>
                                                        <div style={{ color: '#000000' }}>SUPERLX15</div>
                                                    </div>
                                                    <div style={{ fontSize: '11px', backgroundColor: 'rgb(28, 58, 86)', color: '#ffffff', borderRadius: '6px', width: 'auto', maxWidth: '100%', padding: '10px' }}>
                                                        REDEEM
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'center', fontSize: '11px', color: '#000000' }}>
                                                    <em>Redeem to auto-apply code at checkout!</em>
                                                </div>
                                            </div>
                                        </div>
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
                                                <input placeholder="First Name" type="text" style={{ width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.93)', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }} />
                                            </div>
                                            <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                <input placeholder="Last Name" type="text" style={{ width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.93)', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }} />
                                            </div>
                                            <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                <input placeholder="Email address" type="text" style={{ width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.93)', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }} />
                                            </div>
                                            <div style={{ width: '255px', maxWidth: '90%', fontFamily: 'Lato', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                                <input placeholder="Mobile number" type="text" style={{ width: '100%', maxWidth: '100%', height: '35px', borderRadius: '10px', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', padding: '10px', margin: '9px 0px', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.93)', borderStyle: 'solid', minHeight: '41px', boxSizing: 'border-box', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.52)', backgroundImage: 'none', WebkitTextFillColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }} />
                                            </div>
                                            <div onClick={() => setShowOffer(!showOffer)} style={{ cursor: 'pointer', fontSize: '14px', backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', borderRadius: '6px', width: '250px', maxWidth: '100%', height: '45px', padding: '10px', margin: '10px 0px 22px', borderWidth: '0px', borderColor: 'rgb(0, 0, 0)', borderStyle: 'solid', minHeight: '0px', textShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px', rotate: '0deg', backgroundImage: 'none', boxShadow: 'rgb(0, 0, 0) 0px 0px 0px 0px', boxSizing: 'border-box', fontFamily: 'Montserrat', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <span id="textField-0-left-5" style={{ display: 'flex' }}>
                                                    <div className="editor-container editor_here position-relative 8DL">
                                                        <div className="editor-inner" style={{ width: '100%', display: 'block' }}>
                                                            <div className="editor-input" contentEditable="true" role="textbox" spellCheck="true" style={{ userSelect: 'text', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} data-lexical-editor="true">
                                                                <p className="editor-paragraph ltr" dir="ltr">
                                                                    <span style={{ fontWeight: 700 }} data-lexical-text="true">
                                                                        GET A SPECIAL OFFER
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
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