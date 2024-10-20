document.addEventListener("DOMContentLoaded", () => {
    const titleScreen = document.getElementById('title-screen');
    const startBtn = document.getElementById('start-btn');
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    const scoreValue = document.getElementById('score-value');
    const timerValue = document.getElementById('timer-value');
    const gameOverScreen = document.getElementById('game-over');
    const finalScore = document.getElementById('final-score');
    const gameOverMessage = document.getElementById('game-over-message');
    const restartBtn = document.getElementById('restart-btn');

    let score = 0;
    let timer = 180; // 3分 = 180秒
    let intervalId;
    let grid;

    function initializeGame() {
        score = 0;
        timer = 180;
        updateScore(score);
        updateTimerDisplay();
        grid = Array.from({ length: 5 }, () => Array(5).fill(null));
        gameBoard.innerHTML = '';
        addNewTile();
        addNewTile();
        intervalId = setInterval(updateTimer, 1000);
        gameOverScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
    }

    function updateScore(newScore) {
        score = newScore;
        scoreValue.textContent = score;
    }

    function updateTimer() {
        timer--;
        updateTimerDisplay();
        if (timer <= 0) {
            gameOver("タイムアップ！"); // タイムアップのメッセージ
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function addNewTile() {
        let emptyCells = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (!grid[i][j]) emptyCells.push({ x: i, y: j });
            }
        }
        if (emptyCells.length > 0) {
            let { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[x][y] = { value: Math.random() < 0.9 ? 2 : 4, cell: createCell(x, y) };
            updateGrid();
        }
        if (isGameOver()) {
            gameOver("ゲームオーバー"); // プレイヤーの動きがない場合のメッセージ
        }
    }

    function createCell(x, y) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell';
        gameBoard.appendChild(cell);
        setPosition(cell, x, y);
        return cell;
    }

    function setPosition(cell, x, y) {
        cell.style.transform = `translate(${y * 100}px, ${x * 100}px)`; // 修正: 行と列の位置を正しく設定
    }

    function updateGrid() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (grid[i][j]) {
                    grid[i][j].cell.textContent = grid[i][j].value;
                    grid[i][j].cell.style.backgroundColor = getTileColor(grid[i][j].value);
                    setPosition(grid[i][j].cell, i, j);
                }
            }
        }
    }

    function getTileColor(value) {
        switch (value) {
            case 2: return '#eee4da';
            case 4: return '#ede0c8';
            case 8: return '#f2b179';
            case 16: return '#f59563';
            case 32: return '#f67c5f';
            case 64: return '#f65e3b';
            case 128: return '#edcf72';
            case 256: return '#edcc61';
            case 512: return '#edc850';
            case 1024: return '#edc53f';
            case 2048: return '#edc22e';
            default: return '#3c3a32';
        }
    }

    function gameOver(message) {
        clearInterval(intervalId);
        finalScore.textContent = score;
        gameOverMessage.textContent = message;
        gameOverScreen.classList.remove('hidden');
    }

    restartBtn.addEventListener('click', () => {
        gameOverScreen.classList.add('hidden');
        titleScreen.classList.remove('hidden');
        gameContainer.classList.add('hidden');
    });

    startBtn.addEventListener('click', () => {
        titleScreen.classList.add('hidden');
        initializeGame();
    });

    document.addEventListener('keydown', handleInput);

    function handleInput(event) {
        let moved = false;
        switch (event.key) {
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
        }
        if (moved) {
            addNewTile();
            updateGrid();
        }
    }

    function moveUp() {
        let moved = false;
        for (let j = 0; j < 5; j++) {
            for (let i = 1; i < 5; i++) {
                if (grid[i][j]) {
                    let k = i;
                    while (k > 0 && !grid[k-1][j]) {
                        grid[k-1][j] = grid[k][j];
                        grid[k][j] = null;
                        k--;
                        moved = true;
                    }
                    if (k > 0 && grid[k-1][j] && grid[k-1][j].value === grid[k][j].value) {
                        grid[k-1][j].value *= 2;
                        score += grid[k-1][j].value;
                        updateScore(score);
                        gameBoard.removeChild(grid[k][j].cell);
                        grid[k][j] = null;
                        moved = true;
                    }
                }
            }
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let j = 0; j < 5; j++) {
            for (let i = 3; i >= 0; i--) {
                if (grid[i][j]) {
                    let k = i;
                    while (k < 4 && !grid[k+1][j]) {
                        grid[k+1][j] = grid[k][j];
                        grid[k][j] = null;
                        k++;
                        moved = true;
                    }
                    if (k < 4 && grid[k+1][j] && grid[k+1][j].value === grid[k][j].value) {
                        grid[k+1][j].value *= 2;
                        score += grid[k+1][j].value;
                        updateScore(score);
                        gameBoard.removeChild(grid[k][j].cell);
                        grid[k][j] = null;
                        moved = true;
                    }
                }
            }
        }
        return moved;
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < 5; i++) {
            for (let j = 1; j < 5; j++) {
                if (grid[i][j]) {
                    let k = j;
                    while (k > 0 && !grid[i][k-1]) {
                        grid[i][k-1] = grid[i][k];
                        grid[i][k] = null;
                        k--;
                        moved = true;
                    }
                    if (k > 0 && grid[i][k-1] && grid[i][k-1].value === grid[i][k].value) {
                        grid[i][k-1].value *= 2;
                        score += grid[i][k-1].value;
                        updateScore(score);
                        gameBoard.removeChild(grid[i][k].cell);
                        grid[i][k] = null;
                        moved = true;
                    }
                }
            }
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < 5; i++) {
            for (let j = 3; j >= 0; j--) {
                if (grid[i][j]) {
                    let k = j;
                    while (k < 4 && !grid[i][k+1]) {
                        grid[i][k+1] = grid[i][k];
                        grid[i][k] = null;
                        k++;
                        moved = true;
                    }
                    if (k < 4 && grid[i][k+1] && grid[i][k+1].value === grid[i][k].value) {
                        grid[i][k+1].value *= 2;
                        score += grid[i][k+1].value;
                        updateScore(score);
                        gameBoard.removeChild(grid[i][k].cell);
                        grid[i][k] = null;
                        moved = true;
                    }
                }
            }
        }
        return moved;
    }

    function isGameOver() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (!grid[i][j]) return false; // 空のセルがある場合はゲームオーバーではない
                if (i < 4 && grid[i][j].value === grid[i+1][j].value) return false; // 下のセルと結合可能ならゲームオーバーではない
                if (j < 4 && grid[i][j].value === grid[i][j+1].value) return false; // 右のセルと結合可能ならゲームオーバーではない
            }
        }
        return true; // 上記の条件をすべて満たさない場合はゲームオーバー
    }
});
// User-Agentを使ってモバイルデバイスを検出する関数
function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
}

// スマホならリダイレクトする
if (isMobile()) {
    window.location.href = "https://yufugames.com/errors/phone.html";
}
