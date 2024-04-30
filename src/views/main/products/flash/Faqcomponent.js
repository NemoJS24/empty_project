import React from 'react'
import FaqComponent from '@src/views/main/components/Faq/FaqComponent'
import Footer from '@src/views/main/utilities/footer/Footer'

export default function Faqcomponent() {
    // faq data
    const faqData = [
        {
            q: "What is Flash Accounts?",
            a: "Flash Accounts seamlessly converts guest customers into registered users via a sign-up prompt displayed on the post-purchase Thank You page"
        },
        {
            q: "How is Flash Accounts different from other post-purchase sign-up tools?",
            a: <>Flash Accounts is markedly different from other post-purchase sign-up tools, mainly in these aspects: <br /><br /><div className='mb-1'>1. <strong>Form variety:</strong> Instead of just one standard sign-up form, Flash Accounts provides an extensive selection of templates tailored to align with specific business goals, strategies, and brand voices.</div><div className="mb-1">2. <strong>Second-shot sign-ups:</strong> Guest customers who do not engage with the sign-up form are sent account creation reminder emails at a later date.</div><div className="mb-1">3. <strong>Unique performance analysis:</strong> Statistics include the number of Flash Account sign-ups, at which purchase did they sign up, opt-in reports and more.</div></>
        },
        {
            q: "How do I know whether Flash Accounts is the right tool for me?",
            a: <>Flash Accounts is the right tool for you if you want to: <br /><br />1. Encourage more repurchases <br />2. Increase the likelihood of customer loyalty and advocacy <br />3. Tailor marketing strategies to match individual preferences <br />4. Enhance your customers' shopping experience with swift checkouts, personalized recommendations, and exclusive offers.</>
        },
        {
            q: "What are templates?",
            a: "Templates are different variations of the account creation form and post-sign-up success message based on the purpose/business goal, marketing strategy and brand voice."
        },
        {
            q: "What does Purpose mean?",
            a: "Purpose refers to specific business goals you aim to accomplish by activating the Flash Accounts module on your store’s Thank You page, for which tailored strategies are recommended."
        },
        {
            q: "What are Strategies?",
            a: "Strategies refer to different use cases of the Flash Accounts module that provide added value and enhance customer experience through offerings such as Membership, Newsletter Subscription, Birthday Incentives, and more."
        },
        {
            q: "What is Brand Voice?",
            a: "Brand Voice encompasses the tone, language, and manner in which the Flash Accounts module communicates with guest customers. You can pick a Brand Voice that aligns best with your brand identity."
        },
        {
            q: "What is a campaign?",
            a: "A campaign consists of a Flash Accounts module set to display for a specific duration with customized design and content. Campaigns help you determine which Flash Accounts strategy and communication works best to convert guest customers into registered users."
        },
        {
            q: "Can I run more than one campaign at a time?",
            a: "You can run only one campaign at a time. You can, however, schedule multiple campaigns for distinct, non-overlapping periods."
        },
        {
            q: "What is the success message?",
            a: "The success message appears after a guest customer engages with the Flash Accounts module, notifying them of the successful creation of their store account."
        },
        {
            q: "What is the success message email?",
            a: "The success message email is triggered after a guest customer engages with the Flash Accounts module, notifying them of the successful creation of their store account."
        },
        {
            q: "What is the sign-up reminder email?",
            a: "The sign-up reminder email is sent to guest customers who don't engage with the Flash Accounts module post-purchase. The pre-scheduled email notifies them about pending store account creation and encourages sign-up."
        },
        {
            q: "What are opt-ins?",
            a: <>Opt-ins are explicit and voluntary permissions granted by guest customers during account creation to receive promotional communications, updates, or marketing materials from your store. <br /><br />
            There are 3 types of opt-ins that can be activated - email, SMS, and marketing communications (newsletter). Opt-ins build a more engaged audience, ensuring compliance with privacy regulations and respecting individual customer preferences.</>
        }
    ]
    return (
        <div style={{ background: "#fff" }} >

            {/* <Navbar position={'notFixed'} /> */}
            {/* <SubNavbar navTitle={'partners'} /> */}

            <div className=''>
                <FaqComponent data={faqData} name='partner' theme="theme-black" />
            </div>

            <hr className='mt100' />
            <Footer />

        </div>
    )
}
