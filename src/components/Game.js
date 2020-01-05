import React, { Component } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { EventEmitter } from "../events.js";
import star from "../assets/star-1.png";
import redGiant from "../assets/star-2.png";
import ship from "../assets/star-fighter.png";
import bullet from "../assets/bullet6.png";
import jets from "../assets/blue.png";
import flares from "../assets/yellow.png";
import asteroid from "../assets/asteroid.png";
import marsStation from "../assets/mars-station-sprite-sheet.png";
import arcadiaStationInside from "../assets/arcadia-station-interior.png";
import arcadiaStation from "../assets/arcadia-station-sprite-sheet.png";
import mars from "../assets/mars.png";
import saturn from "../assets/saturn.png";
import arcadia from "../assets/arcadia-234.png";
import rocket from "../assets/rocket.mp3";
import gun from "../assets/gun.mp3";
import crash from "../assets/crash.mp3";
import MissionReport from "./MissionReport";

const mapWidth = 60000;
const mapHeight = 700;

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
          isFlying: false,
          firingGun: false,
          gameOver: false
        },

        ///////////////////////////// PRELOAD /////////////////////////////////
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

          this.load.image("ship", "assets/star-fighter.png");
          this.textures.addBase64("ship", ship);

          this.load.image("bullet", "assets/bullet6.png");
          this.textures.addBase64("bullet", bullet);

          this.load.image("jets", "assets/blue.png");
          this.textures.addBase64("jets", jets);

          this.load.image("flares", "assets/yellow.png");
          this.textures.addBase64("flares", flares);

          this.load.image("asteroid", "assets/asteroid.png");
          this.textures.addBase64("asteroid", asteroid);

          this.load.image("mars", "assets/mars.png");
          this.textures.addBase64("mars", mars);

          this.load.image("saturn", "assets/saturn.png");
          this.textures.addBase64("saturn", saturn);

          this.load.image("arcadia", "assets/arcadia-234.png");
          this.textures.addBase64("arcadia", arcadia);

          this.load.image(
            "arcadiaStationInside",
            "assets/arcadia-station-inside.png"
          );
          this.textures.addBase64("arcadiaStationInside", arcadiaStationInside);

          this.load.spritesheet("marsStation", marsStation, {
            frameWidth: 3372,
            frameHeight: 700
          });

          this.load.spritesheet("arcadiaStation", arcadiaStation, {
            frameWidth: 2947,
            frameHeight: 700
          });

          this.load.audio("rocket", rocket);
          this.load.audio("gun", gun);
          this.load.audio("crash", crash);
        },

        ///////////////////////////// CREATE //////////////////////////////////
        create: function() {
          // create mission report and hide it until game over
          this.missionReport = document.getElementById("mission_report");
          this.missionReport.style.display = "none";

          let Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,

            initialize: function Bullet(scene) {
              Phaser.GameObjects.Image.call(this, scene, 0, 0, "bullet");

              this.speed = 0;
              this.born = 0;
            },

            fire: function(player) {
              if (player.flipX) {
                //  Facing left
                this.setPosition(player.x - 120, player.y + 10);
                this.speed = Phaser.Math.GetSpeed(-2000 + player.vel.x, 1);
              } else {
                //  Facing right
                this.setPosition(player.x + 120, player.y + 10);
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

          this.cursors = this.input.keyboard.createCursorKeys();

          this.player = this.impact.add
            .sprite(200, 350, "ship")
            .setBodyScale(0.7)
            .setDepth(4);

          this.player
            .setMaxVelocity(1000)
            .setFriction(300, 300)
            .setPassiveCollision();

          this.bullets = this.add.group({
            classType: Bullet,
            runChildUpdate: true
          });

          const marsConfig = {
            key: "marsStationLights",
            frames: this.anims.generateFrameNumbers("marsStation", {
              start: 0,
              end: 6
            }),
            frameRate: 3,
            repeat: -1
          };

          this.anims.create(marsConfig);

          this.marsStation = this.impact.add
            .sprite(1686, 350, "marsStation")
            .play("marsStationLights")
            .setDepth(2);

          const arcadiaConfig = {
            key: "arcadiaStationLights",
            frames: this.anims.generateFrameNumbers("arcadiaStation", {
              start: 0,
              end: 4
            }),
            frameRate: 3,
            repeat: -1
          };

          this.anims.create(arcadiaConfig);

          this.arcadiaStation = this.impact.add
            .sprite(mapWidth - 1474, 350, "arcadiaStation")
            .play("arcadiaStationLights")
            .setDepth(5);

          this.arcadiaStationInside = this.impact.add
            .sprite(mapWidth - 1474, 350, "arcadiaStationInside")
            .setDepth(3);

          this.mars = this.impact.add
            .sprite(1500, 250, "mars")
            .setDepth(1)
            .setScrollFactor(0.25).angle = 180;

          this.saturn = this.impact.add
            .sprite(6000, 500, "saturn")
            .setScale(0.1)
            .setDepth(1)
            .setScrollFactor(0.25).angle = 350;

          this.arcadia = this.impact.add
            .sprite(15000, 800, "arcadia")
            .setScale(1)
            .setDepth(1)
            .setScrollFactor(0.25).angle = 0;

          const textConfig = {
            font: "20px Orbitron",
            fill: "#ff0000"
          };

          this.timeText = this.add
            .text(20, 10, "", textConfig)
            .setDepth(6)
            .setScrollFactor(0);

          this.accelerationText = this.add
            .text(this.cameras.main.width - 350, 10, "", textConfig)
            .setDepth(6)
            .setScrollFactor(0);

          this.damageText = this.add
            .text(20, 660, "", textConfig)
            .setDepth(6)
            .setScrollFactor(0);

          this.penaltyText = this.add
            .text(this.cameras.main.width - 350, 660, "", textConfig)
            .setDepth(6)
            .setScrollFactor(0);

          this.distanceText = this.add
            .text(this.cameras.main.width / 2 - 50, 660, "DISTANCE", textConfig)
            .setDepth(6)
            .setScrollFactor(0);

          const createHud = (x1, y1, x2, y2) => {
            let line = new Phaser.Geom.Line(x1, y1, x2, y2);

            let graphics = this.add.graphics({
              lineStyle: { width: 4, color: 0xff0000 }
            });
            graphics
              .strokeLineShape(line)
              .setDepth(6)
              .setScrollFactor(0);
          };

          let graphics = this.add.graphics({
            lineStyle: { width: 2, color: 0x00ff00 },
            fillStyle: { color: 0xff0000 }
          });

          let triangle = new Phaser.Geom.Triangle(
            this.cameras.main.width / 2 - 210,
            620,
            this.cameras.main.width / 2 - 200,
            635,
            this.cameras.main.width / 2 - 190,
            620
          );

          // super janky way to display distance on HUD
          graphics
            .fillTriangleShape(triangle)
            .setDepth(6)
            .setScrollFactor(-0.007);

          createHud(0, 50, 350, 50);
          createHud(
            this.cameras.main.width - 350,
            50,
            this.cameras.main.width,
            50
          );
          createHud(0, 645, 350, 645);
          createHud(
            this.cameras.main.width - 350,
            645,
            this.cameras.main.width,
            645
          );
          createHud(350, 50, 400, 0);
          createHud(
            this.cameras.main.width - 400,
            0,
            this.cameras.main.width - 350,
            50
          );
          createHud(350, 645, 400, 705);
          createHud(
            this.cameras.main.width - 400,
            705,
            this.cameras.main.width - 350,
            645
          );
          createHud(
            this.cameras.main.width / 2 - 200,
            645,
            this.cameras.main.width / 2 + 200,
            645
          );

          const createBulletEmitter = () => {
            this.flares = this.add
              .particles("flares")
              .setDepth(3)
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
              .setDepth(3)
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
            for (let i = 0; i < mapWidth / 600; i++) {
              let x = Phaser.Math.Between(4000, mapWidth - 4000);
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
                .setDepth(3)
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

          this.rocketSound = this.sound.add("rocket", {
            volume: 1,
            loop: true
          });

          this.gunSound = this.sound.add("gun", {
            volume: 1,
            loop: true
          });

          this.crashSound = this.sound.add("crash", {
            volume: 1,
            loop: false
          });

          this.timer = this.time.addEvent({
            delay: 1000000,
            callbackScope: this
          });

          createStarfield();
          createAsteroids();
          createThrustEmitter();
          createBulletEmitter();
        },

        ///////////////////////////// UPDATE //////////////////////////////////
        update: function(time, delta) {
          if (this.gameOver) {
            this.missionReport.style.display = "block";
            return;
          }

          if (
            (this.player.vel.x > 0 || this.player.vel.x < 0) &&
            this.isFlying === false
          ) {
            this.rocketSound.play();
            this.isFlying = true;
          }

          if (this.player.vel.x === 0) {
            this.rocketSound.stop();
            this.isFlying = false;
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

          if (this.player.x > 3000) {
            // mapWidth - 1000
            this.gameOver = true;
            this.sound.stopAll();
            let score = 1000000 - this.penalty;

            let missionStats = {
              time: time_convert(timeElapsed),
              damage: this.damage,
              penalty: this.penalty,
              score: score
            };

            EventEmitter.dispatch("updateScore", missionStats);
            this.missionReport.style.display = "block";
          }

          // 80 cuz account for ship length
          this.thrust.setPosition(this.player.x - 80, this.player.y + 4);
          if (this.cursors.left.isDown) {
            this.thrust.setPosition(this.player.x + 80, this.player.y + 4);
            this.player.setAccelerationX(-1200);
            this.player.flipX = true;
          } else if (this.cursors.right.isDown) {
            this.player.setAccelerationX(1200);
            this.player.flipX = false;
          } else {
            this.player.setAccelerationX(0);
          }
          if (this.cursors.up.isDown) {
            this.player.setAccelerationY(-2000);
          } else if (this.cursors.down.isDown) {
            this.player.setAccelerationY(2000);
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
            bullet.setDepth(3).setScale(0.75);

            if (bullet) {
              bullet.fire(this.player);

              this.lastFired = time + 100;
            }

            if (this.firingGun === false) {
              this.gunSound.play();
              this.firingGun = true;
            }
          }
          if (!this.cursors.space.isDown) {
            this.gunSound.stop();
            this.firingGun = false;
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
        <MissionReport {...this.props} postScore={this.props.postScore} />
        <div id="red_line_button"></div>
      </>
    );
  }
}
export default Game;
