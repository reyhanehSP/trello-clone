export const STORAGE_KEY = "trello-clone-data";

export const INITIAL_BOARD_DATA = {
  id: "board-1",
  title: "Demo Board",
  lists: [
    {
      id: "list-1",
      title: "Todo",
      cards: [
        {
          id: "card-1",
          title: "Create interview Kanban",
          comments: [],
        },
        {
          id: "card-2",
          title: "Review Drag & Drop",
          comments: [],
        },
      ],
    },
    {
      id: "list-2",
      title: "In Progress",
      cards: [
        {
          id: "card-3",
          title: "Set up Next.js project",
          comments: [],
        },
      ],
    },
    {
      id: "list-3",
      title: "Done",
      cards: [],
    },
  ],
};
