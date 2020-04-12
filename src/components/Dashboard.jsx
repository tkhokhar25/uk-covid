import React, { useEffect } from "react";
import { Card, CardTitle, CardBody, Col, Row, CardSubtitle } from 'reactstrap';

const Dashboard = ({ borderColors, backgroundColors, labels, cases }) => {
  useEffect(() => {
  }, [])

  return (
    <Row>
        {backgroundColors.map((color, i) => <Col xs='4' md ='2' style={{color: borderColors[i]}}>
                                                <Card style={{backgroundColor: color}}>
                                                    <CardBody>
                                                        <CardTitle style={{whiteSpace: "nowrap"}}>{labels[i]}</CardTitle>
                                                        <CardSubtitle>{cases[Object.keys(cases)[i]].slice(-1)[0]}</CardSubtitle>
                                                    </CardBody>
                                                </Card>
                                            </Col>)}
    </Row>
  )
}

export default React.memo(Dashboard);