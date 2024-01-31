let teamMode = false;
let currentPlayer = "X";
let gameOver = false;

const showTeam = () => {
    teamMode = true; 
    resetGame();
    var hideDiv = document.getElementById("hideDiv");
    hideDiv.style.display = "block";
    choiceButtons.style.display = "none";
    player.style.display = "block";
    teamscore.style.display = "block";
    teamscore.style.display = "flex";
    computerscore.style.display = "none";
    setupTeamMode();    
}

const showComputer = () => {
    teamMode = false; 
    resetGame(); 
    var choiceButtons = document.getElementById("hideDiv");
    hideDiv.style.display = "none";
    choiceButtons.style.display = "block";
    choice2.style.display = "none";
    choice1.style.display = "none";
    computerscore.style.display = "block";
    computerscore.style.display = "flex";
    teamscore.style.display = "none";
    setupComputerMode();
}

let boxes = document.querySelectorAll(".bench");
let resetBtn = document.querySelector("#resetbtn");
let newGameBtn = document.querySelector("#newgame");
let msgContainer = document.querySelector(".messagebox");
let msg = document.querySelector("#message");

let turnO = true;
let count = 0;

const winPatterns =[
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    currentPlayer = "X";
    gameOver = false;
    count = 0;
    
    for (let bench of boxes) {
        bench.innerText = "";
        bench.disabled = false;
    }
    msgContainer.classList.add("hide");
};

const setupTeamMode = () => {
boxes.forEach((bench)=>{
    bench.addEventListener("click", ()=>{
        if(turnO){
            bench.innerText = "X";
            turnO = false;
            document.getElementById("player1").disabled = true;
            document.getElementById("player2").disabled = false;
        }
        else{
            bench.innerText = "O";
            turnO = true;
            document.getElementById("player2").disabled = true;
            document.getElementById("player1").disabled = false;
        }
        bench.disabled = true;
        count++;
        let isWinner = checkWinner();
        if(count === 9 && !isWinner){
            gameDraw();
        }
    });
});
};

const setupComputerMode = () => {
    boxes.forEach((bench) => {
        bench.addEventListener("click", () => {
            if (!gameOver && bench.innerText === "") {
                bench.innerText = currentPlayer;
                bench.disabled = true;
                count++;
                const winningPattern = CheckWinner(currentPlayer, boxes);
                if (winningPattern) {
                    showWinner(currentPlayer, winningPattern);
                    gameOver = true;
                } else if (count === 9) {
                    gameDraw();
                    gameOver = true;
                } else {
                    currentPlayer = "X";
                    makeComputerMove();
                }
            }
        });
    });
};

const makeComputerMove = () => {
    if (!gameOver) {
        const emptyCells = Array.from(boxes).filter((box) => box.innerText === "");
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const selectedBench = emptyCells[randomIndex];
            selectedBench.innerText = "O";
            selectedBench.disabled = true;
            count++;
            if (CheckWinner("O", boxes)) {
                showWinner("O");
                gameOver = true;
            } else if (count === 9) {
                gameDraw();
                gameOver = true;
            } else {
                currentPlayer = "X"; 
            }
        }
    }
};

const getBestMove = () => {
    let bestScore = -Infinity;
    let bestMove = 1;
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerText === "") {
            boxes[i].innerText = "O";
            const score = minimax([...boxes], 0, false, 3); 
            boxes[i].innerText = "";
            if (score > bestScore) {
                bestScore = score; 
                bestMove = i;
            }
        }
    }
    return bestMove;
};

const SYMBOLS = {
    PLAYER_O: "O",
    PLAYER_X: "X",
    DRAW: 0,
};

const minimax = (board, depth, isMaximizing, maxDepth) => {
    const { PLAYER_O, PLAYER_X, DRAW } = SYMBOLS;
    const winner = CheckWinner(PLAYER_O, board) ? PLAYER_O : CheckWinner(PLAYER_X, board) ? PLAYER_X : null;
    if (winner) {
        return winner === PLAYER_O ? -1 : 1;
    }
    if (depth === maxDepth || isBoardFull(board)) {
        return DRAW;
    }
    const currentPlayer = isMaximizing ? PLAYER_O : PLAYER_X;
    let bestScore = isMaximizing ? -Infinity : Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i].innerText === "") {
            board[i].innerText = currentPlayer;
            const score = minimax([...board], depth + 1, !isMaximizing, maxDepth);
            board[i].innerText = "";
            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }
    return bestScore;
};

const CheckWinner = (symbol, board) => {
    const checkPattern = (pattern) => pattern.every((pos) => board[pos].innerText === symbol);
    for (let pattern of winPatterns) {
        if (checkPattern(pattern)) {
            return pattern; 
        }
    }
    return null;
};

const boardExample = [
    { innerText: 'O' }, { innerText: 'O' }, { innerText: 'X' },
    { innerText: 'X' },  { innerText: 'O' }, { innerText: 'X' },
    { innerText: 'O' }, { innerText: 'X' }, { innerText: 'O' }
];
const winningPattern = CheckWinner('X', boardExample);
console.log(winningPattern);

const disableBoxes=()=>{
    for (let bench of boxes){
        bench.disabled = true;
    }
};

const enableBoxes=()=>{
    for(let bench of boxes){
        bench.disabled = false;
        bench.innerText="";
    }
};

let xScore = 0;
let oScore = 0;
let tieScore = 0;
let computerXScore = 0;
let computerTieScore = 0;
let computerOScore = 0;

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    if (winner === "X") {
        xScore += 3;
        computerXScore += 3;
    } 
    else if (winner === "O") {
        oScore += 3;
        computerOScore += 3;
    }
    updateScore();
};

const gameDraw = () => {
    msg.innerText = "Game was a draw";
    msgContainer.classList.remove("hide");
    disableBoxes();
    tieScore++;
    computerTieScore++;
    updateScore();
};

const updateScore = () => {
    document.getElementById("xScore").innerText = xScore;
    document.getElementById("oScore").innerText = oScore;
    document.getElementById("tieScore").innerText = tieScore;
    document.getElementById("computerXScore").innerText = computerXScore;
    document.getElementById("computerTieScore").innerText = computerTieScore;
    document.getElementById("computerOScore").innerText = computerOScore;
};



const checkWinner=()=>{
    for(let pattern of winPatterns){
        let position1 = boxes[pattern[0]].innerText;
        let position2 = boxes[pattern[1]].innerText;
        let position3 = boxes[pattern[2]].innerText;

        if(position1 !="" && position2 !="" && position3 !=""){
            if(position1 === position2 && position2 === position3){
                showWinner(position1);
                return true;
            }
        }
    }
};
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click",resetGame);
