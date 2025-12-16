// Player Factory
const Player = (name, marker) => {
  return { name, marker };
};

// Gameboard Module
const Gameboard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const setMark = (index, marker) => {
    if (board[index] === '') {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const getBoard = () => board;

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  return { setMark, getBoard, resetBoard };
})();

// Display Controller Module
const DisplayController = (() => {
  const cells = document.querySelectorAll('.cell');
  const resultDiv = document.getElementById('result');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const player1Input = document.getElementById('player1');
  const player2Input = document.getElementById('player2');

  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const index = cell.dataset.index;
      GameController.playRound(index);
    });
  });

  startBtn.addEventListener('click', () => {
    const p1 = player1Input.value || 'Player 1';
    const p2 = player2Input.value || 'Player 2';
    GameController.init(p1, p2);
  });

  restartBtn.addEventListener('click', () => {
    GameController.init('Player 1', 'Player 2');
  });

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, i) => {
      cell.textContent = board[i];
    });
  };

  const setResult = (message) => {
    resultDiv.textContent = message;
  };

  return { render, setResult };
})();

// Game Controller Module
const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const init = (player1Name, player2Name) => {
    players = [Player(player1Name, 'X'), Player(player2Name, 'O')];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.resetBoard();
    DisplayController.render();
    DisplayController.setResult('');
  };

  const playRound = (index) => {
    if (gameOver) return;
    const currentPlayer = players[currentPlayerIndex];
    const success = Gameboard.setMark(index, currentPlayer.marker);
    if (success) {
      DisplayController.render();
      if (checkWinner(currentPlayer.marker)) {
        DisplayController.setResult(`${currentPlayer.name} wins!`);
        gameOver = true;
      } else if (isTie()) {
        DisplayController.setResult("It's a tie!");
        gameOver = true;
      } else {
        currentPlayerIndex = 1 - currentPlayerIndex;
      }
    }
  };

  const checkWinner = (marker) => {
    const b = Gameboard.getBoard();
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];
    return winCombos.some((combo) => combo.every((i) => b[i] === marker));
  };

  const isTie = () => Gameboard.getBoard().every((cell) => cell !== '');

  return { init, playRound };
})();

// Initialize default game
GameController.init('Player 1', 'Player 2');
