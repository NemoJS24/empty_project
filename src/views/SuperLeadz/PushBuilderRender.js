// import React from "react"
// import image from './assets/87865_chrome_icon.png'
// import { RxCross2 } from "react-icons/rx"
// import { BsThreeDots } from "react-icons/bs"
// // import image2 from './assets/Spider-man.png'
// import { Card } from "reactstrap"

// const PushBuilderRender = () => {
//     return (
//         <>
//             <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
//                 <Card style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', backGround:'#ffffffa8'}}>
//                     <div style={{ width: '500px', height: '200px', overflow: 'hidden',  borderRadius:'5px 5px 0px 0px'  }}>
//                         <img
//                             src="https://images.unsplash.com/photo-1562155847-c05f7386b204?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//                             style={{ width: '100%', height: 'auto'}}
//                             alt="Sample"
//                         />
//                     </div>
//                     <div className="d-flex justify-content-between mt-1">
//                         <div className="d-flex justify-content-start align-items-center">
//                             <img className="ms-1 image" src={image} style={{ width: '25px', height: '25px' }} />
//                             <h4 className="ms-1" style={{ fontSize: '15px', marginTop: '5px' }}> Google Chrome</h4>
//                         </div>
//                         <div>
//                             <BsThreeDots className="me-2" />
//                             <RxCross2 className="me-2" />
//                         </div>
//                     </div>
//                     <div className="d-flex mt-2">
//                         <img className="ms-1 badge" src='https://images.unsplash.com/photo-1562155847-c05f7386b204?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' style={{ width: '50px', height: '50px' }} />
//                         <div className="ms-1">
//                             <h4 style={{ fontSize: '15px' }}> Text Title</h4>
//                             <h6 style={{ fontSize: '13px' }}> Sub Title</h6>
//                             <h6 style={{ fontSize: '10px' }}> Your.website</h6>
//                         </div>
//                     </div>
//                     <div className="d-flex justify-content-center mt-1">
//                         <input placeholder="Type your explanation here" className="" style={{backgroundColor: '#f1f1f1', width: '90%', border: 'none', borderBottom: '1px solid #000', cursor: 'pointer', borderRadius: '5px', textAlign: 'center', padding: '5px' }} />
//                     </div>

//                     <div className="d-flex justify-content-around mb-2 mt-2">
//                         <button className="" style={{ backgroundColor: '#f1f1f1', color: 'black', fontSize: '16px', padding: '6px 80px', border: 'none', cursor: 'pointer', borderRadius: '5px', textAlign: 'center' }}>Button 1</button>
//                         <button className="" style={{ backgroundColor: '#f1f1f1', color: 'black', fontSize: '16px', padding: '6px 80px', border: 'none', cursor: 'pointer', borderRadius: '5px', textAlign: 'center' }}>Button 2</button>
//                     </div>

//                 </Card>
//             </div>
//         </>
//     )
// }

// export default PushBuilderRender

import React from "react"
import { RxCross2 } from "react-icons/rx"
import { BsThreeDots } from "react-icons/bs"
import { Card } from "reactstrap"
import image from './assets/87865_chrome_icon.png'

const PushBuilderRender = ({ imageUrl, iconImage, appName, title, subtitle, website, inputPlaceholder1, buttonText1, buttonText2 }) => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <Card style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', background: '#ffffffa8' }}>
                <div style={{ width: '500px', height: '200px', overflow: 'hidden', borderRadius: '5px 5px 0px 0px' }}>
                    <img src={imageUrl} style={{ width: '100%', height: 'auto' }} alt="Sample" />
                </div>
                <div className="d-flex justify-content-between mt-1">
                    <div className="d-flex justify-content-start align-items-center">
                    <img className="ms-1 image" src={image} style={{ width: '25px', height: '25px' }} />
                        <h4 className="ms-1" style={{ fontSize: '15px', marginTop: '5px' }}>{appName}</h4>
                    </div>
                    <div>
                        <BsThreeDots className="me-2" />
                        <RxCross2 className="me-2" />
                    </div>
                </div>
                <div className="d-flex mt-2">
                    <img className="ms-1 " src={iconImage} style={{ width: '50px', height: '50px' }} alt="Badge" />
                    <div className="ms-1">
                        <h4 style={{ fontSize: '15px' }}>{title}</h4>
                        <h6 style={{ fontSize: '13px' }}>{subtitle}</h6>
                        <h6 style={{ fontSize: '10px' }}>{website}</h6>
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-1">
                    <input placeholder={inputPlaceholder1} className="" style={{ backgroundColor: '#f1f1f1', width: '90%', border: 'none', borderBottom: '1px solid #000', cursor: 'pointer', borderRadius: '5px', textAlign: 'center', padding: '5px' }} />
                </div>
                <div className="d-flex justify-content-around mb-2 mt-2">
                    <button className="" style={{ backgroundColor: '#f1f1f1', color: 'black', fontSize: '16px', padding:"5px", width: '200px', border: 'none', cursor: 'pointer', borderRadius: '5px', textAlign: 'center' }}>{buttonText1}</button>
                    <button className="" style={{ backgroundColor: '#f1f1f1', color: 'black', fontSize: '16px', padding:"5px", width: '200px', border: 'none', cursor: 'pointer', borderRadius: '5px', textAlign: 'center' }}>{buttonText2}</button>
                </div>
            </Card>
        </div>
    )
}

export default PushBuilderRender
