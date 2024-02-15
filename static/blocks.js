class Air {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.passable = true;
    }
    render() {};
}

class Dirt {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.passable = false;
        this.grassed = [false, false, false, false];
        // for (let x=0; x<4; x++) {
        //     this.grassed.push(Math.random()>0.5);
        // }
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