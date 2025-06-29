document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const themeButton = document.getElementById('theme');
    const xScoreDisplay = document.querySelector('.x-player .score');
    const oScoreDisplay = document.querySelector('.o-player .score');
    
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = { X: 0, O: 0 };
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;
        
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        checkResult();
    }
    
    function checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                highlightWinningCells(a, b, c);
                updateScore(currentPlayer);
                break;
            }
        }
        
        if (roundWon) {
            statusDisplay.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }
        
        if (!gameState.includes('')) {
            statusDisplay.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }
        
        switchPlayer();
    }
    
    function highlightWinningCells(a, b, c) {
        cells[a].classList.add('winner');
        cells[b].classList.add('winner');
        cells[c].classList.add('winner');
    }
    
    function updateScore(winner) {
        scores[winner]++;
        if (winner === 'X') {
            xScoreDisplay.textContent = scores.X;
            document.querySelector('.x-player').classList.add('pulse');
            setTimeout(() => {
                document.querySelector('.x-player').classList.remove('pulse');
            }, 1000);
        } else {
            oScoreDisplay.textContent = scores.O;
            document.querySelector('.o-player').classList.add('pulse');
            setTimeout(() => {
                document.querySelector('.o-player').classList.remove('pulse');
            }, 1000);
        }
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        
        // Highlight current player
        document.querySelectorAll('.player').forEach(player => {
            player.classList.remove('active');
        });
        document.querySelector(`.${currentPlayer.toLowerCase()}-player`).classList.add('active');
    }
    
    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        
        // Reset player highlights
        document.querySelectorAll('.player').forEach(player => {
            player.classList.remove('active');
        });
        document.querySelector('.x-player').classList.add('active');
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        // Save preference to localStorage
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    }
    
    // Initialize theme from localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    themeButton.addEventListener('click', toggleTheme);
    
    // Initialize game
    document.querySelector('.x-player').classList.add('active');
});