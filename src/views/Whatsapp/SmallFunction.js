
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

export const getBoldStr = (str) => {
  str = str.replace(/\*(\b.*?)\b\*/g, (_, p1) => `<strong>${p1}</strong>`)
    .replace(/\~(\b.*?)\b\~/g, (_, p1) => `<del>${p1}</del>`)
    .replace(/(?<=\s|^)(_.*?_)(?=\s|$)/g, (_, p1) => `<em>${p1.slice(1, -1)}</em>`)

  return str
}

