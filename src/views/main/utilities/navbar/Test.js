import { useEffect, useState } from 'react'

import { AiOutlineMenu } from "react-icons/ai"

import { BsCodeSquare, BsReverseLayoutTextSidebarReverse } from "react-icons/bs"

import { PiCodeBlockLight } from "react-icons/pi"

import { TfiTarget } from "react-icons/tfi"

import { TiFlashOutline } from "react-icons/ti"

import { VscTarget } from "react-icons/vsc"

import { Link, useLocation, useNavigate } from 'react-router-dom'

import "../../mainCustome.scss"

import logo from "../logo.png"

import "./navbar.scss"

import SuperLeadzLogo from "@src/assets/images/website-slide/FrontBase/user.png"

import infiniti from "@src/assets/images/website-slide/FrontBase/infinity.png"

import gift from "@src/assets/images/website-slide/FrontBase/gift.png"

import workgroup from "@src/assets/images/website-slide/FrontBase/workgroup.png"

import { getToken } from '../../../../assets/auth/auth'
import { IoIosArrowDown } from 'react-icons/io'

export const productList = [

    {

        title: "Infiniti",

        desc: "Customer Acquisition & Loyalty",

        logo: <img src={infiniti} alt='infiniti_logo' />,

        link: "/products/infiniti/"

    },

    {

        title: "Semper fi",

        desc: "Customer Loyalty",

        logo: <img src={gift} alt='gift_logo' />,

        link: "/products/semperfi/"

    },

    {

        title: "Sniper",

        desc: "Customer Acquisition",

        logo: <TfiTarget size={20} color='' className='text-dark' />,

        link: "/products/sniper/"

    },

    {

        title: "SuperLeadz",

        desc: "Lead Generation Pop-ups ",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    },

    {

        title: "Flash Accounts",

        logo: <VscTarget size={25} color='' className='text-dark' />,

        link: "/products/flash-accounts/"

    }

]


const collabList = [

    {

        title: "Infiniti",

        desc: "Customer Acquisition & Loyalty",

        logo: <img src={infiniti} alt='infiniti_logo' />,

        link: "/products/infiniti/"

    },

    {

        title: "Semper fi",

        desc: "Customer Loyalty",

        logo: <img src={gift} alt='gift_logo' />,

        link: "/products/semperfi/"

    },

    {

        title: "Sniper",

        desc: "Customer Acquisition",

        logo: <TfiTarget size={20} color='' className='text-dark' />,

        link: "/products/sniper/"

    },

    {

        title: "What is Collaborative Marketing?",

        // desc: "Customer Acquisition",

        logo: <TfiTarget size={20} color='' className='text-dark' />,

        link: "/what-is-collaborative-marketing/"

    },

    {

        title: "Why Collaborative Marketing?",

        // desc: "Customer Acquisition",

        logo: <TfiTarget size={20} color='' className='text-dark' />,

        link: "/about-us/why-collaborative-marketing/"

    }

]


export const martechList = [

    // {

    // title: "360° Martech",

    // isHeader: true,

    // desc: "",

    // logo: '',

    // link: ""

    // },

    {

        title: "SuperLeadz",

        desc: "Lead Generation Pop-ups ",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    },

    {

        title: "Flash Accounts",

        // desc: "Democratizing Martech for Sustainable Growth.",

        logo: <VscTarget size={25} color='rgb(156, 220, 254)' className='text-dark' />,

        link: "/products/flash-accounts/"

    },

    { //MISSING

        title: "Reviews",

        // desc: "Because Life is Collaboration, Not Competition.",

        logo: <img src={workgroup} alt='why_collaborative_marketing_logo' />,

        link: "/merchant/product-review"


    },

    { //MISSING

        title: "Why 360° Martech?",

        // desc: "To Empower Businesses, Globally",

        logo: <TiFlashOutline size={23} color='' className='text-dark' />,

        link: "/about-us/vision-&-mission-statement/"


    }

]


export const whatsappPurposeList = [

    {

        title: "WhatsApp By XIRCLS",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    },

    {

        title: "Purpose",

        isHeader: true,

        desc: "",

        logo: '',

        link: ""

    },

    {

        title: "Marketing & Lead Gen",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    },

    {

        title: "Sales Enablement",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    },

    {

        title: "Commerce",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    },

    {

        title: "Support",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    },

    {

        title: "Retention & Loyalty",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    }

]

// title: "Live Chat Support",

// // desc: "Democratizing Martech for Sustainable Growth.",

// logo: <VscTarget size={25} color='' className='text-dark' />,

// link: "/about-us/why-XIRCLS"

// },

// {

// title: "WhatsApp Journeys",

// // desc: "Democratizing Martech for Sustainable Growth.",

// logo: <VscTarget size={25} color='' className='text-dark' />,

// link: "/about-us/why-XIRCLS"

// }

// // {

// // title: "Automations",

// // // desc: "Democratizing Martech for Sustainable Growth.",

// // logo: <VscTarget size={25} color='' className='text-dark' />,

// // link: "/about-us/why-XIRCLS"

// // },

// // {

// // title: "Templates",

// // // desc: "Democratizing Martech for Sustainable Growth.",

// // logo: <VscTarget size={25} color='' className='text-dark' />,

// // link: "/about-us/why-XIRCLS"

// // },

// // {

// // title: "WhatsApp Payments",

// // // desc: "Democratizing Martech for Sustainable Growth.",

// // logo: <VscTarget size={25} color='' className='text-dark' />,

// // link: "/about-us/why-XIRCLS"

// // }

// ]


// export const whatsappList 3 D [

// {

// title:"WhatsApp By XIRCLS",

// isHeader: true,

// desc: "",

// logo: "",

// link: ""

// },

// {

// title: "Purpose",

// isHeader: true,

// desc: "",

// logo: '',

// link: ""

// },

// {

// title: "Marketing & Lead Gen",

// logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

// link: "/products/superleadz/"

// },

// {

// title: "Sales Enablement",

// logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

// link: "/products/superleadz/"

// },

// {

// title: "Commerce",

// logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

// link: "/products/superleadz/"

// },

// {

// title: "Support",

// logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

// link: "/products/superleadz/"

// },

// {

// title: "Retention & Loyalty",

// logo: <img src={Super LeadzLogo} alt='SuperLeadz_logo' />,

// link: "/products/superleadz/"

// },

// {

// title: "Solutions",

// isHeader: true,

// // desc: "Because Life is Collaboration, Not Competition.",

// logo: <img src={workgroup} alt='why_collaborative_marketing_logo' />,

// link: "/about-us/why-collaborative-marketing/"

// },

// {

// title: "Broadcasts ",

// // desc: "Democratizing Martech for Sustainable Growth.",

// logo: <VscTarget size={25} color='' className='text-dark' />,

// link: "/about-us/why-XIRCLS"

// },

// {

// title: "Chatbots",

// // desc: "Democratizing Martech for Sustainable Growth.",

// logo: <VscTarget size={25} color='' className='text-dark' />,

// link: "/about-us/why-XIRCLS"

// },

// {

// title: "Live Chat Support",

// // desc: "Democratizing Martech for Sustainable Growth.",

// logo: <VscTarget size={25} color='' className='text-dark' />,

// link: "/about-us/why-XIRCLS"

// },

// {

// title: "WhatsApp Journeys",

// // desc: "Democratizing Martech for Sustainable Growth.",

// logo: <VscTarget size={25} color='' className='text-dark' />,

// link: "/about-us/why-XIRCLS"

// }

// ]


// export const solutionsList = [

// {

// title: "Industry",

// isHeader: true,

// // desc: "Lead Generation Pop-ups ",

// // logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

// link: "/products/superleadz/"

// },

// {

// title: " Auto Industry",

// // desc: "Lead Generation Pop-ups ",

// logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

// link: "/products/superleadz/"

// },

// {

// title: "e-Commerce",

// // desc: "Lead Generation Pop-ups ",

// logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

// link: "/products/superleadz/"

// }

// ]


export const aboutList = [

    {

        title: "Why XIRCLS?",

        desc: "Lead Generation Pop-ups ",

        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/about-us/why-XIRCLS"

    },

    {

        title: "Why Collaborative Marketing",

        // desc: "Democratizing Martech for Sustainable Growth.",

        logo: <VscTarget size={25} color='' className='text-dark' />,

        link: "/about-us/why-collaborative-marketing"

    },

    {

        title: "Vision & Mission",

        // desc: "Because Life is Collaboration, Not Competition.",

        logo: <img src={workgroup} alt='why_collaborative_marketing_logo' />,

        link: "/about-us/vission-&-mission-statement/"

    }

    // {

    // title: "Why 360° Martech?",

    // // desc: "To Empower Businesses, Globally",

    // logo: <TiFlashOutline size={23} color='' className='text-dark' />,

    // link: "/about-us/vision-&-mission-statement/"

    // }

]


export const blogList = [

    {

        title: "Collaborative Marketing",

        desc: "Lead Generation Pop-ups ",
        logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

        link: "/products/superleadz/"

    },

    {

        title: "360° Martech ",

        // desc: "Democratizing Martech for Sustainable Growth.",

        logo: <VscTarget size={25} color='' className='text-dark' />,

        link: "/about-us/why-XIRCLS"

    },

    {

        title: "WhatsApp",

        // desc: "Because Life is Collaboration, Not Competition.",

        logo: <img src={workgroup} alt='why_collaborative_marketing _logo' />,

        link: "/about-us/why-collaborative-marketing/"


    },

    {

        title: "Merchant Stories",

        // desc: "To Empower Businesses, Globally",

        logo: <TiFlashOutline size={23} color='' className='text-dark' />,

        link: "/about-us/vision-&-mission-statement/"


    }


]

// export const companyList = [

// {

// title: "Vission and Mission",

// desc: "Lead Pop-ups ",

// logo: <img src={SuperLeadzLogo} alt='SuperLeadz_logo' />,

// link: "/about-us/vision-&-mission-statement/"

// },

// {

// title: "Why XIRCLS? ",

// // desc: "Democratizing Martech for Sustainable Growth.",

// logo: <VscTarget size={25} color='' className='text-dark' />,

// link: "/about-us/why-XIRCLS"

// },

// {

// title: "Why XIRCLS? ",

// // desc: "Democratizing Martech for Sustainable Growth.",

// logo: <VscTarget size={25} color='' className='text-dark' />,

// link: "/about-us/why-XIRCLS"

// }


// ]


const Navbar = ({ position, hideMenu }) => {

    const { pathname } = useLocation()

    const [ShowProducts, setShowProducts] = useState(false)

    const [ShowBlog, setShowBlog] = useState(false)

    const [ShowMartech, setShowMartech] = useState(false)

    const [ShowCollab, setShowCollab] = useState(true)

    const [ShowWhatsapp, setShowWhatsapp] = useState(false)

    const [toggleMenu, setToggleMenu] = useState(true)


    useEffect(() => {

        window.addEventListener('scroll', () => {

            const Yscroll = window.scrollY

            const first_navbar = document.getElementById("first_navbar")

            if (first_navbar) {

                if (Yscroll > 50) {

                    first_navbar.style.boxShadow = " 0 0px 8px rgba(0,0,0,0.16)"

                } else {

                    first_navbar.style.boxShadow = " none"
                }

            }

        })

    }, [])


    useEffect(() => {

        setToggleMenu(true)

    }, [pathname])

    const width = window.innerWidth

    const positionCal = () => {

        if (width > 1000) {

            return position

        }

        if (width < 1000) {

            return 'notFixed'

        }

    }

    const isFixed = positionCal()

    // console.log(isFixed)

    function mouseEnter(name) {

        if (width > 1000) {

            if (name === "martech") {

                setShowMartech(true)

            }

            if (name === "collab") {

                setShowCollab(true)

            }

            if (name === "whatsapp") {

                setShowWhatsapp(true)

            }

            if (name === "blog") {

                setShowBlog(true)

            }


        }

    }


    function mouseLeave(name) {

        if (width > 1000) {

            if (name === "martech") {

                setShowMartech(false)

            }

            if (name === "collab") {

                setShowCollab(false)

            }

            if (name === "whatsapp") {

                setShowWhatsapp(false)

            }

            if (name === "blog") {

                setShowBlog(false)

            }

        }

    }

    function mouseClick(name) {

        if (name === "martech") {

            setShowMartech(!ShowMartech)

            setShowBlog(false)

            setShowWhatsapp(false)

            setShowCollab(false)

        }

        if (name === "collab") {

            setShowCollab(!ShowCollab)

            setShowBlog(false)

            setShowMartech(false)

            setShowWhatsapp(false)

        }

        if (name === "blog") {

            setShowBlog(!ShowBlog)

            setShowMartech(false)

            setShowCollab(false)

            setShowWhatsapp(false)

        }

        if (name === "whatsapp") {

            setShowWhatsapp(!ShowWhatsapp)

            setShowBlog(false)

            setShowMartech(false)

            setShowCollab(false)

        }

    }


    const navigate = useNavigate()


    const checkLogin = async () => {

        const token = await getToken() ? JSON.parse(getToken()) : null

        if (token) {

            navigate("/merchant/apps/")

        } else {

            navigate("/merchant/login/")

        }

    }


    return (

        <div className={`Container-subNav border-bottom py-1 py-md-0 bg-white position-${isFixed === "notFixed" ? "relative" : "fixed"} `} id="first_navbar" style={{ zIndex: "999", marginTop: '-5px', paddingBottom: "11px" }}>

            <div className=' justify-content-center bg-white m-0 p-0'>

                <nav className={`homeNav `}>

                    <Link to="/">

                        <img src={logo} alt="logo" className='mx-2 nav_logo_img' />

                    </Link>


                    {/* {!hideMenu && ( */}

                    <div style={{ visibility: hideMenu ? "hidden" : "visible" }} className={`toggleMenu py-2 ${toggleMenu ? "toggleMenuUp" : "toggleMenuDown"}`} >

                        <ul className=' list-unstyled d-inline-flex gap-2 pt-1'>


                            <li className='productLi ItemsList' onClick={() => mouseClick("martech")} onMouseEnter={() => mouseEnter("martech")} onMouseLeave={() => mouseLeave("martech")}>

                                <h4 className='navTitle fs-4 text-dark' >360° Martech <IoIosArrowDown color="#9e9e9eff" className={ShowMartech ? "rotate-180" : ""} /></h4>

                                <div className={`subMenu ${ShowMartech ? "productSubMenuDown" : "productSubMenuUp"} p-1 ps-3 pt-0 border border-1 rounded-3 px-md-3`}>

                                    < span style={{color: "rgb(86, 156, 214)"}}>
                                        <ul className=' list-unstyled '>

                                            {

                                                martechList.map((ele, index) => (

                                                    <li key={index} className='mt-1 hoverItems' style={{ padding: "5px 5px" }} >

                                                        <Link to={ele.link}>

                                                            <div className=' d-flex align-items-center gap-2' style={{ marginBottom: "5px" }}>

                                                                <div className='nav-list-logo d-flex align-items-center justify-content-center rounded-circle' >

                                                                    {ele.logo}

                                                                </div>

                                                                <div className='d-flex flex-column justify-content-center accordion text-start w-100 '>

                                                                    <h4 className='subtitle text-capitalize text-black fw-bolder ' >{ele.title}</h4>

                                                                    <p className='subdesc text-dark fw-bold fs-6 ' > {ele.desc}</p>

                                                                </div>

                                                            </div>

                                                        </Link>

                                                    </li>

                                                ))

                                            }

                                        </ul>
                                    </span>

                                </div>

                            </li>

                            {/* <li className='productLi ItemsList' onClick={() => mouseClick("whatsapp")} onMouseEnter={() => mouseEnter("whatsapp")} onMouseLeave={() => mouseLeave("whatsapp")}>

<h4 className='navTitle fs-4 text-dark' >WhatsApp <IoIosArrowDown color="#9e9e9eff" className={< span style="color: rgb(79, 193, 255);">ShowWhatsapp ? "rotate-180" : ""} /></h4>

<div className={`subMenu ${ShowWhatsapp ? "productSubMenuDown" : "productSubMenuUp"} p-1 ps-3 pt-0 border border-1 rounded-3 px-md-3`}>

<ul className=' list-unstyled '>

{

whatsappPurposeList.map((ele , index) => (

<li key={index} className='mt-1 hoverItems' style={{ padding: "5px 5px" }} >

<Link to={ele.link}>

<div className=' d-flex align-items-center gap-2' style={{ marginBottom: "5px" }}>

<div className='nav-list-logo d-flex align-items-center justify-content-center rounded-circle' >

{ele.logo}

</div>

<div className='d-flex flex-column justify-content-center accordion text-start w-100 '>

<h4 className='sub title text-capitalize text-black fw-bolder ' >{ele.title}</h4>

<p className='subdesc text-dark fw-bold fs-6 ' > {ele.desc}</p>

</div>

</div>

</Link>

</li>

))

}

</ul>

</div>

</li> */}

                            <Link to='/blog' className='navTitle fs-4 text-dark text-center'> <li ><p>WhatsApp</p></li></Link>


                            <li className='productLi Item sList' onClick={() => mouseClick("collab")} onMouseEnter={() => mouseEnter("collab")} onMouseLeave={() => mouseLeave("collab")}>

                                <h4 className='navTitle fs-4 text-dark' >Collaborative Marketing <IoIosArrowDown color="#9e9e9eff" className={ShowCollab ? "rotate-180" : ""} /></h4>

                                <div className={`subMenu ${ShowCollab ? "productSubMenuDown" : "productSubMenuUp"} p-1 ps-3 pt-0 border border-1 rounded-3 px-md-3`}>

                                    <ul className=' list-unstyled '>

                                        {

                                            collabList.map((ele, index) => (

                                                <li key={index} className='mt-1 hoverItems' style={{ padding: "5px 5px" }} >

                                                    <Link to={ele.link}>

                                                        <div className=' d-flex align-items-center gap-2' style={{ marginBottom: "5px" }}>

                                                            <div className='nav-list-logo d-flex align-items-center justify-content-center rounded-circle' >

                                                                {ele.logo}

                                                            </div>

                                                            <div className='d-flex flex-column justify-content-center accordion text-start w-100 '>

                                                                <h4 className='subtitle text-capitalize text-black fw-bolder ' >{ele.title}</h4>

                                                                <p className='subdesc text-dark fw-bold fs-6 ' > {ele.desc}</p>

                                                            </div>

                                                        </div>

                                                    </Link>

                                                </li>

                                            ))

                                        }

                                    </ul>

                                </div>

                            </li>

                            {/* <li className='aboutLi ItemsList' onClick={() => mouseClick("blog")} onMouseEnter={() => mouseEnter("blog")} onMouseLeave={() => mouseLeave("blog")}>

<p className='navTitle text-dark fs-4 '>Blog <IoIosArrowDown color="#9e9e9eff" className={ShowBlog ? "rotate-180" : ""} /></p>

<div className={`subMenu ${ShowBlog ? "aboutSubMenuDown" : "aboutSubMenuUp"} p-1 ps-3 pt-0 border border-1 rounded-3 px-md-3`}>

<ul className=' list-unstyled'>

{

blogList.map((ele, index) => (

<li key={index} className='mt-1 hoverItems' style={{ padding: "5px 5px" }} >

{ele.isHeader ? (

<p className='fw-bolder text-capitalize'>{ele.title}</p>

) : (

<Link to={ele.link} >

<div className='d-flex align-items-center gap-2'>

<div className='nav-list-logo d-flex align-items-center justify-content-center rounded-circle'>

{ele.logo}

</div>

<div className='d-flex flex-column justify-content-center accordion text-start w-100'>

<h4 className='subtitle text-capitalize text-black fw-bolder'>{ele.title}</h4>

<p cla ssName='subdesc text-dark fw-bold fs-6'>{ele.desc}</p>

</div>

</div>

</Link>

)}

</li>

))

}

</ul>

</div>

</li> */}

                            <Link to='/blog' className='navTitle fs-4 text-dark text-center'> <li ><p>Blog</p></li></Link>


                        </ul>

                        <div className='navBtn gap-1'>

                            <Link to='/merchant/signup' className=' btn btn-lg main-btn-blue-gra fs-3 fw-lig cust-font'>Signup Free</Link>


                            <a onClick={() => checkLogin()} className=' btn btn-lg main-btn-dark fs-3 fw-lig cust-font'>Login</a>

                        </div>
                    </div>
                    < div>

                        <div style={{ visibility: hideMenu ? "hidden" : "visible" }} className='menuBtn' onClick={() => { setToggleMenu(!toggleMenu); setShowProducts(false); setShowCompany(false) }}>

                            <AiOutlineMenu size={25} />

                        </div>

                        {/* )} */}

                    </div>
                </nav>
            </div>
        </div>

    )

}


export default Navbar