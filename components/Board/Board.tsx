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
import { Button } from "../UI/Button";

export const Board: React.FC = () => {
  const {
    board,
    title,
    setTitle,
    isEditingTitle,
    setIsEditingTitle,
    handleSaveTitle,
    isAddingList,
    setIsAddingList,
    newListTitle,
    setNewListTitle,
    handleAddList,
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
            {/* Add List Button */}
            <div className={styles.addListContainer}>
              {isAddingList ? (
                <div className={styles.addListForm}>
                  <Input
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddList();
                      if (e.key === "Escape") setIsAddingList(false);
                    }}
                    placeholder="Enter list title..."
                    autoFocus
                  />
                  <div className={styles.addListActions}>
                    <Button
                      onClick={handleAddList}
                      disabled={!newListTitle.trim()}
                    >
                      Add List
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsAddingList(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  className={styles.addListBtn}
                  onClick={() => setIsAddingList(true)}
                >
                  + Add another list
                </button>
              )}
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
};
