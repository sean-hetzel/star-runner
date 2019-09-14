import React, { Component } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import star from "../assets/star2.png";
import bigStar from "../assets/star3.png";
import ship from "../assets/shmup-ship2.png";
import bullet from "../assets/bullet6.png";
import jets from "../assets/blue.png";
import flares from "../assets/yellow.png";
import face from "../assets/metalface78x92.png";
import planet from "../assets/city1.png";
import { delay } from "q";

const mapWidth = 40000; // 3200
const mapHeight = 700; // 600
console.log("map width: ", mapWidth);
console.log("map height: ", mapHeight);

class Play extends Component {
    state = {
        redirect: false,
        initialize: true,
        game: {
            type: Phaser.AUTO,
            width: "100%",
            height: mapHeight,
            physics: {
                default: "impact",
                impact: {
                    setBounds: {
                        x: 0,
                        y: 0,
                        width: mapWidth,
                        height: 700,
                        thickness: 32
                    }
                }
            },
            scene: {
                extend: {
                    minimap: null,
                    player: null,
                    cursors: null,
                    thrust: null,
                    flares: null,
                    bullets: null,
                    lastFired: 0,
                    text: null,
                    timer: 0,
                    damage: 0,
                    score: 0,
                    gameOver: false,
                    endZone: null
                },

                init: function() {
                    //For Testing Purposes
                    console.log(this.scene);
                    console.log(this.game);
                    console.log("this", this);
                },
                preload: function() {
                    this.load.image("star", "assets/demoscene/star2.png");
                    this.textures.addBase64("star", star);

                    this.load.image("bigStar", "assets/demoscene/star3.png");
                    this.textures.addBase64("bigStar", bigStar);

                    this.load.image("ship", "assets/sprites/shmup-ship2.png");
                    this.textures.addBase64("ship", ship);

                    this.load.image("planet", "assets/city1.png");
                    this.textures.addBase64("planet", planet)

                    this.load.image(
                        "bullet",
                        "assets/sprites/bullets/bullet6.png"
                    );
                    this.textures.addBase64("bullet", bullet);

                    this.load.image("jets", "assets/particles/blue.png");
                    this.textures.addBase64("jets", jets);

                    this.load.image("flares", "assets/particles/yellow.png");
                    this.textures.addBase64("flares", flares);


                    var faceImg = new Image();
                    faceImg.onload = () => {
                        this.textures.addSpriteSheet("face", faceImg, {
                            frameWidth: 78,
                            frameHeight: 92
                        });
                    };
                    faceImg.src = face;
                },

                create: function() {
                    const cityPlanet = this.impact.add.sprite(200,200, planet)

                    let Bullet = new Phaser.Class({
                        Extends: Phaser.GameObjects.Image,

                        initialize: function Bullet(scene) {
                            Phaser.GameObjects.Image.call(
                                this,
                                scene,
                                0,
                                0,
                                "bullet"
                            );

                            this.speed = 0;
                            this.born = 0;

                        },

                        fire: function(player) {
                            this.setPosition(player.x, player.y);

                            if (player.flipX) {
                                //  Facing left
                                this.speed = Phaser.Math.GetSpeed(
                                    -1000 + player.vel.x,
                                    1
                                );
                            } else {
                                //  Facing right
                                this.speed = Phaser.Math.GetSpeed(
                                    1000 + player.vel.x,
                                    1
                                );
                            }

                            this.born = 0;
                        },

                        update: function(time, delta) {
                            this.x += this.speed * delta;

                            this.born += delta;

                            if (this.born > 1000) {
                                this.setActive(false);
                                this.setVisible(false);
                            }
                        }
                    });

                    //  The world is 3200 x 600 in size
                    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

                    //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
                    // this.minimap = this.cameras.add(200, 10, 400, 100).setZoom(0.2);
                    // this.minimap.setBackgroundColor(0x002244);
                    // this.minimap.scrollX = mapWidth;
                    // this.minimap.scrollY = mapHeight;

                    //  Bullets

                    this.bullets = this.add.group({
                        classType: Bullet,
                        runChildUpdate: true
                    });

                    //  Add a player ship

                    this.player = this.impact.add
                        .sprite(1600, 200, "ship")
                        .setDepth(1);
                    this.player
                        .setMaxVelocity(1000)
                        .setFriction(400, 300)
                        .setPassiveCollision();

                    this.cursors = this.input.keyboard.createCursorKeys();

                    this.text = this.add
                        .text(10, 10, "", {
                            font: "20px Alien Encounters",
                            fill: "#ff0000"
                        })
                        .setDepth(1)
                        .setScrollFactor(0);

                    const createBulletEmitter = () => {
                        this.flares = this.add
                            .particles("flares")
                            .createEmitter({
                                x: 1600,
                                y: 200,
                                angle: { min: 170, max: 190 },
                                scale: { start: 0.4, end: 0.2 },
                                blendMode: "ADD",
                                lifespan: 500,
                                on: false
                            });
                    };

                    const createThrustEmitter = () => {
                        this.thrust = this.add.particles("jets").createEmitter({
                            x: 1600,
                            y: 200,
                            angle: { min: 160, max: 200 },
                            scale: { start: 0.2, end: 0 },
                            blendMode: "ADD",
                            lifespan: 600,
                            on: false
                        });
                    };

                    const createStarfield = () => {
                        //  Starfield background

                        //  Note the scrollFactor values which give them their 'parallax' effect

                        var group = this.add.group({
                            key: "star",
                            frameQuantity: mapWidth / 4
                        });

                        group.createMultiple({
                            key: "bigStar",
                            frameQuantity: mapWidth / 200
                        });

                        var rect = new Phaser.Geom.Rectangle(
                            0,
                            0,
                            mapWidth,
                            1000
                        );

                        Phaser.Actions.RandomRectangle(
                            group.getChildren(),
                            rect
                        );

                        group.children.iterate(function(child, index) {
                            var sf = Math.max(0.3, Math.random());

                            if (child.texture.key === "bigStar") {
                                sf = 0.1;
                            }

                            child.setScrollFactor(sf);

                            // this.minimap.ignore(child);
                        }, this);
                    };

                    const createAliens = () => {
                        //  Create some random aliens moving slowly around

                        var config = {
                            key: "metaleyes",
                            frames: this.anims.generateFrameNumbers("face", {
                                start: 0,
                                end: 4
                            }),
                            frameRate: 20,
                            repeat: -1
                        };

                        this.anims.create(config);

                        for (var i = 0; i < mapWidth / 200; i++) {
                            var x = Phaser.Math.Between(100, mapWidth);
                            var y = Phaser.Math.Between(100, 300);

                            var face = this.impact.add
                                .sprite(x, y, "face")
                                .play("metaleyes").setTypeA().setCheckAgainstA().setActiveCollision().setMaxVelocity(300);


                            face.setActiveCollision()
                                .setBounce(1)
                                .setBodyScale(0.5);
                            face.setVelocity(
                                Phaser.Math.Between(20, 60),
                                Phaser.Math.Between(20, 60)
                            );

                            if (Math.random() > 0.5) {
                                face.vel.x *= -1;
                            } else {
                                face.vel.y *= -1;
                            }
                        }
                    };

                    // this.player.setTypeA().setCheckAgainstB().setActiveCollision().setMaxVelocity(300);
                    // this.face.setTypeB().setCheckAgainstA().setFixedCollision();

                    const hitAstroid = (player, face, axis) => {
                        // player.gameObject.tint = 0xff0000;
                        // delay(10000);
                        // player.gameObject.tint = 0x0000ff;

                        this.damage += 1000
                        console.log(this.damage)
                    };

                    // this.physics.add.overlap(
                    //     this.player,
                    //     face,
                    //     hitAstroid,
                    //     null,
                    //     this
                    // );
                    this.player.setCollideCallback(hitAstroid, this);

                    createStarfield();
                    // createLandscape();
                    createAliens();
                    createThrustEmitter();
                    createBulletEmitter();

                    this.timer = this.time.addEvent({ delay: 1000000, callbackScope: this });

                    // const endZone = this.game.scene.zone(
                    //     38000,
                    //     400,
                    //     10,
                    //     800
                    // ).setPassiveCollision()

                    // const crossEndZone = (player, endZone, axis) => {
                    //     console.log("GAME ENDED")
                    // }

                    // // let endZone = Phaser.GameObjects.zone(38000, 400, 10, 800)
                    
                    // endZone.setCollideCallback(crossEndZone, this)

                },

                update: function(time, delta) {
                    if (this.gameOver) {
                        
                        return;
                    }
                    this.thrust.setPosition(this.player.x, this.player.y);

                    if (this.cursors.left.isDown) {
                        this.player.setAccelerationX(-1200);
                        this.player.flipX = true;
                    } else if (this.cursors.right.isDown) {
                        this.player.setAccelerationX(1200);
                        this.player.flipX = false;
                    } else {
                        this.player.setAccelerationX(0);
                    }
                    if (this.cursors.up.isDown) {
                        this.player.setAccelerationY(-1200);
                    } else if (this.cursors.down.isDown) {
                        this.player.setAccelerationY(1200);
                    } else {
                        this.player.setAccelerationY(0);
                    }

                    if (this.player.vel.x < 0) {
                        this.thrust.setPosition(
                            (this.thrust.x.propertyValue += this.player.flipX
                                ? 16
                                : -16),
                            this.thrust.y.propertyValue
                        );
                        this.thrust.setSpeed(this.player.vel.x / 2);
                        this.thrust.emitParticle(16);
                    } else if (this.player.vel.x > 0) {
                        this.thrust.setPosition(
                            (this.thrust.x.propertyValue += this.player.flipX
                                ? 16
                                : -16),
                            this.thrust.y.propertyValue
                        );
                        this.thrust.setSpeed(this.player.vel.x / 2);
                        this.thrust.emitParticle(16);
                    }

                    if (this.cursors.space.isDown && time > this.lastFired) {
                        var bullet = this.bullets.get();
                        bullet.setActive(true);
                        bullet.setVisible(true);

                        if (bullet) {
                            bullet.fire(this.player);

                            this.lastFired = time + 100;
                        }
                    }

                    //  Emitters to bullets

                    this.bullets.children.each(function(b) {
                        if (b.active) {
                            this.flares.setPosition(b.x, b.y);
                            this.flares.setSpeed(b.speed + 500 * -1);
                            this.flares.emitParticle(1);
                        }
                    }, this);

                    let timeElapsed = Math.floor(this.timer.getElapsed());

                    this.text.setText(
                        `VELOCITY: ${this.player.vel.x * 500}\nTime: `  + `${timeElapsed}\nDamage: ` + `${this.damage}\nScore: ` + `${this.score}`
                    );

                    //  Position the center of the camera on the player
                    //  We -400 because the camera width is 800px and
                    //  we want the center of the camera on the player, not the left-hand side of it
                    this.cameras.main.scrollX = this.player.x - 400;
                    // this.cameras.main.startFollow(this.player, true, 0.02, 0.02);


                    //  And this camera is 400px wide, so -200
                    // this.minimap.scrollX = Phaser.Math.Clamp(this.player.x - 200, 800, mapWidth);
                    // console.log(Math.floor(this.timer.getElapsed()))
                    // this.info.setText('\nTime: ' + Math.floor(this.timer.getElapsed()));
                    this.score = timeElapsed + this.damage;
                    console.log("score: ", this.score)
                }
            }
        }
    };

    render() {
        const { initialize, game } = this.state;

        return (
            <>
                <IonPhaser
                    id="phaserGame"
                    game={game}
                    initialize={initialize}
                />
                <div id="red_line_button"></div>
                
            </>
        );
    }
}
export default Play;
