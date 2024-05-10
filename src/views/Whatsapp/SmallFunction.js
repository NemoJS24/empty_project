import { CornerDownLeft, ExternalLink, FileText, Phone } from "react-feather"
import { CardBody } from "reactstrap"
import wp_back from './imgs/wp_back.png'

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


// functions
export const getBoldStr = (str) => {
   str = str.replace(/\*(\b.*?)\b\*/g, (_, p1) => `<strong>${p1}</strong>`)
    .replace(/\~(\b.*?)\b\~/g, (_, p1) => `<del>${p1}</del>`)
    .replace(/(?<=\s|^)(_.*?_)(?=\s|$)/g, (_, p1) => `<em>${p1.slice(1, -1)}</em>`)
    .replace(/\b((?:https?:\/\/|www\.)\S+)\b/g, '<a href="$1" target="_blank" style="color: blue; text-decoration:underline">$1</a>')
  return str
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

        <div className="border-1 rounded-2 mb-0 " style={{ maxWidth: "400px" }} >
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
                                <div className="border-top  rounded-bottom-3   d-flex text-primary justify-content-center  align-items-center   " style={{ padding: "10px", gap: "8px" }} >
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
