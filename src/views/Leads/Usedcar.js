/* eslint-disable */
import React from 'react'
import Today from './today_usedcar'
import Overall from './overall_usedcar'
import { Card, CardHeader, Button } from "reactstrap"
import { Link } from "react-router-dom"

export default function Finance() {

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-between w-100">
            <h4 className="">Used Car Dashboard</h4>
            <div className="pe-2 d-flex">
              <Link to="/merchant/customers/buyerseller/">
                <Button className="btn btn-outline-primary btn-block">Buy/Sell Car</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Today />
      <Overall />
    </div>)
}
