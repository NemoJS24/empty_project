import React, { useEffect, useState } from 'react'
import { PermissionProvider } from '../Helper/Context'
import { getToken } from '../assets/auth/auth'
import { SuperLeadzBaseURL } from '../assets/auth/jwtService'
import { useLocation } from 'react-router-dom'
// import { useLocation } from 'react-router-dom'

const PermissionWrapper = ({children}) => {
    const defaultData = {
        appName: '',
        multipleDomain: [],
        apiKey: '',
        installedApps: [],
        campaign: [],
        isSupport: false,
        isAdmin: false,
        currencySymbol: "₹",
        multi_user_key: "",
        permissionList: [],
        super_user: "",
        is_super_user: true,
        logged_in_user: {},
        currentPlan: {}
    }
    const [userPermission, setUserPermission] = useState(localStorage.getItem('userPermission') ? JSON.parse(localStorage.getItem('userPermission')) : defaultData)
    const location = useLocation()

    useEffect(() => {
        // console.log(userPermission, "changed")
        // console.log("Entered useEffect")
        if (getToken()) {
            // console.log("Entered getToken()", getToken())
            localStorage.setItem('userPermission', JSON.stringify(userPermission))
        }

    }, [userPermission])

    // useEffect(() => {
        // let isMounted = true
        
        // checkUserPermission()
        
    // }, [location])

    const getBillingDetails = () => {
        const form_data = new FormData()
        const campaignData = userPermission?.multipleDomain?.filter((cur) => cur?.api_key === userPermission?.apiKey)
        form_data.append('shop', campaignData[0]?.web_url)
        form_data.append('app', "superleadz")
        form_data.append('type', "ACTIVE")

        fetch(`${SuperLeadzBaseURL}/api/v1/get_active_shop_billing/`, {
            method: "POST",
            body: form_data
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            const activePlan = data?.data?.filter((cur) => cur.is_active === 1)
            setUserPermission({...userPermission, currentPlan: {...userPermission?.currentPlan, plan: activePlan[0]?.plan_id}})
        })
    }

    useEffect(() => {
        getBillingDetails()
        const params = new URLSearchParams(location.search)
        if (params.get('aft_no')) {
            localStorage.setItem('aft_no', params.get('aft_no'))
        }
    }, [])

    return (
        <PermissionProvider.Provider value={{ userPermission, setUserPermission}}>
            {children}
        </PermissionProvider.Provider>
    )
}

export default PermissionWrapper