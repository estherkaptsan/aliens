// const ALIEN = '👽';

const ALIEN_SPEED = 500;
var gIntervalAliens;
var gAlienCount;
var gAliens; // []

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row

var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gIsAlienFreeze = true;

function createAliens(board) {
    gAliens = []
    gAlienCount = ALIENS_ROW_LENGTH * (ALIENS_ROW_COUNT - 1)
    for (var i = 1; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {

            var alien = createAlien(i, j)
            gAliens.push(alien)
            board[alien.location.i][alien.location.j].gameObject = ALIEN
        }
    }
    console.log(gAlienCount);
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

function handleAlienHit(pos) {
    var alienHit = blinkLaser()
    console.log(alienHit)
}

// board, fromI, toI
function shiftBoardRight() {

    for (var i = gAliens.length - 1; i >= 0; i--) {
        // debugger
        // remove object from curr location
        gAliens[i].gameObject = null
        updateCell({ i: gAliens[i].location.i, j: gAliens[i].location.j }, null)

        // update new location
        gAliens[i].location.j = gAliens[i].location.j + 1

        if (gAliens[gAliens.length - 1].location.j === gBoard.length - 1) {
            clearInterval(gAliensTopRowIdx)
        }
        // update object in new location
        gAliens[i].gameObject = ALIEN
        updateCell({ i: gAliens[i].location.i, j: gAliens[i].location.j }, ALIEN)

    }
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = 0; i < gAliens.length; i++) {

        // remove object from curr location
        gAliens[i].gameObject = null
        updateCell({ i: gAliens[i].location.i, j: gAliens[i].location.j }, null)

        // update new location
        gAliens[i].location.j = gAliens[i].location.j - 1

        if (gAliens[0].location.j === 0) {
            clearInterval(gAliensBottomRowIdx)
        }

        // update object in new location
        gAliens[i].gameObject = ALIEN
        updateCell({ i: gAliens[i].location.i, j: gAliens[i].location.j }, ALIEN)
    }
}

function shiftBoardDown() {
    for (var i = gAliens.length - 1; i >= 0; i--) {
        // remove object from curr location
        gAliens[i].gameObject = null
        updateCell({ i: gAliens[i].location.i, j: gAliens[i].location.j }, null)

        // update new location
        gAliens[i].location.i = gAliens[i].location.i + 1

        // update object in new location
        gAliens[i].gameObject = ALIEN
        updateCell({ i: gAliens[i].location.i, j: gAliens[i].location.j }, ALIEN)
    }
}

// runs the interval for moving aliens side to side and down 
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops 

function moveAliens() {

    gAliensTopRowIdx = setInterval(shiftBoardRight, 1000)

    // gAliensBottomRowIdx = setInterval(shiftBoardDown, 1000)

    // gAliensBottomRowIdx = setInterval(shiftBoardLeft, 1000)



}

