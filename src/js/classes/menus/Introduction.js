/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Menu from "./Menu.js";

export default class Introduction extends Menu {
    constructor() {
        super("Introduction")
    }

    // preload most of the game's elements (so the user waits in the beggining and not anywhere else)
    preload() {
        // menu elements
        this.load.atlas("logo", "../../resources/logo.png", "../../resources/logo.json");
        this.load.image("button", "../../resources/buttons/button.png");
        this.load.image("button_level", "../../resources/buttons/button_level.png");
        this.load.image("close", "../../resources/buttons/close.png");
        this.load.image("help", "../../resources/buttons/help.png");
        this.load.image("options", "../../resources/buttons/options.png");

        // sounds
        this.load.audio("background_music", "../../resources/sounds/music.ogg");
        this.load.audio("background_music_bossfight", "../../resources/sounds/bossfight.ogg");
        this.load.audio("hover_sound", "../../resources/sounds/hover.mp3");

        // skins
        this.load.atlas("player", "../../resources/shapes/player.png", "../../resources/shapes/player.json");
        this.load.atlas("long", "../../resources/shapes/long.png", "../../resources/shapes/long.json");
        this.load.atlas("love", "../../resources/shapes/love.png", "../../resources/shapes/love.json");
        this.load.atlas("eye", "../../resources/shapes/eye.png", "../../resources/shapes/eye.json");
        this.load.atlas("ghost", "../../resources/shapes/ghost.png", "../../resources/shapes/ghost.json");
        this.load.json("shapes_physics", "../../resources/json/shapes.json");

        // tilesprite elements
        this.load.image("lava", "../../resources/lava.png");
        this.load.image("spring", "../../resources/spring.png");

        // shooting elements
        this.load.image("heart", "../../resources/heart.png");
        this.load.image("pacman", "../../resources/pacman.png");

        // level info
        this.load.json("level_info", "../../resources/json/levels.json");
    }

    create() {
        //this.scene.start("PuzzleLevel", {level: this.cache.json.get("level_info")[3].levels[3]});
        // click anywhere to continue
        this.add.text(400, 545, "Click to continue...", {font: "24pt Myriad Pro", color: "#FFFFFF"}).setOrigin(0.5);
        let clickToContinue = () => {
            this.scene.stop();
            this.scene.start("MainMenu");
        };
        this.input.keyboard.on("keydown", clickToContinue);
        this.input.on("pointerdown", clickToContinue);

        // background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("B73721");

        // logo
        this.anims.create({
            key: "logo",
            frames: this.anims.generateFrameNames("logo", {
                start: 0,
                end: 14,
                zeroPad: 5,
                prefix: "logo_",
                suffix: ".png",
            }),
            frameRate: 11,
            repeat: -1
        });
        this.logo = this.add.sprite(400, 180, "logo").play("logo");

        // love
        this.anims.create({
            key: "love_intro",
            frames: this.anims.generateFrameNames("love", {
                start: 0,
                end: 14,
                zeroPad: 5,
                prefix: "love_",
                suffix: ".png",
            }),
            frameRate: 17,
            repeat: -1
        });
        this.love = this.add.sprite(552, 128, "love").setScale(0.6).play("love_intro");
        this.tweens.add({
            targets: this.love,
            x: 530,
            duration: 2000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
        }, this);

        // long
        this.anims.create({
            key: "long_intro",
            frames: this.anims.generateFrameNames("long", {
                start: 0,
                end: 14,
                zeroPad: 5,
                prefix: "long_",
                suffix: ".png",
            }),
            frameRate: 20,
            repeat: -1
        });
        this.long = this.add.sprite(100, 503, "long").play("long_intro");
        this.tweens.add({
            targets: this.long,
            x: 200,
            duration: 2000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
            flipX: true,
        }, this);

        // ghost
        this.anims.create({
            key: "ghost_intro",
            frames: this.anims.generateFrameNames("ghost", {
                start: 0,
                end: 14,
                zeroPad: 5,
                prefix: "ghost_",
                suffix: ".png",
            }),
            frameRate: 16,
            repeat: -1
        });
        this.ghost = this.add.sprite(680, 435, "ghost").setScale(0.75).play("ghost_intro");
        this.physics.world.enable(this.ghost);
        this.ghost.body.allowGravity = false;
        this.ghost.body.setVelocity(10, -50);
        this.tweens.add({
            targets: this.ghost.body.velocity,
            x: -10,
            y: 50,
            duration: 3000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
        }, this);

        this.firstTimePlay();

        this.createAnimations();
    }

    createAnimations() {
        let json = this.cache.json.get("shapes_physics");
        for (let [skin, value] of Object.entries(json)) {
            this.anims.create({
                key: skin,
                frames: this.anims.generateFrameNames(skin, {
                    start: 0,
                    end: 14,
                    zeroPad: 5,
                    prefix: skin + "_",
                    suffix: ".png"
                }),
                frameRate: value.frameRate !== undefined ? value.frameRate : 30,
                repeat: value.repeatAnimation === true ? -1 : 0
            })
        }
    }

    // run when required item is not present on user's localStorage
    // most of the items needed along the game are pre-defined here
    firstTimePlay() {
        if (localStorage.getItem("playedBefore") !== "true") {
            // User Global Settings
            localStorage.setItem("playedBefore", "true");

            localStorage.setItem("registedInServer", "false");
            localStorage.setItem("score", 0);

            localStorage.setItem("musicConfig", JSON.stringify({volume: 0.1, loop: true}));
            localStorage.setItem("VFXConfig", JSON.stringify({volume: 0.1}));

            // format: [5, 5, 3, ...] where the first element is respective to chapter 1 and is the level the user has access to
            localStorage.setItem("levelsReached", JSON.stringify([0]));

            // levels' scores
            localStorage.setItem("levelsScores", JSON.stringify({}));

            // skins that user owns
            localStorage.setItem("skins", JSON.stringify(["player"]));
        }
    }
}