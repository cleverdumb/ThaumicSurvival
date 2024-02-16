class Block {
    constructor(x, y, w, h, passable) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.passable = passable;
    }
}

class Air extends Block {
    constructor(x, y, w, h) {
        super(x, y, w, h, true);
    }
    render() {};
}

class Dirt extends Block {
    constructor(x, y, w, h) {
        super(x, y, w, h, false)
        // this.grassed = [false, false, false, false];
        this.grassed = [];
        for (let x=0; x<4; x++) {
            this.grassed.push(Math.random()>0.5);
        }
    }
    render() {
        // ctx.strokeRect(this.x * boxW, this.y * boxH, this.w, this.h)
        ctx.drawImage(sprites.dirt, this.x * boxW, this.y * boxH, this.w, this.h);
        this.grassed.forEach((x,i)=>{
            if (x) {
                ctx.drawImage(sprites['grassOverlay' + i], this.x * boxW, this.y * boxH, this.w, this.h);
            }
        })
    }
    update() {
        for (let x=0; x<4; x++) {
            let target = grid[this.y + dir[x][1]]?.[this.x + dir[x][0]];
            if (target) {
                if (target instanceof Air) {
                    this.grassed[x] = true;
                }
            }
        }
    }
}

class Boundary extends Block{
    constructor(x, y, w, h) {
        super(x, y, w, h, false);
    }
    render() {
        // console.log('rendering');
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x * boxW, this.y * boxH, this.w, this.h);
    }
}