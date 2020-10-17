/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";

export default class PauseMenu extends Menu {
    constructor() {
        super("PauseMenu");
        this.width = 500;
        this.height = 250;
    }

    init(data) {
        this.key = data.key;
    }

    preload() {
        this.load.scenePlugin({
            key: "rexuiplugin",
            url: "../js/phaser/rexuiplugin.min.js",
            sceneKey: "rexUI"
        });
    }

    create() {
        let close = () => {
            this.scene.stop();
            this.scene.resume(this.key);
        };

        // ESC key closes pause menu
        this.input.keyboard.on("keydown_ESC", close, this);

        // blur the background
        let blur = this.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0).setAlpha(0);

        // increase "blur rectangle" alpha
        this.tweens.add({
            targets: blur,
            alpha: 0.5,
            duration: 500,
            ease: "Linear",
        }, this);

        let cont = this.add.container(this.scale.width / 2 - this.width / 2, this.scale.height / 2 - this.height / 2, [
            // rounded rectangle
            this.rexUI.add.roundRectangle(250, 150, this.width, this.height, 30, 0xE0A18F),

            // main text
            this.add.text(40, 45, "PAUSED", {
                font: "25pt Myriad Pro",
                color: "#FFFFFF"
            }),

            // close button
            this.createButton({
                mode: "Sprite", texture: "close", pixelPerfect: true,
                x: 465, y: 60,
                pointerdown: close
            })
        ]);

        // restart level
        let restartButton = this.createButton({
            mode: "Container", secondary: "Rectangle",
            x: 250, y: 115, width: 250, height: 45, fillColor: 0xB73721,
            text: "RESTART",
            pointerdown: () => {
                this.scene.stop();
                let scene = this.scene.get(this.key);
                if (scene.music != null)
                    scene.music.destroy();
                this.scene.get(this.key).scene.restart();
            },
            pointerover: () => this.buttonTweenIn(restartButton).play(),
            pointerout: () => this.buttonTweenOut(restartButton).play()
        });

        // open options menu
        let optionsMenuButton = this.createButton({
            mode: "Container", secondary: "Rectangle",
            x: 250, y: 175, width: 250, height: 45, fillColor: 0xB73721,
            text: "OPTIONS",
            pointerdown: () => {
                this.scene.launch("OptionsMenu", {key: this.scene.key});
                this.scene.bringToTop("OptionsMenu");
                this.scene.pause();
            },
            pointerover: () => this.buttonTweenIn(optionsMenuButton).play(),
            pointerout: () => this.buttonTweenOut(optionsMenuButton).play()
        });

        // exit to main menu
        let mainMenuButton = this.createButton({
            mode: "Container", secondary: "Rectangle",
            x: 250, y: 235, width: 250, height: 45, fillColor: 0xB73721,
            text: "EXIT TO MAIN MENU",
            pointerdown: () => {
                let scene = this.scene.get(this.key);
                if (scene.music != null)
                    scene.music.destroy();
                this.scene.stop(this.key);
                this.scene.stop("LevelSelectionMenu");
                this.scene.stop();
                this.sound.resumeAll();
                this.scene.resume("MainMenu");
            },
            pointerover: () => this.buttonTweenIn(mainMenuButton).play(),
            pointerout: () => this.buttonTweenOut(mainMenuButton).play()
        });

        cont.add([restartButton, mainMenuButton, optionsMenuButton]);
    }
}