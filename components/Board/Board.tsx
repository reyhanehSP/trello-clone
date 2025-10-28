// src/components/Board/Board.tsx
"use client";
import React from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { List } from "@/components/List/List";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import styles from "./Board.module.scss";
import { useBoard } from "@/hooks/useBoards";

export const Board: React.FC = () => {
  const { board, isReady, dnd, titleEditing, listAdding, listActions } =
    useBoard();

  // ===== LOADING STATE =====
  if (!isReady) {
    return (
      <div className={styles.boardContainer}>
        <div className={styles.boardHeader}>
          <div className={styles.loadingTitle}>Loading board...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.boardContainer}>
      {/* ===== BOARD HEADER ===== */}
      <div className={styles.boardTitle}>
        {titleEditing.isEditing ? (
          <Input
            value={titleEditing.title}
            onChange={titleEditing.handleChange}
            onBlur={titleEditing.save}
            onKeyDown={titleEditing.handleKeyDown}
            autoFocus
            className={styles.boardTitleInput}
          />
        ) : (
         
            <h1 onClick={titleEditing.startEdit}>{board.title}</h1>
          
        )}
      </div>

      {/* ===== BOARD LISTS (DND) ===== */}
      <DndContext
        sensors={dnd.sensors}
        collisionDetection={closestCorners}
        onDragStart={dnd.handleDragStart}
        onDragOver={dnd.handleDragOver}
        onDragEnd={dnd.handleDragEnd}
      >
        <div className={styles.boardLists}>
          <SortableContext
            items={board.lists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists.map((list) => (
              <List
                key={list.id}
                list={list}
                onUpdateTitle={(t) => listActions.updateTitle(list.id, t)}
                onDelete={() => listActions.delete(list.id)}
                onAddCard={(cardTitle) =>
                  listActions.addCard(list.id, cardTitle)
                }
                onUpdateCard={(cardId, t) =>
                  listActions.updateCard(list.id, cardId, t)
                }
                deleteAllCards={() => listActions.deleteAllCards(list.id)}
                showActionsMenu={listActions.activeMenuId === list.id}
                onToggleActionsMenu={() => listActions.toggleMenu(list.id)}
                onAddComment={(cardId, txt) =>
                  listActions.addComment(list.id, cardId, txt)
                }
              />
            ))}
          </SortableContext>

          {/* ===== ADD LIST SECTION ===== */}
          <div className={styles.addListContainer}>
            {listAdding.isAdding ? (
              <div className={styles.addListForm}>
                <Input
                  value={listAdding.newListTitle}
                  onChange={listAdding.handleChange}
                  onKeyDown={listAdding.handleKeyDown}
                  placeholder="Enter list title..."
                  autoFocus
                />
                <div className={styles.addListActions}>
                  <Button onClick={listAdding.add}>Add List</Button>
                  <Button variant="secondary" className={styles.cancelButton} onClick={listAdding.cancel}>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="times"
                      className="svg-inline--fa fa-times fa-w-11 fa-null fa-rotate-null fa-pull-null "
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 352 512"
                    >
                      <path
                        fill="currentColor"
                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </div>
            ) : (
              <button
                className={styles.addListBtn}
                onClick={listAdding.startAdd}
              >
                + Add another list
              </button>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
};
