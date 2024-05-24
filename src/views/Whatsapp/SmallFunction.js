import { CornerDownLeft, ExternalLink, FileText, Phone } from "react-feather"
import { CardBody } from "reactstrap"
import wp_back from './imgs/wp_back.png'
import moment from "moment"
import { BsBroadcast, BsReply } from 'react-icons/bs'
import { GoDotFill } from "react-icons/go"
import { FaEllipsisV, FaSearch, FaInstagram } from "react-icons/fa"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { IoMdSearch, IoMdSend } from "react-icons/io"
import { LiaCheckDoubleSolid } from "react-icons/lia"
import { LuEye } from "react-icons/lu"
import { MdOutlineLibraryAdd, MdOutlineQuickreply, MdOutlineHistory, MdHistory} from "react-icons/md"
import { RiCustomerService2Line } from "react-icons/ri"
import { RxCross2 } from "react-icons/rx"
import { IoWarningOutline } from "react-icons/io5"

// whatsapp data
export const HeaderTypeList = [
  {
    value: "Text",
    label: "Text"
  },
  {
    value: "Image",
    label: "Image"
  },
  {
    value: "Document",
    label: "Document"
  },
  {
    value: "Video",
    label: "Video"
  }
]

export const paramatersList = [
  { value: 'FirstName', label: "FirstName" },
  { value: 'LastName', label: "LastName" },
  { value: 'customerName', label: "customerName" },
  { value: 'CompanyName', label: "CompanyName" },
  { value: 'OrderID', label: "OrderID" },
  { value: 'ProductName', label: "ProductName" }
]

export const languageList = [
  {
    value: "en",
    label: "English"
  },
  {
    value: "es",
    label: "Spanish"
  },
  {
    value: "fr",
    label: "French"
  },
  {
    value: "de",
    label: "German"
  },
  {
    value: "it",
    label: "Italian"
  },
  {
    value: "pt",
    label: "Portuguese"
  },
  {
    value: "ru",
    label: "Russian"
  },
  {
    value: "zh",
    label: "Chinese"
  },
  {
    value: "ja",
    label: "Japanese"
  },
  {
    value: "ko",
    label: "Korean"
  },
  {
    value: "ar",
    label: "Arabic"
  },
  {
    value: "hi",
    label: "Hindi"
  },
  {
    value: "bn",
    label: "Bengali"
  },
  {
    value: "tr",
    label: "Turkish"
  },
  {
    value: "nl",
    label: "Dutch"
  },
  {
    value: "sv",
    label: "Swedish"
  },
  {
    value: "fi",
    label: "Finnish"
  },
  {
    value: "no",
    label: "Norwegian"
  },
  {
    value: "da",
    label: "Danish"
  },
  {
    value: "pl",
    label: "Polish"
  }
]

export const templateCatgList = [
  { value: 'UTILITY', label: 'Utility' },
  { value: 'MARKETING', label: 'Marketing' }
]

export const QuickReplayList = [
  {
    title: "🛍️ Big Winter Sale",
    description: "Enjoy huge discounts on winter clothing, boots, and accessories to keep you warm and stylish!"
  },
  {
    title: "🚚 Limited Time Offer: Free Shipping",
    description: "Shop now and get free shipping on all orders above $50. Don't miss out!"
  },
  {
    title: "📱 Tech Bonanza",
    description: "Upgrade your gadgets with our latest tech deals. Get smartphones, laptops, and more at unbeatable prices!"
  },
  {
    title: "🏠 Home Refresh Sale",
    description: "Revamp your living space with our home decor essentials. Find everything from rugs to wall art at discounted prices."
  },
  {
    title: "💪 Fitness Frenzy",
    description: "Start your fitness journey with our workout gear and equipment. Get ready to crush your goals!"
  }
]
export const LeftNavList = [
   {
     title: "Support",
     icons: <RiCustomerService2Line size={20} />,
     count:201,
     isActive:false,
     color: "high-green-bg"
   },
   {
      title: "Missed",
      icons: <IoWarningOutline size={20} />,
      count:24,
      isActive:false,
      color: "high-red-bg"
   },
   {
     title: "Broadcast",
     icons: <BsBroadcast size={20} />,
     count:0,
     isActive:false,
     color: ""
   },
   {
     title: "Instagram",
     icons:  <FaInstagram size={20} />,
     count:0,
     isActive:false,
     color: ""
   }
 ]
 export const chatsTagList = [
   {
     value: "Open",
     label:<div className="d-flex gap-1  align-items-center ">  <GoDotFill color="green" size={20} /> <h6 className="mb-0" >Ongoing</h6></div>
   },
   {
      value: "Pending",
      label:<div className="d-flex gap-1  align-items-center ">  <GoDotFill color="orange" size={20} /> <h6 className="mb-0" >Pending</h6></div>
    },
    {
      value: "Closed",
      label:<div className="d-flex gap-1  align-items-center ">  <GoDotFill color="red" size={20} /> <h6 className="mb-0" >Closed</h6></div>
    }
 ]

export const timeLiveFormatter = (time) => {
   if (!time) {
      return "--"
   }
   try {
      return moment(time).format("HH:mm")
      
   } catch (error) {
      return "--"
   }
}
export const timeDateLiveFormatter = (time) => {
   if (!time) {
      return "--"
   }

   try {
      const inputTime = moment(time)
      const currentTime = moment()
      const hoursDifference = currentTime.diff(inputTime, 'hours')

      if (hoursDifference < 24) {
         return inputTime.format("HH:mm")
      } else if (hoursDifference < 48) {
         return "yesterday"
      } else if (hoursDifference < 72) {
         return "day before yesterday"
      } else {
         return inputTime.format("YYYY-MM-DD")
      }
   } catch (error) {
      return "--"
   }
}

export const getRemainingTime = (endTime) => {
   const now = moment()
   if (endTime <= 0) {
      return {
         hour: '00',
         minutes: '00',
         status : 0
      }
   }
   console.log("endTime", endTime)
   const end = moment(endTime).add(24, 'hours') // Add 24 hours to the end time
   const diff = moment.duration(end.diff(now))

   if (diff.asMilliseconds() <= 0)  return {
      hour: '00',
         minutes: '00',
         status : 0
   }

   const hours = Math.floor(diff.asHours())
   const minutes = diff.minutes()

   let status
   if (diff.asHours() < 1) {
      status = 0
   } else if (diff.asHours() < 3) {
      status = 1
   } else {
      status = 2
   }

   return {
      hour: String(hours).padStart(2, '0') ?? 0,
      minutes: String(minutes).padStart(2, '0') ?? 0,
      status
   }
}
// export const liveTimeCounter = (inpTime) => {
//    if (!inpTime) {
//       return "--"
//    }

//    try {
//       const inputTime = moment(inpTime)
//       const currentTime = moment()
 
//    } catch (error) {
//       return "--"
//    }
// }
// functions
export const getBoldStr = (str) => {
   str = str.replace(/\*(.*?)\*/g, (_, p1) => `<strong>${p1}</strong>`)
   .replace(/\~(\b.*?)\b\~/g, (_, p1) => `<del>${p1}</del>`)
    .replace(/(?<=\s|^)(_.*?_)(?=\s|$)/g, (_, p1) => `<em>${p1.slice(1, -1)}</em>`)
    .replace(/\b((?:https?:\/\/|www\.)\S+)\b/g, '<a href="$1" target="_blank" style="color: #2f74bd; text-decoration:underline">$1</a>')
  return str
}


export const convertToEmoji = (codee) => {
   const codePoints = codee.trim().split(' ').map(cp => parseInt(cp, 16))
   const emoji = String.fromCodePoint(...codePoints)
   return emoji
 }
// testing
// depending function for RenderTemplateUI
   // all themes display ui message
export const updateDisplayedMessage = (inputString, defData) => {
    let updatedMessage = getBoldStr(inputString)
    if (defData.example) {
       const data = defData.example?.body_text[0]
       updatedMessage = updatedMessage.replace(/{{(\d+)}}/g, (_match, index) => {
          return `[${data[index - 1]}]`
       })
    }
    return updatedMessage
 }
export const updateHeaderDisplayedMessage = (inputString, defData) => {
    let updatedMessage = inputString
    if (defData.example) {
       const data = defData.example?.header_text[0]
       updatedMessage = updatedMessage.replace(/{{(\d+)}}/g, () => {
          return `[${data}]`
       })
    }
    return updatedMessage
 }
//  whatsapp template ui
export const RenderTemplateUI = ({SingleTemplate}) => {
  return (
     <CardBody className="border-0 p-2  pe-5 hideScroll rounded-2 " style={{ backgroundImage: `url(${wp_back})`, gap: "5px", whiteSpace: 'pre-wrap', height: "400px", overflowY: "auto", scrollbarWidth: "0" }}>

        <div className="border-1 rounded-2 mb-0 whatsapp_template_card" style={{ maxWidth: "400px" }} >
           <div className='p-0' >
              {

                 SingleTemplate.components.map((data) => {
                    if (data.format === "TEXT") {
                       return (
                          <div className='p-1 pb-0'  >
                             <h6 className='fs-4 text-black bolder mb-1' dangerouslySetInnerHTML={{ __html: updateHeaderDisplayedMessage(data.text, data) }}></h6>

                             {/* <h6 className='fs-4 text-black bolder mb-1 '>{data.text}</h6> */}
                          </div>
                       )
                    }
                    if (data.format === "IMAGE") {
                       return (
                          <div className='p-1'  >
                             <img className='rounded-3 img-fluid border-0 rounded w-100 object-fit-cover ' src={data?.example?.header_handle[0] ?? ""} alt="" />
                          </div>
                       )
                    }
                    if (data.format === "VIDEO") {
                       return (
                          <div className='p-1'  >
                             <video className='rounded-3  object-fit-cover w-100' controls autoPlay mute style={{ height: "170px" }}>
                                <source
                                   src={data.example?.header_handle[0] ?? ""}
                                   type="video/mp4"
                                />
                                Video not supported.
                             </video>
                          </div>
                       )
                    }
                    if (data.format === "DOCUMENT") {
                       return (
                          <div className='border-bottom  d-flex justify-content-center  align-items-center py-3' style={{ height: "50px" }}>
                             <FileText size={30} color='#000' />
                          </div>
                       )
                    }
                    if (data.type === "BODY") {
                       return (
                          <div className='p-1 pe-2' >
                             <p className='fs-6' dangerouslySetInnerHTML={{ __html: updateDisplayedMessage(data.text, data) }}></p>

                          </div>
                       )
                    }
                    if (data.type === "FOOTER") {
                       return (
                          <div className=' ps-1 pe-2 pt-0' >
                             <p className='text-secondary font-small-3 mt-0'>{data.text} </p>
                          </div>
                       )
                    }
                    if (data.type === "BUTTONS") {
                       return data.buttons.map((data) => {
                          if (data.type === "URL") {
                             return (
                                <a href={data?.url} target="_blank" className="border-top  d-flex text-primary justify-content-center  align-items-center text-decoration-none " style={{ padding: "10px", gap: "8px" }} >
                                   <ExternalLink size={17} /><h6 className='m-0 text-primary' >{data.text}</h6>
                                </a>
                             )
                          }
                          if (data.type === "PHONE_NUMBER") {
                             return (
                                <div className="border-top  d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                   <Phone size={17} /><h6 className='m-0 text-primary' >{data.text}</h6>
                                </div>
                             )
                          }
                          if (data.type === "QUICK_REPLY") {
                             return (
                                <div className="border-top  bg-white rounded-bottom-3   d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
                                   <CornerDownLeft size={17} /><h6 className='m-0 text-primary' > {data.text}</h6>
                                </div>
                             )
                          }
                       })
                    }
                 })
              }

           </div>
        </div>

     </CardBody>
  )
}
export const RenderLiveTemplateUI = ({SingleTemplate}) => {
  return (
     <CardBody className="border-0  rounded-2 " style={{ whiteSpace: 'pre-wrap'}}>

        <div className="border-1 rounded-2 mb-0 " style={{ width: "350px" }} >
           <div className='p-0' >
              {

                 SingleTemplate.components.map((data) => {
                    if (data.format === "TEXT") {
                       return (
                          <div className='p-1 pb-0'  >
                             <h6 className='fs-4 text-black bolder mb-1' dangerouslySetInnerHTML={{ __html: updateHeaderDisplayedMessage(data.text, data) }}></h6>

                             {/* <h6 className='fs-4 text-black bolder mb-1 '>{data.text}</h6> */}
                          </div>
                       )
                    }
                    if (data.format === "IMAGE") {
                       return (
                          <div className='p-1'  >
                             <img className='rounded-3 img-fluid border-0 rounded w-100 object-fit-cover ' src={data?.example?.header_handle[0] ?? ""} alt="" />
                          </div>
                       )
                    }
                    if (data.format === "VIDEO") {
                       return (
                          <div className='p-1'  >
                             <video className='rounded-3  object-fit-cover w-100' controls autoPlay mute style={{ height: "170px" }}>
                                <source
                                   src={data.example?.header_handle[0] ?? ""}
                                   type="video/mp4"
                                />
                                Video not supported.
                             </video>
                          </div>
                       )
                    }
                    if (data.format === "DOCUMENT") {
                       return (
                          <div className='border-bottom  d-flex justify-content-center  align-items-center py-3' style={{ height: "50px" }}>
                             <FileText size={30} color='#000' />
                          </div>
                       )
                    }
                    if (data.type === "BODY") {
                       return (
                          <div className='p-1 pe-2' >
                             <p className='fs-6' dangerouslySetInnerHTML={{ __html: updateDisplayedMessage(data.text, data) }}></p>

                          </div>
                       )
                    }
                    if (data.type === "FOOTER") {
                       return (
                          <div className=' ps-1 pe-2 pt-0' >
                             <p className='text-secondary font-small-3 mt-0'>{data.text} </p>
                          </div>
                       )
                    }
                    if (data.type === "BUTTONS") {
                       return data.buttons.map((data) => {
                          if (data.type === "URL") {
                             return (
                              <a href={data?.url} target="_blank" className="border-top  d-flex  justify-content-center  align-items-center text-decoration-none " style={{ padding: "10px", gap: "8px", color:"#53bdeb" }} >
                              <ExternalLink size={17} /><h6 style={{color:"#53bdeb"}} className='m-0 ' >{data.text}</h6>
                           </a>
                             )
                          }
                          if (data.type === "PHONE_NUMBER") {
                             return (
                                <div className="border-top  d-flex  justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px", color:"#53bdeb" }} >
                                   <Phone size={17} /><h6 style={{color:"#53bdeb"}}  className='m-0 ' >{data.text}</h6>
                                </div>
                             )
                          }
                          if (data.type === "QUICK_REPLY") {
                             return (
                                <div className="border-top  rounded-bottom-3   d-flex  justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px", color:"#53bdeb"}} >
                                   <CornerDownLeft size={17} /><h6 style={{color:"#53bdeb"}}  className='m-0 ' > {data.text}</h6>
                                </div>
                             )
                          }
                       })
                    }
                 })
              }

           </div>
        </div>

     </CardBody>
  )
}

// live chat

