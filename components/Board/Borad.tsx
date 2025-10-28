"use client";
import { useBoard } from "@/hooks/useBoards";
import styles from "./Board.module.scss";
import { Input } from "../UI/Input";
import { List } from "../List/List";
export const Board: React.FC = () => {
  const {
    board,
    title,
    setTitle,
    isEditingTitle,
    setIsEditingTitle,
    handleSaveTitle,
  } = useBoard();
  return (
    <div className={styles.boardContainer}>
      {/* Board Header */}
      <div className={styles.boardTitle}>
        {isEditingTitle ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTitle();
              if (e.key === "Escape") {
                setTitle(board.title);
                setIsEditingTitle(false);
              }
            }}
            autoFocus
            className={styles.boardTitleInput}
          />
        ) : (
          <h1 onClick={() => setIsEditingTitle(true)}>{board.title}</h1>
        )}

        {board.lists.map((list) => (
          <List
            key={list.id}
            list={list}
          />
        ))}
      </div>
    </div>
  );
};
