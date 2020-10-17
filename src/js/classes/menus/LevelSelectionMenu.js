/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";

export default class LevelSelectionMenu extends Menu {
    constructor() {
        super("LevelSelectionMenu");
        this.chapterButtons = [];
    }

    create() {
        // json file ("levels.json")
        this.level_info = this.cache.json.get("level_info");

        // load user data from localStorage
        this.getUserData();

        // background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("B73721");

        // logo
        this.add.sprite(639, 95, 'logo')
            .setScale(0.55)
            .play("logo");

        // "CHOOSE LEVEL"
        this.add.text(50, 75, "CHOOSE LEVEL", {font: '45pt Myriad Pro', color: '#FFFFFF'});

        // back button
        let backButton = this.createButton({
            mode: "Container",
            secondary: "Rectangle",
            x: 62,
            y: 575,
            width: 111,
            height: 31,
            fillColor: 0x9B4126,
            text: "BACK",
            textStyle: {font: '10pt Myriad Pro', color: '#FFFFFF'},
            pointerdown: () => {
                this.scene.stop();
                this.scene.resume("MainMenu");
            },
            pointerover: () => this.buttonTweenIn(backButton).play(),
            pointerout: () => this.buttonTweenOut(backButton).play()
        });

        // options
        let optionsButton = this.createButton({
            mode: "Sprite",
            texture: "options",
            pixelPerfect: true,
            x: 760,
            y: 560,
            pointerdown: () => {
                this.scene.launch("OptionsMenu", {key: this.scene.key});
                this.scene.pause();
            },
            pointerover: () => this.buttonTweenIn(optionsButton).play(),
            pointerout: () => this.buttonTweenOut(optionsButton).play()
        });
        // options' button animation
        this.tweens.add({
            targets: optionsButton,
            angle: 360,
            duration: 20000,
            ease: 'Power2',
            yoyo: true,
            repeat: -1,
        }, this);

        // create array containing navigation elements (text and then it will have both arrows in it)
        this.navigation = {
            textBox: this.add.container(400, 575, [
                this.add.sprite(0, 0, 'button_level').setScale(0.4, 0.6),
                this.add.text(0, 0, "", {fontFamily: "Bernard MT Condensed"}).setOrigin(0.5)
            ]),
        };

        // create navigation arrows
        for (let arrow of [["leftArrow", "<", 325], ["rightArrow", ">", 477]])
            this.navigation[arrow[0]] = this.add.container(arrow[2], 575, [
                this.add.sprite(0, 0, 'button_level')
                    .setScale(0.1, 0.6)
                    .setInteractive({pixelPerfect: true, useHandCursor: true})
                    .on('pointerdown', arrow[1] === "<" ? () => this.showPage(-1) : () => this.showPage(1)),
                this.add.text(0, 0, arrow[1], {font: "20pt Bernard MT Condensed"}).setOrigin(0.5)
            ]);

        // levels
        this.FIRST_PAGE = 0;
        this.LAST_PAGE = this.level_info.length - 1;
        this.showPage(0);

        // refresh page when user finishes level (emitted in PuzzleLevel.js or BossFight.js)
        // operations like these make the program computionally more efficient since we don't have to restart the scene but just change some things
        let refreshFunction = () => {
            this.getUserData();
            this.showPage(0);
        };
        this.scene.get("PuzzleLevel").events.on("refreshLevels", refreshFunction, this);
        this.scene.get("BossFight").events.on("refreshLevels", refreshFunction, this);
    }

    // get user data from localStorage
    getUserData() {
        this.playerLevels = JSON.parse(localStorage.getItem("levelsReached"));
        this.currentChapter = 0;//this.playerLevels.length - 1;
    }

    // changes levels' page according to current chapter
    showPage(change) {
        this.currentChapter += change;

        // clean page
        for (let button of this.chapterButtons)
            button.destroy();

        // change chapter name on navigation textbox
        this.navigation.textBox.getAt(1).setText(this.level_info[this.currentChapter].name);
        this.navigation.textBox.getAt(1).setFontSize("12pt");

        switch (this.currentChapter) {
            case this.FIRST_PAGE:
                this.navigation["leftArrow"].setAlpha(0).getAt(0).disableInteractive();
                this.navigation["rightArrow"].setAlpha(255).getAt(0).setInteractive({
                    pixelPerfect: true,
                    useHandCursor: true
                });
                break;

            case this.LAST_PAGE:
                this.navigation["rightArrow"].setAlpha(0).getAt(0).disableInteractive();
                this.navigation["leftArrow"].setAlpha(255).getAt(0).setInteractive({
                    pixelPerfect: true,
                    useHandCursor: true
                });
                break;

            default:
                this.navigation["leftArrow"].setAlpha(255).getAt(0).setInteractive({
                    pixelPerfect: true,
                    useHandCursor: true
                });
                this.navigation["rightArrow"].setAlpha(255).getAt(0).setInteractive({
                    pixelPerfect: true,
                    useHandCursor: true
                });
        }

        // create level buttons and check if they are boss levels and/or locked levels
        let i = 1,
            x = 200,
            y = 235;
        for (let [levelNumber, level] of this.level_info[this.currentChapter].levels.entries()) {
            let unlocked = levelNumber <= this.playerLevels[this.currentChapter];
            let button = this.add.container(x, y, [
                this.add.sprite(0, 0, "button_level"),
                this.add.text(-120, 0, level.type === "puzzle" ? levelNumber + 1 : "B", {font: "21pt Bernard MT Condensed"}).setOrigin(0.5),
                this.add.text(-100, -13, unlocked ? level.name : "LOCKED", {font: "19pt Bernard MT Condensed"})
            ]);

            // add button to buttons array
            this.chapterButtons.push(button);

            if (unlocked)
                button.getAt(0)
                    .setInteractive({useHandCursor: true})
                    .on('pointerdown', () => {
                        this.scene.get("MainMenu").sound.pauseAll();
                        this.game.canvas.style.cursor = "default";
                        this.scene.run(level.type === "puzzle" ? "PuzzleLevel" : "BossFight", {
                            level: level,
                            chapterLength: this.level_info[this.currentChapter].levels.length,
                            chapterNumber: this.currentChapter,
                            levelNumber: levelNumber
                        });
                        this.scene.pause();
                    })
                    .on("pointerover", () => this.buttonTweenIn(button).play())
                    .on("pointerout", () => this.buttonTweenOut(button).play());
            else
                button.getAt(0).setTint(0x515254);

            y += 100;
            i++;
            if (i % 4 === 0) {
                x = 600;
                y = 235;
            }
        }
    }
}