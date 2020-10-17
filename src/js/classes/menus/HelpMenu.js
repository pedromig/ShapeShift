/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";

export default class HelpMenu extends Menu {
    constructor() {
        super("HelpMenu");
        this.width = 500;
        this.height = 400;
    }

    create() {
        let textStyle = {font: "17pt Myriad Pro", color: "#FFFFFF", wordWrap: {width: 460, useAdvancedWrap: true}};
        let graphics = this.add.graphics();

        let texts = [
            "Complete chapters in order to conquer a new shape",
            "Certain shapes have special habilites required to win a level",
            "A,D or left/right arrow keys to move",
            "W or SPACE to jump",
            "ESC to pause"
        ];

        this.add.container(this.scale.width / 2 - this.width / 2, this.scale.height / 2 - this.height / 2, [
            graphics.fillStyle(0xE0A18F),
            graphics.fillRoundedRect(0, 0, this.width, this.height, 30),
            this.add.text(40, 25, "HELP", textStyle),
            this.createButton({
                mode: "Sprite", texture: "close", x: 460, y: 34, pixelPerfect: true,
                pointerdown: () => {
                    this.scene.stop();
                    this.scene.resume("MainMenu");
                }
            })
        ]);

        let y = 170;
        for (let text of texts) {
            this.add.text(170, y, "• " + text, textStyle);
            y += 60;
        }
    }
}