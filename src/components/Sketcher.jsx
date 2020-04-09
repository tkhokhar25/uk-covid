import React, { Component } from "react";
import Sketch from "react-p5";
import { random } from "node-forge";

const width = 500;
const height = 500;

var balls = []; // empty array
function Ball(x, y, p5) {
	this.x = x;
	this.y = y;
	this.sz = 25;
	this.xspeed = Math.random(-2, 2);
  this.yspeed = Math.random(-2, 2);
  this.p5 = p5;
	
	this.update = function() {
		this.x += this.xspeed;
		this.y += this.yspeed;
	};
	
	this.display = function() {
		p5.fill(255);
		p5.stroke(0);
		p5.ellipse(this.x, this.y, this.sz, this.sz);
	};
	
	this.bounce = function() {
		if (this.x > width || this.x < 0) {
			this.xspeed *= -1;
		}
		if (this.y > height || this.y < 0) {
			this.yspeed *= -1;
		}
	}
}

export default class Sketcher extends Component {
  x = 50;
  y = 50;
 
  setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 500).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    for (var i = 0; i < 10; i++) {
      balls[i] = new Ball(width/2, height/2, p5);
    }
  };
  draw = p5 => {
    for (var i = 0; i < balls.length; i++) {
      balls[i].update();
      balls[i].display();
      balls[i].bounce();
    }
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
    this.x++;
  };

  render() {
    return <Sketch setup={this.setup} draw={this.draw} />;
  }
}