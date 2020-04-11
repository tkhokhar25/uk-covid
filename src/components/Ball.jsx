const width = 800;
const height = 600;

const { hypot } = Math

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


export default function Ball(p, simulationState) {
	this.x = Math.floor((Math.random() * width) + 1);
  this.y = Math.floor((Math.random() * height) + 1);
  this.color = 'blue';
	this.sz = 15;
	this.xspeed = Math.random()
  this.yspeed = Math.random();
  this.p = p;
  this.exposedTime = 0;
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
    if (this.color === 'orange') {
      this.exposedTime += 1;
      if (this.exposedTime >= 200) {
        const fate = Math.floor((Math.random() * 100) + 1);
        if (fate < simulationState.exposedToInfected) {
          this.color = 'green';
        } else {
          this.color = 'pink';
        }
      }
    } else if (this.color === 'green') {
      this.infectedTime += 1;
      if (this.infectedTime >= 200) {
        const fate = Math.floor((Math.random() * 100) + 1);
        if (fate < simulationState.infectedToRecovers) {
          this.color = 'pink';
        } else {
          this.color = 'green';
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

        if ((this.color === 'green' || this.color === 'orange') && otherBall.color === 'blue') {
          otherBall.color = 'orange';
        } else if ((otherBall.color === 'green' || otherBall.color === 'orange') && this.color === 'blue') {
          this.color = 'orange';
        }
      }
    }
  }
  
}