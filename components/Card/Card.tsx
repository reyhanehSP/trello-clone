// src/components/Card/Card.tsx
"use client";

import { Input } from "@/components/UI/Input";
import { useCardLogic } from "@/hooks/useCard";
import styles from "./Card.module.scss";
import { ICard } from "@/types/Kanban.types";

interface CardProps {
  card: ICard;
  listId: string;
  onUpdateTitle: (title: string) => void;
  onOpenModal: () => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  onUpdateTitle,
  onOpenModal,
}) => {
  const { dragProps, editing } = useCardLogic({ card, onUpdateTitle });

  return (
    <div
      ref={dragProps.ref}
      style={dragProps.style}
      className={styles.card}
      {...dragProps.attributes}
      {...dragProps.listeners}
      data-dragging={dragProps.isDragging ? "true" : "false"}
    >
      {editing.isEditing ? (
        <Input
          value={editing.title}
          onChange={editing.handleTitleChange}
          onBlur={editing.save}
          onKeyDown={editing.handleKeyDown}
          autoFocus
          className={styles.cardInput}
        />
      ) : (
        <>
          <div className={styles.cardContent} onClick={editing.startEdit}>
            <p className={styles.cardTitle}>{card.title}</p>
          </div>
          <div className={styles.cardActions}>
            <button
              className={styles.cardActionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal();
              }}
              title="Open details"
            >
              comment {card.comments.length}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
