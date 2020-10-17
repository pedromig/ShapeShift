/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
// file where components are implemented

// object that kills user if his shape mass is not zero
import Character from "./Character.js";

export class Spikes {
    constructor(scene, x, y, w, h, n) {
        this.spikes = scene.physics.add.staticGroup();
        for (let i = 0; i < n; ++i)
            this.spikes.add(scene.add.triangle(x + w * i, y, 0, h, w / 2, 0, w, h, 0x1B1A1B).setOrigin(0, 1));
    }

    update() {
        return undefined;
    }

    // kill user
    collideCallback(obj) {
        obj.health = 0;
    }

    collideObjects() {
        return this.spikes;
    }
}

// object with a platform and a spring that goes down according to mass
export class SpringPlatform {
    constructor(scene, x, y, w, h, top, bottom, speed) {
        // params
        this.scene = scene;
        this.y = y;
        this.h = h;
        this.top = top;
        this.bottom = bottom;
        this.speed = speed;
        // draw platform + spring
        this.spring = scene.add.tileSprite(x + w / 2, y, 85, 590 - top, "spring").setOrigin(0.5, 1);
        this.platform = scene.add.rectangle(x, top, w, h, 0x1B1A1B).setOrigin(0);
        this.spring.setScale(1, (600 - top - h - 10) / (600 - h - top));
        // enable physics on object
        scene.physics.world.enable(this.platform);
        this.platform.body.immovable = true;
        this.platform.body.moves = false;
    }

    // wait until all conditions are met and then activate the elevator
    update() {
        if (this.rider && !this.rider.body.touching.down) this.rider = undefined;
        const PROGRESS = (this.platform.y - this.top) / (this.bottom - this.top);
        if (this.platform.body.touching.up && this.scene.player.body.mass > 1 && this.platform.y < this.bottom) {
            this.platform.y += this.speed;
            if (this.rider)
                this.rider.y += this.speed;
            this.spring.setScale(1 + PROGRESS * 0.5, (600 - this.platform.y - this.h - 10) / (600 - this.h - this.top));
        } else if (this.platform.y > this.top && !(this.platform.body.touching.up && this.scene.player.body.mass > 1)) {
            this.platform.y -= this.speed;
            if (this.rider)
                this.rider.y -= this.speed;
            this.spring.setScale(1 + PROGRESS * 0.5, (600 - this.platform.y - this.h - 10) / (600 - this.h - this.top));
        }
    }

    collideCallback(obj) {
        if (this.platform.body.touching.up)
            this.rider = obj;
    }

    // return all objects that shall collide with player and others (as needed)
    collideObjects() {
        return this.platform;
    }
}

// object that shatters when required mass is met
export class Glass {
    constructor(scene, x, y, w, h) {
        // params
        this.scene = scene;
        this.THRESHOLD = 100;
        // draw glass
        this.glass = this.scene.add.rectangle(x, y, w, h, 0xA1F7F3).setOrigin(0);
        // enable physics on object
        this.scene.physics.world.enable(this.glass);
        this.glass.body.immovable = true;
        this.glass.body.moves = false;
    }

    update() {
        this.prevVelocityY = this.scene.player.body.velocity.y;
    }

    // verify if player is using a skin strong enough to break the glass
    collideCallback(obj) {
        if (this.glass && this.glass.body.touching.up && obj.body.mass > 1 && this.prevVelocityY >= this.THRESHOLD) {
            // remove from scene
            this.glass.destroy();
            // remove from array
            this.scene.elements = this.scene.elements.filter(el => el !== this);
        }
    }

    // shapes with zero mass can go through the glass (returns undefined otherwise to keep collisions normal behavior)
    processCallback(obj) {
        if (obj.body.mass === 0.5)
            return false;
        return undefined;
    }

    // return all objects that shall collide with player and others (as needed)
    collideObjects() {
        return this.glass;
    }
}

// object that activates an eletric element (NEEDS TO BE CREATED BEFORE ACTIVATED OBJECTS CREATION)
export class PressurePlate {
    constructor(scene, x, y, timeout, ids) {
        // params
        this.scene = scene;
        this.y = y;
        this.ids = ids;
        this.timeout = timeout;
        this.active = false;
        this.wasPressed = false;
        this.pressed = false;
        // draw plate
        this.plate = scene.add.rectangle(x, y, 100, 15, 0x474447).setOrigin(0, 1);
        // active physics on object
        this.scene.physics.world.enable(this.plate);
        this.plate.body.immovable = true;
        this.plate.body.moves = false;
    }

    update() {
        if (this.wasPressed && !this.pressed) {
            this.wasPressed = false;
            setTimeout(() => {
                this.modify(false);
                this.notifyLinkedObjects(false);
                this.active = false;
            }, this.timeout);
        }
        this.pressed = false;
    }

    // verify if player is stancing on top of plate
    collideCallback(obj) {
        if (this.plate && this.plate.body.touching.up && obj.body.mass > 1) {
            this.wasPressed = this.pressed = true;
            if (!this.active) {
                this.modify(true);
                this.notifyLinkedObjects(true);
                this.active = true;
            }
        }
    }

    // return all objects that shall collide with player and others (as needed)
    collideObjects() {
        return this.plate;
    }

    modify(state) {
        this.scene.tweens.add({
            targets: this.plate,
            height: state ? 5 : 15,
            y: state ? this.y + 10 : this.y,
            duration: 500,
            ease: "Power2",
        }, this);
    }

    notifyLinkedObjects(state) {
        for (let id of this.ids)
            for (let obj of this.scene.links[id] || [])
                obj.change(state, false);
    }
}

// object that disappears when opened with a pressure plate or a robot
export class Gate {
    constructor(scene, x, y, w, h, open, direction, duration, ids) {
        // params
        this.scene = scene;
        this.width = w;
        this.height = h;
        this.open = open;
        this.direction = direction;
        this.duration = duration;
        this.active = false;
        this.inLove = false;
        // draw gate
        this.gate = this.scene.add.rectangle(x, y, w, h, 0x474447).setOrigin(0);
        // active physics on object
        scene.physics.world.enable(this.gate);
        this.gate.body.immovable = true;
        this.gate.body.moves = false;
        // add gate to level links
        for (let id of ids) {
            scene.links[id] = scene.links[id] || [];
            scene.links[id].push(this);
        }
    }

    update() {
        return undefined;
    }

    collideCallback(obj) {
        if (obj.body.embedded && obj.body.touching.down && !this.gate.body.touching.up && !this.gate.body.touching.left && !this.gate.body.touching.right)
            obj.health = 0;
    }

    processCallback(obj) {
        return undefined;
    }

    // return all objects that shall collide with player and others (as needed)
    collideObjects() {
        return this.gate;
    }

    change(state, bot) {
        if (this.inLove && !bot) return;
        this.active = state;
        this.scene.tweens.add({
            targets: this.gate,
            height: this.direction === "vertical" && state ? this.open : this.height,
            width: this.direction === "horizontal" && state ? this.open : this.width,
            duration: this.duration,
            ease: "Linear",
            onUpdate: () => this.gate.body.setSize(this.gate.width, this.gate.height),
        }, this);
    }
}

// object with two ropes and a platform that goes up and down when activated
export class Elevator {
    constructor(scene, x, y, w, h, top, bottom, progress, speed, ids) {
        // params
        this.scene = scene;
        this.y = y;
        this.top = top;
        this.bottom = bottom;
        this.speed = progress ? speed : -speed;
        this.active = false;
        this.inLove = false;
        this.switched = true;
        // draw elevator
        const PLATFORM_Y = top + Math.floor((bottom - top) * progress);
        const ROPE_WIDTH = 9;
        this.platform = scene.add.rectangle(x, PLATFORM_Y, w, h, 0x1B1A1B).setOrigin(0);
        this.leftRope = scene.add.rectangle(x + ROPE_WIDTH, y, ROPE_WIDTH, PLATFORM_Y, 0x1B1A1B).setOrigin(0);
        this.rightRope = scene.add.rectangle(x + w - ROPE_WIDTH * 2, y, ROPE_WIDTH, PLATFORM_Y, 0x1B1A1B).setOrigin(0);
        // enable physics on object
        scene.physics.world.enable(this.platform);
        this.platform.body.immovable = true;
        this.platform.body.moves = false;
        // add elevator to level links
        for (let id of ids) {
            scene.links[id] = scene.links[id] || [];
            scene.links[id].push(this);
        }
    }

    update() {
        if (this.rider && !this.rider.body.touching.down) this.rider = undefined;
        if (this.active) {
            if (this.switched && (this.platform.y <= this.top || this.platform.y >= this.bottom)) {
                this.speed *= -1;
                this.switched = false;
            }
            if (!this.switched && this.platform.y > this.top && this.platform.y < this.bottom)
                this.switched = true;

            this.platform.y += this.speed;
            if (this.rider)
                this.rider.y += this.speed;
            this.leftRope.height += this.speed;
            this.rightRope.height += this.speed;

        }
    }

    collideCallback(obj) {
        if (this.platform.body.touching.up)
            this.rider = obj;
        if (obj.body.embedded && obj.body.touching.down && !this.platform.body.touching.up && !this.platform.body.touching.left && !this.platform.body.touching.right)
            obj.health = 0;
    }

    // return all objects that shall collide with player and others (as needed)
    collideObjects() {
        return this.platform;
    }

    change(state, bot) {
        if (this.inLove && !bot) return;
        this.active = state;
    }
}

export class Projectile extends Character {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.TTL = 2;
    }

    launch(from, to) {
        this.setPosition(from.x, from.y);
        let direction = Math.atan((to.x - this.x) / (to.y - this.y));

        if (to.y >= this.y) {
            this.xSpeed = Math.sin(direction);
            this.ySpeed = Math.cos(direction);
        } else {
            this.xSpeed = -Math.sin(direction);
            this.ySpeed = -Math.cos(direction);
        }
        setTimeout(() => {
            this.setActive(false);
            this.setVisible(false);
        }, this.TTL * 1000);
    }

    update(time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
    }
}
