"use client";
import { ListProps } from "@/types/Kanban.types";
import { Input } from "../UI/Input";
import styles from "./List.module.scss";
import { useList } from "@/hooks/useList";

export const List: React.FC<ListProps> = ({ list }) => {
  const {
      title,
      cards,
      menuRef,
    setTitle,
    handleTitleKeyDown,
    handleSaveTitle,
    onToggleActionsMenu,
    menuState,
    setMenuState,
    handleDeleteList,
      handleBackToMenu,
    activeMenuListId,
    handleDeleteAllCards,
  } = useList(list);

  const renderMenuContent = () => {
    switch (menuState) {
      case "Delete All Cards":
        return (
          <>
            <div className={styles.confirmHeader}>
              <button
                className={styles.backButton}
                onClick={handleBackToMenu}
                type="button"
              >
                ←
              </button>
              <span className={styles.confirmTitle}>List actions</span>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setMenuState("normal");
                  onToggleActionsMenu();
                }}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className={styles.confirmContent}>
              <p>
                All actions will be removed from the activity feed and you won't
                be able to re-open the list. There is no undo.
              </p>
            </div>
            <button
              className={styles.deleteConfirmButton}
              onClick={handleDeleteList}
              type="button"
            >
              Delete list
            </button>
          </>
        );

      case "Delete List":
        return (
          <>
            <div className={styles.confirmHeader}>
              <button
                className={styles.backButton}
                onClick={handleBackToMenu}
                type="button"
              >
                ←
              </button>
              <span className={styles.confirmTitle}>Delete List</span>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setMenuState("normal");
                  onToggleActionsMenu();
                }}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className={styles.confirmContent}>
              <p>
                This will permanently delete all {cards.length} card
                {cards.length !== 1 ? "s" : ""} from this list. There is no
                undo.
              </p>
            </div>
            <button
              className={styles.deleteConfirmButton}
              onClick={handleDeleteAllCards}
              type="button"
            >
              Delete all cards
            </button>
          </>
        );

      default: // 'normal'
        return (
          <>
            <div className={styles.actionTitle}>
              <button></button>
              <h3>List Actions</h3>
              <button onClick={() => onToggleActionsMenu()}>×</button>
            </div>
            <button
              className={styles.actionsMenuItem}
              onClick={() => setMenuState("Delete List")}
              type="button"
            >
              Delete List
            </button>

            <button
              className={styles.actionsMenuItem}
              onClick={() => setMenuState("Delete All Cards")}
              type="button"
              disabled={cards.length === 0}
            >
              Delete All Cards
            </button>
          </>
        );
    }
  };

  return (
    <div className={styles.list}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSaveTitle}
        onKeyDown={handleTitleKeyDown}
        autoFocus
        className={styles.listTitleInput}
      />
      <button
        className={styles.listDeleteBtn}
        onClick={onToggleActionsMenu}
        title="Delete list"
        type="button"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="ellipsis-h"
          className="svg-inline--fa fa-ellipsis-h fa-w-16 fa-null fa-rotate-null fa-pull-null "
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"
          ></path>
        </svg>
        {(activeMenuListId === list.id) && (
          <div ref={menuRef} className={styles.actionsMenu}>
            {renderMenuContent()}
          </div>
        )}
      </button>
    </div>
  );
};
