// src/components/apps/appsLogic/AppLogic.ts

type MineState = 'empty' | 'embedded' | 'explosion';

export type CellState = {
    mine: MineState;
    isOpened: boolean;
    flag: boolean;
    count: number;
};

type EventType = 'opened' | 'flagged';

type GameEvent = {
    x: number;
    y: number;
    type: EventType;
};

export const Blocks = 9;

export const Cells: CellState[][] = Array.from({ length: Blocks }, ()=>
    Array.from({ length: Blocks }, () => ({
        mine: 'empty',
        isOpened: false,
        flag: false,
        count: 0,
}))
);

let openCount = 0;

const openBy = (x: number, y: number, newBoard: CellState[][]):void => {
    for (let x2 = -1; x2 <= 1; x2++) {
        for (let y2 = -1; y2 <= 1; y2++) {
            if (x2 !== y2 && x2 !== -y2) {
                const newX = x + x2;
                const newY = y + y2;
                if (newX >= 0 && newX < Blocks && newY >= 0 && newY < Blocks && newBoard[newX][newY].mine !== 'embedded') {
                    newBoard[newX][newY].isOpened = true;
                    openCount++;
                }
            }
        }
    }
}

const setNumber = (x: number, y:number, newBoard: CellState[][]): void => {
    for (let x3 = -1; x3 <= 1; x3++) {
        for (let y3 = -1; y3 <= 1; y3++) {
            if (x3 !== 0 || y3 !== 0) {
                const newX = x + x3;
                const newY = y + y3;
                if (newX >= 0 && newX < Blocks && newY >= 0 && newY < Blocks) {
                    newBoard[newX][newY].count++;
                }
            }
        }
    }
};

export const setBoom = (board: CellState[][]): CellState[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let count = 0;

    while (count < 10) {
        const x = Math.floor(Math.random() * Blocks);
        const y = Math.floor(Math.random() * Blocks);

        if (newBoard[x][y].mine !== 'embedded') {
            newBoard[x][y].mine = 'embedded';
            setNumber(x, y, newBoard);
            count++;
        }
    }

    return newBoard;
};



export const MineSweeper = (board: CellState[][], event:GameEvent): {
    newBoard: CellState[][]; isGameOver: boolean,
} =>{
    setBoom;
    const newBoard = board.map(row => row.map(cell => ({ ...cell})));
    const cell = newBoard[event.x][event.y];

    switch (event.type) {
        case 'opened':
            if (!cell.isOpened && !cell.flag) {
                cell.isOpened = true;
                openCount++;
                openBy(event.x, event.y, newBoard);
                if (cell.mine !== 'empty') {
                    cell.mine = 'explosion';
                    return {
                        newBoard, isGameOver: true
                    }
                }
                if (openCount >= Blocks*Blocks - 10) {
                    return { newBoard, isGameOver: false };
                }
            }
            break;
        case 'flagged':
            if (!cell.isOpened) {
                cell.flag = !cell.flag;
            }
            break;
    }

    return { newBoard, isGameOver: false };
};
