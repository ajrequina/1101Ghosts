/**
Player.png sprite 
copyrighted to: 
http://gm-zelda-mmo-blog.tumblr.com/post/7427975753/animated-sprites-with-random-player-colours-for
**/


var canvas;
var ctx;
var maze = new Array(35)
var tilewidth = window.innerWidth / 9;
var tileheight = window.innerHeight / 7;
var user = new Player();
var barriers = [];
var userSpeed = 10;
var barrierSpeed = 20;
var leftCollision = false;
var rightCollision = false;
var topCollision = false;
var bottomCollision = false;
var ghosts = [];
var ghostfsm;
var image = new Image();
var floor = new Image();
var playerLose = false;
var playerWin = false;
var ghosty = new Image();
var p = new Image();
var splash = new Image();
var died = new Image();
var survived = new Image();

var ghosti = 0;
var pi = 0;

image.src = "img/wall.jpg";
floor.src = "img/floor.jpg";
ghosty.src = "img/ghost.png";
p.src = "img/player.png";
splash.src = "img/splash.png";
died.src = "img/died.png";
survived.src = "img/survived.png";


var startGame = false;
var endGame = false;


function initMaze() {
    maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1], // 1
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1], // 2
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 2, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1], // 3
        [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1], // 4
        [1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 2, 0, 0, 1], // 5
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 2, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1], // 6
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1], // 7
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1], // 8
        [1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1], // 9 
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 2, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], // 10
        [1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1], // 11
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1], // 12
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1], // 13
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1], // 14
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1], // 15
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 2, 1, 1, 1, 0, 1, 2, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1], // 16
        [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1], // 17
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1], // 18
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], // 19
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], // 20
        [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1], // 21
        [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 1], // 22
        [1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1], // 23
        [1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1], // 24
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1], // 25
        [1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1], // 26
        [1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 2, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1], // 27
        [1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1], // 28
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1], // 29
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1], // 30
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1], // 31
        [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1], // 32
        [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 33 
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] // 34
    ]
}

var barriers = []

function Maze() {
    for(i = 0, y = 0; i < maze.length; i++, y += tileheight) {
        for(j = 0, x = -1 * 14 * tilewidth; j < maze[i].length; j++, x += tilewidth) {
            if(maze[i][j] == 0) {
                maze[i][j] = new Barrier("floor", x, y, i, j);
            } else if(maze[i][j] == 1) {
                var wall = {
                    "col": i,
                    "row": j
                }
                barriers.push(wall)
                maze[i][j] = new Barrier("wall", x, y, i, j);
            } else if(maze[i][j] == -1) {
                var wall = {
                    "col": i,
                    "row": j
                }
                barriers.push(wall)
                maze[i][j] = new Barrier("exit", x, y, i, j);
            } else {
                var wall = {
                    "col": i,
                    "row": j
                }
                barriers.push(wall)
                maze[i][j] = new Barrier("door", x, y, i, j);
            }
        }
    }
}


function createWorld() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initMaze();
    Maze();
    ghostfsm = new GhostFSM();
    ghostfsm.generate();
    initGhosts();
    updateWorld();
    moveGhosts();

    if(!endGame) {
        ctx.drawImage(splash, 0, canvas.height / 2 - 255, canvas.width, 510);
    }
    if(endGame) {
        endGame = false;
    }

}

/**
 * The Ghost Class
 * Attributes: 
 *	- direction = the direction in which the ghost will go to
 *				= by default, the direction of the ghost will be right (r)
 */
function Ghost(state) {
    this.direction = "r";
    this.x = null;
    this.y = null;
    this.color = "black"
    this.destX = null;
    this.destY = null;
    this.speed = 1;
    this.width = 50;
    this.height = 50;
    this.currentState = state;

    this.currGhostState = 1;

    this.xCoord = 0;
    this.yCoord = 0;
    this.xRange = 0;
    this.yRange = 0;
    this.rangeWidth = 0;
    this.rangeHeight = 0;

    this.caughtPlayer = false;
    this.detectedPlayer = false;
    this.sawDoor = false;
    this.doorTarget = null;

    this.count = 0;

    this.getLocation = function() {
        var loc = {
            "x": this.x,
            "y": this.y
        }
        return loc;
    }

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.currentState.x, this.currentState.y, this.width, this.height);
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.currentState.x, this.currentState.yf, this.width, this.height);
    }

    this.wander = function() {
        var state = this.currentState;
        var dir = this.direction;
        var edges = state.outEdges;
        var found = false;
        for(var j = 0; j < edges.length; j++) {
            if(edges[j].label == dir) {
                if(edges[j].target.isDoor) {
                    if(maze[edges[j].target.x][edges[j].target.y].isOpen == true) {
                        maze[this.currentState.x][this.currentState.y].hasGhost = false;
                        this.currentState = edges[j].target;
                        maze[this.currentState.x][this.currentState.y].hasGhost = true;
                        found = true;
                        break;
                    }
                } else {
                    maze[this.currentState.x][this.currentState.y].hasGhost = false;
                    this.currentState = edges[j].target;
                    maze[this.currentState.x][this.currentState.y].hasGhost = true;
                    found = true;
                    break;

                }
            }
        }

        if(!found && !this.sawDoor) {
            var index = Math.floor(Math.random() * ((edges.length - 1) - 0 + 1)) + 0;
            if(edges[index].target.isDoor) {
                if(maze[edges[index].target.x][edges[index].target.y].isOpen == false) {
                    maze[this.currentState.x][this.currentState.y].hasGhost = false;
                    this.currentState = edges[index].target;
                    maze[this.currentState.x][this.currentState.y].hasGhost = true;
                    this.direction = edges[index].label;
                }

            } else {
                maze[this.currentState.x][this.currentState.y].hasGhost = false;
                this.currentState = edges[index].target;
                maze[this.currentState.x][this.currentState.y].hasGhost = true;
                this.direction = edges[index].label;
            }

        }

        this.check();
    }

    this.followUser = function(userX, userY, userWidth, userHeight) {
        var widthDistance = 0;
        var heightDistance = 0;
        var currDirX;
        var currDirY;
        var directions = [];
        if(userWidth + userX <= this.xCoord) {
            widthDistance = this.xCoord - (userWidth + userX)
            currDirX = "l";
            directions.push(currDirX);
        }
        if(userX > this.xCoord + this.width) {
            widthDistance = userX - (this.xCoord + this.width);
            currDirX = "r";
            directions.push(currDirX);
        }

        if(userHeight + userY < this.yCoord) {
            heightDistance = this.yCoord - (userHeight + userY);
            currDirY = "u";
            directions.push(currDirY);
        }
        if(userY > this.yCoord + this.height) {
            heightDistance = userY - (this.yCoord + this.height);
            currDirY = "d";
            directions.push(currDirY);
        }

        var a = this.xCoord - userX;
        var b = this.yCoord - userY;
        if(widthDistance > heightDistance) {
            this.direction = currDirX;
            var index = directions.indexOf(currDirX);
            if(index > -1) {
                directions.splice(index, 1);
            }
        } else {
            this.direction = currDirY;
            var index = directions.indexOf(currDirX);
            if(index > -1) {
                directions.splice(index, 1);
            }
        }

        var edges = this.currentState.outEdges;
        var found = false;
        for(var j = 0; j < edges.length; j++) {
            if(edges[j].label == this.direction) {
                if(edges[j].target.isDoor && maze[edges[j].target.x][edges[j].target.y].isOpen == false) {
                    this.sawDoor = true;
                    this.doorTarget = edges[j].target;
                } else {
                    maze[this.currentState.x][this.currentState.y].hasGhost = false;
                    this.currentState = edges[j].target;
                    maze[this.currentState.x][this.currentState.y].hasGhost = true;
                    found = true;
                    break;
                }
            }
        }

        if(!found && !this.sawDoor) {
            if(directions.length > 0) {
                this.direction = directions.pop();
                this.wander();
            } else {
                var index = Math.floor(Math.random() * ((edges.length - 1) - 0 + 1)) + 0;
                if(edges[index].target.isDoor && maze[edges[index].target.x][edges[index].target.y].isOpen == false) {
                    this.sawDoor = true;
                    this.doorTarget = edges[index].target;
                } else {
                    maze[this.currentState.x][this.currentState.y].hasGhost = false;
                    this.currentState = edges[index].target;
                    maze[this.currentState.x][this.currentState.y].hasGhost = true;
                    this.direction = edges[index].label;
                }
            }
        }

        this.check();
    }

    this.openDoor = function() {
        var door = maze[this.doorTarget.x][this.doorTarget.y]
        door.isOpen = true;
        door.isOpen = true;
        door.color = "red";
        door.draw();
        this.sawDoor = false;
    }

    this.check = function() {
        if(overlaps(this.width, this.height, this.xCoord, this.yCoord, user.width, user.height, user.x, user.y, 1) ||
            overlaps(this.width, this.height, this.xCoord, this.yCoord, user.width, user.height, user.x, user.y, 2) ||
            overlaps(this.width, this.height, this.xCoord, this.yCoord, user.width, user.height, user.x, user.y, 3) ||
            overlaps(this.width, this.height, this.xCoord, this.yCoord, user.width, user.height, user.x, user.y, 4)) {
            checkInBetween(this);
            playerLose = true;
            playerWin = false;
            updateWorld();
        }

        if(overlaps(this.rangeWidth, this.rangeHeight, this.xRange, this.yRange, user.width, user.height, user.x, user.y, 1) ||
            overlaps(this.rangeWidth, this.rangeHeight, this.xRange, this.yRange, user.width, user.height, user.x, user.y, 2) ||
            overlaps(this.rangeWidth, this.rangeHeight, this.xRange, this.yRange, user.width, user.height, user.x, user.y, 3) ||
            overlaps(this.rangeWidth, this.rangeHeight, this.xRange, this.yRange, user.width, user.height, user.x, user.y, 4) ||
            inRange(this.xRange, this.xRange + this.rangeWidth, this.yRange, this.yRange + this.rangeHeight, user.x, user.x + user.width, user.y, user.y + user.height)) {
            this.detectedPlayer = true;
        } else {
            this.detectedPlayer = false;
        }
    }

}

function checkInBetween(ghost) {
    var diswidth1 = Math.abs(ghost.xCoord - user.x);
    var disheight1 = Math.abs(ghost.yCoord - user.y);
    var diswidth2 = Math.abs(ghost.xCoord - (user.x + user.width));
    var disheight2 = Math.abs(ghost.yCoord - (user.y + user.height));
    var diswidth3 = Math.abs((ghost.xCoord + ghost.width) - user.x);
    var disheight3 = Math.abs((ghost.yCoord + ghost.height) - (user.y));

    if(diswidth1 < ghost.width && disheight1 < 11) {
        return true;
    }

    if(diswidth2 < ghost.width && disheight2 < 11) {
        return true;
    }

    if(diswidth3 < ghost.width && disheight3 < 11) {
        return true;
    }
    return false;
}


function inRange(gX, gY, gWidth, gHeight, uX, uY, uWidth, uHeight) {
    var uRX = uX + uWidth;
    var uBY = uY + uHeight;
    var gRX = gX + gWidth;
    var gBY = gY + gHeight;
    if(uX >= gX && uX <= gRX)
        return true
    if(uRX >= gX && uRX <= gRX)
        return true;
    if(uY >= gY && uY <= gBY)
        return true;
    if(uBY >= gY && uBY <= gBY)
        return true;

    return false;
}

function initGhosts() {

    var states = ghostfsm.getInitialStates(13);
    var ghost = new Ghost(states[0])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.count = 20;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[1])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.count = 0;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[2])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.count = 15;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[3])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.count = 30;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[4])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.count = 10;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[5])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.count = 10;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[6])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[7])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.count = 10;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[8])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[9])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[10])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[11])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.draw()
    ghosts.push(ghost);

    var ghost = new Ghost(states[12])
    maze[ghost.currentState.x][ghost.currentState.y].hasGhost = true;
    ghost.count = 10;
    ghost.draw()
    ghosts.push(ghost);
    // }
}

var ghostMove = null

function moveGhosts() {
    /*triggers: detect player (player is found, player within range), 
    			find door (find door, direction of ghost), 
    			bump wall (find wall, direction of ghost), 
    			notice dead-end
    */
    ghostMove = setInterval(function() {
        for(var i = 0; i < ghosts.length; i++) {
            var currGhost = ghosts[i];
            currGhost.check();
            if(currGhost.count > 0) {
                currGhost.count -= 1;
            } else if(currGhost.count == 0) {
                if(currGhost.sawDoor) {
                    currGhost.currGhostState = 3;
                } else if(currGhost.detectedPlayer) {
                    currGhost.currGhostState = 2;
                } else {
                    currGhost.currGhostState = 1;
                }

                switch(currGhost.currGhostState) {
                    case 1: //wander
                        currGhost.wander();
                        break;
                    case 2: //follow user
                        currGhost.followUser(user.x, user.y, user.width, user.height);
                        break;
                    case 3: //open door
                        currGhost.openDoor();
                }
            }
            if(startGame) {
                updateWorld();
            }
        }
    }, 1000)
}



function updateWorld() {

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for(i = 0; i < maze.length; i += 1) {
        var rows = maze[i];
        var ghost = null;

        for(j = 0; j < rows.length; j += 1) {
            if(rows[j].y > -99 && rows[j].y < canvas.height) {
                for(var k = 0; k < ghosts.length; k += 1) {
                    if(ghosts[k].currentState.x == i && ghosts[k].currentState.y == j) {
                        ghost = ghosts[k];
                    }
                }
                rows[j].draw(ghost);
            }
        }
    }
    if(!playerWin && !playerLose) {
        user.draw();
    }


    if(playerWin || playerLose) {
        clearInterval(ghostMove);
        if(playerWin) {
            ctx.drawImage(survived, 0, canvas.height / 2 - 255, canvas.width, 510);
            endGame = true;
        } else {
            ctx.drawImage(died, 0, canvas.height / 2 - 255, canvas.width, 510);
            endGame = true;
        }
    }

}


function Barrier(type, x, y, i, j) {
    this.type = type;
    this.isOpen = false;
    this.openCloseDir = "none";
    this.color = "rgba(255,255,255, 0)";
    this.x = x;
    this.y = y;
    this.hasGhost = false;
    this.cancel = false;

    this.i = i;
    this.j = j;

    if(this.type == "door") {
        this.color = "white";
    } else if(this.type == "wall") {
        this.color = "rgb(100, 200, 150)";
    }

    this.draw = function(ghost) {
        if(this.hasGhost) {
            ctx.fillStyle = "#b2accc";
            /*
		this also sets the coordinates for the ghost within the viewport
      */
            ghost.xCoord = this.x;
            ghost.yCoord = this.y;
            ghost.xRange = this.x - (tilewidth * 2);
            ghost.yRange = this.y - (tileheight * 3);
            ghost.rangeWidth = tilewidth * 5;
            ghost.rangeHeight = tileheight * 7;
            ctx.clearRect(this.x, this.y, tilewidth, tileheight);
            ctx.drawImage(floor, this.x, this.y, tilewidth, tileheight);
            if(maze[i][j].type == "door") {
                if(maze[i - 1][j].type == "wall" && maze[i + 1][j].type == "wall") {
                    ctx.fillStyle = "white";
                    ctx.fillRect(this.x, this.y, tilewidth, 10);
                    ctx.fillRect(this.x, this.y + tileheight - 10, tilewidth, 10);
                } else {
                    ctx.fillStyle = "white";
                    ctx.fillRect(this.x, this.y, 10, tileheight);
                    ctx.fillRect(this.x + tilewidth - 10, this.y, 10, tileheight);
                }
            }

            ctx.drawImage(ghosty, ghosti * 200, 0, 200, 200, this.x, this.y, tilewidth, tileheight);
        } else {

            ctx.fillStyle = this.color;
            if(this.type != "wall") {
                if(this.type == "floor") {
                    ctx.drawImage(floor, this.x, this.y, tilewidth, tileheight);
                }

                ctx.fillRect(this.x, this.y, tilewidth, tileheight);
                if(this.type != "door") {
                    ctx.strokeStyle = this.color;
                    ctx.strokeRect(this.x, this.y, tilewidth, tileheight);
                }


                if(this.type == "door" && this.isOpen) {
                    if(this.hasGhost == false) {
                        ctx.drawImage(floor, this.x, this.y, tilewidth, tileheight);
                    }

                    if(maze[i - 1][j].type == "wall" && maze[i + 1][j].type == "wall") {
                        ctx.fillStyle = "white";
                        ctx.fillRect(this.x, this.y, tilewidth, 10);
                        ctx.fillRect(this.x, this.y + tileheight - 10, tilewidth, 10);
                    } else {
                        ctx.fillStyle = "white";
                        ctx.fillRect(this.x, this.y, 10, tileheight);
                        ctx.fillRect(this.x + tilewidth - 10, this.y, 10, tileheight);
                    }
                }
            }

            if(this.type == "wall") {
                ctx.drawImage(image, this.x, this.y, tilewidth, tileheight);
                ctx.fillStyle = "rgb(0,0,0)";

            }
        }
    }
}

function Player() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.width = 70;
    this.height = 70;
    this.color = "rgb(255, 255, 255)";

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.drawImage(p, pi * 90, 270, 90, 90, this.x, this.y, this.width, this.height);
    }
}

function pointCollision(tx, ty, ax, ay, bx, by) {
    return tx >= ax && ty >= ay && tx <= bx && ty <= by;
}

var direction = "down";

function setDoor() {
    for(var i = 0; i < barriers.length; i++) {
        var barr = maze[barriers[i].col][barriers[i].row];

        if(barr.type == "door") {
            if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 1) ||
                overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 2) ||
                overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 3) ||
                overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 4)) {
                if(barr.isOpen) {

                    var choose = false;
                    if(direction == "left") {
                        if(!overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 3)) {
                            choose = true;
                        }
                    } else if(direction == "right") {
                        if(!overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 4)) {
                            choose = true;
                        }
                    } else if(direction == "up") {
                        if(!overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 1)) {
                            choose = true;
                        }
                    } else if(direction == "down") {
                        if(!overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 2)) {
                            choose = true;
                        }
                    }
                    if(choose) {
                        if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 1)) {
                            direction = "up";
                        }
                        if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 2)) {
                            direction = "down";
                        }
                        if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 3)) {
                            direction = "left";
                        }
                        if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 4)) {
                            direction = "right";
                        }
                    }

                    console.log(direction)
                    if(direction == "down") {
                        console.log(overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 2))
                        if(!overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 1) &&
                            !overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 4) &&
                            !overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 3)) {
                            barr.isOpen = false;
                            barr.color = "white";
                            barr.draw();
                        }
                    }

                    if(direction == "up") {
                        if(!overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 3) &&
                            !overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 4) &&
                            !overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 2)) {
                            barr.isOpen = false;
                            barr.color = "white";
                            barr.draw();
                        }
                    }

                    if(direction == "left") {
                        if(!overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 4) &&
                            !overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 1) &&
                            !overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 2)) {
                            barr.isOpen = false;
                            barr.color = "white";
                            barr.draw();
                        }
                    }

                    if(direction == "right") {
                        if(!overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 3) &&
                            !overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 2) &&
                            !overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 1)) {

                            barr.isOpen = false;
                            barr.color = "white";
                            barr.draw();
                        }
                    }
                } else {
                    barr.isOpen = true;
                    barr.color = "white";
                    barr.draw();
                }
                return;
            }
        }

    }
}


function checkCollisionLeft() {
    for(var i = 0; i < barriers.length; i++) {
        var barr = maze[barriers[i].col][barriers[i].row];

        if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 3)) {
            if(barr.type == "door") {
                if(barr.isOpen) {
                    if(overlapsAnd(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 3)) {
                        return false;
                    }
                }
            }
            if(barr.type == "exit") {
                playerWin = true;
                break;
            }
            return true;
        }
    }
    return false;
}

function checkCollisionUp() {
    for(var i = 0; i < barriers.length; i++) {
        var barr = maze[barriers[i].col][barriers[i].row];

        if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 1)) {
            if(barr.type == "door") {
                if(barr.isOpen) {
                    return false;
                }
            }
            if(barr.type == "exit") {
                playerWin = true;
                break;
            }
            return true;
        }
    }
    return false;
}

function checkCollisionRight() {
    for(var i = 0; i < barriers.length; i++) {
        var barr = maze[barriers[i].col][barriers[i].row];

        if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 4)) {
            if(barr.type == "door") {
                if(barr.isOpen) {
                    return false;
                }
            }
            if(barr.type == "exit") {
                playerWin = true;
                break;
            }
            return true;
        }
    }
    return false;
}

function checkCollisionDown() {
    for(var i = 0; i < barriers.length; i++) {
        var barr = maze[barriers[i].col][barriers[i].row];

        if(overlaps(tilewidth, tileheight, barr.x, barr.y, user.width, user.height, user.x, user.y, 2)) {
            if(barr.type == "door") {
                if(barr.isOpen) {
                    return false;
                }
            }
            if(barr.type == "exit") {
                playerWin = true;
                break;
            }
            return true;
        }
    }
    return false;
}

function overlapsAnd(basedSizeX, basedSizeY, basedX, basedY, testSizeX, testSizeY, testX, testY, type) {
    var bTopLeftX = basedX;
    var bTopLeftY = basedY;
    var bTopRightX = basedX + basedSizeX;
    var bTopRightY = basedY;
    var bDownLeftX = basedX;
    var bDownLeftY = basedY + basedSizeY;
    var bDownRightX = basedX + basedSizeX;
    var bDownRightY = basedY + basedSizeY;

    var tTopLeftX = testX;
    var tTopLeftY = testY;
    var tTopRightX = testX + testSizeX;
    var tTopRightY = testY;
    var tDownLeftX = testX;
    var tDownLeftY = testY + testSizeY;
    var tDownRightX = testX + testSizeX;
    var tDownRightY = testY + testSizeY;

    if(type == 1) { // TOP
        return pointCollision(tTopLeftX, tTopLeftY - 10, bTopLeftX, bTopRightY, bDownRightX, bDownRightY) &&
            pointCollision(tTopRightX, tTopRightY - 10, bTopLeftX, bTopRightY, bDownRightX, bDownRightY);
    } else if(type == 2) { // DOWN
        return pointCollision(tDownLeftX, tDownLeftY + 10, bTopLeftX, bTopRightY, bDownRightX, bDownRightY) &&
            pointCollision(tDownRightX, tDownRightY + 10, bTopLeftX, bTopRightY, bDownRightX, bDownRightY);
    } else if(type == 3) { // LEFT
        var topLeftCollide = tTopLeftX - 5 >= bTopRightX - barrierSpeed && tTopLeftY >= bTopRightY && tTopLeftX - 5 <= bDownRightX && tTopLeftY <= bDownRightY;
        var downLeftCollide = tDownLeftX - 5 >= bTopRightX - barrierSpeed && tDownLeftY >= bTopRightY && tDownLeftX - 5 <= bDownRightX && tDownLeftY <= bDownRightY;
        return topLeftCollide && downLeftCollide;
    } else if(type == 4) { // RIGHT
        var topRightCollide = tTopRightX - 5 >= bTopLeftX - barrierSpeed && tTopRightY >= bTopLeftY && tTopRightX - 10 <= bDownLeftX && tTopRightY <= bDownLeftY;
        var downRightCollide = tDownRightX - 5 >= bTopLeftX - barrierSpeed && tDownRightY >= bTopLeftY && tDownRightX - 10 <= bDownLeftX && tDownRightY <= bDownLeftY;
        return topRightCollide && downRightCollide;
    }
}

function overlaps(basedSizeX, basedSizeY, basedX, basedY, testSizeX, testSizeY, testX, testY, type) {
    var bTopLeftX = basedX;
    var bTopLeftY = basedY;
    var bTopRightX = basedX + basedSizeX;
    var bTopRightY = basedY;
    var bDownLeftX = basedX;
    var bDownLeftY = basedY + basedSizeY;
    var bDownRightX = basedX + basedSizeX;
    var bDownRightY = basedY + basedSizeY;

    var tTopLeftX = testX;
    var tTopLeftY = testY;
    var tTopRightX = testX + testSizeX;
    var tTopRightY = testY;
    var tDownLeftX = testX;
    var tDownLeftY = testY + testSizeY;
    var tDownRightX = testX + testSizeX;
    var tDownRightY = testY + testSizeY;

    if(type == 1) { // TOP
        return pointCollision(tTopLeftX, tTopLeftY - 20, bTopLeftX, bTopRightY, bDownRightX, bDownRightY) ||
            pointCollision(tTopRightX, tTopRightY - 20, bTopLeftX, bTopRightY, bDownRightX, bDownRightY);
    } else if(type == 2) { // DOWN
        return pointCollision(tDownLeftX, tDownLeftY + 20, bTopLeftX, bTopRightY, bDownRightX, bDownRightY) ||
            pointCollision(tDownRightX, tDownRightY + 20, bTopLeftX, bTopRightY, bDownRightX, bDownRightY);
    } else if(type == 3) { // LEFT
        var topLeftCollide = tTopLeftX - 5 >= bTopRightX - barrierSpeed && tTopLeftY >= bTopRightY && tTopLeftX - 5 <= bDownRightX && tTopLeftY <= bDownRightY;
        var downLeftCollide = tDownLeftX - 5 >= bTopRightX - barrierSpeed && tDownLeftY >= bTopRightY && tDownLeftX - 5 <= bDownRightX && tDownLeftY <= bDownRightY;
        return topLeftCollide || downLeftCollide;
    } else if(type == 4) { // RIGHT
        var topRightCollide = tTopRightX - 5 >= bTopLeftX - barrierSpeed * 2 && tTopRightY >= bTopLeftY && tTopRightX - 10 <= bDownLeftX && tTopRightY <= bDownLeftY;
        var downRightCollide = tDownRightX - 5 >= bTopLeftX - barrierSpeed * 2 && tDownRightY >= bTopLeftY && tDownRightX - 10 <= bDownLeftX && tDownRightY <= bDownLeftY;
        return topRightCollide || downRightCollide;
    }
}


//////////////////////////////////////////////////////////////////////////////
//  				Finite State Automaton Application						//
//////////////////////////////////////////////////////////////////////////////


function GhostFSM() {
    this.states = [];

    this.generate = function() {
        for(var i = 0; i < maze.length; i++) {
            var row = []
            var isDoor = false;
            for(var j = 0; j < maze[i].length; j++) {
                isDoor = false;
                if(maze[i][j].type != "floor") {
                    if(maze[i][j].type == "door") {
                        isDoor = true;
                        row.push(new State(i, j, isDoor))
                    } else {
                        row.push(null);
                    }
                } else {
                    row.push(new State(i, j, isDoor))
                }

                if(j > 0) {
                    var leftState = row[j - 1];
                    var rightState = row[j];

                    if(leftState != null && rightState != null) {
                        // 
                        if(isDoor) {
                            rightState.isDoor = true;
                        }

                        var edge = new Edge("l", rightState, leftState);
                        leftState.addInEdge(edge);
                        rightState.addOutEdge(edge);

                        edge = new Edge("r", leftState, rightState);
                        rightState.addInEdge(edge);
                        leftState.addOutEdge(edge);
                    }
                }
                if(i > 0) {
                    var upState = this.states[i - 1][j];
                    var downState = row[j];

                    if(upState != null && downState != null) {
                        if(isDoor) {
                            downState.isDoor = true;
                        }
                        // 
                        var edge = new Edge("u", downState, upState);
                        upState.addInEdge(edge);
                        downState.addOutEdge(edge);

                        edge = new Edge("d", upState, downState);
                        downState.addInEdge(edge);
                        upState.addOutEdge(edge);
                    }
                }
            }
            this.states.push(row);
        }
        this.minimize();
    }

    this.minimize = function() {
        var st = [];
        for(var i = 0; i < this.states.length; i++) {
            for(var j = 0; j < this.states[i].length; j++) {
                if(this.states[i][j] != null) {
                    st.push(this.states[i][j]);
                }
            }
        }
        this.states = st;
    }

    this.size = function() {
        return this.states.length;
    }
    this.display = function() {
        for(var i = 0; i < this.states.length; i++) {
            var state = this.states[i];
            var outEdges = state.getOutEdges();
            var labels = "";
            for(var k = 0; k < outEdges.length; k++) {
                labels += outEdges[k].getLabel() + " (" + JSON.stringify(outEdges[k].getTarget().location()) + "), \n";
            }
        }
    }

    this.getInitialStates = function(num) {
        var indices = [10, 220, 254, 402, 458, 678, 689, 538, 714, 425, 429, 430, 251];

        var states = [];
        for(var j = 0; j < indices.length; j++) {
            states.push(this.states[indices[j]])
        }
        return states;

    }
}


/**
 * The State Class
 * Attributes : 
 * 	- locX = the x-position of the state in the maze map
 *	- locY = the y-position of the state in the maze map
 *	- inEdges = the ingoing edges of the state
 *	- outEdges = the outgoing edges of the state
 */
function State(x, y) {
    this.x = x;
    this.y = y;
    this.inEdges = [];
    this.outEdges = [];
    this.isDoor = false;

    this.addInEdge = function(inEdge) {
        this.inEdges.push(inEdge);
    }

    this.addOutEdge = function(outEdge) {
        this.outEdges.push(outEdge)
    }

    this.getInEdges = function() {
        return this.inEdges;
    }

    this.getOutEdges = function() {
        return this.outEdges;
    }

    // Returns the location of the state in the maze map
    // Returns an object
    this.location = function() {
        coord = {
            "x": this.x,
            "y": this.y
        }
        return coord;
    }
}

/**
 * The Edge Class
 * Attributes:
 *	- label  = the label of the edge to be used to specify the direction 
 *			  of the ghost.
 *			 = possible labels alphabet (r = right, l = left, u = up, d = down)
 *	- source = the source state of the edge ( where it came from )
 *   - target = the target state of the edge ( where it will go to )
 */
function Edge(label, source, target, isDoor) {
    this.label = label;
    this.source = source;
    this.target = target;
    this.door = isDoor;

    this.getSource = function() {
        return this.source;
    }

    this.getTarget = function() {
        return this.target;
    }

    this.getLabel = function() {
        return this.label;
    }
}


window.addEventListener("keydown", function(e) {
    if(e.keyCode == 13 && !startGame || e.keyCode == 13 && endGame) {
        if(endGame) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            playerWin = false;
            playerLose = false;
            user = new Player();
            barriers = [];
            userSpeed = 10;
            barrierSpeed = 20;
            leftCollision = false;
            rightCollision = false;
            topCollision = false;
            bottomCollision = false;
            ghosts = [];
            createWorld();
        }
        startGame = true;
        updateWorld();
    }

    if(startGame && !endGame) {
        if(e.keyCode == 37 && !checkCollisionLeft()) { //left
            if(maze[0][0].x < -10) {
                for(i = 0; i < maze.length; i += 1) {
                    var rows = maze[i];
                    for(j = 0; j < rows.length; j += 1) {
                        rows[j].x += barrierSpeed;
                    }
                }
                if(user.x != window.innerWidth / 2) {
                    user.x -= userSpeed;
                }

            } else {
                user.x -= userSpeed;
            }
            updateWorld();
        }
        if(e.keyCode == 38 && !checkCollisionUp()) { //up
            if(maze[0][0].y < 0) {
                for(i = 0; i < maze.length; i += 1) {
                    var rows = maze[i];
                    for(j = 0; j < rows.length; j += 1) {
                        rows[j].y += barrierSpeed;
                    }
                }
                if(user.y != window.innerHeight / 2) {
                    user.y -= userSpeed;
                }
            } else {
                user.y -= userSpeed;
            }
            updateWorld();
        }
        if(e.keyCode == 39 && !checkCollisionRight()) { //right
            if(maze[0][maze[0].length - 1].x > canvas.width - tilewidth + 10) {
                for(i = 0; i < maze.length; i += 1) {
                    var rows = maze[i];
                    for(j = 0; j < rows.length; j += 1) {
                        rows[j].x -= barrierSpeed;
                    }
                }
                if(user.x != window.innerWidth / 2) {
                    user.x += userSpeed;
                }
            } else {
                user.x += userSpeed;
            }

            updateWorld();

        }
        if(e.keyCode == 40 && !checkCollisionDown()) { //down
            if(maze[maze.length - 1][0].y > canvas.height - tileheight + 15) {
                for(i = 0; i < maze.length; i += 1) {
                    var rows = maze[i];
                    for(j = 0; j < rows.length; j += 1) {
                        rows[j].y -= barrierSpeed;
                    }
                }
                if(user.y != window.innerHeight / 2) {
                    user.y += userSpeed;
                }
            } else {
                user.y += userSpeed;
            }
            updateWorld();
        }

        if(e.keyCode == 32) {
            setDoor();
        }

        for(var i = 0; i < ghosts.length; i++) {
            ghosts[i].check();
        }

    }

}, false);

setInterval(updateSprites, 200);

//for sprites animation
function updateSprites() {
    ghosti += 1;
    pi += 1;
    if(ghosti >= 4) {
        ghosti = 0;
        pi = 0;
    }
    if(startGame) {
        updateWorld();
    }
}