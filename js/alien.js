'use strict'

const ALIEN_SPEED = 300;
var gAliens;
var gIsAlienFreeze = true;
var gSetIntervalAliens;

function createAliens(board) {
    gAliens = []
    for (var i = 1; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            console.log(i)
            var alien = createAlien(i, j)
            gAliens.push(alien)
            board[alien.location.i][alien.location.j].gameObject = ALIEN
        }
    }
    return gAliens
}

function createAlien(i, j) {
    return {
        location: {
            i: i,
            j: j
        },
        gameObject: ALIEN
    }
}

function handleAlienHit(pos_I, pos_J) {
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].location.i === pos_I && gAliens[i].location.j === pos_J) {
            gAliens.splice(i, 1)
            printPoints(10)
            break
        }
    }
}

function shiftBoardRight() {
    for (var i = gAliens.length - 1; i >= 0; i--) {

        var oldLoc_I = gAliens[i].location.i
        var oldLoc_J = gAliens[i].location.j

        if (oldLoc_J === gBoard[0].length - 1) {
            clearInterval(gSetIntervalAliens)
            gSetIntervalAliens = setInterval(shiftBoardDown, ALIEN_SPEED, 'toLeft')
            return
        }
        var newLoc_I = oldLoc_I
        var newLoc_J = oldLoc_J + 1

        // clear curr location
        updateCell({ i: oldLoc_I, j: oldLoc_J }, null)

        // update new location
        gAliens[i].location.j = newLoc_J

        // update object in new location
        updateCell({ i: newLoc_I, j: newLoc_J }, ALIEN)
    }
}

function shiftBoardLeft() {
    for (var i = 0; i < gAliens.length; i++) {

        var oldLoc_I = gAliens[i].location.i
        var oldLoc_J = gAliens[i].location.j

        if (oldLoc_J === 0) {
            clearInterval(gSetIntervalAliens)
            gSetIntervalAliens = setInterval(shiftBoardDown, ALIEN_SPEED, 'toRight')
            return
        }

        var newLoc_I = oldLoc_I
        var newLoc_J = oldLoc_J - 1

        // clear curr location
        updateCell({ i: oldLoc_I, j: oldLoc_J }, null)

        // update new location
        gAliens[i].location.j = newLoc_J

        // update object in new location
        updateCell({ i: newLoc_I, j: newLoc_J }, ALIEN)
    }
}

function shiftBoardDown(direction) {

    for (var i = gAliens.length - 1; i >= 0; i--) {

        var oldLoc_I = gAliens[i].location.i
        var oldLoc_J = gAliens[i].location.j

        var newLoc_I = oldLoc_I + 1
        var newLoc_J = oldLoc_J

        // clear curr location
        updateCell({ i: oldLoc_I, j: oldLoc_J }, null)

        // update new location
        gAliens[i].location.i = newLoc_I
        // update object in new location
        updateCell({ i: newLoc_I, j: newLoc_J }, ALIEN)

        if (newLoc_I === gBoard.length - 2) {
            clearInterval(gSetIntervalAliens)
            gameOver()
            return
        }
    }

    clearInterval(gSetIntervalAliens)

    switch (direction) {
        case 'toLeft':
            gSetIntervalAliens = setInterval(shiftBoardLeft, ALIEN_SPEED);
            break;
        case 'toRight':
            gSetIntervalAliens = setInterval(shiftBoardRight, ALIEN_SPEED);
            break;
    }
}

function moveAliens() {
    gSetIntervalAliens = setInterval(shiftBoardRight, ALIEN_SPEED)
}

