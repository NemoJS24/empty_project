// import { Circle, Home, Percent } from "react-feather"
// import { ownUrl } from "../../views/Validator"
// import { AiFillPhone, AiOutlineSmile } from "react-icons/ai"
import { GoShieldCheck, GoTools } from "react-icons/go"
import { DefaultNav } from "./DefualtNav"
import { PiMoneyThin, PiShareNetworkThin, PiUsersThree } from "react-icons/pi"
// import { LiaHandshake } from "react-icons/lia"
import { IoPricetagOutline } from "react-icons/io5"
import { RiCarLine } from "react-icons/ri"
import { ownUrl } from "../../views/Validator"

export const CRMNavigation = [
    ...DefaultNav,
    {
        header: 'CRM'
    },
    {
        id: 'leads',
        title: 'Leads',
        icon: <PiUsersThree style={{ marginRight: '18px' }} />,
        navLink: '/merchant/customers/leads/'
    },
    {
        id: 'cross_leads',
        title: 'Cross Leads',
        icon: <PiShareNetworkThin style={{ marginRight: '18px' }} />,
        navLink: '/merchant/customers/cross_leads'
    },
    {
        id: 'customers',
        title: 'Customers',
        icon: <img style={{ marginRight: '18px' }} src={`${ownUrl}/images/website-slide/navbar/customers.png`} width='16px' />,
        navLink: '/merchant/customers/'
    },
    {
        id: 'finance',
        title: 'Finance',
        icon: <PiMoneyThin style={{ marginRight: '18px' }} />,
        navLink: '/merchant/customer/all_cust_dashboard/add_finance/'
    },
    {
        id: 'servicing',
        title: 'Servicing',
        icon: <GoTools style={{ marginRight: '18px' }} />,
        navLink: '/merchant/customer/all_cust_dashboard/add_servicing/'
    },
    {
        id: 'insurance',
        title: 'Insurance',
        icon: <GoShieldCheck style={{ marginRight: '18px' }} />,
        navLink: '/merchant/customers/insurance'
    },
    {
        id: 'vehicle',
        title: 'Vehicle',
        icon: <RiCarLine style={{ marginRight: '18px' }} />,
        navLink: '/merchant/customers/vehicle/'
    },
    {
        id: 'usedcar',
        title: 'Used Car',
        icon: <IoPricetagOutline style={{ marginRight: '18px' }} />,
        navLink: '/merchant/customers/usedcar/'
    }
    // {
    //     id: 'buyer-seller',
    //     title: 'Buyer & Seller',
    //     icon: <LiaHandshake style={{ marginRight: '18px' }} />,
    //     navLink: '/merchant/customers/buyerseller/'
    // }
]