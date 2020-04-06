import React, { useState, useEffect } from "react";
import { Table, Container, Row, Col, Alert, Button } from 'reactstrap';

const CovidTable = ({ areaCases }) => {
    const [secondaryTable, setSecondaryTable] = useState({ display: false, areaName: '' });

  useEffect(() => {
  }, []);

  const handleOnClick = areaName => {
        setSecondaryTable({ display: !secondaryTable.display, areaName })
  }

  return <Container>
            <Row>
            {secondaryTable.display ?
                <Col>
                    <Button color='primary' onClick={() => setSecondaryTable({...secondaryTable, display: false})}>BACK</Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>{secondaryTable.areaName}</th>
                            <th>Number of Cases</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areaCases.length === 0 ? null :
                                Object.keys(areaCases[secondaryTable.areaName].regional).map(areaName => <tr>
                                                                                                            <td>{areaName}</td>
                                                                                                            <td>{areaCases[secondaryTable.areaName].regional[areaName]}</td>
                                                                                                        </tr>)}
                        </tbody>
                    </Table>
                </Col>
                :
                <Col>
                    <Alert color="info">
                        Click on a row to view the numbers for each UTLA in the Region!
                    </Alert>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Region</th>
                            <th>Number of Cases</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(areaCases).map(areaName => <tr onClick={ () => handleOnClick(areaName) }>
                                                                        <td>{areaName}</td>
                                                                        <td>{areaCases[areaName].total}</td>
                                                                    </tr>)}
                        </tbody>
                    </Table>
                </Col>
            }
            </Row>
        </Container>;
    }

export default React.memo(CovidTable);