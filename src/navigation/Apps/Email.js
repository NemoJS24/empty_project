import { Home, Settings, Users } from "react-feather"
import { AiOutlineBars, AiOutlineHighlight } from "react-icons/ai"
import { ownUrl } from "../../views/Validator"
import { DefaultNav } from "./DefualtNav"
export const EmailNavigation = [
    ...DefaultNav,
    {
        header: 'email'
    },
    //     {
    //       id: 'builder',
    //       title: 'Builder',
    //       icon: <img style={{marginRight: '18px'}} src={`${ownUrl}/images/website-slide/navbar/customer_group.png`} width='16px' />,
    //       navLink: '/merchant/Email/builder'
    //   },
    {
        id: 'e,dashboard',
        title: 'Dashboard',
        icon: <Home/>,
        navLink: '/merchant/email/'
    },
    {
        id: 'send',
        title: 'Templates',
        icon: <AiOutlineHighlight />,
        navLink: '/merchant/Email/templates'
    },
    {
        id: 'campaign',
        title: 'Campaign',
        icon: <AiOutlineBars />,
        navLink: '/merchant/Email/campaign'
    },
    {
        id: 'Email',
        title: 'Contacts',
        icon: <img style={{ marginRight: '18px' }} src={`${ownUrl}/images/website-slide/navbar/customer_group.png`} width='16px' />,
        navLink: '/merchant/Email/import'
    },
    {
        id: 'group',
        title: 'Groups',
        icon: <Users />,
        navLink: '/merchant/Email/group'
    },
    {
        id: 'SMsetting',
        title: 'SMTP Settings',
        icon: <Settings />,
        navLink: '/merchant/Email/settings'
    }
    // {
    //     id: 'billing',
    //     title: 'Billing',
    //     icon: <BiDollar size={16} />,
    //     navLink: '/merchant/SuperLeadz/billing/'
    //   },
    //   {
    //     id: 'faq',
    //     title: 'FAQs',
    //     icon: <AiOutlineQuestion size={16} />,
    //     navLink: '/merchant/SuperLeadz/faq/'
    //   },
    //   {
    //     id: 'support',
    //     title: 'Support',
    //     icon: <AiFillPhone size={16} />,
    //     navLink: '/merchant/support/'
    //   }
]