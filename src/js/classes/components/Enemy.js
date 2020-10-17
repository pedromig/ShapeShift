/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Character from "./Character.js";
import {Projectile} from "./LevelComponents.js";


export default class Enemy extends Character {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // enemy info
        this.name = texture.toUpperCase();
        this.currentShape = texture;
        this.health = 100;
        this.healthBar = null;

        // set physics properties
        super.getShapeInfo();

        this.bullets = this.scene.physics.add.group({
            classType: Projectile,
            maxSize: 20,
            runChildUpdate: true,
            allowGravity: false,
        });
        this.timeout = true;
        this.PROJECTILE_TIMEOUT = 1.5;
        setTimeout(() => (this.timeout = false), 2000);
        this.anims.load(this.currentShape);
        this.anims.play(this.currentShape, true);
        this.mods()
    }

    mods() {

        switch (this.name) {
            case "EYE":
                this.body.setImmovable(true);
                break;
            case "LOVE":
                this.elems = this.scene["elements"].filter(elem => (elem.active != null || elem.active !== undefined));
                this.elems.map(elem => elem.change(true, true));
                this.electricOn = true;
                this.electricTimeout = false;
                break;

            case "GHOST":
                this.speedX = 2;
                this.directionX = false;
                break;
        }
    }

    electricUpdate() {
        if (!this.electricTimeout) {
            this.electricTimeout = true;
            setTimeout(() => {
                this.elems.map(elem => {
                    elem.change(this.electricOn, this.electricOn);
                });
                this.electricOn = !this.electricOn;
                this.electricTimeout = false;
            }, 600);
        }
    }

    update(time) {
        this.anims.play(this.currentShape, true);
        let oldHealth = this.health;

        if (this.health !== oldHealth)
            this.updateHealthBar();
    }

    attack(player) {
        switch (this.name) {
            case "LOVE":
                this.shoot(player, "heart");
                this.electricUpdate();
                break;
            case "GHOST":
                this.shoot(player, "pacman")
                this.ghostUpdate();
                break;
            default:
                break;
        }

    }

    damage() {
        this.health -= Math.floor(Math.random() * 30) + 20;
        this.updateHealthBar(this.health / 100);
    }

    updateHealthBar(percentage) {
        this.healthBar.setSize(this.healthBar.width * percentage, this.healthBar.height);
    }


    shoot(player, bulletTexture) {
        if (!this.timeout) {
            let projectile = this.bullets.get().setActive(true).setVisible(true);
            projectile.setTexture(bulletTexture).setScale(0.05);
            if (projectile) {
                projectile.launch(this.getCenter(), player.getCenter());
                this.scene.physics.add.collider(player, projectile, () => {
                    if (projectile.active) {
                        player.damage();
                        projectile.setActive(false).setVisible(false);
                    }
                });
                this.timeout = true;
                setTimeout(() => (this.timeout = false), this.PROJECTILE_TIMEOUT * 1000);
            }
        }
    }

    ghostUpdate() {
        if (!this.down && this.directionX && this.x > 700) {
            this.speedX = 2;
            this.directionX = !this.directionX;
        }
        if (!this.down && !this.directionX && this.x < 100) {
            this.speedX = -this.speedX;
            this.directionX = !this.directionX;
        }
        this.x -= this.speedX;
    }

}





