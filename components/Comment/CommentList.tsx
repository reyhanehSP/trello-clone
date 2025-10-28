"use client";
import React from "react";
import styles from "./Comment.module.scss";
import { IComment } from "@/types/Kanban.types";
import { formatDate } from "@/utils/helper";

interface CommentListProps {
  comments: IComment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className={styles.emptyComments}>
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <ul className={styles.commentList}>
      {comments.map((comment) => (
        <li key={comment.id} className={styles.commentItem}>
          <div className={styles.commentHeader}>
            <span className={styles.commentDate}>
              {comment.author} . {formatDate(comment.createdAt)}
            </span>
          </div>
          <div className={styles.commentText}>{comment.text}</div>
        </li>
      ))}
    </ul>
  );
};
