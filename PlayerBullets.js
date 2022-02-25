/*BEGIN PLAYER BULLET AREA*/
var playerWeapon = 'laser';//StartingWeapon
var playerbulletsArray = [];//holds all the playerBullets
var shootTimer = 100;
var shootTimerResetti = 20;
	/*WEAPONS POSSIBLE
		gatling - many bullets, maybe a little bit of spread
			shoot many but with less accuracy
		spread - shotgun style wide fan
			shoot a bunch at once
		plasma - super fast straight forward
			faster shots, more accurate
		rocket - flies straight forward then makes an area of damage
			explode bullets
		flames - close range fire attack. bullets have lifespan
			bullet lifetime, bigger
        laser - straight line, doesn't move
		OPTIONS/Followers
		    mini-gun - lots of weak bullets
		    shotgun - side shooting spread 
		    mini-rocket - straight forward strong
		    fan-plasma - shoots at moving fan angles, periodic pulse
		    flamethrower - circle of periodic damage
	*/
    const bulletImageGatling = document.getElementById('bulletGatling');
    const bulletImageSpread = document.getElementById('bulletSpread');
    const bulletImagePlasma = document.getElementById('bulletPlasma');
    const bulletImageRocket = document.getElementById('bulletRocket');
    const bulletImageFlames = document.getElementById('bulletFlames');
    const bulletImageLaser = document.getElementById('bulletLaser');
    const bulletImageBombLaser = document.getElementById('bombLaser');

    let playerBullet = {
        posX : 0,
        posY : 0,
        speedX:0,
        speedY:0,
        direction : 0//0 is straight up, so is 360
    }
    let gatlingBullet = Object.assign({
        height : 40,
        width : 40,
        hp : 1,
        damage : 1,
        speed: 10,
        lifespan : 60,
        image : bulletImageGatling
    }, playerBullet);
    let spreadBullet = Object.assign({
        height : 40,
        width : 40,
        hp : 2,
        damage : 2,
        speed: 10,
        lifespan : 70,
        image : bulletImageSpread
    }, playerBullet);
    let plasmaBullet = Object.assign({
        height : 80,
        width : 60,
        hp : 4,
        damage : 4,
        speed : 28,
        lifespan : 100,
        image : bulletImagePlasma
    }, playerBullet);
    let rocketBullet = Object.assign({
        height : 75,
        width : 150,
        hp : 1,
        damage : 10,
        speed: 8,
        lifespan : 40,
        image : bulletImageRocket
    }, playerBullet);
    let flameBullet = Object.assign({
        height : 100,
        width : 300,
        hp : 255,
        damage : 1,
        speed: 8,
        lifespan : 20,
        image : bulletImageFlames
    }, playerBullet);
    let laserBullet = Object.assign({
        height : 800,
        width : 150,
        hp : 255,
        damage : 0.1,
        speed: 0,
        lifespan : 60,
        image : bulletImageLaser,
        //Section for sprite sheet
        sheetWidth : 512,//size of individual frame
        sheetHeight : 682.6,
        sheetFrameTotal : 12,//total number of frames
        currentSheetFrame : 0,//var for which frame is displayed
        frameCountDelay : 0//delay between changing frames
    }, playerBullet);

    let bombLaserBullet = Object.assign({
        height : 831,
        width : 208,
        hp : 255,
        damage : 1,
        speed: 0,
        lifespan : 93,
        image : bulletImageBombLaser,
        //Section for sprite sheet
        sheetWidth : 208,//size of individual frame
        sheetHeight : 831,
        sheetFrameTotal : 31,//total number of frames start at 0
        currentSheetFrame : 0,//var for which frame is displayed
        frameCountDelay : 0//delay between changing frames
    }, playerBullet);

function shootPlayerBullets(){
    //check what the player's weapon is
    //then fire the specific bullets
    if (playerShip.activatingBomb === 2) {
        //MAKE BOMB LASER!!!!!!
        if (shootTimer == 0) {
            let babyBullet = Object.create(bombLaserBullet);
            //Plasma Shoots straight
            babyBullet.direction = 0;
            //laser stays in place
            babyBullet.speedX = 0
            babyBullet.speedY = babyBullet.speed*Math.cos(babyBullet.direction)
            //align bullet to start at mouse
            babyBullet.posX=mouseX;
            babyBullet.posY=mouseY;

            playerbulletsArray.push(babyBullet);
            shootTimer = babyBullet.sheetFrameTotal*3;//RESET Shoot timer
        } else {shootTimer--;}
    } else if (playerShip.activatingBomb != 1) {
    switch (playerWeapon) {
        case 'gatling':
            if (shootTimer == 0) {
                let babyBullet = Object.create(gatlingBullet);
                //slight inaccuracy for gatling 
                babyBullet.direction = getRandomInt(-10,11)* Math.PI / 180;
                //convert the speed and direction of the bullet to X and Y speeds
                babyBullet.speedX = babyBullet.speed*Math.sin(babyBullet.direction)
                babyBullet.speedY = babyBullet.speed*Math.cos(babyBullet.direction)
                //align bullet to start at mouse
                babyBullet.posX=mouseX;
                babyBullet.posY=mouseY;
                 //let newimage = rotateAndCache(babyBullet);
                //babyBullet.image = newimage;

                playerbulletsArray.push(babyBullet);
                shootTimer = 3;//RESET Shoot timer
            } else {shootTimer--;}
        break;
        case 'spread':
            if (shootTimer == 0) {
                let spreadVar = 0;
                for (let i = 5; i >0; i--) {
                    let babyBullet = Object.create(spreadBullet);

                    babyBullet.direction = (12-spreadVar)* Math.PI / 180;
                    spreadVar += 6;
                    //convert the speed and direction of the bullet to X and Y speeds
                    babyBullet.speedX = babyBullet.speed*Math.sin(babyBullet.direction)
                    babyBullet.speedY = babyBullet.speed*Math.cos(babyBullet.direction)
                    //align bullet to start at mouse
                    babyBullet.posX=mouseX;
                    babyBullet.posY=mouseY;

                    playerbulletsArray.push(babyBullet);
                }
                shootTimer = 50;//RESET Shoot timer
            } else {shootTimer--;}
        break;
        case 'plasma':
            if (shootTimer == 0) {
                let babyBullet = Object.create(plasmaBullet);
                //Plasma Shoots straight
                babyBullet.direction = 0;
                //convert the speed and direction of the bullet to X and Y speeds
                babyBullet.speedX = babyBullet.speed*Math.sin(babyBullet.direction)
                babyBullet.speedY = babyBullet.speed*Math.cos(babyBullet.direction)
                //align bullet to start at mouse
                babyBullet.posX=mouseX;
                babyBullet.posY=mouseY;

                playerbulletsArray.push(babyBullet);
                shootTimer = 12;//RESET Shoot timer
            } else {shootTimer--;}
        break;
        case 'rocket':
            
        break;
        case 'flames':
            
        break;
        case 'laser':
            if (shootTimer == 0) {
                let babyBullet = Object.create(laserBullet);
                //Plasma Shoots straight
                babyBullet.direction = 0;
                //laser stays in place
                babyBullet.speedX = 0
                babyBullet.speedY = babyBullet.speed*Math.cos(babyBullet.direction)
                //align bullet to start at mouse
                babyBullet.posX=mouseX;
                babyBullet.posY=mouseY;

                playerbulletsArray.push(babyBullet);
                shootTimer = babyBullet.lifespan*2;//RESET Shoot timer
            } else {shootTimer--;}
        break;
        }
    }
    //console.log("spawned a gun bullet for the player");
}

function movePlayerBullets(){
    playerbulletsArray.forEach((bullet) => {
        if (bullet.image == bulletImageLaser || bullet.image === bulletImageBombLaser) {
            bullet.posY = mouseY;
            bullet.posX = mouseX;
        } else {
            bullet.posY -= bullet.speedY;
            bullet.posX -= bullet.speedX;
        }
        //check and erase bullet if off any of 4 sides
        if (bullet.posY > canvas.height+5 || bullet.posY < -5){
            bullet.lifespan = 0;
            //console.log ("erased a gun  offscreen");
        }
        //Reduce bullet lifespan so it goes away
        bullet.lifespan--;
        playerBulletCollision(bullet);
    });
}

function drawPlayerBullets(){
    //console.log("gun move"); success
    playerbulletsArray.forEach((bullet) => {
            //ROTATE BULLET THEN DRAW IT
            //you gotta save the canvas, rotate the whole damn thing, draw the bullet, then restore the original rotation, sheesh
            ctx.save();
            ctx.translate(bullet.posX, bullet.posY);
            ctx.rotate(-bullet.direction);
            if (bullet.image == bulletImageLaser) {
                sheetStep(bullet);
            } else if (bullet.image === bulletImageBombLaser) {
                sheetStepBombLaser(bullet);
            } else {
                ctx.drawImage(bullet.image, -(bullet.width/2), -(bullet.height/2), bullet.width, bullet.height);
            }
            ctx.restore();
            //check if bullet should be dead, otherwise decrease if lifetime
    });
}

//erase bullets that have 0 lifespan at the end of the game tick
function erasePlayerBullets(){
    playerbulletsArray.forEach((bullet) => {
        if (bullet.lifespan < 1) {
        playerbulletsArray.splice(playerbulletsArray.indexOf(bullet), 1);
        }
    });
}

function playerBulletCollision(bullet) {
    enemyArray.forEach((enemy) => {
        if(bullet.image == bulletImageLaser) {
            if (bullet.posX < enemy.posX+(enemy.size)/2 && bullet.posX > enemy.posX-(enemy.size)/2) {
                enemy.takeDamage(enemy,bullet.damage);
                
                myScore++;
                updateScore();
            }
        } else{
        var a = bullet.posX - enemy.posX;
        var b = bullet.posY - enemy.posY;
        if (Math.sqrt((a*a)+(b*b)) < (enemy.size)/2) {
            //collision has occured
            
            //bullet takes damage, gets removed if it is out of damage
            //bullet only deals the damage the enemy needs
            bullet.hp -= Math.min(bullet.damage,enemy.hp);
            if (bullet.hp <1) {bullet.lifespan = 0;}
            
            enemy.takeDamage(enemy,bullet.damage);
            myScore++;
            updateScore();
            //console.log("erased a gun for collision");
        }
        }
    });
}

//SpriteSheet drawer
function drawBulletSheet(bullet) {
    let xFrame = 0;
    switch (bullet.currentSheetFrame) {
        case 0: case 4: case 8: case 12:
            xFrame = 0; 
        break;
        case 1: case 5: case 9:
            xFrame = 1;
        break;
        case 2: case 6: case 10:
            xFrame = 2;
        break;
        case 3: case 7: case 11:
            xFrame = 3;
        break;
    }
    let yFrame = 0;
    switch (bullet.currentSheetFrame) {
        case 0: case 1: case 2: case 3:
            yFrame = 0; 
        break;
        case 4: case 5: case 6: case 7:
            yFrame = 1;
        break;
        case 8: case 9: case 10: case 11:
            yFrame = 2;
        break;
    }

    ctx.drawImage(bullet.image,
        xFrame * bullet.sheetWidth,//Sheet X position
        yFrame * bullet.sheetHeight,//sheet Y position
        bullet.sheetWidth, bullet.sheetHeight,//Sheet size of frame
        -(bullet.width/2), -(bullet.height),//canvas position
        bullet.width, bullet.height);//render size of bullet
}

function sheetStep(bullet) {
    drawBulletSheet(bullet);
  
    bullet.frameCountDelay++;
    if (bullet.frameCountDelay >= 2) {
        bullet.frameCountDelay = 0;
        //advance this things frame for next draw
        bullet.currentSheetFrame++;
        
        //if we moved past the last frame count, reset it
        if (bullet.currentSheetFrame > bullet.sheetFrameTotal) {
            bullet.currentSheetFrame = 0;
        }
    }
}

function sheetStepBombLaser(bullet) {
    drawBombLaserSheet(bullet);
  
    bullet.frameCountDelay++;
    if (bullet.frameCountDelay >= 3) {
        bullet.frameCountDelay = 0;
        //advance this things frame for next draw
        bullet.currentSheetFrame++;
        
        //if we moved past the last frame count, reset it
        if (bullet.currentSheetFrame > bullet.sheetFrameTotal) {
            bullet.currentSheetFrame = 0;
        }
    }
}
function drawBombLaserSheet(bullet) {
    let xFrame = bullet.currentSheetFrame;
    console.log(bullet.currentSheetFrame);
    
    ctx.drawImage(bullet.image,
        xFrame * bullet.sheetWidth,//Sheet X position
        0 * bullet.sheetHeight,//sheet Y position
        bullet.sheetWidth, bullet.sheetHeight,//Sheet size of frame
        -(bullet.width*1.75)/2, -(bullet.height)-95,//+75,//canvas position
        bullet.width*1.75, bullet.height*1.25);//render size of bullet
}