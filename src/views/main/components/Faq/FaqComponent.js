import React from 'react'
import {
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Col,
    Container,
    Row,
    UncontrolledAccordion
} from 'reactstrap'
export default function FaqComponent({ data, theme }) {


    const Data = data

    if (!Data) {
        return null
    }
    //#ebeaea


    return (
        <div className={`${theme}`} >
            <style>
                {`
           
            .collapsing {
                position: relative;
                height: 0;
                overflow: hidden;
                -webkit-transition-property: height, visibility;
                transition-property: height, visibility;
                -webkit-transition-duration: 0.6s;
                transition-duration: 0.6s;
                -webkit-transition-timing-function: ease;
                transition-timing-function: ease;
              }
            
            `}
            </style>

            <Row className={`justify-content-center     ${theme}`} >
                <Col xs="10" md="12" xl="9">

                    <h1 className={`display-1 fw-bolder mb-2 text-center main-heading FAQ`} >FAQ</h1>

                    <Container fluid="sm">
                        <UncontrolledAccordion
                            stayOpen
                            defaultOpen={['1']}
                        >
                            {
                                Data.map((data, index) => (
                                    <AccordionItem>
                                        <AccordionHeader className="" targetId={index}>
                                            <h1 className='text-black' >{data.q}</h1>
                                        </AccordionHeader>
                                        <AccordionBody accordionId={index}>
                                            <h3 className='text-black'>
                                                {data.a}
                                            </h3>
                                        </AccordionBody>
                                    </AccordionItem>
                                )
                                )
                            }

                        </UncontrolledAccordion>
                    </Container>
                </Col>

            </Row>

        </div>
    )
}
