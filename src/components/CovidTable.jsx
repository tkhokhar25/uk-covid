import React, { useEffect } from "react";
import { Table, Container, Row, Col, Alert } from 'reactstrap';

const CovidTable = ({ areaCases, toggleDisplayRegional, secondaryTable, setSecondaryTable }) => {
  useEffect(() => {
  }, []);

  const handleOnClick = areaName => {
        if (secondaryTable.areaName === areaName) {
            if (secondaryTable.display) {
                toggleDisplayRegional({display: false})
            } else {
                const fileName = areaName.replace(/ /g, '_')
            
                toggleDisplayRegional({ display: true, fileName, regionCases: areaCases[areaName].regional });
            }

            setSecondaryTable({ display: !secondaryTable.display, areaName })
        } else {
            setSecondaryTable({ display: true, areaName })

            const fileName = areaName.replace(/ /g, '_')
            toggleDisplayRegional({ display: true, fileName, regionCases: areaCases[areaName].regional });
        }
  }

  return <Container>
            <Row>
                <Alert color="info">
                    Click on a row to view the numbers for each UTLA in the Region!
                </Alert>
            </Row>
            <Row>
                <Col>
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
                <Col>
                {secondaryTable.display ?
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
                :
                null
                            }

                </Col>
            </Row>
        </Container>;
    }

export default React.memo(CovidTable);