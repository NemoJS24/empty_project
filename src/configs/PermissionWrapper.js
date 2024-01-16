import React, { useEffect, useState } from 'react'
import { PermissionProvider } from '../Helper/Context'
import { getToken } from '../assets/auth/auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { Routes } from '../router/routes'
import toast from 'react-hot-toast'
// import { getReq } from '../assets/auth/jwtService'

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
        multiUser: "",
        permissionList: ["crm_view_customer"]
    }
    const [userPermission, setUserPermission] = useState(localStorage.getItem('userPermission') ? JSON.parse(localStorage.getItem('userPermission')) : defaultData)
    const location = useLocation()
    const navigate = useNavigate()

    // let callbackChild = children
    //  console.log(callbackChild)
    // useEffect(() => {
    //     console.log("calling")
    //     callbackChild = children
    // }, [userPermission.apiKey, reloader])

    useEffect(() => {
        // console.log(userPermission, "changed")
        if (getToken()) {
            localStorage.setItem('userPermission', JSON.stringify(userPermission))
        }

    }, [userPermission])

    const checkUserPermission = async () => {
        const token = await getToken()
        if (token) {
            console.log("Not Mounted", "Route Permission")
            const currentRoute = Routes?.filter((curRoute) => {
                return curRoute?.path.toLowerCase() === location?.pathname.toLowerCase()
            })
            console.log(currentRoute[0]?.app, "Route Permission")

            if (currentRoute[0]?.app) {
                if (userPermission?.installedApps?.includes(currentRoute[0]?.app)) {
                    // console.log("INSTALLED", "Route Permission")
                    setUserPermission({...userPermission, appName: currentRoute[0]?.app})

                } else {
                    // console.log("NOT INSTALLED", "Route Permission")
                    toast.error("You don't have access of that App")
                    navigate("/merchant/apps/")
                }

            }

            // if (currentRoute[0]?.route_type) {
            //     if (!userPermission?.permissionList?.includes(currentRoute[0]?.route_type)) {
            //         navigate(-1)
            //         toast.error("Permission denied")
            //     }

            // }
        }
    }

    useEffect(() => {
        // let isMounted = true
        
        checkUserPermission()
        const params = new URLSearchParams(location.search)
        if (params.get('aft_no')) {
            localStorage.setItem('aft_no', params.get('aft_no'))
        }
    }, [location])

    return (
        <PermissionProvider.Provider value={{ userPermission, setUserPermission}}>
            {children}
        </PermissionProvider.Provider>
    )
}

export default PermissionWrapper