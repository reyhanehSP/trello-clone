"use client";
import {
  IBoard,
  IList,
  KanbanContextType,
  KanbanProviderProps,
} from "@/types/Kanban.types";
import { INITIAL_BOARD_DATA } from "@/utils/constants";
import { reorder, generateId } from "@/utils/helper";
import { createContext, useCallback, useContext, useState } from "react";

// create KanbanContext
const KanbanContext = createContext<KanbanContextType | undefined>(undefined);
export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
};

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children }) => {
  const [board, setBoard] = useState<IBoard>(INITIAL_BOARD_DATA);
  const [activeMenuListId, setActiveMenuListId] = useState<string | null>(null);
  // Update board title
  const updateBoardTitle = useCallback((title: string) => {
    setBoard((prev) => ({ ...prev, title }));
  }, []);

  // Update list title
  const updateListTitle = useCallback((listId: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId ? { ...list, title } : list
      ),
    }));
  }, []);
  // Add new list
  const addList = useCallback((title: string) => {
    const newList: IList = {
      id: generateId(),
      title,
      cards: [],
    };
    setBoard((prev) => ({
      ...prev,
      lists: [...prev.lists, newList],
    }));
  }, []);

  // Delete list
  const deleteList = useCallback((listId: string) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.filter((list) => list.id !== listId),
    }));
  }, []);
  // Reorder lists
  const reorderLists = useCallback((startIndex: number, endIndex: number) => {
    setBoard((prev) => ({
      ...prev,
      lists: reorder(prev.lists, startIndex, endIndex),
    }));
  }, []);

  // Move card within same list or between lists
  const moveCard = useCallback(
    (
      sourceListId: string,
      destinationListId: string,
      sourceIndex: number,
      destinationIndex: number
    ) => {
      setBoard((prev) => {
        const newLists = [...prev.lists];
        const sourceListIndex = newLists.findIndex(
          (list) => list.id === sourceListId
        );
        const destListIndex = newLists.findIndex(
          (list) => list.id === destinationListId
        );

        if (sourceListIndex === -1 || destListIndex === -1) return prev;

        // Ensure cards arrays exist
        if (!newLists[sourceListIndex].cards) {
          newLists[sourceListIndex].cards = [];
        }
        if (!newLists[destListIndex].cards) {
          newLists[destListIndex].cards = [];
        }

        // Moving within the same list
        if (sourceListId === destinationListId) {
          const list = newLists[sourceListIndex];
          const reorderedCards = reorder(
            list.cards || [],
            sourceIndex,
            destinationIndex
          );
          newLists[sourceListIndex] = { ...list, cards: reorderedCards };
        } else {
          // Moving between different lists
          const sourceList = newLists[sourceListIndex];
          const destList = newLists[destListIndex];
          const sourceCards = [...(sourceList.cards || [])];
          const destCards = [...(destList.cards || [])];

          const [movedCard] = sourceCards.splice(sourceIndex, 1);
          destCards.splice(destinationIndex, 0, movedCard);

          newLists[sourceListIndex] = { ...sourceList, cards: sourceCards };
          newLists[destListIndex] = { ...destList, cards: destCards };
        }

        return { ...prev, lists: newLists };
      });
    },
    []
  );
  const deleteAllCards = useCallback((listId: string) => {
    setBoard((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId ? { ...list, cards: [] } : list
        ),
      };
    });
  }, []);
  const value: KanbanContextType = {
    board,
    addList,
    moveCard,
    deleteList,
    reorderLists,
    deleteAllCards,
    updateBoardTitle,
    updateListTitle,
    activeMenuListId,
    setActiveMenuListId,
  };
  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};
