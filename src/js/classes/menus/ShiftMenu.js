/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";

export default class ShiftMenu extends Menu {
    constructor() {
        super("ShiftMenu");
    }

    init(data) {
        this.key = data.key;
        this.shapes = data.shapes.filter(el => el !== data.currentShape);
    }

    create() {
        const OFFSET = 50;

        this.scene.bringToTop();
        // SHIFT key closes the menu (no changes made)
        this.input.keyboard.on("keydown_SHIFT", () => {
            this.scene.resume(this.key);
            this.scene.stop();
        }, this);

        // blur the background
        let blur = this.add.rectangle(0, 0, 800, 600, 0xFFFFFF).setOrigin(0).setAlpha(0);

        // increase "blur rectangle" alpha
        this.tweens.add({
            targets: blur,
            alpha: 0.7,
            duration: 150,
            ease: "Linear",
        }, this);

        let json = this.cache.json.get("shapes_physics");
        let cont = this.add.container(0, 0);
        let sum = 0, x = 0;
        for (let shape of this.shapes) {
            let button = this.createButton({
                mode: "Sprite", texture: shape,
                x: x, y: 0,
                pointerdown: () => {
                    this.scene.resume(this.key);
                    this.scene.get(this.key).events.emit("shapeshift", shape, this.scene.get(this.key));
                    this.scene.stop();
                }
            }).setOrigin(0, 0.5);

            let scale = json[shape].scale ? json[shape].scale : 1;
            button.setScale(scale);
            sum += button.width * scale + OFFSET;

            cont.add(button);
            x = button.getRightCenter().x + OFFSET;
        }
        sum -= OFFSET;
        cont.setPosition(this.cameras.main.centerX - sum / 2, this.cameras.main.centerY).set;
    }

}