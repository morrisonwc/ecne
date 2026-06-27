const game_board = document.querySelector("#game_board")
const player_display = document.querySelector("#player")
const info_display = document.querySelector("#info_display")
const width = 8
let player_go = "black"
player_display.textContent = "black"

const start_pieces = [
    rook_black, knight_black, bishop_black, queen_black, king_black, bishop_black, knight_black, rook_black,
    pawn_black, pawn_black, pawn_black, pawn_black, pawn_black, pawn_black, pawn_black, pawn_black,
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    pawn_white, pawn_white, pawn_white, pawn_white, pawn_white, pawn_white, pawn_white, pawn_white,
    rook_white, knight_white, bishop_white, queen_white, king_white, bishop_white, knight_white, rook_white
]

function createBoard() {
    start_pieces.forEach((start_piece, i) => {
        const square = document.createElement('div')
        square.classList.add("square")
        square.innerHTML = start_piece
        square.firstChild?.setAttribute("draggable", true)
        square.setAttribute("square-id", i)

        const row = Math.floor((63 - i) / 8) + 1
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "light" : "dark")
        } else {
            square.classList.add(i % 2 === 0 ? "dark" : "light")
        }

        if (i <= 15) {
            square.firstChild.firstChild.classList.add("black")
        }
        if (i >= 48) {
            square.firstChild.firstChild.classList.add("white")
        }

        game_board.append(square)
    })
}

createBoard()

const all_squares = document.querySelectorAll(".square")

all_squares.forEach(square => {
    square.addEventListener("dragstart", dragStart)
    square.addEventListener("dragover", dragOver)
    square.addEventListener("drop", dragDrop)
})

let start_position_id;
let dragged_element;

function dragStart(e) {
    start_position_id = e.target.parentNode.getAttribute("square-id")
    dragged_element = e.target
}
 
function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation()
    const correct_go = dragged_element.firstChild.classList.contains(player_go)
    const taken = e.target.classList.contains("piece")
    const valid = checkIfValid(e.target)
    const opponent_go = player_go === "white" ? "black" : "white";
    const taken_by_opponent = e.target.firstChild?.classList.contains(opponent_go)
    
    if (correct_go) {
        // Must check this first
        if(taken_by_opponent && valid) {
            e.target.parentNode.append(dragged_element)
            e.target.remove()
            checkForWin()
            changePlayer()
            return
        }
        // Then check this
        if(taken && !taken_by_opponent) {
            info_display.textContent = "You cannot go here!"
            setTimeout(() => info_display.textContent = "", 2000)
            return
        }
        if(valid) {
            e.target.append(dragged_element)
            checkForWin()
            changePlayer()
            return
        }
    }
}

function checkIfValid(target) {
    const target_id = Number(target.getAttribute("square-id")) || Number(target.parentNode.getAttribute("square-id"))
    const start_id = Number(start_position_id)
    const piece = dragged_element.id

    switch (true) {
        case (piece === "pawn_black" || piece === "pawn_white"):
            const starter_row = [8, 9, 10, 11, 12, 13, 14, 15]
            if (starter_row.includes(start_id) && start_id + width * 2 === target_id ||
                start_id + width === target_id ||
                start_id + width - 1 === target_id && document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild ||
                start_id + width + 1 === target_id && document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild
                ) {
                return true
            }
            break;
        case (piece === "knight_black" || piece === "knight_white"):
            if (
                start_id + width * 2 - 1 === target_id ||
                start_id + width * 2 + 1 === target_id ||
                start_id + width - 2 === target_id ||
                start_id + width + 2 === target_id ||
                start_id - width * 2 - 1 === target_id ||
                start_id - width * 2 + 1 === target_id ||
                start_id - width - 2 === target_id ||
                start_id - width + 2 === target_id
                ) {
                return true
            }
            break;
        case (piece === "bishop_black" || piece === "bishop_white"):
            if (
                start_id + width + 1 === target_id ||
                start_id + width * 2 + 2 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild ||
                start_id + width * 3 + 3 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild ||
                start_id + width * 4 + 4 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 + 3}"]`).firstChild ||
                start_id + width * 5 + 5 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 + 4}"]`).firstChild ||
                start_id + width * 6 + 6 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5 + 5}"]`).firstChild ||
                start_id + width * 7 + 7 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 6 + 6}"]`).firstChild ||
                
                start_id - width - 1 === target_id ||
                start_id - width * 2 - 2 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild ||
                start_id - width * 3 - 3 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild ||
                start_id - width * 4 - 4 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 - 3}"]`).firstChild ||
                start_id - width * 5 - 5 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 - 4}"]`).firstChild ||
                start_id - width * 6 - 6 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5 - 5}"]`).firstChild ||
                start_id - width * 7 - 7 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 6 - 6}"]`).firstChild ||
                
                start_id - width + 1 === target_id ||
                start_id - width * 2 + 2 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild ||
                start_id - width * 3 + 3 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild ||
                start_id - width * 4 + 4 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 + 3}"]`).firstChild ||
                start_id - width * 5 + 5 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 + 4}"]`).firstChild ||
                start_id - width * 6 + 6 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5 + 5}"]`).firstChild ||
                start_id - width * 7 + 7 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 6 + 6}"]`).firstChild ||

                start_id + width - 1 === target_id ||
                start_id + width * 2 - 2 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild ||
                start_id + width * 3 - 3 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild ||
                start_id + width * 4 - 4 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 - 3}"]`).firstChild ||
                start_id + width * 5 - 5 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 - 4}"]`).firstChild ||
                start_id + width * 6 - 6 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5 - 5}"]`).firstChild ||
                start_id + width * 7 - 7 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 6 - 6}"]`).firstChild
                ) {
                return true;
            }
            break;
        case (piece === "rook_black" || piece === "rook_white"):
            if (
                start_id + width === target_id ||
                start_id + width * 2 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild ||
                start_id + width * 3 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild ||
                start_id + width * 4 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3}"]`).firstChild ||
                start_id + width * 5 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4}"]`).firstChild ||
                start_id + width * 6 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5}"]`).firstChild ||
                start_id + width * 7 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 6}"]`).firstChild ||

                start_id - width === target_id ||
                start_id - width * 2 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild ||
                start_id - width * 3 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild ||
                start_id - width * 4 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3}"]`).firstChild ||
                start_id - width * 5 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4}"]`).firstChild ||
                start_id - width * 6 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5}"]`).firstChild ||
                start_id - width * 7 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 6}"]`).firstChild ||

                start_id + 1 === target_id ||
                start_id + 2 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild ||
                start_id + 3 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild ||
                start_id + 4 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild ||
                start_id + 5 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild ||
                start_id + 6 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild ||
                start_id + 7 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 6}"]`).firstChild ||

                start_id - 1 === target_id ||
                start_id - 2 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild ||
                start_id - 3 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild ||
                start_id - 4 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 3}"]`).firstChild ||
                start_id - 5 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 4}"]`).firstChild ||
                start_id - 6 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 5}"]`).firstChild ||
                start_id - 7 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 6}"]`).firstChild
                ) {
                return true;
            }
            break;
        case (piece === "queen_black" || piece === "queen_white"):
            if (
                start_id + width + 1 === target_id ||
                start_id + width * 2 + 2 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild ||
                start_id + width * 3 + 3 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild ||
                start_id + width * 4 + 4 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 + 3}"]`).firstChild ||
                start_id + width * 5 + 5 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 + 4}"]`).firstChild ||
                start_id + width * 6 + 6 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5 + 5}"]`).firstChild ||
                start_id + width * 7 + 7 === target_id && !document.querySelector(`[square-id="${start_id + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 6 + 6}"]`).firstChild ||
                
                start_id - width - 1 === target_id ||
                start_id - width * 2 - 2 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild ||
                start_id - width * 3 - 3 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild ||
                start_id - width * 4 - 4 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 - 3}"]`).firstChild ||
                start_id - width * 5 - 5 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 - 4}"]`).firstChild ||
                start_id - width * 6 - 6 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5 - 5}"]`).firstChild ||
                start_id - width * 7 - 7 === target_id && !document.querySelector(`[square-id="${start_id - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 6 - 6}"]`).firstChild ||
                
                start_id - width + 1 === target_id ||
                start_id - width * 2 + 2 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild ||
                start_id - width * 3 + 3 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild ||
                start_id - width * 4 + 4 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 + 3}"]`).firstChild ||
                start_id - width * 5 + 5 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 + 4}"]`).firstChild ||
                start_id - width * 6 + 6 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5 + 5}"]`).firstChild ||
                start_id - width * 7 + 7 === target_id && !document.querySelector(`[square-id="${start_id - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 6 + 6}"]`).firstChild ||

                start_id + width - 1 === target_id ||
                start_id + width * 2 - 2 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild ||
                start_id + width * 3 - 3 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild ||
                start_id + width * 4 - 4 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 - 3}"]`).firstChild ||
                start_id + width * 5 - 5 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 - 4}"]`).firstChild ||
                start_id + width * 6 - 6 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5 - 5}"]`).firstChild ||
                start_id + width * 7 - 7 === target_id && !document.querySelector(`[square-id="${start_id + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 6 - 6}"]`).firstChild ||
                
                start_id + width === target_id ||
                start_id + width * 2 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild ||
                start_id + width * 3 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild ||
                start_id + width * 4 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3}"]`).firstChild ||
                start_id + width * 5 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4}"]`).firstChild ||
                start_id + width * 6 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5}"]`).firstChild ||
                start_id + width * 7 === target_id && !document.querySelector(`[square-id="${start_id + width}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + width * 6}"]`).firstChild ||

                start_id - width === target_id ||
                start_id - width * 2 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild ||
                start_id - width * 3 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild ||
                start_id - width * 4 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3}"]`).firstChild ||
                start_id - width * 5 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4}"]`).firstChild ||
                start_id - width * 6 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5}"]`).firstChild ||
                start_id - width * 7 === target_id && !document.querySelector(`[square-id="${start_id - width}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id - width * 6}"]`).firstChild ||

                start_id + 1 === target_id ||
                start_id + 2 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild ||
                start_id + 3 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild ||
                start_id + 4 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild ||
                start_id + 5 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild ||
                start_id + 6 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild ||
                start_id + 7 === target_id && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 6}"]`).firstChild ||

                start_id - 1 === target_id ||
                start_id - 2 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild ||
                start_id - 3 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild ||
                start_id - 4 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 3}"]`).firstChild ||
                start_id - 5 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 4}"]`).firstChild ||
                start_id - 6 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 5}"]`).firstChild ||
                start_id - 7 === target_id && !document.querySelector(`[square-id="${start_id - 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 6}"]`).firstChild
                ) {
                    return true
            }
            break;
        case (piece === "king_black" || piece === "king_white"):
            if (
                start_id + 1 === target_id ||
                start_id - 1 === target_id ||
                start_id + width === target_id ||
                start_id - width === target_id ||
                start_id + width + 1 === target_id ||
                start_id + width - 1 === target_id ||
                start_id - width + 1 === target_id ||
                start_id - width - 1 === target_id
                ) {
                return true;
            }
            break;
    }
}

function changePlayer() {
    if(player_go === "black") {
        reverseIDs()
        player_go = "white"
        player_display.textContent = "white"
    } else {
        revertIDs()
        player_go = "black"
        player_display.textContent = "black"
    }
}

function reverseIDs() {
    const all_squares = document.querySelectorAll(".square")
    all_squares.forEach((square, i) => 
        square.setAttribute("square-id", (width * width - 1) - i))
}

function revertIDs() {
    const all_squares = document.querySelectorAll(".square")
    all_squares.forEach((square, i) => square.setAttribute("square-id", i))
}

function checkForWin() {
    const kings = Array.from(document.querySelectorAll(["#king_black", "#king_white"]))
    if (!kings.some(king => king.firstChild.classList.contains("white"))) {
        info_display.innerHTML = "Black player wins!"
        const all_squares = document.querySelectorAll(".square")
        all_squares.forEach(square => square.firstChild?.setAttribute("draggable", false))
    }
    if (!kings.some(king => king.firstChild.classList.contains("black"))) {
        info_display.innerHTML = "White player wins!"
        const all_squares = document.querySelectorAll(".square")
        all_squares.forEach(square => square.firstChild?.setAttribute("draggable", false))
    }
}
