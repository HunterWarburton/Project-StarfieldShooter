var starNum = 1;
let starField = [];
let starfieldArray = [starField, starField, starField, starField];
var spawnTimer0 = 0;
var spawnTimer1 = 0;
var spawnTimer2 = 0;
var spawnTimer3 = 0;
var myScore = 0;

var baddieTimer = 100;//timer for when to start spawning enemies
var patternTimer = 100;//timer used for the actual spawning patterns
var currentlySpawning = false;//flag for if the spawning is happening
//flag for which spawn pattern to do
var spawnPattern = 'SeekerMass';

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Set fullscreenish for the window
ctx.canvas.width  = window.innerWidth*0.75;
ctx.canvas.height = window.innerHeight*0.75;

//Make background
ctx.canvas.style.background = "#252555";
//Make a Black border
ctx.globalCompositeOperation = 'destination-over'
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
//canvas{ border: 1px solid black; }

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var mouseX = 0;
var mouseY = 0;



/*define a STAR object*/
const star = {
    speed : 1,
    size : 5,
    posX : 0,
    posY : 0,
    color : '#000000'
};

/*
Parallax starfield
three fields of stars that scroll
from the top of the screen to the bottom
further back fields are smaller stars and move slower
when stars reach bottom of screen they dissappear
*/

function drawStar(starDis) {
    var X = starDis.posX;
    var Y = starDis.posY;
    var R = starDis.size; /*size*/
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.fillStyle = starDis.color; /*color*/
    ctx.fill();
}



/*Spawn stars on top of screen*/
function spawnStars (field) {
    let babyStar = Object.create(star);
    babyStar.posX = Math.floor(Math.random()*canvas.width);/*random spot width*/
    babyStar.posY = Math.floor(Math.random()*(-canvas.height/4));/*slightly above height display*/
    
    //set star size
    //HOW FAST DO THEY MOVE
    switch (field) {
        case 0:
            babyStar.speed = 3;
            babyStar.size = 3;
            babyStar.color = '#a0a0ff';
            break;
        case 1:
            babyStar.speed = 1.5;
            babyStar.size = 2.25;
            babyStar.color = '#50aaff';
            break;
        case 2:
            babyStar.speed = 0.5;
            babyStar.size = 1;
            babyStar.color = '#00aaff';
            break;
        case 3:
            babyStar.speed = 0.25;
            babyStar.size = 0.5;
            babyStar.color = '#00aaaa';
            break;
    } 
    starfieldArray[field].push(babyStar);/*put the star in the starfield array*/
}

/*move the stars down*/
function moveStar(muhStarField){
    muhStarField.forEach((star) => {
        star.posY +=  star.speed;
        //check and erase a star if its too low
        if (star.posY > canvas.height+5) {
            muhStarField.splice(muhStarField.indexOf(star), 1);
            //console.log ("erased a star");
        }
    });
}

/*OnGameLoad*/


/*MAIN GAME TICK*/
function gameTick () {
    //Clear Drawings of old stuff
    ctx.clearRect(2.5, 2.5, canvas.width-5, canvas.height-5);

        /*MOVEMENT OF THINGS*/
    //Move the stars positions
    starfieldArray.forEach(starField => {
        moveStar(starField);
    });
    
    moveBaddies();
    moveBullets();
    movePlayerBullets();
    movePowerup();

/*DRAW THINGS*/
    drawWeaponUI ()
    drawPowerup();
    drawBullet();
    drawPlayerShip();
    drawPlayerBullets();
    drawBaddies();

    //Draw the Stars
    starfieldArray.forEach((starField) => {
        starField.forEach((star) => {
            drawStar(star);
        });
    });
    
//Only spawn baddie sometimes not every frame
//Every 10 seconds do a new spawn pattern
//when timer reaches 0, flag a random pattern to begin spawning
//when that pattern finishes its own timer, then reset the timer countdown
if (!currentlySpawning) {
    baddieTimer--;
} else {
    dotheSpawning();
}
if (baddieTimer == 0) {
    //flag a random pattern to begin
    //**TODO make this random */
    switch (getRandomInt(1,6)) {
        case 1 :
            spawnPattern = 'SeekerMass';
            patternTimer = 600;
        break;
        case 2 :
            spawnPattern = 'TankRun';
            patternTimer = 600;
        break;
        case 3 :
            spawnPattern = 'BouncerSpawn';
            patternTimer = 600;
        break;
        case 4 :
            spawnPattern = 'InvaderSpawn';
            patternTimer = 600;
        break;
        case 5 :
            spawnPattern = 'BossSpawn';
            patternTimer = 6000;
        break;
    }

    currentlySpawning = true;
    baddieTimer = 300;//reset timer
}


        //Spawn powerup
        if (getRandomInt(0,100) == 0) {
            spawnPowerup();
        }

        //Shoot the Player Bullets
        shootPlayerBullets();


    /*spawn a new star sometimes*/
    //HOW MANY TO SPAWN
    if (spawnTimer0 > 6) {
        spawnStars(0);
        spawnTimer0 = 0;
    } else {spawnTimer0++;}

    if (spawnTimer1 > 5) {
        spawnStars(1);
        spawnTimer1 = 0;
    } else {spawnTimer1++;}

    if (spawnTimer2 > 7) {
        spawnStars(2);
        spawnTimer2 = 0;
    } else {spawnTimer2++;}

    if (spawnTimer3 > 5) {
        spawnStars(3);
        spawnTimer3 = 0;
    } else {spawnTimer3++;}


    //must erase things at the end of game tick
    erasePlayerBullets();
}
setInterval(gameTick, 30);

/*ENEMY SPAWN*/
//spawnpattern: mass of seekers
//spawn a seeker every few frames for a while
    function dotheSpawning (){
        //console.log(patternTimer);
        switch (spawnPattern) {
        case 'SeekerMass' : //just spawn a bunch
            if (Number.isInteger(patternTimer/5)) {
                spawnEnemy('seeker');
            }
        break;
        case 'TankRun' :
            //Spawn sets of 3 tanks
            if (patternTimer == 600 || patternTimer == 400 || patternTimer == 200 || patternTimer == 10) {
                for (let i = 3; i >0; i--) {
                    spawnEnemy('tank');
                }
            }
        break;
        case 'BouncerSpawn' ://spawn bouncers in sets of two
            if (Number.isInteger(patternTimer/50)) {
                spawnEnemy('bouncer');
                spawnEnemy('bouncer');
            }
        break;
        case 'InvaderSpawn' :
            if (Number.isInteger(patternTimer/50)) {
                spawnEnemy('invader');
            }
        break;
        case 'BossSpawn' :
            if (patternTimer == 6000) {
                spawnEnemy('boss');
            }
        break;
        }
        //check if done spawning
        if (patternTimer == 0) {
            currentlySpawning = false;
        } else {
            patternTimer--;
        }
    }

//Get X and Y of mouse Pos
canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    mouseX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
    mouseY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
});


/*COLLISION SECTION*/
function bulletCollision(bullet) {
if (bullet.posX > mouseX-10 && bullet.posX < mouseX+10
    && bullet.posY > mouseY-10 && bullet.posY < mouseY+10) {
        //collision has occured - Enemy bullet hit player
        baddieBulletArray.splice(baddieBulletArray.indexOf(bullet), 1);//erase that bullet
        myScore--;
        updateScore();
    }

}


function powerupCollision(powerup) {
    if (powerup.posX > mouseX-10 && powerup.posX < mouseX+10
        && powerup.posY > mouseY-10 && powerup.posY < mouseY+10) {
            //collision has occured
            powerupArray.splice(powerupArray.indexOf(powerup), 1);//erase that powerup
            myScore++;
            updateScore();
            changePlayerWeapon();
        }
    
    }

function changePlayerWeapon(){
    switch (getRandomInt(0,5)) {
        case 1:
            playerWeapon = 'gatling';
        break;
        case 2:
            playerWeapon = 'spread';
        break;
        case 3:
            playerWeapon = 'plasma';
        break;
        case 4:
            playerWeapon = 'laser';
        break;
        case 5:
            playerWeapon = 'rocket';
        break;
        case 1:
            playerWeapon = 'flames';
        break;
    }
    uiPlayerWeapon()
}


//BADDIES
let enemyArray = [];
/*define an enemy object*/
/*Enemy movement Types:
seeker - original red that moves in front of you
tank - just falls down but shoots at ya
bouncer - moves back and forth, left to right
invader - picks a cardinal direction and moves that way for a time, random
boss - falls to a certain Y, then stays there
*/
const seekerEnemy = document.getElementById('seekerEnemy');
const tankEnemy = document.getElementById('tankEnemy');
const bouncerEnemy = document.getElementById('bouncerEnemy');
const invaderEnemy = document.getElementById('invaderEnemy');
const bossEnemy = document.getElementById('bossEnemy');

const enemy = {
    speedSideways : 0.5,
    speedDownwards : 2,
    size : 5,
    posX : 0,
    posY : 0,
    color : '#000000',
    hp : 1,
    image : seekerEnemy,
    movementType: 'string',
    baddieVar : 0,//a spare space for the baddie info
    takeDamage : function (thisEnemy, damage){
        thisEnemy.hp -= damage;
        if (thisEnemy.hp <1) {
            if (thisEnemy.movementType == 'boss') {
                patternTimer = 0;
            }
            enemyArray.splice(enemyArray.indexOf(thisEnemy), 1);
        }
    }
};

function spawnEnemy (typeofEnemytoSpawn) {
    let babyEnemy = Object.create(enemy);
    babyEnemy.posX = Math.floor(Math.random()*canvas.width);/*random spot width*/
    babyEnemy.posY = Math.floor(Math.random()*(-canvas.height/4));/*slightly above height display*/
    //This Enemy Stats
switch (typeofEnemytoSpawn) {
    case 'seeker':
        babyEnemy.speedSideways = Math.random()*5+1;
        babyEnemy.speedDownwards = Math.random()*5+1;
        babyEnemy.size = 30;
        babyEnemy.color = '#ff0050';
        babyEnemy.hp = 1;
        babyEnemy.movementType = typeofEnemytoSpawn;
        babyEnemy.image = seekerEnemy;
    break;
    case 'tank':
        babyEnemy.speedSideways = 0;
        babyEnemy.speedDownwards = 2;
        babyEnemy.size = 100;
        babyEnemy.color = '#aa2020';
        babyEnemy.hp = 10;
        babyEnemy.movementType = typeofEnemytoSpawn;
        babyEnemy.image = tankEnemy;
    break;
    case 'bouncer':
        babyEnemy.speedSideways = getRandomInt(1,8)/5+3;;
        babyEnemy.speedDownwards = getRandomInt(2,4);;
        babyEnemy.size = 80;
        babyEnemy.color = '#ff9090';
        babyEnemy.hp = getRandomInt(3,8);;
        babyEnemy.movementType = typeofEnemytoSpawn;
        babyEnemy.image = bouncerEnemy;
    break;
    case 'invader':
        babyEnemy.speedSideways = 6;
        babyEnemy.speedDownwards = 6;
        babyEnemy.size = 50;
        babyEnemy.color = '#ff20aa';
        babyEnemy.hp = 5;
        babyEnemy.movementType = typeofEnemytoSpawn;
        babyEnemy.image = invaderEnemy;
    break;
    case 'boss':
        babyEnemy.speedSideways = 0;
        babyEnemy.speedDownwards = 2;
        babyEnemy.size = 300;
        babyEnemy.color = '#FFaa20';
        babyEnemy.hp = 100;
        babyEnemy.movementType = typeofEnemytoSpawn;
        babyEnemy.image = bossEnemy;
        babyEnemy.posX = canvas.width/2;
    break;

}

    enemyArray.push(babyEnemy);
}

//Enemy drawing section
function drawBaddies(){
        enemyArray.forEach((enemy) => {
            ctx.drawImage(enemy.image, enemy.posX-enemy.size/2, enemy.posY-enemy.size/2, enemy.size, enemy.size);
        });
}

function moveBaddies(){
    //scroll through every enemy and make it move
    enemyArray.forEach((enemy) => {
        //Enemies should spawn bullets sometimes

        //shoot area
        //each enemy shoots if random number
        var shootie = getRandomInt(0,101);
        if (shootie == 100) {
            spawnBullet(enemy);
        } 

        //Actual enemy movement
        switch (enemy.movementType) {
            case 'seeker':
                if (enemy.posX > mouseX+12){
                    enemy.posX -= enemy.speedSideways;
                } else if (enemy.posX < mouseX-12) {
                    enemy.posX += enemy.speedSideways;
                }
            break;
            case 'tank':
                //nothing special, they just fall down
            break;
            case 'bouncer':
                if (enemy.posX > canvas.width-enemy.size){//bouncer got to the right of the screen
                    enemy.baddieVar = 1;
                } else if (enemy.posX < enemy.size) {
                    enemy.baddieVar = 0;
                }
                if (enemy.baddieVar == 1) {//go left now
                    enemy.posX -= enemy.speedSideways;
                } else {
                enemy.posX += enemy.speedSideways;
                }
            break;
            case 'invader'://pick a random direction, go that way
            if (enemy.baddieVar == 0) {//Pick a direction at timer 0, then reset its timer
                switch (getRandomInt(1,9)) {
                    case 1 ://northwest
                        enemy.speedSideways = -3;
                        enemy.speedDownwards = -1;
                    break;
                    case 2 ://north
                        enemy.speedSideways = 0;
                        enemy.speedDownwards = -2;
                    break;
                    case 3 ://northeast
                        enemy.speedSideways = 3;
                        enemy.speedDownwards = -1;
                    break;
                    case 4 ://west
                        enemy.speedSideways = -4;
                        enemy.speedDownwards = 2;
                    break;
                    case 5 ://east
                        enemy.speedSideways = 4;
                        enemy.speedDownwards = 2;
                    break;
                    case 6 ://southwest
                        enemy.speedSideways = -3;
                        enemy.speedDownwards = 4;
                    break;
                    case 7 ://south
                        enemy.speedSideways = 0;
                        enemy.speedDownwards = 5;
                    break;
                    case 8 ://southeast
                        enemy.speedSideways = 3;
                        enemy.speedDownwards = 4;
                    break;
                }

                enemy.baddieVar = 100;
            } else {
                //These guys need help not going off screen
                if (enemy.posX > canvas.width-(enemy.size/2)){//bouncer got to the right of the screen
                    enemy.speedSideways = -3;
                } else if (enemy.posX < enemy.size/2) {
                    enemy.speedSideways = 3;
                }
                if (enemy.posY < enemy.size) {
                    enemy.speedDownwards = 5;
                }
                enemy.posX +=  enemy.speedSideways;
                enemy.baddieVar--;
            }
        
            break;
            case 'boss'://boss must stop moving downward and only be destroyed by player
                if (enemy.posY > canvas.height/3) {
                    enemy.speedDownwards = 0;
                }
            break;
        }
        enemy.posY +=  enemy.speedDownwards;

        //check and erase an enemy if its too low
        if (enemy.posY > canvas.height+5) {
            enemyArray.splice(enemyArray.indexOf(enemy), 1);
            //console.log ("erased an enemy from too low");
        }

    });

}


//RANDOM FUNCTION SPOT
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
const score = document.getElementById("score");
function updateScore() {
    score.textContent = 'Score: ' + myScore;
}




/*BADDIE BULLET ZONE*/
let bullet = {
    posX : 0,
    posY : 0,
    speedX : 0,
    speedY : 0
}
var baddieBulletArray = [];

//gotta define a vector now, sheesh
let Vector = {
     x:0,
    y:0
    } 

function spawnBullet(enemy){
    let babyBullet = Object.create(bullet);//Make a brand new bullet
    babyBullet.posX=enemy.posX;
    babyBullet.posY=enemy.posY;
//get a vector from the bullet to the playerShip
var bulletVector = Vector;
    bulletVector.X = mouseX-babyBullet.posX;
    bulletVector.Y = mouseY-babyBullet.posY;
//normalize it

var length = Math.sqrt(bulletVector.X*bulletVector.X+bulletVector.Y*bulletVector.Y); //calculating length
bulletVector.X = bulletVector.X/length; //assigning new value to x (dividing x by length of the vector)
bulletVector.Y = bulletVector.Y/length; //assigning new value to y

babyBullet.speedX = bulletVector.X*10;
babyBullet.speedY = bulletVector.Y*10;

    baddieBulletArray.push(babyBullet);
}

function moveBullets(){
    baddieBulletArray.forEach((bullet) => {
        bullet.posX += bullet.speedX;
        bullet.posY += bullet.speedY;
        //check and erase bullet if off any of 4 sides
        if (bullet.posY > canvas.height+5 || bullet.posY < -5 || bullet.posX > canvas.width+5 || bullet.posX < -5) {
            baddieBulletArray.splice(baddieBulletArray.indexOf(bullet), 1);
            //console.log ("erased a bullet offscreen");
        }
        bulletCollision(bullet);
    });
}

function drawBullet(){
    baddieBulletArray.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.posX, bullet.posY, 4, 0, 2 * Math.PI, false);
        ctx.lineWidth = 4;
        ctx.fillStyle = '#ffff00'; /*color*/
        ctx.fill();
    });
}



//POWERUP SECTION
//Make a powerup that reduces gun cooldown
let powerupArray = [];
/*define an powerup object*/
const powerup = {
    speed : 2,
    posX : 0,
    posY : 0,
};

function spawnPowerup () {
    let babyPowerup = Object.create(powerup);
    babyPowerup.posX = Math.floor(Math.random()*canvas.width);/*random spot width*/
    babyPowerup.posY = Math.floor(Math.random()*(-canvas.height/4));/*slightly above height display*/
    
    powerupArray.push(babyPowerup);
}

function drawPowerup(){
    powerupArray.forEach((powerup) => {
        ctx.beginPath();
        ctx.arc(powerup.posX, powerup.posY, 8, 0, 2 * Math.PI, false);
        //ctx.lineWidth = 4;
        ctx.fillStyle = '#bbbbff'; /*color*/
        ctx.fill();
        ctx.beginPath();
        ctx.arc(powerup.posX, powerup.posY, 8, 0, 2 * Math.PI, false);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#ffffff'; /*color*/
        ctx.stroke();
    });
}

function movePowerup(){
    powerupArray.forEach((powerup) => {
        powerup.posY += powerup.speed;
        //check and erase bullet if off any of 4 sides
        if (powerup.posY > canvas.height+5 || powerup.posY < -canvas.height/4){
            powerupArray.splice(powerupArray.indexOf(powerup), 1);
            //console.log ("erased a powerup offscreen");
        }
        powerupCollision(powerup);
    });
}