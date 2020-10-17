/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "../menus/Menu.js";

export default class Ranking extends Menu {
    constructor() {
        super("Ranking");
    }

    preload() {
        this.load.setCORS("anonymous");
        this.load.json("rank", "http://shapeshift.dei.uc.pt/ranking.php?mode=data&name=" + localStorage.getItem("username"))
            .on("loaderror", () => {
                alert("Error when connecting to server");
                this.scene.stop();
                this.scene.resume("MainMenu");
            }, this);
    }

    create() {
        this.preload();

        // background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("B73721");

        // get username
        this.username = localStorage.getItem("username");

        // get website ranking
        let rankData = this.cache.json.get("rank");

        // convert to string
        rankData.pos = rankData.pos.toString();

        // logo
        this.add.sprite(639, 95, "logo")
            .setScale(0.55)
            .play("logo");

        // "CHOOSE LEVEL"
        this.add.text(50, 75, "RANKING", {font: "45pt Myriad Pro", color: "#FFFFFF"});

        // back button
        let backButton = this.createButton({
            mode: "Container", secondary: "Rectangle",
            x: 62, y: 575, width: 111, height: 31, fillColor: 0x9B4126,
            text: "BACK", textStyle: {font: "10pt Myriad Pro", color: "#FFFFFF"},
            pointerdown: () => {
                this.scene.stop();
                this.scene.resume("MainMenu");
            },
            pointerover: () => this.buttonTweenIn(backButton).play(),
            pointerout: () => this.buttonTweenOut(backButton).play()
        });

        // ranking table
        this.add.rectangle(265, 212, 425, 24, 0xA44A2B);
        this.add.rectangle(265, 382, 425, 315, 0x9B4126);
        this.add.line(0, 0, 145, 370, 145, 710, 0xFFFFFF);
        this.add.line(0, 0, 320, 370, 320, 710, 0xFFFFFF);
        this.add.text(78, 205, "RANK", {font: "11pt Myriad Pro", color: "#FFFFFF"});
        this.add.text(210, 205, "NAME", {font: "11pt Myriad Pro", color: "#FFFFFF"});
        this.add.text(372, 205, "SCORE", {font: "11pt Myriad Pro", color: "#FFFFFF"});

        // user score and position
        this.add.container(655, 227, [
            this.add.rectangle(0, 0, 157, 54, 0xA44A2B),
            this.add.text(0, -10, "YOUR SCORE", {font: "10pt Myriad Pro", color: "#FFFFFF"}).setOrigin(0.5),
            this.add.text(0, 10, this.username, {
                font: "13pt Myriad Pro",
                color: "#FFFFFF",
                wordWrap: {width: 157, useAdvancedWrap: true}
            }).setOrigin(0.5)
        ]);
        this.add.container(655, 350, [
            this.add.rectangle(0, 0, 157, 173, 0xA44A2B),
            this.add.text(0, -40, "You are", {
                font: "20pt Myriad Pro Bold",
                color: "#FFFFFF",
                wordWrap: {width: 157, useAdvancedWrap: true}
            }).setOrigin(0.5),
            this.add.text(0, 0, rankData.pos + (rankData.pos[rankData.pos.length - 1] === "1" ? "st" : rankData.pos[rankData.pos.length - 1] === "2" ? "nd" : "th"), {
                font: "30pt Myriad Pro Bold",
                color: "#FFFFFF",
                wordWrap: {width: 157, useAdvancedWrap: true}
            }).setOrigin(0.5),
            this.add.text(0, 40, rankData.user + " points!", {
                font: "17pt Myriad Pro Bold",
                color: "#FFFFFF",
                wordWrap: {width: 157, useAdvancedWrap: true}
            }).setOrigin(0.5)
        ]);

        let y = 241;
        for (let i = 1; i <= rankData.all.length; i++) {
            this.add.text(99, y, i, {font: "11pt Myriad Pro", color: "#FFFFFF"}).setOrigin(0.5);
            this.add.text(170, y - 7, rankData.all[i - 1].name, {font: "11pt Myriad Pro", color: "#FFFFFF"});
            this.add.text(395, y, rankData.all[i - 1].score, {
                font: "11pt Myriad Pro",
                color: "#FFFFFF",
                align: "center"
            }).setOrigin(0.5);
            y += 30;
        }
    }

    update(time, delta) {
        super.update(time, delta);
    }
}

function GETRequest(url, async) {
    let http = new XMLHttpRequest();
    let error = false;
    try {
        http.open("GET", url, async);
        http.send();
        return error ? undefined : JSON.parse(http.responseText);
    } catch (err) {
        alert("Error when connecting to server");
        error = true;
    }
}

// create user
// returns true if creating went alright and false otherwise
export function createUser(desiredUsername) {
    let req = GETRequest("http://shapeshift.dei.uc.pt/ranking.php?mode=new&name=" + desiredUsername, false);
    return req ? req.result : undefined;
}

// update user's score
export function updateUserScore(username, newScore) {
    GETRequest("http://shapeshift.dei.uc.pt/ranking.php?mode=update&name=" + username + "&score=" + newScore);
}
