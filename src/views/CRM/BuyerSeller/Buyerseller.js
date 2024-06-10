import React, { useState, useEffect } from 'react'
import { Card, CardBody } from "reactstrap"
import Buyer from './Buyer'
import AddNav from './BuyerNav'
import Seller from './Seller'
import toast from "react-hot-toast"
import { useNavigate, useParams } from 'react-router-dom'
import { crmURL, getReq, postReq } from '../../../assets/auth/jwtService'
import { validForm } from '../../Validator'

const Buyerseller = () => {
  const navigate = useNavigate()
  const parmas = new URLSearchParams(location.search)
  const { id } = useParams()
  const isEdit = parmas.get("type") === "edit"
  const isCustomer = parmas.get("type") === "customer"

  const mainFormvalueToCheck = [
    {
      name: 'xircls_customer_id',
      message: 'Select Customer Name',
      type: 'string',
      id: 'xircls_customer_id'
    },
    {
      name: 'product_name_id',
      message: 'Select Product Name',
      type: 'string',
      id: 'product_name_id'
    }
  ]

  // const buyerCheck = [
  //   {
  //     name: 'buyer_customer_name',
  //     message: 'Select Customer Name',
  //     type: 'string',
  //     id: 'xircls_customer_id'
  //   }
  // ]


  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    seller_dealer: "",
    buyer_dealer: "",
    insurance_no: ""
  })
  const [country, setCountry] = useState([])

  const handleChange = (options, actionMeta, check = false) => {
    if (check) {
      const option_list = options.map((cur) => {
        return cur.value
      })
      setFormData({ ...formData, [actionMeta.name]: option_list })
    } else {
      setFormData({ ...formData, [actionMeta.name]: options.value })
    }

  }

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const checkVaildation = () => {
    let checkForm = true
    if (currentStep === 1) {
      checkForm = validForm(mainFormvalueToCheck, formData)
    }

    // if (currentStep === 2) {
    //   checkForm = validForm(buyerCheck, formData)
    // }

    return checkForm
  }


  const postData = (btn) => {
    const check = checkVaildation()
    if (check) {
      const form_data = new FormData()
      Object.entries(formData).map(([key, value]) => {
        if (key === "xircls_customer_id") {
          form_data.append("sellertemp", value)
        }
      console.log(`${key} ==== ${value}`)
        form_data.append(key, value)
      })
      form_data.append("press_btn", btn)
      if (isEdit) {
        form_data.append("transaction_id", id)
      }
      if (isEdit) {
        postReq("edit_automotivetransaction", form_data, crmURL)
        .then((resp) => {
          console.log("Response:", resp)
          toast.success('Buyer Seller saved successfully')
          navigate('/merchant/customers/usedcar/')
        }).catch((error) => {
          console.error("Error:", error)
          if (error.message === 'Customer already exists') {
            toast.error('Customer already exists')
          } else {
            toast.error('Failed to save customer')
          }
        })
      } else {
        postReq("automotivetransaction", form_data, crmURL)
        .then((resp) => {
          console.log("Response:", resp)
          toast.success('Buyer Seller saved successfully')
          if (btn === "SAVE & CLOSE") {
            navigate(-1)
          }
        }).catch((error) => {
          console.error("Error:", error)
          if (error.message === 'Customer already exists') {
            toast.error('Customer already exists')
          } else {
            toast.error('Failed to save customer')
          }
        })
      }
        
    }
  }

  const getData = () => {
    // const form_data = new FormData()
    if (parmas.get("type") === "edit") {
      // form_data.append("transaction_id", id)
      // form_data.append("edit_type", "is_finance")
    }
    // postReq("automotivetransaction", form_data, crmURL)
    getReq('automotivetransaction', `?transaction_id=${id}`, crmURL)
      .then((resp) => {
        console.log(resp)
        const data = resp?.data
        console.log("================================================================================")
        console.log(data, "fdata")
        const updateData = {
          transaction_id: id,
          buyer_id: data?.transaction_log?.[0]?.buyer?.xircls_customer_id,
          seller_id: data?.transaction_log?.[0]?.seller?.xircls_customer_id,
          seller_dealer: data?.transaction_log?.[0]?.seller_dealer,
          buyer_dealer: data?.transaction_log?.[0]?.buyer_dealer,
          product_name_id: data?.transaction_log?.[0]?.vehicle?.id,
          product_name_label: data?.transaction_log?.[0]?.vehicle?.car_model,
          xircls_customer_id: data?.transaction_log?.[0]?.seller?.xircls_customer_id,
          buyer_xircls_customer_id: data?.transaction_log?.[0]?.buyer?.xircls_customer_id,
          insurance_no: data?.transaction_log?.[0]?.vehicle?.insurance_no,
          buyer_email: data?.transaction_log?.[0]?.buyer?.email,
          seller_email: data?.transaction_log?.[0]?.seller?.email,
          buyer_phone_no:data?.transaction_log?.[0]?.buyer?.phone_no,
          is_insurance: data?.transaction_log?.[0]?.is_insurance,
          seller_phone_no:data?.transaction_log?.[0]?.seller?.phone_no
        }

        setFormData(updateData)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  let PageTitle = 'Add Finance'


  useEffect(() => {

    if (isEdit) {
      getData()
      PageTitle = 'Edit Page'
    }
  }, [])

  const handleNext = () => {
    const check = checkVaildation()

    if (check) {
      setCurrentStep(prevStep => prevStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prevStep => prevStep - 1)
  }

  const NavCurrentStep = (step) => {
    const check = checkVaildation()

    if (check) {
      setCurrentStep(step)
    }
  }

  const handleSubmitSection = (btn) => {
    postData(btn)
  }

  const allData = {
    formData,
    currentStep,
    handleInputChange,
    handleNext,
    handleBack,
    handleSubmitSection,
    setFormData,
    handleChange,
    country,
    isEdit,
    isCustomer
  }


  const getCountries = () => {
    getReq("countries")
      .then((resp) => {
        console.log(resp)
        setCountry(
          resp.data.data.countries.map((curElem) => {
            return { value: curElem.name, label: `${curElem.name}` }
          })
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getCountries()
  }, [])


  return (
    <>
      <div className="customer-profile">
        <Card>
          <CardBody>
            <h3 className="mb-0">{isEdit ? "Edit Buy/ Sell Vehicle" : "Add Buy/ Sell Vehicle"}</h3>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <AddNav currentStep={currentStep} NavCurrentStep={NavCurrentStep}/>
            <form >
              {currentStep === 1 && (
                <Seller allData={allData} />
              )}
              {currentStep === 2 && (
                <Buyer allData={allData} />
              )}
              {

                console.log(handleSubmitSection, 'handleSubmitSection')
              }

            </form>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default Buyerseller