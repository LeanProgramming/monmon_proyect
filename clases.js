gsap.registerPlugin(CSSPlugin);

//se crea una clase sprite en el que se manejaran el fondo y los personajes
class Sprite {
    constructor({ position, img, frames = { max: 1, hold: 10 }, sprites, animate = false, rotation = 0 }) { //se agrega un objeto como argumento ya que así se pueden mandar los argumentos sin un orden específico
        this.position = position // argumento que se envia la posición del objeto
        this.img = new Image() //se envia la imagen a proyectar
        this.frames = { ...frames, val: 0, elapse: 0 }
        this.img.onload = () => {
            this.width = this.img.width / this.frames.max
            this.height = this.img.height
        }
        this.img.src = img.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation

    }

    draw() { //funcion que dibuja el objeto
        c.save()
        c.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        )
        c.rotate(this.rotation)
        c.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        )
        c.globalAlpha = this.opacity
        c.drawImage(
            this.img,
            this.frames.val * this.width,
            0,
            this.img.width / this.frames.max,
            this.img.height,
            this.position.x,
            this.position.y,
            this.img.width / this.frames.max,
            this.img.height
        )
        c.restore()

        if (!this.animate) return
        if (this.frames.max > 1) {
            this.frames.elapse++
        }
        if (this.frames.elapse % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++
            } else {
                this.frames.val = 0
            }
        }
    }
}

class Monster extends Sprite {
    constructor({
        position,
        img,
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,
        rotation = 0,
        name,
        isEnemy = false,
        attacks
    }) {
        super({ position, img, frames, sprites, animate, rotation })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    attack({ attack, recipient, renderedSprites }) {
        document.querySelector('#textoBatalla').style.display = 'block'
        document.querySelector('#textoBatalla').innerHTML = `${this.name} usó ${attack.name}`
        
        let healthBar = '#enemyHPBar'
        let movementDistance = 20
        let rotation = 1
        if (this.isEnemy) {
            healthBar = '#partnerHPBar'
            movementDistance = -20
            rotation = -2.5
        }

        recipient.health -= attack.damage

        switch (attack.name) {
            case 'Tacleada':
                const lineaTiempo = gsap.timeline()

                lineaTiempo.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 25,
                    y: this.position.y - movementDistance * 10,
                    duration: 0.1,
                    onComplete: () => {
                        // el enemigo es golpeado
                        audio.tacleadaHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            y: recipient.position.y - 5,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0.5,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x,
                    y: this.position.y
                })
                break;
            case 'Ascuas':
                audio.iniciarAscuas.play()
                const ascuasImg = new Image()
                ascuasImg.src = './img/fireball.png'
                const ascuas = new Sprite({
                    position: {
                        x: this.position.x + movementDistance,
                        y: this.position.y + movementDistance
                    },
                    img: ascuasImg,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })

                renderedSprites.splice(1, 0, ascuas)

                movementDistance = 20
                if (this.isEnemy) {
                    movementDistance = 100
                }
                gsap.to(ascuas.position, {
                    x: recipient.position.x + movementDistance,
                    y: recipient.position.y + movementDistance,
                    onComplete: () => {
                        audio.ascuasHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            y: recipient.position.y - 5,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0.5,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        renderedSprites.splice(1, 1)
                    }
                })
                break;
            case 'LanzaHielo':
                audio.iniciarLanzaHielo.play()
                const lanzaHieloImg = new Image()
                lanzaHieloImg.src = './img/iceSpike.png'
                movementDistance = 100
                rotation = 2.5
                if (this.isEnemy) {
                    movementDistance = 0
                    rotation = -0.5
                }
                const lanzaHielo = new Sprite({
                    position: {
                        x: this.position.x + movementDistance,
                        y: this.position.y + movementDistance
                    },
                    img: lanzaHieloImg,
                    frames: {
                        max: 8,
                        hold: 1
                    },
                    animate: true,
                    rotation
                })

                renderedSprites.splice(1, 0, lanzaHielo)

                movementDistance = 20
                if (this.isEnemy) {
                    movementDistance = 100
                }
                gsap.to(lanzaHielo.position, {
                    x: recipient.position.x + movementDistance,
                    y: recipient.position.y + movementDistance,
                    duration: 0.5,
                    onComplete: () => {
                        audio.lanzaHieloHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            y: recipient.position.y - 5,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0.5,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        renderedSprites.splice(1, 1)
                    }
                })
                break;
        }


    }
    faint() {
        document.querySelector('#textoBatalla').innerHTML = `¡${this.name} se ha debilitado!`
        
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
        audio.battle.stop()
        audio.victory.play()
        
    }
}

class Boundary {
    static width = 64;
    static height = 64;
    constructor({ position }) {
        this.position = position;
        this.width = 64;
        this.height = 64;
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.0';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
