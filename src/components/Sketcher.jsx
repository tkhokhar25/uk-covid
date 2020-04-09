import React, { Component } from "react";
import Sketch from "react-p5";

const width = 500;
const height = 500;

 
const { hypot } = Math
// Collision and Ball code referenced from stackoverflow.com

const calculateChangeDirection = ({ dx, dy }) => {
  const hyp = hypot(dx, dy);
  const ax = dx / hyp;
  const ay = dy / hyp
  return { ax, ay }
}

const checkCollision = ({ dx, dy, diameter }) => {
  const distance2 = dx * dx + dy * dy
  return distance2 < diameter * diameter
}

var balls = [];

function Ball(p5) {
	this.x = Math.floor((Math.random() * 400) + 1);
  this.y = Math.floor((Math.random() * 400) + 1);
  this.color = 'blue';
	this.sz = 15;
	this.xspeed = Math.random()
  this.yspeed = Math.random();
  this.p5 = p5;
	
	this.update = () => {
		this.x += this.xspeed;
		this.y += this.yspeed;
	};
	
	this.display = () => {
		p5.fill(this.color);
		p5.noStroke();
		p5.ellipse(this.x, this.y, this.sz, this.sz);
	};
	
	this.bounce = () => {
		if (this.x > width || this.x < 0) {
			this.xspeed *= -1;
		}
		if (this.y > height || this.y < 0) {
			this.yspeed *= -1;
		}
  }

  this.checkCollisions = (others, idx) => {
    for (let i = idx + 1; i < others.length; i++) {
      const otherBall = others[i]

      const dx = otherBall.x - this.x
      const dy = otherBall.y - this.y

      if (checkCollision({ dx, dy, diameter: 15 })) {
        const { ax, ay } = calculateChangeDirection({ dx, dy })

        this.xspeed -= ax
        this.yspeed -= ay
        otherBall.xspeed = ax
        otherBall.yspeed = ay

        if (this.color === 'green' || otherBall.color === 'green') {
          this.color = 'green';
          otherBall.color = 'green';
        }
      }
    }
  }
  
}

export default class Sketcher extends Component {
  x = 50;
  y = 50;
 
  setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
    for (var i = 0; i < 100; i++) {
      balls[i] = new Ball(p5);
    }
    balls[99].color = 'green';
  };
  draw = p5 => {
    p5.background('#FFFFFF');
    for (var i = 0; i < balls.length; i++) {
      balls[i].update();
      balls[i].display();
      balls[i].bounce();
      balls[i].checkCollisions(balls, i);
    }

    this.x++;
  };

  render() {
    return <div><Sketch setup={this.setup} draw={this.draw} />Blue=Healthy Green=Infected Pink=Recovered Grey=Deceased (Put this inside UK's map and implement recovered and deceased)</div>;
  }
}