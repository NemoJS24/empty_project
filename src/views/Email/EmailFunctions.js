/* eslint-disable no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
// data 


export const DummyHtml = '<p class=\"editor-paragraph\" dir=\"ltr\" style=\"text-align: center;\"><b><strong class=\"editor-text-bold\" style=\"font-weight: 300; white-space: pre-wrap;\">Hi {customer_first_name}</strong></b><b><strong class=\"editor-text-bold\" style=\"font-weight: 300; font-size: 17px; line-height: 2; white-space: pre-wrap;\">,</strong></b></p><p class=\"editor-paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">{otp} is your one-time </span><span style=\"font-size: 35px; white-space: pre-wrap;\">password</span><span style=\"white-space: pre-wrap;\">.</span></p><p class=\"editor-paragraph\" dir=\"ltr\"><br></p><p class=\"editor-paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">Please enter this code in the relevant field to verify your identity as a genuine shopper at our</span></p><p class=\"editor-paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">store.</span></p><p class=\"editor-paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">{outlet_name}</span></p><p class=\"editor-paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">Thank you!</span></p><p class=\"editor-paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">Regards,</span></p><p class=\"editor-paragraph\" dir=\"ltr\"><br></p><p class=\"editor-paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">Team</span></p>'








// function
export const convertToHTML = (htmlString) => {
  // Replace escaped characters
  htmlString = htmlString.replace(/\\/g, '')

  // Replace inline styles with HTML attributes
  htmlString = htmlString.replace(/ style="([^"]*)"/g, function(match, p1) {
      const style = p1.split(';').map(function(rule) {
          const parts = rule.split(':').map(function(part) {
              return part.trim()
          })
          return parts.join(': ')
      }).join('; ')
      return ` style="${  style  }"`
  })

  // Remove unnecessary white spaces
  htmlString = htmlString.replace(/\s+/g, ' ')

  return htmlString
}
export const convertHtmlToString = (html) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    let result = ''

    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            result += node.textContent.trim()
        } else {
            const tag = node.tagName.toLowerCase()
            let attributes = ''
            if (node.attributes.length > 0) {
                for (let j = 0; j < node.attributes.length; j++) {
                    const attr = node.attributes[j]
                    attributes += ` ${attr.nodeName}="${attr.nodeValue}"`
                }
            }
            result += `<${tag}${attributes}>`
            if (node.childNodes.length > 0) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    traverse(node.childNodes[i])
                }
            }
            result += `</${tag}>`
        }
    }

    traverse(doc.body)

    return result
}

