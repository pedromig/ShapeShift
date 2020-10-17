/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";

export default class OptionsMenu extends Menu {
    constructor() {
        super("OptionsMenu");
        this.width = 500;
        this.height = 400;
    }

    init(data) {
        this.key = data.key;
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: '../js/phaser/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        // useful textstyle
        let textStyle = {font: '14pt Myriad Pro', color: '#FFFFFF'};

        let container = this.add.container(this.scale.width / 2 - this.width / 2, this.scale.height / 2 - this.height / 2, [
            // rounded rectangle
            this.rexUI.add.roundRectangle(250, 200, this.width, this.height, 30, 0xE0A18F),

            // main text
            this.add.text(40, 25, "OPTIONS", {
                font: '25pt Myriad Pro',
                color: '#FFFFFF'
            }),

            // close button
            this.createButton({
                mode: "Sprite", texture: "close", pixelPerfect: true,
                x: 460, y: 34,
                pointerdown: () => {
                    // save music volume before closing
                    localStorage.setItem("musicConfig", JSON.stringify({
                        volume: slider_music_config.value / 10,
                        loop: true
                    }));

                    localStorage.setItem("VFXConfig", JSON.stringify({
                        volume: slider_vfx_config.value / 10
                    }));
                    this.scene.stop();
                    this.scene.resume(this.key);
                }
            }),
            this.add.text(40, 120, "Music Volume", textStyle),
            this.add.text(40, 190, "VFX Volume", textStyle),
        ]);


        let slider_music_config = {
            x: 395,
            y: 260,
            width: 410,
            height: 30,
            orientation: 'x',
            track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 14, 0x232423),
            indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 16, 0x33d633),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 16, 0x0),
            space: {
                top: 4,
                bottom: 4
            },
            input: 'drag',
            value: JSON.parse(localStorage.getItem("musicConfig")).volume * 10,
            valuechangeCallback: (value) => {
                this.scene.get("MainMenu").sound.get("background_music").setVolume(value / 10);
                slider_music_config.value = value;
            }
        };

        let slider_vfx_config = {
            x: 395,
            y: 330,
            width: 410,
            height: 30,
            orientation: 'x',
            track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 14, 0x232423),
            indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 16, 0x33d633),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 16, 0x0),
            space: {
                top: 4,
                bottom: 4
            },
            input: 'drag',
            value: JSON.parse(localStorage.getItem("VFXConfig")).volume * 10,
            valuechangeCallback: (value) => slider_vfx_config.value = value
        };

        // music slider
        let sliderMusic = this.rexUI.add.slider(slider_music_config).layout();

        // VFX slider
        let sliderVFX = this.rexUI.add.slider(slider_vfx_config).layout();

        container.add(sliderMusic, sliderVFX);
    }
}