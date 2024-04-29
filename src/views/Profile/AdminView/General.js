import axios from 'axios'
// import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { PermissionProvider } from '../../../Helper/Context'
import { baseURL, postReq } from '../../../assets/auth/jwtService'
import toast from 'react-hot-toast'

const General = () => {
    const { userPermission, setUserPermission } = useContext(PermissionProvider)
    const [DateFormate, setDateFormate] = useState([])
    const [CurrencyFormate, setCurrencyFormate] = useState([])
    const [selectedDateFormat, setSelectedDateFormat] = useState(Boolean(userPermission?.user_settings?.date_format) ? userPermission?.user_settings?.date_format : "")
    const [selectedNumberFormat, setSelectedNumberFormat] = useState("")

    function convertToCustomFormat(data) {
        return data.map(([value, label]) => ({ value, label }))
    }

    useEffect(() => {
        axios.get(`${baseURL}/utility/api/v1/get_settings_choices/`).then((res) => {
            // setDateFormate(res.data.date_format)
            console.log(res.data)
            setDateFormate(convertToCustomFormat(res.data.date_format))
            setCurrencyFormate(convertToCustomFormat(res.data.currencysystem))
        })
    }, [])

    const handleDateFormatChange = (selectedOption) => {
        setSelectedDateFormat(selectedOption.value)

    }
    const handleNumberFormatChange = (selectedOption) => {
        setSelectedNumberFormat(selectedOption.value)
    }

    const handleSubmit = () => {
        if (selectedDateFormat === "") {
            toast.error("Please select Date Formate")
            return true
        }
        // if (selectedNumberFormat === "") {
        //     toast.error("Please select Number Formate")
        //     return true
        // }
        // console.log(selectedDateFormat)
        // console.log(selectedNumberFormat)
        // const data = { timezone: null, time_format: null, date_format: selectedDateFormat.value, weekendstart: null, currencysystem: selectedNumberFormat.value }
        const formData = new FormData()
        formData.append("timezone", "")
        formData.append("time_format", "")
        formData.append("weekendstart", "")
        formData.append("currencysystem", selectedNumberFormat)
        formData.append("date_format", selectedDateFormat)
        console.log(formData)
        postReq("generalPost", formData).then((res) => {
            // console.log(res)
            if (res.status === 200 || res.status === 201) {
                toast.success("Settings updated successfully")
                setUserPermission({ ...userPermission, user_settings: { ...userPermission?.user_settings, date_format: selectedDateFormat, time_format: selectedNumberFormat } })
            }
        }).catch((error) => {
            toast.error(error?.message)
            setSelectedDateFormat(userPermission?.user_settings?.date_format)
        })

    }
    // const options = [
    //     { value: 'India', label: 'India' },
    //     { value: 'United States', label: 'United States' },
    //     { value: 'South Africa', label: 'South Africa' },
    //     { value: 'United Arab Emirates', label: 'United Arab Emirates' }
    // ]
    return (
        <>
            <div className='row'>
                <div className='col-12'>
                    <div className='card'>
                        <div className='card-body'>
                            {/* <h6 className="text-base font-weight-medium">Country/Region:</h6>
                            <div className="form-group mb-3">
                                <Select
                                    options={options}
                                    id="select-input1"
                                    classNamePrefix="react-select"
                                />
                            </div> */}

                            <h6 className="text-base font-weight-medium">Date Formats:</h6>
                            <div className="form-group mb-3">
                                <Select
                                    value={DateFormate.filter($ => $.value === selectedDateFormat)}
                                    options={DateFormate}
                                    id="select-input1"
                                    classNamePrefix="react-select"
                                    onChange={handleDateFormatChange}
                                />
                            </div>

                            <h6 className="text-base font-weight-medium d-none">Number Formats:</h6>
                            <div className="form-group mb-3 d-none">
                                <Select
                                    options={CurrencyFormate}
                                    id="select-input1"
                                    classNamePrefix="react-select"
                                    onChange={handleNumberFormatChange}
                                />
                            </div>
                            <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default General