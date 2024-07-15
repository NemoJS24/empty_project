import FaqComponent from '@src/views/main/components/Faq/FaqComponent'
import React from 'react'
import { superFaqData } from './SuperLeadz'
import Footer from '../../../utilities/footer/Footer'
export default function SuperLeadzFaq() {
    // faq data
    const faqData = superFaqData
    return (
        <>

            <div style={{ background: "#000" }} className=' ' >

                {/* <Navbar position={'notFixed'} /> */}
                {/* <SubNavbar navTitle={'superLeadz'} /> */}
                <div style={{ paddingTop: "160px" }}>

                    <FaqComponent data={faqData} name='partner' theme='theme-black' />

                </div>

            </div>
            <Footer />
        </>
    )
}
