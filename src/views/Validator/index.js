import toast from "react-hot-toast"
import $ from "jquery"
import { PermissionProvider } from "../../Helper/Context"
import { useContext } from "react"
import { SuperLeadzBaseURL, affiliateURL } from "../../assets/auth/jwtService"
import moment from "moment/moment"
import ReactGA from "react-ga4"

export const useAnalyticsPageViewTracker = (curTitle, path) => {
    ReactGA.initialize('G-4NRGB5EKCP') //xircls
    //ReactGA.initialize('G-0K44CMK09X') //demo
    console.log("hitting Google", {curTitle, path})
    ReactGA.send({ page: path, title: curTitle })
}

export const imageValidation = (e, size = 100) => {
    const maxSizeKB = size //Size in KB
    const maxSize = maxSizeKB * 1024 //File size is returned in Bytes
    const file_name = e.target.files[0].name.split('.').slice(0, -1).join('.')

    if (e.target.files[0].size > maxSize) {
        toast.error("File size is above 100KB")
        return false
    } else if (file_name.includes('.')) {
        toast.error("File name should not contain dot")
        return false
    } else if (file_name.includes(' ')) {
        toast.error("File name should not contain space.")
        return false
    } else {
        return true
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0')
}

export function formatDate(date) {
    return `${date.getFullYear()}-${padTo2Digits(date.getMonth() + 1)}-${padTo2Digits(date.getDate())} ${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}:${padTo2Digits(date.getSeconds())}`
}

export const validateEmail = (email) => {

    const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (emailCheck.test(email)) {
        return true
        // this is a valid email address
    } else {
        return false
        // invalid email
    }

}

export const xircls_url = "https://api.xircls.com/static"
export const ownUrl = "https://api.xircls.com/static"

export const formatNumberWithCommas = (number) => {
    let data
    try {
        data = Number(number).toLocaleString()
    } catch (error) {
        data = 0
    }
    return data
}

export const pageNo = [{ label: 10, value: 10 }, { label: 25, value: 25 }, { label: 50, value: 50 }, { label: 100, value: 100 }, { label: 500, value: 500 }, { label: 1000, value: 1000 }]

export const timelineName = {
    infiniti: {
        dashboard: "/merchant/dashboard/",
        is_plugin_installed: "/merchant/apps/",
        is_plan_purchased: "/plan_pricing/1/",
        is_company_created: "/merchant/company/profile/",
        is_outlet_created: "/merchant/campaign/outlet_profiling/",
        is_ret_offer_created: "/merchant/create_offers/?purpose=RET",
        is_acq_offer_created: "/merchant/create_offers/?purpose=ACQ",
        is_ret_offer_synced: "/merchant/offers/",
        is_acq_offer_synced: "/merchant/offers/"
    },
    superleadz: {
        dashboard: "/merchant/SuperLeadz/",
        is_plugin_installed: "/merchant/apps/",
        is_plan_purchased: "/merchant/SuperLeadz/joinus/",
        is_company_created: "/merchant/company/profile/",
        is_outlet_created: "/merchant/campaign/outlet_profiling/",
        is_offer_created: "/merchant/SuperLeadz/create_offers/",
        is_offer_synced: "/merchant/SuperLeadz/offers/",
        is_campaign_started: "/merchant/superleadz/templates",
        is_campaign_completed: "/merchant/campaign/"
    },
    flash_accounts: {
        is_plan_purchased: "/merchant/Flash_Accounts/joinus/",
        is_campaign_started: "/merchant/Flash_Accounts/all_campaigns/"
    },
    whatsapp: {
        is_business: "/merchant/whatsapp/business_creation/",
        // is_business: "/merchant/whatsapp/is_business/",
        is_project: "/merchant/whatsapp/is_business/",
        is_fb_verified: "/merchant/whatsapp/EmbeddedSignup/",
        is_template: "/merchant/whatsapp/is_template/"
    }
}

export const CompleteTimelineName = {
    infiniti: {
        dashboard: "/merchant/dashboard/",
        is_plugin_installed: "/merchant/apps/",
        is_plan_purchased: "/plan_pricing/1/",
        is_company_created: "/merchant/company/profile/",
        is_outlet_created: "/merchant/campaign/outlet_profiling/",
        is_ret_offer_created: "/merchant/create_offers/?purpose=RET",
        is_acq_offer_created: "/merchant/create_offers/?purpose=ACQ",
        is_ret_offer_synced: "/merchant/offers/",
        is_acq_offer_synced: "/merchant/offers/"
    },
    superleadz: {
        is_plugin_installed: "/merchant/SuperLeadz/",
        is_plan_purchased: "/merchant/SuperLeadz/billing/",
        is_campaign_started: "/merchant/SuperLeadz/all_campaigns/"
    }
}

export function validForm(validator, value) {
    console.log(validator.length)
    let isValid = true
    for (let i = 0; i < validator.length; i++) {
        const currentObject = validator[i]
        const fieldValue = value[currentObject.name]
        console.log(`${currentObject.id}_val`)

        const valueType = Array.isArray(fieldValue)
        console.log(valueType, "isArray")
        if (valueType) {
            if (fieldValue.length === 0) {
                $(`#${currentObject.id}_val`).html(currentObject.message)
                $(`input[name="${currentObject.id}"]`).focus()
                isValid = false
                break
            } else {
                $(`#${currentObject.id}_val`).html('')

                if (currentObject.type === "email") {
                    if (validateEmail(fieldValue)) {
                        console.log("validateEmail is true")
                    } else {
                        console.log("validateEmail is false")

                        $(`#${currentObject.id}_val`).html("Enter Valid Email id")
                        $(`input[name="${currentObject.id}"]`).focus()
                        isValid = false
                        break
                    }
                }
            }
        } else {

            if (!fieldValue) {
                $(`#${currentObject.id}_val`).html(currentObject.message)
                $(`input[name="${currentObject.id}"]`).focus()
                isValid = false
                // if (currentObject.type === "email") {
                //     if (validateEmail(fieldValue)) {
                //         console.log("validateEmail is true")
                //     } else {
                //         console.log("validateEmail is false")

                //         $(`#${currentObject.id}_val`).html(currentObject.message)
                //         $(`input[name="${currentObject.id}"]`).focus()
                //     }
                // }
                break
            } else {
                $(`#${currentObject.id}_val`).html('')
                console.log(currentObject.type, "typeof Object")

                if (currentObject.type === "email") {
                    if (validateEmail(fieldValue)) {
                        console.log("validateEmail is true")
                    } else {
                        console.log("validateEmail is false")

                        $(`#${currentObject.id}_val`).html("Please enter valid email ID")
                        $(`input[name="${currentObject.id}"]`).focus()
                        isValid = false
                        break
                    }
                }

                // console.log('Some fields are empty')
            }
        }

        // (empty string, empty array, false, null, undefined) covered ths all
    }


    return isValid
}

// $('.make_capitail').on('keyup', function() {
//     const $this = $(this)
//     const val = $this.val()

//     val = val.substr(0, 1).toUpperCase() + val.substr(1)
//     $this.val(val)
// })

export function getCurrentOutlet() {
    const { userPermission } = useContext(PermissionProvider)

    const campaignData = userPermission?.multipleDomain?.filter((cur) => cur?.api_key === userPermission?.apiKey)

    return campaignData
}

export const dashboardURL = {
    infiniti: "/merchant/dashboard/",
    superleadz: "/merchant/SuperLeadz/",
    referral: "/merchant/Referral/",
    flash_accounts: "/merchant/Flash_Accounts/",
    product_review: "/merchant/product-review/",
    oh_my_customer: "/merchant/oh-my-customer/",
    otp_verification: "/merchant/apps/",
    crm: "/merchant/customers/",
    whatsapp:"/merchant/whatsapp/",
    email: "/merchant/email/"
}

export function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' // Letters
    const numbers = '0123456789' // Numbers

    const randomLetter = () => characters.charAt(Math.floor(Math.random() * characters.length))
    const randomNumber = () => numbers.charAt(Math.floor(Math.random() * numbers.length))

    const randomString = randomNumber() + randomLetter() + randomLetter()
    return randomString
}

export const purpose = [
    { label: 'Increase brand recall', value: 'Increase brand recall', id: "1" },
    { label: 'Increase sales', value: 'Increase sales', id: "2" },
    { label: 'Increase registered users', value: 'Increase registered users', id: "3" },
    { label: 'Build high-quality email lists', value: 'Build high-quality email lists', id: "4" }
]

export const strategy = [
    { label: 'Newsletter Subscription', value: 'Newsletter Subscription', purpose_id: ["1", "3"], id: "1" },
    { label: 'Birthday Incentives', value: 'Birthday Incentives', purpose_id: ["1", "2", "3", "4"], id: "2" },
    { label: 'Sign-up Only', value: 'Sign-up Only', purpose_id: ["3"], id: "3" },
    { label: 'Membership', value: 'Membership', purpose_id: ["3"], id: "4" },
    { label: 'Gender Classification', value: 'Gender Classification', purpose_id: ["3", "4"], id: "5" }
]

export const Tone = [
    { label: 'Direct', value: 'Direct', strategy_id: ["3", "5"], id: "1" },
    { label: 'Casual/Chatty', value: 'Casual/Chatty', strategy_id: ["3", "5"], id: "2" },
    { label: 'Sophisticated', value: 'Sophisticated', strategy_id: ["3", "1"], id: "3" },
    { label: 'Urgent', value: 'Urgent', strategy_id: ["3", "4", "1"], id: "4" },
    { label: 'Incentivizing', value: 'Incentivizing', strategy_id: ["4"], id: "5" },
    { label: 'Enticing', value: 'Enticing', strategy_id: ["4", "5", "1"], id: "6" },
    { label: 'Enthusiastic', value: 'Enthusiastic', strategy_id: ["4", "2", "5", "1"], id: "7" },
    { label: 'Mysterious', value: 'Mysterious', strategy_id: ["4", "2"], id: "8" },
    { label: 'Warm', value: 'Warm', strategy_id: ["2", "1"], id: "9" },
    { label: 'Complimentary', value: 'Complimentary', strategy_id: ["2"], id: "10" },
    { label: 'Astrological', value: 'Astrological', strategy_id: ["2"], id: "11" },
    { label: 'Privacy-Focused', value: 'Privacy-Focused', strategy_id: ["5"], id: "12" }
]


// export const SuperLeadzStrategy = [
//     { label: 'Newsletter Subscription', value: 'Newsletter Subscription', purpose_id: ["1", "2", "3"], id: "1" }, // 1
//     { label: 'VIP Membership', value: 'VIP Membership', purpose_id: ["1", "2", "3", "5", "6", "7"], id: "2" },
//     { label: 'Discount for Data', value: 'Discount for Data', purpose_id: ["1", "2", "3", "4"], id: "3" },
//     { label: 'Returning Shopper Engagement', value: 'Returning Shopper Engagement', purpose_id: ["2", "3", "4", "5", "6", "7"], id: "4" },
//     { label: 'Discount on Product Collection', value: 'Discount on Product Collection', purpose_id: ["3", "4", "6", "7", "8"], id: "5" },
//     { label: 'Discount at Exit Intent', value: 'Discount at Exit Intent', purpose_id: ["3", "4", "5", "6", "7"], id: "6" },
//     { label: 'Limited Time Offer', value: 'Limited Time Offer', purpose_id: ["4", "5", "6", "7"], id: "7" },
//     { label: 'Discount for Specific Product', value: 'Discount for Specific Product', purpose_id: ["4", "6", "8"], id: "8" }
// ]
// 4 5 6
export const SuperLeadzPurpose = [
    { label: 'Increase brand recall', value: 'Increase brand recall', id: "1" }, // 1
    { label: 'Increase registered users', value: 'Increase registered users', id: "2" },
    { label: 'Build High-Quality Email Lists', value: 'Build High-Quality Email Lists', id: "3" },
    { label: 'Reduce Website Drop-Offs', value: 'Reduce Website Drop-Offs', id: "4" },
    { label: 'Reduce Cart Abandonments', value: 'Reduce Cart Abandonments', id: "5" },
    { label: 'Increase Sales', value: 'Increase Sales', id: "6" },
    { label: 'Convert Returning Shoppers', value: 'Convert Returning Shoppers', id: "7" },
    { label: 'Increase AOV', value: 'Increase AOV', id: "8" }
]
//  3 7 
export const SuperLeadzStrategy = [
    { label: 'Newsletter Subscription', value: 'Newsletter Subscription', SuperLeadz_purpose_id: ["1", "2", "3"], id: "1" }, // 1
    { label: 'VIP Membership', value: 'VIP Membership', SuperLeadz_purpose_id: ["1", "2", "3", "5", "6", "7"], id: "2" },
    { label: 'Discount for Data', value: 'Discount for Data', SuperLeadz_purpose_id: ["1", "2", "3"], id: "3" },
    { label: 'Returning Shopper Engagement', value: 'Returning Shopper Engagement', SuperLeadz_purpose_id: ["2", "3", "4", "7"], id: "4" },
    { label: 'Discount at Exit Intent, Returning Shopper Engagement', value: 'Discount at Exit Intent, Returning Shopper Engagement', SuperLeadz_purpose_id: ["3", "4", "5", "6", "7"], id: "5" },
    { label: 'Discount on Product Collection', value: 'Discount on Product Collection', SuperLeadz_purpose_id: ["3", "4", "6", "7", "8"], id: "6" },
    { label: 'Discount at Exit Intent', value: 'Discount at Exit Intent', SuperLeadz_purpose_id: ["4", "5", "6"], id: "7" },
    { label: 'Limited Time Offer', value: 'Limited Time Offer', SuperLeadz_purpose_id: ["4", "5", "6", "7"], id: "8" },
    { label: 'Discount for Specific Product', value: 'Discount for Specific Product', SuperLeadz_purpose_id: ["4", "6", "8"], id: "9" }
]

// 5 6 7
export const SuperLeadzTone = [
    { label: 'Direct', value: 'Direct', SuperLeadz_strategy_id: ["3", "2", "1"], id: "1" },
    { label: 'Casual/Chatty', value: 'Casual/Chatty', SuperLeadz_strategy_id: ["1", "4", "5"], id: "2" },
    { label: 'Urgent', value: 'Urgent', SuperLeadz_strategy_id: ["6", "8"], id: "4" },
    { label: 'Incentivizing', value: 'Incentivizing', SuperLeadz_strategy_id: ["4", "5", "6", "7", "8", "9"], id: "5" },
    { label: 'Enticing', value: 'Enticing', SuperLeadz_strategy_id: ["2", "6", "7", "8", "9"], id: "6" },
    { label: 'Enthusiastic', value: 'Enthusiastic', SuperLeadz_strategy_id: ["7"], id: "7" },
    { label: 'Warm', value: 'Warm', SuperLeadz_strategy_id: ["1"], id: "9" },
    { label: 'Complimentary', value: 'Complimentary', SuperLeadz_strategy_id: ["3"], id: "10" }
]


export const affiliateTracking = (aft_no) => {

    fetch(`${SuperLeadzBaseURL}/protein`)
        .then((data) => data.json())
        .then((resp) => {
            console.log(resp)
            const form_data = new FormData()
            form_data.append("aft_no", aft_no)
            form_data.append("ip_address", resp?.ip_address)
            form_data.append("link", location.pathname)

            fetch(`${affiliateURL}/affiliate/record/create_affiliate_click/`, {
                method: "POST",
                body: form_data
            })
                .then((result) => {
                    console.log(result)
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        .catch((error) => {
            console.log(error)
        })
}


export function defaultFormatDate(date, type) {
    if (!date) return ''
    if (date === '') return ''
    let formatDate
    try {
        formatDate = moment(date).format(Boolean(type) ? type : "DD-MM-YYYY")
    } catch (_) {
        formatDate = ''
    }
    return (formatDate)
}


export const defaultFormatNumber = (number, type) => {
    try {
        return new Intl.NumberFormat(type).format(number)
    } catch (error) {
        console.log(error)
        return number
    }

}


export function lightOrDark(color) {

    // Variables for red, green, blue values
    let r, g, b

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

        r = color[1]
        g = color[2]
        b = color[3]
    } else {

        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +(`${"0x"}${color.slice(1).replace(color.length < 5 && /./g, '$&$&')}`)

        r = color >> 16
        g = color >> (8 & 255)
        b = color & 255
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt((0.299 * (r * r)) + (0.587 * (g * g)) + (0.114 * (b * b)))

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

        return 'light'
    } else {

        return 'dark'
    }
}

export const allFonts = `https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Acme&family=Caveat:wght@400;500;600&family=Dancing+Script:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lexend:wght@100;200;300;400;500;600;700;800;900&family=Lilita+One&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Oswald:wght@200;300;400;500;600;700&family=Pacifico&family=Play:wght@400;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Satisfy&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Lora:ital,wght@0,400..700;1,400..700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Quicksand:wght@300..700&family=Mulish:ital,wght@0,200..1000;1,200..1000&family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Manrope:wght@200..800&family=Heebo:wght@100..900&family=Annapurna+SIL:wght@400;700&family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Libre+Franklin:ital,wght@0,100..900;1,100..900&family=Mukta:wght@200;300;400;500;600;700;800&family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Nanum+Gothic&family=Noto+Sans+SC:wght@100..900&family=Inconsolata:wght@200..900&family=Hind+Siliguri:wght@300;400;500;600;700&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Arimo:ital,wght@0,400..700;1,400..700&family=Jacquarda+Bastarda+9&family=Archivo:ital,wght@0,100..900;1,100..900&family=Bebas+Neue&family=Dosis:wght@200..800&family=Abel&display=swap`