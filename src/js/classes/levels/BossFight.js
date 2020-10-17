/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Level from "./Level.js";
import Enemy from "../components/Enemy.js";


export default class BossFight extends Level {
    constructor() {
        super("BossFight");
    }

    create() {
        super.create();

        // Set world bounds
        this.physics.world.setBounds(0, 10, 800, 580);

        // Background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("F1F1F1");

        // Enemy creation
        this.enemy = new Enemy(this, ...this.enemySpawn, this.enemyTexture);

        // player - enemy collision
        this.physics.world.addCollider(this.player, this.enemy, () => {
            this.player.attack(this.enemy);
            if (this.enemy.name === "GHOST") {
                this.enemy.setX((Math.random() * (700 - 100 + 1)) + 100);
                this.enemy.setY((Math.random() * (300 - 200 + 1)) + 200);
                this.enemy.body.setVelocityX(this.enemy.body.velocity.x + 2);
            }
        }, null, this);

        // collision with walls
        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.enemy, this.walls);

        // collision with elements
        for (let element of this.elements) {
            this.physics.add.collider(this.player, element.collideObjects(), element.collideCallback, element.processCallback, this);
            this.physics.add.collider(this.enemy, element.collideObjects())
        }

        // health
        this.add.image(40, 40, this.player.texture).setScale(0.4);
        this.add.image(740, 40, this.enemy.texture).setScale(0.2);

        this.add.text(70, 18, "YOU", {fontSize: "20pt", color: "#000000"});
        this.add.text(610, 18, this.enemy.name, {fontSize: "20pt", color: "#000000"});

        // health bar consists of a green rectangle on top of a red rectangle and the green rectangle shrinks as health is lost
        // red rectangles
        this.add.rectangle(120, 55, 100, 20, 0xFF0000);
        this.add.rectangle(660, 55, 100, 20, 0xFF0000);
        // green rectangles
        this.player.healthBar = this.add.rectangle(120, 55, 100, 20, 0x00FF00);
        this.enemy.healthBar = this.add.rectangle(660, 55, 100, 20, 0x00FF00);

        // background fight music
        this.music = this.sound.add("background_music_bossfight", JSON.parse(localStorage.getItem("musicConfig")));
        this.music.play();
    }

    update(time, delta) {

        for (let element of this.elements)
            element.update();
        this.player.update();

        this.enemy.update(time);
        this.enemy.attack(this.player);

        if (this.player.health <= 0) {
            this.music.destroy();
            this.loss();
        }

        if (this.enemy.health <= 0) {
            this.music.destroy();
            this.victory();
            // give user won shape
            let shapes = JSON.parse(localStorage.getItem("skins"));
            if (!shapes.includes(this.enemyTexture)) {
                shapes.push(this.enemyTexture);
                localStorage.setItem("skins", JSON.stringify(shapes));
            }
        }
    }
}
