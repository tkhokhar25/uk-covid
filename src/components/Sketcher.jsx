import React, { useState } from "react";
import P5Wrapper from 'react-p5-wrapper';
import { Container, Row, Col, Button } from 'reactstrap';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import {isMobile} from 'react-device-detect';
import Ball from './Ball';

const width = window.innerHeight > window.innerWidth ? window.innerWidth * 0.9 : 800;
const height = isMobile ? window.innerHeight * 0.75 : 600;

var balls = [];

function sketch (p, simulationState) {
 
  p.setup = () => {
    p.createCanvas(width, height);
    
    for (var i = 0; i < simulationState.numBalls; i++) {
      balls[i] = new Ball(p, simulationState);
    }

    for (i = 0; i < simulationState.initiallyExposed; i++) {
      balls[i].color = 'orange';
    }
  };
  p.draw = () => {
    p.background('#FFFFFF');

    for (var i = 0; i < balls.length; i++) {
      balls[i].update();
      balls[i].display();
      balls[i].bounce();
      balls[i].checkCollisions(balls, i);
    }
  };
}

function sketchLegend(p) {
  p.setup = () => {
    p.createCanvas(width, 60);
  };

  p.draw = () => {
    p.background('#FFFFFF');
    p.textSize(20)

    p.fill('blue');
		p.noStroke();
    p.ellipse(15, 10, 15, 15);
    
    p.text('Healthy', 30, 17)

    p.fill('orange');
		p.noStroke();
    p.ellipse(130, 10, 15, 15);

    p.text('Exposed', 145, 17);

    p.fill('green');
		p.noStroke();
    p.ellipse(245, 10, 15, 15);

    p.text('Infected', 260, 17);

    if (isMobile) {
      p.fill('pink');
      p.noStroke();
      p.ellipse(15, 40, 15, 15);
      
      p.text('Recovered', 30, 47);

      p.fill('grey');
      p.noStroke();
      p.ellipse(145, 40, 15, 15);
      
      p.text('Deceased', 160, 47);
    } else {
      p.fill('pink');
      p.noStroke();
      p.ellipse(360, 10, 15, 15);
      
      p.text('Recovered', 375, 17);
  
      p.fill('grey');
      p.noStroke();
      p.ellipse(490, 10, 15, 15);
      
      p.text('Deceased', 505, 17)
    }

    p.noLoop()
  };
}

const Sketcher = ({ setDisplaySimulator }) =>  {
  const [simulationState, setSimulationState] = useState({ numBalls: 200, initiallyExposed: 1, exposedToInfected: 80, infectedToRecovers: 80 });

  return (
    <Container>
      <Row style={{padding: '25px'}}>
        <p>
          <h1>{'SEIR DISEASE SPREAD MODEL USING BALLS'}</h1>
          <h6>{'A healthy person can get exposed to the virus.'}</h6>
          <h6>{'An exposed person recovers or gets infected and can expose other people to the virus.'}</h6>
          <h6>{'An infected person recovers or dies and can expose other people to the virus.'}</h6>
        </p>
      </Row>
      <Row style={{paddingLeft: '25px', paddingBottom: '25px'}}>
        <Button color='primary' onClick={() => setDisplaySimulator(false)}><h4>View Map</h4></Button>
      </Row>
      <Row>
          <Col>
            <P5Wrapper sketch={p => sketch(p, simulationState)} />
            <P5Wrapper sketch={sketchLegend} />
          </Col>
          <Col>
            <div>
              <p>Number of balls</p>
              <RangeSlider
                max={400}
                value={simulationState.numBalls}
                onChange={changeEvent => setSimulationState({...simulationState, numBalls: changeEvent.target.value})}
              />
            </div>
            <div>
              <p>Number of initially exposed balls</p>
              <RangeSlider
                max={simulationState.numBalls}
                value={simulationState.initiallyExposed}
                onChange={changeEvent => setSimulationState({...simulationState, initiallyExposed: changeEvent.target.value})}
              />
            </div>
            <div>
              <p>Percent of exposed population that gets infected</p>
              <RangeSlider
                value={simulationState.exposedToInfected}
                onChange={changeEvent => setSimulationState({...simulationState, exposedToInfected: changeEvent.target.value})}
              />
            </div>
            <div>
              <p>Percent of infected population that recovers</p>
              <RangeSlider
                value={simulationState.infectedToRecovers}
                onChange={changeEvent => setSimulationState({...simulationState, infectedToRecovers: changeEvent.target.value})}
              />
            </div>
            <div style={{paddingBottom: '25px'}}>
              <Button color='primary' onClick={() => setSimulationState({ numBalls: 200, initiallyExposed: 1, exposedToInfected: 80, infectedToRecovers: 80 })}>RESET AND RUN</Button>
            </div>
          </Col>
      </Row>
    </Container>
  )
};

export default React.memo(Sketcher);