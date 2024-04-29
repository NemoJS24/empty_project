/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Button, Row, Col, Label, Input } from "reactstrap"
import { Link } from "react-router-dom"
import Modal from 'react-bootstrap/Modal'
import AdvanceServerSide from '../../Components/DataTable/AdvanceServerSide'
import { crmURL, deleteReq, postReq } from '../../../assets/auth/jwtService'
import LeadsSettingNav from './components/LeadsSettingNav'
import { CiAt } from "react-icons/ci"
import { MdDeleteOutline } from "react-icons/md"
import { FiEdit } from "react-icons/fi"
import { TiDeleteOutline } from "react-icons/ti"
import toast from 'react-hot-toast'
import ComTable from '../../Components/DataTable/ComTable'

const LeadsSetting = () => {
   const [addShow, setAddShow] = useState(false)
   const [editShow, setEditShow] = useState(false)
   const [currentStep, setCurrentStep] = useState(1)
   const [tableData, setTableData] = useState([])
   const [filteredData, setFilteredData] = useState([])
   const [searchValue, setSearchValue] = useState('')
   const [isLoading, setIsLoading] = useState(true)
   const [stageForm, setStageForm] = useState({ form: [''], edit: { id: '', text: '' } })

   const maxStage = 6

   const handleAddClose = () => setAddShow(false)
   const handleAddShow = () => setAddShow(true)
   const handleEditClose = () => setEditShow(false)
   const handleEditShow = () => setEditShow(true)
   const NavCurrentStep = (step) => {
      setCurrentStep(step)
   }
   // lead_stage_id
   // stage_name
   const getStage = () => {
      setIsLoading(true)
      const form_data = new FormData()
      postReq('leads_stage_table', form_data)
         .then((res) => {
            setTableData(res.data.data)
            setIsLoading(false)
         })
         .catch((error) => {
            console.log(error)
            setIsLoading(false)
         })
   }

   const deleteStage = (id) => {
      deleteReq('lead_stage_add', `?lead_stage_id=${id}`)
         .then(resp => {
            if (resp.data.data === 'success') {
               getStage()
               toast.success('Stage deleted successfully')
            }
         })
         .catch(err => {
            console.log('error', err)
         })
   }

   const editStage = () => {
      const form_data = new FormData()
      form_data.append('lead_stage_id', stageForm.edit.id)
      form_data.append('stage_name', stageForm.edit.text)
      postReq('lead_stage_add', form_data)
         .then(resp => {
            if (resp.data.data === 'success') {
               getStage()
               toast.success('Stage saved successfully')
               handleEditClose()
            }
         })
         .catch(err => {
            console.log('error', err)
         })
   }

   useEffect(() => {
      getStage()
   }, [])

   const postStage = () => {
      const form_data = new FormData()
      form_data.append('add_stage_arr', stageForm.form)
      postReq('lead_stage_add', form_data)
         .then((resp) => {
            if (resp.data.data === 'success') {
               getStage()
               toast.success('Stage saved successfully')
               handleAddClose()
               setStageForm({ form: [''], edit: { id: '', text: '' } })
            }
         })
         .catch((error) => {
            console.error("Error:", error)
            toast.error('Stage failed to save')
         })
   }

   const addMoreStage = () => {
      setStageForm(prev => {
         if (prev.form.length < maxStage) {
            return {
               ...prev,
               form: [...prev.form, '']
            }
         } else {
            return prev
         }
      })
   }

   const deleteStageForm = (i) => {
      setStageForm(prev => {
         const arr = [...prev.form]
         arr.splice(i, 1)
         return {
            ...prev,
            form: arr
         }
      })
   }

   const handleFilter = e => {
      const { value } = e.target
      let updatedData = []
      setSearchValue(value)

      if (value.length) {
         updatedData = tableData.filter(item => {
            const startsWith =
               item.stage.toLowerCase().startsWith(value.toLowerCase())

            const includes =
               item.stage.toLowerCase().includes(value.toLowerCase())

            if (startsWith) {
               return startsWith
            } else if (!startsWith && includes) {
               return includes
            } else return null
         })
         setFilteredData(updatedData)
         setSearchValue(value)
      }
   }

   const defferContent = <>
      <Col className='d-flex align-items-center justify-content-center' md='4' sm='12'>
         <h4 className='m-0'>Stage Details</h4>
      </Col>
      <Col className='d-flex align-items-center justify-content-end' md='4' sm='12'>
         {/* <Link className='btn btn-primary-main' to={`/merchant/customers/add-insurance/${'df'}?type=customer`}>Add Insurance</Link> */}
         <Input
            className='dataTable-filter form-control ms-1'
            style={{ width: `180px`, height: `2.714rem` }}
            type='text'
            bsSize='sm'
            id='search-input-1'
            placeholder='Search...'
            value={searchValue}
            onChange={handleFilter}
         />
      </Col>
   </>

   const editModal = () => (<Modal show={editShow} onHide={handleEditClose} centered >
      <Modal.Header closeButton>
         <Modal.Title>Edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <div className='d-flex justify-content-start'>
            <Col md='6'>
               <Label htmlFor="company-lead-stage">
                  Lead Stage
               </Label>
               <div className='d-flex align-items-center'>
                  <Input
                     placeholder="Lead Stage"
                     type="text"
                     id={`company-lead-stage-${`index`}`}
                     className="form-control"
                     value={stageForm.edit.text}
                     onChange={e => {
                        let { value } = e.target
                        value = value.replace(',', '')
                        setStageForm(prev => ({
                           ...prev,
                           edit: {
                              ...prev.edit,
                              text: value
                           }
                        }))
                     }}
                  />
               </div>
            </Col>
         </div>
      </Modal.Body>
      <Modal.Footer>
         <Button className='btn btn-primary' onClick={handleEditClose}>
            Cancel
         </Button>
         <Button className='btn btn-primary' onClick={() => editStage()}>
            Save Changes
         </Button>
      </Modal.Footer>
   </Modal>)


   const columns = [
      {
         name: "#",
         maxWidth: "30px",
         selector: (row, index) => (index + 1),
         type: 'text'
      },
      {
         name: "Stage",
         // maxWidth: "600px",
         selector: (row) => (row?.stage),
         // selector: (row) => (<div className='d-flex justify-content-center'>{row?.stage}</div>),
         type: 'text'
      },
      {
         name: "Action",
         maxWidth: "150px",
         selector: (row) => (
            <div className="d-flex ms-1 justify-content-center align-items-center text-center gap-1">
               {/* <Link to={`/merchant/customers/view_customer/${row?.stage}`}><CiAt size={15} /></Link> */}
               <span className='cursor-pointer'
                  onClick={() => {
                     setStageForm(prev => ({
                        ...prev,
                        edit: {
                           id: row?.id,
                           text: row?.stage
                        }
                     }))
                     handleEditShow()
                  }}>
                  <FiEdit size={15} />
               </span>
               <span className='cursor-pointer'
                  onClick={() => deleteStage(row?.id)}> <MdDeleteOutline size={15} />
               </span>
            </div>
         )
      }
   ]

   return (
      <>
         <Card>
            <CardHeader>
               <div className="d-flex justify-content-between w-100 align-items-center" >
                  <h4 className="m-0">Lead Setting</h4>
                  <div className="pe-2 d-flex">
                     <>
                        <style>
                           {`
                     .btn-primary:focus {
                        background-color: rgb(0,0,0)
                        }
                     `}
                        </style>
                        <button className='btn btn-primary' onClick={handleAddShow}>
                           Add Stage
                        </button>
                        <Modal show={addShow} onHide={handleAddClose} centered >
                           <Modal.Header closeButton>
                              <Modal.Title>Add</Modal.Title>
                           </Modal.Header>
                           <Modal.Body>
                              {stageForm.form.map((item, index) => (
                                 <div key={index} className='d-flex justify-content-start'>
                                    <Col md='6'>
                                       <Label htmlFor="company-lead-stage">
                                          Lead Stage
                                       </Label>
                                       <div className='d-flex align-items-center'>
                                          <Input
                                             placeholder="Lead Stage"
                                             type="text"
                                             id={`company-lead-stage-${index}`}
                                             className="form-control"
                                             value={item}
                                             onChange={(e) => {
                                                let { value } = e.target
                                                value = value.replace(',', '')
                                                setStageForm(prev => {
                                                   const arr = [...prev.form]
                                                   arr[index] = value
                                                   return {
                                                      ...prev,
                                                      form: arr
                                                   }
                                                })
                                             }}
                                          />
                                          <span className={`cursor-pointer ${index < 1 && 'opacity-0 pe-none'} `} onClick={() => deleteStageForm(index)}><TiDeleteOutline size={20} color='red' /></span>
                                       </div>
                                    </Col>
                                 </div>
                              ))}
                           </Modal.Body>
                           <Modal.Footer>
                              <Button className='btn btn-primary' onClick={addMoreStage}>
                                 Add More
                              </Button>
                              <Button className='btn btn-primary' onClick={postStage}>
                                 Save
                              </Button>
                           </Modal.Footer>
                        </Modal>
                     </>
                  </div>
               </div>
            </CardHeader>
         </Card>
         <Card>
            <CardHeader>
               <div className='mb-2'>
                  <LeadsSettingNav NavCurrentStep={NavCurrentStep} currentStep={currentStep} />
               </div>
            </CardHeader>
            <CardBody>
               {editModal('row?.stage', 'row?.id')}
               {/* {editModal} */}
               <ComTable
                  // tableName="Verified Email"
                  content={defferContent}
                  tableCol={columns}
                  data={tableData}
                  searchValue={searchValue}
                  // handleFilter={handleFilter}
                  filteredData={filteredData}
                  isLoading={isLoading}
               />
            </CardBody>
         </Card>
      </>
   )
}

export default LeadsSetting