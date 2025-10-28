import { IBoard } from "@/types/Kanban.types";
import { STORAGE_KEY, INITIAL_BOARD_DATA } from "@/utils/constants";

export class StorageService {
  /**
   * Get board data from localStorage
   */
  static getBoard(): IBoard {
    if (typeof window === "undefined") {
      return INITIAL_BOARD_DATA;
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return INITIAL_BOARD_DATA;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return INITIAL_BOARD_DATA;
    }
  }

  /**
   * Save board data to localStorage
   */
  static saveBoard(board: IBoard): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }

  /**
   * Clear all data from localStorage
   */
  static clearBoard(): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}
