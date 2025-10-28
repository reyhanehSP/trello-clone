"use client";
import { useKanban } from "@/context/KanbanContext";
import { ICard, IList } from "@/types/Kanban.types";
import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "./useClickOutside";

type MenuState = "normal" | "Delete List" | "Delete All Cards";

export const useList = (list: IList) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title || "");
  const cards: ICard[] = list.cards || [];
  const cardIds = cards.map((card) => card?.id || "").filter(Boolean);

  const menuRef = useRef<HTMLDivElement>(null);
  const {
    updateListTitle,
    activeMenuListId,
    setActiveMenuListId,
    deleteList,
    deleteAllCards,
  } = useKanban();
  const [menuState, setMenuState] = useState<MenuState>("normal");
  const onToggleActionsMenu = useCallback(() => {
    setActiveMenuListId(activeMenuListId === list.id ? null : list.id);
  }, [activeMenuListId, list.id]);

  useClickOutside(menuRef, () => {
    if (activeMenuListId === list.id) {
      setActiveMenuListId(activeMenuListId === list.id ? null : list.id);
    }
  });
  const handleDeleteList = () => {
    deleteList(list.id);
    setMenuState("normal");
    onToggleActionsMenu();
  };
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
  const handleBackToMenu = () => {
    setMenuState("normal");
  };
  const handleDeleteAllCards = () => {
    deleteAllCards(list.id);
    setMenuState("normal");
    onToggleActionsMenu();
  };
  return {
    cards,
    menuRef,
    isEditingTitle,
    setIsEditingTitle,
    title,
    setTitle,
    menuState,
    handleBackToMenu,
    handleDeleteAllCards,
    setMenuState,
    handleDeleteList,
    handleSaveTitle,
    handleTitleKeyDown,
    activeMenuListId,
    onToggleActionsMenu,
  };
};
