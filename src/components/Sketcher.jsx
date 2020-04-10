import React from "react";
import P5Wrapper from 'react-p5-wrapper';

var height = 0;
var width = 0;

 
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

function Ball(p) {
	this.x = Math.floor((Math.random() * width) + 1);
  this.y = Math.floor((Math.random() * height) + 1);
  this.color = 'blue';
	this.sz = 15;
	this.xspeed = Math.random()
  this.yspeed = Math.random();
  this.p = p;
  this.infectedTime = 0;
	
	this.update = () => {
    if (this.color === 'grey') {
      this.xspeed = 0;
      this.yspeed = 0;
    }

		this.x += this.xspeed;
		this.y += this.yspeed;
	};
	
	this.display = () => {
    if (this.color === 'green') {
      this.infectedTime += 1;
      if (this.infectedTime >= 200) {
        const fate = Math.floor((Math.random() * 5) + 1);
        if (fate < 2) {
          this.color = 'grey';
        } else {
          this.color = 'pink';
        }
      }
    }
    
		p.fill(this.color);
		p.noStroke();
		p.ellipse(this.x, this.y, this.sz, this.sz);
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

        if ((this.color === 'green' && (otherBall.color === 'blue' || otherBall.color === 'green')) || (otherBall.color === 'green' && (this.color === 'blue' || this.color === 'green'))) {
          this.color = 'green';
          otherBall.color = 'green';
        }
      }
    }
  }
  
}

function sketch (p) {
  // var x = 50;
  // const y = 50;
  var mySvg = {width: 800, height: 582};

  p.preload = () => {
    // mySvg = p.loadImage(process.env.PUBLIC_URL + '/phe_regions.svg')
  };
 
  p.setup = () => {
    p.createCanvas(mySvg.width, mySvg.height);
    
    width = mySvg.width;
    height = mySvg.height;
    for (var i = 0; i < 200; i++) {
      balls[i] = new Ball(p);
    }
    balls[99].color = 'green';
  };
  p.draw = () => {
    // p.imageMode(p.TOP_LEFT);
    p.background('#FFFFFF');
    // var ctx = p.drawingContext.canvas.getContext('2d');
    // ctx.clip();
    // p.image(mySvg, 0, 0);
    for (var i = 0; i < balls.length; i++) {
      balls[i].update();
      balls[i].display();
      balls[i].bounce();
      balls[i].checkCollisions(balls, i);
    }

    // x++;
  };

}
// clipPath: `${process.env.PUBLIC_URL}/phe_regions.svg`
const Sketcher = () =>  
  // <div style={{clipPath: `url(${process.env.PUBLIC_URL}/phe_regions.svg#Layer_1)`}}>
    // zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    <P5Wrapper sketch={sketch} />
  // </div>;

export default React.memo(Sketcher);