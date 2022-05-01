const battleBackgroundImg = new Image()
battleBackgroundImg.src = './img/battleBackground.png'

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    img: battleBackgroundImg
})

let amboonFront
let amboonBehind

let iceyeFront
let iceyeBehind
let renderedSprites
let queue

let battleAnimationId;

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#textoBatalla').style.display = 'none'
    document.querySelector('#enemyHPBar').style.width = '100%'
    document.querySelector('#partnerHPBar').style.width = '100%'
    document.querySelector('#cajaDeAtaques').replaceChildren()

    amboonFront = new Monster(monsters.Amboon.front)
    amboonBehind = new Monster(monsters.Amboon.behind)
    iceyeFront = new Monster(monsters.Iceye.front)
    iceyeBehind = new Monster(monsters.Iceye.behind)
    renderedSprites = [iceyeFront, amboonBehind]
    queue = []

    amboonBehind.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#cajaDeAtaques').append(button)
    })

    //event listeners de nuestros botones de ataque

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            amboonBehind.attack({
                attack: selectedAttack,
                recipient: iceyeFront,
                renderedSprites
            })

            if (iceyeFront.health <= 0) {
                queue.push(() => {
                    iceyeFront.faint()
                })

                queue.push(() => {
                    gsap.to('#overlapping', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlapping', {
                                opacity: 0
                            })
                            audio.Map.play()
                            battle.initiated = false
                        }
                    })
                })
            }

            const randomAttack = iceyeBehind.attacks[Math.floor(Math.random() * iceyeBehind.attacks.length)]

            queue.push(() => {
                iceyeFront.attack({
                    attack: randomAttack,
                    recipient: amboonBehind,
                    renderedSprites
                })

                if (amboonBehind.health <= 0) {
                    queue.push(() => {
                        amboonBehind.faint()
                    })
    
                    queue.push(() => {
                        gsap.to('#overlapping', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#userInterface').style.display = 'none'
                                gsap.to('#overlapping', {
                                    opacity: 0
                                })
    
                                battle.initiated = false
                                audio.Map.play()
                            }
                        })
                    })
                }
            })
        })

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#tipoAtaque').innerHTML = selectedAttack.type
            document.querySelector('#tipoAtaque').style.color = selectedAttack.color
        })
        button.addEventListener('mouseleave', () => {
            document.querySelector('#tipoAtaque').innerHTML = ''
        })
    })
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)

    battleBackground.draw()
    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}


animate()

document.querySelector('#textoBatalla').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else {
        e.currentTarget.style.display = 'none';
    }

})