import { Circle, Home } from "react-feather"
import { ownUrl } from "../../views/Validator"
import twentyfourseven from "@src/views/SuperLeadz/assets/2020773.png"
import { AiOutlineQuestion } from "react-icons/ai"

export const DefaultNav = [
    {
        id: 'home',
        title: 'Home',
        icon: <Home size={20} />,
        navLink: '/merchant/home/'
    },
    {
        id: 'app',
        title: 'Apps',
        icon: <img style={{marginRight: '18px'}} src={`${ownUrl}/images/website-slide/navbar/customer_group.png`} width='16px' />,
        navLink: '/merchant/apps/'
    }
]

export const FooterNav = []
    // {
    //     id: 'integrations',
    //     title: 'Integration',
    //     icon: <Circle size={16} />,
    //     navLink: '/merchant/integration/'
    // },
// ]

export const mainFooterNav = [
    {
        id: 'faq',
        title: 'FAQs',
        icon: <AiOutlineQuestion size={16} />,
        navLink: '/merchant/SuperLeadz/faq/'
    },
    {
        id: 'support',
        title: 'Support',
        icon: <img style={{ marginRight: "1.1rem" }} src={twentyfourseven} width={16} />,
        navLink: '/merchant/support/'
    }
]