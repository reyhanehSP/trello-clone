// src/hooks/useCardModal.ts
import { ICard, IComment } from "@/types/Kanban.types";
import { useState, useEffect } from "react";

interface UseCardModalProps {
  card: ICard;
  onAddComment: (text: string) => void;
}

export const useCardModal = ({ card, onAddComment }: UseCardModalProps) => {
  // ===== LOCAL COMMENTS STATE =====
  const [localComments, setLocalComments] = useState<IComment[]>(
    card.comments || []
  );

  // ===== SYNC WITH CARD PROP =====
  useEffect(() => {
    setLocalComments(card.comments || []);
  }, [card.comments]);

  // ===== ADD COMMENT HANDLER =====
  const handleAddComment = (text: string) => {
    // Optimistic Update: ابتدا UI را فوراً به‌روز کن
    const optimisticComment: IComment = {
      id: `temp-${Date.now()}`,
      text,
      author: "You",
      createdAt: new Date().toISOString(),
    };

    setLocalComments((prev) => [...prev, optimisticComment]);

    // سپس تغییرات را به Context ارسال کن
    onAddComment(text);
  };

  return {
    localComments,
    handleAddComment,
  };
};
