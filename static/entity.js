class Entity {
    constructor(x, y, vx, vy, ax, ay, w, h, grav, term, collisions) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.w = w;
        this.h = h;
        this.grav = grav;
        this.ground = false;
        this.terminal = term;
        this.collisions = collisions;

        entities.push(this);
    }
    update() {
        if (this.grav) {
            this.ay += GRAV;
        }

        // console.log(this.ay);

        this.ay -= Math.sign(this.ay) * Math.abs(AIRRES * this.ay);

        this.vx += this.ax;
        this.vy += this.ay;

        this.x += this.vx;
        this.y += this.vy;

        if (Math.abs(this.vy) > TERMINAL) this.vy = Math.sign(this.vy) * TERMINAL;

        if (this.collisions) {
            grid.forEach(y=>{
                y.forEach(x=>{
                    if (!x.passable) {
                        resolveCollision(this, x.x * boxW, x.y * boxH, x.x * boxW + x.w, x.y * boxH + x.h);
                    }
                })
            })
        }
    }
}

class TestEntity extends Entity{
    constructor(x, y, w, h) {
        super(x, y, 0, 0, 0, 0, w, h, false, 5, true);
    }
    render() {
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}