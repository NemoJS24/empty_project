// import { Circle, Home, Percent } from "react-feather"
import { ownUrl } from "../../views/Validator"
// import { AiFillPhone, AiOutlineSmile } from "react-icons/ai"
import { DefaultNav } from "./DefualtNav"

export const CRMNavigation = [
    ...DefaultNav,
    {
        header: 'CRM'
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
        icon: <img style={{ marginRight: '18px' }} src={`${ownUrl}/images/website-slide/navbar/customer_group.png`} width='16px' />,
        navLink: '/merchant/customer/all_cust_dashboard/add_finance/'
    },
    {
        id: 'servicing',
        title: 'Servicing',
        icon: <img style={{ marginRight: '18px' }} src={`${ownUrl}/images/website-slide/navbar/customer_group.png`} width='16px' />,
        navLink: '/merchant/customer/all_cust_dashboard/add_servicing/'
    },
    {
        id: 'insurance',
        title: 'Insurance',
        icon: <img style={{ marginRight: '18px' }} src={`${ownUrl}/images/website-slide/navbar/customer_group.png`} width='16px' />,
        navLink: '/merchant/customers/insurance'
    }

]