import { useState } from "react";
import { useKanban } from "@/context/KanbanContext";

export const useBoard = () => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const { board, updateBoardTitle } = useKanban();
  const handleSaveTitle = () => {
    if (title.trim()) updateBoardTitle(title.trim());
    setIsEditingTitle(false);
  };

  return {
    board,
    title,
    setTitle,
    isEditingTitle,
    setIsEditingTitle,
    handleSaveTitle,
  };
};
