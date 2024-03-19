// export const getBoldStr = (str) => {
//   str = str.replace(/\*(\b.*?)\b\*/g, (_, p1) => `<strong>${p1}</strong>`)
//      .replace(/(?<=\s|^)(~(?:[^,]|,[^~]+)+?~)(?=\s|$)/g, (_, p1) => `<del>${p1.slice(1, -1)}</del>`)
//      .replace(/(?<=\s|^)(_.*?_)(?=\s|$)/g, (_, p1) => `<em>${p1.slice(1, -1)}</em>`)
//   return str
// }

export const getBoldStr = (str) => {
  str = str.replace(/\*(\b.*?)\b\*/g, (_, p1) => `<strong>${p1}</strong>`)
     .replace(/\~(\b.*?)\b\~/g, (_, p1) => `<del>${p1}</del>`)
     .replace(/(?<=\s|^)(_.*?_)(?=\s|$)/g, (_, p1) => `<em>${p1.slice(1, -1)}</em>`)

  return str
}