// src/components/Card/CardModal.tsx
import React from "react";

import { CommentList } from "@/components/Comment/CommentList";
import { CommentForm } from "@/components/Comment/CommentForm";
import { useCardModal } from "@/hooks/useCardModal";
import styles from "./Card.module.scss";
import { ICard } from "@/types/Kanban.types";
import { Modal } from "../UI/Modal";

interface CardModalProps {
  card: ICard;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTitle: (title: string) => void;
  onAddComment: (text: string) => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  isOpen,
  onClose,
  onAddComment,
}) => {
  const { localComments, handleAddComment } = useCardModal({
    card,
    onAddComment,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Comments for "${card.title}"`}
    >
      <div className={styles.cardModal}>
        <div className={styles.cardModalSection}>
          <CommentList comments={localComments} />
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>
    </Modal>
  );
};
