// src/hooks/useBoardLogic.ts
import { useState, useEffect } from "react";
import { useKanban } from "@/context/KanbanContext";
import { useKanbanDragDrop } from "@/hooks/useKanbanDragDrop";

export const useBoard = () => {
  const {
    board,
    isLoading,
    updateBoardTitle,
    addList,
    updateListTitle,
    deleteList,
    addCard,
    updateCardTitle,
    deleteAllCards,
    addComment,
    activeMenuListId,
    setActiveMenuListId,
  } = useKanban();

  const { sensors, handleDragStart, handleDragOver, handleDragEnd } =
    useKanbanDragDrop();

  // ===== MOUNTING STATE =====
  const [isMounted, setIsMounted] = useState(false);

  // ===== BOARD TITLE EDITING STATE =====
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  // ===== LIST ADDING STATE =====
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  // ===== MOUNT EFFECT =====
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ===== SYNC TITLE WITH BOARD =====
  useEffect(() => {
    if (board) {
      setTitle(board.title);
    }
  }, [board]);

  // ===== BOARD TITLE HANDLERS =====
  const handleSaveTitle = () => {
    if (title.trim()) {
      updateBoardTitle(title.trim());
      setIsEditingTitle(false);
    } else {
      setTitle(board?.title || "");
      setIsEditingTitle(false);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(board?.title || "");
      setIsEditingTitle(false);
    }
  };

  const handleStartEditTitle = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // ===== LIST ADDING HANDLERS =====
  const handleAddList = () => {
    if (!newListTitle.trim()) return;
    addList(newListTitle.trim());
    setNewListTitle("");
    setIsAddingList(false);
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddList();
    } else if (e.key === "Escape") {
      setNewListTitle("");
      setIsAddingList(false);
    }
  };

  const handleStartAddList = () => {
    setIsAddingList(true);
  };

  const handleCancelAddList = () => {
    setNewListTitle("");
    setIsAddingList(false);
  };

  const handleNewListTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListTitle(e.target.value);
  };

  // ===== MENU HANDLERS =====
  const handleToggleMenu = (listId: string) => {
    setActiveMenuListId(activeMenuListId === listId ? null : listId);
  };

  // ===== LOADING STATE =====
  const isReady = isMounted && !isLoading && !!board;

  return {
    // Board State
    board,
    isLoading,
    isMounted,
    isReady,

    // DnD Props
    dnd: {
      sensors,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
    },

    // Board Title Editing
    titleEditing: {
      isEditing: isEditingTitle,
      title,
      startEdit: handleStartEditTitle,
      save: handleSaveTitle,
      handleChange: handleTitleChange,
      handleKeyDown: handleTitleKeyDown,
    },

    // List Adding
    listAdding: {
      isAdding: isAddingList,
      newListTitle,
      startAdd: handleStartAddList,
      add: handleAddList,
      cancel: handleCancelAddList,
      handleChange: handleNewListTitleChange,
      handleKeyDown: handleListKeyDown,
    },

    // List Actions
    listActions: {
      updateTitle: updateListTitle,
      delete: deleteList,
      deleteAllCards,
      addCard,
      updateCard: updateCardTitle,
      addComment,
      activeMenuId: activeMenuListId,
      toggleMenu: handleToggleMenu,
    },
  };
};
