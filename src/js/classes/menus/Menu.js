/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
import "../../phaser/phaser.js";

"use strict";

// class used as base of all scenes to "share" frequently-used methods
export default class OurScene extends Phaser.Scene {
    constructor() {
        super();
    }

    /* create button according to provided configuration. Allows:
        A) Container with Sprite or Rectangle
        B) Sprite
     with text, functions on click, on over and on over out
     EXAMPLE CONFIGURATION:
    * {
            mode: "Container", secondary: "Sprite", texture: "button",
            x: 0, y: 0,
            text: "BUTTON", textStyle: {font: "..."}},
            pointerdown: () => {
                this.scene.launch("LevelSelectionMenu");
                this.scene.pause()
            },
            pointerover: () => this.buttonTweenIn(playButton).play(),
            pointerout: () => this.buttonTweenOut(playButton).play()
        }
    */
   
    createButton(config) {
        let cont, element;

        if (config.pixelPerfect === undefined)
            config.pixelPerfect = false;

        switch (config.mode) {
            case "Container":
                cont = this.add.container(config.x, config.y);
                switch (config.secondary) {
                    case "Sprite":
                        cont.add(this.add.sprite(0, 0, config.texture));
                        break;
                    case "Rectangle":
                        cont.add(this.add.rectangle(0, 0, config.width, config.height, config.fillColor));
                        break;
                }
                element = cont.getAt(0);
                if (config.text !== undefined)
                    cont.add(this.add.text(0, 0, config.text, config.textStyle).setOrigin(0.5));
                break;
            case "Sprite":
                element = this.add.sprite(config.x, config.y, config.texture);
        }

        // apart from specified function on click it is required to do some other operations such as
        // defaulting the cursor style and playing the click sound
        element.setInteractive({useHandCursor: true, pixelPerfect: config.pixelPerfect})
            .on('pointerdown', () => {
                this.game.canvas.style.cursor = "default";
                this.sound.add('hover_sound', {rate: 10, ...JSON.parse(localStorage.getItem("VFXConfig"))}).play();
                config.pointerdown();
            });

        if (config.pointerover !== undefined)
            element.on("pointerover", config.pointerover);
        if (config.pointerout !== undefined)
            element.on("pointerout", config.pointerout);
        return config.mode === "Container" ? cont : element;
    }

    // default animation (zoom in) on cursor over button
    buttonTweenIn(obj) {
        return this.tweens.add({
            targets: obj,
            scale: 1.05,
            alpha: 0.95,
            duration: 600,
            ease: "Power2",
            paused: true,
            onStart: () => {
                let sound = this.sound.add("hover_sound", {rate: 10, ...JSON.parse(localStorage.getItem("VFXConfig"))});
                sound.play();
                setTimeout(() => sound.destroy(), 1000);
            }
        })
    }

    // default animation (zoom out) on cursor over out button
    buttonTweenOut(obj) {
        return this.tweens.add({
            targets: obj,
            scale: 1,
            alpha: 1,
            duration: 600,
            ease: "Power2",
            paused: true,
        })
    }
}
