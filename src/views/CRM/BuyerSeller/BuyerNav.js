import { Info, Share2, User } from "react-feather"
import { Row, Col } from "reactstrap"

const BuyerNav = ({ currentStep, NavCurrentStep }) => {

    return (
        <>
            <Row className="customer-basic-details  ">
                <Col xs={6} md={3} lg={3} className={`border-0 rounded btn ${currentStep === 1 ? 'active btn-primary' : ''}`} onClick={() => NavCurrentStep(1)}><User size={18} style={{ paddingRight: '5px' }} />Seller</Col>
                <Col xs={6} md={3} lg={3} className={`border-0 rounded btn ${currentStep === 2 ? 'active btn-primary' : ''}`} onClick={() => NavCurrentStep(2)}><User size={18} style={{ paddingRight: '5px' }} />Buyer</Col>
            </Row>
        </>
    )
}

export default BuyerNav