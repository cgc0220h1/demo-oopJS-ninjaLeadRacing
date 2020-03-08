const ORIENTATION_UP = "up";
const ORIENTATION_RIGHT = "right";
const ORIENTATION_DOWN = "down";
const ORIENTATION_LEFT = "left";
const STAND_STILL = "stop";
const DEFAULT_PLAYER_SPEED = 10;
const DEFAULT_PLAYER_ORIENTATION = ORIENTATION_RIGHT;
const DEFAULT_PLAYER_X = 100;
const DEFAULT_PLAYER_Y = 20;
const DEFAULT_PLAYER_W = 120;
const DEFAULT_PLAYER_H = 120;
const DEFAULT_ENEMY_W = 160;
const DEFAULT_ENEMY_H = 160;
const DEFAULT_PRIZE_W = 60;
const DEFAULT_PRIZE_H = 60;
const GAMEBOARD_X = 600;
const GAMEBOARD_Y = 600;

let Player = function (name) {
    this.name = name;
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

    this.delete = function (context) {
        context.clearRect(this.xPosition, this.yPosition, this.width, this.height);
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

let Enemy = function (name) {
    this.name = name;
    this.xPosition = Math.floor(Math.random() * (GAMEBOARD_X - DEFAULT_ENEMY_W));
    this.yPosition = Math.floor(Math.random() * (GAMEBOARD_Y - DEFAULT_ENEMY_H));
    this.width = DEFAULT_ENEMY_W;
    this.height = DEFAULT_ENEMY_H;
    this.image = "police.png";

    this.getImage = function () {
        let image = new Image(this.width, this.height);
        image.src = "img/" + this.image;
        return image;
    };

    this.delete = function (context) {
        context.clearRect(this.xPosition, this.yPosition, this.width, this.height);
    };

    this.draw = function (context) {
        let image = this.getImage();
        let xPosition = this.xPosition;
        let yPosition = this.yPosition;
        image.onload = function () {
            context.drawImage(image, xPosition, yPosition);
        };
        image.src = "img/" + this.image;
    };
};

let Prize = function (name) {
    this.name = name;
    this.xPosition = Math.floor(Math.random() * (GAMEBOARD_X - DEFAULT_PRIZE_W));
    this.yPosition = Math.floor(Math.random() * (GAMEBOARD_Y - DEFAULT_PRIZE_H));
    this.width = DEFAULT_PRIZE_W;
    this.height = DEFAULT_PRIZE_H;
    this.image = "bitcoin.png";

    this.getImage = function () {
        let image = new Image(this.width, this.height);
        image.src = "img/" + this.image;
        return image;
    };

    this.delete = function (context) {
        context.clearRect(this.xPosition, this.yPosition, this.width, this.height);
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

let GameBoard = function () {
    this.player = new Player("Player 1");
    this.policeOne = new Enemy("Police 1");
    this.policeTwo = new Enemy("Police 2");
    this.coin = new Prize("Prize");
    this.canvas = document.getElementById('gameCanvas');
    this.context = this.canvas.getContext('2d');

    this.start = function () {
        this.player.draw(this.context);
        this.policeOne.draw(this.context);
        this.policeTwo.draw(this.context);
        this.coin.draw(this.context);
        console.log(this.coin);
    };

    this.removeFrame = function (object) {
        object.delete(this.context);
    };

    this.render = function (object) {
        object.draw(this.context);
    };

    this.checkCollision = function (object1, object2) {
        let distSubX = (object1.xPosition + object1.width / 2) - (object2.xPosition + object2.width / 2);
        if (distSubX < 0) {
            distSubX *= -1;
        }
        let distSubY = (object1.yPosition + object1.height / 2) - (object2.yPosition + object2.height / 2);
        if (distSubY < 0) {
            distSubY *= -1;
        }
        let distW = (object1.width + object2.width) / 2;
        let distH = (object1.height + object2.height) / 2;
        if (distSubX <= distW && distSubY <= distH) {
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
            this.removeFrame(this.player);
            this.player.turn(orientation);
            this.player.move();
            this.render(this.player);
            let isCrashPoliceOne = this.checkCollision(this.player, this.policeOne);
            let isCrashPoliceTwo = this.checkCollision(this.player, this.policeTwo);
            let isCrashPrize = this.checkCollision(this.player, this.coin);
            if (isCrashPrize) {
                this.removeFrame(this.coin);
                this.coin = new Prize();
                this.render(this.coin);
                this.removeFrame(this.policeOne);
                this.policeOne = new Enemy();
                this.render(this.policeOne);
                this.removeFrame(this.policeTwo);
                this.policeTwo = new Enemy();
                this.render(this.policeTwo);
            }
        }
    };
};

let gameBoard = new GameBoard();
gameBoard.start();
