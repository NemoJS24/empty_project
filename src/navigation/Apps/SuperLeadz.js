import { Circle, Home, Settings } from "react-feather"
// import { ownUrl } from "../../views/Validator"
import { AiFillPhone, AiOutlineBars, AiOutlineClockCircle, AiOutlineHighlight, AiOutlineLineChart, AiOutlinePercentage, AiOutlineQuestion, AiOutlineSmile, AiOutlineStar, AiOutlineUser } from "react-icons/ai"
import { BiDollar } from "react-icons/bi"
import { DefaultNav } from "./DefualtNav"

export const SuperLeadzNavigation = [
  ...DefaultNav,
  {
    header: 'SuperLeadz'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <Home size={20} />,
    navLink: '/merchant/SuperLeadz/'
  },
  {
    id: 'leads',
    title: 'Leads',
    icon: <AiOutlineUser size={16} />,
    navLink: '/merchant/SuperLeadz/leads/'
  },
  {
    id: 'live',
    title: 'Activity',
    icon: <AiOutlineClockCircle size={16} />,
    navLink: '/merchant/SuperLeadz/live/'
  },
  // {
  //   id: 'reports',
  //   title: 'Reports',
  //   icon: <img style={{ marginRight: '18px' }} src={`${ownUrl}/images/website-slide/navbar/reports.png`} width='16px' />,
  //   children: [
  {
    id: 'Reports-Campaign',
    title: 'Reports-Campaign',
    icon: <Circle size={16} />,
    navLink: '/merchant/SuperLeadz/reports/campaign/'
  },
  {
    id: 'Reports-Offer',
    title: 'Reports-Offers',
    icon: <Circle size={16} />,
    navLink: '/merchant/SuperLeadz/reports/offers/'
    //   }
    // ]
  },
  // {
  //   id: 'performance',
  //   title: 'Performance',
  //   icon: <AiOutlineLineChart size={16} />,
  //   navLink: '/merchant/SuperLeadz/performance/'
  // },
  {
    id: 'offers',
    title: 'Offers',
    icon: <AiOutlinePercentage size={16} />,
    navLink: '/merchant/SuperLeadz/offers/'
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: <AiOutlineHighlight size={16} />,
    navLink: '/merchant/superleadz/templates/'
  },
  {
    id: 'campaign',
    title: 'Campaigns',
    icon: <AiOutlineBars size={16} />,
    navLink: '/merchant/SuperLeadz/all_campaigns/'
  },
  {
    id: 'billing',
    title: 'Billing',
    icon: <BiDollar size={16} />,
    navLink: '/merchant/SuperLeadz/billing/'
  },
  {
    id: 'integrations',
    title: 'Integration',
    icon: <Circle size={16} />,
    navLink: '/merchant/integration/'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <Settings size={16} />,
    navLink: '/merchant/SuperLeadz/settings/'
  }
  // {
  //   id: 'integrations',
  //   title: 'Integrations',
  //   icon: <Circle size={16} />,
  //   navLink: '/merchant/integration/'
  // },
  // {
  //   id: 'support',
  //   title: 'Support',
  //   icon: <img style={{ marginRight: "1.1rem" }} src={twentyfourseven} width={16} />,
  //   navLink: '/merchant/support/'
  // }
]