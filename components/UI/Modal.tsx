// src/components/UI/Modal.tsx
"use client"
import React, { useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import styles from "./UI.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          {title && <h2>{title}</h2>}
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};
