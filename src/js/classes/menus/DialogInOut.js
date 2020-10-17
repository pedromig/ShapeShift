/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";

export default class DialogInOut extends Menu {
    constructor() {
        super("DialogInOut");
        this.width = 500;
        this.height = 250;
    }

    init(data) {
        this.key = data.key;
        this.victory = data.victory;
        this.level = data.level;
        this.chapterNumber = data.chapterNumber;
        this.levelNumber = data.levelNumber;
        this.score = data.score;
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: '../js/phaser/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        this.scene.bringToTop();

        // blur the background (alpha increased later)
        let blur = this.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0).setAlpha(0);

        this.bossFight = this.key !== "PuzzleLevel";

        // main container
        let cont = this.add.container(this.scale.width / 2 - this.width / 2, -100, [
            // rounded rectangle
            this.rexUI.add.roundRectangle(250, 150, this.width, this.height, 30, 0xE0A18F),
            this.add.text(150, 70, this.victory ? "VICTORY!" : "YOU LOST...", {
                font: "30pt Myriad Pro",
                color: "#FFFFFF"
            }),

            this.createButton({
                mode: "Container", secondary: "Rectangle",
                x: 120, y: 210, width: 150, height: 20,
                text: "EXIT", textStyle: {
                    font: "25pt Myriad Pro",
                    color: "#FFFFFF"
                },
                // animation "out"
                pointerdown: () => {
                    this.tweens.add({
                        targets: cont,
                        x: this.scale.width / 2 - this.width / 2,
                        y: -100,
                        duration: 600,
                        ease: "Linear",
                        onComplete: this.exit,
                        onCompleteScope: this
                    }, this);
                }
            }),
            this.createButton({
                mode: "Container", secondary: "Rectangle",
                x: 350, y: 210, width: 150, height: 20,
                text: this.victory ? "CONTINUE" : "RETRY", textStyle: {
                    font: "25pt Myriad Pro",
                    color: "#FFFFFF"
                },
                // animation "out"
                pointerdown: () => {
                    this.tweens.add({
                        targets: cont,
                        x: this.scale.width / 2 - this.width / 2,
                        y: -100,
                        duration: 600,
                        ease: "Linear",
                        onComplete: this.victory ? (this.bossFight ? this.terminate : this.nextLevel) : this.terminate,
                        onCompleteScope: this
                    }, this);
                }
            })
        ]);

        this.victory ? cont.add(this.add.text(160, 120, "Score: " + this.score, {
            font: "30pt Myriad Pro",
            color: "#73ff8a"
        })) : undefined;

        // increase "blur rectangle" alpha
        this.tweens.add({
            targets: blur,
            alpha: 0.5,
            duration: 600,
            ease: "Linear",
        }, this);

        // animation "in"
        this.tweens.add({
            targets: cont,
            x: this.scale.width / 2 - this.width / 2,
            y: this.scale.height / 2 - this.height / 2,
            duration: 600,
            ease: "Linear",
        }, this);
    }

    exit() {
        this.scene.stop();
        this.scene.get(this.key).scene.stop();
        this.scene.get("MainMenu").sound.resumeAll();
        this.scene.resume("LevelSelectionMenu");
    }

    terminate() {
        if (this.victory) {
            this.exit();
        } else {
            this.scene.stop();
            this.scene.get(this.key).scene.restart();
        }
    }

    nextLevel() {
        if (this.bossFight) {
            this.terminate();
            return;
        }

        let json = this.cache.json.get("level_info");
        if (this.levelNumber === json[this.chapterNumber].levels.length - 1) {
            this.levelNumber = 0;
            this.chapterNumber = (this.chapterNumber + 1) % json.length;
        } else
            this.levelNumber++;

        if (json[this.chapterNumber].levels[this.levelNumber].type !== "puzzle") {
            this.terminate();
            return;
        }

        this.scene.get(this.key).scene.restart({
            level: json[this.chapterNumber].levels[this.levelNumber],
            chapterNumber: this.chapterNumber,
            levelNumber: this.levelNumber
        });
        this.scene.stop();
    }
}