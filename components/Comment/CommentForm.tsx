"use client";
import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import styles from "./Comment.module.scss";

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className={styles.commentTextarea}
        rows={3}
      />
      <div>
        <Button type="submit" variant="primary">
          Add Comment
        </Button>
      </div>
    </form>
  );
};
