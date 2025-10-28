"use client";
import { IBoard, KanbanContextType, KanbanProviderProps } from "@/types/Kanban.types";
import { INITIAL_BOARD_DATA } from "@/utils/constants";
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";


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

  const value: KanbanContextType = {
    board,
    updateBoardTitle,
    updateListTitle,
  };
  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};
