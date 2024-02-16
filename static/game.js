const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');

const cx = 900;
const cy = 600;

let boxW = 20, boxH = 20;

let worldX = 500;
let worldY = 300;

cvs.width = cx;
cvs.height = cy;
cvs.style.border = '1px solid black';

let pl = {
    x: 100,
    y: 300,
    w: 20,
    h: 40,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    ground: false
}

const GRAV = 0.4;
const AIRRES = 0.2;
const TERMINAL = 5;

const dir = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
]

let entities = [];

// let doubleJ = false;

let grid = [];

for (let y=0; y<worldY; y++) {
    grid.push([]);
    for (let x=0; x<worldX; x++) {
        if (x == 0 || x == worldX-1 || y == 0 || y == worldY-1) {
            grid[y].push(new Boundary(x, y, boxW, boxH));
        }
        else if (y >= 25) {
            grid[y].push(new Dirt(x, y, boxW, boxH));
        }
        else {
            grid[y].push(new Air(x, y, boxH, boxH));
        }
    }
}

// grid.forEach(y=>{
//     y.forEach(x=>{
//         x.update();
//     })
// })

let sprites = {};

function resolveCollision(e, l, u, r, d) {
    if (!(e.x+e.w > l && e.x < r && e.y+e.h > u && e.y < d)) return;

    // console.log('colliding');
    // console.log(l, u, r, d);
    // console.log(e.x, e.y, e.x + e.w, e.y + e.h);

    let overlapX, overlapY;
    let xLeft = false;
    let yUp = false;

    if (e.x >= l && e.x + e.w <= r) {
        overlapX = e.w;
        xLeft = true;
    }
    else if (e.x <= l && e.x + e.w >= r) {
        overlapX = r - l;
        xLeft = true;
    }
    else if (e.x <= l && e.x + e.w <= r) {
        overlapX = e.x + e.w - l;
        xLeft = true;
    }
    else if (e.x >= l && e.x + e.w >= r) {
        overlapX = r - e.x;
        xLeft = false;
    }


    if (e.y >= u && e.y + e.h <= d) {
        overlapY = pl.h;
        yUp = true;
    }
    else if (e.y <= u && e.y + e.h >= d) {
        overlapY = d - u;
        yUp = true;
    }
    else if (e.y <= u && e.y + e.h <= d) {
        overlapY = e.y + e.h - u;
        yUp = true;
    }
    else if (e.y >= u && e.y + e.h >= d) {
        overlapY = d - e.y
        yUp = false;
    }

    // console.log(overlapX, overlapY, xLeft, yUp);

    if (Math.abs(overlapX) < Math.abs(overlapY)) {
        if (xLeft) {
            e.x = l - e.w;
            e.vx = 0;
            e.ax = 0;
        }
        else {
            e.x = r;
            e.vx = 0;
            e.ax = 0;
        }
    }
    else {
        if (yUp) {
            e.y = u - e.h;
            e.ay = 0;
            e.vy = 0;
            e.ground = true;
        }
        else {
            e.y = d;
            // pl.ay = -pl.ay;
            e.vy = -e.vy;
        }
    }
}

function plTick() {
    // if (pl.ay > GRAV)
    pl.ay += GRAV;

    // pl.vy -= Math.sign(pl.vy) * Math.abs(AIRRES * pl.vy);
    pl.ay -= Math.sign(pl.ay) * Math.abs(AIRRES * pl.ay);

    pl.vx += pl.ax;

    // if (!(pl.ay > 0 || pl.ground)) { 
    //     pl.vy += pl.ay;
    // }

    pl.vy += pl.ay

    pl.x += pl.vx;
    // if (!pl.ground || pl.vy <= 0) {
    pl.y += pl.vy;
    // }

    // let blockBelowY = Math.floor((pl.y + pl.h)/boxH);

    if (Math.abs(pl.vy) > TERMINAL) pl.vy = Math.sign(pl.vy) * TERMINAL;

    // if (pl.y + pl.h > 500) {
    //     pl.vy = 0;
    //     pl.y = 500-pl.h;

    //     pl.ground = true;
    // }
    // else {
    //     pl.ground = false;
    // }

    // grid.forEach(y=>{
    //     y.forEach(x=>{
    //         if (!x.passable) {
    //             resolveCollision(pl, x.x * boxW, x.y * boxH, x.x * boxW + x.w, x.y * boxH + x.h);
    //         }
    //     })
    // })

    let bottomBlockX = Math.floor(pl.x/boxW);
    let bottomBlockY = Math.floor((pl.y + pl.h/2)/boxH);

    for (let y=Math.max(0, bottomBlockY - 3); y<Math.min(worldY, bottomBlockY + 3); y++) {
        for (let x=Math.max(0, bottomBlockX - 3); x<Math.min(worldX, bottomBlockX + 3); x++) {
            let block = grid[y][x];
            if (!block.passable) {
                resolveCollision(pl, block.x * boxW, block.y * boxH, block.x * boxW + block.w, block.y * boxH + block.h);
            }
        }
    }

    // resolveCollision(600, 370, 700, 420);
}

function render() {
    ctx.clearRect(0, 0, cx, cy);

    let centreX, centreY;
    if ((pl.x + pl.w/2) < (worldX*boxW/2)) {
        // console.log('first')
        centreX = Math.max((cx/2), (pl.x + pl.w/2));
    }
    else {
        // console.log('second');
        centreX = Math.min((worldX * boxW - cx/2), (pl.x + pl.w/2));
    }

    // console.log(centreX);
    // console.log(cx/2, pl.x + pl.w/2);

    if ((pl.y + pl.h/2) < (worldY*boxH/2)) {
        centreY = Math.max(cy/2, (pl.y + pl.h/2));
    }
    else {
        centreY = Math.min(worldY * boxH - cy/2, (pl.y + pl.h/2));
    }

    let topLeft = [Math.round(centreX - cx/2), Math.round(centreY - cy/2)];
    let topLeftBlock = [Math.floor(topLeft[0]/boxW), Math.ceil(topLeft[1]/boxH)];

    // let topLeft = [Math.max(0, parseInt(Math.round((pl.x+pl.w/2 - cx/2)*10)/10)), Math.max(0, parseInt(Math.round((pl.y+pl.h/2 - cy/2)*10)/10))];
    // let topLeftBlock = [Math.floor(topLeft[0]/boxW), Math.ceil(topLeft[1]/boxH)];

    // ctx.beginPath();
    // ctx.moveTo(0, 500);
    // ctx.lineTo(800, 500);
    // ctx.stroke();
    // ctx.closePath();

    // ctx.strokeRect(600, 370, 100, 50);

    ctx.save();
    ctx.translate(-topLeft[0], -topLeft[1]);

    // ctx.fillStyle = 'red';
    // ctx.fillRect(topLeft[0], topLeft[1], 10, 10);
    // ctx.fillStyle = 'black';

    // grid.forEach(y=>{
    //     y.forEach(x=>{
    //         x.render();
    //     })
    // })

    for (let y=0; y<=cy/boxH + 6; y++) {
        for (let x=0; x<=cx/boxW + 6; x++) {
            if (grid[y + topLeftBlock[1] - 3]?.[x + topLeftBlock[0] - 3]) {
                grid[y + topLeftBlock[1] - 3]?.[x + topLeftBlock[0] - 3].render();
            }
        }
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);

    entities.forEach(x=>{
        x.render()
    })

    ctx.restore();
}

function loop() {
    plTick();
    entities.forEach(x=>x.update());
    render();
}

function init(bitmap) {
    sprites = bitmap;

    // new TestEntity(100, 100, 50, 50);
    setInterval(loop, 1000/60)
}

// start();

let keyDown = {
    w: false,
    d: false,
    a: false
}

document.addEventListener('keydown', e=>{
    if (e.key == 'w') {
        if (pl.ground && !keyDown.w) {
            // pl.vy = -70;
            pl.ay = -17;
            pl.ground = false;
        }
        keyDown.w = true;
    }
    else if (e.key == 'd') {
        if (!keyDown.d) {
            pl.vx = 5;
        }
        keyDown.d = true;
    }
    else if (e.key == 'a') {
        if (!keyDown.a) {
            pl.vx = -5;
        }
        keyDown.a = true;
    }
    else if (e.key == 'p') {
        loop();
    }
})

document.addEventListener('keyup', e=>{
    if (e.key == 'w') {
        keyDown.w = false;
    }
    else if (e.key == 'd') {
        keyDown.d = false;
        pl.vx = 0;
    }
    else if (e.key == 'a') {
        keyDown.a = false;
        pl.vx = 0;
    }
})

// cvs.addEventListener('mousedown', e=>{
//     let x = Math.floor((e.clientX - cvs.getBoundingClientRect().x)/boxW);
//     let y = Math.floor((e.clientY - cvs.getBoundingClientRect().y)/boxH);
// 
//     grid[y][x].update();
// })