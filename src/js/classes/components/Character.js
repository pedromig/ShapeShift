/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
export default class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.setOrigin(0.5, 1).setDepth(2);
        // add character to scene
        this.scene.add.existing(this);
        // enable physics and collisions
        this.scene.physics.world.enable(this);
        this.body.collideWorldBounds = true;
        this.scene.physics.add.collider(this, this.scene.walls);
        for (let element of this.scene.elements)
            this.scene.physics.add.collider(this, element.collideObjects(), element.collideCallback, element.processCallback, element);
        // parameters required in pixel perfect collision implementation [kept for educational purposes]
        /* this.width = this.img.width;
         this.height = this.img.height;
         this.img = this.texture.getSourceImage();
         this.imgPixelMap = this.getPixelMap(this.img); */
    }

    // Method required for both the player and the enemy so i moved it here
    getShapeInfo() {
        let json = this.scene.cache.json.get("shapes_physics")[this.currentShape];
        this.speedX = json.speedX;
        this.speedY = json.speedY;
        this.body.setMaxVelocity(json.maxSpeedX, json.maxSpeedY);
        this.body.setDrag(json.dragX, json.dragY);
        this.body.setAllowGravity(json.allowGravity !== false);
        this.body.setGravity(json.gravityX, json.gravityY);
        this.body.setMass(json.mass);
        this.setScale(json.scale || 1);

        this.eletric = json.eletric === undefined ? false : json.eletric;
        this.eletric = json.eletric || false;

        if (json.customBox)
            this.body.setSize(...json.customBox);
    }

    // methods required for shapeshifting
    reload(texture) {
        this.setTexture(texture);
        this.body.setSize(this.texture.width, this.texture.height, this.getCenter());
    }

    // methods required in pixel perfect collision implementation [kept for educational purposes]
    /*
    addCollider(objects) {
        this.scene.physics.world.collide(this, objects, () => {
            this.x += 10;
            this.y += 10;
        }, this.pixelPerfectCollision);
    }

    pixelPerfectCollision(self, other) {
        let intersection = false;

        if ((self.getTopLeft().x <= other.getTopRight().x) && (self.getTopRight().x >= other.getTopLeft().x)
            && (self.getTopLeft().y <= other.getBottomLeft().y) && (self.getBottomLeft().y >= other.getTopLeft().y)) {

            let xmin = Math.max(self.getTopLeft().x, other.getTopLeft().x);
            let xmax = Math.min(self.getTopRight().x, other.getTopRight().x);
            let ymin = Math.max(self.getTopLeft().y, other.getTopLeft().y);
            let ymax = Math.min(self.getBottomLeft().y, other.getBottomLeft().y);

            let selfPixelMap = self.imgPixelMap;
            let otherPixelMap = other.imgPixelMap;

            for (let i = xmin; i < xmax; i++) {
                for (let j = ymin; j < ymax; j++) {
                    let selfOffsetX = Math.round(i - self.getTopLeft().x);
                    let selfOffsetY = Math.round(j - self.getTopLeft().y);
                    let selfIndex = 4 * (Math.round(selfOffsetY * self.width) + selfOffsetX);

                    let otherOffsetX = Math.round(i - other.getTopLeft().x);
                    let otherOffsetY = Math.round(j - other.getTopLeft().y);
                    let otherIndex = 4 * (Math.round(otherOffsetY * other.width) + otherOffsetX);

                    if (selfPixelMap[selfIndex + 3] > 0 && otherPixelMap[otherIndex + 3] > 0)
                        return true;
                }
            }
        }
    }

    getPixelMap(img) {
        let canvas = document.createElement("canvas");
        canvas.width = Math.round(this.width);
        canvas.height = Math.round(this.height);
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, this.width, this.height);
        return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    }*/
}