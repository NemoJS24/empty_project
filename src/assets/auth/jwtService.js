import axios from "axios"
import { getToken, removeToken, setToken } from "./auth"
import jwtDecode from "jwt-decode"
import toast from "react-hot-toast"
import { Navigate } from "react-router-dom"

export const baseURL = "https://api.demo.xircls.in"
export const SuperLeadzBaseURL = "https://apps.demo.xircls.in"
export const crmURL = "https://crm.demo.xircls.in"
export const affiliateURL = "https://api.demo.affiliate.xircls.com"
export const SocketBaseURL = "wss://api.demo.xircls.in"

// const URLs = {
//     baseURL,
//     SuperLeadzBaseURL,
//     crmURL
// }

// // Live 
// export const baseURL = "https://api.xircls.com"
// export const SuperLeadzBaseURL = "https://apps.xircls.com"
// export const crmURL = "https://crm.xircls.com"
// export const affiliateURL = "https://api.affiliate.xircls.com"
// export const SocketBaseURL = "wss://api.xircls.com"

export const configUrl = {

    login: "/merchant/login/",
    signup: "/merchant/signup/",
    refresh: "/api/token/refresh/",
    generalPost:"/utility/api/v1/user_utility_settings_post/",

    // affilate
    signupAffiliate:'/affiliate/affiliate_signup/',
    loginAffiliate:'/affiliate/affiliate_login/',
    admin_withdrawn_transactions: "/affiliate/admin_withdrawn_trans",
    admin_withdrawn_request: "/affiliate/admin_withdrawn_req/",
    //Infiniti
    addPartners: "/merchant/xircls/make-a-xircls/",
    remarketing: "/merchant/campaign_setting/action_email_remarketing/",
    target: "/merchant/campaign/target-criteria/",
    campaign: "/merchant/campaign-stop-setting/",
    email_template_builder: "/merchant/settings/campaign_email_customization/",
    email_template_view: "/merchant/email-settings/INFINITI/",
    website: "/merchant/plugin_setting/",
    outletType: "/merchant/choose-outlet-type/",
    getCategory: "/merchant/categories/",
    saveOutletDetails: "/merchant/create-outlet/",
    networkDashboard: "/merchant/xircls/networks-dashboard/",
    addPlanDetails: "/merchant/xircls/make-a-xircls/",
    getDashboardData: "/dashboard/add_count_dash/",
    getDashboardCampaginDetails: "/dashboard/current_campaign/",
    sendNetworkMail: "/merchant/xircls/create-network/",
    getCustomersDetails: "/merchant/customers/",
    getInvoiceList: "/merchant/subcriptions/invoice_list/",
    getSubscriptionDetails: "/merchant/subcriptions/my-subscriptions/",
    saveInnerXirclsDetails: "/merchant/xircls/inner_circle/",
    myTransactions: "/merchant/subcriptions/my-transactions/",
    saveWebsiteFrontend: "/merchant/plugin_setting/",
    customerGroup: "/merchant/customers/groups/",
    merchantProfile: '/merchant/profile/',
    notificationData: '/merchant/xircls/network_settings/',
    verifyEmail: "/merchant/verify_your_email/",
    verifyDomain: "/merchant/verify_your_domain/",
    outletsDetails: '/merchant/outlets-details/',
    infinitiEmailBuilder: '/merchant/email-settings/INFINITI/',
    changePassword: "/merchant/change-password/",
    deleteTemplate: "/merchant/email-settings/",
    innerXirclTwo: "/merchant/xircls/inner_circle_two/",
    LoyaltySelectOffers: "/offers/show-offer/",
    addCompany: '/merchant/company/profile/',
    productDetails: "/products/get-products-details/",
    singleProductData: "/products/view-product/",
    countries: "/country-details/",
    getState: "/state-details/",
    getCities: "/city-details/",
    merchantFlow: "/merchant/flow/",
    addDomain: '/merchant/add-domain/',
    getApps: "/merchant/get-domains-details/",
    editSingleOutlet: "/merchant/edit-outlet/",
    campaignData: "/merchant/timeline/",
    outletStatus: "/merchant/outlet_timeline/",
    saveOffersInfiniti: "/api/v1/offers/",
    makeVerify: '/offers/is_active_is_verified/',
    setActiveTemplate: "/customization/merchant/set_default_template/",
    totalReachReports: "/api/v1/total_reach/",
    TotalClicksReports: "/api/v1/my_total_clicks/",
    PartnerClicksReports: "/api/v1/my_partner_clicks/",
    OwnClicksReports: "/api/v1/my_own_clicks/",
    TotalRedemptionsReports: "/api/v1/incentives_redeem_total/",
    PartnerRedemptionsReports: "/api/v1/incentives_redeem_partner/",
    OwnRedemptionsReports: "/api/v1/incentives_redeem_own/",
    TotalRevenue: "/api/v1/my_total_revenue/",
    IncentiveViewPartners: "/api/v1/incentives_viewed_partners/",
    IncentiveViewTotal: "/api/v1/incentives_viewed_total/",
    IncentiveViewOwn: "/api/v1/incentives_viewed_own/",
    AcquisitionReports: "/api/v1/acq_detailed/",
    RetentionReports: "/api/v1/ret_detailed/",
    OffersIssuedToPartner: "/api/v1/detailed_partner_report/",
    OffersIssuedToOwn: "/api/v1/detailed_own_report/",
    checkValid: "/merchant/check_validation/",
    getAllApps: "/merchant/all_apps/",
    getTotalCount: "/api/v1/total_total_count/",
    getPartnerCount: "/api/v1/partner_total_count/",
    getOwnCount: "/api/v1/own_total_count/",
    installPlugin: "/merchant/plugin-download/",
    changeOutletStatus: "/merchant/outlet_change_status/",
    startCampagin: "/merchant/start_campaign/",
    logDetails: "/merchant/log_view/",
    logoutEntry: '/merchant/logout_log/',
    accDetails: '/merchant/profile_info/',
    planDetails: '/merchant/subscriptions/plan_subscriptions_data/',
    emailSend: '/merchant/generate_otp/',
    otpSend: '/merchant/verify_otp/',
    innerXirclsRequest: "/merchant/xircls/preferred-partner/",
    verifyUserEmail: "/merchant/verify-your-email/",
    blockInnerXircls: "/merchant/xircls/block_request/",
    resetPasswordMail: "/api/v1/send_forgot_password/",
    password_reset_confirm: "/api/v1/password_reset/",
    confirm_repassword: "/api/v1/password_reset_confirm/",
    contactUs: "/merchant/api/contact_us/",
    getAllPlans: "/subscriptions/api/v1/get_bill_card/",
    createPayment: "/merchant/subscriptions/create_payment/",
    reportFeed1: "/api/v1/newsfeed1/",
    addFreePlan: "/subscriptions/api/v1/add_free_plan/",
    freePlan: "/subscriptions/api/v1/get_free_infinity_card/",
    getFilterOffer: "/api/v1/outlet_offers_get/",
    createSupportTicket: "/support-system/create-support-ticket/",
    editSupportTicket: "/support-system/ticket-records/",
    supperLeadzBilling: "/auth_merchant/api/v1/get_transactions/",
    thankYouSetting: "/merchant/activate/thankyou_page/",
    // contactMerchant: "merchant/api/contact_us_merchant/",
    //SuperLeadz
    planSubscription: "/merchant/subscriptions/plan_subcription_shopify/",
    getUserData: "/support-system/merchant-basic-details/",
    addOffers: "/add_offer/",
    //referal
    referalPoints: "/referral/referralpoints/",
    affiliate_dashboard: "/affiliate/wallet_transaction/",
    add_customer_individual: "/customers/merchant/add_customer/",
    get_view_customer: "/customers/merchant/get_view_customer/",
    get_company_details: "/customers/merchant/get_company_details/",
    all_cust_dashboard: "/customers/merchant/all_cust_dashboard/",
    crm_all_cust_dashboard: "/customers/cust_all_dashboard/",
    add_company_details: "/customers/merchant/add_company_details/",
    get_customer_vehicle: '/vehicle/get_customer_vehicle/', //crm
    get_customer_insurance: '/insurance/get_customer_insurance/', //crm
    // Flash Account

    fetch_vehicle_details: "/vehicle/fetch_vehicle_details/",
    fetch_car_details: '/vehicle/fetch_car_details/',
    add_insurance: "/insurance/add_insurance/",
    add_customer: '/customers/merchant/add_customer/',
    add_vehicle: '/vehicle/add_vehicle/',
    crm_servicing_customers: '/servicing/get_add_servicing/',
    fetch_vehicle_number: '/vehicle/fetch_vehicle_number',
    add_finance: '/finance/add_finance/',
    get_customer_finance: '/finance/get_customer_finance/',
    get_customer_servicing: '/servicing/get_customer_servicing/',
    get_customer_insurance: '/insurance/get_customer_insurance/',
    add_finance: '/finance/add_finance/',
    crm_servicing_customers: '/servicing/get_add_servicing/',
    get_customer_details: '/customers/merchant/get_customer_details',
    fetch_vehicle_number: '/vehicle/fetch_vehicle_number',
    add_finance: '/finance/add_finance/',
    add_call: "/customers/merchant/Customer_Add_Calls/",
    finance_dashboard: 'finance/finance_dashboard/',
    servicing_dashboard: 'servicing/servicing_dashboard/',
    insurance_dashboard: 'insurance/insurance_dashboard/',
    get_vehicle: "/vehicle/cust_all_vehicle/",
    checkDeptName: "/member/check_department/",
    getPermissionList: "/member/apps_permission/",
    addDepartment: "/member/department_details/",
    saveUser: "/member/member_permission/",
    memebersDetails: "/member/members_details/",
    getAllCustomer: "/customers/get_customers/",
    getAllCustomerNew: "/customers/get_customer_options/",
    cross_leads: "/customers/cross_leads/",
    add_leads: '/customers/merchant/add_leads/',
    leads_get:'/customers/merchant/leads_get/',
    leads_stage_get:'/customers/merchant/leads_stage_get/',
    leads_stage_table:'/customers/merchant/leads_stage_table/',
    leadstable_get_view:'/customers/merchant/leadstable_get_view/',
    lead_stage_add:'/customers/merchant/leads_stage_add/',
    edit_automotivetransaction:'/vehicle/edit_automotivetransaction/',
    automotivetransaction:'/vehicle/automotivetransaction/',
    check_customer_details:'/vehicle/check_customer_details/',
    used_car_dashboard:'/vehicle/used_cust_all_vehicle/',
    campagin_view: "/talk/campaign_view_data/",
    // crm leads profile
    add_variant: `/vehicle/add_variant/`,

    // affiliate

    affiliate_person_all: "/affiliate/admin/affiliate_person_all/",
    affiliate_commission: "/affiliate/admin/admin_affiliate_commission_view/",
    signupAffiliate: '/affiliate/affiliate_signup/',
    loginAffiliate: '/affiliate/affiliate_login/',
    admin_withdrawn_transactions: "/affiliate/admin/admin_withdrawn_trans",
    admin_withdrawn_request: "/affiliate/admin/admin_withdrawn_req/",
    affiliate_active: "/affiliate/admin/affiliate_activate/",

    // whatsapp
    get_trigger_events: "talk/get_trigger_events/",
    whatsapp_dashboard_view: "talk/dashboard_view/",

    getTemplates: "talk/getTemplates/",
    getMailTemplates: "mail/getTemplates/",
    project_get: "talk/project_get/",
    getTemplateById: "talk/getTemplateById/",
    createTemplate: "talk/createTemplate/",
    sendMessage: "talk/sendMessage/",
    embeddedSignup: "talk/embeddedSignup/",
    import_customer: "talk/import_customer/",
    fbVerification: "talk/fbVerification/",
    projectCreation: "talk/projectCreation/",
    editTemplate: "talk/editTemplate/",
    Business_view: "talk/whatsapp/business_view/",
    add_group: "talk/add_group/",
    group_base_details: "talk/group_base_details/",
    group_contact: "talk/group_contact/",
    contact_details: "talk/contact_details/",
    group_delete: "talk/group_delete/",
    contact_delete: "talk/contact_delete/",
    bulk_message: "talk/bulk_message/",
    get_group_contact: "talk/get_group_contact/",
    inactiveTemplate: "talk/inactiveTemplate/",
    group_details: "talk/group_details/",
    get_catalog: "talk/get_catalog/",
    catalog_details: "talk/catalog_details/",
    send_catalog: "talk/send_catalog/",
    template_active: "talk/template_active/",
    template_view: "talk/template_view/",
    messagelog_view: "talk/messagelog_view/",
    integration: "integration-hub/integration_get_details/",
    integrationPlug: "integration-hub/integration_connect/",
    get_all_message: "talk/get_all_message/",
    saveWhatsappTem: "integration-hub/event_flow/",
    contact_relation : "talk/contact_relation/",
    send_live_chat : "/talk/send_live_message/",
    test: "merchant/update_field",
    active_refeeral_offer: "/referral/referralpoints/",
    referral_dashboard: "referral/dashboard/",
    group_import_customer: "/talk/group_import_customer/",
    mark_message_read: "/talk/mark_message_read/",
    get_project_profile: "/talk/get_project_profile/",
    update_profile: "/talk/update_profile/",
    quick_replay: "/talk/quick_replay/",
    campaign_details_list: "/talk/campaign_details_list/",
    customer_tags_notes: "/talk/customer_tags_notes/",
    tags: "/talk/tags/",
    chat_status: "/talk/chat_status/",
    opt_settings: "/talk/opt_settings/",
    contact_to_send_template: "/talk/contact_to_send_template/",
    import_bulk_data: "/insurance/api/v1/import_bulk_data/",
    // Email
    email_details: "/mail/contact_details/",
    import_email: "/mail/import_customer/",
    email_group_base_details: "/mail/group_base_details/",
    email_add_group: "/mail/add_group/",
    email_delete: "/mail/contact_delete/",
    email_group_delete: "/mail/group_delete/",
    email_group_contact: "/mail/group_contact/",
    email_group_details: "/mail/group_details/",
    add_contacts: "/mail/add_contact/",
    get_email_group_contact: "/mail/get_group_contact/",
    bulk_send_mail: "/mail/bulk_send_mail/",
    email_schedule_details: "/mail/email_schedule_details/",
    template_placeholder: "/mail/template_placeholder/",
    group_import_customerEmail: "/mail/group_import_customer/",
    template_details: "/mail/template_details/",
    email_tracking_detail: "/mail/email_tracking_detail/",
    email_template_details: "/mail/email_template_details/",
    email_dashboard_view: "/mail/email_dashboard_view/",
    email_check: "/mail/mail_check/",
    email_campaign_details: "/mail/email_campaign_details/",
    mail_info: "/mail/mail_info/",
    update_status: "/mail/update_status/",
    delete_mail: "/mail/delete_mail/",
    whatsapp_create_campaign: "/talk/create_campaign/",
    email_create_campaign: "/mail/create_campaign/",
    whatsapp_view_campaign: "/talk/view_campaign/",
    change_campaign_status: "/talk/change_campaign_status/",
    email_change_campaign_status: "/mail/change_campaign_status/",
    default_settings: "/api/v1/set_default_settings/",
    import_leads: "/customers/group_import_leads/",
    assign_lead: "customers/assign_lead/",
    form_view: "/qr/get_all_data/"
}

const axiosInstance = axios.create({
    baseURL
})

// const updateBaseURL = (newBaseURL) => {
//     axiosInstance.defaults.baseURL = newBaseURL
// }

let isRefreshing = false
let refreshTokenPromise = null

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getToken() ? JSON.parse(getToken()) : null
        const userPermission = await localStorage.getItem('userPermission') ? JSON.parse(localStorage.getItem('userPermission')) : null
        if (token && userPermission.apiKey) {
            const currentUser = await userPermission?.multipleDomain?.filter((cur) => cur?.api_key === userPermission?.apiKey)
            // console.log(config, "config")
            // console.log("going")
            const accessToken = token['access']
            // const refreshToken = token['refresh']
            // console.log(accessToken, "accessToken")
            // console.log(refreshToken, "refreshToken")
            // Check if access token is expired
            const decodedAccessToken = jwtDecode(accessToken)
            // console.log(decodedAccessToken)
            const currentTime = Math.floor(Date.now() / 1000)
            if (decodedAccessToken.exp < currentTime) {
                // Access token is expired, try to refresh it
                if (!isRefreshing) {
                    // isRefreshing = true
                    // refreshTokenPromise = axios.post(`${baseURL}${configUrl['refresh']}`, {
                    //     refresh: refreshToken
                    // })
                    removeToken()
                    // window.alert('session expired')
                    // window.location.replace('/merchant/login/')
                    toast.error("Session expired. Please login")
                    return <Navigate to={'/merchant/login/'} replace={true} />
                }
                const newAccessToken = await refreshTokenPromise
                isRefreshing = false
                refreshTokenPromise = null
                if (newAccessToken) {
                    config.headers['Authorization'] = `Bearer ${newAccessToken.data.access}`
                    config.headers['Api-Key'] = userPermission.apiKey
                    config.headers['Super-User'] = userPermission.super_user
                    config.headers['Multi-User-Key'] = userPermission.multi_user_key
                    config.headers['Outlet'] = currentUser[0]?.id
                    config.headers['User-Role'] = userPermission?.logged_in_user?.user_role
                    const newToken = JSON.stringify({ access: newAccessToken.data.access, refresh: token.refresh })
                    setToken(newToken)
                } else {
                    // Refresh token is also expired, remove token and redirect to login page
                    removeToken()
                    // window.alert('session expired')
                    // window.location.replace('/merchant/login/')
                    toast.error("Session expired. Please login")
                    return <Navigate to={'/merchant/login/'} replace={true} />
                }
            } else {
                config.headers['Authorization'] = `Bearer ${accessToken}`
                config.headers['Api-Key'] = userPermission.apiKey
                config.headers['Outlet'] = currentUser[0]?.id
                config.headers['Super-User'] = userPermission.super_user
                config.headers['Multi-User-Key'] = userPermission.multi_user_key
                config.headers['User-Role'] = userPermission?.logged_in_user?.user_role
            }
        }
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && Number(error.response.status) === 401) {
            removeToken()
            toast.error("Session expired. Please login")
            return <Navigate to={'/merchant/login/'} replace={true} />
        }
        return Promise.reject(error)
    }
)

export const postReq = (path, data, customBaseURL = baseURL, config, exportURL) => {
    console.log(customBaseURL, "domian")
    // if (customBaseURL) {
    axiosInstance.defaults.baseURL = customBaseURL
    // }

    // updateBaseURL(URLs[base])
    const time = new Date().getTime()
    if (path === 'login' || path === "signup") {
        return axios.post(`${baseURL}${configUrl[`${path}`]}?time=${time}`, data)
    } else if (path === "export") {
        return axiosInstance.post(`${exportURL}`, data)
    } else {
        return axiosInstance.post(`${configUrl[path]}?time=${time}`, data, config ? config : null)
    }
}

export const putReq = (path, data, customBaseURL = baseURL, config) => {
    // console.log(customBaseURL, "domian")
    // if (customBaseURL) {
    axiosInstance.defaults.baseURL = customBaseURL
    // }
    const time = new Date().getTime()
    if (path === 'login' || path === "signup") {
        return axios.put(`${baseURL}${configUrl[`${path}`]}?time=${time}`, data)
    } else {
        return axiosInstance.put(`${configUrl[path]}?time=${time}`, data, config ? config : null)
    }
}


export const getReq = (path, slug, customBaseURL = baseURL) => {
    // console.log(customBaseURL, "domian")
    axiosInstance.defaults.baseURL = customBaseURL
    const time = new Date().getTime()
    return slug ? axiosInstance.get(`${configUrl[path]}${slug}&time=${time}`) : axiosInstance.get(`${configUrl[path]}?time=${time}`)
}

export const deleteReq = (path, slug, customBaseURL = baseURL) => {
    // console.log(customBaseURL, "domian")
    axiosInstance.defaults.baseURL = customBaseURL
    return axiosInstance.delete(`${configUrl[path]}${slug}`)
}

// With out JWT

export const custPostReq = (path) => {
    return axios.post(`${SuperLeadzBaseURL}${configUrl[`${path}`]}`, data)
}

export const custGetReq = (path, slug) => {
    const time = new Date().getTime()
    return slug ? axios.get(`${SuperLeadzBaseURL}${configUrl[path]}${slug}&time=${time}`) : axios.get(`${SuperLeadzBaseURL}${configUrl[path]}?time=${time}`)
}

export const CustDeleteReq = (path, slug) => {
    return axios.delete(`${SuperLeadzBaseURL}${configUrl[path]}${slug}`)
}