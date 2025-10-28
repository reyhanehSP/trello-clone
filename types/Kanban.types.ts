import { ReactNode } from "react";

export interface IBoard {
  id: string;
  title: string;
  lists: IList[];
  createdAt?: string;
  updatedAt?: string;
}
export interface IComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}
export interface ICard {
  id: string;
  title: string;
  description?: string;
  comments: IComment[];
  listId?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IList {
  id: string;
  title: string;
  cards: ICard[];
  position?: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface ListProps {
  list: IList;
}

export interface KanbanContextType {
  board: IBoard;
  updateBoardTitle: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
}
export interface KanbanProviderProps {
  children: ReactNode;
}

