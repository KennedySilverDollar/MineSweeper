// src/components/apps/App.tsx
import React, { useState } from "react";
import { type CellState, Blocks, setBoom, MineSweeper } from "./appsLogic/AppLogic.ts";

type GameState = "gameOver" | "gameClear" | "unstarted" | null;

export const App = (): React.JSX.Element => {
    const [board, setBoard] = useState<CellState[][]>(
        Array.from({ length: Blocks }, () =>
            Array.from({ length: Blocks }, () => ({
                mine: 'empty',
                isOpened: false,
                flag: false,
                count: 0,
            }))
        )
    );
    const [gameState, setGameState] = useState<GameState>("unstarted");

    const handleClick = (x: number, y: number) => {
        if (gameState !== null) return;

        const { newBoard, isGameOver } = MineSweeper(board, { x, y, type: 'opened' });
        setBoard(newBoard);

        if (isGameOver) {
            setGameState("gameOver");
        } else {
            const isAllOpened = newBoard.every(row =>
                row.every(cell => cell.mine === 'embedded' || cell.isOpened)
            );
            if (isAllOpened) {
                setGameState("gameClear");
            }
        }
    };

    const handleRightClick = (e: React.MouseEvent<HTMLDivElement>, x: number, y: number) => {
        e.preventDefault();
        if (gameState !== null) return;

        const { newBoard } = MineSweeper(board, { x, y, type: 'flagged' });
        setBoard(newBoard);
    };

    const renderCell = (cell: CellState) => {
        if (cell.isOpened || gameState === "gameOver") {
            if (cell.mine === 'explosion') return "💣";
            if (cell.mine === 'embedded') return gameState === "gameOver" ? "💣" : "";
            if (cell.count !== 0) return `${cell.count}`;
            return "";
        }
        return cell.flag ? "🚩" : "";
    };

    const getCellStyle = (cell: CellState) => {
        if (cell.isOpened) {
            if (cell.mine === 'explosion') return { background: "#ff4444" };
            return { background: "#e0e0e0" };
        }
        return { background: "#b0b0b0" };
    };

    const resetGame = () => {
        const newBoard = setBoom(
            Array.from({ length: Blocks }, () =>
                Array.from({ length: Blocks }, () => ({
                    mine: 'empty',
                    isOpened: false,
                    flag: false,
                    count: 0,
                }))
            )
        );
        setBoard(newBoard);
        setGameState(null);
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${Blocks}, 40px)`,
        gap: 2,
        background: "#666",
        padding: 4,
        borderRadius: 4,
    };

    const cellStyle = (cell: CellState) => ({
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: "bold",
        cursor: gameState !== null ? "default" : "pointer",
        userSelect: "none" as const,
        border: "1px solid #999",
        borderRadius: 2,
        transition: "background 0.1s",
        ...getCellStyle(cell),
    });

    const buttonStyle = {
        marginTop: 20,
        padding: "10px 30px",
        fontSize: 16,
        cursor: "pointer",
        borderRadius: 4,
        border: "none",
        background: "#4CAF50",
        color: "white",
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
            width: "100%",
            height: "100%",
            padding: "10px",
            boxSizing: "border-box",
            backgroundColor: "#fff",
        }}>
            <h1 style={{ color: "black" }}>💣マインスイーパー</h1>

            {gameState === "gameOver" && (
                <div style={{
                    color: "red",
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                }}>
                    ゲームオーバー
                </div>
            )}

            {gameState === "gameClear" && (
                <div style={{
                    color: "blue",
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                }}>
                    ゲームクリア！
                </div>
            )}

            <div style={gridStyle}>
                {board.map((row, x) => row.map((cell, y) => (
                    <div
                        key={`${x}-${y}`}
                        onClick={() => handleClick(x, y)}
                        onContextMenu={(e) => handleRightClick(e, x, y)}
                        style={cellStyle(cell)}
                    >
                        {renderCell(cell)}
                    </div>
                )))}
            </div>

            <button onClick={resetGame} style={buttonStyle}>
                {gameState === "unstarted" ? "スタート":"リセット"}
            </button>
        </div>
    );
};