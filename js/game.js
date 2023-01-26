'use strict'
// -----------------------------------------------------------------------
const BOARD_SIZE = 10;
const ALIENS_ROW_LENGTH = 4
const ALIENS_ROW_COUNT = 3
const HERO = '♆';
const ALIEN = '👽';
const LASER = '⤊';
const SKY = 'SKY'
const EARTH = 'EARTH'

var gPoints
var gGame = {
    isOn: false,
    aliensCount: 0
}
var gBoard = buildBoard()

// -----------------------------------------------------------------------
function onInit() {
    clearHero()
    gHero = { pos: { i: BOARD_SIZE - 2, j: BOARD_SIZE / 2 }, isShoot: false }
    gGame.isOn = true
    gPoints = 0 
    clearAliensRemained()
    createAliens(gBoard)
    createHero(gBoard)
    renderBoard(gBoard)
    moveAliens()   
    printPoints(0)
    hideModal()
}

function buildBoard() {
    var board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = []
        for (var j = 0; j < BOARD_SIZE; j++) {
            var currCell = board[i][j] = createCell()
            if (i === BOARD_SIZE - 1) currCell.type = EARTH  
        }
    }
    return board
}

function createCell(gameObject = null) {
    return { type: SKY, gameObject: gameObject }
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < BOARD_SIZE; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < BOARD_SIZE; j++) {
            var className = getClassName({ i: i, j: j }) + ' '
            className += (board[i][j].type === SKY) ? 'sky' : 'earth'
            strHTML += `\n<td data-i="${i}" data-j="${j}" class="${className}">\n`

            if (board[i][j].gameObject === HERO) strHTML += HERO
            else if (board[i][j].gameObject === ALIEN) strHTML += ALIEN

            strHTML += `</td>`
        }
        strHTML += `</tr>`
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}

function isWin() {
    return gAliens.length === 0
}

function gameOver() {
    gGame.isOn = false
    createModal()
    clearInterval(gLaserInterval)
}

function createModal() {
    var elModal = document.querySelector('.modal')
    var elH2 = document.querySelector('.modal h2 span')

    elH2.innerText = (isWin()) ? 'YOU-WON' : 'YOU LOST'
    elModal.classList.add('show')
}

function hideModal() {
    var elModal = document.querySelector('.modal')
    elModal.classList.remove('show')
}

function printPoints(diff) {
    gPoints += diff
    var elH2 = document.querySelector('h2 span')
    elH2.innerHTML = gPoints
}

function clearAliensRemained() {
    if(!gAliens) return
    for (var i = 0; i < gAliens.length; i++) {
        gAliens[i].gameObject = null
        updateCell({ i: gAliens[i].location.i, j: gAliens[i].location.j }, null)
    }
}

function clearHero(){
    if(!gHero) return
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = null
    updateCell(gHero.pos, null)
}