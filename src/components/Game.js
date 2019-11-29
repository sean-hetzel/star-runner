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

const mapWidth = 40000;
const mapHeight = 700;
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
          let line = new Phaser.Geom.Line(0, 50, 200, 50);

          let graphics = this.add.graphics({
            lineStyle: { width: 4, color: 0xff0000 }
          });
          graphics.strokeLineShape(line).setDepth(4);

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

          this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

          this.bullets = this.add.group({
            classType: Bullet,
            runChildUpdate: true
          });

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

          this.cursors = this.input.keyboard.createCursorKeys();

          this.spaceStation = this.impact.add
            .sprite(1686, 350, "spaceStation")
            .play("lights")
            .setDepth(1);

          this.finishLine = this.impact.add
            .sprite(mapWidth - 1686, 350, "spaceStation")
            .play("lights")
            .setDepth(1);

          this.player = this.impact.add
            .sprite(200, 350, "ship")
            .setBodyScale(0.6)
            .setDepth(3);

          this.player
            .setMaxVelocity(1000)
            .setFriction(400, 300)
            .setPassiveCollision();

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
            let group = this.add.group({
              key: "star",
              frameQuantity: mapWidth / 4
            });

            group.createMultiple({
              key: "redGiant",
              frameQuantity: mapWidth / 200
            });

            let rect = new Phaser.Geom.Rectangle(0, 0, mapWidth, 1000);

            Phaser.Actions.RandomRectangle(group.getChildren(), rect);

            group.children.iterate(function(child, index) {
              let sf = Math.max(0.3, Math.random());

              if (child.texture.key === "redGiant") {
                sf = 0.1;
              }

              child.setScrollFactor(sf);
            }, this);
          };

          const createAsteroids = () => {
            for (let i = 0; i < mapWidth / 400; i++) {
              let x = Phaser.Math.Between(4000, mapWidth);
              let y = Phaser.Math.Between(100, 300);
              let angle = Phaser.Math.Between(0, 360);
              let size = Phaser.Math.Between(1, 2);

              let asteroid = this.impact.add
                .sprite(x, y, "asteroid")
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

          const hitAstroid = (player, asteroid, axis) => {
            if (this.gameOver === false) {
              this.damage += 1000;
              this.cameras.main.flash(500, "25", "000", "000", true);
              this.crashSound.play();
            }
          };

          this.player.setCollideCallback(hitAstroid, this);

          this.rocketSound = this.sound.add("rocket");
          this.rocketSound.volume = 0.25;
          this.rocketSound.duration = 0.1;

          this.gunSound = this.sound.add("gun");
          this.gunSound.volume = 0.25;
          this.gunSound.duration = 0.01;

          this.crashSound = this.sound.add("crash");

          this.timer = this.time.addEvent({
            delay: 1000000,
            callbackScope: this
          });

          createStarfield();
          createAsteroids();
          createThrustEmitter();
          createBulletEmitter();
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

          this.penalty = timeElapsed + this.damage;

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

          // 80 cuz account for ship length
          this.thrust.setPosition(this.player.x - 80, this.player.y);

          if (this.cursors.left.isDown) {
            this.thrust.setPosition(this.player.x + 80, this.player.y);
            this.player.setAccelerationX(-1200);
            this.player.flipX = true;
          } else if (this.cursors.right.isDown) {
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
            let bullet = this.bullets.get();
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(1);

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

          this.cameras.main.scrollX = this.player.x - 400;
        }
      }
    }
  };

  render() {
    const { initialize, game } = this.state;

    return (
      <>
        <IonPhaser id="phaserGame" game={game} initialize={initialize} />
        <div id="red_line_button"></div>
        <div className="stripe-1"></div>
        <div id="red_line_button"></div>
      </>
    );
  }
}
export default Game;
