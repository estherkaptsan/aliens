'use strict'

const LASER_SPEED = 300;
var gLaserInterval
var gLaser_I
var gLaserSpeed
var gLaserIcon
var gHero // pos, isShoot
var gNPressed

function createHero(board) {
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

function onKeyDown(ev) {
    console.log(ev.key);
    if (isWin()) return

    const i = gHero.pos.i
    const j = gHero.pos.j

    switch (ev.key) {
        case 'ArrowLeft':
            moveHero(-1)
            break;
        case 'ArrowRight':
            moveHero(1)
            break;
        case ' ':
            shoot(j)
            break;
        case 'x':
            increaseSpeed(j)
            break;
        case 'n':
            gNPressed = true
            break;
    }
}

function moveHero(dir) {
    var currHeroPos = gHero.pos
    var nextHeroPosI = currHeroPos.i
    var nextHeroPosJ = currHeroPos.j + dir

    if (nextHeroPosJ < 0 || nextHeroPosJ > BOARD_SIZE - 1) return

    gBoard[currHeroPos.i][currHeroPos.j].gameObject = null
    updateCell(currHeroPos, null)

    gHero.pos = { i: nextHeroPosI, j: nextHeroPosJ }
    gBoard[nextHeroPosI][nextHeroPosJ].gameObject = HERO
    updateCell(gHero.pos, HERO)
}

function shoot(laser_J) {
    if (gHero.isShoot || !gGame.isOn) return;
    gHero.isShoot = true
    gLaserIcon = LASER_1
    gLaserSpeed = LASER_SPEED

    gLaser_I = gHero.pos.i - 1
    gLaserInterval = setInterval(blinkLaser, gLaserSpeed, laser_J)
}

function increaseSpeed(laser_J) {
    if (!gHero.isShoot || !gGame.isOn) return
    clearInterval(gLaserInterval)
    gLaserIcon = LASER_2
    gLaserInterval = setInterval(blinkLaser, gLaserSpeed / 2, laser_J)
}

function blinkLaser(laser_J) {
    var cellUpdateLaser_I = gLaser_I--
    var cellUpdateLaser_J = laser_J

    var cellRemoveLaser_I = cellUpdateLaser_I + 1
    var cellRemoveLaser_J = laser_J

    if (gBoard[cellUpdateLaser_I][cellUpdateLaser_J].gameObject === ALIEN ||
        cellUpdateLaser_I === 0) {

        if (gBoard[cellUpdateLaser_I][cellUpdateLaser_J].gameObject === ALIEN) {
            handleAlienHit(cellUpdateLaser_I, cellUpdateLaser_J)
            if(gNPressed) blowupNegs(cellUpdateLaser_I, cellUpdateLaser_J)            
            printPoints(10)
            if (isWin()) gameOver()
        }

        gBoard[cellUpdateLaser_I][cellUpdateLaser_J].gameObject = null
        updateCell({ i: cellUpdateLaser_I, j: cellUpdateLaser_J }, null)

        if (cellRemoveLaser_I !== gHero.pos.i) {
            gBoard[cellRemoveLaser_I][cellRemoveLaser_J].gameObject = null
            updateCell({ i: cellRemoveLaser_I, j: cellRemoveLaser_J }, null)
        }

        clearInterval(gLaserInterval)
        gHero.isShoot = false
        gNPressed = false
        return
    }

    // update laser          
    gBoard[cellUpdateLaser_I][cellUpdateLaser_J].gameObject = gLaserIcon
    updateCell({ i: cellUpdateLaser_I, j: cellUpdateLaser_J }, gLaserIcon)

    // remove laser
    if (cellRemoveLaser_I !== gHero.pos.i) {
        gBoard[cellRemoveLaser_I][cellRemoveLaser_J].gameObject = null
        updateCell({ i: cellRemoveLaser_I, j: cellRemoveLaser_J }, null)
    }
}

function blowupNegs(cell_I, cell_J ) {
    for(var i = cell_I - 1; i <= cell_I + 1; i++) {
        if(i < 0 || i >= gBoard.length - 1) continue
        for(var j = cell_J -1; j <= cell_J + 1; j++) {
            if(j < 0 || j >= gBoard[i].length) continue
            if(i === cell_I && j === cell_J) continue
            
            if(gBoard[i][j].gameObject === ALIEN) {
                gBoard[i][j].gameObject = null 
                updateCell({i,j}, null)
                handleAlienHit(i, j)
            }
        }
    }
}

