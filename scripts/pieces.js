let verifyBordBarriers = (x, y) => (x <= 7 && x >= 0 && y <= 7 && y >= 0);

function saveKingMoves(pieceObj) {
    const pieceMoves = pieceObj.notSavingKingMoves();
    let newPieceMoves = [];
    let colorKing = pieceObj.color === 'white' ? whiteKing : blackKing;
    
    pieceMoves.forEach(move => {
        let x = pieceObj.piece === 'king' ? move[0] : colorKing.x;
        let y = pieceObj.piece === 'king' ? move[1] : colorKing.y;
        
        let lastPiece = board[move[0]][move[1]].piece;
        board[pieceObj.x][pieceObj.y].piece = null;
        board[move[0]][move[1]].piece = pieceObj;
        getAttacks();
        if (!board[x][y][`${pieceObj.opositeColor()}Attack`])
            newPieceMoves.push(move);
        board[pieceObj.x][pieceObj.y].piece = pieceObj;
        board[move[0]][move[1]].piece = lastPiece;
    });
    getAttacks();
    
    return newPieceMoves;
}

function findKingMoves(pieceObj) {
    let kingMoves = [];
    const x = pieceObj.x;
    const y = pieceObj.y;
    const directions = [[x+1, y], [x+1, y+1], [x, y+1], [x-1, y+1], [x-1, y], [x-1, y-1], [x, y-1], [x+1, y-1]];

    directions.forEach(direction => {
        if (verifyBordBarriers(direction[0], direction[1])
        && !board[direction[0]][direction[1]][`${pieceObj.opositeColor()}Attack`]
        && (board[direction[0]][direction[1]].piece === null
        || board[direction[0]][direction[1]].piece.color === pieceObj.opositeColor()))
            kingMoves.push(direction);
    });
    return kingMoves;
}

function findShortMoves(pieceObj, directions) {
    let possibleMoves = [];
    
    directions.forEach(direction => {
        if (verifyBordBarriers(direction[0], direction[1]) && (board[direction[0]][direction[1]].piece === null || board[direction[0]][direction[1]].piece.color != pieceObj.color))
            possibleMoves.push(direction);
    });
    
    return possibleMoves;
}

function findShortAttacks(directions) {
    let attacks = [];
    
    directions.forEach(direction => {
        if (verifyBordBarriers(direction[0], direction[1]))
            attacks.push(direction);
    });
    
    return attacks;
}

function findLongMoves(pieceObj, directions) {
    let possibleMoves = [];
    
    directions.forEach(direction => {
        let x = direction[0] + pieceObj.x;
        let y = direction[1] + pieceObj.y;
        for ( ; x >= 0 && y >= 0; x += direction[0], y += direction[1])
            if (verifyBordBarriers(x, y)) {
                if (board[x][y].piece === null)
                    possibleMoves.push([x, y]);
                else if (board[x][y].piece.color != pieceObj.color) {
                    possibleMoves.push([x, y]);
                    break;
                } else break;
            } else break;
    });
    
    return possibleMoves;
}

function findLongAttacks(pieceObj, directions) {
    let attaks = [];
    
    directions.forEach(direction => {
        let x = direction[0] + pieceObj.x;
        let y = direction[1] + pieceObj.y;
        for ( ; x >= 0 && y >= 0; x += direction[0], y += direction[1])
            if (verifyBordBarriers(x, y)) {
                if (board[x][y].piece === null)
                    attaks.push([x, y]);
                else {
                    attaks.push([x, y]);
                    break;
                }
            } else break;
    });
    
    return attaks;
}

let king = {
    piece: 'king',
    color: 'white',
    x: 4,
    y: 7,
    moved: false,
    opositeColor() {
        return this.color === 'white' ? 'black' : 'white';
    },

    checked() {
        return board[this.x][this.y][`${this.opositeColor()}Attack`];
    },

    notSavingKingMoves() {
        return findKingMoves(this);
    },

    moves() {
        return saveKingMoves(this);
    },

    attacks() {
        const x = this.x;
        const y = this.y;

        return findShortAttacks([[x+1, y], [x+1, y+1], [x, y+1], [x-1, y+1], [x-1, y], [x-1, y-1], [x, y-1], [x+1, y-1]]);
    }
};

let knight = {
    piece: 'knight',
    color: 'white',
    x: 1,
    y: 7,
    opositeColor() {
        return this.color === 'white' ? 'black' : 'white';
    },

    notSavingKingMoves() {
        const x = this.x;
        const y = this.y;

        let knightMoves = findShortMoves(this, [[x-1, y-2], [x+1, y-2], [x+2, y-1], [x+2, y+1], [x+1, y+2], [x-1, y+2], [x-2, y+1], [x-2, y-1]]);
        return knightMoves;
    },

    moves() {
        return saveKingMoves(this);
    },
    
    attacks() {
        const x = this.x;
        const y = this.y;

        return findShortAttacks([[x-1, y-2], [x+1, y-2], [x+2, y-1], [x+2, y+1], [x+1, y+2], [x-1, y+2], [x-2, y+1], [x-2, y-1]]);
    }
};

let pawn = {
    piece: 'pawn',
    color: 'white',
    x: 0,
    y: 6,
    moved: false,
    opositeColor() {
        return this.color === 'white' ? 'black' : 'white';
    },

    moveDirection() {
        return this.color === 'white' ? -1 : 1;
    },

    notSavingKingMoves() {
        let directionsToMove = [[this.x, this.y + this.moveDirection()], [this.x, this.y + 2 * this.moveDirection()]];
        let directionsToTake = [[this.x-1, this.y + this.moveDirection()], [this.x+1, this.y + this.moveDirection()]];

        let pawnMoves = [];

        if (verifyBordBarriers(directionsToMove[0][0], directionsToMove[0][1])
        && board[directionsToMove[0][0]][directionsToMove[0][1]].piece === null)
            pawnMoves.push(directionsToMove[0]);
        if (!this.moved)
            if (verifyBordBarriers(directionsToMove[1][0], directionsToMove[1][1])
            && board[directionsToMove[1][0]][directionsToMove[1][1]].piece === null
            && board[directionsToMove[1][0]][directionsToMove[1][1] - this.moveDirection()].piece === null)
                pawnMoves.push(directionsToMove[1]);

        directionsToTake.forEach(direction => {
            if (verifyBordBarriers(direction[0], direction[1])
            && (board[direction[0]][direction[1]].piece != null
            && board[direction[0]][direction[1]].piece.color != this.color))
                pawnMoves.push(direction);
        });

        return pawnMoves;
    },

    moves() {
        return saveKingMoves(this);
    },

    attacks() {
        return findShortAttacks([[this.x-1, this.y + this.moveDirection()], [this.x+1, this.y + this.moveDirection()]]);
    }
};

let bishop = {
    piece: 'bishop',
    color: 'white',
    x: 2,
    y: 7,
    opositeColor() {
        return this.color === 'white' ? 'black' : 'white';
    },

    notSavingKingMoves() {
        let bishopMoves = findLongMoves(this, [[1, 1], [-1, -1], [1, -1], [-1, 1]]);
        return bishopMoves;
    },

    moves() {
        return saveKingMoves(this);
    },

    attacks() {
        return findLongAttacks(this, [[1, 1], [-1, -1], [1, -1], [-1, 1]]);
    }
};

let rook = {
    piece: 'rook',
    color: 'white',
    x: 0,
    y: 7,
    moved: false,
    opositeColor() {
        return this.color === 'white' ? 'black' : 'white';
    },

    notSavingKingMoves() {
        let rookMoves = findLongMoves(this, [[1, 0], [0, 1], [-1, 0], [0, -1]]);
        return rookMoves;
    },

    moves() {
        return saveKingMoves(this);
    },

    attacks() {
        return findLongAttacks(this, [[1, 0], [0, 1], [-1, 0], [0, -1]]);
    }
};

let queen = {
    piece: 'queen',
    color: 'white',
    x: 3,
    y: 7,
    opositeColor() {
        return this.color === 'white' ? 'black' : 'white';
    },

    notSavingKingMoves() {
        let queenMoves = findLongMoves(this, [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]);
        return queenMoves;
    },

    moves() {
        return saveKingMoves(this);
    },

    attacks() {
        return findLongAttacks(this, [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]);
    }
};