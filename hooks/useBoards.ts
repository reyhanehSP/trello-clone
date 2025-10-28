import { useState } from "react";
import { useKanban } from "@/context/KanbanContext";

export const useBoard = () => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const { board, addList, updateBoardTitle } = useKanban();
  const handleSaveTitle = () => {
    if (title.trim()) updateBoardTitle(title.trim());
    setIsEditingTitle(false);
  };
  const handleAddList = () => {
    if (!newListTitle.trim()) return;
    addList(newListTitle.trim());
    setNewListTitle("");
    setIsAddingList(false);
  };
  return {
    board,
    title,
    setTitle,
    isEditingTitle,
    setIsEditingTitle,
    handleSaveTitle,
    isAddingList,
    setIsAddingList,
    newListTitle,
    setNewListTitle,
    handleAddList,
  };
};
