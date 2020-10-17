/*
    Licenciatura em Engenharia Informática | Faculdade de Ciências e Tecnologia da Universidade de Coimbra
    Projeto de Multimédia 2019/2020
    2018282210 Gabriel Alexandre Rodrigues Cortês
    2018280609 João Martins Cabral Pinto
    2018283166 Pedro Miguel Duque Rodrigues
*/
"use strict";
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    title: "Shape Shift",
    autoCenter: true,
    parent: 'phaser',
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                y: 6000
            }
        }
    }
};
export default config;