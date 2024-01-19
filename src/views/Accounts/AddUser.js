import React, { useEffect, useState } from 'react'
import { Card, CardBody, Input, Row } from 'reactstrap'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import { getReq, postReq } from '../../assets/auth/jwtService'
import toast from 'react-hot-toast'

const AddUser = () => {

    const [data, setData] = useState({
        first_name: "",
        last_name: "",
        email_id: "",
        password: "",
        confirm_password: "",
        assign_department: "",
        // selectedModuleList: [],
        commision: "",
        assign_role: "",
        selectedData: ""
    })
    const [departmentList, setDepartmentList] = useState([])
    const [permisionList, setPermissionList] = useState([])

    const updateData = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const commissionOptions = [
        { value: "1", label: "Operations - Commission" },
        { value: "2", label: "silver" },
        { value: "3", label: "Test-Sales" },
        { value: "4", label: "15% for 6 transaction per client till 31st December 2022" },
        { value: "5", label: "30% for 1st year from the agreement" },
        { value: "6", label: "test comm" },
        { value: "7", label: "test1" },
        { value: "8", label: "Year wise commission" },
        { value: "9", label: "Digital Marketing - 5%" },
        { value: "10", label: "Sales - Period wise commission" },
        { value: "11", label: "Sales - Calendar wise commission" }
    ]

    const rolesOptions = [
        { value: "Admin", label: "Admin" },
        { value: "Manager", label: "Manager" },
        { value: "Executive", label: "Executive" }
    ]
      

    const handleChange = (options, actionMeta, check) => {
        if (check) {
            const option_list = options.map((cur) => {
                return cur.value
            })
            setData({ ...data, [actionMeta.name]: option_list })
        } else {
            setData({ ...data, [actionMeta.name]: options.value })
        }

    }

    const changeCheck = (e, id) => {
        // console.log(e, cur)
        const dupArry = permisionList
        const checkModule = dupArry?.findIndex((curElem) => Number(curElem?.id) === Number(id))
        console.log(checkModule, "checkModule")

        if (checkModule !== -1) {
            dupArry[checkModule][e.target.name] = e.target.checked
        }
        console.log(dupArry, "dupArry")
        setPermissionList([...dupArry])

    }

    const getDepartmentList = () => {
        getReq("addDepartment")
        .then((resp) => {
            console.log(resp)
            const dept_list = resp?.data?.map((curElem) => {
                return {label: curElem?.department, value: curElem?.id}
            })

            setDepartmentList(dept_list)
        })          
        .catch((error) => {
            console.log(error)
        })
    }

    const getPermissionList = (value) => {
        getReq("checkDeptName", `?id=${value}`)
        .then((resp) => {
            console.log(resp, "checkDeptName")
            // const permission_list = resp?.data?.map((curElem) => {
            //     return {
            //         permission: curElem?.id,
            //         create: false,
            //         update: false,
            //         delete: false,
            //         read: false
            //     }
            // })

            // setData({...data, selectedModuleList: permission_list})

            setPermissionList(resp?.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const saveData = () => {
        const form_data = new FormData()
        Object.entries(data).map(([key, value]) => form_data.append(key, value))

        permisionList?.map((curElem) => form_data.append("permission_list", JSON.stringify(curElem)))

        postReq("saveUser", form_data)
        .then((resp) => {
            console.log(resp)
            toast.success("User saved successfully")
        })
        .catch((error) => {
            console.log(error)
            toast.error("Something went wrong")
        })
    }

    useEffect(() => {
        getDepartmentList()
    }, [])

    useEffect(() => {
        if (data?.assign_department) {
            getPermissionList(data?.assign_department)
        }
    }, [data?.assign_department])

    console.log(setPermissionList)

    return (
        <>
            <Row>
                <Card>
                    <CardBody>
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className='m-0'>Add User</h4>
                        </div>
                    </CardBody>
                </Card>
            </Row>

            <Row>
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="first_name">First Name</label>
                                    <input className='form-control' type="text" name="first_name" placeholder='First Name' value={data?.first_name} onChange={(e) => updateData(e)} />
                                </div>
                            </div>
                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input className='form-control' type="text" name="last_name" placeholder='Last Name' value={data?.last_name} onChange={(e) => updateData(e)} />
                                </div>
                            </div>
                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="email_id">Email ID</label>
                                    <input className='form-control' type="text" name="email_id" placeholder='Email ID' value={data?.email_id} onChange={(e) => updateData(e)} />
                                </div>
                            </div>

                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input className='form-control' type="text" name="password" placeholder='Password' value={data?.password} onChange={(e) => updateData(e)} />
                                </div>
                            </div>

                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="confirm_password">Confirm Password</label>
                                    <input className='form-control' type="text" name="confirm_password" placeholder='Confirm Password' value={data?.confirm_password} onChange={(e) => updateData(e)} />
                                </div>
                            </div>

                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="confirm_password">Assign Department</label>
                                    <Select
                                        isMulti = {false}
                                        options={departmentList}
                                        inputId="aria-example-input"
                                        closeMenuOnSelect={true}
                                        name="assign_department"
                                        placeholder="Assign Department"
                                        value={departmentList?.filter(option => data?.assign_department  === option.value)}
                                        onChange={(value, actionMeta) => handleChange(value, actionMeta, false)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="confirm_password">Commission</label>
                                    <Select
                                        isMulti = {false}
                                        options={commissionOptions}
                                        inputId="aria-example-input"
                                        closeMenuOnSelect={true}
                                        name="commision"
                                        placeholder="Commission"
                                        value={commissionOptions?.filter(option => data?.commision  === option.value)}
                                        onChange={(value, actionMeta) => handleChange(value, actionMeta, false)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="confirm_password">Assign Role</label>
                                    <Select
                                        isMulti = {false}
                                        options={rolesOptions}
                                        defaultInputValue=''
                                        inputId="aria-example-input"
                                        closeMenuOnSelect={true}
                                        name="assign_role"
                                        placeholder="Assign Role"
                                        value={rolesOptions?.filter(option => data?.assign_role  === option.value)}
                                        onChange={(value, actionMeta) => handleChange(value, actionMeta, false)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-4 mb-1">
                                <div className="form-group">
                                    <label htmlFor="confirm_password">Start Date</label>
                                    <Flatpickr options={{ // Sets the minimum date as 14 days ago
                                        minDate: "today",
                                        dateFormat: "Y-m-d"
                                    }} className='form-control' value={data?.selectedData} onChange={(date) => setData({ ...data, selectedData: date })} placeholder='Start Date' />
                                </div>
                            </div>

                        </div>

                        <div className="row mt-2">
                            <div className="col-md-12">
                                <h4 className="text-center my-2">Permission according to roles</h4>
                                <table className="table table-hover overflow-x-auto">
                                    <thead>
                                        <tr>
                                            <th scope="col">Module</th>
                                            <th scope="col">Add</th>
                                            <th scope="col">Edit</th>
                                            <th scope="col">View</th>
                                            <th scope="col">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permisionList?.map((cur, key) => (
                                            <tr key={key}>
                                                <td>{cur?.permission}</td>
                                                <td>
                                                    <div className='form-check form-check-primary'>
                                                        <Input type='checkbox' value={cur?.id} name="create" onChange={(e) => changeCheck(e, cur?.id)} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='form-check form-check-primary'>
                                                        <Input type='checkbox' value={cur?.id} name="update" onChange={(e) => changeCheck(e, cur?.id)} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='form-check form-check-primary'>
                                                        <Input type='checkbox' value={cur?.id} name="read" onChange={(e) => changeCheck(e, cur?.id)} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='form-check form-check-primary'>
                                                        <Input type='checkbox' value={cur?.id} name="delete" onChange={(e) => changeCheck(e, cur?.id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="row">
                            <div className="action-btn mt-2 d-flex justify-content-between align-items-center">
                                <a></a>
                                <a className='btn btn-primary-main' onClick={() => saveData()}>Save</a>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Row>
        </>
    )
}

export default AddUser