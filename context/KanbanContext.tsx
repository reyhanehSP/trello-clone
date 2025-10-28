'use client'
import { IBoard, KanbanContextType, KanbanProviderProps } from "@/types/Kanban.types";
import { INITIAL_BOARD_DATA } from "@/utils/constants";
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";



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

  const value: KanbanContextType = {
    board,
      moveCard,
    reorderLists
    updateBoardTitle,
  };
  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};
