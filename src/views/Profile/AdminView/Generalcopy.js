/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { DefaultformatDate, DefaultformatNumber } from '../../Validator'
import axios from 'axios'
import { postReq } from '../../../assets/auth/jwtService'
import toast from 'react-hot-toast'


const General = () => {
    const [DateFormate, setDateFormate] = useState([])
    const [CurrencyFormate, setCurrencyFormate] = useState([])
    const [selectedDateFormat, setSelectedDateFormat] = useState(null)
    const [selectedNumberFormat, setSelectedNumberFormat] = useState(null)


    function convertToCustomFormat(data) {
        return data.map(([format, date]) => ({
            value: format,
            label: date
        }))
    }


    useEffect(() => {
        axios.get('https://api.demo.xircls.in/utility/api/v1/get_settings_choices/').then((res) => {
            // setDateFormate(res.data.date_format)
            console.log(res.data)
            setDateFormate(convertToCustomFormat(res.data.date_format))
            setCurrencyFormate(convertToCustomFormat(res.data.currencysystem))
        })
    }, [])

    const handleDateFormatChange = (selectedOption) => {
        setSelectedDateFormat(selectedOption)

    }
    const handleNumberFormatChange = (selectedOption) => {
        setSelectedNumberFormat(selectedOption)
    }

    // const dateOption = [
    //     { value: 'custome1', label: '5-Aug-1930' },
    //     { value: 'custome2', label: '28 February 1970' },
    //     { value: 'custome3', label: '28 Feb 1970' },
    //     { value: 'short', label: 'Feb 28, 1970' },
    //     { value: 'custome4', label: '05/08/1730' },
    //     { value: 'custome5', label: '05/08/30' },
    //     { value: 'custome6', label: '05/08' },
    //     { value: 'iso', label: '15-12-2023' },
    //     { value: 'iso2', label: '15-12-23' },
    //     { value: 'long', label: 'February 28, 1970' },
    //     { value: 'custome7', label: 'Tuesday 5 August 1930' },
    //     { value: 'custome8', label: 'Tuesday 5, August, 1930' }
    // ]

    const numberOptions = [
        { value: 'en-IN', label: '5,20,000' },
        { value: 'de-DE', label: ' 520.000' },
        { value: 'ja-JP', label: ' 520,000' },
        { value: 'fr-FR', label: '520 000' }
    ]

    const handleSubmit = () => {

        if (!selectedDateFormat) {
            toast.error("Please select Date Formate")
            return true
        }
        if (!selectedNumberFormat) {
            toast.error("Please select Number Formate")
            return true
        }
        // console.log(selectedDateFormat)
        // console.log(selectedNumberFormat)
        // const data = { timezone: null, time_format: null, date_format: selectedDateFormat.value, weekendstart: null, currencysystem: selectedNumberFormat.value }
        const formData = new FormData()
        formData.append("timezone", null)
        formData.append("time_format", selectedNumberFormat.value)
        formData.append("weekendstart", null)
        formData.append("currencysystem", null)
        formData.append("date_format", selectedDateFormat.value)
        console.log(formData)
        postReq("generalPost", formData).then((res) => {
            // console.log(res)
            toast.success(res.data.message)
        })

    }

    return (
        <>
            <div className='row'>
                <div className='col-12'>
                    <div className='card'>
                        <div className='card-body py-2'>

                            <h6 className="text-base font-weight-medium">Date Formats:</h6>
                            <div className="form-group">
                                <Select
                                    options={DateFormate}
                                    id="select-input1"
                                    classNamePrefix="react-select"
                                    onChange={handleDateFormatChange}
                                />
                            </div>

                            <h6 className="text-base font-weight-medium  mt-3">Number Formats:</h6>
                            <div className="form-group">
                                <Select
                                    options={CurrencyFormate}
                                    id="select-input1"
                                    classNamePrefix="react-select"
                                    onChange={handleNumberFormatChange}
                                />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <button className='btn btn-primary' onClick={handleSubmit}> sumbit </button>


        </>
    )
}

export default General