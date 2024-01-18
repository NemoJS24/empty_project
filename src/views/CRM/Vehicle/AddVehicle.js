/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Card, CardBody, Container, Row, Col } from "reactstrap"
import AsyncSelect from 'react-select/async'
import { baseURL, crmURL, getReq } from '@src/assets/auth/jwtService'
import axios from "axios"
import Select from "react-select"
// import { createPortal } from 'react-dom'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useParams, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import VehicleForm from './VehicleForm'
import { postReq } from '../../../assets/auth/jwtService'
import moment from 'moment'


const AddVehicle = () => {

   const urlParams = new URLSearchParams(location.search)
   const isEdit = urlParams.get("type") === "edit"

   // const [formData, setFormData] = useState({
   //    vehicle_type: 'new',
   //    manufacture_date: '2000'
   // })

   const [viewPage, setViewPage] = useState(false)
   const [edit, setEdit] = useState(isEdit)
   console.log(edit, "pppppppp")
   const [editData, setEditData] = useState({
      customer_name: "",
      registration_number: "",
      sales_person: "",
      vehicle_number: "",
      engine_no: "",
      vehicle_type: "",
      brand: "",
      car_model: "",
      variant: "",
      manufacture_date: "",
      delivery_date: "",
      registeration_date: ""

   })

   const { id } = useParams()
   const navigate = useNavigate()
   console.log(editData, "editData")
   let PageTitle = 'Add Vehicle'

   const getUser = () => {
      const form_data = new FormData()
      form_data.append("customer_id", id)
      form_data.append("tab_type", "vehicle_data")
      postReq('get_customer_vehicle', form_data, crmURL)
         .then((res) => {
            console.log(res.data.success, "get_customer_vehicle")
         })
         .catch((error) => {
            console.log(error)
         })
   }

   //----------------------------

   const fetchVehicleData = () => {
      const form_data = new FormData()
      form_data.append("id", "22")
      form_data.append('edit_type', 'is_vehicle')

      postReq('get_customer_vehicle', form_data, crmURL)
         .then((resp) => {
            console.log("get_vehicle:", resp)
            const data = resp?.data?.success[0]
            const updatedData = {
               customer_name: data?.xircls_customer,
               registration_number: data?.registration_number,
               sales_person: data?.sales_person,
               vehicle_number: data?.vehicle_number,
               engine_no: data?.engine_no,
               vehicle_type: data?.vehicle_type,
               brand: data?.brand,
               car_model: data?.car_model,
               variant: data?.variant,
               manufacture_date: moment(data?.registeration_date).format("YYYY"),
               delivery_date: moment(data?.delivery_date).format("DD-MM-YYYY"),
               registeration_date: data?.registeration_date

            }
            setEditData(updatedData)
            console.log("editData", updatedData.delivery_date)
         })
         .catch((error) => {
            console.error("Error:", error)
            toast.error('Failed to fetch Servicing Detail')
         })

   }

   useEffect(() => {
      if (urlParams.get("type") === "edit") {
         fetchVehicleData()
      }
   }, [])


   useEffect(() => {
      // fetchVehicleData()
      if (location.pathname.startsWith('/merchant/customers/edit-vehicle/')) {
         getUser('edit')
         PageTitle = 'Edit Vehicle'
      } else if (location.pathname.startsWith('/merchant/customers/view-vehicle/')) {
         setViewPage(true)
         getUser('edit')
         PageTitle = 'View Vehicle'
      } else {
         getUser()
      }
   }, [])

   const apiCall = (form_data) => {
      form_data.append("press_btn", 'SAVE')
      form_data.append("customer_id", id)
      console.log(form_data, "gg")

      postReq('add_vehicle', form_data, crmURL)
         .then((resp) => {
            console.log("Response:", resp)
            toast.success('Vehicle saved successfully')
         })
         .catch((error) => {
            console.error("Error:", error)
            toast.error('Failed to save Vehicle')
         })
   }

   const startYear = 2000;
   const endYear = 2050;
   const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)
   return (
      <>
         <Container fluid className="px-0 pb-1">
            <Row>
               <Col md={12} className="">
                  <h4 className="mb-0">Vehicle Details</h4>
               </Col>
            </Row>
         </Container>

         <form id='formId'>
            <VehicleForm edit={edit} fetchVehicleData={fetchVehicleData} isView={false} defaultData={editData} apiCall={apiCall} id={"formId"} />
         </form>
      </>
   )
}

export default AddVehicle