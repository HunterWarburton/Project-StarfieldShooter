const playerShipImage = document.getElementById('playerShip');

var playerShip = {
    height : 80,
    width : 80,
    image : playerShipImage,
    activatingBomb : 0,
    //Section for sprite sheet
    sheetWidth : 139,//size of individual frame
    sheetHeight : 116,
    sheetFrameTotal : 61,//total number of frames (start at 0)
    currentSheetFrame : 0,//var for which frame is displayed
    frameCountDelay : 0//delay between changing frames
};

//On Keypress of SPACEBAR, set the ship to transform
$(window).keypress(function (e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      // ' ' is standard, 'Spacebar' was used by IE9 and Firefox < 37
      e.preventDefault()
      console.log('Space pressed')
      if (playerShip.activatingBomb!=1){
        playerShip.activatingBomb = 1;
      }
    }
  })


function drawPlayerShip() {
    switch (playerShip.activatingBomb) {
        case 0:
            ctx.drawImage(playerShip.image,
                0 * playerShip.sheetWidth,//Sheet X position
                0 * playerShip.sheetHeight,//sheet Y position
                playerShip.sheetWidth, playerShip.sheetHeight,//Sheet size of frame
                mouseX-(playerShip.width/2), mouseY-(playerShip.height/2),//canvas position
                playerShip.width, playerShip.height);//render size of bullet
        break;
        case 1: 
            sheetStepPlayerShip(playerShip);
        break;
        case 2:
            ctx.drawImage(playerShip.image,
                12 * playerShip.sheetWidth,//Sheet X position
                3 * playerShip.sheetHeight,//sheet Y position
                playerShip.sheetWidth, playerShip.sheetHeight,//Sheet size of frame
                mouseX-(playerShip.width/2), mouseY-(playerShip.height/2),//canvas position
                playerShip.width, playerShip.height);//render size of bullet
        break;
    }
}

function drawplayerShipSheet() {
    let xFrame = 0;
    let x = playerShip.currentSheetFrame;
    switch (true) {
        /*I SUCK AT MATHS WHY AM I SO DUMB*/
        case (x == 0 || x == 16||x ==32||x ==48):
            xFrame = 0; 
        break;
        case (x == 1 || x == 17||x ==33||x ==49):
            xFrame = 1; 
        break;
        case (x == 2 || x == 18||x ==34||x ==50):
            xFrame = 2; 
        break;
        case (x == 3 || x == 19||x ==35||x ==51):
            xFrame = 3; 
        break;
        case (x == 4 || x == 20||x ==36||x ==52):
            xFrame = 4; 
        break;
        case (x == 5 || x == 21||x ==37||x ==53):
            xFrame = 5; 
        break;
        case (x == 6 || x == 22||x ==38||x ==54):
            xFrame = 6; 
        break;
        case (x == 7 || x == 23||x ==39||x ==55):
            xFrame = 7; 
        break;
        case (x == 8 || x == 24||x ==40||x ==56):
            xFrame = 8; 
        break;
        case (x == 9 || x == 25||x ==41||x ==57):
            xFrame = 9; 
        break;
        case (x == 10 || x == 26||x ==42||x ==58):
            xFrame = 10; 
        break;
        case (x == 11 || x == 27||x ==43||x ==59):
            xFrame = 11; 
        break;
        case (x == 12 || x == 28||x ==44||x ==60):
            xFrame = 12; 
        break;
        case (x == 13 || x == 29||x ==45||x ==61):
            xFrame = 13; 
        break;
        case (x == 14 || x == 30||x ==46):
            xFrame = 14; 
        break;
        case (x == 15 || x == 31||x ==47):
            xFrame = 15; 
        break;
    }
    let yFrame = 0;
    switch (true) {
        case (x < 16) :
            yFrame = 0; 
        break;
        case (x < 32) :
            yFrame = 1;
        break;
        case (x < 48) :
            yFrame = 2;
        break;
        case (x < 64) :
            yFrame = 3;
        break;
    }

    ctx.drawImage(playerShip.image,
        xFrame * playerShip.sheetWidth,//Sheet X position
        yFrame * playerShip.sheetHeight,//sheet Y position
        playerShip.sheetWidth, playerShip.sheetHeight,//Sheet size of frame
        mouseX-(playerShip.width/2), mouseY-(playerShip.height/2),//canvas position
        playerShip.width, playerShip.height);//render size of bullet
}

function sheetStepPlayerShip(bullet) {
    drawplayerShipSheet(bullet);
   
    bullet.frameCountDelay++;
    if (bullet.frameCountDelay >= 1) {
        bullet.frameCountDelay = 0;
        if (!playerShip.reverseTransform) {
            //advance this things frame for next draw
            bullet.currentSheetFrame++;
    
            //if we moved past the last frame count, reset it
            if (bullet.currentSheetFrame == bullet.sheetFrameTotal) {
                playerShip.activatingBomb = 2;
                playerShip.reverseTransform = true;
            }
        } else {
            bullet.currentSheetFrame--;
    
            //if we moved past the last frame count, reset it
            if (bullet.currentSheetFrame == 0) {
                playerShip.activatingBomb = 0;
                playerShip.reverseTransform = false;
            }
        }
    }
}