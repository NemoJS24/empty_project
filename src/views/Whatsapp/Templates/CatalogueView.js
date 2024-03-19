/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row, Modal,
    ModalHeader,
    ModalBody,
    ModalFooter, 
    Button} from 'reactstrap'
import wp_back from './imgs/wp_back.png'
import { Link, useParams } from 'react-router-dom'
import { getReq, postReq } from '../../../assets/auth/jwtService'
import { CheckCircle, X } from 'react-feather'
import toast from 'react-hot-toast'
import FrontBaseLoader from '../../Components/Loader/Loader'
import SendContactTable from '../Tables/SendContactTable'

export default function CatalogueView() {
    const { id } = useParams()
    const [useLoader, setLoader] = useState(false)
    const [useProducts, setProducts] = useState([])
   const [useBulkModalScreen, setBulkModalScreen] = useState(1)
   const [useSelectedProducts, setSelectedProducts] = useState([])
   const [useSelectedGroups, setSelectedGroups] = useState([])
   const [modal2, setModal2] = useState(false)
   const [useGroupList, setGroupList] = useState([])
   const [useSelectedContacts, setSelectedContacts] = useState([])
   const toggle2 = () => { setModal2(!modal2); setBulkModalScreen(1); setSelectedGroups([]) }

    useEffect(() => {
        setLoader(true)
        getReq("catalog_details", `?catalog_id=${id}`)
            .then((resp) => {
                console.log("resp :", resp.data.products)
                setProducts(resp.data.products)
                const retailerIds = resp.data.products.map((elm) => elm.retailer_id)
                setSelectedProducts(retailerIds)
            }).catch((err) => {
                console.log(err)
            }).finally(() => { setLoader(false) })
            const form_data = new FormData()
            form_data.append("page", 1)
            form_data.append("size", 1000)
            form_data.append("searchValue", '')
            postReq("group_base_details", form_data)
               .then((resp) => {
                  const list = []
                  resp.data.group_details_obj.map((elm) => list.push({ value: elm.group_id, label: elm.group_name }))
                  setGroupList(list)
               }).catch((err) => {
                  console.log(err)
               })
    }, [])
    const tableDataFun = (useSelectedGroups) => {
        const form_data = new FormData()
        form_data.append("group_contact", useSelectedGroups)
        postReq(`get_group_contact`, form_data)
           .then(res => {
              setSelectedContacts(() => res.data.contact_grp.map((elm) => parseInt(elm.id)))
           })
           .catch(error => {
              console.error('Error:', error)
           })
     }
    const sendTemplate = () => {
        // console.log("USE PTODUCTS", useSelectedProducts)
        if (useSelectedProducts.length === 0) {
            return toast.error("Atleast select one product!")
        }
        const formData = new FormData()
        const newPro = useSelectedProducts.map((elm) => {
            return { product_retailer_id: elm }
        })
        // console.log(useSelectedContacts.toString())
        formData.append("contact_group_list", useSelectedContacts.toString())
        formData.append("product_items", JSON.stringify(newPro))
        formData.append("catalog_id", id)
        setLoader(true)
        postReq(`send_catalog`, formData)
          .then(res => {
            // console.log('res:', res)
            if (res.data.messaging_product) {
              toast.success("Message has been sent!")
              setBulkModalScreen(1)
              setModal2(false)
            } else {
              toast.error("Something went wrong")
            }
          })
          .catch(error => {
            console.error('Error:', error)
            toast.error("Server Error!")
          }).finally(() => { setLoader(false) })
    }

    const uptSelect = (id, action) => {
        let newSelect = useSelectedProducts
        if (action === "DEL") {
            newSelect = newSelect.filter((elm) => elm !== id)
        } 
        if (action === "ADD") {
            // newSelect = newSelect.push(id)
            newSelect = [...newSelect, id]
        } 
       setSelectedProducts(newSelect)
    }

    return (
        <>
          {
        useLoader && <FrontBaseLoader />
      }
            <Card className=''>

                <CardBody className='d-flex justify-content-between align-items-center '>
                    <div>
                    <h4 className='m-0'>Select Templates </h4>
                    <h6 className='m-0'>Total Selected : {useSelectedProducts.length}</h6>

                    </div>

                    <button className='btn btn-primary ' onClick={toggle2}>Send Catalogue</button>

                </CardBody>
            </Card>
            <Card className='mb-5'>
                <CardBody className='mb-5'>

                    <Row>

                        {
                            useProducts.map((data, index) => {
                                return (
                                    <Col xxl="4" md="4" key={index} >
                                        <Card className='position-relative ' style={{ boxShadow: "0px 6px 17px rgba(0,0,0,0.1)", maxWidth:"500px" }}>
                                            <CardBody className="  p- rounded-2  " style={{ minHeight: "300px" }} >
                                                <div className='p-1' >

                                                    <div className=''  >
                                                        <img className='rounded-3 img-fluid border-0 rounded w-100 object-fit-cover ' src={data.image_url} alt="" />
                                                    </div>

                                                    <div className='mt-1' >
                                                        <div className='d-flex justify-content-between '>
                                                            <h5>{data.name}</h5>
                                                            <h5>{data.price}</h5>
                                                        </div>
                                                        <small>{data.description.slice(0, 80)}...</small>
                                                        <h6 className='fs-6'>{data.brand}</h6>
                                                    </div>
                                                    {
                                                        useSelectedProducts.includes(data.retailer_id) ?  <button onClick={() => uptSelect(data.retailer_id, "DEL")} className='btn btn-primary btn-sm position-absolute bottom-0 end-0 mb-1 me-1'>Unselect</button> : <button onClick={() => uptSelect(data.retailer_id, "ADD")} className='btn btn-primary btn-sm position-absolute bottom-0 end-0 mb-1 me-1'>Select</button> 
                                                    }
                                                    {
                                                       useSelectedProducts.includes(data.retailer_id) ? <div className=' position-absolute top-0 end-0 mt-1 me-1 '>
                                                        <div className='d-flex  px-1 bg-success text-white rounded-2' style={{ padding: "5px", gap: "5px" }}>
                                                            <CheckCircle size={13} />
                                                            <h6 className='m-0 text-white  font-small-3 ' >Selected</h6>
                                                        </div>
                                                    </div> : <div className=' position-absolute top-0 end-0 mt-1 me-1 '>
                                                            <div className='d-flex  px-1 bg-secondary text-white rounded-2' style={{ padding: "5px", gap: "5px" }}>
                                                                <X size={13} />
                                                                <h6 className='m-0 text-white  font-small-3' >Not Selected</h6>
                                                            </div>
                                                        </div>
                                                        
                                                    }
                                                </div>


                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>

                </CardBody>
            </Card>

             {/* modal for group send msg -------------------------*/}
             <Modal
                  isOpen={modal2}
                  toggle={toggle2}
                  backdrop={'static'}
                  size="lg"
                  style={{ maxWidth: "900px" }}
               >

                  <ModalHeader toggle={toggle2} className='border-bottom'></ModalHeader>
                  <ModalBody className='py-2'>
                     <Row className=' justify-content-center  align-items-start'>
                        {/* send contacts details */}
                        {
                           useLoader && <FrontBaseLoader />
                        }
                        {
                           useBulkModalScreen === 1 &&
                           <div>
                              <h4>Select Groups</h4>
                              <Row className='gy-1 mt-2'>
                                 {
                                    useGroupList.length === 0 && <h4>No Groups Created! <Link to='/merchant/whatsapp/groups/' className='text-decoration-underline ' >Create Group</Link></h4>
                                 }
                                 {/* <h3 className=' border-bottom'>Send to</h3> */}
                                 {
                                    useGroupList.map((elm) => {
                                       // console.log(elm)
                                       if (useSelectedGroups.includes(elm.value)) {
                                          return (
                                             <Col md="4" >
                                                <div className='btn border btn-dark w-100 position-relative p-3 ' onClick={(e) => setSelectedGroups(() => useSelectedGroups.filter((ee) => ee !== elm.value))}>
                                                   <CheckCircle className=' position-absolute  top-0 end-0 mt-1 me-1' />
                                                   <div className=''  >{elm.label}</div>
                                                </div>
                                             </Col>
                                          )
                                       } else {
                                          return (
                                             <Col md="4" >
                                                <div className='btn border w-100 position-relative p-3 ' onClick={(e) => setSelectedGroups([...useSelectedGroups, elm.value])}>
                                                   {/* <CheckCircle className=' position-absolute  top-0 end-0 mt-1 me-1' /> */}
                                                   <div className=''  >{elm.label}</div>
                                                </div>
                                             </Col>
                                          )
                                       }
                                    })
                                 }

                              </Row>
                           </div>
                        }

                        {
                           useBulkModalScreen === 2 && <SendContactTable groupID={useSelectedGroups} />
                        }
                        <div>
                           {/* <SendContactTable groupID={1} /> */}
                        </div>
                     </Row>
                  </ModalBody>
                  <ModalFooter>
                     <div className='btn me-2' onClick={toggle2}>
                        Cancel
                     </div>

                     {useBulkModalScreen === 1 && useGroupList.length !== 0 && useSelectedGroups.length !== 0 && <Button color="primary" onClick={() => { setBulkModalScreen(2); tableDataFun(useSelectedGroups) }}>
                        Next
                     </Button>}
                     {useBulkModalScreen === 2 && <Button color="primary" onClick={() => { sendTemplate() }}>
                        Send
                     </Button>}
                  </ModalFooter>
               </Modal>
        </>
    )
}
