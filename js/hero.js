'use strict'

const LASER_SPEED = 80;
var gLaserInterval
var laser_I
var gHero // pos, isShoot

// creates the hero and place it on board
function createHero(board) {
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

// Handle game keys
function onKeyDown(ev) {
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
        case 'n':
            blowupNegs(j)
            break;
    }
}

// Move the hero right (1) or left (-1) 
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

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot(laser_J) {
    if (gHero.isShoot) return;
    gHero.isShoot = true

    laser_I = gHero.pos.i - 1
    gLaserInterval = setInterval(blinkLaser, LASER_SPEED, laser_J)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(laser_J) {
    var cellUpdateLaser_I = laser_I--
    var cellUpdateLaser_J = laser_J

    var cellRemoveLaser_I = cellUpdateLaser_I + 1
    var cellRemoveLaser_J = laser_J

    // 
    if (gBoard[cellUpdateLaser_I][cellUpdateLaser_J].gameObject === ALIEN ||
        cellUpdateLaser_I === 0) {

        if (gBoard[cellUpdateLaser_I][cellUpdateLaser_J].gameObject === ALIEN) {
            handleAlienHit(cellUpdateLaser_I,cellUpdateLaser_J)           
            printPoints(10)
            if (isWin()) {
                gameOver()
            }
        }
 
        gBoard[cellUpdateLaser_I][cellUpdateLaser_J].gameObject = null
        updateCell({ i: cellUpdateLaser_I, j: cellUpdateLaser_J }, null)

        gBoard[cellRemoveLaser_I][cellRemoveLaser_J].gameObject = null
        updateCell({ i: cellRemoveLaser_I, j: cellRemoveLaser_J }, null)

        clearInterval(gLaserInterval)
        gHero.isShoot = false
        return
    }

    // update laser          
    gBoard[cellUpdateLaser_I][cellUpdateLaser_J].gameObject = LASER
    updateCell({ i: cellUpdateLaser_I, j: cellUpdateLaser_J }, LASER)

    // remove laser
    if (cellRemoveLaser_I !== gHero.pos.i) {
        gBoard[cellRemoveLaser_I][cellRemoveLaser_J].gameObject = null
        updateCell({ i: cellRemoveLaser_I, j: cellRemoveLaser_J }, null)
    }
}

// blowupNegs(cellUpdateLaser_I, cellUpdateLaser_J, gBoard)

function blowupNegs(cellI, cellJ, board) {

    for(var i = cellI - 1; i <= cellI + 1; i++) {
        if(i < 0 || i >= board.length - 1) continue
        for(var j = cellJ -1; j <= cellJ + 1; j++) {
            if(j < 0 || j >= board[i].length) continue
            if(i === cellI && j === cellJ) continue
        
            board[i][j].gameObject = null 
            updateCell({i,j}, null)
        }
    }
}

