import React from 'react'
import FaqComponent from '@src/views/main/components/Faq/FaqComponent'
import Footer from '@src/views/main/utilities/footer/Footer'

export default function Faqcomponent() {
    // faq data
    const faqData = [
        {
            q: "What is Flash Accounts?",
            a: "Flash Accounts seamlessly converts guest customers into registered users via a sign-up prompt displayed on the post-purchase Thank You page."
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
            q: "Can I try out Flash Accounts for free?",
            a: "Yes, you can! Install Flash Accounts and try it for free for upto 100 transactions every month. "
        },
        {
            q: "How does the pricing work?",
            a: "You can try out Flash Accounts for free, with a limit of up to 100 transactions per month. Once you surpass this limit, choose a plan based on the monthly average of transactions you anticipate on your website."
        },
        {
            q: "What happens if I surpass the allocated number of transactions in my current plan?",
            a: "If you exceed the allocated number of transactions within your current plan, your Flash Accounts campaign will temporarily stop and resume in the next billing cycle. To resume the campaign immediately, upgrade to a higher plan."
        },
        {
            q: "What is the billing date?",
            a: "Billing will occur monthly, and the billing date will be the same as the date of your first purchase."
        },
        {
            q: "Can I cancel at any time?",
            a: <>We prioritize your satisfaction above all else. Should you encounter any challenges or have concerns, please reach out to <a href='mailto:support@xircls.com?subject=Support regarding plan cancellation.' className='text-primary'>support@xircls.com</a> or call/WhatsApp <a href='tel:+91 9969 333 666' className='text-primary'>+91 9969 333 666</a>. We will do our best to assist you. <br /><br /> To cancel your plan subscription, navigate to the Billing section of your Flash Accounts dashboard. <br /><br />Please note: After you cancel your subscription, your account will automatically revert to the free plan, which has no expiry date, allowing you to use it indefinitely. </>
        }
    ]
    return (
        <div style={{ background: "#fff" }} >

            <div className=''>
                <FaqComponent data={faqData} name='partner' theme="theme-black" />
            </div>

            <hr className='mt100' />
            <Footer />

        </div>
    )
}
