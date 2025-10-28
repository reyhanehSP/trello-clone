"use client";
import { useKanban } from "@/context/KanbanContext";
import { IList } from "@/types/Kanban.types";
import { useCallback, useState } from "react";

export const useList = (list: IList) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title || "");
  const { updateListTitle } = useKanban();

  const handleSaveTitle = useCallback(() => {
    if (title.trim()) {
      updateListTitle(list.id, title.trim());
    } else {
      setTitle(list.title);
    }
    setIsEditingTitle(false);
  }, [title, list.id, list.title, updateListTitle]);
    
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(list.title);
      setIsEditingTitle(false);
    }
    };
    
  return {
    isEditingTitle,
    setIsEditingTitle,
    title,
    setTitle,
    handleSaveTitle,
    handleTitleKeyDown,
  };
};
