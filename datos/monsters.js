const monsters = {
    Amboon: {
        front: {
            position: {
                x: 800,
                y: 100
            },
            img: {
                src: './img/amboonFront.png'
            },
            frames: {
                max: 4,
                hold: 20
            },
            animate: true,
            isEnemy: true,
            name: 'Amboon',
            attacks: [attacks.Tacleada, attacks.Ascuas]
        },
        behind:{
            position: {
                x: 220,
                y: 240
            },
            img: {
                src: './img/amboonBehind.png'
            },
            frames: {
                max: 4,
                hold: 20
            },
            animate:true,
            name: 'Amboon',
            attacks: [attacks.Tacleada, attacks.Ascuas]
        }
    },
    Iceye: {
        front: {
            position: {
                x: 800,
                y: 100
            },
            img: {
                src: './img/iceyeFront.png'
            },
            frames: {
                max: 4,
                hold: 15
            },
            animate: true,
            isEnemy: true,
            name: 'Iceye',
            attacks: [attacks.Tacleada, attacks.LanzaHielo]
        },
        behind: {
            position: {
                x: 220,
                y: 240
            },
            img: {
                src: './img/iceyeBehind.png'
            },
            frames: {
                max: 4,
                hold: 15
            },
            animate:true,
            name: 'Iceye',
            attacks: [attacks.Tacleada, attacks.LanzaHielo]
        }
    }
}