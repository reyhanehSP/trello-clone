"use client";
import { useBoard } from "@/hooks/useBoards";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import styles from "./Board.module.scss";
import { Input } from "../UI/Input";
import { List } from "../List/List";
import { useKanbanDragDrop } from "@/hooks/useKanbanDragDrop";

export const Board: React.FC = () => {
  const {
    board,
    title,
    setTitle,
    isEditingTitle,
    setIsEditingTitle,
    handleSaveTitle,
  } = useBoard();
  const { sensors, handleDragStart, handleDragOver, handleDragEnd } =
    useKanbanDragDrop();
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
        {/* Board Lists */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.boardLists}>
            <SortableContext
              items={board.lists.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              {board.lists.map((list) => (
                <List key={list.id} list={list} />
              ))}
            </SortableContext>
            
          </div>
        </DndContext>
      </div>
    </div>
  );
};
