import { Circle } from "react-feather"
import { DefaultNav } from "./DefualtNav"

export const WhatsappNavigation = [
    ...DefaultNav,
    {
        header: 'Whatsapp'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: <Circle size={16} />,
        navLink: '/merchant/whatsapp/'
    },
    {
        id: 'message',
        title: 'Templates',
        icon: <Circle size={16} />,
        navLink: '/merchant/whatsapp/message/'
    },
    
    // {
    //     id: 'createTemplate',
    //     title: 'Create Template',
    //     icon: <Circle size={16} />,
    //     navLink: '/merchant/whatsapp/is_template/'
    // },
    {
        id: 'Contacts',
        title: 'Contacts',
        icon: <Circle size={16} />,
        navLink: '/merchant/whatsapp/whatsapp_contact/'
    },
    {
        id: 'Groups',
        title: 'Groups',
        icon: <Circle size={16} />,
        navLink: '/merchant/whatsapp/groups/'
    },
    {
        id: 'Catalogue',
        title: 'Catalogue',
        icon: <Circle size={16} />,
        navLink: '/merchant/whatsapp/Catalogue/'
    },
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
        icon: <Circle size={16} />,
        // icon: <img style={{ marginRight: '18px' }} src={`${ownUrl}/images/website-slide/navbar/crm.png`} width='16px' />,
        children: [
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