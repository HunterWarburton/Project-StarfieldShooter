const iconGatling = document.getElementById('iconGatling');
const iconSpread = document.getElementById('iconSpread');
const iconPlasma = document.getElementById('iconPlasma');
const iconRocket = document.getElementById('iconRocket');
const iconFlames = document.getElementById('iconFlames');
const iconLaser = document.getElementById('iconLaser');

var weapon1ToDraw = iconGatling;

function uiPlayerWeapon(){
    switch (playerWeapon) {
        case 'gatling':
            weapon1ToDraw = iconGatling;
        break;
        case 'spread':
            weapon1ToDraw = iconSpread;
        break;
        case 'plasma':
            weapon1ToDraw = iconPlasma;
        break;
        case 'flamer':
            weapon1ToDraw = iconFlames;
        break;
        case 'rocket':
            weapon1ToDraw = iconRocket;
        break;
        case 'laser':
            weapon1ToDraw = iconLaser;
        break;
    }
}

function drawWeaponUI (){
    ctx.drawImage(weapon1ToDraw, canvas.width-weapon1ToDraw.width, canvas.height-weapon1ToDraw.height, weapon1ToDraw.width, weapon1ToDraw.height);
}