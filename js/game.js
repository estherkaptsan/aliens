'use strict'
// -----------------------------------------------------------------------
const BOARD_SIZE = 14
const ALIENS_ROW_LENGTH = 7
const ALIENS_ROW_COUNT = 4
const HERO = '♆';
var ALIEN = '👽';
const LASER_1 = '⤊';
const LASER_2 = '^'
const SKY = 'SKY'
const EARTH = 'EARTH'
const CANDY = '🍭'

var gCandyInterval
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
    clearInterval(gLaserInterval)
    clearInterval(gSetIntervalAliens)
    moveAliens()       
    printPoints(0)
    hideModal()
    gCandyInterval = setInterval(addCandy, 10000)
    addCandy()
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
    clearInterval(gCandyInterval)
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
    if (!gAliens) return
    for (var i = 0; i < gAliens.length; i++) {
        gAliens[i].gameObject = null
        updateCell({ i: gAliens[i].location.i, j: gAliens[i].location.j }, null)
    }
}

function clearHero() {
    if (!gHero) return
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = null
    updateCell(gHero.pos, null)
}

function restartGame() {
    gameOver()
    onInit()
}

function addCandy() {
    var randomIdx = getRandomIntInclusive(0, gBoard.length - 1)

    gBoard[0][randomIdx].gameObject = CANDY
    updateCell({ i: 0, j: randomIdx }, CANDY)

    setTimeout(() => {
        gBoard[0][randomIdx].gameObject = null
        updateCell({ i: 0, j: randomIdx }, null)
    }, 5000)
}