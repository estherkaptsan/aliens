'use strict'
// -----------------------------------------------------------------------
const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '♆';
const ALIEN = '👽';
const LASER = '⤊';
const SKY = 'SKY'
const EARTH = 'EARTH'
// var gHero

var gPoints
var gGame = {
    isOn: false,
    aliensCount: 0 // isVictory when aliensCount = 0
}
var gBoard = buildBoard()
// console.table(gBoard)
// -----------------------------------------------------------------------
function onInit() {
    gHero = { pos: { i: 12, j: 5 }, isShoot: false }
    gGame.isOn = true
    gPoints = 0

    createAliens(gBoard)
    createHero(gBoard)
    renderBoard(gBoard)

    hideModal()
}

function buildBoard() {
    var board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = []
        for (var j = 0; j < BOARD_SIZE; j++) {
            var currCell = board[i][j] = createCell()
            if (i === BOARD_SIZE - 1) currCell.type = EARTH // i === BOARD_SIZE - 2 || 
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

// position such as: {i: 2, j: 7} 
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}

function isWin() {
    return gAlienCount === 0
}

function gameOver() {
    // clean hero to next game
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = null
    updateCell(gHero.pos, null)

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
    debugger
    gPoints += diff
    var elH2 = document.querySelector('h2 span')
    elH2.innerHTML = diff
}

