const ORIENTATION_UP = "up";
const ORIENTATION_RIGHT = "right";
const ORIENTATION_DOWN = "down";
const ORIENTATION_LEFT = "left";
const STAND_STILL = "stop";
const DEFAULT_PLAYER_SPEED = 10;
const DEFAULT_PLAYER_ORIENTATION = ORIENTATION_RIGHT;
const DEFAULT_PLAYER_X = 100;
const DEFAULT_PLAYER_Y = 20;
const DEFAULT_PLAYER_W = 100;
const DEFAULT_PLAYER_H = 100;
const DEFAULT_ENEMY_W = 150;
const DEFAULT_ENEMY_H = 150;
const DEFAULT_PRIZE_W = 50;
const DEFAULT_PRIZE_H = 50;
const CALLIBRATE_COLLISION = 10;
const GAMEBOARD_X = 900;
const GAMEBOARD_Y = 500;

let Player = function () {
    this.xPosition = DEFAULT_PLAYER_X;
    this.yPosition = DEFAULT_PLAYER_Y;
    this.width = DEFAULT_PLAYER_W;
    this.height = DEFAULT_PLAYER_H;
    this.orientation = DEFAULT_PLAYER_ORIENTATION;
    this.speed = DEFAULT_PLAYER_SPEED;

    this.getImage = function () {
        let image = new Image(this.width, this.height);
        image.src = "img/lead_" + this.orientation + ".png";
        return image;
    };

    this.move = function () {
        switch (this.orientation) {
            case ORIENTATION_UP:
                this.yPosition -= this.speed;
                break;
            case ORIENTATION_RIGHT:
                this.xPosition += this.speed;
                break;
            case ORIENTATION_DOWN:
                this.yPosition += this.speed;
                break;
            case ORIENTATION_LEFT:
                this.xPosition -= this.speed;
                break;
        }
    };

    this.turn = function (orientation) {
        if (orientation !== this.orientation) {
            this.orientation = orientation;
            return this.orientation;
        }
        return this.orientation;
    };

    this.changeSpeed = function (number) {
        this.speed += number;
    };

    this.draw = function (context) {
        let image = this.getImage();
        let xPosition = this.xPosition;
        let yPosition = this.yPosition;
        image.onload = function () {
            context.drawImage(image, xPosition, yPosition);
        };
    };
};

let Enemy = function () {
    this.xPosition = Math.random() * GAMEBOARD_X;
    this.yPosition = Math.random() * GAMEBOARD_Y;
    this.width = DEFAULT_ENEMY_W;
    this.height = DEFAULT_ENEMY_H;
    this.image = "police.png";

    this.draw = function (context) {
        let image = new Image(this.width, this.height);
        let xPosition = this.xPosition;
        let yPosition = this.yPosition;
        image.onload = function () {
            context.drawImage(image, xPosition, yPosition);
        };
        image.src = "img/" + this.image;
    };
};

let Prize = function () {
    this.xPosition = Math.random() * GAMEBOARD_X;
    this.yPosition = Math.random() * GAMEBOARD_Y;
    this.width = DEFAULT_PRIZE_W;
    this.height = DEFAULT_PRIZE_H;
    this.image = "bitcoin.png";

    this.draw = function (context) {
        let image = new Image(this.width, this.height);
        let xPosition = this.xPosition;
        let yPosition = this.yPosition;
        image.onload = function () {
            context.drawImage(image, xPosition, yPosition);
        };
        image.src = "img/" + this.image;
    };
};

let GameBoard = function () {
    this.player = new Player();
    this.policeOne = new Enemy();
    this.policeTwo = new Enemy();
    this.prize = new Prize();
    this.canvas = document.getElementById('gameCanvas');
    this.contextPlayerOne = this.canvas.getContext('2d');
    this.contextPoliceOne = this.canvas.getContext('2d');
    this.contextPoliceTwo = this.canvas.getContext('2d');
    this.contextPrize = this.canvas.getContext('2d');

    this.start = function () {
        this.player.draw(this.contextPlayerOne);
        this.policeOne.draw(this.contextPoliceOne);
        this.policeTwo.draw(this.contextPoliceTwo);
        this.prize.draw(this.contextPrize);
    };

    this.render = function () {
        this.contextPlayerOne.clearRect(0, 0, GAMEBOARD_X, GAMEBOARD_Y);
        this.player.draw(this.contextPlayerOne);
        this.policeOne.draw(this.contextPoliceOne);
        this.policeTwo.draw(this.contextPoliceTwo);
        this.prize.draw(this.contextPrize);
    };

    this.checkCollision = function (object1, object2) {
        if (object1.yPosition + object1.height >= object2.yPosition) {
            if (object1.xPosition )
            return true;
        }
        if (object1.xPosition <= object2.xPosition + object2.width) {
            return true;
        }
        if (object1.yPosition <= object2.yPosition + object2.height) {
            return true;
        }
        if (object1.xPosition + object1.width >= object2.xPosition) {
            return true;
        }
        return false;
    };

    this.movePlayer = function (event) {
        let orientation = STAND_STILL;
        switch (event.key) {
            case "ArrowUp":
                orientation = ORIENTATION_UP;
                break;
            case "ArrowRight":
                orientation = ORIENTATION_RIGHT;
                break;
            case "ArrowDown":
                orientation = ORIENTATION_DOWN;
                break;
            case "ArrowLeft":
                orientation = ORIENTATION_LEFT;
                break;
            case "q":
                this.player.changeSpeed(DEFAULT_PLAYER_SPEED);
                break;
            case "e":
                this.player.changeSpeed(-DEFAULT_PLAYER_SPEED);
        }
        if (orientation !== STAND_STILL) {
            this.player.turn(orientation);
            this.player.move();
            this.render();
            let isCrash1 = this.checkCollision(this.player, this.policeOne);
            let isCrash2 = this.checkCollision(this.player, this.policeTwo);
            let isCrash3 = this.checkCollision(this.player, this.prize);
            console.log(isCrash1);
            console.log(isCrash2);
            console.log(isCrash3);
        }
    };
};

let gameBoard = new GameBoard();
gameBoard.start();
