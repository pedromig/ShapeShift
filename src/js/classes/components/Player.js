/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Character from "./Character.js";
import ShiftCollisionDetector from "./ShiftCollisionDetector.js";

export default class Player extends Character {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        // player properties
        this.health = 100;
        this.healthBar = null;
        this.currentShape = this.newShape = texture;
        this.shapes = JSON.parse(localStorage.getItem("skins"));
        this.shapeShiftDelay = 200;
        this.hitTimeout = false;
        this.HIT_TIMEOUT = 1.5;

        // player controls
        this.gamepad = scene.input.keyboard.addKeys({
            right1: Phaser.Input.Keyboard.KeyCodes.D,
            right2: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            left1: Phaser.Input.Keyboard.KeyCodes.A,
            left2: Phaser.Input.Keyboard.KeyCodes.LEFT,
            jump1: Phaser.Input.Keyboard.KeyCodes.W,
            jump2: Phaser.Input.Keyboard.KeyCodes.UP,
            down1: Phaser.Input.Keyboard.KeyCodes.S,
            down2: Phaser.Input.Keyboard.KeyCodes.DOWN,
            jump3: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift1: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        });

        // define player's skin
        this.setTexture(this.currentShape);

        // set physics properties
        this.getShapeInfo();

        this.anims.load(this.currentShape);

        this.scene.events.on("shapeshift", this.shapeShift, this);
    }

    update(time) {
        // handle shape shifting
        if (this.currentShape !== this.newShape) {
            if (this.detector.body.embedded) {
                this.newShape = this.currentShape;
            } else {
                this.reload(this.newShape);
                this.anims.stop();
                this.anims.load(this.newShape);
                this.currentShape = this.newShape;
                this.getShapeInfo();

                // repeat animation (infinite)
                if (this.scene.anims.get(this.currentShape).repeat === -1)
                    this.play(this.currentShape);

                // activate/deactivate eletric elements
                for (let elements of Object.values(this.scene.links)) {
                    for (let element of elements) {
                        if (this.eletric) {
                            element.inLove = true;
                            if (!element.active)
                                element.change(true, true);
                        } else if (!this.eletric && element.inLove) {
                            element.inLove = false;
                            element.change(false, false);
                        }
                    }
                }

                // increment shifts
                if (this.scene.shifts !== undefined) {
                    if(this.scene.shifts === 9)
                        this.scene.shiftsText.x -= 5;
                    if(this.scene.shifts >= this.scene.maxShifts)
                        this.scene.shiftsText.setColor("#EB4B48");
                    this.scene.shiftsText.text = ++this.scene.shifts;
                    // TODO make red if bigger than maxShifts 
                }

                this.timeout = true;
                setTimeout(() => this.timeout = false, this.shapeShiftDelay)
            }
            this.detector.destroy();
        }
        // check for need to play animation
        if (this.body.velocity.x !== 0 || (this.body.velocity.y !== 0 && this.texture.key === "ghost"))
            this.anims.play(this.anims.currentAnim.key, true);

        // check for pressed keys and execute operations accordingly
        for (let key of Object.keys(this.gamepad)) {
            if (this.gamepad[key].isDown) {
                switch (key.substring(0, key.match(/\d/).index)) {
                    case "right":
                        this.body.velocity.x += this.speedX;
                        break;
                    case "left":
                        this.body.velocity.x += -this.speedX;
                        break;
                    case "jump":
                        if (this.body.blocked.down || this.body.touching.down || this.texture.key === "ghost")
                            this.body.velocity.y += -this.speedY;
                        break;
                    case "down":
                        if (this.texture.key === "ghost")
                            this.body.velocity.y += this.speedY;
                        break;
                    case "shift":
                        if (!this.timeout && this.shapes.length > 1) {
                            this.resetKeys();
                            this.scene.scene.pause();
                            this.scene.scene.launch("ShiftMenu", {
                                key: this.scene.scene.key,
                                currentShape: this.currentShape,
                                shapes: this.shapes
                            });
                            this.timeout = true;
                            setTimeout(() => (this.timeout = false), this.shapeShiftDelay);
                        }
                        break;
                }
            }
        }
    }

    shapeShift(shape, scene) {
        this.scene = scene;
        this.newShape = shape;
        this.detector = new ShiftCollisionDetector(this.scene, this.x, this.y - 1, this.newShape);
    }

    // essential to execute before scene pause
    resetKeys() {
        for (let key of Object.keys(this.gamepad))
            this.gamepad[key].isDown = false;
    }

    attack(enemy) {
        if (!this.hitTimeout) {
            enemy.health -= Math.floor(Math.random() * 30) + 20;
            enemy.updateHealthBar(enemy.health / 100)
            this.hitTimeout = true;
            setTimeout(() => (this.hitTimeout = false), this.HIT_TIMEOUT * 1000);
        }
    }

    damage() {
        this.health -= Math.floor(Math.random() * 30) + 20;
        this.updateHealthBar(this.health / 100);
    }

    updateHealthBar(percentage) {
        if (this.healthBar)
            this.healthBar.setSize(this.healthBar.width * percentage, this.healthBar.height);
    }
}