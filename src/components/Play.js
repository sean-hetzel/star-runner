import React, { Component } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import bomb from "../assets/bomb.png";
import dude from "../assets/dude.png";
import platform from "../assets/platform.png";
import sky from "../assets/sky.png";
import star from "../assets/star.png";

// import IonPhaserComponent from "@ion-phaser/react/dist/types/components/IonPhaser";

const gameWidth = 800;
const gameHeight = 600;

let player;
let stars;
let bombs;
let platforms;
let cursors;
let score = 0;
let gameOver = false;
let scoreText;

class Play extends Component {
    state = {
        score: {
            kills: 0,
            wave: 1
        },
        redirect: false,
        initialize: true,
        game: {
            width: gameWidth,
            height: gameHeight,
            type: Phaser.AUTO,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {
                        y: 300
                    },
                    debug: false
                }
            },
            scene: {
                // extend: {
                //     changeScore: null,
                //     player: null,
                //     enemies: null,
                //     healthpoints: null,
                //     moveKeys: null
                // stars: null,
                // bombs: null,
                // platforms: null,
                // cursors: null,
                // score: 0,
                // gameOver: false,
                // scoreText: null

                init: function() {
                    //For Testing Purposes
                    console.log(this.scene);
                    console.log(this.game);
                    console.log("this", this);
                },
                preload: function() {

                    var nAssets = 5;
                    var nLoaded = 0; // keep track

                    // Load in images and sprites
                    this.load.image("sky", "assets/sky.png");
                    this.textures.addBase64("sky", sky);

                    this.load.image("ground", "assets/platform.png");
                    this.textures.addBase64("ground", platform);

                    this.load.image("star", "assets/star.png");
                    this.textures.addBase64("star", star);

                    this.load.image("bomb", "assets/bomb.png");
                    this.textures.addBase64("bomb", bomb);

                    // this.load.image("dude", "assets/dude.png");
                    // this.textures.addBase64("dude", dude)

                    // dude = this.textures.addBase64("dude", dude);
                    // this.load.spritesheet("dude", dude, {
                    //     frameWidth: 32,
                    //     frameHeight: 48
                    // });

                    // method for a spritesheet
                    var dudeImg = new Image();
                    dudeImg.onload = () => {
                        this.textures.addSpriteSheet("dude", dudeImg, {
                            frameWidth: 32,
                            frameHeight: 48
                        });
                        // check if assets are ready then call actual phaser create function
                        // nLoaded++;
                        // if (nLoaded >= nAssets) {
                        //     var actualCreate = create.bind(this);
                        //     actualCreate();
                        // }
                    };
                    dudeImg.src = dude;
                },

                create: function() {
                    //  A simple background for our game
                    this.add.image(400, 300, "sky");

                    //  The platforms group contains the ground and the 2 ledges we can jump on
                    platforms = this.physics.add.staticGroup();

                    //  Here we create the ground.
                    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
                    platforms
                        .create(400, 568, "ground")
                        .setScale(2)
                        .refreshBody();

                    //  Now let's create some ledges
                    platforms.create(600, 400, "ground");
                    platforms.create(50, 250, "ground");
                    platforms.create(750, 220, "ground");

                    // The player and its settings
                    player = this.physics.add.sprite(100, 450, "dude");

                    //  Player physics properties. Give the little guy a slight bounce.
                    player.setBounce(0.2);
                    player.setCollideWorldBounds(true);

                    //  Our player animations, turning, walking left and walking right.
                    this.anims.create({
                        key: "left",
                        frames: this.anims.generateFrameNumbers("dude", {
                            start: 0,
                            end: 3
                        }),
                        frameRate: 10,
                        repeat: -1
                    });

                    this.anims.create({
                        key: "turn",
                        frames: [{ key: "dude", frame: 4 }],
                        frameRate: 20
                    });

                    this.anims.create({
                        key: "right",
                        frames: this.anims.generateFrameNumbers("dude", {
                            start: 5,
                            end: 8
                        }),
                        frameRate: 10,
                        repeat: -1
                    });

                    //  Input Events
                    cursors = this.input.keyboard.createCursorKeys();

                    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
                    stars = this.physics.add.group({
                        key: "star",
                        repeat: 11,
                        setXY: { x: 12, y: 0, stepX: 70 }
                    });

                    stars.children.iterate(function(child) {
                        //  Give each star a slightly different bounce
                        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
                    });

                    bombs = this.physics.add.group();

                    //  The score
                    scoreText = this.add.text(16, 16, "score: 0", {
                        fontSize: "32px",
                        fill: "#000"
                    });

                    //  Collide the player and the stars with the platforms
                    this.physics.add.collider(player, platforms);
                    this.physics.add.collider(stars, platforms);
                    this.physics.add.collider(bombs, platforms);

                    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
                    this.physics.add.overlap(
                        player,
                        stars,
                        this.collectStar,
                        null,
                        this
                    );

                    this.physics.add.collider(
                        player,
                        bombs,
                        this.hitBomb,
                        null,
                        this
                    );
                },

                update: function() {
                    if (gameOver) {
                        return;
                    }

                    if (cursors.left.isDown) {
                        this.player.setVelocityX(-160);

                        this.player.anims.play("left", true);
                    } else if (cursors.right.isDown) {
                        this.player.setVelocityX(160);

                        this.player.anims.play("right", true);
                    }
                    // else {
                    //     this.player.setVelocityX(0);

                    //     this.player.anims.play("turn");
                    // }

                    if (cursors.up.isDown && this.player.body.touching.down) {
                        this.player.setVelocityY(-330);
                    }
                }
            },
            collectStar: function(player, star) {
                star.disableBody(true, true);

                //  Add and update the score
                score += 10;
                scoreText.setText("Score: " + score);

                if (stars.countActive(true) === 0) {
                    //  A new batch of stars to collect
                    stars.children.iterate(function(child) {
                        child.enableBody(true, child.x, 0, true, true);
                    });

                    var x =
                        this.player.x < 400
                            ? Phaser.Math.Between(400, 800)
                            : Phaser.Math.Between(0, 400);

                    var bomb = bombs.create(x, 16, "bomb");
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                    bomb.allowGravity = false;
                }
            },
            hitBomb: function(player, bomb) {
                this.physics.pause();

                player.setTint(0xff0000);

                player.anims.play("turn");

                gameOver = true;
            }
        }
    };

    render() {
        const { initialize, game } = this.state;

        return (
            <>
                <h1>Playing!</h1>
                <IonPhaser
                    id="phaserGame"
                    game={game}
                    initialize={initialize}
                />
            </>
        );
    }
}
export default Play;
