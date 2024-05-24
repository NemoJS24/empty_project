import { Circle, Home, MessageSquare, Settings, Users } from "react-feather"
import { AiOutlineBars, AiOutlineHighlight, AiOutlineUser } from "react-icons/ai"
import { DefaultNav } from "./DefualtNav"

export const WhatsappNavigation = [
    ...DefaultNav,
    {
        header: 'Whatsapp'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: <Home size={20} />,
        navLink: '/merchant/whatsapp/'
    },
    {
        id: 'Contacts',
        title: 'Contacts',
        icon: <AiOutlineUser size={16} />,
        navLink: '/merchant/whatsapp/whatsapp_contact/'
    },
    {
        id: 'Groups',
        title: 'Groups',
        icon: <Users size={16} />,
        navLink: '/merchant/whatsapp/groups/'
    },
    {
        id: 'Templates',
        title: 'Templates',
        icon: <AiOutlineHighlight size={16} />,
        navLink: '/merchant/whatsapp/message/'
    },
    {
        id: 'campaigns',
        title: 'Campaigns',
        icon: <AiOutlineBars size={16} />,
        navLink: '/merchant/whatsapp/campaigns'
    },
    {
        id: 'LiveChat',
        title: 'Chats',
        icon: <MessageSquare size={16} />,
        navLink: '/merchant/whatsapp/LiveChat'
    },
    // {
    //     id: 'Catalogue',
    //     title: 'Catalogue',
    //     icon: <Circle size={16} />,
    //     navLink: '/merchant/whatsapp/Catalogue/'
    // },
    // {
    //     id: 'businessCreation',
    //     title: 'Business Creation',
    //     icon: <Circle size={16} />,
    //     navLink: '/merchant/whatsapp/business_creation/'
    // },
    // {
    //     id: 'optin',
    //     title: 'Manage Opt-in',
    //     icon: <Circle size={16} />,
    //     navLink: '/merchant/whatsapp/optinManage/'
    // }
    {
        id: 'setting',
        title: 'Settings',
        icon: <Settings size={16} />,
        // icon: <img style={{ marginRight: '18px' }} src={`${ownUrl}/images/website-slide/navbar/crm.png`} width='16px' />,
        children: [
            {
                id: 'profile',
                title: 'Project',
                icon: <Circle size={16} />,
                navLink: '/merchant/whatsapp/project-profile/'
            },
            {
                id: 'quickReply',
                title: 'Quick Reply',
                icon: <Circle size={16} />,
                navLink: '/merchant/whatsapp/quick-reply/'
            },
            {
                id: 'project',
                title: 'Project Details',
                icon: <Circle size={16} />,
                navLink: '/merchant/whatsapp/is_business/'
            },
            {
                id: 'embedSignUp',
                title: 'Embedded Signup',
                icon: <Circle size={16} />,
                navLink: '/merchant/whatsapp/EmbeddedSignup/'
            }
        ]
      }
]