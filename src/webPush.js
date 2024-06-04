/* eslint-disable no-mixed-operators */
// index.js

import React, { useEffect } from 'react'

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const App = () => {
    useEffect(() => {
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    const swReg = await navigator.serviceWorker.register('/service-worker.js')
                    console.log('Service Worker is registered', swReg)

                    if ('PushManager' in window) {
                        const subscription = await swReg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array('<Your Public VAPID Key>')
                        })

                        console.log('User is subscribed:', subscription)
                    }
                } catch (error) {
                    console.error('Service Worker Error', error)
                }
            }
        }

        registerServiceWorker()
    }, [])

    const sendNotification = async () => {
        const notificationPayload = {
            title: 'Hello',
            body: 'Web Push Notification'
        }

        try {
            await self.registration.showNotification(notificationPayload.title, {
                body: notificationPayload.body,
                icon: 'images/icon.png',
                badge: 'images/badge.png'
            })
            console.log('Notification sent successfully')
        } catch (error) {
            console.error('Error sending notification', error)
        }
    }

    return (
        <div>
            <h1>Web Push Notification Demo</h1>
            <button onClick={sendNotification}>Send Notification</button>
        </div>
    )
}

export default App
