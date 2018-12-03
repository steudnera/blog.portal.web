/**
 * 彩虹混合器
 * @author Philip
 */
let particles = []
let canvasHypot

let canvas, ctx, width, height, widthHalf, heightHalf
const { PI, atan2, sin, cos, sqrt, floor, min, max, pow } = Math
const TAU = PI * 2
const HALF_PI = PI * 0.5

let blackHole
let blackHoleRadius = 50
let attractionLimit = 0.2
let attractionRadius = 150
// let angleLimit = 0.4

window.addEventListener('load', () => {
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')

    document.body.append(canvas)
    window.addEventListener('resize', resized)

    resized()
    setup()

    requestAnimationFrame(_draw)
})

function resized () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    width = canvas.width
    height = canvas.height

    widthHalf = width * 0.5
    heightHalf = height * 0.5
    canvasHypot = Math.hypot(widthHalf, heightHalf)

    ctx.beginPath()
    ctx.fillStyle = 'hsl(0, 0%, 0%)'
    ctx.fillRect(0, 0, width, height)
}

function _draw (e) {
    requestAnimationFrame(_draw)
    // resized()
    draw(e)
}

function random (low = 1, high = null) {
    if (Array.isArray(low)) {
        return low[floor(Math.random() * low.length)]
    }

    if (high === null) {
        return Math.random() * low
    }

    return Math.random() * (high - low) + low
}

function map (n, a, b, c, d) {
    return (n - a) * (d - c) / (b - a) + c
}

function constrain (n, mn, mx) {
    return max(mn, min(mx, n))
}

function easeOutExpo (t = 0.5, b = 0, c = 1, d = 1) {
    return c * (-pow(2, -10 * t / d) + 1) + b
}

function setup () {
    resized()
    blackHole = new Vector(0, 0)

    for (let i = 0; i < 600; i++) {
        particles.push(new Particle())
    }
}

function draw (e) {
    if (particles.length < 3000) {
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle())
        }
    }

    // let o = 10

    ctx.save()
    ctx.beginPath()
    ctx.arc(widthHalf, heightHalf, blackHoleRadius, 0, TAU)
    ctx.clip()
    ctx.translate(widthHalf, heightHalf)
    ctx.rotate(-0.1)

    let scl = 0.94

    ctx.scale(scl, scl)
    ctx.translate(-widthHalf, -heightHalf)
    ctx.drawImage(canvas, 0, 0, width, height)
    ctx.restore()
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.04)'
    ctx.fillRect(0, 0, width, height)
    ctx.translate(widthHalf, heightHalf)
    ctx.beginPath()

    particles.reduceRight((_, p, i) => {
        let diff = blackHole.copy().sub(p.pos)
        let dist = diff.mag()

        if (dist < blackHoleRadius) {
            p.reset(true)
            return
        }

        let c = constrain(dist - blackHoleRadius, 0, attractionRadius)
        let ease = easeOutExpo(c, 0, 1, attractionRadius)
        let limit = map(ease, 0, 1, 0.1, attractionLimit)
        // let limit = constrain(map(, 50, 200, attractionLimit, 0.1), attractionLimit, 1);
        p.acc.add(diff.copy().limit(limit))
        // let a = constrain(map(dist, 50, 200, angleLimit, 0.1) * PI, angleLimit, 0.1);
        // let a = 0.1 * PI;
        // let aMag = map(ease, 0, 1, 0, 0.01);
        // p.acc.add(diff.limit(aMag).rotate(a));
        p.draw()
    }, null)

    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = `hsla(${(random(0, 20) + e * 0.08) % 360}, 100%, 60%, 0.1)`
    ctx.lineWidth = 3
    ctx.save()
    ctx.filter = 'blur(6px) saturate(150%) contrast(150%)'
    ctx.stroke()
    ctx.restore()
    ctx.lineWidth = 1.5
    ctx.stroke()

    // ctx.beginPath();
    // ctx.arc(blackHole.x, blackHole.y, blackHoleRadius, 0, PI * 2);
    // ctx.moveTo(blackHole.x + blackHoleRadius + attractionRadius, blackHole.y);
    // ctx.arc(blackHole.x, blackHole.y, blackHoleRadius + attractionRadius, 0, PI * 2);
    // ctx.lineWidth = 1.5;
    // ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.01)';
    // ctx.stroke();

    ctx.restore()
}

class Particle {
    constructor () {
        this.reset()
    }

    reset (outside) {
        // let x = random(-width, width);
        // let y = random(-height, height);
        // if (outside) {
        // [ x, y ] = random([
        //      [
        //          random(-1, 2),
        //          random([ random(-1), random(1, 2), ])
        //      ], [
        //          random([ random(-1), random(1, 2), ]),
        //          random(-1, 2)
        //      ]
        // ]);
        // x = (x - 0.5) * width;
        // y = (y - 0.5) * height;
        // }
        let angle = random(TAU)
        let radiuRange = [0, 5]

        if (outside) {
            radiuRange = [1, 9]
        }

        let r = random(...radiuRange) * canvasHypot

        this.pos = new Vector(r, 0).rotate(angle)
        this.lastPos = this.pos.copy()
        this.vel = blackHole.copy().sub(this.pos).limit(10).rotate(HALF_PI)
        this.acc = new Vector()
    }

    draw () {
        let { pos, lastPos, vel, acc } = this

        vel.add(acc).mult(0.99)
        acc.set(0, 0)
        lastPos.set(pos)
        pos.add(vel)
        // ctx.rect(pos.x - 2, pos.y - 2, 4, 4)
        ctx.moveTo(lastPos.x, lastPos.y)
        ctx.lineTo(pos.x, pos.y)
    }
}

class Vector {
    constructor (x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    copy () {
        return new Vector(this.x, this.y)
    }

    set (x = this.x, y = this.y) {
        if (x instanceof Vector) {
            ({ x, y } = x)
        }

        this.x = x
        this.y = y

        return this
    }

    add (x = 0, y = x) {
        if (x instanceof Vector) {
            ({ x, y } = x)
        }

        this.x += x
        this.y += y
        return this
    }

    sub (x = 0, y = x) {
        if (x instanceof Vector) {
            ({ x, y } = x)
        }
        this.x -= x
        this.y -= y
        return this
    }

    mult (x = 1, y = x) {
        if (x instanceof Vector) {
            ({ x, y } = x)
        }

        this.x *= x
        this.y *= y

        return this
    }

    div (x = 1, y = x) {
        if (x instanceof Vector) {
            ({ x, y } = x)
        }

        this.x /= x
        this.y /= y

        return this
    }

    heading () {
        return atan2(this.y, this.x)
    }

    magSq () {
        return this.x * this.x + this.y * this.y
    }

    mag () {
        return Math.sqrt(this.magSq())
    }

    limit (max = null) {
        let magSq = this.magSq()

        if (max === null) {
            max = sqrt(magSq)
        }

        if (magSq > max * max) {
            this.div(sqrt(magSq))
            this.mult(max)
        }

        return this
    }

    rotate (a = 0) {
        if (a === 0) {
            return this
        }

        let newHeading = this.heading() + a
        let mag = this.mag()

        return this.set(cos(newHeading), sin(newHeading)).mult(mag)
    }
}
