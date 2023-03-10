// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}

function createCell(gameObject = null) {
    return { type: SKY, gameObject: gameObject }
}

function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`);
}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}