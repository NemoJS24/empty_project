import React from "react"
import { NavLink } from "react-router-dom"
import { Info, Share2, User } from "react-feather"

const CustomerBasicNav = () => {

    return (
        <>
            <div className="customer-basic-details d-flex gap-2">
                <NavLink className="rounded-2 d-flex justify-content-center align-items-center p-custom text-secondary" activeClassName='active' to='/merchant/customers/customer_basic/'><User size={20} />Basic Information</NavLink>
                <NavLink className="rounded-2 d-flex justify-content-center align-items-center p-custom text-secondary" activeClassName='active' to='/merchant/customers/customer_basic/personal_info'><User size={20} />Personal Information</NavLink>
                <NavLink className="rounded-2 d-flex justify-content-center align-items-center p-custom text-secondary" activeClassName='active' to='/merchant/customers/customer_basic/id_proof'><User size={20} />Identity Proof Information</NavLink>
                <NavLink className="rounded-2 d-flex justify-content-center align-items-center p-custom text-secondary" activeClassName='active' to='/merchant/customers/customer_basic/address'><Share2 size={20} />Address</NavLink>
                <NavLink className="rounded-2 d-flex justify-content-center align-items-center p-custom text-secondary" activeClassName='active' to='/merchant/customers/customer_basic/company_info'><Info size={20} />Company Information</NavLink>
                <NavLink className="rounded-2 d-flex justify-content-center align-items-center p-custom text-secondary" activeClassName='active' to='/merchant/customers/customer_basic/account'><User size={20} />Account</NavLink>
            </div>
        </>
    )
}

export default CustomerBasicNav