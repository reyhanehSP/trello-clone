// src/hooks/useListLogic.ts
import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useClickOutside } from "@/hooks/useClickOutside";
import { ICard, IList } from "@/types/Kanban.types";

type MenuState = "normal" | "Delete List" | "Delete All Cards";

interface UseListLogicProps {
  list: IList;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
  onAddCard: (title: string) => void;
  deleteAllCards: (listId: string) => void;
  showActionsMenu: boolean;
  onToggleActionsMenu: () => void;
}

export const useList= ({
  list,
  onUpdateTitle,
  onDelete,
  onAddCard,
  deleteAllCards,
  showActionsMenu,
  onToggleActionsMenu,
}: UseListLogicProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // ===== DND-KIT SORTABLE =====
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // ===== TITLE EDITING STATE =====
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title || "");

  // ===== CARD ADDING STATE =====
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  // ===== CARD MODAL STATE =====
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);

  // ===== MENU STATE =====
  const [menuState, setMenuState] = useState<MenuState>("normal");

  // ===== SYNC TITLE WITH PROP =====
  useEffect(() => {
    setTitle(list.title || "");
  }, [list.title]);

  // ===== CLICK OUTSIDE HANDLER =====
  useClickOutside(menuRef, () => {
    if (showActionsMenu) {
      onToggleActionsMenu();
    }
  });

  // ===== TITLE HANDLERS =====
  const handleSaveTitle = () => {
    if (title.trim()) {
      onUpdateTitle(title.trim());
      setIsEditingTitle(false);
    } else {
      setTitle(list.title);
      setIsEditingTitle(false);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(list.title);
      setIsEditingTitle(false);
    }
  };

  const handleStartEditTitle = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // ===== CARD HANDLERS =====
  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(newCardTitle.trim());
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCard();
    } else if (e.key === "Escape") {
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleStartAddCard = () => {
    setIsAddingCard(true);
  };

  const handleCancelAddCard = () => {
    setNewCardTitle("");
    setIsAddingCard(false);
  };

  const handleNewCardTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCardTitle(e.target.value);
  };

  // ===== MENU HANDLERS =====
  const handleDeleteList = () => {
    onDelete();
    setMenuState("normal");
    onToggleActionsMenu();
  };

  const handleDeleteAllCards = () => {
    deleteAllCards(list.id);
    setMenuState("normal");
    onToggleActionsMenu();
  };

  const handleBackToMenu = () => {
    setMenuState("normal");
  };

  const handleCloseMenu = () => {
    setMenuState("normal");
    onToggleActionsMenu();
  };

  // ===== CARD MODAL HANDLERS =====
  const handleOpenCardModal = (card: ICard) => {
    setSelectedCard(card);
  };

  const handleCardTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewCardTitle(e.target.value);
  };

  const handleCloseCardModal = () => {
    setSelectedCard(null);
  };

  const handleUpdateSelectedCard = (newTitle: string) => {
    if (selectedCard) {
      setSelectedCard({ ...selectedCard, title: newTitle });
    }
  };

  return {
    // DND Props
    dragProps: {
      ref: setNodeRef,
      style,
      attributes,
      listeners,
      isDragging,
    },
    // Title Editing
    titleEditing: {
      isEditing: isEditingTitle,
      title,
      startEdit: handleStartEditTitle,
      save: handleSaveTitle,
      handleChange: handleTitleChange,
      handleKeyDown: handleTitleKeyDown,
    },
    // Card Adding
    cardAdding: {
      isAdding: isAddingCard,
      newCardTitle,
      startAdd: handleStartAddCard,
      add: handleAddCard,
      cancel: handleCancelAddCard,
      handleChange: handleCardTitleChange,
      handleKeyDown: handleCardKeyDown,
    },
    // Menu
    menu: {
      ref: menuRef,
      state: menuState,
      setState: setMenuState,
      handleDeleteList,
      handleDeleteAllCards,
      handleBackToMenu,
      handleCloseMenu,
    },
    // Card Modal
    cardModal: {
      selectedCard,
      openModal: handleOpenCardModal,
      closeModal: handleCloseCardModal,
      updateSelectedCard: handleUpdateSelectedCard,
    },
  };
};
