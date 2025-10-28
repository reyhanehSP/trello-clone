'use client'
import { IBoard } from "@/types/Kanban.types";
import { INITIAL_BOARD_DATA } from "@/utils/constants";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface KanbanContextType {
  board: IBoard;
  updateBoardTitle: (title: string) => void;
}
interface KanbanProviderProps {
  children: ReactNode;
}

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
    updateBoardTitle,
  };
  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};
