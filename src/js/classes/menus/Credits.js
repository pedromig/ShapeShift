/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
export default class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
        // sprites will be stored here
        this.creators = {"cabral": null, "gabriel": null, "pedro": null};
    }

    preload() {
        this.load.json("creditsText", "../../resources/json/credits.json");
        // load stickmen textures and json spritesheet information
        for (let creator of Object.keys(this.creators))
            this.load.atlas(creator, "../../resources/shapes/credits/" + creator + ".png", "../../resources/shapes/credits/" + creator + ".json");
    }

    create() {
        // function to exit credits scene
        let exit = () => {
            this.scene.stop();
            music.destroy();
            this.scene.resume("MainMenu");
            this.scene.get("MainMenu").sound.resumeAll();
        };

        // movement starts deactivated
        this.movement = {x: false, y: false};

        // click anywhere to go back
        this.input.on("pointerdown", exit);

        // background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("A3200A");

        // play music at 24 secs timestamp
        let music = this.sound.add("background_music", JSON.parse(localStorage.getItem("musicConfig")));
        music.play({seek: 24});

        // create floor and apply physics on it
        this.floor = this.add.rectangle(0, 590, 800, 10, 0).setOrigin(0);
        this.physics.world.enable(this.floor);
        this.floor.body.immovable = true;
        this.floor.body.moves = false;

        // stickmen deploy
        this.stickmen = this.add.group();
        let x = 300;
        for (let creator of Object.keys(this.creators)) {
            // create animation
            this.anims.create({
                key: creator,
                frames: this.anims.generateFrameNames(creator, {
                    start: 0,
                    end: 14,
                    zeroPad: 5,
                    prefix: "img_",
                    suffix: ".png"
                }),
                frameRate: 30
            });
            // create stickman
            this.creators[creator] = this.add.sprite(x, 500, creator).setAlpha(0);

            // add stickman to the stickmen group
            this.stickmen.add(this.creators[creator]);

            // activate physics on stickman
            this.physics.world.enable(this.creators[creator]);
            this.creators[creator].body.collideWorldBounds = true;
            this.physics.add.collider(this.creators[creator], this.floor);

            // stickmen deployed 100 px of each other
            x += 100;
        }

        let normalTexts = this.cache.json.get("creditsText");

        // add text to scene on specified time
        for (let text of normalTexts)
            this.time.addEvent({
                delay: text.delay,
                callback: () =>
                    this.tweens.add({
                        targets: this.add.text(this.cameras.main.width * 0.5, 250, text.t, {
                            fontSize: text.size,
                            fill: "#FFFFFF",
                            align: "center"
                        }).setOrigin(0.5),
                        y: -100,
                        duration: 12000,
                        ease: "Linear"
                    }, this)
            });

        // show stickmen and activate x movement
        this.time.addEvent({
            delay: 3500,
            callback: () => {
                this.tweens.add({
                    targets: this.add.text(200, 400, "We turned ourselves into stickmen!", {
                        fontSize: 15,
                        fill: "#f9ff8b",
                        align: "center"
                    }).setOrigin(0.5).setAngle(-10),
                    alpha: 0,
                    angle: 10,
                    duration: 6000,
                    ease: "Linear"
                }, this);
                this.tweens.add({
                    targets: this.stickmen.getChildren(),
                    alpha: 1,
                    duration: 3000,
                    ease: "Linear"
                }, this);
                this.movement.x = true;
            }
        });

        // activate y movement
        this.time.addEvent({
            delay: 12000,
            callback: () => {
                this.tweens.add({
                    targets: this.add.text(200, 400, "As stickmen we are able to fly!", {
                        fontSize: 15,
                        fill: "#f9ff8b",
                        align: "center"
                    }).setOrigin(0.5).setAngle(-10),
                    alpha: 0,
                    scale: 1.4,
                    duration: 6000,
                    ease: "Linear"
                }, this);
                this.movement.y = true;
            }
        });

        // "harmless" cat appears and sucks everything
        this.time.addEvent({
            delay: 20000,
            callback: () => {
                this.anims.create({
                    key: "eye",
                    frames: this.anims.generateFrameNames("eye", {
                        start: 0,
                        end: 14,
                        zeroPad: 5,
                        prefix: "eye_",
                        suffix: ".png"
                    }),
                    frameRate: 12,
                    repeat: -1
                });
                this.anims.create({
                    key: "eye_open",
                    frames: this.anims.generateFrameNames("eye", {
                        start: 0,
                        end: 14,
                        zeroPad: 5,
                        prefix: "eye_open_",
                        suffix: ".png"
                    }),
                    frameRate: 12,
                    repeat: -1
                });
                this.eye = this.add.sprite(900, 530, "eye")
                    .setScale(0.5)
                    .play("eye");

                this.physics.world.enable(this.eye);
                this.eye.body.collideWorldBounds = true;
                this.eye.body.immovable = true;
                this.eye.body.moves = false;

                this.physics.add.collider(this.eye, this.floor);

                for (let stickman of this.stickmen.getChildren())
                    this.physics.add.collider(this.eye, stickman, this.dealWithAbsortion, null, this);

                this.tweens.add({
                    targets: this.eye,
                    x: 600,
                    duration: 3000,
                    ease: "Linear",
                    completeDelay: 3000,
                    // eye eats everything
                    onComplete: () => {
                        this.eye.anims.stop();
                        this.eye.play("eye_open");
                        this.movement.x = this.movement.y = false;
                        for (let stickman of this.stickmen.getChildren())
                            this.physics.moveToObject(stickman, this.eye, 500);
                    }
                }, this);
            }
        });

        // exit
        this.time.addEvent({
            delay: 35000,
            callback: exit
        })

    }

    update(time, delta) {
        super.update(time, delta);
        for (let [creator, stickman] of Object.entries(this.creators)) {
            if (this.movement.x) {
                stickman.body.velocity.x += Math.random() * 50 - 25;
                stickman.play(creator, true);
            }
            if (this.movement.y)
                stickman.body.velocity.y -= Math.random() * 100 + 53;
        }
    }

    dealWithAbsortion(obj1, obj2) {
        if (this.movement.x === false && this.movement.y === false) {
            obj2.body.setVelocity(0).setAllowGravity(false);
            this.physics.moveToObject(obj2, obj1, 1000);
            this.tweens.add({
                targets: obj2,
                scale: 0.05,
                duration: 1000,
                ease: "Power2",
                completeDelay: 300,
                onComplete: () => obj2.destroy()
            }, this);
        }
    }
}