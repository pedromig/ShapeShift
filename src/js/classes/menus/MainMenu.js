/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";

export default class MainMenu extends Menu {
    constructor() {
        super("MainMenu")
    }

    create() {
        // background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("B73721");

        // useful textstyle used in buttons's text
        let textStyle = {font: "28pt Myriad Pro", color: "#FFFFFF"};

        // logo button
        this.createButton({
            mode: "Sprite", texture: "logo", pixelPerfect: true,
            x: 400, y: 125,
            pointerdown: () => {
                this.scene.launch("Credits");
                this.scene.moveDown();
                this.scene.pause();
                this.sound.pauseAll();
            }
        }).setScale(0.7).play("logo");
        let clickMeText = this.add.text(440, 65, "CLICK ME", {font: "10pt Myriad Pro"}).setOrigin(0.5)
            .setAngle(-15)
            .setAlpha(0);
        this.tweens.add({
            targets: clickMeText,
            alpha: 1,
            angle: 15,
            duration: 3000,
            ease: "Power4",
            yoyo: true,
            repeat: -1,
        }, this);

        // play button
        let playButton = this.createButton({
            mode: "Container", secondary: "Sprite", texture: "button",
            x: 400, y: 260,
            text: "PLAY", textStyle: textStyle,
            pointerdown: () => {
                this.scene.launch("LevelSelectionMenu");
                this.scene.pause()
            },
            pointerover: () => this.buttonTweenIn(playButton).play(),
            pointerout: () => this.buttonTweenOut(playButton).play()
        });

        // ranking button
        let rankingButton = this.createButton({
            mode: "Container", secondary: "Sprite", texture: "button",
            x: 400, y: 340,
            text: "RANKING", textStyle: textStyle,
            pointerdown: () => {
                this.scene.launch("Ranking");
                this.scene.pause();
            },
            pointerover: () => this.buttonTweenIn(rankingButton).play(),
            pointerout: () => this.buttonTweenOut(rankingButton).play()
        });

        // exit button
        let exitButton = this.createButton({
            mode: "Container", secondary: "Sprite", texture: "button",
            x: 400, y: 420,
            text: "EXIT", textStyle: textStyle,
            pointerdown: () => this.game.close(),
            pointerover: () => this.buttonTweenIn(exitButton).play(),
            pointerout: () => this.buttonTweenOut(exitButton).play()
        });

        // options button
        let optionsButton = this.createButton({
            mode: "Sprite", texture: "options", pixelPerfect: true,
            x: 350, y: 510,
            pointerdown: () => {
                this.scene.launch("OptionsMenu", {key: this.scene.key});
                this.scene.pause();
            },
            pointerover: () => this.buttonTweenIn(optionsButton).play(),
            pointerout: () => this.buttonTweenOut(optionsButton).play()
        });
        this.tweens.add({
            targets: optionsButton,
            angle: 360,
            duration: 20000,
            ease: "Power2",
            yoyo: true,
            repeat: -1,
        }, this);

        // help button
        let helpButton = this.createButton({
            mode: "Sprite", texture: "help",
            x: 450, y: 510,
            pointerdown: () => {
                this.scene.launch("HelpMenu");
                this.scene.pause();
            },
            pointerover: () => this.buttonTweenIn(helpButton).play(),
            pointerout: () => this.buttonTweenOut(helpButton).play()
        });

        // cheat button
        this.createButton({
            mode: "Container", secondary: "Rectangle",
            x: 25, y: 575, width: 50, height: 50,
            pointerdown: () => {
                localStorage.setItem("levelsReached", JSON.stringify([6, 6, 6, 6]));
                localStorage.setItem("skins", JSON.stringify(["player", "eye", "love", "ghost"]));
                alert("You have now entered God Mode\nAccess to all levels and shapes allowed");
            }
        });

        // add background music score and play it
        this.sound.add("background_music", JSON.parse(localStorage.getItem("musicConfig")))
            .play();

        // check if registration is required
        if (localStorage.getItem("registedInServer") === "false") {
            this.scene.launch("RegisterMenu");
            this.scene.pause();
        }
    }
}