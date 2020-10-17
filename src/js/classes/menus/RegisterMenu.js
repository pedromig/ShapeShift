/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";
import {createUser} from "../ranking/Ranking.js";

export default class HelpMenu extends Menu {
    constructor() {
        super("HelpMenu");
        this.width = 500;
        this.height = 400;
    }

    preload() {
        // load button element directly from html file
        this.load.html("inputName", "../html/register.html");
    }

    create() {
        let textStyle = {font: '17pt Myriad Pro', color: '#FFFFFF'};
        let graphics = this.add.graphics().fillStyle(0xE0A18F);

        let cont = this.add.container(this.scale.width / 2 - this.width / 2, this.scale.height / 2 - this.height / 2, [
            graphics.fillRoundedRect(0, 0, this.width, this.height, 30),
            this.add.text(250, 45, "REGISTER", textStyle).setOrigin(0.5),
        ]);

        let input = this.add.dom(250, 180).createFromCache("inputName").setOrigin(0.5);
        let button = this.createButton({
            mode: "Container", secondary: "Sprite", texture: "button_level",
            x: 250, y: 300, pixelPerfect: true,
            text: "CONFIRM", textStyle: textStyle,
            pointerdown: () => this.verifyRegistration(input.getChildByName("nameInput").value),
            pointerover: () => this.buttonTweenIn(button).play(),
            pointerout: () => this.buttonTweenOut(button).play()
        });

        // add to main container
        cont.add(input);
        cont.add(button);
    }

    // check with server if desired name is available
    verifyRegistration(text) {
        let creation = createUser(text);
        // undefined is returned when error with server
        if (creation === true) {
            localStorage.setItem("registedInServer", "true");
            localStorage.setItem("username", text);
            this.scene.stop();
            this.scene.launch("HelpMenu");
        } else if (creation === false)
            alert("Name already taken");

    }
}