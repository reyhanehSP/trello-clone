// src/hooks/useCardLogic.ts
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ICard } from "@/types/Kanban.types";


interface UseCardLogicProps {
  card: ICard;
  onUpdateTitle: (title: string) => void;
}

export const useCardLogic = ({ card, onUpdateTitle }: UseCardLogicProps) => {
  // ===== DND-KIT SORTABLE =====
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // ===== EDITING STATE =====
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  // ===== HANDLERS =====
  const handleSave = () => {
    if (title.trim()) {
      onUpdateTitle(title.trim());
      setIsEditing(false);
    } else {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return {
    // DND Props
    dragProps: {
      ref: setNodeRef,
      style,
      attributes,
      listeners,
      isDragging,
    },
    // Editing State
    editing: {
      isEditing,
      title,
      setTitle,
      startEdit: handleStartEdit,
      save: handleSave,
      handleTitleChange,
      handleKeyDown,
    },
  };
};
