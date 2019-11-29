import React, { Component } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import star from "../assets/star-1.png";
import redGiant from "../assets/star-2.png";
import ship from "../assets/spaceship-4a.png";
import bullet from "../assets/bullet6.png";
import jets from "../assets/blue.png";
import flares from "../assets/yellow.png";
import asteroid from "../assets/asteroid.png";
import spaceStation from "../assets/space-station-sprite-sheet.png";
import crash from "../assets/crash.wav";
import gun from "../assets/gun.wav";
import rocket from "../assets/rocket.wav";

const mapWidth = 40000; // 3200
const mapHeight = 700; // 600
console.log("map width: ", mapWidth);
console.log("map height: ", mapHeight);

class Game extends Component {
  componentDidMount() {
    this.props.hideStars();
  }

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
          penalty: 0,
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
          // loading screen start
          let width = this.cameras.main.width;
          let height = this.cameras.main.height;

          const line = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });
          
          let progressBar = this.add.graphics();

          let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 100,
            text: "Loading...",
            style: {
              font: "20px Orbitron",
              fill: "#ff0000"
            }
          });
          loadingText.setOrigin(0.5, 0.5);

          let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: "0%",
            style: {
              font: "18px Orbitron",
              fill: "#ff0000"
            }
          });
          percentText.setOrigin(0.5, 0.5);

          this.load.on("progress", function(value) {
            percentText.setText(parseInt(value * 100) + "%");
            progressBar.clear();
            progressBar.fillStyle(0xff0000, 1);
            progressBar.fillRect(width / 2 - 250, 280, 500 * value, 30);
          });

          this.load.on("complete", function() {
            progressBar.destroy();
            loadingText.destroy();
            percentText.destroy();
          });
          // end loading screen

          this.load.image("star", "assets/star-1.png");
          this.textures.addBase64("star", star);

          this.load.image("redGiant", "assets/star-2.png");
          this.textures.addBase64("redGiant", redGiant);

          this.load.image("ship", "assets/ship.png");
          this.textures.addBase64("ship", ship);

          this.load.image("bullet", "assets/bullet6.png");
          this.textures.addBase64("bullet", bullet);

          this.load.image("jets", "assets/blue.png");
          this.textures.addBase64("jets", jets);

          this.load.image("flares", "assets/yellow.png");
          this.textures.addBase64("flares", flares);

          this.load.image("asteroid", "assets/asteroid.png");
          this.textures.addBase64("asteroid", asteroid);

          this.load.spritesheet("spaceStation", spaceStation, {
            frameWidth: 3372,
            frameHeight: 700
          });

          this.load.audio("rocket", rocket);
          this.load.audio("gun", gun);
          this.load.audio("crash", crash);
        },

        create: function() {
          let Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,

            initialize: function Bullet(scene) {
              Phaser.GameObjects.Image.call(this, scene, 0, 0, "bullet");

              this.speed = 0;
              this.born = 0;
            },

            fire: function(player) {
              this.setPosition(player.x + 100, player.y); // 100 cuz account for ship length

              if (player.flipX) {
                //  Facing left
                this.speed = Phaser.Math.GetSpeed(-2000 + player.vel.x, 1);
              } else {
                //  Facing right
                this.speed = Phaser.Math.GetSpeed(2000 + player.vel.x, 1);
              }

              this.born = 0;
            },

            update: function(time, delta) {
              this.x += this.speed * delta;

              this.born += delta;

              if (this.born > 2000) {
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

          // this.startZone = this.impact.add.sprite(1250, 350, 'spaceStation').setDepth(1);
          // this.add.image(0,0, 'spaceStation')

          const config = {
            key: "lights",
            frames: this.anims.generateFrameNumbers("spaceStation", {
              start: 0,
              end: 6
            }),
            frameRate: 3,
            repeat: -1
          };

          this.anims.create(config);

          this.spaceStation = this.impact.add
            .sprite(1686, 350, "spaceStation")
            .play("lights")
            .setDepth(1);

          this.finishLine = this.impact.add
            .sprite(mapWidth - 1686, 350, "spaceStation")
            .play("lights")
            .setDepth(1);

          // var spaceStation = this.add.sprite(1250, 350, 'spaceStation');
          // this.spaceStation.anims.play('lights');

          // var config = {
          //   key: 'metaleyes',
          //   frames: this.anims.generateFrameNumbers('asteroid', {
          //     start: 0,
          //     end: 4
          //   }),
          //   frameRate: 20,
          //   repeat: -1
          // };

          // this.temp = this.impact.add.sprite(100, 350, 'spaceStation').setDepth(1)
          // this.add.image(0,0, 'spaceStation')
          //  Add a player ship

          this.player = this.impact.add
            .sprite(200, 350, "ship")
            .setBodyScale(0.6)
            .setDepth(3);
          this.player
            .setMaxVelocity(1000)
            .setFriction(400, 300)
            .setPassiveCollision();

          this.cursors = this.input.keyboard.createCursorKeys();

          this.timeText = this.add
            .text(20, 10, "", {
              font: "20px Orbitron",
              fill: "#ff0000"
            })
            .setDepth(3)
            .setScrollFactor(0);

          this.accelerationText = this.add
            .text(this.cameras.main.width - 350, 10, "", {
              font: "20px Orbitron",
              fill: "#ff0000"
            })
            .setDepth(3)
            .setScrollFactor(0);

          this.damageText = this.add
            .text(20, 660, "", {
              font: "20px Orbitron",
              fill: "#ff0000"
            })
            .setDepth(3)
            .setScrollFactor(0);

          this.penaltyText = this.add
            .text(this.cameras.main.width - 350, 660, "", {
              font: "20px Orbitron",
              fill: "#ff0000"
            })
            .setDepth(3)
            .setScrollFactor(0);

          this.levelComplete = this.add
            .text(this.cameras.main.width / 2 - 100, 250, "", {
              font: "20px Orbitron",
              fill: "#ff0000"
            })
            .setDepth(3)
            .setScrollFactor(0);

          const createBulletEmitter = () => {
            this.flares = this.add
              .particles("flares")
              .setDepth(2)
              .createEmitter({
                x: 200,
                y: 350,
                angle: { min: 170, max: 190 },
                scale: { start: 0.4, end: 0.2 },
                blendMode: "ADD",
                lifespan: 20,
                on: false
              });
          };
          // this.flares.setDepth(2)

          const createThrustEmitter = () => {
            this.thrust = this.add
              .particles("jets")
              .setDepth(2)
              .createEmitter({
                x: 200,
                y: 350,
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
              key: "redGiant",
              frameQuantity: mapWidth / 200
            });

            var rect = new Phaser.Geom.Rectangle(0, 0, mapWidth, 1000);

            Phaser.Actions.RandomRectangle(group.getChildren(), rect);

            group.children.iterate(function(child, index) {
              var sf = Math.max(0.3, Math.random());

              if (child.texture.key === "redGiant") {
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
              frames: this.anims.generateFrameNumbers("asteroid", {
                start: 0,
                end: 4
              }),
              frameRate: 20,
              repeat: -1
            };

            this.anims.create(config);

            for (var i = 0; i < mapWidth / 400; i++) {
              var x = Phaser.Math.Between(4000, mapWidth);
              var y = Phaser.Math.Between(100, 300);
              let angle = Phaser.Math.Between(0, 360);
              let size = Phaser.Math.Between(1, 2);

              var asteroid = this.impact.add
                .sprite(x, y, "asteroid")
                // .play('metaleyes')
                .setTypeA()
                .setCheckAgainstA()
                .setActiveCollision()
                .setMaxVelocity(300);

              asteroid
                .setActiveCollision()
                .setBounce(1)
                .setBodyScale(size * 0.25);
              asteroid.setVelocity(
                Phaser.Math.Between(20, 60),
                Phaser.Math.Between(20, 60)
              );

              asteroid.angle = angle;

              if (Math.random() > 0.5) {
                asteroid.vel.x *= -1;
              } else {
                asteroid.vel.y *= -1;
              }
            }
          };

          // this.player.setTypeA().setCheckAgainstB().setActiveCollision().setMaxVelocity(300);
          // this.asteroid.setTypeB().setCheckAgainstA().setFixedCollision();

          const hitAstroid = (player, asteroid, axis) => {
            if (this.gameOver === false) {
              this.damage += 1000;
              this.cameras.main.flash(500, "25", "000", "000", true);
              // this.sound.play('crash')
              this.crashSound.play();
            }
          };

          // this.physics.add.overlap(
          //     this.player,
          //     asteroid,
          //     hitAstroid,
          //     null,
          //     this
          // );
          this.player.setCollideCallback(hitAstroid, this);

          createStarfield();
          createAliens();
          createThrustEmitter();
          createBulletEmitter();

          this.timer = this.time.addEvent({
            delay: 1000000,
            callbackScope: this
          });

          // const endZone = this.game.scene.zone(
          //     38000,
          //     400,
          //     10,
          //     800
          // ).setPassiveCollision()

          // const crossEndZone = (player, endZone, axis) => {
          //     console.log('GAME ENDED')
          // }

          // // let endZone = Phaser.GameObjects.zone(38000, 400, 10, 800)

          // endZone.setCollideCallback(crossEndZone, this)

          //   const gunConfig = {
          //     mute: false,
          //     volume: .1,
          //     rate: 1,
          //     detune: 0,
          //     seek: 0,
          //     loop: false,
          //     delay: 0
          // }
          this.rocketSound = this.sound.add("rocket");
          this.rocketSound.volume = 0.25;
          this.rocketSound.duration = 0.1;

          this.gunSound = this.sound.add("gun");
          this.gunSound.volume = 0.25;
          this.gunSound.duration = 0.01;

          this.crashSound = this.sound.add("crash");
        },

        update: function(time, delta) {
          if (this.gameOver) {
            return;
          }
          function time_convert(num) {
            const seconds = Math.floor(num / 1000);
            const miliSeconds = num % 1000;
            return `${seconds.toLocaleString()}:${miliSeconds
              .toLocaleString()
              .substr(0, 2)}`;
          }
          let timeElapsed = Math.floor(this.timer.getElapsed());

          this.timeText.setText(`TIME >> ${time_convert(timeElapsed)}`);

          this.accelerationText.setText(
            `ACCELERATION >> ${(this.player.vel.x * 50).toLocaleString()}`
          );

          this.damageText.setText(`DAMAGE >> ${this.damage.toLocaleString()}`);

          this.penaltyText.setText(
            `PENALTY >> ${this.penalty.toLocaleString()}`
          );

          if (this.player.x > mapWidth - 2000) {
            this.gameOver = true;
            this.levelComplete.setText(
              `> Mission Acomplished <\n\n1,000,000\n- TIME >> ` +
                `${time_convert(timeElapsed)}\n- DAMAGE >> ` +
                `${this.damage.toLocaleString()}\n- PENALTY >> ` +
                `${this.penalty.toLocaleString()}\n` +
                `------------------------\n` +
                `Score >> ${(1000000 - this.penalty).toLocaleString()}\n` +
                `\nEnter Your Name: __________` +
                `Submit`
            );
          }
          this.thrust.setPosition(this.player.x - 80, this.player.y); // 80 cuz account for ship length

          if (this.cursors.left.isDown) {
            this.thrust.setPosition(this.player.x + 80, this.player.y);
            this.player.setAccelerationX(-1200);
            this.player.flipX = true;
          } else if (this.cursors.right.isDown) {
            // this.sound.play('rocket')
            this.rocketSound.play();
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
              (this.thrust.x.propertyValue += this.player.flipX ? 16 : -16),
              this.thrust.y.propertyValue
            );
            this.thrust.setSpeed(this.player.vel.x / 2);
            this.thrust.emitParticle(16);
          } else if (this.player.vel.x > 0) {
            this.thrust.setPosition(
              (this.thrust.x.propertyValue += this.player.flipX ? 16 : -16),
              this.thrust.y.propertyValue
            );
            this.thrust.setSpeed(this.player.vel.x / 2);
            this.thrust.emitParticle(16);
          }

          if (this.cursors.space.isDown && time > this.lastFired) {
            var bullet = this.bullets.get();
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(1);

            // play gun sound
            // this.sound.play('gun')

            if (bullet) {
              this.gunSound.play();
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

          //  Position the center of the camera on the player
          //  We -400 because the camera width is 800px and
          //  we want the center of the camera on the player, not the left-hand side of it
          this.cameras.main.scrollX = this.player.x - 400;
          // this.cameras.main.startFollow(this.player, true, 0.02, 0.02);

          //  And this camera is 400px wide, so -200
          // this.minimap.scrollX = Phaser.Math.Clamp(this.player.x - 200, 800, mapWidth);
          // console.log(Math.floor(this.timer.getElapsed()))
          // this.info.setText('\nTime: ' + Math.floor(this.timer.getElapsed()));
          this.penalty = timeElapsed + this.damage;
          // console.log('penalty: ', this.penalty)
        }
      }
    }
  };

  render() {
    const { initialize, game } = this.state;

    return (
      <>
        {/* <div id='black_box'></div> */}
        <IonPhaser id="phaserGame" game={game} initialize={initialize} />
        <div id="red_line_button"></div>
        <div className="stripe-1"></div>
        <div id="red_line_button"></div>
      </>
    );
  }
}
export default Game;
