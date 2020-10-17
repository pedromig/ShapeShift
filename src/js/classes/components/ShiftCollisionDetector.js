/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
import Character from "./Character.js";

export default class ShiftCollisionDetector extends Character {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.currentShape = texture;
        this.setTexture(texture);
        this.scene.physics.world.enable(this);
        this.body.collideWorldBounds = true;
        this.body.immovable = true;
        this.body.moves = false;
        this.alpha = 0;
        this.getShapeInfo();
    }
}