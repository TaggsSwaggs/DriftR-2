var map1 = new Phaser.Class(function(){
    var keyD;
    var keyA;
    var keyW;
    var keyLEFT;
    var keyUP;
    var keyRIGHT;
    var keyDOWN;
    var keySPACE;
    var keyESC;
    var usedBoostPad1 = false;
    var boostpad1;
    var canMove;
    var timerBox;
    var timerText;
    return {
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {
            "key": "map1"
        });
    },
    preload: function() {
        var car = localStorage.getItem('car');
        this.load.image('player', car);
    },
    create: function() {
        currentMap = "map1"
        player = this.physics.add.sprite(375, 3300, 'player');
        player.body.setMaxSpeed(500);
        player.angle = -90;
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        extendedBackground = this.add.image(2048, 2048, 'extendedBackground');
        //this is the code for the boost pad
        boostpad1 = this.physics.add.sprite(2000, 310, 'boostPad');
        this.anims.create({
            key: "boost",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("boostPad", {
                start: 0,
                end: 3
            }),
            repeat: -1
        });
        boostpad1.play("boost")
        boostpad1.setScale(.5);
        boostpad1.angle = 90;

        //Enables Multiplayer
        if (twoPlayer == true) {
            canMove = false;
            player2 = this.physics.add.sprite(435, 3300, 'player2');
            player2.setBounce(0.2);
            player2.setCollideWorldBounds(false);
            player2.body.setMaxSpeed(500);
            player2.angle = -90;
            camera = this.cameras.main;
            camera.setSize(camera.width, (camera.height / 2) - 4);
            camera.startFollow(player);
            var camera1 = this.cameras.add();
            camera1.setSize(camera1.width, (camera1.height / 2) - 4);
            camera1.setPosition(0, 400);
            camera1.startFollow(player2);
            this.physics.add.collider(player, player2)
        } else {
            camera = this.cameras.main;
            camera.startFollow(player);
            canMove = true;
        };


        const tileMap1 = this.make.tilemap({
            key: 'tileMap1'
        })

        //Assigns Images To TileMap
        const map1Pallet = tileMap1.addTilesetImage('map1Pallet', 'map1Pallet', 8, 8, 1, 2);

        backLayer = tileMap1.createLayer('Back', map1Pallet)
        trackLayer = tileMap1.createLayer('Track', map1Pallet)
        startLine = tileMap1.createLayer('Start', map1Pallet)
        check1 = tileMap1.createLayer('check1', map1Pallet)
        check2 = tileMap1.createLayer('check2', map1Pallet)
        check3 = tileMap1.createLayer('check3', map1Pallet)
        borderLayer = tileMap1.createLayer('Border', map1Pallet)

        //Sets Collistion For Player
        borderLayer.setCollisionByProperty({
            collides: true
        })
        backLayer.setCollisionByProperty({
            collides: true
        })

        this.physics.add.collider(player, borderLayer);

        //Defines Keyboard Keys
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        timerBox = this.add.image(676, 50, 'timerBox');
        timerText = this.add.text(600, 20, "", {
            fontFamily: 'Dogica',
            fontSize: '32px'
        });
        timerBox.setScrollFactor(0, 0);
        timerText.setScrollFactor(0, 0);
        timer = 0;
        timez = 0;
        seconds = 0;
        minutes = 0;
        milliseconds = 0;
        timerOn = false;
        countdownTimer = true;
        masSpeed = 500;
        masSpeed2 = 500;
        check1Pass = true;
        check2Pass = true;
        check3Pass = true;
        ranOnce = false;
        ranOnce2 = false;
        lapCount = 0;
        finalTime = 0;
        p1Go = false;
        p2Go = false;
        p1Left = false;
        p2Left = false;
        p1Exit = false;
        p1Right = false;
        p2Right = false;
        placeValue = 0;

        //Plays Cards Sound Effects
        first = this.sound.add("first", {
            loop: true
        });
        second = this.sound.add("second", {
            loop: true
        });
        good = this.sound.add("good", {
            loop: true
        });

        //Ads A BoostPad To The Map
        boostpads = this.add.group();
        boostpads.add(boostpad1);

        cars = this.add.group();
        cars.add(player);
        const layer = this.add.layer();
        layer.add([boostpad1, player])
        if (twoPlayer == true) {
            layer.add([player2]);
            cars.add(player2);
            this.physics.add.collider(player2, borderLayer);
            camera1.ignore(timerText)
            camera1.ignore(timerBox)
        }

        //Handles BoostPads and BoostPad Collision
        this.physics.add.overlap(cars, boostpads, function(user, boostpad) {
            if (boostpad == boostpad1 && usedBoostPad1 == false) {
                usedBoostPad1 = true;
                boostpad1.stop("boost");
                boostpad1.setFrame(0);
                user.body.setMaxSpeed(1000);
                user.body.velocity.normalize()
                    .scale(1000);
                setTimeout(function() {
                    user.body.setMaxSpeed(500);
                }, 10000);
            }
        });

        if (twoPlayer == true) {
            countDown = this.add.text(370, 3150, "", {
                fontFamily: 'Dogica',
                fontSize: 40,
                color: '#ffbe00'
            });
            layer.add([countDown]);
            setTimeout(function() {
                countDown.setText(" 3");
            }, 1000);
            setTimeout(function() {
                countDown.setText(" 2");
            }, 2000);
            setTimeout(function() {
                countDown.setText(" 1");
            }, 3000);
            setTimeout(function() {
                countDown.setText("GO!");
                canMove = true;
                timerOn = true;
            }, 4000);
            setTimeout(function() {
                countDown.destroy();
            }, 5000);
        }
        good.setVolume(.6)
        first.setVolume(.6)
        second.setVolume(.6)
        good.play()
        first.play()
        second.play()
    },

    update: function() {
        var pads = this.input.gamepad.gamepads;
        if (pads.length > 0) {
            var pad = pads[0];
            if (pad.leftStick.x < 0) {
                p1Left = true
            } else {
                p1Left = false
            }
            if (pad.leftStick.x > 0) {
                p1Right = true
            } else {
                p1Right = false
            }
            if (pad.A) {
                p1Go = true
            } else {
                p1Go = false
            }
            if (pad.B) {
                p1Exit = true
            } else {
                p1Exit = false
            }

        } else if (pads.length > 1) {
            var pad2 = pads[1];
            if (pad2.leftStick.x < 0) {
                p2Left = true;
            } else {
                p2Left = false;
            }
            if (pad2.leftStick.x > 0) {
                p2Right = true;
            } else {
                p2Right = false;
            }
            if (pad2.A) {
                p2Go = true;
            } else {
                p2Go = false;
            }
            if (pad2.B) {
                p1Exit = true
            } else {
                p1Exit = false
            }
        }


        if (player.body.speed == 0) {
            second.pause()
            good.pause()
            first.pause()
        } else if (player.body.speed < 420) {
            second.pause()
            good.pause()
            first.resume()
        } else if (player.body.speed < 499) {
            first.pause()
            good.pause()
            second.resume()
        } else if (player.body.speed > 499) {
            first.pause()
            second.pause()
            good.resume()
        }

        if (canMove == true) {
            this.input.keyboard.enabled = true;
            this.input.gamepad.enabled = true;
        } else {
            this.input.keyboard.enabled = false
            this.input.gamepad.enabled = false
        }
        getTile(currentMap, twoPlayer);

        //Sets Players Max Speed
        player.setMaxVelocity(9999, 9999);
        //Players Movement Controls
        if (player.body.speed > 15 && (keyLEFT.isDown || p1Left)) {
            player.setAngularVelocity(-150);
        } else if (player.body.speed > 15 && (keyRIGHT.isDown || p1Right)) {
            player.setAngularVelocity(150);
        } else {
            player.setAngularVelocity(0);
        }
        if ((keyUP.isDown || p1Go) && player.body.speed < 516) {
            this.physics.velocityFromRotation(player.rotation, 700, player.body.acceleration);
        } else if (player.body.speed > 400) {
            this.physics.velocityFromRotation(player.rotation, (player.body.speed - 75), player.body.velocity);
        } else {
            player.setAcceleration(0);
            player.body.drag.x = 160;
            player.body.drag.y = 160;
            this.physics.velocityFromRotation(player.rotation, player.body.speed, player.body.velocity);
        }


        if (p1Tile.index == 4 || p1Tile.index == 5 || p1Tile.index == 6 || p1Tile.index == 7 || p1Tile.index == 8 || p1Tile.index == 9) {
            //this slows car down in grass
            if (player.body.speed > 200) {
                masSpeed = (masSpeed - 7)
            }
            ranOnce = true;
            player.body.setMaxSpeed(masSpeed)
            if (player.body.speed < 200) {
                if (player.body.speed > 15 && (keyLEFT.isDown || p1Left)) {
                    player.setAngularVelocity(-50);
                } else if (player.body.speed > 15 && (keyRIGHT.isDown || p1Right)) {
                    player.setAngularVelocity(50);
                } else {
                    player.setAngularVelocity(0);
                }
                if (keyUP.isDown || p1Go) {
                    this.physics.velocityFromRotation(player.rotation, 100, player.body.velocity);
                } else {
                    player.setAcceleration(0);
                    player.body.drag.x = 300;
                    player.body.drag.y = 300;
                    this.physics.velocityFromRotation(player.rotation, player.body.speed, player.body.velocity);
                }
            }
        } else {
            masSpeed = 500
            if (ranOnce == true) {
                player.body.setMaxSpeed(500);
                ranOnce = false;
            }
        }
        //player2's movement
        if (twoPlayer == true) {
            player2.setMaxVelocity(9999, 9999);
            if (player2.body.speed > 15 && (keyA.isDown || p2Left)) {
                player2.setAngularVelocity(-150);
            } else if (player2.body.speed > 15 && (keyD.isDown || p2Right)) {
                player2.setAngularVelocity(150);
            } else {
                player2.setAngularVelocity(0);
            }
            if ((keyW.isDown || p2Go) && player2.body.speed < 516) {
                this.physics.velocityFromRotation(player2.rotation, 700, player2.body.acceleration);
            } else if (player2.body.speed > 400) {
                this.physics.velocityFromRotation(player2.rotation, (player2.body.speed - 75), player2.body.velocity);
            } else {
                player2.setAcceleration(0);
                player2.body.drag.x = 160;
                player2.body.drag.y = 160;
                this.physics.velocityFromRotation(player2.rotation, player2.body.speed, player2.body.velocity);
            }
            //this slows down the car in grass 
            if (p2Tile.index == 4 || p2Tile.index == 5 || p2Tile.index == 6 || p2Tile.index == 7 || p2Tile.index == 8 || p2Tile.index == 9) {
                if (player2.body.speed > 300) {
                    masSpeed2 = (masSpeed2 - 7)
                }
                ranOnce2 = true;
                player2.body.setMaxSpeed(masSpeed2)
                if (player2.body.speed < 310) {
                    if (player2.body.speed > 15 && (keyA.isDown || p2Left)) {
                        player2.setAngularVelocity(-50);
                    } else if (player2.body.speed > 15 && (keyD.isDown || p2Right)) {
                        player2.setAngularVelocity(50);
                    } else {
                        player2.setAngularVelocity(0);
                    }
                    if ((keyW.isDown || p2Go)) {
                        this.physics.velocityFromRotation(player2.rotation, 100, player2.body.velocity);
                    } else {
                        player2.setAcceleration(0);
                        player2.body.drag.x = 300;
                        player2.body.drag.y = 300;
                        this.physics.velocityFromRotation(player2.rotation, player2.body.speed, player2.body.velocity);
                    }
                }
            } else {
                masSpeed2 = 500
                if (ranOnce2 == true) {
                    player2.body.setMaxSpeed(500);
                    ranOnce2 = false;
                }
            }
        }
        //This is the code for the timer function
        if (timerOn == true) {
            while (timer <= 100) {
                timer = timer + 01;
            }
        }
        if (timer >= 100) {
            timer = 00;
            timez = timez + 01;
        }
        if (timez >= 60) {
            timez = 00;
            seconds = seconds + 01;
        }
        if (seconds >= 60) {
            seconds = 00;
            minutes = minutes + 01;
        }
        milliseconds = (timez * 1.666666666666667)
            .toFixed(0)
        if (minutes > 00) {
            finalTime = minutes.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) + "." + seconds.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) + "." + milliseconds.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
        } else if (seconds > 00) {
            finalTime = seconds.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) + "." + milliseconds.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
        } else {
            finalTime = milliseconds.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
        }

        LeaderTime = (minutes * 60) + seconds + (milliseconds / 100)
        timerText.setText(finalTime);
        //borderLayer.x = player.x - 200;
        //borderLayer.y = player.y - 150;

        if ((keyESC.isDown || p1Exit) && gamePaused == false) {
            gamePaused = true;
            this.scene.pause();
            this.scene.launch("pauseMenu");
        }

        if (twoPlayer == true) {
            if (p1Check1Tile.index == 6 || p1Check1Tile.index == 0 || p1Check1Tile.index == 1 || p2Check1Tile.index == 6 || p2Check1Tile.index == 0 || p2Check1Tile.index == 1) {
                if (check1Pass == false && check2Pass == false && check3Pass == false) {
                    check1Pass = true;
                }
            }

            if (p1Check2Tile.index == 6 || p1Check2Tile.index == 0 || p1Check2Tile.index == 1 || p2Check2Tile.index == 6 || p2Check2Tile.index == 0 || p2Check2Tile.index == 1) {
                if (check1Pass == true && check2Pass == false && check3Pass == false) {
                    check2Pass = true;
                }
            }

            if (p1Check3Tile.index == 6 || p1Check3Tile.index == 0 || p1Check3Tile.index == 1 || p2Check3Tile.index == 6 || p2Check3Tile.index == 0 || p2Check3Tile.index == 1) {
                if (check1Pass == true && check2Pass == true && check3Pass == false) {
                    check3Pass = true;
                }
            }
            //Checks if user passes checkpoint
            if (p1StartTile.index == 9 || p1StartTile.index == 10 || p2StartTile.index == 9 || p2StartTile.index == 10) {
                if (lapCount == 0) {
                    check1Pass = false;
                    check2Pass = false;
                    check3Pass = false;
                    lapCount = lapCount + 1;
                } else if (lapCount > 0 && lapCount < 3 && check1Pass == true && check2Pass == true && check3Pass == true) {
                    check1Pass = false;
                    check2Pass = false;
                    check3Pass = false;
                    lapCount = lapCount + 1;
                    usedBoostPad1 = false;
                    boostpad1.play("boost");
                } else if (lapCount == 3 && check1Pass == true && check2Pass == true && check3Pass == true) {
                    check1Pass = false;
                    check2Pass = false;
                    check3Pass = false;
                    timerOn = false
                    var map1Leader = localStorage.getItem('map1Leader');
                    map1Leader = JSON.parse(map1Leader);
                    map1Leader = map1Leader.slice(0, 5);
                    var map1Leaderlist = localStorage.getItem('map1Leaderlist');
                    map1Leaderlist = JSON.parse(map1Leaderlist);
                    map1Leaderlist = map1Leaderlist.slice(0, 5);
                    var done = false;
                    //Handles Leaderboard
                    for (var i = 0; i < 5; i++) {
                        if (done == false) {
                            if (LeaderTime < map1Leaderlist[i]) {
                                map1Leader.splice(i, 0, finalTime);
                                map1Leaderlist.splice(i, 0, LeaderTime);
                                localStorage.setItem('map1Leaderlist', JSON.stringify(map1Leaderlist));
                                localStorage.setItem('map1Leader', JSON.stringify(map1Leader));
                                placeValue = i + 1;
                                this.scene.launch("LeaderBoardEnter");
                                this.scene.pause();
                                done = true;
                            } else if (map1Leaderlist[i] == 0) {
                                map1Leader.splice(i, 0, finalTime);
                                map1Leaderlist.splice(i, 0, LeaderTime);
                                localStorage.setItem('map1Leaderlist', JSON.stringify(map1Leaderlist));
                                localStorage.setItem('map1Leader', JSON.stringify(map1Leader));
                                placeValue = i + 1;
                                this.scene.launch("LeaderBoardEnter");
                                this.scene.pause();
                                done = true;
                            }
                        }
                    }
                    if (done != true) {
                        this.scene.launch("lapsComplete");
                        this.scene.pause();
                    }
                }
            }
        } else {
            if (p1Check1Tile.index == 6 || p1Check1Tile.index == 0 || p1Check1Tile.index == 1) {
                if (check1Pass == false && check2Pass == false && check3Pass == false) {
                    check1Pass = true;
                }
            }

            if (p1Check2Tile.index == 6 || p1Check2Tile.index == 0 || p1Check2Tile.index == 1) {
                if (check1Pass == true && check2Pass == false && check3Pass == false) {
                    check2Pass = true;
                }
            }

            if (p1Check3Tile.index == 6 || p1Check3Tile.index == 0 || p1Check3Tile.index == 1) {
                if (check1Pass == true && check2Pass == true && check3Pass == false) {
                    check3Pass = true;
                }
            }

            if (p1StartTile.index == 9 || p1StartTile.index == 10) {
                if (lapCount == 0) {
                    timerOn = true
                    check1Pass = false;
                    check2Pass = false;
                    check3Pass = false;
                    lapCount = lapCount + 1;
                } else if (lapCount > 0 && lapCount < 3 && check1Pass == true && check2Pass == true && check3Pass == true) {
                    check1Pass = false;
                    check2Pass = false;
                    check3Pass = false;
                    lapCount = lapCount + 1;
                    usedBoostPad1 = false;
                    boostpad1.play("boost");
                } else if (lapCount == 3 && check1Pass == true && check2Pass == true && check3Pass == true) {
                    check1Pass = false;
                    check2Pass = false;
                    check3Pass = false;
                    timerOn = false
                    var map1Leader = localStorage.getItem('map1Leader');
                    map1Leader = JSON.parse(map1Leader);
                    map1Leader = map1Leader.slice(0, 5);
                    var map1Leaderlist = localStorage.getItem('map1Leaderlist');
                    map1Leaderlist = JSON.parse(map1Leaderlist);
                    map1Leaderlist = map1Leaderlist.slice(0, 5);
                    var done = false;
                    for (var i = 0; i < 5; i++) {
                        if (done == false) {
                            if (LeaderTime < map1Leaderlist[i]) {
                                map1Leader.splice(i, 0, finalTime);
                                map1Leaderlist.splice(i, 0, LeaderTime);
                                localStorage.setItem('map1Leaderlist', JSON.stringify(map1Leaderlist));
                                localStorage.setItem('map1Leader', JSON.stringify(map1Leader));
                                placeValue = i + 1;
                                this.scene.launch("LeaderBoardEnter");
                                this.scene.pause();
                                done = true;
                            } else if (map1Leaderlist[i] == 0) {
                                map1Leader.splice(i, 0, finalTime);
                                map1Leaderlist.splice(i, 0, LeaderTime);
                                localStorage.setItem('map1Leaderlist', JSON.stringify(map1Leaderlist));
                                localStorage.setItem('map1Leader', JSON.stringify(map1Leader));
                                placeValue = i + 1;
                                this.scene.launch("LeaderBoardEnter");
                                this.scene.pause();
                                done = true;
                            }
                        }
                    }
                    if (done != true) {
                        this.scene.launch("lapsComplete");
                        second.pause()
                        good.pause()
                        first.pause()
                        this.scene.pause();
                    }
                }
            }
        }
    }
}}());