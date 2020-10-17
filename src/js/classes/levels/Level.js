/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import {updateUserScore} from "../ranking/Ranking.js";
import {Elevator, Spikes, SpringPlatform, Glass, PressurePlate, Gate} from "../components/LevelComponents.js";
import Player from "../components/Player.js";

// "abstract" class base of BossFight and PuzzleLevel
export default class Level extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(data) {
        // unpack given data
        this.level = data.level;
        this.chapterLength = data.chapterLength;
        this.chapterNumber = data.chapterNumber;
        this.levelNumber = data.levelNumber;
    }

    preload() {
    }

    create() {
        //let graphics = this.add.graphics();
        //let textStyle = {font: "18pt Baskerville Old Face", color: "#000000"};

        // ESC key opens pause menu
        this.input.keyboard.on("keydown_ESC", this.openPauseMenu, this);

        // world properties
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.elements = [];

        // background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("F1F1F1");

        // create static elements
        this.walls = this.physics.add.staticGroup();
        this.links = {};

        // draw everything
        for (let [property, value] of Object.entries(this.level)) {
            switch (property) {
                case "spawn":
                    this.spawn = value;
                    break;
                case "shifts":
                    this.scoreContainer = this.add.container(...value.coords, [
                        this.add.text(0, 0, "/" + value.number + " shifts left.", value.style).setOrigin(0.5)
                    ]).setDepth(1);
                    this.shiftsText = this.add.text(-this.scoreContainer.getAt(0).width / 2 - 7, 0, 0, value.style).setOrigin(0.5);
                    this.scoreContainer.add(this.shiftsText);
                    this.shifts = 0;
                    this.maxShifts = value.number;
                    break;
                case "doors":
                    for (let wall of ["left", "right", "top", "bottom"]) {
                        let door = value.entrance.wall === wall ? value.entrance : value.exit.wall === wall ? value.exit : null;
                        let max = (wall === "left" || wall === "right" ? this.height : this.width);
                        let params = {x: 0, y: 0, w: 10, h: door ? door.offset : max};
                        if (wall === "right" || wall === "bottom")
                            params.x += (wall === "right" ? this.width : this.height) - 10;
                        if (wall === "top" || wall === "bottom")
                            [params.x, params.y, params.w, params.h] = [params.y, params.x, params.h, params.w];
                        this.walls.add(this.add.rectangle(params.x, params.y, params.w, params.h, 0x1B1A1B).setOrigin(0));
                        if (door) {
                            if (wall === "left" || wall === "right")
                                this.walls.add(this.add.rectangle(params.x, params.y + params.h + 200, 10, max, 0x1B1A1B).setOrigin(0));
                            else
                                this.walls.add(this.add.rectangle(params.x + params.w + 200, params.y, max, 10, 0x1B1A1B).setOrigin(0));
                        }
                    }
                    break;
                case "messages":
                    for (let message of value)
                        this.add.text(...message.coords, message.text, message.style).setOrigin(0.5).setDepth(1);
                    break;
                case "platforms":
                    for (let platform of value)
                        this.walls.add(this.add.rectangle(...platform, 0x1B1A1B).setOrigin(0));
                    break;
                case "elevators":
                    for (let elevator of value)
                        this.elements.push(new Elevator(this, ...elevator.coords, ...elevator.size, ...elevator.interval, elevator.progress, elevator.speed, elevator.ids));
                    break;
                case "spikes":
                    for (let spikes of value)
                        this.elements.push(new Spikes(this, ...spikes.coords, ...spikes.size, spikes.number));
                    break;
                case "springs":
                    for (let spring of value)
                        this.elements.push(new SpringPlatform(this, ...spring.coords, ...spring.size, ...spring.interval, spring.speed));
                    break;
                case "glass":
                    for (let glass of value)
                        this.elements.push(new Glass(this, ...glass));
                    break;
                case "plates":
                    for (let plate of value)
                        this.elements.push(new PressurePlate(this, ...plate.coords, plate.timeout, plate.ids));
                    break;
                case "gates":
                    for (let gate of value)
                        this.elements.push(new Gate(this, ...gate.shape, gate.open, gate.orientation, gate.duration, gate.ids));
                    break;
                case "enemy":
                    this.enemySpawn = value.coords;
                    this.enemyTexture = value.skin;
                    break;
            }
        }

        // set bounds
        let exit = this.level.doors.exit;
        let bounds = [0, 0, 800, 600];
        if (exit.wall === "left" || exit.wall === "right")
            bounds[2] += 200;
        else
            bounds[3] += 200;
        if (exit.wall === "left")
            bounds[0] -= 100;
        else if (exit.wall === "top")
            bounds[1] -= 200;
        this.physics.world.setBounds(...bounds);

        // create player
        if (this.spawn === "auto") {
            let entrance = this.level.doors.entrance;
            this.spawn = [(entrance.wall === "left" || entrance.wall === "top") ? 30 : (entrance.wall === "left" || entrance.wall === "right" ? this.width : this.height) - 30, entrance.offset + 200];
            if (entrance.wall === "top" || entrance.wall === "bottom") {
                this.spawn[1] -= 100;
                [this.spawn[0], this.spawn[1]] = [this.spawn[1], this.spawn[0]];
            }
        }

        this.player = new Player(this, ...this.spawn, "player");
    }

    update(time, delta) {
        for (let element of this.elements)
            element.update();
        this.player.update(time);

        if (this.player.health <= 0) {
            this.loss();
        }
    }

    victory() {
        // update levelsReached
        let levels = this.cache.json.get("level_info");
        let reachedLevels = JSON.parse(localStorage.getItem("levelsReached"));
        if (reachedLevels[this.chapterNumber] <= this.levelNumber) {
            if ((this.levelNumber === (levels[this.chapterNumber].levels.length - 1)) && (this.chapterNumber === reachedLevels.length - 1))
                reachedLevels.push(0);
            else
                reachedLevels[this.chapterNumber] = this.levelNumber + 1;
            localStorage.setItem("levelsReached", JSON.stringify(reachedLevels));
            this.events.emit("refreshLevels");
        }

        // update levelsScore
        let score, userScores = JSON.parse(localStorage.getItem("levelsScores"));
        if (this.shifts === this.maxShifts)
            score = 300;
        else {
            score = 300 - (this.shifts - this.maxShifts) * 100;
            if (score < 0)
                score = 0;
        }

        if (userScores[this.chapterNumber] === undefined)
            userScores[this.chapterNumber] = {};

        if (userScores[this.chapterNumber][this.levelNumber] === undefined || userScores[this.chapterNumber][this.levelNumber] < score) {
            userScores[this.chapterNumber][this.levelNumber] = score;
            let sumScore = Object.values(userScores).reduce((sum, key) => sum + Object.values(key).reduce((a, b) => a + b, 0), 0);
            localStorage.setItem("levelsScores", JSON.stringify(userScores));
            localStorage.setItem("score", sumScore);
            updateUserScore(localStorage.getItem("username"), sumScore);
        }

        this.scene.pause();
        // open victory dialog box
        this.scene.launch("DialogInOut", {
            key: this.scene.key,
            victory: true,
            chapterNumber: this.chapterNumber,
            levelNumber: this.levelNumber,
            score: score
        });
    }

    loss() {
        this.scene.pause();
        // open loss dialog box
        this.scene.launch("DialogInOut", {
            key: this.scene.key,
            victory: false,
            chapterNumber: this.chapterNumber,
            levelNumber: this.levelNumber
        });
        this.player.updateHealthBar(0);
    }

    openPauseMenu() {
        this.player.resetKeys();

        this.scene.launch("PauseMenu", {key: this.scene.key});
        this.scene.bringToTop("PauseMenu");
        this.scene.pause();
    }
}