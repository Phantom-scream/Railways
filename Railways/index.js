const menuSection = document.querySelector('#menu-section');
const gameSection = document.querySelector('#game-section');
const playerDisplay = document.querySelector('#player-display');
const timerDisplay = document.querySelector('#timer-display');
const gameBoard = document.querySelector('#game-board');
const rulesModal = document.querySelector('#rules-modal');
const closeModalButton = document.querySelector('.close-modal'); 
const backToMenuBtn = document.querySelector('#back-btn');

let playerName = '';
let difficulty = '';
let timer;
let elapsedTime = 0;
let grid = [];
let gridSize = 5;

const maps = {
    easy: [
        [
            ["empty", 'mountain3', "empty", "empty", "lake"],
            ["empty", "empty", "empty", "bridge", "lake"],
            ["bridge", "empty", "mountain2", "empty", "empty"],
            ["empty", "empty", "empty", "lake", "empty"],
            ["empty", "empty", "mountain1", "empty", "empty"]
        ],

        [
            ["lake", "empty", "bridge2", "empty", "empty"],
            ["empty", "mountain2", "empty", "empty", "mountain2"],
            ["bridge", "lake", "mountain1", "empty", "empty"],
            ["empty", "empty", "empty", "lake", "empty"],
            ["empty", "empty", "empty", "empty", "empty"]
        ],
        
        [
            ["empty", "empty", "bridge2", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "bridge"],
            ["empty", "mountain2", "bridge", "empty", "empty"],
            ["empty", "lake", "empty", "empty", "empty"],
            ["empty", "bridge2", "empty", "empty", "mountain2"]
        ],

        [
            ["empty", "empty", "empty", "bridge2", "empty"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["bridge", "empty", "mountain3", "empty", "mountain3"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "lake", "mountain1", "empty"]
        ],

        [
            ["empty", "empty", "bridge2", "empty", "empty"],
            ["empty", "mountain", "empty", "empty", "empty"],
            ["bridge", "empty", "empty", "mountain1", "empty"],
            ["empty", "empty", "bridge", "lake", "empty"],
            ["empty", "mountain2", "empty", "empty", "empty"]
        ],
    ],
    hard: [
        [
            ["empty", "mountain3", "lake", "lake", "empty", "bridge2", "empty"],
            ["bridge", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "bridge", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "mountain1", "empty", "empty", "empty"],
            ["mountain1", "empty", "mountain3", "empty", "bridge2", "empty", "lake"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "bridge2", "empty", "empty", "empty"]
        ],

        [
            ["empty", "empty", "lake", "empty", "empty", "empty", "empty"],
            ["bridge", "empty", "bridge2", "empty", "empty", "mountain2", "empty"],
            ["empty", "empty", "bridge2", "empty", "empty", "empty", "bridge"],
            ["mountain", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "lake", "empty", "mountain3", "empty", "empty", "empty"],
            ["empty", "mountain", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "lake", "empty", "empty", "empty", "empty"]
        ],
        
        [
            ["empty", "empty", "bridge2", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "bridge"],
            ["lake", "empty", "mountain1", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "lake", "mountain1", "empty", "bridge2", "empty", "empty"],
            ["bridge", "empty", "empty", "empty", "empty", "mountain3", "empty"],
            ["empty", "empty", "lake", "mountain1", "empty", "empty", "empty"]
        ],

        [
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "bridge", "empty", "mountain2", "empty"],
            ["empty", "empty", "mountain1", "empty", "empty", "empty", "empty"],
            ["empty", "bridge2", "empty", "lake", "empty", "bridge2", "empty"],
            ["empty", "empty", "mountain2", "empty", "mountain3", "empty", "empty"],
            ["bridge", "empty", "empty", "empty", "empty", "mountain1", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty"]
        ],

        [
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "mountain", "empty"],
            ["empty", "bridge2", "bridge2", "empty", "mountain3", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "mountain", "empty", "lake", "empty", "empty"],
            ["empty", "mountain2", "empty", "bridge", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty"]
        ],
    ]
};


document.querySelector('#start-game-btn').addEventListener('click', startGame);
document.querySelector('#rules-btn').addEventListener('click', toggleRulesModal);
closeModalButton.addEventListener('click', toggleRulesModal);
document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', selectDifficulty);
});

document.querySelector("#start-game-btn").addEventListener("click", function() {
    document.body.classList.add("alt-background");
});

backToMenuBtn.addEventListener('click', () => {
    menuSection.classList.remove('d-none');
    gameSection.classList.add('d-none');
    document.body.classList.remove("alt-background");
    stopTimer();
    elapsedTime = 0;
    timerDisplay.innerHTML = 'Time: 00:00';
});

document.querySelector('#player-name').addEventListener('input', function() {
    const startButton = document.querySelector('#start-game-btn');
    playerName = this.value.trim();
    startButton.disabled = !playerName;
});

function startGame() {
    playerName = document.querySelector('#player-name').value.trim();
    if (!playerName) return;

    playerDisplay.innerHTML = `Player: ${playerName}`;
    menuSection.classList.add('d-none');
    gameSection.classList.remove('d-none');
    
    const selectedMaps = maps[difficulty];
    const selectedMap = selectedMaps[Math.floor(Math.random() * selectedMaps.length)];

    createGameBoard(selectedMap);
    startTimer();
}


function selectDifficulty(event) {
    difficulty = event.target.getAttribute('data-difficulty');
    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    gridSize = difficulty === 'easy' ? 5 : 7;
    document.documentElement.style.setProperty('--columns', gridSize);
}

function toggleRulesModal() {
    rulesModal.style.display = rulesModal.style.display === 'flex' ? 'none' : 'flex';
}

function createGameBoard(selectedMap) {

    gameBoard.innerHTML = ''; 

    const gridSize = selectedMap.length;
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

    selectedMap.forEach((row, rowIndex) => {
        row.forEach((cellType, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'board-cell';
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;
            cellDiv.dataset.cellType = cellType;

            let imgSrc;
            switch (cellType) {
                case 'lake':
                    imgSrc = 'pics/tiles/oasis.png';
                    break;
                case 'bridge':
                    imgSrc = 'pics/tiles/bridge.png';
                    break;
                case 'bridge2':
                    imgSrc = 'pics/tiles/bridge2.png';
                    break;
                case 'mountain':
                    imgSrc = 'pics/tiles/mountain.png';
                    break;
                case 'mountain1':
                    imgSrc = 'pics/tiles/mountain1.png';
                    break;
                case 'mountain2':
                    imgSrc = 'pics/tiles/mountain2.png';
                    break;
                case 'mountain3':
                    imgSrc = 'pics/tiles/mountain3.png';
                    break;
                case 'empty':
                    imgSrc = 'pics/tiles/empty.png';
                    break;
                default:
                    imgSrc = '';
                    console.warn(`No image given for cell type "${cellType}"`);
                    break;
            }

            if (imgSrc) {
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.alt = cellType;
                cellDiv.appendChild(imgElement);
            }

            cellDiv.addEventListener('click', () => placeRailwayElement(rowIndex, colIndex));

            gameBoard.appendChild(cellDiv);
        });
    });
}

function placeRailwayElement(row, col) {
    const cellDiv = gameBoard.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
    if (!cellDiv) return;

    const cellType = cellDiv.dataset.cellType;

    if (cellType === "lake") return;

    if (!cellDiv.dataset.clickCount) cellDiv.dataset.clickCount = 0;
    let clickCount = parseInt(cellDiv.dataset.clickCount);

    const railImages = [
        'pics/tiles/straight.png',   
        'pics/tiles/straight1.png',  
        'pics/tiles/curveul.png',    
        'pics/tiles/curveur.png',    
        'pics/tiles/curvedl.png',    
        'pics/tiles/curvedr.png'     
    ];

    const entryPointsMapping = [
        ['up', 'down'],   
        ['left', 'right'], 
        ['left', 'down'],  
        ['right', 'down'], 
        ['left', 'up'],   
        ['right', 'up']  
    ];

    const mountainImages = {
        "mountain": 'pics/tiles/mountainr.png',  
        "mountain1": 'pics/tiles/mountainr2.png', 
        "mountain2": 'pics/tiles/mountainr3.png', 
        "mountain3": 'pics/tiles/mountainr1.png' 
    };

    const mountainEntryPoints = {
        "mountain": ['right', 'down'],   
        "mountain1": ['right', 'up'],    
        "mountain2": ['left', 'up'],  
        "mountain3": ['left', 'down']  
    };

    const bridgeImages = {
        "bridge": 'pics/tiles/bridger.png',  
        "bridge2": 'pics/tiles/bridger1.png' 
    };

    const bridgeEntryPoints = {
        "bridge": ['up', 'down'],    
        "bridge2": ['left', 'right'] 
    };

    let imgElement = cellDiv.querySelector('img');
    if (!imgElement) {
        imgElement = document.createElement('img');
        cellDiv.appendChild(imgElement);
    }

    switch (cellType) {
        case "empty":
            const railImageIndex = clickCount % railImages.length;
            imgElement.src = railImages[railImageIndex];
            
            const railEntryPoints = entryPointsMapping[railImageIndex];
            cellDiv.setAttribute('data-entry-points', railEntryPoints.join(','));
            
            clickCount = (clickCount + 1) % railImages.length;
            cellDiv.dataset.clickCount = clickCount;
            break;

        case "mountain":
        case "mountain1":
        case "mountain2":
        case "mountain3":
            imgElement.src = mountainImages[cellType];
            const mountainEntry = mountainEntryPoints[cellType];
            cellDiv.setAttribute('data-entry-points', mountainEntry.join(','));
            cellDiv.dataset.clickCount = 0;
            break;

        case "bridge":
        case "bridge2":
            imgElement.src = bridgeImages[cellType];
            const bridgeEntry = bridgeEntryPoints[cellType];
            cellDiv.setAttribute('data-entry-points', bridgeEntry.join(','));
            cellDiv.dataset.clickCount = 0;
            break;

        default:
            return;
    }

    let valid = validateGameBoard();
    
    if (valid) {
        endGame();
    }
}

function startTimer() {
    timer = setInterval(() => {
        elapsedTime++;
        const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');
        timerDisplay.innerHTML = `Time: ${minutes}:${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function validateGameBoard() {
    const gridSize = grid.length;

    const directions = {
        'up': [-1, 0],
        'down': [1, 0],
        'left': [0, -1],
        'right': [0, 1]
    };

    function getOppositeDirection(direction) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        return opposites[direction];
    }

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = gameBoard.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
            if (!cell) continue;

            const cellType = cell.dataset.cellType;

            if (cellType === 'lake') continue;

            const entryPoints = cell.getAttribute('data-entry-points')?.split(',') || [];

            if (entryPoints.length === 0 && cellType !== 'lake') continue;

            for (let direction of entryPoints) {
                const [dRow, dCol] = directions[direction];
                const neighborRow = row + dRow;
                const neighborCol = col + dCol;

                if (neighborRow < 0 || neighborRow >= gridSize || neighborCol < 0 || neighborCol >= gridSize) {
                    console.log(`Invalid Connection: Cell at (${row}, ${col}) points out of bounds.`);
                    return false;
                }

                const neighbor = gameBoard.querySelector(`.board-cell[data-row="${neighborRow}"][data-col="${neighborCol}"]`);
                if (!neighbor) {
                    console.log(`Invalid Connection: Cell at (${row}, ${col}) points to a non-existent cell.`);
                    return false;
                }

                const neighborType = neighbor.dataset.cellType;
                if (neighborType === 'lake') {
                    console.log(`Invalid Connection: Cell at (${row}, ${col}) points to a lake at (${neighborRow}, ${neighborCol}).`);
                    return false;
                }

                const neighborEntryPoints = neighbor.getAttribute('data-entry-points')?.split(',') || [];
                const oppositeDirection = getOppositeDirection(direction);

                if (!neighborEntryPoints.includes(oppositeDirection)) {
                    console.log(`Invalid Connection: Cell at (${row}, ${col}) points to (${neighborRow}, ${neighborCol}), but it does not have a matching entry point back.`);
                    return false;
                }
            }
        }
    }

    console.log("All cells are correctly connected.");
    return true;
}

function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
}

function loadLeaderboard(difficulty) {
    const leaderboard = JSON.parse(localStorage.getItem(`${difficulty}-leaderboard`)) || [];
    const leaderboardList = document.querySelector(`#${difficulty}-leaderboard-list`);
    leaderboardList.innerHTML = '';

    leaderboard.slice(0, 5).forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name}: ${formatTime(entry.time)}`;
        leaderboardList.appendChild(listItem);
    });
}

function saveToLeaderboard(playerName, elapsedTime, difficulty) {
    const leaderboard = JSON.parse(localStorage.getItem(`${difficulty}-leaderboard`)) || [];

    leaderboard.push({ name: playerName, time: elapsedTime });
    
    leaderboard.sort((a, b) => a.time - b.time);
    localStorage.setItem(`${difficulty}-leaderboard`, JSON.stringify(leaderboard));

    loadLeaderboard(difficulty);
}

function endGame() {
    let isValid = validateGameBoard();

    if (isValid) {
        stopTimer();
        saveToLeaderboard(playerName, elapsedTime, difficulty);
        loadLeaderboard(difficulty);
    }
}