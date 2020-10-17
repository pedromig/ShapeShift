/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Level from "./Level.js";

export default class PuzzleLevel extends Level {
    constructor() {
        super("PuzzleLevel");
    }

    preload() {
        super.preload();
    }

    create() {
        super.create();
        // win condition
        switch (this.level.doors.exit.wall) {
            case "left":
                this.won = (pos) => pos.x < -50;
                break;
            case "right":
                this.won = (pos) => pos.x > this.width + 50;
                break;
            case "top":
                this.won = (pos) => pos.y < -150;
                break;
            case "bottom":
                this.won = (pos) => pos.y > this.height + 50;
                break;
        }
    }

    update(time, delta) {
        super.update(time, delta);

        // check if level was won
        if (this.won({x: this.player.body.x, y: this.player.body.y}))
            this.victory();
    }
}