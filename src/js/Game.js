/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";

import "./phaser/phaser.js";
import config from "./configs/config.js";

import Introduction from "./classes/menus/Introduction.js";
import Credits from "./classes/menus/Credits.js";
import MainMenu from "./classes/menus/MainMenu.js";
import LevelSelectionMenu from "./classes/menus/LevelSelectionMenu.js";
import Ranking from "./classes/ranking/Ranking.js";

import OptionsMenu from "./classes/menus/OptionsMenu.js";
import RegisterMenu from "./classes/menus/RegisterMenu.js";
import HelpMenu from "./classes/menus/HelpMenu.js";
import PauseMenu from "./classes/menus/PauseMenu.js";
import ShiftMenu from "./classes/menus/ShiftMenu.js";
import DialogInOut from "./classes/menus/DialogInOut.js";

import PuzzleLevel from "./classes/levels/PuzzleLevel.js";
import BossFight from "./classes/levels/BossFight.js";

// Starts game immediately after the browser loads
(() => {
    window.onload = () => {

        WebFont.load({
            custom: {
                families: ['Bebas Neue'],
                urls: ["../../src/css/styles.css"]
            }
        });
        new ShapeShiftGame();
    }
})();


class ShapeShiftGame extends Phaser.Game {
    constructor() {
        super(config);

        this.scene.add("Introduction", Introduction, true);
        this.scene.add("Credits", Credits);

        // Full Menus
        this.scene.add("MainMenu", MainMenu);
        this.scene.add("LevelSelectionMenu", LevelSelectionMenu);
        this.scene.add("Ranking", Ranking);

        // Floating Menus
        this.scene.add("OptionsMenu", OptionsMenu);
        this.scene.add("RegisterMenu", RegisterMenu);
        this.scene.add("HelpMenu", HelpMenu);
        this.scene.add("PauseMenu", PauseMenu);
        this.scene.add("ShiftMenu", ShiftMenu);
        this.scene.add("DialogInOut", DialogInOut);

        this.scene.add("PuzzleLevel", PuzzleLevel);
        this.scene.add("BossFight", BossFight);
    }

    close() {
        setTimeout(() => {
            window.close();
        }, 500);
    }
}
