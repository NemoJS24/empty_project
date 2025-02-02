import React, { useContext } from 'react'
import moment from 'moment/moment'
import { PermissionProvider } from '../../Helper/Context'
import { Col } from 'reactstrap'

export const defaultOfferStyles = [
    {
        id: 1,
        html: `<div style="margin: 10px 0px;">
        <div style="flex-direction: column; justify-content: center; align-items: center; position: relative;">
          <div style="width: 100%; min-height: 100%; justify-content: center; filter: drop-shadow(rgba(0, 0, 0, 0.2) 0px 0px 10px); border-radius: 10px; display: flex; position: relative; background-color: rgb(255, 255, 255);">
            <div class="flex-grow-1 d-flex flex-column justify-content-between" style="padding: 15px;">
              <div>
                <div style="display: flex; flex-direction: column; align-items: start; justify-content: start; ">
                  <div style="font-weight: bolder; font-size: 0.9rem; color: #5eb160; margin-bottom: 12px">Q6TDK3OSVTH</div><span style=" font-size: 0.75rem; color: rgb(0, 0, 0);">12% off Mango</span>
                </div>
              </div>
              <div>
                <div style="padding-top: 0.5rem;"><span style=" font-weight: 500; font-size: 0.65rem;">Valid until: Perpetual</span></div>
              </div>
              <div style="text-align: center; font-size: 11px;color: #000000; margin-top: 26px">Click 'Redeem' to auto-apply offer code at checkout!</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 0px 15px 15px;">
              <div style="position: relative; display: flex; flex-direction: column; justify-content: space-between; align-items: center; background-color: #5eb160; padding: 1rem 0.25rem; border-radius: 0px 0px 5px 5px; max-width: 100px; min-width: 80px">
                <h1 style="font-size: 1.6rem; font-weight: 750; font-family: Montserrat; color: rgb(255, 255, 255);">12%</h1>
              </div>
              <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: center;"><button type="button" style="color: black; font-size: 0.65rem; font-weight: 700; cursor: pointer; border: 0.75px solid gray; border-radius: 7px; padding: 0.5rem 2rem; background-color: transparent; "><span>Redeem</span></button></div>
            </div>
          </div>
        </div>
      </div>`
    },
    {
        id: 2,
        html: `<div style="display: flex; border-radius: 500px; border: 1px solid rgb(0, 0, 0); margin: 10px 0px; background-color: #ffffff;"><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 12.5px; border-right: 1px solid rgb(0, 0, 0);"><div style="font-weight: 700; font-size: 17px; color: #000000;">25% off</div><div style="font-size: 12px; color: #000000;">on order above Rs 1500</div></div><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-size: 12; color: #000000;">Offer Code</div><div style="font-weight: 700; font-size: 17px; color: #000000;">XIR25</div></div></div><div style="display: flex; justify-content: center; align-items: center; margin-top: 15px;"><div style="font-size: 12px; padding: 10px 35px; background-color: #ffffff; color: #000000; border: 1px solid #000000; border-radius: 20px; width: auto;">REDEEM</div></div><div style="text-align: center; font-size: 11px;color: #000000; margin-top: 5px">Click 'Redeem' to auto-apply offer code at checkout!</div>`
    },
    {
        id: 3,
        html: `<div style="display: flex; flex-direction: column; margin: 10px 0px; gap: 15px; align-items: stretch; border-radius: 15px; padding: 15px;background-color: rgb(25, 151, 161);"><div style="display: flex; justify-content: space-between; gap: 15px;"><div style="font-size: 16px; color: white;">Discount on hotel rooms for two nights!</div><div style="font-size: 27.5px; font-weight: 600; color: white; padding-right: 10px">100%</div></div><div style="color: white; font-size: 12px;">Offer code: MGF09</div><div style="display: flex; justify-content: center; align-items: center;"><div style="font-size: 10px; color: rgb(255, 255, 255); border-radius: 10px; width: auto; max-width: 100%; padding: 10px 20px; background-color: rgb(227, 11, 92);">REDEEM</div></div><div style="text-align: center; font-size: 11px;color: #ffff;">Click 'Redeem' to auto-apply offer code at checkout!</div></div>`
    },
    {
        id: 4,
        html: `<div style="display: flex; flex-direction: column; align-items: stretch; margin: 10px 0px; background-color: #ffffff"><div style="padding: 7.5px; border-bottom: 1px dashed black;"><div style="text-align: center; font-weight: 700; font-size: 12.5px; color: #000000">Get a FLAT 15% OFF on a spend of Rs. 1,499 and above!</div></div><div style="display: flex; flex-direction: column; align-items: stretch; padding: 7.5px 15px; gap: 15px;"><div style="display: flex; gap: 10px; justify-content: space-between; align-items: center;"><div style="display: flex; align-items: center; gap: 10px;"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="#000000" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><link xmlns="" type="text/css" id="dark-mode" rel="stylesheet" href=""/><style xmlns="" type="text/css" id="dark-mode-custom-style"/><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg><div style="color: #000000">SUPERLX15</div></div><div style="font-size: 11px; background-color: rgb(28, 58, 86); color: #ffffff; border-radius: 6px; width: auto; max-width: 100%; padding: 10px">REDEEM</div></div><div style="text-align: center; font-size: 11px;color: #000000"><em>Click 'Redeem' to auto-apply offer code at checkout!</em></div></div></div>`
    },
    {
        id: 5,
        html: `<div style="border: 2px dashed #000000; padding: 15px; display: flex; flex-direction: column; gap: 15px; margin: 10px 0px; background-color: #ffffff;"><div style="text-align: center; font-weight: 700; font-size: 13px; color: #000000;">Get a FLAT 15% OFF on a spend of Rs. 1,499 and above!​</div><div style="text-align: center; font-size: 12px; color: #000000;">Offer Code: SUPXL15</div><div style="display: flex; justify-content: center; align-items: center;"><div style="font-size: 12px; padding: 10px 35px; background-color: #000000; color: #ffffff; border-radius: 8px; width: auto;">Redeem</div></div><div style="text-align: center; font-size: 11px;color: #00000;">Click 'Redeem' to auto-apply offer code at checkout!</div></div>`
    },
    {
        id: 6,
        html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 15px; padding: 15px; margin: 10px 0px; background-color: #ffffff;"><div style="text-align: center; font-size: 13px; color: #000000;">You have Unlock an ​​exclusive invite!</div><div style="display: flex; align-items: center; width: 100%;"><div style="width: 50%; font-size: 20px; text-align: center; color: #000000;">Offer10</div><div style="width: 50%; text-align: center; font-size: 20px; font-weight: 600; color: #000000;">10% OFF</div></div><div style=" text-align: center; display: flex; justify-content: center; align-items: center;"><div style="font-size: 15px; background-color: #000000; width: auto; padding: 10px 20px; border-radius: 5px; color: #ffffff;">Redeem</div></div><div style="text-align: center; font-size: 11px;color: #00000;">Click 'Redeem' to auto-apply offer code at checkout!</div></div></div>`
    },
    {
        id: 7,
        html: `<div style="padding: 15px; background-color: #5eb160; border-radius: 10px; display: flex; flex-direction: column; gap: 10px; margin: 10px 0px;"><div style="display: flex; justify-content: space-between; align-items: start; gap: 15px;"><div style="color: #ffffff; font-size: 16px;">40% off our premium facial and deluxe pedicure!</div><div style="font-size: 35px; color: #ffffff; font-weight: 700;">20%</div></div><div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;"><div style="color: #ffffff; font-size: 12.5px;">​Offer code: MGF09</div><div style="font-size: 15px; background-color: #ffffff; font-weight: 700; width: auto; color: #5eb160; padding: 7.5px 20px; border-radius: 5px;">Redeem</div></div><div style="text-align: left; font-size: 12px; color: #ffff;">Click 'Redeem' to auto-apply offer code at checkout!</div></div>`
    },
    {
        id: 8,
        html: `<div><div style="display: flex; border-radius: 500px; background-color: #1997a1; margin: 10px 0px;"><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-weight: 700; font-size: 20px; color: #ffffff">25% off</div><div style="font-size: 12px; color: #ffffff;">on order above Rs 1500</div></div><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-size: 12px; color: #ffffff;">Offer Code</div><div style="font-weight: 700; font-size: 15px; color: #ffffff;">XIR25</div></div></div><div style="display: flex; justify-content: center; align-items: center; margin-top: 15px;"><div style="font-size: 12px; padding: 10px 35px; background-color: #1997a1; color: #ffffff; border-radius: 20px; width: auto;">REDEEM</div></div><div style="text-align: center; font-size: 12px; color: #00000;margin-top: 5px">Click 'Redeem' to auto-apply offer code at checkout!</div></div>`
    },
    {
        id: 9,
        html: `<div style="padding: 10px; display: flex; flex-direction: column; gap: 15px; margin: 10px 0px;"><div style="padding: 20px; display: flex; flex-direction: column; background-color: rgb(255, 117, 24); gap: 10px;  border-radius: 500px;"><div style="font-size: 15px; font-weight: 700; color: #ffffff;">Buy one desert and get the second free</div><div style="font-size: 12px; color: #ffffff;">Offer code: MGF09</div></div><div style="display: flex; justify-content: center; align-items: center;"><div style="background-image: linear-gradient(90deg, rgb(255, 117, 24), rgb(227, 11, 92)); border-radius: 25px; max-width: 100%; padding: 10px 25px; color: #ffffff; font-size: 12.5px;">REDEEM</div></div><div style="text-align: center; font-size: 12px; color: #ff7518;">Click 'Redeem' to auto-apply offer code at checkout!</div></div>`
    },
    {
        id: 10,
        html: `<div style="padding: 20px 35px; background-color: rgb(255, 117, 24); display: flex; flex-direction: column; gap: 15px; border-radius: 500px; margin: 10px 0px;"><div style="font-size: 15px; color: #ffffff;">Buy one desert and get the second free</div><div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;"><div style="font-size: 12px; color: #ffffff;">Offer code: <span style="font-weight: 600;">MGF09</span></div><div style="display: flex; justify-content: center; align-items: center;"><div style="background-image: linear-gradient(90deg, rgb(255, 117, 24), rgb(227, 11, 92)); border-radius: 25px; max-width: 100%; padding: 10px 25px; color: #ffffff; font-size: 12.5px;">REDEEM</div></div></div><div style="text-align: right; font-size: 12px; color: #ffff;">Click 'Redeem' to auto-apply offer code at checkout!</div></div>`
    }
]

const ReturnOfferHtml = ({ theme, details, offerProperties, color, type = null, updatePresent, setOffersModal, offersModal, finalObj }) => {
    const { userPermission } = useContext(PermissionProvider)

    const colors = offerProperties?.colors ? offerProperties?.colors : color

    // const color1 = colors?.color_1 || "#ffffff"
    // const color2 = colors?.color_2 || "rgb(255, 103, 28)"
    // const color3 = colors?.color_3
    const Code = details?.Code ? details?.Code : "XIR25"
    const Summary = details?.Summary ? details?.Summary : "Summary"
    const Value = details?.Value ? details?.Value : 100

    const description = type === "render" ? "true" : offerProperties?.showSections?.includes("description") ? "" : "hideOfferSection"
    const showSections = type === "render" ? "true" : offerProperties?.showSections?.includes("validity") ? "" : "hideOfferSection"


    const offerStyles = [
        {
            id: 1,
            html: `<div style="margin: 10px 0px;"><div style="flex-direction: column; justify-content: center; align-items: center; position: relative;"><div style="width: 100%; min-height: 100%; justify-content: center; filter: drop-shadow(rgba(0, 0, 0, 0.2) 0px 0px 10px); border-radius: 10px; display: flex; position: relative;  background-color: ${colors?.color_1 || "#ffffff"};"><div class="flex-grow-1 d-flex flex-column justify-content-between" style="padding: 15px;"><div><div style="display: flex; flex-direction: column; align-items: start; justify-content: start; "><div style="font-weight: bolder; font-size: 0.9rem; color: ${colors?.color_2 || "#5eb160"};">${Code}</div><span class="${description}" style=" font-size: 0.75rem; color: ${colors?.color_3 || "rgb(0, 0, 0)"}; overflow-wrap: normal; white-space: pre-wrap;">${Summary}</span></div></div><div><div style="padding-top: 0.5rem;"><span class="${showSections}" style=" font-weight: 500; font-size: 0.65rem; color: ${colors?.color_3 || "rgb(0, 0, 0)"}">Valid until: ${details?.ValidityPeriod?.end ? moment(details?.ValidityPeriod?.end).format("YYYY-MM-DD HH:mm:ss") : "Perpetual"}</span><div style="text-align: right; font-size: 7px; color: #00000;">Click 'Redeem' to auto-apply offer code at checkout!</div></div></div></div><div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 0px 15px 15px;align-items: flex-end"><div style="position: relative; display: flex; flex-direction: column; justify-content: space-between; align-items: center; background-color: ${colors?.color_2 || "#5eb160"}; padding: 1rem 0.25rem; border-radius: 0px 0px 5px 5px; min-width: 80px; max-width: 100px"><div style="font-size: 1.6rem; font-weight: 750; font-family: Montserrat; color: ${colors?.color_1 || "#ffffff"};">${details?.Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `${userPermission?.currencySymbol}${Math.ceil(Value)}`}</div></div><div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: center;"><button type="button" style="color: ${colors?.color_2 || "#5eb160"}; font-size: 0.65rem; font-weight: 700; cursor: pointer; border: 0.75px solid ${colors?.color_2 || "#5eb160"}; border-radius: 7px; padding: 0.5rem 1.5rem; background-color: transparent; "><span>Redeem</span></button></div></div></div></div></div>`
        },
        {
            id: 2,
            html: `<div style="display: flex; border-radius: 500px; border: 1px solid ${colors?.color_3 || "rgb(0, 0, 0)"}; margin: 10px 0px; background-color: ${colors?.color_1 || "#ffffff"};"><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px; border-right: 1px solid ${colors?.color_3 || "rgb(0, 0, 0)"};"><div style="font-weight: 700; font-size: 10.5px; color: ${colors?.color_2 || "#000000"};">${details?.Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `${userPermission?.currencySymbol}${Math.ceil(Value)}`} off</div><div class="${description}" style="font-size: 14px; color: ${colors?.color_2 || "#000000"};">${Summary}</div></div><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-size: 14px; color: ${colors?.color_2 || "#000000"};">Offer Code</div><div style="font-weight: 700; font-size: 10px; color: ${colors?.color_2 || "#000000"};">${Code}</div></div></div><div style="display: flex; justify-content: center; align-items: center; margin-top: 15px;"><div style="font-size: 10px; padding: 10px 35px; background-color: ${colors?.color_1 || "#ffffff"}; color: ${colors?.color_2 || "rgb(0, 0, 0)"}; border: 1px solid ${colors?.color_3 || "#000000"}; border-radius: 20px; width: auto;">REDEEM</div></div><div style="text-align: center; font-size: 10px; color: #000000; margin-top: 5px">Click 'Redeem' to auto-apply offer code at checkout!</div>`
        },
        {
            id: 3,
            html: `<div style="display: flex; flex-direction: column; margin: 10px 0px; gap: 15px; align-items: stretch; border-radius: 15px; padding: 15px;background-color: ${colors?.color_1 || "rgb(25, 151, 161)"};"><div class="${description}" style="display: flex; justify-content: space-between; gap: 15px;"><div style="font-size: 12.5px; color: ${colors?.color_3 || "#ffffff"};">${Summary}</div><div style="font-size: 20px; font-weight: 600; color: ${colors?.color_3 || "#ffffff"};">${details?.Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `${userPermission?.currencySymbol}${Math.ceil(Value)}`}</div></div><div style="color: ${colors?.color_3 || "#ffffff"}; font-size: 12px;">Offer code: ${Code}</div><div style="display: flex; justify-content: center; align-items: center;"><div style="font-size: 10px; color: ${colors?.color_3 || "#ffffff"}; border-radius: 25px; width: auto; max-width: 100%; padding: 10px 25px; background-color: ${colors?.color_2 || "rgb(227, 11, 92)"};">REDEEM</div></div></div>`
        },
        {
            id: 4,
            html: `<div style="display: flex; flex-direction: column; align-items: stretch; margin: 10px 0px; background-color: ${colors?.color_1 || "#ffffff"};"><div style="padding: 7.5px; border-bottom: 1px dashed black;"><div style="text-align: center; font-weight: 700; font-size: 12.5px; color: ${colors?.color_3 || "#000000"}" class="${description}">${Summary}</div></div><div style="display: flex; flex-direction: column; align-items: stretch; padding: 7.5px 15px; gap: 15px;"><div style="display: flex; gap: 10px; justify-content: space-between; align-items: center;"><div style="display: flex; align-items: center; gap: 10px;"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="${colors?.color_3 || "#000000"}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><link xmlns="" type="text/css" id="dark-mode" rel="stylesheet" href=""/><style xmlns="" type="text/css" id="dark-mode-custom-style"/><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg><div style="color: ${colors?.color_3 || "#000000"}; font-size: 11px;">${Code}</div></div><div style="font-size: 11px; background-color: ${colors?.color_2 || "rgb(28, 58, 86)"}; color: ${colors?.color_1 || "#ffffff"}; border-radius: 6px; width: auto; max-width: 100%; padding: 10px">REDEEM</div></div><div style="text-align: center; font-size: 11px;color: ${colors?.color_3 || "#000000"}"><em>Redeem to auto-apply code at checkout!</em></div></div></div>`
        },
        {
            id: 5,
            html: `<div style="border: 2px dashed ${colors?.color_3 || "#000000"}; padding: 15px; display: flex; flex-direction: column; gap: 15px; margin: 10px 0px; background-color: ${colors?.color_1 || "#ffffff"};"><div style="text-align: center; font-weight: 700; font-size: 13px; color: ${colors?.color_3 || "#000000"};" class="${description}">${Summary}​</div><div style="text-align: center; font-size: 12px; color: ${colors?.color_3 || "#000000"};">Offer Code: ${Code}</div><div style="display: flex; justify-content: center; align-items: center;"><div style="font-size: 12px; padding: 10px 35px; background-color: ${colors?.color_2 || "#000000"}; color: ${colors?.color_1 || "#ffffff"}; border-radius: 8px; width: auto;">Redeem</div></div></div>`
        },
        {
            id: 6,
            html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 15px; padding: 15px; margin: 10px 0px; background-color: ${colors?.color_1 || "#ffffff"};"><div style="text-align: center; font-size: 16px; color: ${colors?.color_3 || "#000000"};" class="${description}">${Summary}</div><div style="text-align: center; font-size: 25px; font-weight: 600; color: ${colors?.color_3 || "#000000"};">${details?.Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `${userPermission?.currencySymbol}${Math.ceil(Value)}`} OFF</div><div style="display: flex; align-items: center; width: 100%;"><div style="width: 50%; text-align: center; color: ${colors?.color_3 || "#000000"};"><u>${Code}</u></div><div style="width: 50%; text-align: center; display: flex; justify-content: center; align-items: center;"><div style="font-size: 15px; background-color: ${colors?.color_2 || "#000000"}; width: auto; padding: 10px 20px; border-radius: 5px; color: ${colors?.color_1 || "#ffffff"};">Redeem</div></div></div></div>`
        },
        {
            id: 7,
            html: `<div style="padding: 15px; background-color: ${colors?.color_1 || "#fdb173"}; border-radius: 10px; display: flex; flex-direction: column; gap: 10px; margin: 10px 0px;"><div style="display: flex; justify-content: space-between; align-items: start; gap: 15px;"><div style="color: ${colors?.color_3 || "#ffffff"}; font-size: 16px;" class="${description}">${Summary}</div><div style="font-size: 35px; color: ${colors?.color_3 || "#ffffff"}; font-weight: 700;">${details?.Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `${userPermission?.currencySymbol}${Math.ceil(Value)}`}</div></div><div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;"><div style="color: ${colors?.color_3 || "#ffffff"}; font-size: 12.5px;">​offer code: ${Code}</div><div style="font-size: 15px; background-color: ${colors?.color_2 || "#ffffff"}; font-weight: 700; width: auto; color: ${colors?.color_1 || "#fdb173"}; padding: 7.5px 20px; border-radius: 5px;">Redeem</div></div></div>`
        },
        {
            id: 8,
            html: `<div style="display: flex; border-radius: 500px; background-color: ${colors?.color_1 || "#377f71"}; box-shadow: ${colors?.color_2 || "rgb(40, 40, 40)"} 0px 0px 10px 2.5px inset; margin: 10px 0px;"><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-weight: 700; font-size: 20px; color: ${colors?.color_3 || "#ffffff"};">${details?.Type === "PERCENTAGE" ? `${Math.ceil(Value)}%` : `${userPermission?.currencySymbol}${Math.ceil(Value)}`} off</div><div style="font-size: 10px; color: ${colors?.color_3 || "#ffffff"};" class="${description}">${Summary}</div></div><div style="width: 50%; padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px;"><div style="font-size: 10px; color: ${colors?.color_3 || "#ffffff"};">Offer Code</div><div style="font-weight: 700; font-size: 15px; color: ${colors?.color_3 || "#ffffff"};">${Code}</div></div></div><div style="display: flex; justify-content: center; align-items: center; margin-top: 15px;"><div style="font-size: 12px; padding: 10px 35px; background-color: ${colors?.color_1 || "#377f71"}; box-shadow: ${colors?.color_2 || "rgb(40, 40, 40)"} 0px 0px 10px 2.5px inset; color: ${colors?.color_3 || "#ffffff"}; border: 1px solid #000000; border-radius: 20px; width: auto;">REDEEM</div></div>`
        },
        {
            id: 9,
            html: `<div style="padding: 10px; display: flex; flex-direction: column; gap: 15px; margin: 10px 0px;"><div style="padding: 15px; display: flex; flex-direction: column; background-color: ${colors?.color_1 || "rgb(255, 117, 24)"}; gap: 10px;  border-radius: 500px;"><div style="font-size: 15px; font-weight: 700; color: ${colors?.color_3 || "#ffffff"};" class="${description}">${Summary}</div><div style="font-size: 10px; color: ${colors?.color_3 || "#ffffff"};">Offer code: ${Code}</div></div><div style="display: flex; justify-content: center; align-items: center;"><div style="background-image: linear-gradient(90deg, ${colors?.color_1 || "rgb(255, 117, 24)"}, ${colors?.color_2 || "rgb(227, 11, 92)"}); border-radius: 25px; max-width: 100%; padding: 10px 25px; color: ${colors?.color_3 || "#ffffff"}; font-size: 12.5px;">REDEEM</div></div></div>`
        },
        {
            id: 10,
            html: `<div style="padding: 15px 35px; background-color: ${colors?.color_1 || "rgb(255, 117, 24)"}; display: flex; flex-direction: column; gap: 15px; border-radius: 500px; margin: 10px 0px;"><div style="font-size: 15px; color: ${colors?.color_3 || "#ffffff"};" class="${description}">${Summary}</div><div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;"><div style="font-size: 10px; color: ${colors?.color_3 || "#ffffff"};">Offer code: <span style="font-weight: 600;">${Code}</span></div><div style="display: flex; justify-content: center; align-items: center;"><div style="background-image: linear-gradient(90deg, ${colors?.color_1 || "rgb(255, 117, 24)"}, ${colors?.color_2 || "rgb(227, 11, 92)"}); border-radius: 25px; max-width: 100%; padding: 10px 25px; color: ${colors?.color_3 || "#ffffff"}; font-size: 12.5px;">REDEEM</div></div></div></div>`
        }
    ]

    return (

        type === "render" ? (
            <>
                {
                    offerStyles?.map((ele, key) => {
                        return <Col key={key} md={6}>
                            <div onClick={() => {
                                updatePresent({ ...finalObj, offerTheme: ele?.id })
                                // setOfferTheme(ele?.id)
                                setOffersModal(!offersModal)
                            }} className={`p-2 h-100 d-flex justify-content-center align-items-center rounded cursor-pointer`} style={{ outline: `${Number(finalObj?.offerTheme) === Number(ele.id) ? "1px" : "0px"} solid black` }}>
                                <div className="flex-grow-1" dangerouslySetInnerHTML={{ __html: ele?.html }} />
                            </div>
                        </Col>
                    })
                }
            </>
        ) : (
            <>
                <div dangerouslySetInnerHTML={{ __html: offerStyles.filter($ => $.id === theme)[0]?.html }} />
            </>
        )


    )
}

export default ReturnOfferHtml