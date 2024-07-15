// @ts-nocheck
const appBaseUrl = "https://apps.xircls.com"
const appSrceenWidth = window.innerWidth < 576 ? "mobile_" : ""
var timerId;
var timeLeft = 300;
var mobile = 425
var openTime;
var openTiming = 0;
let abandoned_delayInterval;
console.log("Loaded")

let checkBoxs = {}

function openButton() {
    console.log("openButton was called")
    const mainObject = JSON.parse()
    if (mainObject?.teaserEnabled) {
        document.getElementById('xircls_btn_main_div').style.display = "flex"
    }
}

function openPopUp(sessionType) {
    console.log("openPopUp was called")
    document.getElementById('xircls_main_div').style.display = "flex"
    document.getElementById('xircls_btn_main_div').style.display = "none"
    setTimeout(function () {
        document.getElementById('xircls_main_div').style.opacity = 1;
    }, 10);
    openTime = setInterval(openTimeFunc, 1000)
    popUpAnalytics("open")
    const offerData = JSON.parse(sessionStorage.getItem('offer_data'))
    if (offerData) {
        customPage('offers', offerData)
    }
    if (sessionType === "once_session") {
        var once_session = sessionStorage.getItem("once_session") ? sessionStorage.getItem("once_session") : 0
        once_session = Number(once_session) + 1
        sessionStorage.setItem("once_session", once_session);
    }
}

function closePopUp() {
    console.log("closePopUp was called")
    const mainObject = JSON.parse(document.getElementById('mainObject').value)
    document.getElementById('xircls_main_div').style.opacity = 0
    if (mainObject?.teaserEnabled) {
        document.getElementById('xircls_btn_main_div').style.display = "flex"
    }
    setTimeout(function () {
        document.getElementById('xircls_main_div').style.display = "none";
    }, 300);

    // customPage()
    const time = localStorage.getItem('openTime')
    popUpAnalytics(Number(time) > 2 ? "close" : "im_close")
    localStorage.removeItem('openTime')
    localStorage.removeItem('leadId')
    if (mainObject?.rules?.display_frequency == "once_session") {
        var closeTimes = sessionStorage.getItem('closeTimes') ? sessionStorage.getItem('closeTimes') : 0
    } else {
        var closeTimes = localStorage.getItem('closeTimes') ? localStorage.getItem('closeTimes') : 0
    }
    closeTimes = Number(closeTimes) + 1
    if (mainObject?.rules?.display_frequency == "once_session") {
        sessionStorage.setItem('closeTimes', closeTimes)
    } else {
        localStorage.setItem('closeTimes', closeTimes)
    }

    openTiming = 0
    clearTimeout(openTime)
}

function openTimeFunc() {
    console.log("openTimeFunc was called")
    localStorage.setItem('openTime', openTiming++)
}

function nextPageXIRCLS() {
    console.log("nextPageXIRCLS was called")
    const currentPageIndex = document.getElementById('currentIndex').value
    const mainObject = JSON.parse(document.getElementById('mainObject').value)
    console.log(currentPageIndex, mainObject, "20")
    appendPopUp("popUp", mainObject[`${appSrceenWidth}pages`][Number(currentPageIndex) + 1]?.values)
    document.getElementById("currentIndex").value = Number(currentPageIndex) + 1
}

function customPage(redirectTo, offer_data) {
    console.log("customPage was called")
    const mainObject = JSON.parse(document.getElementById('mainObject').value)
    console.log(mainObject, "18")
    let popUpContent
    if (redirectTo) {
        popUpContent = mainObject[`${appSrceenWidth}pages`]?.filter((curElem) => {
            return curElem.id === redirectTo
        })

    } else {
        popUpContent = [mainObject[`${appSrceenWidth}pages`][0]]
    }
    appendPopUp("popUp", popUpContent[0]?.values, offer_data)
    const currentIndex = mainObject[`${appSrceenWidth}pages`]?.findIndex((curElem) => curElem.id === redirectTo)
    document.getElementById('currentIndex').value = currentIndex
}

function validateData(cur, value, message) {
    console.log("validateData was called")
    console.log({ cur, value }, "email check")
    let bool = true
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (cur == "email") {
        if (value.match(mailformat)) {
            bool = true
        } else {
            bool = false
            pop_up_toastr(message, "danger")
        }
    }

    return bool
}

function checkBoxToggle(type) {
    console.log("checkBoxToggle was called")
    document.getElementById(type).value = event.target.checked
}

function getData() {
    console.log("getData was called")
    const data = {}
    var vailidateObj = JSON.parse(document.getElementById('vailidateObj').value)
    // var vaildObj = vailidateObj.filter((obj) => obj?.isRequired)

    var bool = true
    if (vailidateObj.length > 0) {
        for (var i = 0; i < vailidateObj.length; i++) {
            console.log(vailidateObj[i], "OBJECT")
            const value = document.querySelector(`#main_popup #subButton_input_${vailidateObj[i]?.name}`)
       
            bool = validateData(vailidateObj[i]?.name, value.value, vailidateObj[i]?.errorMessage)
            console.log("calling validateObject")
            if (bool) {
                if (vailidateObj[i]?.isRequired) {
                    if (value.value === "") {
                        pop_up_toastr(vailidateObj[i]?.errorMessage, "danger")
                        value.focus()
                        bool = false
                        break
                    } else {
                        data[vailidateObj[i]?.name] = value.value
                        // form_data.append(vailidateObj[i]?.name, value.value)
                        bool = true
                    }
                } else {
                    data[vailidateObj[i]?.name] = value.value
                    bool = true
                }
            } else {
                break
            }

        }
    }
    return { bool, data }
}

function sendData(obj, e, dynamicData = {}) {
    console.log("sendData was called")
    console.log({ obj, dynamicData }, "Testing")
    const form_data = new FormData()
    Object.entries(dynamicData).map(([key, value]) => form_data.append(key, value))
    if (document.getElementById("settingType").value == "true") {
        form_data.append("is_otp", "true")
    }

    console.log(e, "current")
    const eventButton = e.target.innerHTML
    e.target.innerHTML = '<div class="xircls_loader"></div>';
    form_data.append('value', "email")
    form_data.append('theme_id', localStorage.getItem('theme_id'))
    form_data.append("shop", Shopify.shop)
    form_data.append("isNewsLetter", document.getElementById("newsletter").value)
    form_data.append("app", "superleadz")
    form_data.append("ip", document.getElementById("ip_here").value)
    form_data.append("outlet_name", document.getElementById('outlet_name').value)
    form_data.append("device", window.innerWidth <= mobile ? "MOBILE" : "DESKTOP")
    form_data.append("mac_id", localStorage.getItem('macID'))
    if (localStorage.getItem('leadId')) {
        form_data.append("id", localStorage.getItem('leadId'))
    }
    if (params.get('utm_source')) {
        form_data.append('source', sessionStorage.getItem("source"))
    }

    try {
        Object.entries(checkBoxs).map(([key, value]) => form_data.append(key, value))
    } catch (error) {
        console.log(error, checkBoxs, "checkError")
    }

    return fetch(`${appBaseUrl}/api/v1/get-otp/`, {
        method: "POST",
        body: form_data
    })
        .then((result) => result.json())
        .then((response) => {
            console.log(response)
            localStorage.setItem('leadId', response?.data)
            localStorage.setItem('abandoned_lead_id', response?.data)
            popUpActionButtonRedirection(obj, e)
            return true
        })
        .catch((error) => {
            e.target.innerHTML = eventButton
            console.error('Error:', error);
            return false
        });
}

function countdown_otp() {
    console.log("countdown_otp was called")
    var elem = document.getElementById('xircls_otp_counter');
    let minutes, seconds
    if (timeLeft == -1) {
        clearTimeout(timerId);
    } else {
        if (timeLeft == 0) {
            elem.innerHTML = `<a id="xircls_resend_otp" onclick="resendOtp()" style="text-decoration: underline !important; color: #2e82cb !important; cursor: pointer !important">Resend OTP</a>`
            document.getElementById("subButton_input_enter_otp").disabled = true;
        } else {
            try {
                minutes = parseInt(timeLeft / 60, 10);
                seconds = parseInt(timeLeft % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                elem.innerHTML = ` ${minutes + ":" + seconds} minutes remaining`;
                timeLeft--;
            }
            catch (error) {
                console.log(error)
                clearTimeout(timerId);
            }

        }

    }
}

function resendOtp() {
    console.log("resendOtp was called")
    timeLeft = 60
    clearTimeout(timerId);
    document.getElementById("subButton_input_enter_otp").disabled = false;
    // var saved_code = JSON.parse(localStorage.getItem('verificatiion_code'))
    var form_data = new FormData()
    // form_data.append('otp', value)
    form_data.append("id", localStorage.getItem('leadId'))
    form_data.append("outlet_name", document.getElementById('outlet_name').value)
    // form_data.append('theme_id', localStorage.getItem('theme_id'))
    form_data.append('TYPE', "RESEND")
    fetch(`${appBaseUrl}/api/v1/verify-otp/`, {
        method: "POST",
        body: form_data
    })
        .then((result) => result.json())
        .then((resp) => {
            console.log(resp)
            // localStorage.setItem('verificatiion_code', JSON.stringify(resp))
            pop_up_toastr('OTP Sent. Check Inbox')
            timerId = setInterval(countdown_otp, 1000);
        })
        .catch((error) => {
            console.log(error)
        })
}

function verifyOTP(obj, e) {
    console.log("verifyOTP was called")
    e.target.disabled = false
    var value = document.querySelector(`#main_popup #subButton_input_enter_otp`).value
    if (value !== "") {
        const eventButton = e.target.innerHTML
        e.target.innerHTML = '<div class="xircls_loader"></div>';

        // var saved_code = JSON.parse(localStorage.getItem('verificatiion_code'))
        var form_data = new FormData()
        form_data.append('otp', value)
        form_data.append("id", localStorage.getItem('leadId'))
        form_data.append('theme_id', localStorage.getItem('theme_id'))
        form_data.append("device", window.innerWidth <= mobile ? "MOBILE" : "DESKTOP")

        fetch(`${appBaseUrl}/api/v1/verify-otp/`, {
            method: 'POST',
            body: form_data
        })
            .then((result) => result.json())
            .then((resp) => {
                console.log(resp)
                // e.target.innerHTML = eventButton
                if (resp.response === "OTP Verification Failed") {
                    pop_up_toastr('Invaild OTP', "danger")
                    e.target.innerHTML = eventButton
                } else {
                    clearTimeout(timerId);

                    getOffers()
                }
            })
            .catch((error) => {
                console.log(error)
                e.target.innerHTML = eventButton

            })
    } else {
        pop_up_toastr('Please enter OTP', "danger")
    }
}

function getOffers() {
    console.log("getOffers was called")
    const form_data = new FormData()
    var saved_code = JSON.parse(localStorage.getItem('verificatiion_code'))
    form_data.append("shop", Shopify.shop)
    form_data.append('theme_id', localStorage.getItem('theme_id'))
    form_data.append("app_name", "superleadz")
    // form_data.append('verification_id', saved_code?.data)
    form_data.append("id", localStorage.getItem('leadId'))
    form_data.append("device", window.innerWidth <= mobile ? "MOBILE" : "DESKTOP")

    fetch(`${appBaseUrl}/api/v1/get_theme_offers/`, {
        method: 'POST',
        body: form_data
    })
        .then((result) => result.json())
        .then((resp) => {
            console.log(resp)
            customPage('offers', resp.offer_list)
            if (resp.offer_list.length > 0) {
                sessionStorage.setItem('offer_data', JSON.stringify(resp.offer_list))
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

function redeemOffer(url, code) {
    console.log("redeemOffer was called")
    const form_data = new FormData()
    form_data.append("theme_id", localStorage.getItem('theme_id'))
    form_data.append("ACTION", "OFFERS")
    form_data.append("shop", Shopify.shop)
    form_data.append("app", "superleadz")
    // var saved_code = JSON.parse(localStorage.getItem('verificatiion_code'))
    // form_data.append('id', saved_code?.data)
    if (localStorage.getItem('leadId')) {
        form_data.append("id", localStorage.getItem('leadId'))
    }
    form_data.append('code', code)
    form_data.append("device", window.innerWidth <= mobile ? "MOBILE" : "DESKTOP")
    navigator.sendBeacon(`${appBaseUrl}/api/v1/pop_up_analytics/`, form_data);
    window.location.href = url
}

function getOfferHtml(mainObject, Type, Value, Summary, Code, btn_url, ValidityPeriod) {
    console.log("getOfferHtml was called")
    console.log({ mainObject, Type, Value, Summary, Code, btn_url, ValidityPeriod }, "offers")
    const titleValue = Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `â‚¹${Math.ceil(Value)}`
    const offerStyles = [
        {
            id: 1,
            html: `<div style="margin: 10px 0px;"><div style="flex-direction: column; justify-content: center; align-items: center; position: relative;"><div style="width: 100%; min-height: 100%; justify-content: center; filter: drop-shadow(rgba(0, 0, 0, 0.2) 0px 0px 10px); border-radius: 10px; display: flex; position: relative;  background-color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"};"><div class="flex-grow-1 d-flex flex-column justify-content-between" style="padding: 15px;flex-grow: 1"><div><div style="display: flex; flex-direction: column; align-items: start; justify-content: start; text-transform: uppercase;"><div style="font-weight: bolder; font-size: 14.4px; color: ${mainObject?.offerProperties?.colors?.color_2 || "rgb(255, 103, 28)"};">${Code}</div><span style="font-size: 12px; color: ${mainObject?.offerProperties?.colors?.color_3 || "rgb(0, 0, 0)"};" class="xircls_summary">${Summary}</span></div></div><div><div style="padding-top: 8px;"><span style="text-transform: uppercase; font-weight: 500; font-size: 10.4px; color: ${mainObject?.offerProperties?.colors?.color_3 || "rgb(0, 0, 0)"}" class="valid_until">valid until: ${ValidityPeriod?.end ? `${ValidityPeriod?.end.toLocaleDateString()}` : "Perpetual"}</span></div></div></div><div style="display: flex; flex-direction: column; gap: 8px; padding: 0px 15px 15px;"><div style="position: relative; display: flex; flex-direction: column; justify-content: space-between; align-items: start; background-color: ${mainObject?.offerProperties?.colors?.color_2 || "rgb(255, 103, 28)"}; padding: 16px 4px; border-radius: 0px 0px 5px 5px; max-width: 100px;"><div class="xircls_ellipsis" style="font-size: 29px; font-weight: 750; font-family: Montserrat; color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"};">${Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `â‚¹${Math.ceil(Value)}`}</div></div><div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: center;"><button type="button" style="color: ${mainObject?.offerProperties?.colors?.color_2 || "rgb(255, 103, 28)"}; font-size: 10px; font-weight: 700; cursor: pointer; border: 0.75px solid ${mainObject?.offerProperties?.colors?.color_2 || "rgb(255, 103, 28)"}; border-radius: 15px; padding: 3px; background-color: transparent; text-transform: uppercase;cursor:pointer" onclick="redeemOffer('${btn_url}', '${Code}')"><span>Redeem</span></button></div></div></div></div></div>`
        },
        {
            id: 2,
            html: `<div style="display: flex; border-radius: 500px; border: 1px solid ${mainObject?.offerProperties?.colors?.color_3 || "rgb(0, 0, 0)"}; margin: 10px 0px; background-color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"};"><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px; border-right: 1px solid ${mainObject?.offerProperties?.colors?.color_3 || "rgb(0, 0, 0)"};"><div style="font-weight: 700; font-size: 12.5px; color: ${mainObject?.offerProperties?.colors?.color_2 || "#000000"};">${Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `â‚¹${Math.ceil(Value)}`} off</div><div style="font-size: 8px; color: ${mainObject?.offerProperties?.colors?.color_2 || "#000000"};" class="xircls_summary">${Summary}</div></div><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-size: 8px; color: ${mainObject?.offerProperties?.colors?.color_2 || "#000000"};">Offer Code</div><div style="font-weight: 700; font-size: 10px; color: ${mainObject?.offerProperties?.colors?.color_2 || "#000000"};">${Code}</div></div></div>`
        },
        {
            id: 3,
            html: `<div style="display: flex; flex-direction: column; margin: 10px 0px; gap: 15px; align-items: stretch; border-radius: 15px; padding: 15px;background-color: ${mainObject?.offerProperties?.colors?.color_1 || "rgb(25, 151, 161)"};"><div style="display: flex; justify-content: space-between; gap: 15px;"><div style="font-size: 12.5px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};" class="xircls_summary">${Summary}</div><div style="font-size: 20px; font-weight: 600; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};">${Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `â‚¹${Math.ceil(Value)}`}</div></div><div style="color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"}; font-size: 12px;">Offer code: ${Code}</div><div style="display: flex; justify-content: center; align-items: center;"><div style="font-size: 10px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"}; border-radius: 25px; width: auto; max-width: 100%; padding: 10px 25px; background-color: ${mainObject?.offerProperties?.colors?.color_2 || "rgb(227, 11, 92)"};cursor:pointer" onclick="redeemOffer('${btn_url}', '${Code}')">REDEEM</div></div></div>`
        },
        {
            id: 4,
            html: `<div style="display: flex; flex-direction: column; align-items: stretch; margin: 10px 0px; background-color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"};"><div style="padding: 7.5px; border-bottom: 1px dashed black;"><div style="text-align: center; font-weight: 700; font-size: 12.5px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#000000"}" class="xircls_summary">${Summary}</div></div><div style="display: flex; flex-direction: column; align-items: stretch; padding: 7.5px 15px; gap: 15px;"><div style="display: flex; gap: 10px; justify-content: space-between; align-items: center;"><div style="display: flex; align-items: center; gap: 10px;"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="${mainObject?.offerProperties?.colors?.color_3 || "#000000"}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><link xmlns="" type="text/css" id="dark-mode" rel="stylesheet" href=""/><style xmlns="" type="text/css" id="dark-mode-custom-style"/><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg><div style="color: ${mainObject?.offerProperties?.colors?.color_3 || "#000000"}; font-size: 11px;">${Code}</div></div><div style="font-size: 11px; background-color: ${mainObject?.offerProperties?.colors?.color_2 || "rgb(28, 58, 86)"}; color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"}; border-radius: 6px; width: auto; max-width: 100%; padding: 10px;cursor:pointer" onclick="redeemOffer('${btn_url}', '${Code}')">REDEEM</div></div><div style="text-align: center; font-size: 11px;color: ${mainObject?.offerProperties?.colors?.color_3 || "#000000"}"><em>Redeem to auto-apply code at checkout!</em></div></div></div>`
        },
        {
            id: 5,
            html: `<div style="border: 2px dashed ${mainObject?.offerProperties?.colors?.color_3 || "#000000"}; padding: 15px; display: flex; flex-direction: column; gap: 15px; margin: 10px 0px; background-color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"};"><div style="text-align: center; font-weight: 700; font-size: 13px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#000000"};" class="xircls_summary">${Summary}â€‹</div><div style="text-align: center; font-size: 12px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#000000"};">Offer Code: ${Code}</div><div style="display: flex; justify-content: center; align-items: center;"><div style="font-size: 12px; padding: 10px 35px; background-color: ${mainObject?.offerProperties?.colors?.color_2 || "#000000"}; color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"}; border-radius: 8px; width: auto;cursor:pointer" onclick="redeemOffer('${btn_url}', '${Code}')">Redeem</div></div></div>`
        },
        {
            id: 6,
            html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 15px; padding: 15px; margin: 10px 0px; background-color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"};"><div style="text-align: center; font-size: 16px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#000000"};" class="xircls_summary">${Summary}</div><div style="text-align: center; font-size: 25px; font-weight: 600; color: ${mainObject?.offerProperties?.colors?.color_3 || "#000000"};">${Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `â‚¹${Math.ceil(Value)}`} OFF</div><div style="display: flex; align-items: center; width: 100%;"><div style="width: 50%; text-align: center; color: ${mainObject?.offerProperties?.colors?.color_3 || "#000000"};"><u>${Code}</u></div><div style="width: 50%; text-align: center; display: flex; justify-content: center; align-items: center;"><div style="font-size: 15px; background-color: ${mainObject?.offerProperties?.colors?.color_2 || "#000000"}; width: auto; padding: 10px 20px; border-radius: 5px; color: ${mainObject?.offerProperties?.colors?.color_1 || "#ffffff"};cursor:pointer" onclick="redeemOffer('${btn_url}', '${Code}')">Redeem</div></div></div></div>`
        },
        {
            id: 7,
            html: `<div style="padding: 15px; background-color: ${mainObject?.offerProperties?.colors?.color_1 || "#fdb173"}; border-radius: 10px; display: flex; flex-direction: column; gap: 10px; margin: 10px 0px;"><div style="display: flex; justify-content: space-between; align-items: start; gap: 15px;"><div style="color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"}; font-size: 16px;" class="xircls_summary">${Summary}</div><div style="font-size: 35px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"}; font-weight: 700;">${Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `â‚¹${Math.ceil(Value)}`}</div></div><div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;"><div style="color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"}; font-size: 12.5px;">â€‹offer code: ${Code}</div><div style="font-size: 15px; background-color: ${mainObject?.offerProperties?.colors?.color_2 || "#ffffff"}; font-weight: 700; width: auto; color: ${mainObject?.offerProperties?.colors?.color_1 || "#fdb173"}; padding: 7.5px 20px; border-radius: 5px;cursor:pointer" onclick="redeemOffer('${btn_url}', '${Code}')">Redeem</div></div></div>`
        },
        {
            id: 8,
            html: `<div style="display: flex; border-radius: 500px; background-color: ${mainObject?.offerProperties?.colors?.color_1 || "#377f71"}; box-shadow: ${mainObject?.offerProperties?.colors?.color_2 || "rgb(40, 40, 40)"} 0px 0px 10px 2.5px inset; margin: 10px 0px;"><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-weight: 700; font-size: 20px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};">${Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `â‚¹${Math.ceil(Value)}`} off</div><div style="font-size: 10px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};" class="xircls_summary">${Summary}</div></div><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-size: 10px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};">Offer Code</div><div style="font-weight: 700; font-size: 15px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};">${Code}</div></div></div>`
        },
        {
            id: 9,
            html: `<div style="padding: 10px; display: flex; flex-direction: column; gap: 15px; margin: 10px 0px;"><div style="padding: 15px; display: flex; flex-direction: column; background-color: ${mainObject?.offerProperties?.colors?.color_1 || "rgb(255, 117, 24)"}; gap: 10px;  border-radius: 500px;"><div style="font-size: 15px; font-weight: 700; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};" class="xircls_summary">${Summary}</div><div style="font-size: 10px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};">Offer code: ${Code}</div></div><div style="display: flex; justify-content: center; align-items: center;"><div style="background-image: linear-gradient(90deg, ${mainObject?.offerProperties?.colors?.color_1 || "rgb(255, 117, 24)"}, ${mainObject?.offerProperties?.colors?.color_2 || "rgb(227, 11, 92)"}); border-radius: 25px; max-width: 100%; padding: 10px 25px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"}; font-size: 12.5px;cursor:pointer" onclick="redeemOffer('${btn_url}', '${Code}')">REDEEM</div></div></div>`
        },
        {
            id: 10,
            html: `<div style="padding: 15px; background-color: ${mainObject?.offerProperties?.colors?.color_1 || "rgb(255, 117, 24)"}; display: flex; flex-direction: column; gap: 15px; border-radius: 500px; margin: 10px 0px;"><div style="font-size: 15px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};" class="xircls_summary">${Summary}</div><div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;"><div style="font-size: 10px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"};">Offer code: ${Code}</div><div style="display: flex; justify-content: center; align-items: center;"><div style="background-image: linear-gradient(90deg, ${mainObject?.offerProperties?.colors?.color_1 || "rgb(255, 117, 24)"}, ${mainObject?.offerProperties?.colors?.color_2 || "rgb(227, 11, 92)"}); border-radius: 25px; max-width: 100%; padding: 10px 25px; color: ${mainObject?.offerProperties?.colors?.color_3 || "#ffffff"}; font-size: 12.5px;cursor:pointer" onclick="redeemOffer('${btn_url}', '${Code}')">REDEEM</div></div></div></div>`
        }
    ]

    const appendTheseOffer = offerStyles.filter((curElem) => Number(curElem.id) === Number(mainObject.offerTheme))
    return appendTheseOffer[0].html
}

function addOffers(id, offer_data) {
    console.log("addOffers was called")
    const mainObject = JSON.parse(document.getElementById('mainObject').value)
    console.log(offer_data, "offers")
    document.getElementById('xircls_offers_div').innerHTML = ``
    const data = offer_data?.filter((cur) => cur.Status == "ACTIVE")

    if (data?.length > 0) {

        data?.map((curElem) => {
            let { Type, Value, Summary, Code, ValidityPeriod } = curElem
            let btn_url
            shopName = document.getElementById('append_shop_val').value

            const redirectUrl = mainObject?.selectedOffers?.filter((curElem) => curElem?.Code == Code)

            if (redirectUrl.length > 0) {
                btn_url = `${shopName}/discount/${Code}/?redirect=${redirectUrl[0]?.url}`
            } else {
                btn_url = `${shopName}/discount/${Code}`
            }

            document.getElementById('xircls_offers_div').innerHTML += getOfferHtml(mainObject, Type, Value, redirectUrl[0].Summary, Code, btn_url, ValidityPeriod)
            if (mainObject?.offerProperties?.showSections.includes("description")) {
                document.querySelectorAll('.xircls_summary').forEach((curElem) => {
                    curElem.style.display = "block"
                })
            } else {
                document.querySelectorAll('.xircls_summary').forEach((curElem) => {
                    curElem.style.display = "none"
                })
            }

            if (mainObject?.offerProperties?.showSections.includes("validity")) {
                document.querySelectorAll('.valid_until').forEach((curElem) => {
                    curElem.style.display = "block"
                })
            } else {
                document.querySelectorAll('.valid_until').forEach((curElem) => {
                    curElem.style.display = "none"
                })
            }
        })
    }
}

async function popUpActionButton(obj, e) {
    console.log("popUpActionButton was called")
    popUpAnalytics(obj?.redirectType)

    const dynamicData = getData()

    if (obj?.redirectType === "close") {
        closePopUp()
    } else if (obj?.redirectType === "redirect") {
        window.location.href = obj.redirectTo
    } else if (obj?.redirectType === "verify") {
        verifyOTP(obj, e)
    } else if (obj?.redirectType === "call") {
        document.location.href = `tel:${obj.redirectTo}`
    } else {
        // if (Shopify.shop == "maapro.myshopify.com") {

        if (dynamicData.bool) {
            if (Object.entries(dynamicData?.data).length > 0) {
                console.log("Sending Data")
                sendData(obj, e, dynamicData?.data)
            } else {
                console.log("redirect")
                popUpActionButtonRedirection(obj, e)
            }
        }
        // }
    }
}

function popUpActionButtonRedirection(obj, e) {
    console.log("popUpActionButtonRedirection was called")
    // popUpAnalytics(obj?.redirectType)

    if (obj?.redirectType === "jumpTo") {
        customPage(obj?.redirectTo)
    } else if (obj?.redirectType === "nextPage") {
        nextPageXIRCLS()
    } else if (obj?.redirectType === "save_close") {
        closePopUp()
    } else if (obj?.redirectType === "save_redirect") {
        window.location.href = obj.redirectTo
    } else if (obj?.redirectType === "save_call") {
        document.location.href = `tel:${obj.redirectTo}`
    } else if (obj?.redirectType === "sendOTP") {
        if (document.getElementById("settingType").value === "false") {
            getOffers()
        } else {
            pop_up_toastr('OTP Sent. Check Inbox')
            timerId = setInterval(countdown_otp, 1000);
            customPage("user_verification")
        }
    }
}

function pop_up_toastr(text, color = "success") {
    console.log("pop_up_toastr was called")
    var xircls_toastr = document.getElementById('xircls_toastr')
    var toast = document.querySelector('.xircls_toastr')
    document.getElementById('xircls_toastr').classList.add("showToast")
    // document.getElementById('xircls_toastr').style.top = "50px"
    toast.style.backgroundColor = color == "success" ? "#28c76f" : "#dc3545"

    if (color == "success") {
        document.querySelector('.check_icon').style.display = ""
        document.querySelector('.cross_icon').style.display = "none"
    } else {
        document.querySelector('.check_icon').style.display = "none"
        document.querySelector('.cross_icon').style.display = ""
    }

    document.querySelector('#text_for_toastr').innerHTML = text

    setTimeout(() => {
        document.getElementById('xircls_toastr').classList.remove("showToast")
    }, 2500)

}

function popUpAnalytics(type) {
    console.log("popUpAnalytics was called")
    if (type) {
        const form_data = new FormData()
        console.log("ACTION", type.toUpperCase())
        form_data.append("theme_id", localStorage.getItem('theme_id'))
        // var saved_code = JSON.parse(localStorage.getItem('verificatiion_code'))
        form_data.append("ACTION", type.toUpperCase())
        form_data.append("shop", Shopify.shop)
        form_data.append("app", "superleadz")
        // form_data.append('id', saved_code?.data)
        if (localStorage.getItem('leadId')) {
            form_data.append("id", localStorage.getItem('leadId'))
        }
        form_data.append("device", window.innerWidth <= mobile ? "MOBILE" : "DESKTOP")

        fetch(`${appBaseUrl}/api/v1/pop_up_analytics/`, {
            method: 'POST',
            body: form_data
        })
            .then((resp) => {
                console.log(resp)
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

function checkEnterButton() {
    console.log("checkEnterButton was called")
    const buttons = document.querySelectorAll('.xircls_button_enter')

    buttons.forEach((curElem) => {
        if (curElem.classList.contains('xircls_sendOTP')) {
            curElem.click()
        } else if (curElem.classList.contains('xircls_verify')) {
            curElem.click()
        }
    })
}
let spent_on_page, spent_on_website, read_page_by, visited, not_active_page, spent_on_websiteInterval, spent_on_pageInterval;
var spendOnPageCount = 0

function spendOnPageCountFunc(value, sessionType) {
    console.log("spendOnPageCountFunc was called")
    if (sessionType == "once_session") {
        var currentValue = sessionStorage.getItem(`spendOnPage`) ? sessionStorage.getItem(`spendOnPage`) : 0
    } else {
        var currentValue = localStorage.getItem(`spendOnPage`) ? localStorage.getItem(`spendOnPage`) : 0
    }

    if (sessionType == "once_session") {
        sessionStorage.setItem(`spendOnPage`, spendOnPageCount++) // For Spend on the Page
    } else {
        localStorage.setItem(`spendOnPage`, spendOnPageCount++) // For Spend on the Page
    }

    if (Number(value) == Number(currentValue)) {
        openPopUp(sessionType)
        if (sessionType == "once_session" || sessionType == "only_once") {
            clearInterval(spent_on_websiteInterval)
            clearInterval(spent_on_pageInterval)
        }
    }
}

function spendOnWebsiteCountFunc(value, sessionType) {
    console.log("openTimeFunc was called")
    if (sessionType == "once_session") {
        var spendOnWebsite = sessionStorage.getItem("spendOnWebsite") ? sessionStorage.getItem("spendOnWebsite") : 0
    } else {
        var spendOnWebsite = localStorage.getItem("spendOnWebsite") ? localStorage.getItem("spendOnWebsite") : 0
    }

    spendOnWebsite = Number(spendOnWebsite) + 1

    if (sessionType == "once_session") {
        var currentValue = sessionStorage.getItem(`spendOnWebsite`) ? Number(sessionStorage.getItem(`spendOnWebsite`)) : 0
    } else {
        var currentValue = localStorage.getItem(`spendOnWebsite`) ? Number(localStorage.getItem(`spendOnWebsite`)) : 0
    }


    if (sessionType == "once_session") {
        sessionStorage.setItem(`spendOnWebsite`, spendOnWebsite) // For Spend on the Page
    } else {
        localStorage.setItem(`spendOnWebsite`, spendOnWebsite) // For Spend on the Page
    }


    if (Number(value) == currentValue) {
        openPopUp(sessionType)
        if (sessionType == "once_session" || sessionType == "only_once") {
            clearInterval(spent_on_websiteInterval)
            clearInterval(spent_on_pageInterval)
        }
    }
}

function rulesToOpen(sessionType) {
    console.log("rulesToOpen was called")
    const mainJson = JSON.parse(document.getElementById('mainObject').value)

    spent_on_website = mainJson?.rules?.spent_on_website
    spent_on_page = mainJson?.rules?.spent_on_page
    read_page_by = mainJson?.rules?.read_page_by
    visited = mainJson?.rules?.visited
    not_active_page = mainJson?.rules?.not_active_page
    exit_intent = mainJson?.rules?.exit_intent

    var display_frequency = mainJson?.rules?.display_frequency
    var display_when = mainJson?.rules?.display_when
    if (display_when == "immediately") {
        openPopUp(sessionType)
        // console.log("immediately", "display_frequency")
    }
    if (spent_on_website) {
        spent_on_websiteInterval = setInterval(() => {
            spendOnWebsiteCountFunc(mainJson?.rules?.spent_on_website_value_converted, sessionType)
        }, 1000)
    }

    if (spent_on_page) {
        spent_on_pageInterval = setInterval(() => {
            spendOnPageCountFunc(mainJson?.rules?.spent_on_page_value_converted, sessionType)
        }, 1000)
    }

    if (read_page_by) {
        var scrollcounter = 0
        const body_div = document.body;
        var frequencyDuration = 1000
        window.addEventListener('scroll', function () {
            console.log('scrolling');
            const percentage = Math.round((window.scrollY / body_div.getBoundingClientRect().height) * 100)
            console.log(percentage);
            if (percentage >= Number(mainJson?.rules?.read_page_by_value) && scrollcounter === 0) {
                openPopUp(display_frequency)
                console.log("scrolling", "display_frequency")

                scrollcounter = scrollcounter + 1
            }


        });
    }

    if (not_active_page) {
        let timeout = null;
        var timeoutCounter = 0
        console.log("not_active_page")
        document.addEventListener('mousemove', () => {
            console.log("mousemove")

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                console.log('Mouse stopped moving.');
                if (timeoutCounter === 0) {
                    openPopUp(display_frequency)
                    timeoutCounter = timeoutCounter + 1
                }
            }, mainJson?.rules?.not_active_page_value_converted * 1000);
        });
    }

    if (visited) {
        // if (document.referrer != location.href) {
        let visitedPageCount
        if (sessionType == "once_session") {
            visitedPageCount = parseInt(sessionStorage.getItem('visitedPageCount')) || 0;
        } else {
            visitedPageCount = parseInt(localStorage.getItem('visitedPageCount')) || 0;
        }
        visitedPageCount++;
        if (sessionType == "once_session") {
            sessionStorage.setItem('visitedPageCount', visitedPageCount);
        } else {
            localStorage.setItem('visitedPageCount', visitedPageCount);
        }

        // } else {
        //     console.log("Its Reload")
        // }

    }

    if (exit_intent) {
        var exit_intent_count = 0

        if (window.innerWidth <= mobile) {
            document.addEventListener('touchmove', (event) => {
                if (event.clientY < 0 && exit_intent_count === 0) {
                    openPopUp(display_frequency)
                    exit_intent_count = exit_intent_count + 1
                }
            });
        } else {
            document.addEventListener('mouseout', (event) => {
                if (event.clientY < 0 && exit_intent_count === 0) {
                    openPopUp(display_frequency)
                    exit_intent_count = exit_intent_count + 1
                }
            });
        }


    }
}

function updateTnc(id) {
    console.log("updateTnc was called")
    // element = document.getElementById(id)
    console.log(event, "event")
    checkBoxs = { ...checkBoxs, [event.target.name]: event.target.checked ? 1 : 0 }

    console.log(checkBoxs)
}

function getCurrentDateTimeHere() {
    console.log("getCurrentDateTimeHere was called")
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function markLeadAbandoned(cart_details) {
    console.log("markLeadAbandoned was called")
    console.log("mark abandoned")
    const form_data = new FormData()
    form_data.append('lead_id', localStorage.getItem('abandoned_lead_id'))
    form_data.append('timestamp_schedule_str', getCurrentDateTimeHere())
    form_data.append("shop", Shopify.shop)
    form_data.append("app", "superleadz")
    form_data.append("cart_details", JSON.stringify(cart_details))
    fetch(`${appBaseUrl}/api/v1/mark_abandoned/`, {
        method: "POST",
        body: form_data
    })
        .then((resp) => {
            console.log(resp)
            clearInterval(abandoned_delayInterval)
            sessionStorage.removeItem('abandoned_delay')
        })
        .catch((error) => {
            console.log(error)
        })
}

function abandonedDelayFunc(cart_details) {
    console.log("abandonedDelayFunc was called")
    const delay = document.getElementById('abandoned_delay').value
    var abandoned_count = sessionStorage.getItem('abandoned_delay') ? Number(sessionStorage.getItem('abandoned_delay')) : 0
    abandoned_count = Number(abandoned_count) + 1
    if (abandoned_count == delay && localStorage.getItem('abandoned_lead_id')) {
        markLeadAbandoned(cart_details)
        clearInterval(abandoned_delayInterval)
        // sessionStorage.removeItem('abandoned_delay')
    }
    sessionStorage.setItem('abandoned_delay', abandoned_count)
}

async function getCartDataHere() {
    console.log("getCartDataHere was called")
    try {
        const response = await fetch('/cart.js');
        const cartData = await response.json();
        return cartData;
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
}

async function checkCart() {
    console.log("checkCart was called")
    const cart_details = await getCartDataHere()

    if (cart_details.item_count > 0) {
        console.log("inside")
        if (Number(sessionStorage.getItem('cart_count')) != Number(cart_details.item_count)) {
            sessionStorage.removeItem('abandoned_delay')
        }
        sessionStorage.setItem('cart_count', cart_details.item_count)
        clearInterval(abandoned_delayInterval)
        abandoned_delayInterval = setInterval(() => {
            abandonedDelayFunc(cart_details)
        }, 1000)
        // console.log(JSON.parse(cartJson));
    } else {
        console.log("outside")
        sessionStorage.setItem('cart_count', cart_details.item_count)
    }
}

const allButtons = document.querySelectorAll('button');
allButtons.forEach(button => {
    if (button.innerText.trim().toLowerCase().includes("cart")) {
        // console.log(button.innerText.trim().toLowerCase())
        button.addEventListener('click', function (event) {
            // Use setTimeout with a delay of 0 to ensure it runs after all synchronous code
            setTimeout(() => {
                checkCart(event);
            }, 5000);
        })
    }
})





