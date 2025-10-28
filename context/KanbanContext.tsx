"use client";

import { StorageService } from "@/services/storageService";
import { IBoard, ICard, IComment, IList } from "@/types/Kanban.types";
import { INITIAL_BOARD_DATA } from "@/utils/constants";
import { generateId, reorder } from "@/utils/helper";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface KanbanContextType {
  board: IBoard;
  isLoading: boolean;
  updateBoardTitle: (title: string) => void;
  addList: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  reorderLists: (startIndex: number, endIndex: number) => void;
  addCard: (listId: string, title: string) => void;
  updateCardTitle: (listId: string, cardId: string, title: string) => void;
  deleteCard: (listId: string, cardId: string) => void;
  deleteAllCards: (listId: string) => void;
  moveCard: (
    sourceListId: string,
    destListId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  addComment: (listId: string, cardId: string, text: string) => void;
  getCard: (listId: string, cardId: string) => ICard | undefined;
  activeMenuListId: string | null;
  setActiveMenuListId: (listId: string | null) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
};

interface KanbanProviderProps {
  children: ReactNode;
}

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children }) => {
  const [board, setBoard] = useState<IBoard>(INITIAL_BOARD_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeMenuListId, setActiveMenuListId] = useState<string | null>(null);
  // Load board data on mount (client-side only)
  useEffect(() => {
    setIsClient(true);
    const loadedBoard = StorageService.getBoard();
    if (loadedBoard) {
      setBoard(loadedBoard);
    }
    setIsLoading(false);
  }, []);

  // Save board data whenever it changes (client-side only)
  useEffect(() => {
    if (isClient && !isLoading) {
      StorageService.saveBoard(board);
    }
  }, [board, isClient, isLoading]);

  // Update board title
  const updateBoardTitle = useCallback((title: string) => {
    setBoard((prev) => ({ ...prev, title }));
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

  // Update list title
  const updateListTitle = useCallback((listId: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId ? { ...list, title } : list
      ),
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

  // Add card to list
  const addCard = useCallback((listId: string, title: string) => {
    const newCard: ICard = {
      id: generateId(),
      title,
      comments: [],
    };
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? { ...list, cards: [...(list.cards || []), newCard] }
          : list
      ),
    }));
  }, []);

  // Update card title
  const updateCardTitle = useCallback(
    (listId: string, cardId: string, title: string) => {
      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                cards: (list.cards || []).map((card) =>
                  card.id === cardId ? { ...card, title } : card
                ),
              }
            : list
        ),
      }));
    },
    []
  );

  // Delete card
  const deleteCard = useCallback((listId: string, cardId: string) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: (list.cards || []).filter((card) => card.id !== cardId),
            }
          : list
      ),
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

  // Add comment to card
  const addComment = useCallback(
    (listId: string, cardId: string, text: string, author: string = "You") => {
      const newComment: IComment = {
        id: generateId(),
        text,
        author,
        createdAt: new Date().toISOString(),
      };

      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                cards: (list.cards || []).map((card) =>
                  card.id === cardId
                    ? {
                        ...card,
                        comments: [...(card.comments || []), newComment],
                      }
                    : card
                ),
              }
            : list
        ),
      }));
    },
    []
  );

  // Get card by ID
  const getCard = useCallback(
    (listId: string, cardId: string): ICard | undefined => {
      const list = board.lists.find((l) => l.id === listId);
      return list?.cards?.find((c) => c.id === cardId);
    },
    [board.lists]
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
    isLoading,
    updateBoardTitle,
    addList,
    updateListTitle,
    deleteList,
    reorderLists,
    addCard,
    updateCardTitle,
    deleteCard,
    moveCard,
    addComment,
    deleteAllCards,
    getCard,
    activeMenuListId,
    setActiveMenuListId,
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};
