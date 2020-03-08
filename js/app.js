const ORIENTATION_UP = "up";
const ORIENTATION_RIGHT = "right";
const ORIENTATION_DOWN = "down";
const ORIENTATION_LEFT = "left";
const STAND_STILL = "stop";
const DEFAULT_PLAYER_SPEED = 20;
const DEFAULT_PLAYER_ORIENTATION = ORIENTATION_RIGHT;
const DEFAULT_PLAYER_X = 100;
const DEFAULT_PLAYER_Y = 20;

let Player = function () {
    this.xPosition = DEFAULT_PLAYER_X;
    this.yPosition = DEFAULT_PLAYER_Y;
    this.orientation = DEFAULT_PLAYER_ORIENTATION;
    this.speed = DEFAULT_PLAYER_SPEED;
    this.getImage = function () {
        return this.image = "lead_" + this.orientation + ".png";
    };
    this.getImage();
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
        this.getImage();
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
        let image = new Image();
        let xPosition = this.xPosition;
        let yPosition = this.yPosition;
        image.onload = function() {
            context.drawImage(image, xPosition, yPosition);
        };
        image.src = "img/" + this.image;
    };
};

let GameBoard = function () {
    this.playerOne = new Player();
    this.canvas = document.getElementById('gameCanvas');
    this.start = function () {
        this.contextPlayerOne = this.canvas.getContext('2d');
        this.playerOne.draw(this.contextPlayerOne);
    };
    this.render = function () {
        this.contextPlayerOne.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.playerOne.draw(this.contextPlayerOne);
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
                this.playerOne.changeSpeed(10);
                break;
            case "e":
                this.playerOne.changeSpeed(-10);
        }
        if (orientation !== STAND_STILL) {
            this.playerOne.turn(orientation);
            this.playerOne.move();
            this.render();
        }
    };
};

let gameBoard = new GameBoard();
gameBoard.start();
